import { drizzle } from 'drizzle-orm/postgres-js'
import { loadEnv, type Env } from './env'
import { schema } from '../schema'

/**
 * The Drizzle database instance. The return type of `createClient()` is
 * parameterized by the `schema` import — once tables are added, the
 * relational query API is enriched automatically.
 */
export type Database = ReturnType<typeof createClient>

export interface CreateClientOptions {
  /** Override the env (for tests). */
  env?: Env
}

/**
 * Create a Drizzle client. The function is the **only** sanctioned way to
 * instantiate the database — `packages/api` calls this per request via
 * the auth-context middleware, scripts call this once at startup.
 *
 * @example
 * ```ts
 * import { createClient } from '@deessejs/database'
 *
 * const db = createClient()
 * const users = await db.select().from(usersTable)
 * ```
 *
 * @remarks
 * Relations are auto-discovered from the schema namespace (the
 * `relations()` calls in each `src/schema/<feature>/<table>.ts` are
 * re-exported via `export *` in `src/schema/index.ts`). No explicit
 * `relations` parameter needed here (that's the v1 API).
 *
 * We use the URL overload of `drizzle()`. The `postgres-js` driver
 * manages the connection pool internally. For explicit pool config
 * (`max`, `idle_timeout`, `prepare` for Vercel Fluid Compute), the
 * `drizzle(url, { ... })` overloads accept an options object. **TODO**:
 * re-add explicit pool config if we measure pool exhaustion under load.
 *
 * Note on `usePlural`: that's a Better Auth adapter option, not a
 * Drizzle client option. It lives in `packages/auth/src/auth.ts`.
 */
export function createClient(options: CreateClientOptions = {}) {
  const env = options.env ?? loadEnv()

  return drizzle(env.DATABASE_URL, {
    schema,
  })
}
