import { defineConfig } from 'vitest/config'

/**
 * Vitest configuration for the auth package.
 *
 * Integration tests spin up an in-memory PGlite + run migrations, then
 * exercise Better Auth via the `testUtils()` plugin. We use `pool: 'forks'`
 * with `singleFork: true` to keep test serial (the in-memory DB is per-process).
 */
export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    exclude: ['node_modules', 'dist'],
    environment: 'node',
    testTimeout: 30_000,    // PGlite startup + migrations can be slow on cold runs
    hookTimeout: 30_000,
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
  },
})
