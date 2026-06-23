/**
 * oRPC auth middleware. Reads `context.authContext` (populated by the Hono
 * `auth-context.ts` middleware via a single `getSession` call) and
 * propagates `session` + `user` into the execution context.
 *
 * If the Hono middleware did its job, this is a pure validation step —
 * no `getSession` call here. The whole stack runs `getSession` exactly
 * once per request, regardless of how many procedures the request
 * traverses.
 *
 * @see docs/internal/architecture/11-packages/auth/integrations.md §2
 *      (the cookieCache workaround that motivates `asResponse: true`)
 */
import { ORPCError } from '@orpc/server'
import { base } from '../../context'

export const authMiddleware = base.middleware(async ({ context, next }) => {
  if (!context.authContext) {
    throw new ORPCError('UNAUTHORIZED', { message: 'No active session' })
  }
  return next({
    context: {
      session: context.authContext.session,
      user: context.authContext.user,
    },
  })
})