---
name: m1-mail-checkpoint
description: Session checkpoint 2026-06-22 — mail wiring plan fully decided + documented, code scaffold is next; resume from packages/mail
metadata:
  type: project
---

Session ended 2026-06-22 with the mail wiring plan **fully researched and documented** but **no code written yet**. User explicitly said "on fait tout ça demain" — pick up here next session.

## What's DONE (in this session, 2026-06-22)

### Decisions locked
- **Stack**: Resend (`^6.14`) as transport + react-email v6 unified (`^6.6`) as template engine. See [[project-mail-stack-decision]].
- **Package name**: `@deessejs/mail` at `apps/template/packages/mail/`.
- **Preview app name**: `apps/template/apps/email-preview/` (NOT `mail-preview`, chosen for search-friendliness). See [[project-packages-mail-architecture]].
- **Provider switch**: `MAIL_PROVIDER=console|resend|noop` with auto-detect fallback. Lazy singletons (no top-level `new Resend()`).
- **6 templates**: reset-password, verify-email, magic-link, otp-sign-in, otp-email-verification, otp-forgot-password.
- **Wrapper pattern**: shared `<Html><Head><Tailwind config={brand}><Container>...</Container></Tailwind></Html>` shell, single edit site for brand.
- **Idempotency keys**: `<scope>:<id>:<hash|bucket>` format, 24h Resend window.
- **`void sendMail(...)`** always — never await in Better Auth callbacks.

### Documentation created (12 files, ~1379 LoC)
- `documents/internal/architecture/01-stack/resend-react-email.md` — rewritten (was stale, used `@react-email/components` deprecated)
- `documents/internal/architecture/10-decisions/0013-react-email-v6-unified-package.md` — ADR (Accepted)
- `documents/internal/architecture/10-decisions/0014-resend-as-transport.md` — ADR (Accepted)
- `documents/internal/architecture/11-packages/mail/README.md`
- `documents/internal/architecture/11-packages/mail/structure.md`
- `documents/internal/architecture/11-packages/mail/integrations.md`
- `documents/internal/architecture/11-packages/mail/conventions.md`
- `documents/internal/architecture/11-packages/mail/M0-deferred-work.md`
- `documents/internal/architecture/11-packages/mail/decisions/0001-resend-react-email-v6-supastarter-pattern.md`
- `documents/internal/architecture/12-apps/email-preview/README.md`
- `documents/internal/architecture/12-apps/email-preview/hosting.md`
- `documents/internal/architecture/12-apps/template/README.md`
- `documents/internal/architecture/10-decisions/README.md` — index updated with 0013, 0014

### Memories updated/created (in `.claude/agent-memory/tech-lead/`)
- [[project-package-implementation-state]] — refreshed to reflect 2026-06-22 state (api is Sprint 1 done, NOT empty)
- [[project-mail-stack-decision]] — created
- [[project-packages-mail-architecture]] — created and updated with email-preview decision
- [[project-better-auth-send-hooks]] — created
- [[reference-react-email-v6-unified]] — updated to v6.6.3 with complete component inventory
- [[reference-resend-sdk-details]] — created
- [[reference-supastarter-mailing-pattern]] — created
- `MEMORY.md` — index updated with all new entries

## What's NEXT (code scaffold, in this order)

1. **`packages/mail/`** — the core package
   - `package.json` (deps per [[project-packages-mail-architecture]]: react-email, resend, react, react-dom, zod; devDeps: @react-email/ui, vitest, typescript)
   - `tsconfig.json` (extends `../../tsconfig.base.json`)
   - `src/{index,config,env,client,send,render,registry,types}.ts`
   - `src/provider/{index,types,resend,console,noop}.ts`
   - `src/templates/Wrapper.tsx` + `src/templates/components/PrimaryButton.tsx`
   - One reference template: `src/templates/reset-password.tsx` (full end-to-end example)
   - Remaining 5 templates (can be batched after)
   - `tests/{send,registry,render,templates}.test.ts`

2. **(DEFERRED to M2)** ~~`apps/email-preview/` — the Next.js preview app~~ → see [[project-packages-mail-architecture]] for the deferred decision rationale. Docs already exist in `12-apps/email-preview/` for when we build it.

3. **`packages/auth/src/auth.ts`** — wire the 4 `send*` hooks
   - Replace each `console.log(...)` with `void sendMail({...})` per [[project-better-auth-send-hooks]]
   - Use the exact signatures documented in `integrations.md`
   - Add helper `packages/auth/src/utils/idempotency.ts` (hashToken + bucket functions)

4. **Tests + verification**
   - `pnpm --filter @deessejs/mail test` (Vitest with `noop` provider)
   - `pnpm --filter @deessejs/mail dev` (`email dev -p 3005`) — the CLI is the preview tool for M1, no separate app
   - Trigger a password reset in the running app to confirm `sendMail` fires

## Open questions to confirm before coding starts

1. **Port collision**: `packages/mail dev` (`email dev -p 3005`) AND `apps/email-preview` (Next.js) both want 3005. Pick one or stagger.
2. **No need to ask**: package name (`@deessejs/mail`), preview app path (`apps/template/apps/email-preview`), provider default (console), 6 templates list, Wrapper pattern, idempotency key format — all decided.

## Why this checkpoint exists

If the next session opens cold, this file is the "TL;DR resume". Read it, then dive into [[project-packages-mail-architecture]] for the full plan, then start coding step 1.

## How to apply (next session)

1. Read this file first.
2. **M1 is just `packages/mail` + auth wiring**. No port collision — `email dev -p 3005` in `packages/mail` is the preview tool for M1.
3. EnterPlanMode for the scaffold (`packages/mail` + auth wire) — or just start with `packages/mail/` if the user wants to skip planning.
4. Use `fresh search` / `fresh fetch` per [[feedback-use-fresh-cli]] and the new [[feedback-research-before-deciding]] rule if any new decision pops up.
5. `apps/email-preview` is M2 — docs already in `12-apps/email-preview/` for when we revisit.