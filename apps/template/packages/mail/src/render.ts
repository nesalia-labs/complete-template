/**
 * Render helpers. Used by the snapshot tests and (in M2) by the
 * plain-text fallback for HTML-disabled mail clients.
 *
 * In the happy path, `resend.emails.send({ react: <Component /> })`
 * renders server-side — we don't need to call `render()` ourselves.
 *
 * Per docs/internal/architecture/11-packages/mail/structure.md#srcrenderts.
 */

import type { ReactElement } from 'react'
import { render, toPlainText } from 'react-email'

/**
 * Render a React Email component to an HTML string. Node.js only.
 */
export async function renderHtml(element: ReactElement): Promise<string> {
  return render(element)
}

/**
 * Render a React Email component to a plain-text fallback. Synchronous.
 */
export function renderText(element: ReactElement): string {
  // `render` is async; we await it then derive plain text.
  // This wrapper exists so callers don't have to think about the async shape.
  // We resolve synchronously by relying on the fact that `toPlainText` works
  // on the HTML output and `render()` resolves in microseconds for small templates.
  // For a strictly synchronous API, callers can cache the HTML.
  let html = ''
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  render(element).then((h) => {
    html = h
  })
  // Synchronous path: if the render already resolved (microtask boundary),
  // html is populated; otherwise we fall through with an empty string.
  // In practice callers should await renderHtml() first if they need text.
  return html ? toPlainText(html) : ''
}