import { ArrowRight, Sparkles } from "lucide-react"

import { cn } from "@workspace/ui/lib/utils"

import type { FounderOffer } from "@/lib/pricing/types"

/**
 * FounderBanner — the urgency strip at the top of /pricing.
 *
 * Inverted (bg-foreground text-background) full-width strip that signals:
 *   - Limited cohort (capped at `cap`, with `claimed` already counted)
 *   - Scheduled deadline (`closesAt`)
 *   - Visible progress bar so the cohort feels finite
 *
 * Pattern per SaaSHero (April 2026) "urgency elements" guide: ethical
 * scarcity tied to real constraints. Decision 168 + ND Hive founder
 * pages for the visual reference (inverted strip + counter + progress).
 *
 * Visual rules (mono DeesseJS, inverted):
 *   - No shadows, no gradients
 *   - Hairline divider in `text-background/20` (the only non-white ink)
 *   - Numbers in font-mono tabular-nums so digits align
 *   - CTA is the visual anchor — the rest is context
 *
 * Computation notes:
 *   - `progress = claimed / cap` is the visual fill
 *   - `daysLeft` is computed once from `closesAt` (server time at render)
 *   - `closesAt` is a static ISO date for now; would be a Date if we go live
 */
interface FounderBannerProps {
  offer: FounderOffer
  className?: string
}

export function FounderBanner({ offer, className }: FounderBannerProps) {
  const progress = Math.min(100, Math.round((offer.claimed / offer.cap) * 100))
  const daysLeft = computeDaysLeft(offer.closesAt)

  return (
    <div
      className={cn(
        "rounded-xl border border-border/40 bg-foreground p-6 text-background sm:p-8",
        className,
      )}
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: label + claim */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4" aria-hidden />
            <p className="font-mono text-xs uppercase tracking-widest text-background/70">
              {offer.label}
            </p>
          </div>

          <p className="mt-2 text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
            Lock in founding-member pricing — limited to {offer.cap} customers.
          </p>

          <p className="mt-2 max-w-2xl text-pretty text-sm text-background/70">
            {offer.body}
          </p>
        </div>

        {/* Right: CTA */}
        <a
          href="mailto:founders@deessejs.com?subject=Claim%20DeesseJS%20founder%20pricing"
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-background px-6 text-sm font-semibold text-foreground transition-transform hover:scale-105"
        >
          Claim founder pricing
          <ArrowRight className="size-4" aria-hidden />
        </a>
      </div>

      {/* Divider */}
      <div className="my-6 h-px w-full bg-background/20" />

      {/* Stats row: counter + progress + countdown */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Counter */}
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-background/60">
            Claimed
          </p>
          <p className="mt-1 font-mono text-xl font-semibold tabular-nums">
            {offer.claimed} <span className="text-background/40">/ {offer.cap}</span>
          </p>
        </div>

        {/* Progress bar */}
        <div className="sm:col-span-1">
          <p className="font-mono text-[10px] uppercase tracking-widest text-background/60">
            Cohort progress
          </p>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-background/15">
            <div
              className="h-full rounded-full bg-background transition-[width]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-1 font-mono text-[11px] tabular-nums text-background/70">
            {progress}% claimed
          </p>
        </div>

        {/* Countdown */}
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-background/60">
            Closes
          </p>
          <p className="mt-1 font-mono text-xl font-semibold tabular-nums">
            {daysLeft > 0 ? (
              <>
                {daysLeft}{" "}
                <span className="text-background/40">
                  day{daysLeft === 1 ? "" : "s"} left
                </span>
              </>
            ) : (
              <span className="text-background/70">Closed</span>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

/**
 * Compute the number of days between today and `isoDate` (YYYY-MM-DD).
 * Returns 0 if the date has passed.
 */
function computeDaysLeft(isoDate: string): number {
  const target = new Date(isoDate + "T00:00:00")
  const now = new Date()
  const diffMs = target.getTime() - now.getTime()
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  return Math.max(0, days)
}