/**
 * Password reset email. Triggered by Better Auth's
 * `emailAndPassword.sendResetPassword` hook.
 *
 * See docs/internal/architecture/11-packages/mail/integrations.md#hook-1--emailandpasswordsendresetpassword-authts55
 */

import { Heading, Section, Text } from 'react-email'
import type { BaseMailProps } from '../types'
import { Wrapper } from './Wrapper'
import { PrimaryButton } from './components/PrimaryButton'

export interface ResetPasswordProps extends BaseMailProps {
  url: string
  name?: string
  expiresInMinutes: number
}

export function ResetPassword({
  url,
  name,
  expiresInMinutes,
  preview,
}: ResetPasswordProps) {
  return (
    <Wrapper preview={preview ?? 'Reset your DeesseJS password'}>
      <Heading as="h2" className="m-0 mb-4 text-xl font-semibold text-zinc-900">
        Reset your password
      </Heading>
      <Text className="m-0 mb-4 text-base leading-6 text-zinc-700">
        {name ? `Hi ${name},` : 'Hi,'}
      </Text>
      <Text className="m-0 mb-6 text-base leading-6 text-zinc-700">
        We received a request to reset the password for your DeesseJS account.
        Click the button below to choose a new password. The link expires in{' '}
        <strong>{expiresInMinutes} minutes</strong>.
      </Text>
      <Section className="my-6 text-center">
        <PrimaryButton href={url}>Reset password</PrimaryButton>
      </Section>
      <Text className="m-0 mb-2 text-sm leading-5 text-zinc-600">
        If the button does not work, copy and paste this URL into your browser:
      </Text>
      <Text className="m-0 break-all text-xs text-muted">{url}</Text>
      <Text className="m-0 mt-6 text-sm leading-5 text-zinc-600">
        If you did not request a password reset, you can safely ignore this
        email — your password will remain unchanged.
      </Text>
    </Wrapper>
  )
}

export default ResetPassword

ResetPassword.PreviewProps = {
  url: 'https://app.deessejs.dev/reset?token=demo-reset-token-abc123',
  name: 'Alex',
  expiresInMinutes: 60,
  preview: 'Reset your DeesseJS password',
} satisfies ResetPasswordProps