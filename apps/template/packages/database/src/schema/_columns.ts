import { timestamp, uuid } from 'drizzle-orm/pg-core'

/**
 * Branded ID types. `OrgId` is a string that has been validated to be an
 * organization ID. Passing a `UserId` where an `OrgId` is expected is a
 * compile-time error.
 */
export type OrgId = string & { readonly __brand: 'OrgId' }
export type UserId = string & { readonly __brand: 'UserId' }

/**
 * The `orgId` column. Typed as `OrgId`. Foreign keys are added per-table
 * (with `.references(() => orgs.id, { onDelete: 'cascade' })`) because the
 * reference is forward — `orgs` is the Better Auth organization table, and
 * importing it here would create a circular dependency.
 *
 * @example
 * ```ts
 * import { orgIdColumn } from '../_columns'
 *
 * export const projects = pgTable('projects', {
 *   id: uuid().primaryKey().defaultRandom(),
 *   orgId: orgIdColumn().references(() => orgs.id, { onDelete: 'cascade' }),
 *   // ...
 * })
 * ```
 */
export const orgIdColumn = () =>
  uuid('org_id')
    .notNull()
    .$type<OrgId>()

/**
 * `createdAt` + `updatedAt` with timezone, with sensible defaults.
 * `updatedAt` is auto-bumped on every row update via Drizzle's `$onUpdate`.
 */
export const timestampColumns = () => ({
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

/**
 * Soft-delete column. When set, the row is considered deleted. Queries
 * should filter by `deletedAt IS NULL` by default. The wrapping repo
 * (see `tenant-isolation.md`) handles this filter.
 */
export const softDeleteColumn = () => ({
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
})
