/**
 * The protected procedure builders, plus the oRPC `base`.
 *
 * Three layers, each composable:
 *   - `base`           — `os.$context<ApiBaseContext>()`. The initial context.
 *   - `publicProcedure` — `base` with no middleware. Use for sign-up, sign-in,
 *                        health probes, HMAC-authenticated webhooks.
 *   - `sessionOnly`    — `base.use(authMiddleware)`. Requires a session.
 *   - `authorized`     — `sessionOnly.use(orgContextMiddleware)`. Session +
 *                        `orgId` resolved from `session.activeOrganizationId`.
 *                        This is the default for any procedure that touches
 *                        org-scoped data.
 *
 * Failure modes:
 *   - `sessionOnly` throws `ORPCError('UNAUTHORIZED')` if no session.
 *   - `authorized`  throws `ORPCError('UNAUTHORIZED')` if no session, or
 *                    `ORPCError('FORBIDDEN', { data: { reason: 'no_active_org' } })`
 *                    if no active org is selected.
 *
 * @see docs/internal/architecture/11-packages/api/structure.md#srccontextts-srcauthorizedts-srcpublicts--the-orpc-bases
 */
import { base } from './context'
import { authMiddleware } from './middlewares/orpc/auth'
import { orgContextMiddleware } from './middlewares/orpc/org-context'

export { base, type ApiBaseContext } from './context'
export { authMiddleware } from './middlewares/orpc/auth'
export { orgContextMiddleware } from './middlewares/orpc/org-context'

export const publicProcedure = base

export const sessionOnly = base.use(authMiddleware)

export const authorized = sessionOnly.use(orgContextMiddleware)