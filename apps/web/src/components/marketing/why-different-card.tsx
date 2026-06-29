import type { ComponentType, SVGProps } from "react"

import type { WhyDifferentCard as WhyDifferentCardData } from "@/lib/marketing/why-different"

import { BrandMarkConstellation } from "@/components/marketing/brand-mark-constellation"
import { OrdinalNumber } from "@/components/marketing/ordinal-number"

/**
 * WhyDifferentCard — one atomic card in the "Why DeesseJS is different"
 * vertical stack.
 *
 * Anatomy (per [[reference-decomposition-method]] step 1):
 *   1. Ordinal marker (mono "01")
 *   2. Category label (mono uppercase)
 *   3. Title (the strong claim)
 *   4. Body (1-2 sentence explanation)
 *   5. Contrast block (most templates vs DeesseJS)
 *   6. Constellation (optional row of brand marks)
 *
 * Layout:
 *   - Desktop: 2-column grid (meta column + content column)
 *   - Mobile: single column, meta sits above content
 *
 * The card itself is borderless — its parent <WhyDifferentSection>
 * applies `divide-y divide-border/40 border-y border-border/40`
 * which gives every card a hairline divider above it without
 * each card needing its own border (Linear recipe #11).
 *
 * Visual rules:
 *   - Mono brand: `text-foreground` for titles, `text-muted-foreground`
 *     for body, NO chromatic accent on the chrome
 *   - No drop shadows, no rounded corners on the card itself —
 *     the parent divider does the visual work
 *   - Contrast block uses `text-xs font-mono` to feel like a
 *     terminal transcript (research vibe, not marketing)
 *
 * Constellation marks are passed in as React components (not raw
 * markIds) so this file has zero coupling to the brand-marks module.
 * The parent section resolves `card.constellation.markIds` against the
 * `markMap` before passing them down.
 *
 * @param card - The data object from `lib/marketing/why-different.ts`
 * @param constellationMarks - Pre-resolved React components (one per
 *   entry in `card.constellation.markIds`). Empty array renders nothing.
 * @param constellationLabels - Parallel array of display names for the
 *   tooltips on each mark. Same order as `constellationMarks`. If absent
 *   or shorter than `marks`, the corresponding marks render without
 *   tooltips (still visible, just no hover label).
 * @param constellationColors - Parallel array of brand color overrides.
 *   `"currentColor"` falls back to the parent's `text-foreground`
 *   (mono default). Any other string is used as the mark's fill or
 *   color attribute. Same order as `constellationMarks`.
 */
export function WhyDifferentCard({
  card,
  constellationMarks = [],
  constellationLabels,
  constellationColors,
}: {
  card: WhyDifferentCardData
  constellationMarks?: ComponentType<SVGProps<SVGSVGElement>>[]
  constellationLabels?: string[]
  constellationColors?: string[]
}) {
  const showConstellation =
    card.constellation !== null && constellationMarks.length > 0

  return (
    <article className="grid grid-cols-1 gap-x-8 gap-y-4 py-12 sm:py-16 md:grid-cols-[auto_1fr] md:gap-x-12">
      {/* Meta column — ordinal + label */}
      <div className="flex items-baseline gap-3">
        <OrdinalNumber value={card.ordinal} />
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          {card.label}
        </span>
      </div>

      {/* Content column — title + body + contrast + constellation */}
      <div className="flex flex-col gap-4">
        <h3 className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {card.title}
        </h3>
        <p className="max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground">
          {card.body}
        </p>

        {/* Contrast block — mono, terminal-transcript feel */}
        <dl className="mt-2 flex flex-col gap-2 border-l border-border/60 pl-4 font-mono text-xs sm:text-sm">
          <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-3">
            <dt className="shrink-0 text-muted-foreground/70">most</dt>
            <dd className="text-muted-foreground">{card.contrast.alternative}</dd>
          </div>
          <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-3">
            <dt className="shrink-0 text-foreground">deessejs</dt>
            <dd className="text-foreground/90">{card.contrast.ours}</dd>
          </div>
        </dl>

        {/* Constellation — optional row of brand marks */}
        {showConstellation ? (
          <BrandMarkConstellation
            label={card.constellation!.label}
            marks={constellationMarks}
            labels={constellationLabels}
            colors={constellationColors}
          />
        ) : null}
      </div>
    </article>
  )
}
