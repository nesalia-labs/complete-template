/**
 * Public surface of `@deessejs/auth`. This is what `packages/api` and
 * `apps/web` import.
 *
 * Consumers get:
 *   - `auth` — the configured Better Auth instance (handler, api).
 *   - `Auth`, `Session`, `User` — inferred types for the AuthContext.
 *   - `STATEMENTS` — the RBAC permission matrix (for procedure-level checks).
 *   - `ac`, `owner`, `admin`, `member`, `billing` — the access control
 *     instance and roles.
 */

// The configured instance + inferred types
export { auth, type Auth, type Session, type User } from './auth'

// Access control (RBAC)
export { ac, owner, admin, member, billing, STATEMENTS } from './access-control'
