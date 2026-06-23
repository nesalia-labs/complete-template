/**
 * `NoopMailer` — returns `{ id: 'noop' }`. For unit tests of consumers
 * that should not hit a real network or log to stdout.
 */

import type { Mailer, MailerSendInput, MailerSendResult } from './types'

export class NoopMailer implements Mailer {
  async send(_input: MailerSendInput): Promise<MailerSendResult> {
    return { id: 'noop' }
  }
}