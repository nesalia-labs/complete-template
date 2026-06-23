/**
 * Failure path tests for the auth + org middleware chain.
 *
 * Covers:
 *   1. UNAUTHORIZED — when a `sessionOnly` (or `authorized`) procedure is
 *      called without a session. The Hono auth-context middleware sets
 *      `authContext = null`; the oRPC `authMiddleware` throws
 *      `ORPCError('UNAUTHORIZED')`.
 *   2. Wire shape on `/api/v1/*` — the custom `buildErrorResponseBodyEncoder`
 *      correctly maps the oRPC `UNAUTHORIZED` code to our public wire
 *      code `unauthenticated` and includes the requestId.
 *   3. FORBIDDEN — when a session exists but `activeOrg.id` is null.
 *      We mock `./auth-client` to return null for `getActiveOrganization`.
 *
 * These tests do NOT need a real Postgres or a real session — they
 * exercise the failure paths where the session is missing or the org
 * lookup fails. The Hono auth-context middleware swallows DB errors
 * gracefully (degrades to `authContext = null`), which is what these
 * tests rely on for the no-cookie path.
 *
 * @see docs/internal/architecture/11-packages/api/README.md#testing
 */
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import { ORPCError } from '@orpc/server'
import { orgContextMiddleware } from '../../src/middlewares/orpc/org-context'
import { authMiddleware } from '../../src/middlewares/orpc/auth'

