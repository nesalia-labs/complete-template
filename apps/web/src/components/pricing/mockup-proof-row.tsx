import type { ComponentType } from "react"

import { Shield } from "lucide-react"

import { BillingContent } from "@/components/homepage/billing-content"
import { DXContent } from "@/components/homepage/dx-content"
import { UsersContent } from "@/components/homepage/users-content"

import { cn } from "@workspace/ui/lib/utils"

/**
 * MockupProofRow — replaces the old `ProofRow` (which used generic
 * lucide icons like Fingerprint / CreditCard / LayoutDashboard).
 *
 * The proof row on /pricing should show **the actual product**, not
 * pictograms. Per [[feedback-illustrations-use-css-not-svg]]: capability
 * illustrations are CSS mockups, not SVG diagrams.
 *
 * Each cell is a compact page preview: minimal URL-bar chrome + the
 * full content variant from the home page. The AppShell's sidebar is
 * omitted because the 3-col grid makes each cell ~340px wide — too
 * narrow for a 176px sidebar + readable content. This is a deliberate
 * tradeoff: the home pillars keep the full AppShell (claim + mockup
 * side by side), the proof row uses a compact chrome (3 surfaces
 * side by side).
 *
 * Reused components (zero new content components):
 *   - UsersContent   (home) — the Auth pillar mockup
 *   - BillingContent (home) — the Billing pillar mockup
 *   - DXContent      (home) — the DX kanban mockup
 */

interface MockupPreviewProps {
  url: string
  children: React.ReactNode
  className?: string
}

function MockupPreview({ url, children, className }: MockupPreviewProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border/40 bg-background",
        className,
      )}
    >
      {/* Compact URL bar — no sidebar, no nav, no user avatar */}
      <header className="flex h-9 items-center gap-2 border-b border-border/40 px-3">
        <Shield className="size-3 text-muted-foreground" aria-hidden />
        <span className="font-mono text-[10px] text-muted-foreground">
          {url}
        </span>
      </header>
      {/* Content */}
      <div className="h-[260px] overflow-hidden">{children}</div>
    </div>
  )
}

interface Variant {
  url: string
  Content: ComponentType
}

const variants: Variant[] = [
  { url: "deessejs.com/dashboard/users", Content: UsersContent },
  { url: "deessejs.com/dashboard/billing", Content: BillingContent },
  { url: "deessejs.com/dashboard/workflows", Content: DXContent },
]

export function MockupProofRow() {
  return (
    <div className="mt-12 grid gap-4 md:grid-cols-3">
      {variants.map(({ url, Content }) => (
        <MockupPreview key={url} url={url}>
          <Content />
        </MockupPreview>
      ))}
    </div>
  )
}