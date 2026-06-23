/**
 * Per-request context propagated via Node's `AsyncLocalStorage`.
 *
 * Why this file exists:
 *   Some code paths run OUTSIDE the Hono middleware chain — notably the
 *   oRPC `customErrorResponseBodyEncoder` callback, which is invoked
 *   synchronously from the handler's error-encoding path with only the
 *   `ORPCError` as argument. We can't pass per-request state (like
 *   `requestId`) through the handler constructor — the handler is
 *   shared across requests.
 *
 *   AsyncLocalStorage solves this: store values at the request entry
 *   point (the Hono `requestIdMiddleware`), read them anywhere downstream
 *   — including the error encoder. Node's async_hooks propagates the
 *   store through `await` boundaries, so the encoder sees the right
 *   requestId even though it's called deep in the handler stack.
 *
 * This is the same pattern oRPC's own `@orpc/experimental-pino` uses
 * (per `packages/pino/src/context.ts` — `CONTEXT_LOGGER_SYMBOL`).
 *
 * @see https://nodejs.org/api/async_context.html#class-asynclocalstorage
 */
import { AsyncLocalStorage } from 'node:async_hooks'

export interface RequestContext {
  /** Per-request X-Request-Id, set by `requestIdMiddleware`. */
  requestId: string
}

/**
 * The single AsyncLocalStorage instance for request-scoped data. Read
 * with `requestContext.getStore()` — returns `undefined` outside a
 * request context (e.g. during module init).
 */
export const requestContext = new AsyncLocalStorage<RequestContext>()