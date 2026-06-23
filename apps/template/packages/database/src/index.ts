/**
 * Public surface of `@deessejs/database`. This is what other packages
 * (e.g. `@deessejs/api`, `@deessejs/auth`) import.
 *
 * The surface is intentionally narrow: the database is an implementation
 * detail. Consumers get:
 *   - `createClient` — the Drizzle factory.
 *   - `Database` — the inferred type.
 *   - `loadEnv` / `Env` — the env schema (for validation at consumer boot).
 *   - `withSerializableRetry` — the transaction retry helper.
 *   - `relations` — the RQBv2 relations (for the relational query API).
 *   - `OrgId` / `UserId` — branded ID types.
 *
 * Per-feature data-access **functions** are added in modules like
 * `src/users.ts`, `src/projects.ts`, etc. (one file per feature module).
 * Each function takes `(db, orgId, ...args)` and is fully typed.
 * No repository pattern, no factory — just plain functions.
 *
 * Consumers do **not** import `drizzle-orm` or `postgres` directly.
 * Lint rules in `packages/api` enforce this.
 *
 * The internal layout:
 *   - `src/client/`        — Drizzle factory + env loading
 *   - `src/relations/`     — RQBv2 relations
 *   - `src/transactions/`  — transaction helpers
 *   - `src/schema/`        — pgTable per feature module
 *
 * Each subfolder exports via its `index.ts`. This file re-exports the
 * public surface.
 */

// Client (Drizzle factory + env)
export { createClient, type Database, type CreateClientOptions } from './client'
export { loadEnv, type Env } from './client/env'

// Transactions
export { withSerializableRetry } from './transactions'

// Schema namespace (for type inference in consumers — Better Auth adapter, etc.)
export * as schema from './schema'

// Branded ID types
export type { OrgId, UserId } from './schema/_columns'
