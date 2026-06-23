/**
 * Error serializer. Maps an oRPC error to the canonical wire shape.
 *
 * Wire shape (per `docs/internal/architecture/11-packages/api/structure.md`):
 *
 * ```ts
 * {
 *   code: 'unauthenticated' | 'forbidden' | ... // see codes.ts
 *   message: string
 *   details?: unknown
 *   requestId: string
 * }
 * ```
 *
 * The serializer is used in two places:
 *   - `on-error.ts` interceptor (logs and reshapes server-side).
 *   - The Hono `app.ts` final `app.onError` for errors that escape oRPC.
 *
 * For non-ORPCError exceptions, the serializer returns a generic
 * `internal_error` with NO message (don't leak internals to clients).
 */
import { ORPCError } from '@orpc/server'
import {
  defaultMessageForCode,
  orpcCodeToWireCode,
  type WireErrorCode,
} from './codes'

export interface WireError {
  code: WireErrorCode
  message: string
  details?: unknown
  requestId: string
}

export function serializeOrpcError(
  error: unknown,
  requestId: string,
): WireError {
  if (error instanceof ORPCError) {
    return {
      code: orpcCodeToWireCode(error.code),
      message: error.message ?? defaultMessageForCode(error.code),
      ...(error.data !== undefined ? { details: error.data } : {}),
      requestId,
    }
  }
  // Unknown / non-ORPCError exception — don't leak internals.
  return {
    code: 'internal_error',
    message: 'Internal server error',
    requestId,
  }
}