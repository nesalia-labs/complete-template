/**
 * Environment schema for `@deessejs/mail`. Loaded lazily via `loadEnv()`
 * so tests can pass a custom env without polluting `process.env`.
 *
 * Per docs/internal/architecture/11-packages/mail/structure.md#srcenvts.
 */

import { z } from 'zod';

const envSchema = z.object({
  RESEND_API_KEY: z.string().optional(),
  MAIL_FROM: z
    .string()
    .email()
    .optional()
    .describe('Default "from" address. Falls back to config.from.'),
  MAIL_REPLY_TO: z.string().email().optional(),
  MAIL_PROVIDER: z
    .enum(['resend', 'console', 'noop'])
    .optional()
    .describe('Force a specific provider. Defaults to auto-detect.'),
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Validate and return the environment. Defaults to `process.env`; tests
 * pass a custom object via the second argument.
 */
export function loadEnv(source: NodeJS.ProcessEnv = process.env): Env {
  return envSchema.parse(source);
}