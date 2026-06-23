---
name: api-logging-strategy
description: packages/api uses Hono built-in logger() (not pino, not custom) — decided 2026-06-19
metadata:
  type: project
---

`packages/api` uses **Hono's built-in `logger()` middleware** (`from 'hono/logger'`) for the access log, registered in `src/hono/app.ts` after the other Hono middlewares. Output: two ANSI-colored lines per request.

**Why:**
- Zero extra dep (Hono is already there). Pino would have added `pino`, `@maou-shonen/hono-pino`, `@orpc/experimental-pino`.
- Simpler. No `Logger` interface, no `createLogger` factory, no `child({requestId})` plumbing.
- We have NO oRPC procedures yet (Sprint 1), so the lack of per-request logger bindings doesn't hurt yet.
- Vercel parses the colored output fine; `NO_COLOR=1` disables ANSI if needed.

**What was removed:**
- `src/logger.ts` (custom JSON logger + `Logger` interface)
- `src/middlewares/hono/logging.ts` (custom access log middleware)
- The `log` field from `AppVariables` and `ApiBaseContext`
- The `c.set('log', ...)` call in `auth-context.ts`
- The `console.error(...)` callsite in `auth-context.ts` still exists for getSession failures, but uses `console.error` not a logger object

**How to apply:**
- If you need to log inside a procedure, use `console.log` / `console.error` directly, OR use the oRPC hooks (`onStart`, `onSuccess`, `onError`, `onFinish`) re-exported from `src/middlewares/orpc/logger.ts`.
- Do NOT introduce a per-request `Logger` object back into `ApiBaseContext` without first checking with the founder — the explicit decision was to stay zero-dep.
- If we ever add pino or OTel, the entry point is `src/middlewares/hono/auth-context.ts` (where the per-request context is built) + a new Hono middleware slot in `app.ts`.
- Docs reference: `documents/internal/architecture/11-packages/api/structure.md#srcmiddlewares--the-middleware-layer` (the "Note on logging" callout).

**Risk:** if M1+ procedures need rich structured logs (requestId + orgId + userId per log line), we'll need to revisit. The pattern would be: bring back `pino` (NOT `@maou-shonen/hono-pino` or `@orpc/experimental-pino` — direct pino is simpler), init in `auth-context.ts` next to the db creation, store as `c.set('log', log)`, expose via `ApiBaseContext.log`, update `onError` interceptor.