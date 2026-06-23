/**
 * Hono mount for the oRPC RPCHandler at /rpc/* (the internal transport
 * for `apps/web`).
 *
 * The body-parser proxy is MANDATORY. Without it, Hono reads the request
 * body before oRPC gets it, which throws "Body already used". The proxy
 * forwards `arrayBuffer` / `blob` / `formData` / `json` / `text` calls
 * to Hono's parsers (which buffer the body) and lets oRPC use them.
 *
 * @see docs/internal/architecture/11-packages/api/structure.md#srcorpcmountts
 * @see https://orpc.dev/docs/adapters/hono (the official Hono adapter guide)
 */
import { Hono } from 'hono'
import { RPCHandler } from '@orpc/server/fetch'
import { CORSPlugin } from '@orpc/server/plugins'
import { onError } from '@orpc/server'
import { router } from '../router'
import { apiCorsMiddleware } from '../middlewares/hono/cors'
import { logOrpcError } from '../errors/log'
import { buildOrpcContext } from './context'
import type { AppVariables } from '../types'

const BODY_PARSER_METHODS = new Set([
  'arrayBuffer',
  'blob',
  'formData',
  'json',
  'text',
] as const)
type BodyParserMethod = (typeof BODY_PARSER_METHODS) extends Set<infer T> ? T : never

const handler = new RPCHandler(router, {
  plugins: [new CORSPlugin()],
  interceptors: [
    // Server-side log of procedure errors. Per-request error shape
    // (wire format) is controlled separately by OpenAPIHandler's
    // customErrorResponseBodyEncoder — see src/hono/openapi.ts.
    onError((error) => logOrpcError(error)),
  ],
})

export const rpcRoutes = new Hono<{ Variables: AppVariables }>()

// CORS first (preflight must be handled before the route runs).
rpcRoutes.use('/rpc/*', apiCorsMiddleware)

rpcRoutes.use('/rpc/*', async (c, next) => {
  // Body-parser proxy: forward oRPC's body parsers to Hono's parsers.
  const request = new Proxy(c.req.raw, {
    get(target, prop) {
      if (BODY_PARSER_METHODS.has(prop as BodyParserMethod)) {
        return () => c.req[prop as BodyParserMethod]()
      }
      return Reflect.get(target, prop, target)
    },
  })

  const { matched, response } = await handler.handle(request, {
    prefix: '/rpc',
    context: buildOrpcContext(c),
  })

  if (matched) return c.newResponse(response.body, response)
  await next()
})