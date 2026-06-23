/**
 * The subset of `@upstash/redis` we consume.
 *
 * Captured as a structural type so the in-memory implementation
 * (`MemoryRedisClient`) doesn't need to extend the real `Redis` class
 * — which would require implementing dozens of unused methods just to
 * satisfy `instanceof` checks at call sites.
 *
 * Methods we DON'T need (pipeline, multi-key del, pub/sub) are not
 * listed. Add them here when a consumer needs them.
 *
 * The return types match `@upstash/redis` exactly so consumers can
 * swap implementations without code changes.
 */
export interface RedisLike {
  /**
   * Get the value at `key`. Returns `null` on miss, decode error, or
   * (in the in-memory implementation) expired keys. Consumers
   * MUST handle `null` as a cache miss, not an error.
   *
   * Note: the real `@upstash/redis` REJECTS on network errors and
   * decode errors. Consumers that want "treat all errors as miss"
   * should wrap in try/catch. See `conventions.md` §3.
   */
  get<T = unknown>(key: string): Promise<T | null>

  /**
   * Set `key` to `value` (JSON-serialized). `opts.ex` is TTL in seconds.
   * Returns 'OK' on success, null if the driver declined (e.g. NX
   * option failed — we don't expose NX in v1, so always 'OK').
   */
  set<T>(key: string, value: T, opts?: { ex?: number }): Promise<'OK' | null>

  /**
   * Delete `key`. Returns 1 if it existed, 0 otherwise. Idempotent.
   */
  del(key: string): Promise<number>

  /**
   * Optional: set TTL on an existing key (in seconds). Returns 1 if
   * the key exists, 0 otherwise. Used by the GDPR purge helper.
   */
  expire?(key: string, seconds: number): Promise<number>

  /**
   * Optional: cursor-based SCAN. Returns `[nextCursor, keys]`. The
   * in-memory client returns cursor=0 always (it has no pagination).
   * Used by the GDPR purge helper and observability tooling.
   */
  scan?(
    cursor: number,
    opts: { match: string; count?: number },
  ): Promise<[number, string[]]>

  /**
   * Optional: non-paginated KEYS. Used by the GDPR purge helper for
   * small-org cleanup. Don't use for large keyspaces (use `scan`).
   */
  keys?(pattern: string): Promise<string[]>
}