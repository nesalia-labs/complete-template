/**
 * `Wrapper` — the shared brand shell every template wraps its body in.
 * Single edit site for the logo, brand colors, fonts, footer.
 *
 * Pattern borrowed from supastarter — see
 * docs/internal/architecture/11-packages/mail/conventions.md#wrapper-shared-layout.
 */

import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from 'react-email'
import type { PropsWithChildren } from 'react'
import { config } from '../config'

export interface WrapperProps extends PropsWithChildren {
  /** Inbox preview text (shown next to the subject in Gmail/Outlook). */
  preview?: string
}

export function Wrapper({ preview, children }: WrapperProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>{config.brand}</title>
      </Head>
      {preview ? <Preview>{preview}</Preview> : null}
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                brand: '#007291',
                'brand-foreground': '#ffffff',
                background: '#f6f9fc',
                card: '#ffffff',
                muted: '#6b7280',
                border: '#e5e7eb',
              },
              fontFamily: {
                sans: [
                  '-apple-system',
                  'BlinkMacSystemFont',
                  'Segoe UI',
                  'Roboto',
                  'Helvetica',
                  'Arial',
                  'sans-serif',
                ],
              },
            },
          },
        }}
      >
        <Body className="bg-background m-auto font-sans">
          <Container className="mx-auto my-0 max-w-[600px] bg-card p-0">
            <Section className="px-8 pt-8 pb-2">
              <Heading
                as="h1"
                className="m-0 text-2xl font-semibold text-zinc-900"
              >
                {config.brand}
              </Heading>
            </Section>
            <Hr className="m-0 border-border" />
            <Section className="px-8 py-8 text-zinc-800">
              {children}
            </Section>
            <Hr className="m-0 border-border" />
            <Section className="px-8 py-6 text-xs text-muted">
              <Text className="m-0 mb-2">{config.signature}</Text>
              <Text className="m-0">{config.address}</Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

export default Wrapper