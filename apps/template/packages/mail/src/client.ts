/**
 * Lazy singletons for the underlying transport clients. We never
 * construct `new Resend(...)` at module top-level — it would crash
 * dev/test imports when `RESEND_API_KEY` is missing.
 *
 * Per docs/internal/architecture/11-packages/mail/structure.md#srcclientts.
 */

import { Resend } from 'resend';

let _resend: Resend | undefined;

/**
 * Returns a cached Resend client. Constructs on first call. Throws
 * if `apiKey` is empty — caller decides whether to fall back to
 * console provider.
 */
export function getResendClient(apiKey: string): Resend {
  if (!apiKey) {
    throw new Error(
      'getResendClient: apiKey is empty. Set RESEND_API_KEY or use MAIL_PROVIDER=console.',
    )
  }
  if (!_resend) {
    _resend = new Resend(apiKey)
  }
  return _resend
}

/**
 * Reset the cached Resend client. Test-only helper.
 */
export function _resetResendClient(): void {
  _resend = undefined
}