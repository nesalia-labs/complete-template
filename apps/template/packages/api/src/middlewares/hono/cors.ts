/**
 * Hono middleware: CORS for /api/v1/*.
 *
 * Origin policy (matches `packages/auth/integrations.md` §1):
 *   - The buyer app's origin (NEXT_PUBLIC_APP_URL).
 *   - Vercel preview deploys (*.vercel.app).
 *   - Localhost in dev (http://localhost:*).
 *
 * The Better Auth mount has its OWN CORS (more permissive, since it
 * serves sign-in / sign-up from any preview deploy). See
 * `../../hono/mount-auth.ts`.
 *
 * `credentials: true` is REQUIRED for cookies to flow on cross-origin
 * requests. Pair with SameSite=Lax on the cookie (Better Auth default).
 */
import { cors } from 'hono/cors'
import type { MiddlewareHandler } from 'hono'

export const apiCorsMiddleware: MiddlewareHandler = cors({
  origin: (origin) => {
    if (!origin) return null
    if (origin === process.env.NEXT_PUBLIC_APP_URL) return origin
    if (origin.endsWith('.vercel.app')) return origin // preview deploys
    if (origin.startsWith('http://localhost:')) return origin // dev
    return null
  },
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['POST', 'GET', 'OPTIONS', 'PATCH', 'PUT', 'DELETE'],
  exposeHeaders: ['Content-Length', 'Retry-After'],
  maxAge: 600,
  credentials: true,
})