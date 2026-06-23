---
name: api-async-local-storage-pattern
description: Why packages/api uses AsyncLocalStorage to pass requestId to the oRPC error encoder — verified 2026-06-19
metadata:
  type: project
---

In `packages/api`, the oRPC `customErrorResponseBodyEncoder` (on `OpenAPIHandler` constructor) needs the current `requestId` to put it in the error wire shape. The encoder is invoked synchronously by oRPC's error-encoding path, OUTSIDE the Hono middleware chain — so we can't pass per-request state through it directly.

**Solution: AsyncLocalStorage** (Node's `node:async_hooks`).

**Files involved:**
- `src/request-context.ts` — defines `AsyncLocalStorage<{requestId: string}>` and exports `requestContext`
- `src/middlewares/hono/request-id.ts` — wraps `next()` in `requestContext.run({requestId}, () => next())` so the store is propagated through every async hop
- `src/hono/openapi.ts` — the encoder reads `requestContext.getStore()?.requestId ?? 'unknown'` at error time

**Why this pattern:**
- Node's `async_hooks` propagates the store through `await` boundaries, so the encoder sees the right requestId even though it's called deep in the handler stack
- Same pattern oRPC's own `@orpc/experimental-pino` uses (per `packages/pino/src/context.ts` — `CONTEXT_LOGGER_SYMBOL`)
- Same pattern Pino uses
- Same pattern Hono uses internally for its own context

**How to apply:**
- To add a new per-request value (e.g. `traceId`, `orgId` for tracing), add it to the `RequestContext` interface and populate it in `request-id.ts` (or whichever middleware computes it first).
- The encoder in `openapi.ts` is the primary consumer today. Future consumers (custom oRPC interceptors, audit hooks) can read the store too.
- Don't try to pass per-request state through the handler constructor — that's a shared singleton. Use `requestContext.getStore()` instead.

**Pitfall:** the `requestIdMiddleware` MUST be the first middleware in the chain (in `src/hono/app.ts`), so the ALS scope wraps everything downstream. If you add a middleware BEFORE it, that middleware won't see the store.