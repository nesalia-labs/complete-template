/**
 * The oRPC router composition. Single source of truth for every procedure
 * the API exposes, consumed by both `RPCHandler` (internal) and
 * `OpenAPIHandler` (public).
 *
 * Sprint 1: four placeholder procedures so the wiring is testable
 * end-to-end. M1: feature modules (`core/<feature>/procedures.ts`) are
 * added here via direct composition (no registry abstraction yet — the
 * `registry.ts` pattern in the docs is added when we have ≥ 2 feature
 * modules, at which point the manual composition gets verbose).
 *
 * @see docs/internal/architecture/11-packages/api/structure.md#srcrouterts
 */
import { publicProcedure } from './public'
import { sessionOnly, authorized } from './authorized'

/**
 * Health check. Public — no auth required. Returns a timestamp so
 * `app.request('/rpc/ping')` smoke-tests the full pipeline (Hono → oRPC
 * → handler → response).
 */
export const ping = publicProcedure.handler(() => ({
  status: 'ok',
  timestamp: new Date().toISOString(),
}))

/**
 * Auth-required ping. Returns the user ID. Used to verify:
 *   - `sessionOnly` middleware throws `UNAUTHORIZED` when called without
 *     a session (failure path on both `/rpc/pingAuth` and `/api/v1/pingAuth`).
 *   - The custom wire shape on `/api/v1/*` correctly maps `UNAUTHORIZED`
 *     to `{ code: 'unauthenticated', message, requestId }`.
 *
 * Public (not tagged `internal`) so the failure-path tests can exercise
 * the OpenAPI wire shape. In M1, replace with real product procedures.
 */
export const pingAuth = sessionOnly
  .handler(({ context }) => ({
    userId: context.user.id,
    email: context.user.email,
  }))

/**
 * Org-scoped ping. Returns the active org ID + slug + member role.
 * Used to verify `orgContextMiddleware` throws `FORBIDDEN` when the
 * session has no active org.
 *
 * Public (not tagged `internal`) so the failure-path tests can exercise
 * the OpenAPI wire shape. In M1, replace with real product procedures.
 */
export const pingOrg = authorized
  .handler(({ context }) => ({
    orgId: context.orgId,
    orgSlug: context.orgSlug,
    orgMemberRole: context.orgMemberRole,
  }))

export const router = {
  ping,
  pingAuth,
  pingOrg,
}