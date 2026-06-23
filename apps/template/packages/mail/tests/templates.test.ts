/**
 * Template snapshot tests. Snapshots live alongside the test file in
 * `tests/__snapshots__/`. Run with `vitest --update` to refresh.
 *
 * Each template renders to a stable HTML snapshot, so any unintended
 * style change during refactors is caught by `git diff` on the snap.
 */

import { describe, it, expect } from 'vitest'
import { createElement } from 'react'
import { render as renderEmail } from 'react-email'
import { mailTemplates } from '../src/registry'

describe('packages/mail — templates snapshot', () => {
  it.each(Object.entries(mailTemplates))(
    '%s renders to a stable snapshot',
    async (id, Template) => {
      const previewProps = (Template as { PreviewProps?: Record<string, unknown> })
        .PreviewProps
      expect(previewProps).toBeDefined()
      const html = await renderEmail(createElement(Template, previewProps))
      expect(html).toMatchSnapshot()
    },
  )
})