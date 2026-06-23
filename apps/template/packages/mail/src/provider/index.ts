/**
 * `getMailer()` — the auto-detect switch. Mirrors the pattern used in
 * `@deessejs/cache` (`createRedisClient`). Behavior:
 *
 * - `MAIL_PROVIDER=resend` → ResendMailer (requires RESEND_API_KEY)
 * - `MAIL_PROVIDER=console` → ConsoleMailer (default when no key set)
 * - `MAIL_PROVIDER=noop` → NoopMailer (unit tests)
 * - `MAIL_PROVIDER` unset + RESEND_API_KEY set → ResendMailer
 * - `MAIL_PROVIDER` unset + no RESEND_API_KEY → ConsoleMailer
 *
 * Per docs/internal/architecture/11-packages/mail/conventions.md#provider-switch-semantics.
 */

import { loadEnv } from '../env'
import { ConsoleMailer } from './console'
import { NoopMailer } from './noop'
import { ResendMailer } from './resend'
import type { Mailer } from './types'

export function getMailer(): Mailer {
  const env = loadEnv()

  switch (env.MAIL_PROVIDER) {
    case 'noop':
      return new NoopMailer()
    case 'console':
      return new ConsoleMailer()
    case 'resend': {
      if (!env.RESEND_API_KEY) {
        throw new Error(
          'getMailer: MAIL_PROVIDER=resend requires RESEND_API_KEY.',
        )
      }
      return new ResendMailer({
        apiKey: env.RESEND_API_KEY,
        from: env.MAIL_FROM,
        replyTo: env.MAIL_REPLY_TO,
      })
    }
    default: {
      if (env.RESEND_API_KEY) {
        return new ResendMailer({
          apiKey: env.RESEND_API_KEY,
          from: env.MAIL_FROM,
          replyTo: env.MAIL_REPLY_TO,
        })
      }
      return new ConsoleMailer()
    }
  }
}

export { ConsoleMailer, NoopMailer, ResendMailer }
export type { Mailer, MailerSendInput, MailerSendResult } from './types'