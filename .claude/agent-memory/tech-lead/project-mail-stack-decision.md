---
name: mail-stack-decision
description: DeesseJS mail stack = Resend (transport) + react-email v6 (templates) — research verified 2026-06-22 via fresh CLI
metadata:
  type: project
---

Decision (2026-06-22, validated against fresh-fetched docs):

- **Mail transport**: `resend@^6.14.0` (Node.js SDK, 7.4M weekly downloads, MIT)
- **Template engine**: `react-email@^6.0.0` (unified package — composants + render dans un seul import depuis v6.0.0, 2026-04-16)
- **Dev preview**: `npx email dev` (built into `react-email`), `@react-email/ui@^1` en devDependency

**Rationale:**
- `packages/auth/src/auth.ts:54` already announces the direction: `// sendResetPassword is wired in the mail package (Resend adapter).`
- Resend is the **same team** as React Email → first-class integration, official docs recommend the pair.
- Resend lists **Hono** as an officially supported integration — matches our `packages/api` setup.
- React Email 5.0+ officially supports **React 19.2 + Next.js 16** — exact versions used by `apps/web`.
- `<Tailwind>` component in react-email uses **Tailwind 4.1.12** (independent of the `apps/web` PostCSS Tailwind 4 pipeline, no conflict).
- `resend.emails.send({ react: <MyTemplate /> })` renders the React component server-side on Resend's side — we don't even need to call `render()` ourselves in the happy path.

**Alternatives explicitly rejected (2026-06-22):**
- **`react-mail`** (npm `mailing`, `react-mailkit`) — not the official package. `mailing` is a Next.js community project. Avoid.
- **`jsx-email`** (shellscape, 1.2k stars) — concurrent sérieux with email-client CLI checker, mais React 18 only (no React 19), smaller team. Reconsider only if we want to leave the Resend ecosystem.
- **`@react-email/components`** (legacy pre-v6) — deprecated as of react-email 6.0.0. Don't adopt fresh.
- **Nodemailer + SMTP** — works everywhere, no React components, no preview dev server. Friction inutile for M1.
- **Postmark / Mailgun / SendGrid / SES** — all have SDKs but none have the React Email + Tailwind component + preview dev server combo. Stay on Resend unless cost/perf forces a switch.

**Why:** this stack minimizes friction (single ecosystem, single editor, single CLI) while staying on supported versions. The user's explicit direction on 2026-06-22 ("fouille au niveau de resend et react-mail") plus the inline comment in auth.ts converge on this choice.

**How to apply:**
- New mail-related packages: use `@deessejs/mail` package name, follow [[project-packages-mail-architecture]].
- Wiring `packages/auth/src/auth.ts` 4 `send*` hooks: always pass `react:` directly to `resend.emails.send()` (no manual `render()` call needed) — except when also building a plain-text fallback for clients that disable HTML, then `toPlainText(html)` is exported from `react-email`.
- For `apps/email-preview` (Next.js preview app): deferred to M2 per user decision 2026-06-23. Docs kept in `documents/internal/architecture/12-apps/email-preview/`. See [[project-packages-mail-architecture]] § `apps/email-preview decision` for the full rationale.
- See [[reference-react-email-v6-unified]] for the import API and [[reference-resend-sdk-details]] for the SDK surface.
- See [[reference-supastarter-mailing-pattern]] for the closest reference architecture (same stack).
- See [[project-better-auth-send-hooks]] for the 4 hook signatures and the wiring plan.
- See [[feedback-use-fresh-cli]] for how to do future mail research (use `fresh search` / `fresh fetch`, not built-in WebSearch).