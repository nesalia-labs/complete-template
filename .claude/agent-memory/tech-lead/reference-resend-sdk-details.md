---
name: resend-sdk-details
description: Resend Node.js SDK reference — resend@6.14.0 (June 2026), API surface, env vars, limits, Hono integration
metadata:
  type: reference
---

Resend Node.js SDK — reference card for `resend@^6.14.0` (verified 2026-06-22 via fresh fetch).

**Package:** `resend` — 7.4M weekly downloads, MIT, 242KB unpacked, Node 20+ recommended.

**Env vars:**
- `RESEND_API_KEY` — required, format `re_xxxx...`. Throws at construction if missing.
- Domain verification at `resend.com/domains` required before sending from your own domain. `onboarding@resend.dev` works for dev/test.

**Client + send:**
```ts
import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY)

const { data, error } = await resend.emails.send({
  from: '"Acme" <onboarding@resend.dev>',     // required
  to: ['user@example.com'],                     // max 50 addresses
  subject: 'Hello World',                       // required
  // Content — at least one of:
  html: '<strong>It works!</strong>',
  text: 'It works!',                            // auto-generated from html if omitted
  react: <MyTemplate {...props} />,             // Node.js only, renders server-side
  // Optional:
  cc, bcc, replyTo,
  scheduledAt: '2026-12-25T08:00:00Z',         // ISO 8601
  headers: { 'X-Custom': 'foo' },
  tags: [{ name: 'campaign', value: 'launch' }],
  attachments: [{ filename: 'invoice.pdf', content: Buffer }],
  template: { id: 'tmpl_xxx', variables: { name: 'Alice' } },  // mutually exclusive with html/text/react
  idempotencyKey: 'reset:user:123:abc',        // 256 chars max, 24h expiry
})

if (error) { console.error(error); return }
console.log(data)  // { id: '49a3999c-...' }
```

**Limits:**
- **5 req/sec/team** by default → 429 on excess. Request increase manually.
- Max 50 recipients per `to` (use array).
- Max 40 MB attachments total per email after encoding.
- Tag name/value: max 256 chars, ASCII only.

**Idempotency keys:** add for retry-safe sends (password reset, email change). Format: `domain:entity:id:hash`. 24h expiry, 256 char max.

**Framework integrations (officially supported, listed on `resend.com/docs/send-with-*`):**
- Next.js (App Router + Pages Router)
- Remix
- Nuxt
- Express
- **Hono** ← matches our `packages/api` stack
- Bun
- Astro

**Avoid await pattern (Better Auth + Resend recommendation):** Better Auth docs explicitly say "Avoid awaiting the email sending to prevent timing attacks. On serverless platforms, use `waitUntil` or similar." Use `void resend.emails.send(...)` or wrap in `waitUntil` for Vercel.

**Hono-specific:** the official `hono` integration page is at `resend.com/docs/send-with-hono`. Pattern is identical to any Node.js usage — instantiate `Resend` once, call `emails.send` per request.

**Why this matters for DeesseJS:**
- The auth package's 4 `send*` hooks already announced Resend (see `packages/auth/src/auth.ts:54`).
- Hono is officially supported → no integration friction with `packages/api`.
- React Email templates can be passed via `react:` field without manual render.
- `idempotencyKey` should be used for password reset and email change to prevent duplicate sends on retry.

**Sources (2026-06-22 via fresh):**
- `resend.com/docs/send-with-nextjs`
- `resend.com/docs` (full docs index)
- `npmjs.com/package/resend` (version metadata)

**How to apply:**
- For `packages/mail`: see [[project-packages-mail-architecture]] for the full Resend integration (provider switch pattern, env validation, idempotency).
- Use `react: <Template {...} />` field on `resend.emails.send()` — Resend renders server-side, no manual `render()` call needed (see [[reference-react-email-v6-unified]]).
- Always `void` the call in Better Auth callbacks (see [[project-better-auth-send-hooks]]).
- For retry-safe sends: set `idempotencyKey: '<scope>:<id>:<hash>'`.
- Don't pass `RESEND_API_KEY` at module top-level — use lazy singleton to avoid dev/test crashes (mirrors `packages/cache` and `packages/database` env loading patterns).