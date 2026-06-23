/**
 * Shared per-request variables, used by Hono's `Variables` type and
 * mirrored in the oRPC initial context (`src/context.ts`).
 *
 * The Hono middleware chain populates these BEFORE the oRPC handler runs.
 * The oRPC handler then reads them via `handler.handle(req, { context })`.
 *
 * Kept in its own file to avoid circular imports between `hono/app.ts`
 * (which needs the type at app construction) and the middlewares that
 * populate the fields.
 *
 * `ActiveOrgInfo` is populated by `src/middlewares/hono/auth-context.ts`
 * via `auth.api.getFullOrganization({ headers })` — the documented Better
 * Auth pattern. It's a separate field (not part of `authContext`) because
 * it has its own lifecycle (fetched separately, may be null if no org
 * is active or the call failed).
 */
import type { Database } from '@deessejs/database'
import type { Session, User } from '@deessejs/auth'

/** Resolved active organization + member role for the current request. */
export interface ActiveOrgInfo {
  /** Active org ID (null if no org selected or lookup failed). */
  id: string | null
  /** Active org slug (null if no org selected). */
  slug: string | null
  /** Current user's role in the active org (null if no org or lookup failed). */
  memberRole: string | null
}

export interface AppVariables {
  /** Per-request Drizzle client. Set by `src/middlewares/hono/auth-context.ts`. */
  db: Database
  /** Request ID (X-Request-Id, generated or propagated). */
  requestId: string
  /**
   * Result of the single `auth.api.getSession` call per request. Null if
   * no session. The oRPC `authMiddleware` reads this instead of calling
   * `getSession` again — see `src/middlewares/orpc/auth.ts`.
   */
  authContext: { session: Session; user: User } | null
  /**
   * Resolved active organization for the current session. Populated by
   * the Hono `auth-context.ts` middleware via `getFullOrganization` +
   * `getActiveMemberRole`. Null `id` means "no active org" or "lookup
   * failed" — distinguishable by `lookupFailed`.
   */
  activeOrg: ActiveOrgInfo
}