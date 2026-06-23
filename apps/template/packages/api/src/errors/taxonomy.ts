/**
 * Error taxonomy.
 *
 * For Sprint 1 we re-export `ORPCError` from `@orpc/server` as the
 * single error base. Procedures throw `new ORPCError(code, { message, data })`.
 *
 * Why not a custom hierarchy (UnauthenticatedError, ForbiddenError, etc.)?
 * oRPC's `ORPCError` already maps codes to HTTP statuses and serializes
 * them consistently. Wrapping it adds no value in Sprint 1. M1 may add
 * subclasses if we need richer stack traces (e.g. to attribute errors
 * to feature modules).
 *
 * Usage:
 *
 * ```ts
 * import { ORPCError } from '@deessejs/api/errors'
 *
 * throw new ORPCError('NOT_FOUND', {
 *   message: `User ${id} not found in this org`,
 *   data: { userId: id, orgId: context.orgId },
 * })
 * ```
 */
export { ORPCError } from '@orpc/server'