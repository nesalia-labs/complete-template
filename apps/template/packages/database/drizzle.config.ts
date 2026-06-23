import { defineConfig } from 'drizzle-kit'

/**
 * drizzle-kit configuration.
 *
 * Reads DATABASE_URL from the environment. For local dev, set it in
 * `apps/template/.env` (the workspace root) or in a local `.env` here.
 *
 * Migrations are generated into `src/migrations/` and committed to git.
 * See `docs/internal/architecture/11-packages/database/schema.md` for the
 * full migration workflow.
 */
export default defineConfig({
  dialect: 'postgresql',
  schema: './src/schema/index.ts',
  out: './src/migrations',
  dbCredentials: {
    url:
      process.env.DATABASE_URL ??
      'postgres://postgres:postgres@localhost:5432/deessejs_dev',
  },
  // Verbose logging in dev to see the SQL emitted.
  verbose: process.env.NODE_ENV !== 'production',
  // Strict mode: fail on unhandled schema diffs (e.g. column rename).
  strict: true,
  // Entities: we manage roles via Better Auth, not drizzle-kit. Keep disabled.
  entities: {
    roles: false,
  },
})
