/**
 * OTP sign-in email. Triggered by Better Auth's
 * `emailOTP.sendVerificationOTP` with `type: 'sign-in'`.
 *
 * See docs/internal/architecture/11-packages/mail/integrations.md#hook-4--emailotpsendverificationotp-authts85
 */

import { Heading, Section, Text } from 'react-email'
import type { BaseMailProps } from '../types'
import { Wrapper } from './Wrapper'

export interface OtpSignInProps extends BaseMailProps {
  otp: string
  expiresInMinutes: number
}

export function OtpSignIn({ otp, expiresInMinutes, preview }: OtpSignInProps) {
  return (
    <Wrapper preview={preview ?? 'Your DeesseJS sign-in code'}>
      <Heading as="h2" className="m-0 mb-4 text-xl font-semibold text-zinc-900">
        Your sign-in code
      </Heading>
      <Text className="m-0 mb-6 text-base leading-6 text-zinc-700">
        Use the code below to sign in to DeesseJS. It expires in{' '}
        <strong>{expiresInMinutes} minutes</strong>.
      </Text>
      <Section className="my-6 rounded-md border border-border bg-zinc-50 px-6 py-8 text-center">
        <Text className="m-0 text-4xl font-bold tracking-widest text-zinc-900">
          {otp}
        </Text>
      </Section>
      <Text className="m-0 text-sm leading-5 text-zinc-600">
        If you did not request this code, you can safely ignore this email.
      </Text>
    </Wrapper>
  )
}

export default OtpSignIn

OtpSignIn.PreviewProps = {
  otp: '482915',
  expiresInMinutes: 10,
  preview: 'Your DeesseJS sign-in code',
} satisfies OtpSignInProps