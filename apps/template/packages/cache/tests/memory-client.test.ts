/**
 * Tests for `MemoryRedisClient` — the in-memory backend.
 *
 * Validates that the memory client behaves like Upstash for the
 * methods we consume:
 *   - get returns null on miss, JSON-parses on hit, returns null on
 *     decode error
 *   - set stores JSON-serialized values, honors TTL
 *   - del returns 1 if existed, 0 otherwise (idempotent)
 *   - expire sets TTL on existing keys, returns 0 for missing
 *   - scan/keys match glob patterns
 *   - clear/size are test-only helpers
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { MemoryRedisClient } from '../src/clients/memory'

describe('MemoryRedisClient — get/set/del', () => {
  let redis: MemoryRedisClient

  beforeEach(() => {
    redis = new MemoryRedisClient()
  })

  it('get returns null on miss', async () => {
    expect(await redis.get('missing')).toBeNull()
  })

  it('set + get round-trips a JSON object', async () => {
    await redis.set('user:1', { name: 'Alice', age: 30 })
    expect(await redis.get('user:1')).toEqual({ name: 'Alice', age: 30 })
  })

  it('set + get round-trips a string (auto-JSON-encodes)', async () => {
    await redis.set('k', 'hello')
    expect(await redis.get('k')).toBe('hello')
  })

  it('set + get round-trips a number', async () => {
    await redis.set('n', 42)
    expect(await redis.get('n')).toBe(42)
  })

  it('get returns null on JSON decode error (matches Upstash)', async () => {
    // Directly poison the store with malformed JSON
    ;(redis as unknown as { store: Map<string, string> }).store.set('bad', '{not json')
    expect(await redis.get('bad')).toBeNull()
  })

  it('del returns 1 for an existing key', async () => {
    await redis.set('k', 'v')
    expect(await redis.del('k')).toBe(1)
  })

  it('del returns 0 for a missing key', async () => {
    expect(await redis.del('missing')).toBe(0)
  })

  it('del is idempotent (calling twice returns 0 the second time)', async () => {
    await redis.set('k', 'v')
    expect(await redis.del('k')).toBe(1)
    expect(await redis.del('k')).toBe(0)
  })
})

describe('MemoryRedisClient — TTL', () => {
  let redis: MemoryRedisClient

  beforeEach(() => {
    redis = new MemoryRedisClient()
  })

  it('returns the value within the TTL', async () => {
    await redis.set('k', 'v', { ex: 10 })
    expect(await redis.get('k')).toBe('v')
  })

  it('returns null after the TTL expires', async () => {
    await redis.set('k', 'v', { ex: 1 })
    expect(await redis.get('k')).toBe('v')
    await new Promise((r) => setTimeout(r, 1100))
    expect(await redis.get('k')).toBeNull()
  })

  it('no TTL means the value persists', async () => {
    await redis.set('k', 'v')
    // Wait a moment — value should still be there
    await new Promise((r) => setTimeout(r, 50))
    expect(await redis.get('k')).toBe('v')
  })

  it('expire on existing key returns 1 and applies TTL', async () => {
    await redis.set('k', 'v')
    expect(await redis.expire('k', 1)).toBe(1)
    await new Promise((r) => setTimeout(r, 1100))
    expect(await redis.get('k')).toBeNull()
  })

  it('expire on missing key returns 0', async () => {
    expect(await redis.expire('missing', 60)).toBe(0)
  })
})

describe('MemoryRedisClient — scan/keys', () => {
  let redis: MemoryRedisClient

  beforeEach(() => {
    redis = new MemoryRedisClient()
  })

  it('keys matches a wildcard glob', async () => {
    await redis.set('auth:session:a', '1')
    await redis.set('auth:session:b', '2')
    await redis.set('api:cache:x', '3')
    expect((await redis.keys('auth:session:*')).sort()).toEqual([
      'auth:session:a',
      'auth:session:b',
    ])
  })

  it('keys matches a single-character glob', async () => {
    await redis.set('k1', 'a')
    await redis.set('k2', 'b')
    await redis.set('k10', 'c')
    expect((await redis.keys('k?')).sort()).toEqual(['k1', 'k2'])
  })

  it('scan returns cursor=0 and matching keys', async () => {
    await redis.set('auth:session:a', '1')
    await redis.set('auth:session:b', '2')
    const [cursor, keys] = await redis.scan(0, { match: 'auth:*' })
    expect(cursor).toBe(0)
    expect(keys.sort()).toEqual(['auth:session:a', 'auth:session:b'])
  })

  it('keys returns empty for no matches', async () => {
    await redis.set('a', '1')
    expect(await redis.keys('nope:*')).toEqual([])
  })
})

describe('MemoryRedisClient — test helpers', () => {
  it('clear removes all entries', async () => {
    const redis = new MemoryRedisClient()
    await redis.set('a', '1')
    await redis.set('b', '2')
    expect(redis.size()).toBe(2)
    redis.clear()
    expect(redis.size()).toBe(0)
  })

  it('size counts non-expired entries only', async () => {
    const redis = new MemoryRedisClient()
    await redis.set('a', '1')
    await redis.set('b', '2', { ex: 1 })
    expect(redis.size()).toBe(2)
    await new Promise((r) => setTimeout(r, 1100))
    // b is expired; size() cleans expired entries and returns 1
    expect(redis.size()).toBe(1)
  })

  it('size returns 0 for a fresh client', () => {
    const redis = new MemoryRedisClient()
    expect(redis.size()).toBe(0)
  })
})