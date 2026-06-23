/**
 * Smoke test for packages/api. Verifies that the Hono app boots and the
 * three transports respond correctly:
 *
 *   - /rpc/ping           → oRPC RPCHandler (internal)
 *   - /api/v1/ping        → oRPC OpenAPIHandler (public REST)
 *   - /api/v1/spec.json   → OpenAPI spec (auto-served by OpenAPIReferencePlugin)
 *   - /api/v1/docs        → Scalar UI (auto-served by OpenAPIReferencePlugin)
 *   - /api/auth/get-session → Better Auth handler (no cookie → null)
 *
 * Tests call `app.request(req)` directly — no real server, no port
 * collisions. The auth package's Better Auth instance is loaded (it
 * needs a placeholder DATABASE_URL to instantiate, see vitest.config.ts).
 * No actual DB query runs for the ping endpoints.
 *
 * @see docs/internal/architecture/11-packages/api/README.md#testing
 */
import { describe, it, expect } from 'vitest'
import { app } from '../../src/index'

describe('packages/api — smoke', () => {
  it('POST /rpc/ping returns pong via oRPC RPCHandler', async () => {
    const res = await app.request('/rpc/ping', { method: 'POST' })
    expect(res.status).toBe(200)
    // oRPC v1.14 envelope: native JSON return types are wrapped under the
    // `json` key. The @orpc/client unwraps this automatically; raw HTTP
    // consumers see the envelope.
    const body = (await res.json()) as { json?: { status?: string; timestamp?: string } }
    expect(body.json?.status).toBe('ok')
    expect(body.json?.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/)
  })

  it('POST /api/v1/ping returns pong via OpenAPIHandler', async () => {
    const res = await app.request('/api/v1/ping', { method: 'POST' })
    expect(res.status).toBe(200)
    // OpenAPIHandler emits native HTTP+JSON, not the oRPC envelope.
    const body = (await res.json()) as { status?: string; timestamp?: string }
    expect(body.status).toBe('ok')
    expect(body.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/)
  })

  it('GET /api/v1/spec.json returns a valid OpenAPI JSON document', async () => {
    const res = await app.request('/api/v1/spec.json', { method: 'GET' })
    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toMatch(/application\/json/)
    const body = (await res.json()) as {
      openapi?: string
      info?: { title?: string; version?: string }
    }
    expect(body.openapi).toMatch(/^3\./)
    expect(body.info?.title).toBe('DeesseJS API')
    expect(body.info?.version).toBeDefined()
  })

  it('GET /api/v1/docs returns Scalar HTML', async () => {
    const res = await app.request('/api/v1/docs', { method: 'GET' })
    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toMatch(/text\/html/)
    const body = await res.text()
    // Scalar UI shells include a script tag referencing scalar
    expect(body.toLowerCase()).toMatch(/scalar/)
  })

  it('GET /api/auth/get-session without cookie returns null (Better Auth 1.6.19 endpoint)', async () => {
    // NOTE: Better Auth v1.6.19 renamed the session endpoint from
    // `/api/auth/session` to `/api/auth/get-session`. The auth.test.ts
    // file in packages/auth has a TODO note about this rename.
    const res = await app.request('/api/auth/get-session', { method: 'GET' })
    expect(res.status).toBe(200)
    const body = (await res.json()) as unknown
    // Better Auth returns null for unauthenticated /get-session requests
    expect(body).toBeNull()
  })
})