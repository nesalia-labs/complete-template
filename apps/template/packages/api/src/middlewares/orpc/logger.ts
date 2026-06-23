/**
 * oRPC procedure-level logger middleware, built from the built-in
 * `onStart` / `onSuccess` / `onError` / `onFinish` hooks.
 *
 * Composition pattern: each hook is a middleware, composed per-procedure
 * via `.use(...)`. Example:
 *
 * ```ts
 * import { onStart, onSuccess, onError } from '@deessejs/api'
 *
 * export const myProcedure = authorized
 *   .use(onStart(({ context, path }) => context.log.debug({ path }, 'start')))
 *   .use(onSuccess(({ context, path, duration }) => context.log.info({ path, duration }, 'success')))
 *   .use(onError(({ context, path, error }) => context.log.warn({ path, err: error }, 'error')))
 *   .handler(...)
 * ```
 *
 * Why per-procedure and not a global middleware: the build-time impact
 * is zero (each `.use(...)` is tree-shaken if unused), and the hook
 * granularity matches what we want to instrument (we don't log every
 * procedure by default — only the slow / critical ones).
 *
 * Re-exported as a barrel from `src/middlewares/orpc/logger.ts` so consumers
 * import from one place.
 *
 * @see docs/internal/architecture/11-packages/api/structure.md#srcmiddlewares--the-middleware-layer
 */
export { onStart, onSuccess, onError, onFinish } from '@orpc/server'