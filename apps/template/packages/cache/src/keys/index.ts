/**
 * Key builders for every cache key in the monorepo.
 *
 * **Convention**: `{domain}:{entity}:{id}` (RedisX pattern).
 * Multi-tenant data uses `{domain}:{entity}:org_{orgId}:{id}` —
 * tenant in the middle (not at the start) so `redis-cli MONITOR`
 * shows which package is hitting Redis.
 *
 * All builders are `Object.freeze`d. TypeScript's `Readonly<typeof key>`
 * type catches mutations at compile time.
 *
 * Raw string keys are forbidden by ESLint convention (see the
 * regex check in the auth package's eslint.config.js). Every
 * consumer uses one of these builders.
 *
 * Lives in `keys/` (not `keys.ts`) because the file will grow as
 * the monorepo adds consumers. Future split by domain:
 *   `keys/auth.ts`  (session, otpCounter, rateLimitIp, apiKey)
 *   `keys/api.ts`   (orgRateLimit, apiKeyRateLimit)
 *   `keys/org.ts`   (orgSession, orgApiKey, orgCache)
 */

const normalizePath = (path: string): string =>
  path.replace(/\/+$/, '').replace(/[^a-zA-Z0-9/_\-.]/g, '_')

export const key = Object.freeze({
  // === Single-tenant (user-global) — auth package consumes ===

  /** Better Auth session cache. */
  session: (token: string): string => `auth:session:${token}`,

  /** Better Auth OTP attempt counter. */
  otpCounter: (identifier: string): string => `auth:otp:${identifier}`,

  /** Better Auth built-in rate limit (per IP + path). */
  rateLimitIp: (ip: string, path: string): string =>
    `auth:ratelimit:ip:${ip}:${normalizePath(path)}`,

  /** Better Auth API key lookup cache. */
  apiKey: (keyId: string): string => `auth:apikey:${keyId}`,

  // === Multi-tenant (tenant in the middle) ===

  /** Org-scoped Better Auth session cache. */
  orgSession: (orgId: string, token: string): string =>
    `auth:session:org_${orgId}:${token}`,

  /** Org-scoped Better Auth API key lookup cache. */
  orgApiKey: (orgId: string, keyId: string): string =>
    `auth:apikey:org_${orgId}:${keyId}`,

  /** Generic org-scoped cache (entity + id). */
  orgCache: (orgId: string, entity: string, id: string): string =>
    `org:cache:org_${orgId}:${entity}:${id}`,

  /** Rate limit per org per IP per path. */
  orgRateLimit: (orgId: string, ip: string, path: string): string =>
    `api:ratelimit:org_${orgId}:ip_${ip}:${normalizePath(path)}`,

  /** Rate limit per API key per path. */
  apiKeyRateLimit: (keyId: string, path: string): string =>
    `api:ratelimit:apikey_${keyId}:${normalizePath(path)}`,
})

/** Type of the key builder. Useful for tests and mocking. */
export type KeyBuilder = typeof key