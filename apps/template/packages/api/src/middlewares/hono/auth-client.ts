/**
 * Typed accessor for the Better Auth API methods used by the API package.
 *
 * Why this file exists:
 *   The `@deessejs/auth` re-export loses the `Options["plugins"]` generic
 *   (see Better Auth issue #4222). As a result, methods provided by the
 *   `organization()` plugin — `getFullOrganization`, `getActiveMemberRole`
 *   — are NOT in the inferred type of `auth.api` even though they exist
 *   at runtime in Better Auth 1.6.19.
 *
 *   The root fix is upstream in `packages/auth`: use `satisfies
 *   BetterAuthOptions` and pass the same options object into both
 *   `betterAuth(...)` AND `plugins: [organization(...)]` so the generic
 *   tuple is preserved. We can't do that from this package without
 *   scope creep.
 *
 *   Workaround: we cast `auth.api` to a structural type containing ONLY
 *   the methods we use. This cast lives in ONE place; consumers import
 *   the typed wrappers here. If the upstream fix lands, we delete this
 *   file and update the import sites (one-line change per consumer).
 *
 * If you add a new auth.api method here, also add it to the structural
 * type below — keep the cast surface tight to what's actually used.
 */
import { auth } from '@deessejs/auth'

interface AuthApiSubset {
  getFullOrganization: (opts: { headers: Headers }) => Promise<{ id: string; slug: string } | null>
  getActiveMemberRole: (opts: { headers: Headers }) => Promise<string | null>
}

const authApi = auth.api as unknown as AuthApiSubset

/**
 * Resolve the active organization for the current session via Better
 * Auth's `getFullOrganization`. Reads `session.activeOrganizationId`
 * internally. Returns `null` if no session, no active org, or the call
 * failed (caller decides how to handle the failure).
 */
export function getActiveOrganization(
  headers: Headers,
): Promise<{ id: string; slug: string } | null> {
  return authApi.getFullOrganization({ headers })
}

/**
 * Resolve the current user's role in the active organization. Returns
 * `null` if no session, no active org, or the call failed.
 */
export function getActiveMemberRole(headers: Headers): Promise<string | null> {
  return authApi.getActiveMemberRole({ headers })
}