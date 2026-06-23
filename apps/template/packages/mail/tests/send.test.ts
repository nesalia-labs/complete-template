/**
 * sendMail() tests — verify each provider integration works without
 * requiring a real network call. Resend provider is tested via a
 * mocked Resend client; console/noop are exercised through `sendMail`.
 *
 * Provider selection is done via MAIL_PROVIDER env var (see conventions.md).
 */

import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest'

// ---------- noop provider (default for these tests) ----------

describe('packages/mail — send (noop provider)', () => {
  beforeAll(() => {
    process.env.MAIL_PROVIDER = 'noop'
    delete process.env.RESEND_API_KEY
  })

  it('MAIL_PROVIDER=noop returns { id: "noop" }', async () => {
    const { getMailer } = await import('../src/provider')
    const mailer = getMailer()
    const { NoopMailer } = await import('../src/provider')
    expect(mailer).toBeInstanceOf(NoopMailer)
    const result = await mailer.send({
      to: 'test@example.com',
      subject: 'Test',
      react: null as never,
    })
    expect(result.id).toBe('noop')
  })

  it('sendMail with resetPassword returns a noop id', async () => {
    const { sendMail } = await import('../src/send')
    const result = await sendMail({
      to: 'test@example.com',
      template: 'resetPassword',
      context: {
        url: 'https://example.com/reset',
        expiresInMinutes: 60,
      },
      idempotencyKey: 'test-key-1',
    })
    expect(result.id).toBe('noop')
  })
})

// ---------- console provider ----------

describe('packages/mail — send (console provider)', () => {
  beforeAll(() => {
    process.env.MAIL_PROVIDER = 'console'
    delete process.env.RESEND_API_KEY
  })

  it('MAIL_PROVIDER=console returns a console-<uuid> id', async () => {
    const { getMailer, ConsoleMailer } = await import('../src/provider')
    const mailer = getMailer()
    expect(mailer).toBeInstanceOf(ConsoleMailer)
    const result = await mailer.send({
      to: 'test@example.com',
      subject: 'Test',
      react: null as never,
    })
    expect(result.id).toMatch(/^console-/)
  })
})

// ---------- resend provider (mocked) ----------

describe('packages/mail — send (resend provider, mocked client)', () => {
  beforeEach(() => {
    vi.resetModules()
    process.env.MAIL_PROVIDER = 'resend'
    process.env.RESEND_API_KEY = 're_test_key_123'
  })

  it('calls Resend with the expected payload shape', async () => {
    const sendSpy = vi.fn().mockResolvedValue({
      data: { id: 're_test_123' },
      error: null,
    })
    vi.doMock('resend', () => ({
      Resend: class {
        emails = { send: sendSpy }
      },
    }))

    const { getMailer } = await import('../src/provider')
    const mailer = getMailer()

    const result = await mailer.send({
      to: 'test@example.com',
      subject: 'Test subject',
      react: { type: 'div', props: {} } as never,
      idempotencyKey: 'test-key',
    })

    expect(result.id).toBe('re_test_123')
    // Resend SDK v6.14 takes (payload, options) — idempotencyKey is in options.
    expect(sendSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'test@example.com',
        subject: 'Test subject',
      }),
      expect.objectContaining({ idempotencyKey: 'test-key' }),
    )
  })
})