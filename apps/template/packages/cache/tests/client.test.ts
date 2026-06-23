/**
 * Tests for `createRedisClient()` — the factory.
 *
 * Validates:
 *   - Default auto-detect (env vars present → Upstash, else → memory)
 *   - `force: 'memory'` always returns MemoryRedisClient
 *   - `force: 'upstash'` throws if env vars are missing
 *   - `isMemoryClient()` type guard narrows correctly
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { createRedisClient, isMemoryClient, MemoryRedisClient } from '../src/index'

describe('createRedisClient — auto-detect', () => {
  const originalUrl = process.env.UPSTASH_REDIS_REST_URL
  const originalToken = process.env.UPSTASH_REDIS_REST_TOKEN

  beforeEach(() => {
    delete process.env.UPSTASH_REDIS_REST_URL
    delete process.env.UPSTASH_REDIS_REST_TOKEN
  })

  afterEach(() => {
    if (originalUrl !== undefined) process.env.UPSTASH_REDIS_REST_URL = originalUrl
    if (originalToken !== undefined) process.env.UPSTASH_REDIS_REST_TOKEN = originalToken
  })

  it('returns MemoryRedisClient when no Upstash env vars are set', () => {
    const client = createRedisClient()
    expect(isMemoryClient(client)).toBe(true)
  })

  it('returns Upstash client when env vars are set', () => {
    process.env.UPSTASH_REDIS_REST_URL = 'https://example.upstash.io'
    process.env.UPSTASH_REDIS_REST_TOKEN = 'fake-token'
    const client = createRedisClient()
    expect(isMemoryClient(client)).toBe(false)
    expect(client).toBeDefined()  // would be an Upstash Redis instance
  })

  it('throws when only URL is set (no token)', () => {
    process.env.UPSTASH_REDIS_REST_URL = 'https://example.upstash.io'
    // No token — better to fail at construction than at request time.
    expect(() => createRedisClient()).toThrow(/UPSTASH_REDIS_REST_TOKEN/)
  })
})

describe('createRedisClient — force option', () => {
  beforeEach(() => {
    delete process.env.UPSTASH_REDIS_REST_URL
    delete process.env.UPSTASH_REDIS_REST_TOKEN
  })

  it('force: "memory" always returns memory (even if env vars present)', () => {
    process.env.UPSTASH_REDIS_REST_URL = 'https://example.upstash.io'
    process.env.UPSTASH_REDIS_REST_TOKEN = 'fake-token'
    const client = createRedisClient({ force: 'memory' })
    expect(isMemoryClient(client)).toBe(true)
  })

  it('force: "upstash" throws if env vars are missing', () => {
    expect(() => createRedisClient({ force: 'upstash' })).toThrow(
      /UPSTASH_REDIS_REST_URL/,
    )
  })

  it('force: "upstash" returns Upstash when env vars are set', () => {
    process.env.UPSTASH_REDIS_REST_URL = 'https://example.upstash.io'
    process.env.UPSTASH_REDIS_REST_TOKEN = 'fake-token'
    const client = createRedisClient({ force: 'upstash' })
    expect(isMemoryClient(client)).toBe(false)
  })
})

describe('isMemoryClient — type guard', () => {
  it('returns true for MemoryRedisClient', () => {
    const client = new MemoryRedisClient()
    expect(isMemoryClient(client)).toBe(true)
  })

  it('returns false for non-memory clients', () => {
    const fake = { get: () => Promise.resolve(null), set: () => Promise.resolve('OK'), del: () => Promise.resolve(0) } as never
    expect(isMemoryClient(fake)).toBe(false)
  })
})

describe('createRedisClient — end-to-end via memory', () => {
  it('round-trips a value through the memory backend', async () => {
    const client = createRedisClient({ force: 'memory' })
    await client.set('k', { hello: 'world' })
    expect(await client.get('k')).toEqual({ hello: 'world' })
  })

  it('round-trips a key built with the key builder', async () => {
    const { key } = await import('../src/index')
    const client = createRedisClient({ force: 'memory' })
    await client.set(key.orgSession('org_123', 'tok_abc'), 'session-data')
    expect(await client.get(key.orgSession('org_123', 'tok_abc'))).toBe('session-data')
  })
})