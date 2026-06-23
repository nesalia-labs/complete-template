/**
 * Hono mount for the oRPC OpenAPIHandler at /api/v1/* (the public REST
 * transport for the SDK, CLI, and third-party integrations).
 *
 * The `filter` option excludes procedures tagged `internal` from the
 * public OpenAPI spec — they stay accessible via `/rpc/*` (internal)
 * but don't leak into the spec at `/api/v1/spec.json`.
 *
 * The `OpenAPIReferencePlugin` (see `openapi.ts`) auto-serves:
 *   - The Scalar UI at `/api/v1/docs`.
 *   - The OpenAPI spec at `/api/v1/spec.json`.
 *
 * @see docs/internal/architecture/11-packages/api/structure.md#srchonohandlerts
 */
import { Hono } from 'hono'
import { OpenAPIHandler } from '@orpc/openapi/fetch'
import { onError } from '@orpc/server'
import { router } from '../router'
import { openApiReferencePlugin, customErrorResponseBodyEncoder } from './openapi'
import { apiCorsMiddleware } from '../middlewares/hono/cors'
import { logOrpcError } from '../errors/log'
import { buildOrpcContext } from './context'
import type { AppVariables } from '../types'

const handler = new OpenAPIHandler(router, {
  // Exclude internal-only procedures from the public OpenAPI spec.
  filter: ({ contract }) => !contract['~orpc'].route.tags?.includes('internal'),
  plugins: [openApiReferencePlugin],
  // customErrorResponseBodyEncoder is set on the constructor (per the
  // oRPC v1.14 docs at orpc.dev/docs/openapi/advanced/customizing-error-response),
  // NOT on handle() options. It reads the current requestId from
  // requestContext (AsyncLocalStorage) — see src/request-context.ts.
  customErrorResponseBodyEncoder,
  interceptors: [
    // Server-side log of procedure errors. The wire format on the public
    // REST surface is controlled by `customErrorResponseBodyEncoder` on
    // the handler (see src/hono/openapi.ts).
    onError((error) => logOrpcError(error)),
  ],
})

export const openApiRoutes = new Hono<{ Variables: AppVariables }>()

// CORS first.
openApiRoutes.use('/api/v1/*', apiCorsMiddleware)

openApiRoutes.use('/api/v1/*', async (c, next) => {
  const { matched, response } = await handler.handle(c.req.raw, {
    prefix: '/api/v1',
    context: buildOrpcContext(c),
  })
  if (matched) return c.newResponse(response.body, response)
  await next()
})