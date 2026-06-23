/**
 * Non-secret configuration. The `from` address is cleartext on purpose —
 * it's not a secret, it's buyer-facing metadata. The API key lives in env.
 *
 * Per docs/internal/architecture/11-packages/mail/structure.md#srcconfigts.
 */

export const config = {
  /** Default "from" address. Used when env.MAIL_FROM is unset. */
  from: 'DeesseJS <noreply@deessejs.dev>',
  /** Default reply-to. Used when sendMail input omits `replyTo`. */
  replyTo: 'support@deessejs.dev',
  /** Brand name shown in templates. */
  brand: 'DeesseJS',
  /** Footer signature shown in templates. */
  signature: 'The DeesseJS team',
  /** Company address for the footer (CAN-SPAM compliance). */
  address: 'DeesseJS Inc., 1 rue de la République, 75001 Paris, France',
} as const