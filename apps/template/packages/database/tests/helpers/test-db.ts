import { PGlite } from '@electric-sql/pglite'
import { drizzle } from 'drizzle-orm/pglite'
import type { PgliteDatabase } from 'drizzle-orm/pglite'

/**
 * Test environment. PGlite runs **in-memory** — no Postgres install, no
 * Docker, no admin. The WASM build of real Postgres boots in <100ms and
 * dies when the process exits.
 *
 * Production uses `postgres-js` against a real Postgres (Neon, Supabase,
 * Railway). Tests use PGlite because we want zero-install, zero-network.
 *
 * Why PGlite and not a mock?
 *   - Real Postgres semantics. SQL features, types, RLS, indexes all work.
 *   - Tests catch SQL bugs that an in-memory mock would miss.
 *   - Drizzle has first-class support (`drizzle-orm/pglite`).
 *
 * @see https://pglite.dev
 */

export interface TestDb {
  /** The Drizzle db instance, bound to the PGlite client. */
  db: PgliteDatabase
  /** The raw PGlite client (for DDL, raw queries, cleanup). */
  sql: PGlite
  /** A pre-generated org ID, for tests that need one. */
  orgA: string
  /** A second org ID, for cross-tenant tests. */
  orgB: string
  /** Close the client. Call in `afterAll`. */
  close: () => Promise<void>
}

export async function setupTestDb(): Promise<TestDb> {
  // In-memory PGlite. No dataDir → RAM only.
  const client = new PGlite()
  const db = drizzle({ client })

  // Two pre-generated org IDs for cross-tenant tests.
  const orgA = crypto.randomUUID()
  const orgB = crypto.randomUUID()

  return {
    db,
    sql: client,
    orgA,
    orgB,
    close: async () => {
      await client.close()
    },
  }
}
