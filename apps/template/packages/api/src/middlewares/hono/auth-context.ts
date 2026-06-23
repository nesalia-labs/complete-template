/**
 * Hono middleware: the single getSession call + org resolution per request.
 *
 * Responsibilities (in order):
 *   1. Create the per-request Drizzle client (`createClient()` from
 *      `@deessejs/database`). The client is per-request because Fluid
 *      Compute shares instances across requests — we want a fresh pool
 *      per request to avoid session leaks.
 *   2. Call `auth.api.getSession({ headers, asResponse: true })` once.
 *      The `asResponse: true` flag is the cookieCache workaround
 *      documented in `packages/auth/integrations.md` §2 — without it,
 *      the cookie refresh `set-cookie` is silently dropped. The
 *      **official** Better Auth Hono integration docs (at
 *      `better-auth.com/docs/integrations/hono`) do NOT show this
 *      workaround — they only call `getSession({ headers })` directly
 *      and let the cookie refresh disappear. We're right to diverge;
 *      when Better Auth PR #9667 ("fix: forward session cookie refresh
 *      headers", open as of 2026-05-18) merges, we should switch from
 *      `asResponse: true` to the cleaner `returnHeaders: true` API
 *      the PR introduces.
 *   3. Propagate any `set-cookie` headers from the auth response back
 *      to Hono's response (cookieCache refresh + revocation flows).
 *   4. If a session exists, resolve the active org + member role via
 *      `auth.api.getFullOrganization({ headers })` +
 *      `auth.api.getActiveMemberRole({ headers })`. These are the
 *      **documented Better Auth server-side patterns** for org lookup
 *      — they read `session.activeOrganizationId` internally (no need
 *      to read it off the session type, which is incomplete in 1.6.19
 *      despite the column being in the schema).
 *   5. Stash the result on `c.get('authContext')` and `c.get('activeOrg')`.
 *      The oRPC `authMiddleware` reads `authContext` (no second
 *      `getSession` call). The oRPC `orgContextMiddleware` reads
 *      `activeOrg` (no second `getFullOrganization` call).
 *
 * Error handling: if `getSession` throws (DB down, etc.), log the error
 * via `console.error` and proceed with `authContext = null` and
 * `activeOrg = { id: null, slug: null, memberRole: null }`. The request
 * is treated as unauthenticated; the oRPC `authMiddleware` throws
 * `UNAUTHORIZED` for procedures that need a session. Errors never crash
 * the instance.
 *
 * If `getFullOrganization` throws but `getSession` succeeded, we still
 * propagate `authContext` but `activeOrg.id` is null — the oRPC
 * `orgContextMiddleware` then throws `FORBIDDEN` (no active org).
 *
 * Performance trade: 1 `getSession` + 1 `getFullOrganization` + 1
 * `getActiveMemberRole` per authenticated request. The org lookups are
 * cheap (DB read on indexed columns) and the responses are small.
 * Caching can come in M1 if a benchmark shows it matters; YAGNI now.
 *
 * Must run AFTER `requestIdMiddleware` and BEFORE any route that reads
 * `authContext` (i.e. all routes).
 *
 * @see docs/internal/architecture/11-packages/auth/integrations.md §2
 *      (the cookieCache workaround)
 * @see docs/internal/architecture/11-packages/auth/plugins.md
 *      (the `organization()` plugin endpoints)
 */
import type { MiddlewareHandler } from 'hono'
import { createClient } from '@deessejs/database'
import { auth, type Session, type User } from '@deessejs/auth'
import type { ActiveOrgInfo, AppVariables } from '../../types'
import { getActiveOrganization, getActiveMemberRole } from './auth-client'

/** Shape returned by `auth.api.getSession({ asResponse: true }).json()`. */
interface GetSessionJson {
  session?: Session
  user?: User
}

const EMPTY_ORG: ActiveOrgInfo = { id: null, slug: null, memberRole: null }

export const authContextMiddleware: MiddlewareHandler<{ Variables: AppVariables }> = async (c, next) => {
  // 1. Per-request Drizzle client
  c.set('db', createClient())

  // 2. Single getSession call. asResponse: true for cookieCache propagation.
  let authContext: AppVariables['authContext'] = null
  let activeOrg: ActiveOrgInfo = EMPTY_ORG

  try {
    const response = await auth.api.getSession({
      headers: c.req.raw.headers,
      asResponse: true,
    })

    // 3. Propagate set-cookie headers back to Hono's response
    for (const [key, value] of response.headers) {
      if (key.toLowerCase() === 'set-cookie') {
        c.header(key, value, { append: true })
      }
    }

    // 4. Parse session. If present, resolve the active org.
    const json = (await response.json()) as GetSessionJson | null
    if (json?.session && json?.user) {
      authContext = { session: json.session, user: json.user }

      // Resolve active org + role via Better Auth's documented APIs.
      // Use c.req.raw.headers (not response.headers — we don't want our
      // propagation to feed back into the org lookup).
      // See `./auth-client.ts` for why these calls are wrapped.
      try {
        const [fullOrg, memberRole] = await Promise.all([
          getActiveOrganization(c.req.raw.headers),
          getActiveMemberRole(c.req.raw.headers),
        ])
        activeOrg = {
          id: fullOrg?.id ?? null,
          slug: fullOrg?.slug ?? null,
          memberRole: memberRole ?? null,
        }
      } catch (orgErr) {
        // Org lookup failed — propagate authContext but null the org.
        // Procedures that require an org will get FORBIDDEN from
        // orgContextMiddleware.
        console.error(
          { err: orgErr, requestId: c.get('requestId') },
          'auth.api.getFullOrganization failed',
        )
      }
    }
  } catch (err) {
    // Request continues with authContext = null + activeOrg = empty.
    console.error({ err, requestId: c.get('requestId') }, 'auth.api.getSession failed')
  }

  c.set('authContext', authContext)
  c.set('activeOrg', activeOrg)
  await next()
}