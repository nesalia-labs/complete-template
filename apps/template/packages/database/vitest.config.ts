import { defineConfig } from 'vitest/config'

/**
 * Vitest configuration for the database package.
 *
 * Integration tests run against a real Postgres. Set DATABASE_URL in
 * `.env.test` (copy from `.env.test.example`). Tests are serial because
 * they share DB state; pool: 'forks' ensures each test file gets its own
 * Postgres connection.
 *
 * We hardcode the env in `env:` so the test runs even when Vitest's
 * auto-`.env.test` loading doesn't pick up the file (CWD quirks). The
 * `.env.test` file is still the source of truth for the buyer.
 */
export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    exclude: ['node_modules', 'dist'],
    environment: 'node',
    testTimeout: 30_000,    // DB tests can be slow
    hookTimeout: 30_000,
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,   // serial execution: one test file at a time
      },
    },
    env: {
      NODE_ENV: 'test',
      // Tests use PGlite (in-memory, zero-install) — no real Postgres
      // needed. The DATABASE_URL is only here for legacy compatibility
      // with any scripts that might still read it.
      DATABASE_URL:
        process.env.DATABASE_URL ??
        'pglite://memory (not used — tests run on PGlite in-memory)',
    },
  },
})
