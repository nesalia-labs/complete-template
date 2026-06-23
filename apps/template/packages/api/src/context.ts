/**
 * The oRPC base context. Every procedure receives at least these fields.
 *
 * Fields:
 *   - `headers`: the raw Fetch API `Headers` from the incoming request.
 *     Used by `authMiddleware` to call `auth.api.getSession`.
 *   - `db`: the per-request Drizzle client (created in Hono `auth-context.ts`).
 *     Procedures read this via `context.db`, never import `drizzle-orm`.
 *   - `requestId`: the X-Request-Id (generated or propagated).
 *   - `authContext`: populated by the Hono `auth-context.ts` middleware after
 *     a single `getSession` call. Null if no session. The oRPC `authMiddleware`
 *     reads this (instead of calling `getSession` again) and propagates
 *     `session` + `user` into the execution context.
 *   - `activeOrg`: resolved active org + member role. Populated by the
 *     Hono middleware via `getFullOrganization` + `getActiveMemberRole`.
 *     `id` is null if no session, no active org, or the lookup failed.
 *
 * Per-procedure logging: each mount inlines an `onError` interceptor
 * that calls `logOrpcError()` from `src/errors/log.ts`. For richer
 * procedure-level instrumentation, use the `onStart` / `onSuccess` /
 * `onError` / `onFinish` hooks from `@orpc/server` (re-exported from
 * `src/middlewares/orpc/logger.ts`).
 * handles error logging via `console.error`. For richer procedure-level
 * instrumentation, use the `onStart` / `onSuccess` / `onError` / `onFinish`
 * hooks from `@orpc/server` (re-exported from `src/middlewares/orpc/logger.ts`).
 *
 * @see docs/internal/architecture/11-packages/api/structure.md#srccontextts-srcauthorizedts-srcpublicts--the-orpc-bases
 */
import { os } from '@orpc/server'
import type { Database } from '@deessejs/database'
import type { Session, User } from '@deessejs/auth'
import type { ActiveOrgInfo } from './types'

export interface ApiBaseContext {
  headers: Headers
  db: Database
  requestId: string
  /**
   * Populated by `src/middlewares/hono/auth-context.ts` (Hono middleware) via a
   * single `auth.api.getSession({ headers, asResponse: true })` call.
   * Null if the request is unauthenticated.
   */
  authContext: { session: Session; user: User } | null
  /** Resolved active org + role. See `types.ts`. */
  activeOrg: ActiveOrgInfo
}

export const base = os.$context<ApiBaseContext>()