/**
 * OTP email verification email. Triggered by Better Auth's
 * `emailOTP.sendVerificationOTP` with `type: 'email-verification'`.
 *
 * See docs/internal/architecture/11-packages/mail/integrations.md#hook-4--emailotpsendverificationotp-authts85
 */

import { Heading, Section, Text } from 'react-email'
import type { BaseMailProps } from '../types'
import { Wrapper } from './Wrapper'

export interface OtpEmailVerificationProps extends BaseMailProps {
  otp: string
  expiresInMinutes: number
}

export function OtpEmailVerification({
  otp,
  expiresInMinutes,
  preview,
}: OtpEmailVerificationProps) {
  return (
    <Wrapper preview={preview ?? 'Your DeesseJS verification code'}>
      <Heading as="h2" className="m-0 mb-4 text-xl font-semibold text-zinc-900">
        Verify your email
      </Heading>
      <Text className="m-0 mb-6 text-base leading-6 text-zinc-700">
        Use the code below to verify your email address. It expires in{' '}
        <strong>{expiresInMinutes} minutes</strong>.
      </Text>
      <Section className="my-6 rounded-md border border-border bg-zinc-50 px-6 py-8 text-center">
        <Text className="m-0 text-4xl font-bold tracking-widest text-zinc-900">
          {otp}
        </Text>
      </Section>
      <Text className="m-0 text-sm leading-5 text-zinc-600">
        If you did not create a DeesseJS account, you can safely ignore this
        email.
      </Text>
    </Wrapper>
  )
}

export default OtpEmailVerification

OtpEmailVerification.PreviewProps = {
  otp: '739201',
  expiresInMinutes: 10,
  preview: 'Your DeesseJS verification code',
} satisfies OtpEmailVerificationProps