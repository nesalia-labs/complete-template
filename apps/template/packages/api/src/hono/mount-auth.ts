/**
 * Hono mount for Better Auth at /api/auth/*.
 *
 * The CORS policy is permissive (any localhost + any vercel.app preview +
 * the buyer app origin) because sign-in / sign-up / OAuth callbacks
 * come from many origins. `/api/v1/*` has a tighter policy (see
 * `src/middleware/cors.ts`).
 *
 * Critical: CORS middleware MUST be registered before the route handler,
 * otherwise the OPTIONS preflight is not handled and the browser blocks
 * the actual request.
 *
 * @see docs/internal/architecture/11-packages/auth/integrations.md §1
 *      (the Better Auth Hono mount pattern)
 */
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { auth } from '@deessejs/auth'

export const authRoutes = new Hono()

authRoutes.use(
  '/api/auth/*',
  cors({
    origin: (origin) => {
      if (!origin) return null
      if (origin === process.env.NEXT_PUBLIC_APP_URL) return origin
      if (origin.endsWith('.vercel.app')) return origin // preview deploys
      if (origin.startsWith('http://localhost:')) return origin // dev
      return null
    },
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true, // required for cookies
  }),
)

authRoutes.on(['POST', 'GET'], '/api/auth/*', (c) => auth.handler(c.req.raw))