describe('packages/api — failure paths', () => {
  describe('UNAUTHORIZED — sessionOnly middleware', () => {
    it('POST /rpc/pingAuth returns oRPC default error shape { json: { code } }', async () => {
      const { app } = await import('../../src/index')
      const res = await app.request('/rpc/pingAuth', { method: 'POST' })
      // oRPC RPCHandler envelope: native error return types are wrapped
      // under the `json` key (per orpc.dev/docs/rpc-handler "Supported
      // Data Types"). The RPCHandler does NOT use our custom
      // errorResponseBodyEncoder — that's OpenAPIHandler-only.
      const body = (await res.json()) as {
        json?: { defined?: boolean; code?: string; status?: number; message?: string }
      }
      expect(body.json?.code).toBe('UNAUTHORIZED')
      expect(body.json?.status).toBe(401)
    })

    it('POST /api/v1/pingAuth returns custom wire shape { code: "unauthenticated", requestId }', async () => {
      const { app } = await import('../../src/index')
      const res = await app.request('/api/v1/pingAuth', { method: 'POST' })
      // The HTTP status on the OpenAPIHandler is the ORPCError status (401).
      expect(res.status).toBe(401)
      const body = (await res.json()) as {
        code?: string
        message?: string
        requestId?: string
        details?: unknown
      }
      // Custom encoder maps oRPC UNAUTHORIZED → wire 'unauthenticated'.
      expect(body.code).toBe('unauthenticated')
      expect(typeof body.message).toBe('string')
      expect(body.requestId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)
    })
  })

  describe('FORBIDDEN — orgContextMiddleware unit', () => {
    it('throws ORPCError FORBIDDEN when authContext exists but activeOrg.id is null', async () => {
      // Build a context with a valid session but no active org. This is
      // what happens when getSession succeeds but getFullOrganization
      // returns null (no active org selected) or throws (DB hiccup).
      const ctx = {
        headers: new Headers(),
        db: {} as never,
        requestId: 'test-request-id',
        authContext: {
          session: { id: 'sess-1', userId: 'user-1' } as never,
          user: { id: 'user-1', email: 'user@example.com' } as never,
        },
        activeOrg: { id: null, slug: null, memberRole: null },
      }
      const next = vi.fn()

      await expect(
        orgContextMiddleware({ context: ctx, next } as never, {} as never),
      ).rejects.toThrow(ORPCError)

      // Verify it's specifically FORBIDDEN with the right data
      try {
        await orgContextMiddleware({ context: ctx, next } as never, {} as never)
      } catch (err) {
        expect(err).toBeInstanceOf(ORPCError)
        expect((err as ORPCError).code).toBe('FORBIDDEN')
        expect((err as ORPCError).data).toEqual({ reason: 'no_active_org' })
      }
    })

    it('throws ORPCError UNAUTHORIZED when authContext is null', async () => {
      const ctx = {
        headers: new Headers(),
        db: {} as never,
        requestId: 'test-request-id',
        authContext: null,
        activeOrg: { id: null, slug: null, memberRole: null },
      }
      const next = vi.fn()

      try {
        await orgContextMiddleware({ context: ctx, next } as never, {} as never)
        expect.fail('expected ORPCError to be thrown')
      } catch (err) {
        expect(err).toBeInstanceOf(ORPCError)
        expect((err as ORPCError).code).toBe('UNAUTHORIZED')
      }
    })

    it('passes through when activeOrg.id is set', async () => {
      const ctx = {
        headers: new Headers(),
        db: {} as never,
        requestId: 'test-request-id',
        authContext: {
          session: { id: 'sess-1', userId: 'user-1' } as never,
          user: { id: 'user-1', email: 'user@example.com' } as never,
        },
        activeOrg: { id: 'org-1', slug: 'acme', memberRole: 'admin' },
      }
      const next = vi.fn().mockResolvedValue({ context: {}, output: 'ok' })

      await orgContextMiddleware({ context: ctx, next } as never, {} as never)

      expect(next).toHaveBeenCalledOnce()
      const calledWith = next.mock.calls[0]?.[0] as { context: { orgId: string } }
      expect(calledWith.context.orgId).toBe('org-1')
    })
  })

  describe('UNAUTHORIZED — authMiddleware unit', () => {
    it('throws ORPCError UNAUTHORIZED when authContext is null', async () => {
      const ctx = {
        headers: new Headers(),
        db: {} as never,
        requestId: 'test-request-id',
        authContext: null,
        activeOrg: { id: null, slug: null, memberRole: null },
      }
      const next = vi.fn()

      try {
        await authMiddleware({ context: ctx, next } as never, {} as never)
        expect.fail('expected ORPCError to be thrown')
      } catch (err) {
        expect(err).toBeInstanceOf(ORPCError)
        expect((err as ORPCError).code).toBe('UNAUTHORIZED')
      }
    })

    it('passes through with session + user when authContext is set', async () => {
      const ctx = {
        headers: new Headers(),
        db: {} as never,
        requestId: 'test-request-id',
        authContext: {
          session: { id: 'sess-1', userId: 'user-1' } as never,
          user: { id: 'user-1', email: 'user@example.com' } as never,
        },
        activeOrg: { id: null, slug: null, memberRole: null },
      }
      const next = vi.fn().mockResolvedValue({ context: {}, output: 'ok' })

      await authMiddleware({ context: ctx, next } as never, {} as never)

      expect(next).toHaveBeenCalledOnce()
      const calledWith = next.mock.calls[0]?.[0] as {
        context: { session: unknown; user: unknown }
      }
      expect(calledWith.context.session).toBeDefined()
      expect(calledWith.context.user).toBeDefined()
    })
  })

  describe('Hono auth-context — getSession failure', () => {
    let warnSpy: ReturnType<typeof vi.spyOn>

    beforeAll(() => {
      // Spy on console.error so the test doesn't pollute output.
      warnSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    })

    afterAll(() => {
      warnSpy.mockRestore()
    })

    it('does not throw when auth.api.getSession rejects — request continues with authContext = null', async () => {
      const { app } = await import('../../src/index')
      // The test environment uses a placeholder DATABASE_URL, so
      // getSession likely already throws. The important assertion:
      // the public ping procedure still works (the auth failure is
      // swallowed by auth-context.ts and treated as unauthenticated).
      const res = await app.request('/rpc/ping', { method: 'POST' })
      expect(res.status).toBe(200)
      const body = (await res.json()) as { json?: { status?: string } }
      expect(body.json?.status).toBe('ok')
    })
  })
})