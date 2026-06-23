/**
 * Server-side logging of procedure errors.
 *
 * Called by the per-mount oRPC `onError` interceptor (defined inline in
 * each mount file). Kept separate so the logging policy lives in one
 * place — if we add OTel spans, structured fields, or PII redaction
 * later, only this file changes.
 *
 * No type extraction on the error: we log it as-is. The runtime value
 * is `ORPCError | Error` per the oRPC handler's contract; logging the
 * full object preserves the stack, the `data` payload, and the
 * `defined` discriminator that oRPC adds to type-safe errors.
 */
export function logOrpcError(error: unknown): void {
  console.error(
    {
      level: 'error',
      err: error,
    },
    '[orpc] procedure error',
  )
}