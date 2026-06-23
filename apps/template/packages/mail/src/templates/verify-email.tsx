/**
 * Email verification email. Triggered by Better Auth's
 * `emailVerification.sendVerificationEmail` hook.
 *
 * See docs/internal/architecture/11-packages/mail/integrations.md#hook-2--emailverificationsendverificationemail-authts63
 */

import { Heading, Section, Text } from 'react-email'
import type { BaseMailProps } from '../types'
import { Wrapper } from './Wrapper'
import { PrimaryButton } from './components/PrimaryButton'

export interface VerifyEmailProps extends BaseMailProps {
  url: string
  name?: string
  expiresInHours: number
}

export function VerifyEmail({
  url,
  name,
  expiresInHours,
  preview,
}: VerifyEmailProps) {
  return (
    <Wrapper preview={preview ?? 'Verify your DeesseJS email'}>
      <Heading as="h2" className="m-0 mb-4 text-xl font-semibold text-zinc-900">
        Verify your email
      </Heading>
      <Text className="m-0 mb-4 text-base leading-6 text-zinc-700">
        {name ? `Hi ${name},` : 'Hi,'}
      </Text>
      <Text className="m-0 mb-6 text-base leading-6 text-zinc-700">
        Thanks for signing up for DeesseJS. Please confirm your email address
        by clicking the button below. The link expires in{' '}
        <strong>{expiresInHours} hours</strong>.
      </Text>
      <Section className="my-6 text-center">
        <PrimaryButton href={url}>Verify email</PrimaryButton>
      </Section>
      <Text className="m-0 mb-2 text-sm leading-5 text-zinc-600">
        If the button does not work, copy and paste this URL into your browser:
      </Text>
      <Text className="m-0 break-all text-xs text-muted">{url}</Text>
      <Text className="m-0 mt-6 text-sm leading-5 text-zinc-600">
        If you did not create a DeesseJS account, you can safely ignore this
        email.
      </Text>
    </Wrapper>
  )
}

export default VerifyEmail

VerifyEmail.PreviewProps = {
  url: 'https://app.deessejs.dev/verify?token=demo-verify-token-xyz789',
  name: 'Alex',
  expiresInHours: 24,
  preview: 'Verify your DeesseJS email',
} satisfies VerifyEmailProps