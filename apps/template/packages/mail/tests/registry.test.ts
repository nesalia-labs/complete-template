/**
 * Registry tests — every MailTemplateId must be in the `mailTemplates`
 * map, every registered template must have a `PreviewProps` static.
 */

import { describe, it, expect } from 'vitest'
import { mailTemplates, subjects } from '../src/registry'

describe('packages/mail — registry', () => {
  it('exports mailTemplates and subjects with matching keys', () => {
    const templateKeys = Object.keys(mailTemplates).sort()
    const subjectKeys = Object.keys(subjects).sort()
    expect(templateKeys).toEqual(subjectKeys)
  })

  it('mailTemplates has 6 entries (the v1 set)', () => {
    expect(Object.keys(mailTemplates)).toHaveLength(6)
  })

  it('every registered template has a PreviewProps static', () => {
    for (const [id, Template] of Object.entries(mailTemplates)) {
      const previewProps = (Template as { PreviewProps?: unknown }).PreviewProps
      expect(previewProps, `${id} missing PreviewProps`).toBeDefined()
      expect(typeof previewProps, `${id} PreviewProps should be an object`).toBe('object')
    }
  })

  it('every subject is a non-empty string', () => {
    for (const [id, subject] of Object.entries(subjects)) {
      expect(typeof subject).toBe('string')
      expect(subject.length, `${id} subject is empty`).toBeGreaterThan(0)
    }
  })

  it('every subject starts with the brand', () => {
    for (const [id, subject] of Object.entries(subjects)) {
      expect(subject, `${id} subject should mention DeesseJS`).toContain('DeesseJS')
    }
  })

  it('expected template IDs are present', () => {
    const expected = [
      'resetPassword',
      'verifyEmail',
      'magicLink',
      'otp-sign-in',
      'otp-email-verification',
      'otp-forgot-password',
    ]
    expect(Object.keys(mailTemplates).sort()).toEqual([...expected].sort())
  })
})