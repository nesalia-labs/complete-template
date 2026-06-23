/**
 * Public surface of `@deessejs/api`. What `apps/web` and feature modules
 * import.
 *
 * The surface is intentionally narrow:
 *   - `app` — the Hono app, mounted by `apps/web` at `/api/*`.
 *   - `router` — the oRPC router, consumed by the type-safe client and
 *     the SDK generator.
 *   - Procedure builders — `publicProcedure`, `sessionOnly`, `authorized`.
 *   - Middlewares — for advanced custom composition.
 *   - Errors — `ORPCError` for procedures, types for consumers.
 *
 * Logging: Hono's built-in `logger()` middleware handles the access log
 * (registered in `src/hono/app.ts`). For procedure-level instrumentation,
 * use the oRPC `onStart` / `onSuccess` / `onError` / `onFinish` hooks
 * (re-exported below) with `console.log` / `console.error`.
 *
 * Per docs/internal/architecture/11-packages/api/README.md#surface.
 */

// === Hono app + oRPC router ===
export { app } from './hono/app'
export { router } from './router'

// === Procedure builders ===
export { base, publicProcedure, sessionOnly, authorized } from './authorized'
export type { ApiBaseContext } from './context'

// === oRPC middlewares (for advanced custom composition) ===
export { authMiddleware } from './middlewares/orpc/auth'
export { orgContextMiddleware } from './middlewares/orpc/org-context'
export { onStart, onSuccess, onError, onFinish } from './middlewares/orpc/logger'

// === Hono middlewares (for advanced custom composition in apps/web) ===
export { requestIdMiddleware } from './middlewares/hono/request-id'
export { authContextMiddleware } from './middlewares/hono/auth-context'
export { rateLimitMiddleware } from './middlewares/hono/rate-limit'
export { apiCorsMiddleware } from './middlewares/hono/cors'

// === Errors ===
export { ORPCError } from './errors/taxonomy'
export type { WireError } from './errors/serializer'
export type { WireErrorCode } from './errors/codes'

// === Types ===
export type { AppVariables } from './types'