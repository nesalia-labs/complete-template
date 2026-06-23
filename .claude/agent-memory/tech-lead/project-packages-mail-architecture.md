---
name: packages-mail-architecture
description: Proposed structure for @deessejs/mail (packages/mail) — supastarter pattern adapted for DeesseJS, no apps/mail-preview for M1
metadata:
  type: project
---

Architecture proposal for the empty `packages/mail` (validated 2026-06-22). NOT YET implemented. Following [[project-mail-stack-decision]] (Resend + react-email v6).

**File layout:**
```
packages/mail/
├── package.json                     (name "@deessejs/mail", private, type: module)
├── tsconfig.json                    (extends ../../tsconfig.base.json, no emit)
├── src/
│   ├── index.ts                     ← public API: sendMail, createMailer, types
│   ├── config.ts                    ← from address, replyTo, branding (not secret)
│   ├── env.ts                       ← zod schema: RESEND_API_KEY, MAIL_FROM, MAIL_REPLY_TO, MAIL_PROVIDER
│   ├── client.ts                    ← singleton lazy: createResendClient() / createConsoleClient() / createNoopClient()
│   ├── provider/
│   │   ├── index.ts                 ← export getMailer(): switch sur MAIL_PROVIDER env
│   │   ├── resend.ts                ← interface Mailer impl with Resend SDK
│   │   ├── console.ts               ← console.log, dev fallback
│   │   └── noop.ts                  ← no-op for unit tests
│   ├── send.ts                      ← sendMail(): render → provider.send(), idempotency key support
│   ├── render.ts                    ← renderHtml(template, props), renderText(template, props)
│   ├── registry.ts                  ← mailTemplates = { resetPassword, verifyEmail, magicLink, otp-sign-in, otp-email-verification, otp-forgot-password }
│   ├── types.ts                     ← SendMailInput<T>, BaseMailProps, MailTemplateId
│   └── templates/
│       ├── Wrapper.tsx              ← shared <Html><Head><Tailwind config={brand}><Container>...
│       ├── components/
│       │   └── PrimaryButton.tsx
│       ├── reset-password.tsx
│       ├── verify-email.tsx
│       ├── magic-link.tsx
│       ├── otp-sign-in.tsx
│       ├── otp-email-verification.tsx
│       └── otp-forgot-password.tsx
└── tests/
    ├── render.test.ts               ← render → non-empty html + valid plain text
    ├── registry.test.ts             ← every template registered has valid PreviewProps
    ├── send.test.ts                 ← mocked provider, assert called with right props
    └── templates.test.ts            ← snapshot html per template
```

**Dependencies (proposed):**
```jsonc
{
  "name": "@deessejs/mail",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "email dev -p 3005",      // preview dev server, port 3005 to not collide with apps/web (3000)
    "build": "email build",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "test": "vitest run"
  },
  "dependencies": {
    "react-email": "^6.0.0",        // composants + render + pretty + toPlainText (all in v6+)
    "resend": "^6.14.0",            // Node.js SDK
    "react": "^19.2.4",
    "react-dom": "^19.2.4",
    "zod": "^4.0.0"                 // env validation (matches packages/database)
  },
  "devDependencies": {
    "@react-email/ui": "^1.0.0",    // preview dev server CLI (email dev)
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "vitest": "^2.1.0",
    "typescript": "^5"
  },
  "engines": { "node": ">=20" }
}
```

**Public API shape:**
```ts
type MailTemplateId = 'resetPassword' | 'verifyEmail' | 'magicLink'
                    | 'otp-sign-in' | 'otp-email-verification' | 'otp-forgot-password'

interface SendMailInput<T extends MailTemplateId> {
  to: string
  template: T
  context: ComponentProps<typeof mailTemplates[T]>
  idempotencyKey?: string
  replyTo?: string
}

export async function sendMail<T extends MailTemplateId>(
  input: SendMailInput<T>
): Promise<{ id: string } | { error: string }>
```

