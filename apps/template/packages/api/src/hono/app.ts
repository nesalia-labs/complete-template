/**
 * The Hono app composition. Single source of truth for the runtime
 * request pipeline. Mounted by `apps/web` via `hono/vercel`'s `handle()`
 * adapter at `app/api/[[...route]]/route.ts`.
 *
 * Middleware order matters:
 *   1. `requestIdMiddleware`   — sets `c.get('requestId')`. Returned as
 *                                response header for client-side correlation.
 *   2. `authContextMiddleware` — creates `db`, calls `getSession` once,
 *                                populates `authContext` for oRPC.
 *   3. `rateLimitMiddleware`   — gates before any work (placeholder for M1).
 *   4. `logger()` (Hono built-in) — access log per request. ANSI-colored
 *                                in dev, plain in prod (set `NO_COLOR=1`
 *                                on Vercel). Two lines per request:
 *                                  <-- METHOD /path
 *                                  --> METHOD /path STATUS DURATION
 *
 * Routes are mounted after middleware so they see all populated variables.
 *
 * @see docs/internal/architecture/11-packages/api/hosting.md
 *      (the Next.js App Router catch-all mount)
 */
import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { requestIdMiddleware } from '../middlewares/hono/request-id'
import { authContextMiddleware } from '../middlewares/hono/auth-context'
import { rateLimitMiddleware } from '../middlewares/hono/rate-limit'
import { authRoutes } from './mount-auth'
import { rpcRoutes } from './mount-rpc'
import { openApiRoutes } from './mount-openapi'
import type { AppVariables } from '../types'

export const app = new Hono<{ Variables: AppVariables }>()

app.use('*', requestIdMiddleware)
app.use('*', authContextMiddleware)
app.use('*', rateLimitMiddleware)
app.use('*', logger())

app.route('/', authRoutes)     // /api/auth/*
app.route('/', rpcRoutes)      // /rpc/*
app.route('/', openApiRoutes)  // /api/v1/* + /api/v1/docs + /api/v1/spec.json