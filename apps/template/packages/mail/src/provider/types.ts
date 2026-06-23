/**
 * The `Mailer` interface — the single seam every provider implements.
 * The rest of the package only knows about this shape, never Resend
 * directly. Adding a new provider (Postmark, SendGrid, SMTP, …) is
 * one file implementing `Mailer` and one entry in `index.ts`.
 *
 * Per docs/internal/architecture/11-packages/mail/structure.md#srcprovidertypests.
 */

import type { ReactElement } from 'react';

export interface MailerSendInput {
  to: string
  subject: string
  /** React Email component — rendered server-side by the transport. */
  react: ReactElement
  /** Plain-text fallback for HTML-disabled clients (M2+). */
  text?: string
  replyTo?: string
  idempotencyKey?: string
}

export interface MailerSendResult {
  /** Provider-side message ID. Use for tracking + idempotency dedup. */
  id: string
}

export interface Mailer {
  send(input: MailerSendInput): Promise<MailerSendResult>
}