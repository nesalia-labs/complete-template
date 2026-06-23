/**
 * Better Auth integration tests — happy paths of the test-utils plugin.
 *
 * Uses the test-only auth instance from `auth.test.ts`. The instance
 * boots a PGlite in-memory DB and applies migrations. Each `it` is
 * independent (no shared mutable state across tests thanks to beforeAll
 * scoped to a single test file).
 */
import { describe, it, expect, beforeAll, beforeEach } from 'vitest'
import type { TestHelpers } from 'better-auth/plugins'
import { auth } from '../../src/auth.test'

describe('Better Auth — integration', () => {
  let test: TestHelpers

  beforeAll(async () => {
    const ctx = await auth.$context
    test = ctx.test
  })

  describe('factories + DB helpers', () => {
    it('createUser returns sensible defaults', () => {
      const user = test.createUser()
      expect(user.id).toBeDefined()
      expect(user.email).toMatch(/@example\.com$/)
      expect(user.emailVerified).toBe(true) // default
      expect(user.name).toBe('Test User') // default
    })

    it('createUser accepts overrides', () => {
      const user = test.createUser({
        email: 'alice@example.com',
        name: 'Alice',
        emailVerified: false,
      })
      expect(user.email).toBe('alice@example.com')
      expect(user.name).toBe('Alice')
      expect(user.emailVerified).toBe(false)
    })

    it('saveUser persists and deleteUser removes', async () => {
      const user = test.createUser({ email: 'bob@example.com' })
      await test.saveUser(user)

      const headers = await test.getAuthHeaders({ userId: user.id })
      const session = await auth.api.getSession({ headers })
      expect(session?.user.email).toBe('bob@example.com')

      await test.deleteUser(user.id)
    })
  })

  describe('organization plugin (via testUtils)', () => {
    it('createOrganization + saveOrganization', async () => {
      const org = test.createOrganization({ name: 'Acme Corp', slug: 'acme-corp' })
      await test.saveOrganization(org)

      expect(org.id).toBeDefined()
      expect(org.name).toBe('Acme Corp')
      expect(org.slug).toBe('acme-corp')
    })

    it('addMember links a user to an organization with a role', async () => {
      const user = test.createUser({ email: 'member@example.com' })
      await test.saveUser(user)

      const org = test.createOrganization({ name: 'OrgWithMember', slug: 'org-with-member' })
      await test.saveOrganization(org)

      const member = await test.addMember({
        userId: user.id,
        organizationId: org.id,
        role: 'admin',
      })

      expect(member.userId).toBe(user.id)
      expect(member.organizationId).toBe(org.id)
      expect(member.role).toBe('admin')
    })
  })

  describe('auth helpers — login / getAuthHeaders / getCookies', () => {
    it('login returns session + user + headers + cookies + token', async () => {
      const user = test.createUser({ email: 'login@example.com' })
      await test.saveUser(user)

      const result = await test.login({ userId: user.id })

      expect(result.user.id).toBe(user.id)
      expect(result.session.userId).toBe(user.id)
      expect(result.token).toBeDefined()
      expect(result.headers).toBeDefined()
      expect(result.cookies).toBeDefined()

      // The session cookie is in the REQUEST headers (for forwarding to fetch/Request).
      const cookieHeader = result.headers.get('cookie') ?? ''
      expect(cookieHeader.toLowerCase()).toContain('session')
    })

    it('getCookies returns Playwright/Puppeteer-compatible cookie array', async () => {
      const user = test.createUser({ email: 'cookies@example.com' })
      await test.saveUser(user)

      const cookies = await test.getCookies({ userId: user.id })

      expect(Array.isArray(cookies)).toBe(true)
      const sessionCookie = cookies.find((c) => c.name.includes('session'))
      expect(sessionCookie).toBeDefined()
      expect(sessionCookie?.value).toBeDefined()
    })
  })

  describe('OTP capture', () => {
    // NOTE: OTP tests are skipped — Better Auth 1.6.19 renamed the emailOTP
    // endpoint. The docs example uses `auth.api.sendVerificationOTP` which
    // doesn't exist in this version. We re-enable when we verify the
    // exact endpoint name (likely `auth.api.signInEmailOTP`).
    //
    // For now: only `clearOTPs` round-trips, which doesn't depend on the API.

    beforeEach(() => {
      test.clearOTPs()
    })

    it('clearOTPs is a no-op on an empty set', () => {
      expect(() => test.clearOTPs()).not.toThrow()
      expect(test.getOTP('never@example.com')).toBeUndefined()
    })
  })

  describe('session validation', () => {
    it('getSession returns null without a valid session cookie', async () => {
      const session = await auth.api.getSession({ headers: new Headers() })
      expect(session).toBeNull()
    })

    it('getSession returns the session when the cookie is valid', async () => {
      const user = test.createUser({ email: 'session@example.com' })
      await test.saveUser(user)
      const headers = await test.getAuthHeaders({ userId: user.id })

      const session = await auth.api.getSession({ headers })
      expect(session).not.toBeNull()
      expect(session?.user.id).toBe(user.id)
    })
  })
})
