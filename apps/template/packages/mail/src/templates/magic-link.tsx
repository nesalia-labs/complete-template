/**
 * Magic link email. Triggered by Better Auth's
 * `magicLink.sendMagicLink` hook.
 *
 * See docs/internal/architecture/11-packages/mail/integrations.md#hook-3--magiclinksendmagiclink-authts73
 */

import { Heading, Section, Text } from 'react-email'
import type { BaseMailProps } from '../types'
import { Wrapper } from './Wrapper'
import { PrimaryButton } from './components/PrimaryButton'

export interface MagicLinkProps extends BaseMailProps {
  url: string
  expiresInMinutes: number
}

export function MagicLink({ url, expiresInMinutes, preview }: MagicLinkProps) {
  return (
    <Wrapper preview={preview ?? 'Your DeesseJS sign-in link'}>
      <Heading as="h2" className="m-0 mb-4 text-xl font-semibold text-zinc-900">
        Sign in to DeesseJS
      </Heading>
      <Text className="m-0 mb-6 text-base leading-6 text-zinc-700">
        Click the button below to sign in instantly. The link expires in{' '}
        <strong>{expiresInMinutes} minutes</strong> and can only be used once.
      </Text>
      <Section className="my-6 text-center">
        <PrimaryButton href={url}>Sign in to DeesseJS</PrimaryButton>
      </Section>
      <Text className="m-0 mb-2 text-sm leading-5 text-zinc-600">
        If the button does not work, copy and paste this URL into your browser:
      </Text>
      <Text className="m-0 break-all text-xs text-muted">{url}</Text>
      <Text className="m-0 mt-6 text-sm leading-5 text-zinc-600">
        If you did not request this sign-in link, you can safely ignore this
        email.
      </Text>
    </Wrapper>
  )
}

export default MagicLink

MagicLink.PreviewProps = {
  url: 'https://app.deessejs.dev/magic?token=demo-magic-token-qwe456',
  expiresInMinutes: 10,
  preview: 'Your DeesseJS sign-in link',
} satisfies MagicLinkProps