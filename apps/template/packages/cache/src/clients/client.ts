/**
 * `createRedisClient()` factory.
 *
 * Picks the right backend based on env + caller intent:
 *   - `force: 'memory'` → MemoryRedisClient (always)
 *   - `force: 'upstash'` → UpstashRedis (requires env vars, throws if missing)
 *   - No force, `UPSTASH_REDIS_REST_URL` set → UpstashRedis (prod)
 *   - No force, no env vars → MemoryRedisClient (dev / tests)
 *
 * The auto-detect path is what makes `createRedisClient()` usable in
 * tests without any setup. The `force` option is the escape hatch
 * for tests that explicitly want memory even when env vars are set.
 */
import { Redis as UpstashRedis } from '@upstash/redis'
import { MemoryRedisClient } from './memory'
import type { RedisLike } from '../types'

export interface CreateRedisClientOptions {
  /**
   * Force a specific backend. Defaults to auto-detect via env.
   * - 'memory' → MemoryRedisClient (no env needed)
   * - 'upstash' → UpstashRedis (env required)
   */
  force?: 'memory' | 'upstash'
}

export function createRedisClient(
  opts: CreateRedisClientOptions = {},
): RedisLike {
  if (opts.force === 'memory') return new MemoryRedisClient()
  if (opts.force === 'upstash') return makeUpstashClient()

  // Auto-detect: env vars present → Upstash, else → memory.
  if (process.env.UPSTASH_REDIS_REST_URL) return makeUpstashClient()
  return new MemoryRedisClient()
}

/**
 * Construct the Upstash REST client. Throws if env vars are missing
 * — we don't silently fall back to memory in this path because that
 * would hide production misconfig.
 */
function makeUpstashClient(): RedisLike {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) {
    throw new Error(
      'createRedisClient: UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN ' +
        'are required when the Upstash client is selected (env vars present ' +
        'or `force: "upstash"`).',
    )
  }
  // The cast is necessary because @upstash/redis's Redis class has
  // ~50 methods; we only consume 5-7. The structural RedisLike type
  // captures our subset and lets us swap implementations without code
  // changes. The runtime behavior matches.
  return new UpstashRedis({ url, token }) as unknown as RedisLike
}