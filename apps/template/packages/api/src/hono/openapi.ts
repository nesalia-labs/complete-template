/**
 * Configuration of the `OpenAPIHandler` and its plugins.
 *
 * Exports:
 *   - `openApiReferencePlugin` — the `OpenAPIReferencePlugin` (Scalar UI +
 *     spec endpoint). Configured for our mount at `/api/v1/*` → docs at
 *     `/api/v1/docs` + spec at `/api/v1/spec.json`.
 *   - `customErrorResponseBodyEncoder` — the option on `OpenAPIHandler`
 *     constructor that reshapes `ORPCError` instances into our public
 *     wire shape:
 *
 *       {
 *         code: 'unauthenticated' | 'forbidden' | 'not_found' | ...,
 *         message: string,
 *         details?: unknown,
 *         requestId: string,    ← read from AsyncLocalStorage
 *       }
 *
 * The encoder runs OUTSIDE the Hono middleware chain (it's invoked
 * synchronously by oRPC's error-encoding path). To access per-request
 * state — specifically the requestId — we read from
 * `requestContext` (an `AsyncLocalStorage` instance) which is set by
 * `requestIdMiddleware` at the top of every request.
 *
 * @see docs/internal/architecture/11-packages/api/structure.md#srchonohandlerts
 * @see https://orpc.dev/docs/openapi/advanced/customizing-error-response
 */
import { OpenAPIReferencePlugin } from '@orpc/openapi/plugins'
import { ZodToJsonSchemaConverter } from '@orpc/zod/zod4'
import { ORPCError } from '@orpc/server'
import { serializeOrpcError } from '../errors/serializer'
import { requestContext } from '../request-context'

export const openApiReferencePlugin = new OpenAPIReferencePlugin({
  docsProvider: 'scalar',
  // Explicit paths so the docs and spec are predictable URLs regardless
  // of where the OpenAPIHandler is mounted. With the handler mounted at
  // `/api/v1/*` in `mount-openapi.ts`, these become `/api/v1/docs` and
  // `/api/v1/spec.json` respectively.
  docsPath: '/docs',
  specPath: '/spec.json',
  schemaConverters: [new ZodToJsonSchemaConverter()],
  specGenerateOptions: {
    info: {
      title: 'DeesseJS API',
      version: '0.1.0',
    },
    servers: [{ url: '/api/v1' }],
  },
})

/**
 * Type alias for the encoder callback. Matches oRPC's
 * `customErrorResponseBodyEncoder` signature exactly (per
 * `packages/openapi/src/adapters/standard/openapi-codec.ts:16-22`).
 *
 * The oRPC signature uses `any` for the generic parameters (we can't
 * improve on that — oRPC's `ORPCError` generic is `ORPCError<TDefs,
 * TCodes>` and the encoder doesn't constrain either). We mirror it as
 * a structural type so the encoder's surface is clearly documented.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ErrorResponseBodyEncoder = (error: ORPCError<any, any>) => unknown

/**
 * The single `customErrorResponseBodyEncoder` passed to `OpenAPIHandler`.
 * Defined at module load — there is ONE for the lifetime of the process.
 * Reads the current `requestId` from `requestContext` (AsyncLocalStorage)
 * at error-encoding time, NOT from a closure parameter.
 *
 * If the value passed to oRPC is not an `ORPCError` instance, we return
 * `undefined` (oRPC's default behavior is then to call `error.toJSON()`).
 *
 * Returns `WireError | undefined` cast as `unknown` to match oRPC's
 * expected return type.
 */
export const customErrorResponseBodyEncoder: ErrorResponseBodyEncoder = (
  error: unknown,
) => {
  if (!(error instanceof ORPCError)) return undefined
  const requestId = requestContext.getStore()?.requestId ?? 'unknown'
  return serializeOrpcError(error, requestId)
}