import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core'
import { eq } from 'drizzle-orm'
import { setupTestDb, type TestDb } from '../../helpers/test-db'

/**
 * Pattern demonstration: a fixture table for verifying the cross-tenant
 * WHERE-clause pattern works end-to-end against a real Postgres (PGlite
 * for tests, postgres-js for production).
 *
 * The table is defined inline (not in `src/schema/`) because it is a
 * test fixture, not a feature. It is created in `beforeAll` and dropped
 * in `afterAll`. The pattern is the same one every org-scoped table
 * follows in production: every row has an `orgId`, every query filters
 * by `orgId`.
 *
 * @see docs/internal/architecture/11-packages/database/tenant-isolation.md
 */
const fixtureItems = pgTable('test_items', {
  id: uuid().primaryKey().defaultRandom(),
  orgId: uuid('org_id').notNull(),
  name: text().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

describe('Cross-tenant WHERE clause (pattern)', () => {
  let test: TestDb

  beforeAll(async () => {
    test = await setupTestDb()
    // DDL via PGlite.exec() — multi-statement script.
    await test.sql.exec(`
      CREATE TABLE IF NOT EXISTS test_items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        org_id UUID NOT NULL,
        name TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `)
    // DML via PGlite.query() — parameterized, no string concat.
    await test.sql.query(
      `INSERT INTO test_items (org_id, name) VALUES ($1, $2)`,
      [test.orgA, 'item-a'],
    )
    await test.sql.query(
      `INSERT INTO test_items (org_id, name) VALUES ($1, $2)`,
      [test.orgB, 'item-b'],
    )
  })

  afterAll(async () => {
    if (test) {
      await test.sql.exec(`DROP TABLE IF EXISTS test_items`)
      await test.close()
    }
  })

  it('orgA query returns only orgA items', async () => {
    const items = await test.db
      .select()
      .from(fixtureItems)
      .where(eq(fixtureItems.orgId, test.orgA))
    expect(items).toHaveLength(1)
    expect(items[0]?.name).toBe('item-a')
  })

  it('orgB query returns only orgB items', async () => {
    const items = await test.db
      .select()
      .from(fixtureItems)
      .where(eq(fixtureItems.orgId, test.orgB))
    expect(items).toHaveLength(1)
    expect(items[0]?.name).toBe('item-b')
  })

  it('unfiltered query would return both items (sanity check)', async () => {
    // This is what would happen if a procedure forgot the orgId filter.
    // The pattern is enforced by the data-access functions, not by a query
    // builder. This test exists to document the failure mode.
    const items = await test.db.select().from(fixtureItems)
    expect(items).toHaveLength(2)
  })
})
