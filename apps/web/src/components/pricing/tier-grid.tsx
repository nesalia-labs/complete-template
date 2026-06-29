import { ArrowRight, Check, Sparkles } from "lucide-react"

import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"

import { cn } from "@workspace/ui/lib/utils"

import type { Tier } from "@/lib/pricing/types"

/**
 * TierGrid — 4-card tier row (Raze Layer 1: Package).
 *
 * Layout (4 tiers: Lite, Starter, Pro, Team):
 *   1. Header   — tier name + inline "Most popular" badge (Pro) + description
 *   2. Separator
 *   3. Price    — regular price (line-through, small) + founder price (large) +
 *                 "one-time · lifetime" line. Free tier shows "Free forever" instead.
 *   4. CTA      — full-width button (primary for Pro, outline for others).
 *                 Risk-reversal line ("14-day money-back") directly below.
 *   5. Separator
 *   6. Features — "Key features:" label + 5 bulleted items with check icons
 *
 * Visual rules (mono DeesseJS):
 *   - NO shadow-sm (mono rule — borders beat shadows)
 *   - Pro is highlighted via ring + scale-105, NOT a fill background
 *   - Lite is rendered with `border-dashed` for visual differentiation
 *   - Brand marks stay mono unless they have a brand color
 *
 * CTA href:
 *   - Free tier (Lite): `githubUrl`
 *   - Other tiers: `buyUrl` if set, else mailto fallback to founders@
 *     (the actual Stripe Checkout URL will replace these placeholders
 *     once billing is wired)
 */
export function TierGrid({ tiers }: { tiers: Tier[] }) {
  return (
    <div className="mt-12 grid w-full max-w-5xl gap-4 mx-auto md:grid-cols-2 lg:grid-cols-3">
      {tiers.map((tier) => {
        const isHighlighted = tier.highlighted
        const isFree = tier.freeTier === true
        const ctaHref =
          isFree && tier.githubUrl
            ? tier.githubUrl
            : (tier.buyUrl ??
              `mailto:founders@deessejs.com?subject=Get%20DeesseJS%20${encodeURIComponent(tier.name)}`)

        return (
          <div
            key={tier.name}
            className={cn(
              "group relative flex w-full flex-col rounded-xl border bg-background p-6 transition-colors sm:p-7",
              // Card variant: dashed for free, solid otherwise
              tier.cardVariant === "dashed"
                ? "border-dashed border-border/60"
                : "border-border/40",
              // Pro highlight: ring + scale
              isHighlighted &&
                "border-foreground/30 ring-1 ring-foreground/15 lg:scale-105 lg:shadow-sm",
            )}
          >
            {/* Header */}
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold tracking-tight text-foreground">
                {tier.name}
              </h3>
              {isHighlighted ? (
                <Badge className="inline-flex h-5 items-center gap-1 rounded-full border-transparent bg-foreground px-2 py-0 text-[10px] font-medium text-background [&_svg]:size-2.5">
                  <Sparkles className="size-2.5" aria-hidden />
                  Most popular
                </Badge>
              ) : null}
              {isFree ? (
                <Badge
                  variant="secondary"
                  className="rounded-full border-transparent px-2 py-0 text-[10px] font-medium"
                >
                  Open source
                </Badge>
              ) : null}
            </div>

            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {tier.description}
            </p>

            <div className="my-5 h-px w-full bg-border/40" />

            {/* Price block */}
            {isFree ? (
              <div>
                <p className="font-mono text-3xl font-semibold tracking-tight text-foreground">
                  Free
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  forever · MIT licensed
                </p>
              </div>
            ) : (
              <div>
                <p className="flex items-baseline gap-2 font-mono text-sm text-muted-foreground">
                  <span className="line-through tabular-nums">
                    ${tier.regularPrice}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/70">
                    regular
                  </span>
                </p>
                <p className="mt-1 flex items-baseline gap-1 font-semibold">
                  <span className="font-mono text-base leading-none text-muted-foreground">
                    $
                  </span>
                  <span className="font-mono text-5xl font-semibold leading-none tracking-tight tabular-nums text-foreground">
                    {tier.founderPrice}
                  </span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  one-time · lifetime updates
                </p>
              </div>
            )}

            {/* CTA + risk reversal */}
            <Button
              className={cn(
                "mt-5 h-10 w-full rounded-md text-sm font-medium",
                isHighlighted ? "" : "",
              )}
              variant={isHighlighted ? "default" : "outline"}
              nativeButton={false}
              render={<a href={ctaHref} />}
            >
              {tier.cta}
              <ArrowRight className="size-4" aria-hidden />
            </Button>
            {!isFree ? (
              <p className="mt-2 text-center text-xs text-muted-foreground">
                14-day money-back guarantee
              </p>
            ) : (
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Open source · fork freely
              </p>
            )}

            <div className="my-5 h-px w-full bg-border/40" />

            {/* Features */}
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {isFree ? "Includes" : "Key features"}
              </p>
              <ul className="flex flex-col gap-2">
                {tier.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <Check
                      className="mt-0.5 size-3.5 shrink-0 text-foreground"
                      aria-hidden
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )
      })}
    </div>
  )
}