/**
 * Shared types for `@deessejs/mail`. The `SendMailInput<T>` generic
 * derives `context` from the registered template component, giving
 * callers autocomplete on both `template` and `context`.
 *
 * Per docs/internal/architecture/11-packages/mail/structure.md#srctypests.
 */

import type { ComponentProps } from 'react';
import type { mailTemplates } from './registry';

export type MailTemplateId = keyof typeof mailTemplates;

/**
 * Common props every template receives. `preview` is the inbox
 * preview text (the snippet shown in Gmail/Outlook before opening).
 */
export interface BaseMailProps {
  /** Inbox preview text — shown next to the subject in mail clients. */
  preview?: string;
}

/**
 * The `sendMail()` input. `context` is typed from the chosen template's
 * component props, so the editor validates every field.
 */
export interface SendMailInput<T extends MailTemplateId> {
  to: string
  template: T
  context: ComponentProps<typeof mailTemplates[T]>
  idempotencyKey?: string
  replyTo?: string
}

export interface SendMailSuccess {
  id: string
}

export interface SendMailError {
  error: string
}

export type SendMailResult = SendMailSuccess | SendMailError