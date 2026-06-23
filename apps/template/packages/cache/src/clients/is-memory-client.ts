/**
 * Type guard for `MemoryRedisClient`.
 *
 * Lives in its own file (not `clients/index.ts`) because
 * `MemoryRedisClient` is a class — classes are NOT hoisted, but
 * `instanceof` requires the class binding to exist at module
 * evaluation. Re-exports don't bring the class name into the local
 * scope, so the guard must live where the import is local.
 */
import type { RedisLike } from '../types'
import { MemoryRedisClient } from './memory'

export function isMemoryClient(
  client: RedisLike,
): client is MemoryRedisClient {
  return client instanceof MemoryRedisClient
}