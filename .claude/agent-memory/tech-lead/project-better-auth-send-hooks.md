---
name: better-auth-send-hooks
description: The 4 Better Auth send* hooks in packages/auth/src/auth.ts that need to be wired to @deessejs/mail — signatures, types, idempotency keys
metadata:
  type: project
---

`packages/auth/src/auth.ts` has 4 mail-callback hooks that currently `console.log`. They need to be wired to `@deessejs/mail` per [[project-packages-mail-architecture]].

**Verified 2026-06-22.** Better Auth 1.6.19 confirmed signatures.

**Hook 1 — `emailAndPassword.sendResetPassword` (line 55)**
```ts
sendResetPassword: async ({ user, url, token }, request) => { ... }
```
- **Verified signature (2026-06-23 from official Better Auth docs)**: `({ user, url, token }, request) => Promise<void>`. The 2nd arg `request` is the incoming HTTP request — useful for IP/UA logging, not for the mail itself.
- Wire to template: `resetPassword` with `{ url, name: user.name, expiresInMinutes: 60 }`.
- **Idempotency key**: `reset:${user.id}:${hashToken(url)}` — same token = same mail, no duplicates. The Better Auth `url` already encodes a unique signed token, so hashing the URL gives stable dedup.
- **Official recommendation**: `void sendEmail(...)` — never await, to prevent timing attacks. On serverless, use `waitUntil` or similar.

**Hook 2 — `emailVerification.sendVerificationEmail` (line 63)**
```ts
sendVerificationEmail: async ({ user, url, token }, request) => { ... }
```
- **Verified signature (2026-06-23)**: `({ user, url, token }, request) => Promise<void>`. `token` is exposed for custom verification URLs (we use the built-in `url` instead).
- Wire to template: `verifyEmail` with `{ url, name: user.name, expiresInHours: 24 }`.
- **Idempotency key**: `verify:${user.id}:${1hBucket}` — 1h window to dedupe re-sends triggered by `sendOnSignIn: true` or repeated signups.
- **Official recommendation**: `void sendEmail(...)`.

**Hook 3 — `magicLink.sendMagicLink` (line 73)**
```ts
sendMagicLink: async ({ email, url }: { email: string; url: string }) => {
  console.log(`[auth] magic link for ${email}: ${url}`)
},
```
- Args: `{ email, url, token, metadata }, ctx` where `ctx` is the request context (includes `request` for IP/UA).
- **Verified signature (2026-06-23)**: `({ email, token, url, metadata }, ctx) => Promise<void>`. Matches our memory.
- Wire to template: `magicLink` with `{ url, expiresInMinutes: 10 }`.
- **Idempotency key**: `magiclink:${email}:${5minBucket}`.

**Hook 4 — `emailOTP.sendVerificationOTP` (line 85)**
```ts
sendVerificationOTP: async ({ email, otp, type }) => { ... }
```
- **Verified signature (2026-06-23)**: `({ email, otp, type }) => Promise<void>`. `type ∈ 'sign-in' | 'email-verification' | 'forget-password'`.
- Wire to template: `otp-sign-in` | `otp-email-verification` | `otp-forgot-password` (one template per type) with `{ otp, expiresInMinutes: 10 }`.
- **Idempotency key**: `otp:${email}:${type}:${1minBucket}`.

**Note on Better Auth changelog (2026-06-23 check)**: `better-auth@1.6.20` is current (28.8k stars, 1.7.0-beta.9 in pre-release). No mail-related breaking changes since 1.6.19. We pin to `1.6.19` per [[project-package-implementation-state]] — safe to bump to 1.6.20 when convenient (no signature changes).

**Wiring pattern (in auth.ts):**
```ts
import { sendMail } from '@deessejs/mail'

sendResetPassword: async ({ user, url }) => {
  void sendMail({
    to: user.email,
    template: 'resetPassword',
    context: { url, name: user.name, expiresInMinutes: 60 },
    idempotencyKey: `reset:${user.id}:${hashToken(url)}`,
  })
}
```

**Critical: never `await` the send.** Better Auth docs explicitly say (verified 2026-06-23 in both `emailVerification` and `emailAndPassword` sections): *"Avoid awaiting the email sending to prevent timing attacks. On serverless platforms, use `waitUntil` or similar."* `void sendMail(...)` is sufficient — Vercel's `hono/vercel` adapter handles `waitUntil` natively.

**Idempotency is OUR addition, not Better Auth's.** Better Auth doesn't recommend idempotency keys in its docs — the `url` already encodes a unique signed token, so duplicates are unlikely. We add `idempotencyKey` on top to cover the edge case where Better Auth generates a new token but Resend hasn't yet marked the previous one as sent (network retry on the auth handler). 24h Resend dedup window is plenty.

**Why:** these 4 hooks are the integration surface between Better Auth and the mail package. Each represents a distinct user action (password reset, email verify, magic link, OTP) with distinct content (link vs code) and distinct expiry semantics. Mapping them to typed templates with idempotency keys is the cleanest wiring — autocomplete on `template:` + no risk of sending duplicates on retry.

**How to apply:**
- When wiring `packages/mail`, write each template with the props structure above — don't invent new prop names without checking the hook signature.

**Sources (verified 2026-06-23 via fresh):**
- [Better Auth Email docs (raw .mdx)](https://raw.githubusercontent.com/better-auth/better-auth/main/docs/content/docs/concepts/email.mdx)
- [Magic link plugin docs](https://raw.githubusercontent.com/better-auth/better-auth/main/docs/content/docs/plugins/magic-link.mdx)
- [Email OTP plugin docs](https://raw.githubusercontent.com/better-auth/better-auth/main/docs/content/docs/plugins/email-otp.mdx)
- [Better Auth + Resend field notes (Jumpinotech)](https://jumpinotech.com/blog/better-auth-and-resend) — confirms no official helper, everyone rolls their own
- For OTP, use 3 template files (one per `type`), not a single template with a switch — keeps each template focused, easier to A/B test or translate later.
- All hooks must `void sendMail(...)` — never `await`. If a hook awaits, a slow Resend API call blocks the auth handler.
- Use `idempotencyKey` on every send — Resend deduplicates within 24h.
- The `_user` and `_user` underscore prefixes in the current code signal "unused" — the new wired version drops the underscore and uses the real `user` object.
- For M1, ignore `metadata`, `token`, and `request` 2nd args (they're for custom verification URLs and won't be used yet).