**Provider switch pattern (mirrors `@deessejs/cache`):**
- Auto-detect: if `RESEND_API_KEY` present → Resend, else → Console
- Override: `MAIL_PROVIDER=console|resend|noop`
- `noop` for unit tests
- Lazy singleton: don't construct Resend client at module load (would crash dev/test without env)

**`apps/email-preview` decision: DEFERRED to M2 (user reversed 2026-06-23).**
- **Path** (when M2 lands): `apps/template/apps/email-preview/` (sibling of `web`, `cli`, `docs`)
- **Naming rationale**: `email-preview` chosen over `mail-preview` despite the package being `@deessejs/mail`, because "email preview" is what users search for and matches React Email docs. Light inconsistency accepted.
- **Stack (when M2)**: Next.js 16 app (mandated by user 2026-06-23). Why not the official `email build` Vercel path → bug #3498 in resend/react-email repo, returns 404 on Vercel in monorepos (open since 2026-05-13). Next.js standalone build bypasses the bug.
- **Port 3005** in dev (3000 reserved for `apps/web`)
- **Responsibilities** (when M2): list all templates, render with sample props, switch provider (`resend`/`console`/`noop`), switch locale (when `packages/i18n` ships), toggle HTML vs plain text, deploy to Vercel as `demo.deessejs.dev/email-preview`.
- **Minimum viable content**: page per template, sample data inline (no auth, no DB), responsive grid.
- **Why deferred**: the user decided 2026-06-23 that the preview app is "not for v1". Core product = `packages/mail` working end-to-end with the 4 Better Auth hooks. Preview UI for designers + prospects is post-v1 polish. `email dev -p 3005` CLI is sufficient to validate that the 6 templates render correctly in M1.
- **Docs already written for M2** are kept in `documents/internal/architecture/12-apps/email-preview/` (README.md + hosting.md). No rewrite needed — they're the M2 spec.
- **Community consensus** (verified 2026-06-23 via fresh): ShipFast, CREA.MBA, PkgPulse, etc. use just the CLI — no preview app. supastarter is the only outlier with a dedicated app.
- **How to apply (M2 trigger)**: when the buyer dashboard needs to embed template previews OR when marketing wants a public demo URL, pull this design from the existing docs and build the app.

**i18n in templates: NOT for M1.**
- react-email has official `next-intl`, `react-i18next`, `react-intl` integrations.
- DeesseJS `packages/i18n` is empty. No point hardcoding FR/EN in templates until that package exists.
- All templates hardcoded English for M1. When `packages/i18n` ships, refactor templates to take `locale` + `translations` as props (see supastarter's `BaseMailProps = { locale, translations }`).

**`Wrapper` shared layout:** every template wraps its content in `<Wrapper>...</Wrapper>`. The Wrapper owns the `<Html><Head><Tailwind config={brand}><Container>...</Container></Tailwind></Html>` shell + Logo. Single edit site for brand changes.

**Why:** this pattern (provider switch + registry + Wrapper + no i18n for M1) is the minimum viable that mirrors the supastarter reference (see [[reference-supastarter-mailing-pattern]]) while staying within the DeesseJS conventions (lazy singletons, zod env, vitest, pnpm workspace).

**How to apply:**
- Before writing code: confirm with the user that the package name is `@deessejs/mail` (not `@deessejs/email`) — proposed but not validated.
- Wire order: (1) package.json + tsconfig + empty index.ts, (2) provider folder with console/noop first (no env needed), (3) one template (reset-password) end-to-end, (4) the rest of the templates, (5) wire the 4 hooks in `packages/auth/src/auth.ts` per [[project-better-auth-send-hooks]], (6) Resend provider + tests with `RESEND_API_KEY` env.
- Always `void sendMail(...)` (don't await) in Better Auth callbacks per the docs — see [[project-better-auth-send-hooks]].
- Use `resend.emails.send({ react: <Template {...} /> })` directly — don't manually call `render()` unless you also need plain-text fallback.
- Don't add `apps/mail-preview` without re-confirming — it adds +1 Next.js app + +port + +deps to manage.