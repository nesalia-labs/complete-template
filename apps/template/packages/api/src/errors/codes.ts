/**
 * String codes for our public error wire format.
 *
 * Procedures throw `ORPCError(<oRPC_CODE>, { message, data })`. The
 * `serializeOrpcError()` function maps the oRPC code to the wire code
 * below. Consumers (SDK, CLI, frontend) check the wire `code` to decide
 * UX (redirect to sign-in, show validation error, retry, etc.).
 *
 * @see docs/internal/architecture/11-packages/api/structure.md#srcerrors
 */

export type WireErrorCode =
  | 'unauthenticated'
  | 'forbidden'
  | 'not_found'
  | 'validation_error'
  | 'rate_limited'
  | 'conflict'
  | 'internal_error'
  | 'upstream_unavailable'
  | 'timeout'

/** oRPC code → wire code mapping. Unknown oRPC codes map to `internal_error`. */
export function orpcCodeToWireCode(orpcCode: string): WireErrorCode {
  const map: Record<string, WireErrorCode> = {
    UNAUTHORIZED: 'unauthenticated',
    FORBIDDEN: 'forbidden',
    NOT_FOUND: 'not_found',
    BAD_REQUEST: 'validation_error',
    CONFLICT: 'conflict',
    TOO_MANY_REQUESTS: 'rate_limited',
    TIMEOUT: 'timeout',
    INTERNAL_SERVER_ERROR: 'internal_error',
    SERVICE_UNAVAILABLE: 'upstream_unavailable',
  }
  return map[orpcCode] ?? 'internal_error'
}

/** Default human-readable message per oRPC code (used when procedure throws without a message). */
export function defaultMessageForCode(orpcCode: string): string {
  const map: Record<string, string> = {
    UNAUTHORIZED: 'Authentication required',
    FORBIDDEN: 'Operation not permitted',
    NOT_FOUND: 'Resource not found',
    BAD_REQUEST: 'Invalid request',
    CONFLICT: 'Resource conflict',
    TOO_MANY_REQUESTS: 'Too many requests',
    TIMEOUT: 'Request timed out',
    INTERNAL_SERVER_ERROR: 'Internal server error',
    SERVICE_UNAVAILABLE: 'Upstream unavailable',
  }
  return map[orpcCode] ?? 'An error occurred'
}