/**
 * Hono middleware: rate limiting. **STUB — NOT IMPLEMENTED.**
 *
 * To be wired in M1 once the Upstash Redis integration ships. The plan:
 *   - Token bucket per `apiKeyId` (for /api/v1/*) — 100 req/min default.
 *   - Token bucket per `orgId` — 1000 req/min default.
 *   - Per-endpoint overrides (e.g. `webhooks.send = 10 req/min/key`).
 *   - Return 429 with `Retry-After` header.
 *
 * On the first request that hits this middleware (outside of tests), we
 * log a one-time WARN to surface that rate limiting is NOT enforced.
 * Without this, a missing rate limiter is silent — a buyer can DoS the
 * API and we'd only notice via Vercel's bill.
 *
 * @see docs/internal/architecture/11-packages/api/api-keys.md (spec 7.6)
 * @see .claude/agent-memory/tech-lead/project-package-implementation-state.md
 *      (auth `secondaryStorage` is also a no-op — must be wired before
 *      this can be wired)
 */
import type { MiddlewareHandler } from 'hono'

let warned = false

export const rateLimitMiddleware: MiddlewareHandler = async (c, next) => {
  if (!warned && process.env.NODE_ENV !== 'test') {
    warned = true
    console.warn(
      '[packages/api] rateLimitMiddleware is a STUB — rate limiting is NOT enforced. ' +
        'Wire it in M1 with Upstash Redis before exposing /api/v1/* publicly.',
    )
  }
  await next()
}