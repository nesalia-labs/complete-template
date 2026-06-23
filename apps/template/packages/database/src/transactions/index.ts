/**
 * Retry a function on Postgres serialization failures (SQLSTATE `40001`).
 *
 * Used in repo methods that run with `isolationLevel: 'serializable'`.
 * When Postgres detects a serialization anomaly, the transaction is
 * already rolled back; the fix is to retry the whole transaction.
 *
 * Rules:
 *   - Only `40001` is retried. Other errors propagate.
 *   - Max 3 attempts (overridable). After the final failure, the error
 *     propagates to the caller — the procedure should return a 503 with
 *     a retry hint.
 *   - Retried transactions must be idempotent at the application level.
 *     External side effects (email send, Stripe call) must be gated on
 *     a successful commit.
 *
 * @see docs/internal/architecture/11-packages/database/transactions.md
 */
export async function withSerializableRetry<T>(
  fn: () => Promise<T>,
  {
    maxAttempts = 3,
    baseDelayMs = 10,
  }: { maxAttempts?: number; baseDelayMs?: number } = {},
): Promise<T> {
  let lastError: unknown
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (err) {
      lastError = err
      if (!isSerializationFailure(err) || attempt === maxAttempts - 1) {
        throw err
      }
      // Exponential backoff with jitter.
      const delay = baseDelayMs * 2 ** attempt + Math.random() * baseDelayMs
      await sleep(delay)
    }
  }
  // Unreachable: the loop either returns or throws on the last attempt.
  throw lastError
}

function isSerializationFailure(err: unknown): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    (err as { code: unknown }).code === '40001'
  )
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
