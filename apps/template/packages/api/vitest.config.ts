import { defineConfig } from 'vitest/config'

/**
 * Vitest configuration for the api package.
 *
 * Tests call `app.request(req)` directly (Hono accepts Fetch API Request).
 * No real server, no port collisions. Each test file gets its own process
 * (pool: 'forks') so the per-request db client doesn't leak between files.
 *
 * `env.DATABASE_URL` is a placeholder. The auth package's Better Auth
 * instance is instantiated at module load and `createClient()` from
 * `@deessejs/database` validates the env via Zod. We never actually query
 * the DB in the smoke test (the ping handler is pure), so the URL just
 * needs to parse as a valid URL.
 */
export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    exclude: ['node_modules', 'dist'],
    environment: 'node',
    testTimeout: 30_000,
    hookTimeout: 30_000,
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    env: {
      NODE_ENV: 'test',
      LOG_LEVEL: 'error',
      DATABASE_URL:
        process.env.DATABASE_URL ??
        'postgres://placeholder:placeholder@localhost:5432/placeholder',
      BETTER_AUTH_URL: 'http://localhost:3000',
      BETTER_AUTH_SECRET: 'test-secret-at-least-32-chars-long-for-tests-only',
      NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
      PARENT_DOMAIN: 'localhost',
    },
  },
})