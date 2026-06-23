/**
 * OTP forgot password email. Triggered by Better Auth's
 * `emailOTP.sendVerificationOTP` with `type: 'forget-password'`.
 *
 * See docs/internal/architecture/11-packages/mail/integrations.md#hook-4--emailotpsendverificationotp-authts85
 */

import { Heading, Section, Text } from 'react-email'
import type { BaseMailProps } from '../types'
import { Wrapper } from './Wrapper'

export interface OtpForgotPasswordProps extends BaseMailProps {
  otp: string
  expiresInMinutes: number
}

export function OtpForgotPassword({
  otp,
  expiresInMinutes,
  preview,
}: OtpForgotPasswordProps) {
  return (
    <Wrapper preview={preview ?? 'Reset your DeesseJS password'}>
      <Heading as="h2" className="m-0 mb-4 text-xl font-semibold text-zinc-900">
        Reset your password
      </Heading>
      <Text className="m-0 mb-6 text-base leading-6 text-zinc-700">
        Use the code below to reset your DeesseJS password. It expires in{' '}
        <strong>{expiresInMinutes} minutes</strong>.
      </Text>
      <Section className="my-6 rounded-md border border-border bg-zinc-50 px-6 py-8 text-center">
        <Text className="m-0 text-4xl font-bold tracking-widest text-zinc-900">
          {otp}
        </Text>
      </Section>
      <Text className="m-0 text-sm leading-5 text-zinc-600">
        If you did not request a password reset, you can safely ignore this
        email — your password will remain unchanged.
      </Text>
    </Wrapper>
  )
}

export default OtpForgotPassword

OtpForgotPassword.PreviewProps = {
  otp: '105834',
  expiresInMinutes: 10,
  preview: 'Reset your DeesseJS password',
} satisfies OtpForgotPasswordProps