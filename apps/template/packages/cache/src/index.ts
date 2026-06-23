/**
 * Public surface of `@deessejs/cache`.
 *
 * Re-exports for consumers:
 *   - `createRedisClient` — the factory
 *   - `key` — typed, multi-tenant-aware key builder
 *   - `MemoryRedisClient` — the in-memory backend
 *   - `RedisLike` — the structural type we consume from `@upstash/redis`
 *   - `Redis` (re-export) — for callers that need the full Upstash type
 *   - `isMemoryClient` — type guard for test introspection
 *
 * NOT exported:
 *   - A `Cache` interface (we don't have one; use `RedisLike`)
 *   - Driver abstractions (no `CacheDriver`; just the factory)
 *
 * @see docs/internal/architecture/11-packages/cache/README.md
 * @see docs/internal/architecture/11-packages/cache/decisions/0001-why-now.md
 */

export type { RedisLike } from './types'
export { key, type KeyBuilder } from './keys'
export { MemoryRedisClient } from './clients/memory'
export {
  createRedisClient,
  type CreateRedisClientOptions,
} from './clients/client'
export { isMemoryClient } from './clients/is-memory-client'

// Re-export the Upstash Redis type for consumers that need it
// (e.g. to type a parameter that's passed to Upstash-specific APIs).
export type { Redis } from '@upstash/redis'