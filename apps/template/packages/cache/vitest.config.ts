import { defineConfig } from 'vitest/config'

/**
 * Vitest configuration for the cache package.
 *
 * Tests are deterministic — no env vars, no Redis dependency. The
 * in-memory client is the default backend.
 */
export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    exclude: ['node_modules', 'dist'],
    environment: 'node',
    testTimeout: 5_000,
    hookTimeout: 5_000,
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
  },
})