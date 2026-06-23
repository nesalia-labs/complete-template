/**
 * Render tests — every template renders to non-empty HTML, contains
 * the brand, and exposes a `PreviewProps` we can render with.
 */

import { describe, it, expect } from 'vitest'
import { createElement } from 'react'
import { render as renderEmail } from 'react-email'
import { mailTemplates } from '../src/registry'
import { Wrapper } from '../src/templates/Wrapper'

describe('packages/mail — render', () => {
  it('renders every template to non-empty HTML', async () => {
    for (const [id, Template] of Object.entries(mailTemplates)) {
      const previewProps = (Template as { PreviewProps?: Record<string, unknown> }).PreviewProps
      expect(previewProps, `${id} missing PreviewProps`).toBeDefined()

      const html = await renderEmail(createElement(Template, previewProps))
      expect(html.length, `${id} rendered html is empty`).toBeGreaterThan(0)
      expect(html, `${id} should include <html>`).toContain('<html')
      expect(html, `${id} should include <body>`).toContain('<body')
    }
  })

  it('renders the Wrapper with children', async () => {
    const html = await renderEmail(
      createElement(Wrapper, { preview: 'Test preview' }, 'Hello world'),
    )
    expect(html).toContain('Hello world')
    expect(html).toContain('Test preview')
    expect(html).toContain('DeesseJS')
  })

  it('every template references the brand', async () => {
    for (const [id, Template] of Object.entries(mailTemplates)) {
      const previewProps = (Template as { PreviewProps?: Record<string, unknown> }).PreviewProps
      const html = await renderEmail(createElement(Template, previewProps))
      expect(html, `${id} should mention DeesseJS`).toContain('DeesseJS')
    }
  })
})