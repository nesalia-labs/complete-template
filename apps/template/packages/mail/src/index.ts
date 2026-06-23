/**
 * Public surface of `@deessejs/mail`. This is what `apps/web`,
 * `packages/auth`, and `packages/api` import.
 *
 * Per docs/internal/architecture/11-packages/mail/README.md#surface.
 */

// Core API
export { sendMail } from './send'
export { getMailer } from './provider'
export { mailTemplates, subjects } from './registry'

// Config (non-secret)
export { config } from './config'

// Provider types — for advanced custom composition
export type { Mailer, MailerSendInput, MailerSendResult } from './provider/types'

// Mail provider implementations — for advanced composition or tests
export {
  ConsoleMailer,
  NoopMailer,
  ResendMailer,
} from './provider'

// Types
export type {
  MailTemplateId,
  SendMailInput,
  SendMailResult,
  BaseMailProps,
} from './types'

// Templates — re-exported for direct use (e.g. apps/email-preview in M2)
export { ResetPassword } from './templates/reset-password'
export type { ResetPasswordProps } from './templates/reset-password'
export { VerifyEmail } from './templates/verify-email'
export type { VerifyEmailProps } from './templates/verify-email'
export { MagicLink } from './templates/magic-link'
export type { MagicLinkProps } from './templates/magic-link'
export { OtpSignIn } from './templates/otp-sign-in'
export type { OtpSignInProps } from './templates/otp-sign-in'
export { OtpEmailVerification } from './templates/otp-email-verification'
export type { OtpEmailVerificationProps } from './templates/otp-email-verification'
export { OtpForgotPassword } from './templates/otp-forgot-password'
export type { OtpForgotPasswordProps } from './templates/otp-forgot-password'
export { Wrapper } from './templates/Wrapper'
export type { WrapperProps } from './templates/Wrapper'
export { PrimaryButton } from './templates/components/PrimaryButton'