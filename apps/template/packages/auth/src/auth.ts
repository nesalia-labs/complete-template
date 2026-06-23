import { betterAuth } from 'better-auth'
import type { Auth } from 'better-auth'
import { drizzleAdapter } from '@better-auth/drizzle-adapter'
import { organization, twoFactor, magicLink, emailOTP, admin } from 'better-auth/plugins'
import { passkey } from '@better-auth/passkey'
import { apiKey } from '@better-auth/api-key'
import { createClient, schema } from '@deessejs/database'
import { sendMail } from '@deessejs/mail'

import { ac, owner, admin as adminRole, member, billing } from './access-control'
import { hashToken, bucket } from './utils/idempotency'

/**
 * The configured Better Auth instance. Mounted on Hono at `/api/auth/*`
 * by `packages/api`. Server-side calls (`auth.api.getSession(...)`,
 * `auth.api.verifyApiKey(...)`) are consumed by the auth-context
 * middleware in `packages/api`.
 *
 * @see docs/internal/architecture/11-packages/auth/setup.md
 * @see docs/internal/architecture/11-packages/auth/plugins.md
 * @see docs/internal/architecture/11-packages/auth/integrations.md
 *
 * @remarks
 * The env vars below are required for `auth.ts` to load. The Better Auth
 * CLI (`pnpm auth:generate`) loads this file to read the options — set
 * placeholder values for the CLI run. Production needs real values.
 *
 * `db` is created at module load via `createClient()` from
 * `@deessejs/database`. The drizzleAdapter wraps it for Better Auth. We
 * pass `usePlural: true` (our naming convention).
 *
 * The explicit `Auth` type annotation prevents TS from leaking the
 * inferred type (which references `@simplewebauthn/server`'s internal
 * paths via the passkey plugin). Without it, downstream consumers get
 * non-portable types.
 *
 * Mail wiring: every `send*` hook calls `void sendMail(...)` from
 * `@deessejs/mail`. We never `await` the send — Better Auth's docs
 * explicitly warn about timing attacks. The Resend transport (or the
 * `console` fallback when `RESEND_API_KEY` is unset) handles the actual
 * delivery. Idempotency keys are derived per hook so retries don't
 * produce duplicate sends.
 */
const db = createClient()

