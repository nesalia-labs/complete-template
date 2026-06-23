/**
 * The single source of truth for every mail template. Two exports:
 *
 * - `mailTemplates` — maps `MailTemplateId` → React component (used by
 *   `sendMail()` to render the right template for a given ID).
 * - `subjects` — maps `MailTemplateId` → email subject line. Kept out
 *   of the template bodies so subject A/B tests don't touch JSX.
 *
 * Adding a template = one file in `templates/` + two entries here.
 *
 * Per docs/internal/architecture/11-packages/mail/structure.md#srcregistryts.
 */

import { MagicLink } from './templates/magic-link'
import { OtpEmailVerification } from './templates/otp-email-verification'
import { OtpForgotPassword } from './templates/otp-forgot-password'
import { OtpSignIn } from './templates/otp-sign-in'
import { ResetPassword } from './templates/reset-password'
import { VerifyEmail } from './templates/verify-email'

export const mailTemplates = {
  resetPassword: ResetPassword,
  verifyEmail: VerifyEmail,
  magicLink: MagicLink,
  'otp-sign-in': OtpSignIn,
  'otp-email-verification': OtpEmailVerification,
  'otp-forgot-password': OtpForgotPassword,
} as const

export const subjects = {
  resetPassword: 'Reset your DeesseJS password',
  verifyEmail: 'Verify your DeesseJS email',
  magicLink: 'Your DeesseJS sign-in link',
  'otp-sign-in': 'Your DeesseJS sign-in code',
  'otp-email-verification': 'Your DeesseJS verification code',
  'otp-forgot-password': 'Reset your DeesseJS password',
} as const