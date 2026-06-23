/**
 * Hono → oRPC context bridge.
 *
 * Both `mount-rpc.ts` and `mount-openapi.ts` need to pass the same per-request
 * state (db, requestId, authContext, activeOrg) as the oRPC handler's initial
 * context. This helper builds the object from the Hono `Variables` in one
 * place so the two mounts stay in sync. If we ever add another field to
 * `ApiBaseContext` (e.g. `traceId` for OTel), this is the single edit site.
 *
 * @see docs/internal/architecture/11-packages/api/structure.md#srchonoappts
 */
import type { Context } from 'hono'
import type { ApiBaseContext } from '../context'
import type { AppVariables } from '../types'

/**
 * Extract the per-request state Hono populates and reshape it into the
 * shape oRPC's `handler.handle()` expects. `headers` is the raw incoming
 * Fetch API Headers — the most accurate reflection of the request, since
 * it carries all cookies / content-type / etc. unmodified.
 */
export function buildOrpcContext(c: Context<{ Variables: AppVariables }>): ApiBaseContext {
  return {
    headers: c.req.raw.headers,
    db: c.get('db'),
    requestId: c.get('requestId'),
    authContext: c.get('authContext'),
    activeOrg: c.get('activeOrg'),
  }
}