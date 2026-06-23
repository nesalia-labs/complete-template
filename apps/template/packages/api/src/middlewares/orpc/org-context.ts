/**
 * oRPC org context middleware. Reads the resolved active org (populated
 * by the Hono `auth-context.ts` middleware via Better Auth's
 * `getFullOrganization`) and propagates `orgId`, `slug`, and `memberRole`
 * into the execution context.
 *
 * No cast needed — the Hono middleware does the org resolution once via
 * the documented Better Auth server-side APIs. The activeOrg field on
 * the context is typed correctly (see `src/types.ts`).
 *
 * Failure modes:
 *   - No session: `ORPCError('UNAUTHORIZED')`. Shouldn't happen if
 *     composed on top of `sessionOnly`, but defensive.
 *   - Session exists but `activeOrg.id` is null (no org selected, or
 *     `getFullOrganization` failed): `ORPCError('FORBIDDEN',
 *     { data: { reason: 'no_active_org' } })`. Client prompts the
 *     org switcher.
 *
 * @see docs/internal/architecture/11-packages/auth/plugins.md
 *      (the `organization()` plugin endpoints)
 */
import { ORPCError } from '@orpc/server'
import { base } from '../../context'

export interface OrgExecutionContext {
  /** Active org ID. Resolved by the Hono auth-context middleware. */
  orgId: string
  /** Active org slug. Same source. */
  orgSlug: string | null
  /** Current user's role in the active org. M1: used by RBAC checks. */
  orgMemberRole: string | null
}

export const orgContextMiddleware = base.middleware(async ({ context, next }) => {
  if (!context.authContext) {
    throw new ORPCError('UNAUTHORIZED', { message: 'No active session' })
  }
  if (!context.activeOrg.id) {
    throw new ORPCError('FORBIDDEN', {
      message: 'No active organization',
      data: { reason: 'no_active_org' },
    })
  }
  return next({
    context: {
      orgId: context.activeOrg.id,
      orgSlug: context.activeOrg.slug,
      orgMemberRole: context.activeOrg.memberRole,
    },
  })
})