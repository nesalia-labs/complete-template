/**
 * Helpers for building stable idempotency keys for the Better Auth
 * `sendMail` calls. Resend dedupes sends with the same
 * `idempotencyKey` within a 24h window.
 *
 * Per docs/internal/architecture/11-packages/mail/conventions.md#idempotency-keys
 * and .claude/agent-memory/tech-lead/project-better-auth-send-hooks.md.
 */

import { createHash } from 'node:crypto'

/**
 * First 16 hex chars of `sha256(token)`. Stable across retries and
 * small enough to fit in an idempotency key.
 */
export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex').slice(0, 16)
}

/**
 * Bucket a timestamp into a time window of the given size.
 * Returns the window index — equal timestamps + equal window size
 * produce equal keys, so retries within the window dedupe.
 */
export function bucket(
  timestamp: number,
  windowSize: '1min' | '5min' | '1h',
): number {
  const windows = {
    '1min': 60_000,
    '5min': 300_000,
    '1h': 3_600_000,
  } as const
  return Math.floor(timestamp / windows[windowSize])
}