/**
 * Hono middleware: read or generate the X-Request-Id.
 *
 * Behavior:
 *   - If the incoming request has `X-Request-Id`, use it (allows trace
 *     correlation across services).
 *   - Otherwise, generate a UUID.
 *
 * Sets `c.get('requestId')` and propagates the value back as a response
 * header `X-Request-Id` so clients can log it. Also wraps the rest of
 * the request in `requestContext` (AsyncLocalStorage) so downstream
 * code — notably the oRPC error encoder — can read the requestId even
 * though it's invoked outside the Hono middleware chain.
 *
 * Must run BEFORE `auth-context.ts` (which creates the per-request Drizzle
 * client) AND be the first middleware in the chain (so the ALS scope
 * wraps everything else).
 */
import type { MiddlewareHandler } from 'hono'
import type { AppVariables } from '../../types'
import { requestContext } from '../../request-context'

export const requestIdMiddleware: MiddlewareHandler<{ Variables: AppVariables }> = async (c, next) => {
  const requestId = c.req.header('x-request-id') ?? crypto.randomUUID()
  c.set('requestId', requestId)
  c.header('x-request-id', requestId)
  // Wrap everything downstream in the ALS scope. The store is read by
  // the oRPC error encoder (see `src/hono/openapi.ts`).
  await requestContext.run({ requestId }, () => next())
}