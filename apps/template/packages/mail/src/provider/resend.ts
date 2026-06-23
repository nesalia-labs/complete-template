/**
 * `ResendMailer` — the canonical transport. Uses the official Resend
 * Node SDK (`resend@^6.14`). The React component is rendered
 * server-side by Resend via the `react:` field — we do NOT call
 * `render()` ourselves in the happy path.
 *
 * This file is the ONLY place that imports from `resend`. The ESLint
 * rule in `eslint.config.js` allows the import only here.
 */

import { getResendClient } from '../client'
import { config } from '../config'
import type { Mailer, MailerSendInput, MailerSendResult } from './types'

export interface ResendMailerOptions {
  apiKey: string
  from?: string
  replyTo?: string
}

export class ResendMailer implements Mailer {
  private readonly apiKey: string
  private readonly from: string
  private readonly defaultReplyTo: string | undefined

  constructor(options: ResendMailerOptions) {
    this.apiKey = options.apiKey
    this.from = options.from ?? config.from
    this.defaultReplyTo = options.replyTo ?? config.replyTo
  }

  async send(input: MailerSendInput): Promise<MailerSendResult> {
    const resend = getResendClient(this.apiKey)

    // `idempotencyKey` lives on the second arg (`CreateEmailRequestOptions`),
    // not on the payload itself (per Resend SDK v6.14 types).
    const { data, error } = await resend.emails.send(
      {
        from: this.from,
        to: input.to,
        subject: input.subject,
        react: input.react,
        text: input.text,
        replyTo: input.replyTo ?? this.defaultReplyTo,
      },
      input.idempotencyKey ? { idempotencyKey: input.idempotencyKey } : undefined,
    )

    if (error || !data) {
      throw new Error(
        `ResendMailer.send: Resend returned an error: ${JSON.stringify(error)}`,
      )
    }

    return { id: data.id }
  }
}