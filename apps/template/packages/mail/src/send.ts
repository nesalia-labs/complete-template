/**
 * `sendMail()` — the single public function. Steps:
 *
 *   1. Look up the template component in `registry.ts`.
 *   2. Resolve `subject` from `subjects`.
 *   3. Call `getMailer()` to get the active provider.
 *   4. Render the React component (React.createElement) and pass it
 *      to `provider.send({ react, ... })`.
 *   5. Return `{ id }` or throw on error.
 *
 * Per docs/internal/architecture/11-packages/mail/conventions.md#the-void-sendmail-rule
 * (callers should `void sendMail(...)`, never `await`).
 */

import { createElement } from 'react'
import type * as React from 'react'
import { getMailer } from './provider'
import { mailTemplates, subjects } from './registry'
import type { SendMailInput, SendMailResult } from './types'

export async function sendMail<T extends keyof typeof mailTemplates>(
  input: SendMailInput<T>,
): Promise<SendMailResult> {
  const mailer = getMailer()
  const Template = mailTemplates[input.template]

  const result = await mailer.send({
    to: input.to,
    subject: subjects[input.template],
    // The component union narrows at the registry level but TS can't
    // prove that the `context` props match `Template`'s prop type when
    // `Template` is a union of all templates. The runtime is sound —
    // we've just indexed the typed map. Cast is local + documented.
    react: createElement(Template as unknown as React.ComponentType<Record<string, unknown>>, input.context as unknown as Record<string, unknown>),
    idempotencyKey: input.idempotencyKey,
    replyTo: input.replyTo,
  })

  return { id: result.id }
}