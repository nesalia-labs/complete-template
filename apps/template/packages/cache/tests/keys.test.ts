/**
 * Tests for the `key` builder.
 *
 * Validates the documented conventions:
 *   - Format: `{domain}:{entity}:{id}` (multi-tenant has tenant in middle)
 *   - Paths are normalized (trailing slashes stripped, unsafe chars replaced)
 *   - The exported object is frozen (mutations throw in strict mode)
 */
import { describe, it, expect } from 'vitest'
import { key } from '../src/keys'

describe('key builder — single-tenant', () => {
  it('session formats as auth:session:{token}', () => {
    expect(key.session('abc-123')).toBe('auth:session:abc-123')
  })

  it('otpCounter formats as auth:otp:{identifier}', () => {
    expect(key.otpCounter('user@example.com')).toBe('auth:otp:user@example.com')
  })

  it('apiKey formats as auth:apikey:{keyId}', () => {
    expect(key.apiKey('ak_xyz')).toBe('auth:apikey:ak_xyz')
  })

  it('rateLimitIp normalizes the path', () => {
    expect(key.rateLimitIp('1.2.3.4', '/api/auth/sign-in/email')).toBe(
      'auth:ratelimit:ip:1.2.3.4:/api/auth/sign-in/email',
    )
    expect(key.rateLimitIp('1.2.3.4', '/api/auth/sign-in/email/')).toBe(
      'auth:ratelimit:ip:1.2.3.4:/api/auth/sign-in/email',
    )
    // Query-string special chars (? = &) are normalized to '_'
    expect(key.rateLimitIp('1.2.3.4', '/api/v1?foo=bar&baz=qux')).toBe(
      'auth:ratelimit:ip:1.2.3.4:/api/v1_foo_bar_baz_qux',
    )
  })
})

describe('key builder — multi-tenant (tenant in the middle)', () => {
  it('orgSession puts tenant between entity and id', () => {
    expect(key.orgSession('org_123', 'tok')).toBe('auth:session:org_org_123:tok')
  })

  it('orgApiKey puts tenant between entity and id', () => {
    expect(key.orgApiKey('org_abc', 'ak_xyz')).toBe('auth:apikey:org_org_abc:ak_xyz')
  })

  it('orgCache puts tenant between entity and id', () => {
    expect(key.orgCache('org_1', 'user', 'u_2')).toBe('org:cache:org_org_1:user:u_2')
  })

  it('orgRateLimit puts tenant between entity and id', () => {
    expect(key.orgRateLimit('org_1', '1.2.3.4', '/api/v1/ping')).toBe(
      'api:ratelimit:org_org_1:ip_1.2.3.4:/api/v1/ping',
    )
  })

  it('apiKeyRateLimit uses keyId prefix', () => {
    expect(key.apiKeyRateLimit('ak_xyz', '/api/v1/users')).toBe(
      'api:ratelimit:apikey_ak_xyz:/api/v1/users',
    )
  })
})

describe('key builder — immutability', () => {
  it('throws on mutation (Object.freeze)', () => {
    expect(() => {
      // @ts-expect-error — testing runtime behavior despite TS error
      ;(key as unknown as { session: unknown }).session = 'hacked'
    }).toThrow()
  })

  it('exposes 9 builders', () => {
    // Alphabetical sort: 'org*' < 'otp*' (r < p at the 3rd char position)
    expect(Object.keys(key).sort()).toEqual([
      'apiKey',
      'apiKeyRateLimit',
      'orgApiKey',
      'orgCache',
      'orgRateLimit',
      'orgSession',
      'otpCounter',
      'rateLimitIp',
      'session',
    ])
  })
})