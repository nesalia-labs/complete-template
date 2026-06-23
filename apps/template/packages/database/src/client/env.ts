import { z } from 'zod'

/**
 * Environment schema. Validated at boot (or when `loadEnv()` is called).
 *
 * Add new env vars here as the database package grows. The env is loaded
 * explicitly via `loadEnv()` (not at module top-level) so tests can pass
 * a custom env without polluting the process.
 */
const envSchema = z.object({
  DATABASE_URL: z.string().url().describe('Postgres connection URL'),
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  VERCEL: z.string().optional().describe('Set by Vercel at runtime'),
})

export type Env = z.infer<typeof envSchema>

/**
 * Validate and return the environment. Defaults to `process.env`; tests pass
 * a custom object via the second argument.
 */
export function loadEnv(source: NodeJS.ProcessEnv = process.env): Env {
  return envSchema.parse(source)
}
