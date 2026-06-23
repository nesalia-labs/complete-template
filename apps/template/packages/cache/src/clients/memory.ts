/**
 * In-memory Upstash-compatible Redis client.
 *
 * Used in:
 *   - Tests (deterministic, no env, no network)
 *   - Local dev (no Upstash credentials configured)
 *   - Anywhere `createRedisClient({ force: 'memory' })` is called
 *
 * Same method signatures and return shapes as `@upstash/redis`. Values
 * are JSON-serialized (matching what we'd send over the wire to
 * Upstash). TTL is honored via a separate expiry map (cleaned on
 * read — no background sweeper).
 *
 * Test-only methods (`clear`, `size`) are exposed on the class so
 * tests can introspect and reset state. The `RedisLike` interface
 * doesn't expose them; consumers use the `isMemoryClient()` type
 * guard to access them.
 */
import type { RedisLike } from '../types'

export class MemoryRedisClient implements RedisLike {
  private store = new Map<string, string>()
  private expiresAt = new Map<string, number>()

  async get<T = unknown>(key: string): Promise<T | null> {
    if (this.isExpired(key)) {
      this.store.delete(key)
      this.expiresAt.delete(key)
      return null
    }
    const raw = this.store.get(key)
    if (raw === undefined) return null
    try {
      return JSON.parse(raw) as T
    } catch {
      // Decode error — treat as miss (matches Upstash's expected
      // semantics for malformed JSON).
      return null
    }
  }

  async set<T>(
    key: string,
    value: T,
    opts?: { ex?: number },
  ): Promise<'OK' | null> {
    this.store.set(key, JSON.stringify(value))
    if (opts?.ex) {
      this.expiresAt.set(key, Date.now() + opts.ex * 1000)
    } else {
      this.expiresAt.delete(key)
    }
    return 'OK'
  }

  async del(key: string): Promise<number> {
    const had = this.store.delete(key)
    this.expiresAt.delete(key)
    return had ? 1 : 0
  }

  async expire(key: string, seconds: number): Promise<number> {
    if (!this.store.has(key)) return 0
    this.expiresAt.set(key, Date.now() + seconds * 1000)
    return 1
  }

  async scan(
    _cursor: number,
    opts: { match: string; count?: number },
  ): Promise<[number, string[]]> {
    const regex = globToRegex(opts.match)
    const matches: string[] = []
    for (const key of this.store.keys()) {
      if (regex.test(key)) matches.push(key)
    }
    return [0, matches]
  }

  async keys(pattern: string): Promise<string[]> {
    const [, keys] = await this.scan(0, { match: pattern })
    return keys
  }

  private isExpired(key: string): boolean {
    const expiresAt = this.expiresAt.get(key)
    return expiresAt !== undefined && Date.now() >= expiresAt
  }

  // === Test-only methods (not on RedisLike) ===

  /** Clears all stored keys. Used in test `afterEach`. */
  clear(): void {
    this.store.clear()
    this.expiresAt.clear()
  }

  /** Returns the number of stored keys (excluding expired). */
  size(): number {
    // Clean expired entries first so the count is honest.
    for (const key of this.store.keys()) {
      if (this.isExpired(key)) {
        this.store.delete(key)
        this.expiresAt.delete(key)
      }
    }
    return this.store.size
  }
}

/**
 * Convert a Redis glob pattern (`*`, `?`) to a JavaScript RegExp.
 * `*` matches any sequence (including empty); `?` matches a single
 * character. All other regex metacharacters are escaped.
 *
 * Handles the patterns we generate (`auth:session:*`, `api:ratelimit:*`).
 * Does NOT handle the full Redis glob syntax (`[abc]`, escapes, etc.)
 * — extend if a future consumer needs it.
 */
function globToRegex(pattern: string): RegExp {
  let regex = '^'
  for (const ch of pattern) {
    if (ch === '*') regex += '.*'
    else if (ch === '?') regex += '.'
    else if ('\\^$.|+()[]{}'.includes(ch)) regex += '\\' + ch
    else regex += ch
  }
  regex += '$'
  return new RegExp(regex)
}