const _auth = betterAuth({
  appName: 'DeesseJS',
  basePath: '/api/auth',
  // Required when crossSubDomainCookies is enabled. The CLI and dev mode
  // use a local default; production overrides via BETTER_AUTH_URL env.
  baseURL: process.env.BETTER_AUTH_URL ?? 'http://localhost:3000',

  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
    usePlural: true,
  }),

  // === Email & password ===
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      void sendMail({
        to: user.email,
        template: 'resetPassword',
        context: {
          url,
          name: user.name,
          expiresInMinutes: 60,
        },
        idempotencyKey: `reset:${user.id}:${hashToken(url)}`,
      })
    },
  },

  // === Email verification ===
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      void sendMail({
        to: user.email,
        template: 'verifyEmail',
        context: {
          url,
          name: user.name,
          expiresInHours: 24,
        },
        idempotencyKey: `verify:${user.id}:${bucket(Date.now(), '1h')}`,
      })
    },
    autoSignInAfterVerification: true,
  },

  // === Magic link (passwordless sign-in, spec 1.2) ===
  magicLink: {
    enabled: true,
    sendMagicLink: async ({ email, url }: { email: string; url: string }) => {
      void sendMail({
        to: email,
        template: 'magicLink',
        context: {
          url,
          expiresInMinutes: 10,
        },
        idempotencyKey: `magiclink:${email}:${bucket(Date.now(), '5min')}`,
      })
    },
    expiresIn: 60 * 10, // 10 minutes
  },

  // === Email OTP (verification + password reset recovery, spec 1.14, 1.15) ===
  emailOTP: {
    enabled: true,
    otpLength: 6,
    expiresIn: 60 * 10,
    sendVerificationOTP: async ({
      email,
      otp,
      type,
    }: {
      email: string
      otp: string
      type: 'sign-in' | 'email-verification' | 'forget-password'
    }) => {
      // Map Better Auth's `type` to the right template id.
      const templateId = (
        {
          'sign-in': 'otp-sign-in',
          'email-verification': 'otp-email-verification',
          'forget-password': 'otp-forgot-password',
        } as const
      )[type]

      void sendMail({
        to: email,
        template: templateId,
        context: {
          otp,
          expiresInMinutes: 10,
        },
        idempotencyKey: `otp:${email}:${type}:${bucket(Date.now(), '1min')}`,
      })
    },
  },

  // === OAuth providers ===
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    // Microsoft and Apple (spec 1.5, 1.6) shipped as config templates — off by default.
    // The buyer enables them in the onboarding wizard by setting the env vars
    // and uncommenting the entries here.
    // microsoft: { clientId: process.env.MICROSOFT_CLIENT_ID as string, clientSecret: process.env.MICROSOFT_CLIENT_SECRET as string },
    // apple: { clientId: process.env.APPLE_CLIENT_ID as string, clientSecret: process.env.APPLE_CLIENT_SECRET as string },
  },

  // === Sessions (spec 1.11) ===
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // refresh once per day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5-minute in-memory cache, refreshed via the integration doc's asResponse workaround
    },
    storeSessionInDatabase: true, // required for revocation
  },

  // === Cookies (spec 1.11 cross-subdomain) ===
  advanced: {
    crossSubDomainCookies: {
      enabled: true,
      domains: [process.env.PARENT_DOMAIN ?? 'localhost'],
    },
    defaultCookieAttributes: {
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
    },
    useSecureCookies: process.env.NODE_ENV === 'production',
  },

  // === Rate limiting on auth endpoints (spec 1.23) ===
  rateLimit: {
    enabled: true,
    storage: 'secondary-storage', // backed by Upstash Redis via secondaryStorage
    customRules: {
      '/sign-in/email': { window: 60, max: 5 },
      '/sign-up/email': { window: 60, max: 3 },
      '/two-factor/verify': { window: 60, max: 5 },
      '/forget-password': { window: 60, max: 3 },
    },
  },

  // === Secondary storage (Upstash Redis) ===
  // PLACEHOLDER — real wiring with @upstash/redis comes when we add the
  // `packages/storage` integration. The CLI doesn't need this to work;
  // it's only used at runtime.
  secondaryStorage: {
    get: async () => null,
    set: async () => {},
    delete: async () => {},
  },

  // === Trust the app origin (for CORS) ===
  trustedOrigins: [process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'],

  // === Plugins ===
  plugins: [
    // Multi-tenant orgs + RBAC (spec 2.1-2.20)
    organization({
      ac,
      roles: { owner, admin: adminRole, member, billing },
      allowUserToCreateOrganization: true,
    }),

    // Admin + impersonation (spec 2.19)
    admin({
      defaultRole: 'member',
      adminRoles: ['admin'],
    }),

    // API keys (spec 7.5, 7.6) — bridge to /api/v1
    apiKey({
      defaultPrefix: 'sk_live_',
      enableMetadata: true,
      enableSessionForAPIKeys: true,
      apiKeyHeaders: ['x-api-key', 'authorization'],
      rateLimit: { enabled: true, timeWindow: 60_000, maxRequests: 100 },
    }),

    // 2FA TOTP (spec 1.8)
    twoFactor({ issuer: 'DeesseJS' }),

    // Passkeys WebAuthn (spec 1.9)
    passkey({
      rpName: 'DeesseJS',
      rpID: process.env.PARENT_DOMAIN ?? 'localhost',
      origin: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
    }),
  ],
})

/**
 * Inferred types. Consumers (`packages/api`) import these for their
 * Hono context, AuthContext, etc.
 *
 * @remarks
 * We cast `auth` to `Auth` (the public instance type from better-auth) to
 * avoid the inferred type leaking internal paths from the passkey plugin's
 * transitive deps (`@simplewebauthn/server`). The cast is safe because the
 * runtime value IS an Auth instance.
 */
export const auth = _auth as unknown as Auth
export type Session = Auth['$Infer']['Session']['session']
export type User = Auth['$Infer']['Session']['user']
export { type Auth }