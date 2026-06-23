/**
 * `PrimaryButton` — the CTA button reused across `reset-password`,
 * `verify-email`, and `magic-link` templates. Brand classes via Tailwind.
 */

import { Button } from 'react-email'

export interface PrimaryButtonProps {
  href: string
  children: React.ReactNode
}

export function PrimaryButton({ href, children }: PrimaryButtonProps) {
  return (
    <Button
      href={href}
      className="rounded-md bg-brand px-5 py-3 text-center text-sm font-semibold text-brand-foreground no-underline"
    >
      {children}
    </Button>
  )
}

export default PrimaryButton