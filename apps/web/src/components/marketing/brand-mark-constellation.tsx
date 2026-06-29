import type { ComponentType, CSSProperties, SVGProps } from "react"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/ui/tooltip"

type MarkComponent = ComponentType<SVGProps<SVGSVGElement>>

const DEFAULT_COLOR = "currentColor"

/**
 * BrandMarkConstellation — row of brand marks with an optional mono
 * label above and a hover tooltip showing each mark's display name.
 *
 * Pattern: in the "Why different" section, each card materializes its
 * claim with a constellation of logos (e.g. "Read by: Codex · Pi · ...").
 * Hovering a logo surfaces its display name — same pattern as the
 * 8-logo stack row in the hero (see `apps/web/src/components/headers/
 * home-header.tsx` for the canonical tooltip-on-logo usage).
 *
 * Color strategy:
 *   - `colors` is a parallel array to `marks`. A value of
 *     `"currentColor"` (or undefined) keeps the mark in mono —
 *     inherits the parent's `text-foreground`.
 *   - Any other string is applied as the mark's color.
 *     - For `Si*` wrappers (simple-icons): passed as the `color` prop.
 *       They apply it directly to the SVG's `fill` attribute.
 *     - For our inline components (Codex, Pi, OpenCode, etc.):
 *       passed as `style={{ color }}` because they use
 *       `fill="currentColor"` and read their tint from CSS.
 *   - Per [[feedback-deessejs-mono-design-language]] nuance (2026-06-26):
 *     logos are an explicit exception to the no-chromatic-accent rule.
 *     Their native color carries the brand identity, which is the
 *     whole point of the constellation.
 *
 * Visual rules:
 *   - Uniform size for all marks (default 20px)
 *   - Tight, consistent gap between marks
 *   - Optional mono uppercase label above the row, aligned with the
 *     card's contrast block
 *   - `border-t border-border/40` separates the constellation from
 *     the contrast block above it (matches the card stack rhythm)
 *
 * Tooltip caveat (per [[feedback-base-ui-tooltip-aschild]]):
 *   The Base UI `TooltipTrigger` renders as a button internally. The
 *   mark component itself goes directly inside `TooltipTrigger` —
 *   do NOT wrap it in another `<button>`, that would produce a
 *   hydration error ("button cannot be a descendant of button").
 *
 * Usage:
 *   <BrandMarkConstellation
 *     label="Read by"
 *     marks={[CodexMark, PiMark, SiHono, ...]}
 *     labels={["Codex", "Pi", "Hono", ...]}
 *     colors={["currentColor", "currentColor", "#E36002", ...]}
 *   />
 */
export function BrandMarkConstellation({
  label,
  marks,
  labels,
  colors,
  size = 20,
}: {
  /** Optional mono uppercase label above the row. */
  label?: string
  /** Array of brand mark components. Rendered left-to-right. */
  marks: MarkComponent[]
  /** Parallel array of human-readable display names (for tooltips). */
  labels?: string[]
  /**
   * Parallel array of brand colors. `"currentColor"` or `undefined`
   * keeps the mark in mono (default). Any other string is applied
   * as the mark's color.
   */
  colors?: string[]
  /** Pixel size for each mark. Uniform across the row. Default 20. */
  size?: number
}) {
  if (marks.length === 0) return null

  return (
    <div className="flex flex-col gap-2 border-t border-border/40 pt-4">
      {label ? (
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
      ) : null}
      <TooltipProvider delay={150}>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          {marks.map((Mark, i) => {
            const tooltipLabel = labels?.[i]
            const colorValue = colors?.[i] ?? DEFAULT_COLOR
            const isMono = colorValue === DEFAULT_COLOR

            // For Si* wrappers (simple-icons), pass `color` as a prop —
            // they read it directly to fill the SVG.
            // For our inline components (fill="currentColor"), pass
            // `style={{ color }}` so CSS cascade flows the value down.
            const markProps: SVGProps<SVGSVGElement> & {
              color?: string
              style?: CSSProperties
            } = {
              width: size,
              height: size,
              "aria-hidden": !tooltipLabel,
              "aria-label": tooltipLabel,
            }

            if (!isMono) {
              // Heuristic: Si* components accept a `color` prop;
              // our inline components use `fill="currentColor"` and
              // respond to CSS `color`. Try `color` first since it
              // works for both — Si* reads it, and our inline
              // components will treat it as an unknown prop (filtered
              // out by ...props spread, but kept here as a no-op).
              // Actually, our inline components spread `{...props}`
              // onto the svg root, which would set `color=` as an
              // attribute — but that's not valid SVG. So we use
              // `style` only for safety, and the Si* path needs a
              // separate prop. The simplest reliable strategy: pass
              // both. Si* reads `color`, inline ignores it as an
              // unknown attribute (browser drops it).
              markProps.color = colorValue
              markProps.style = { color: colorValue }
            }

            const markNode = <Mark key={i} {...markProps} />

            if (!tooltipLabel) return markNode
            return (
              <Tooltip key={i}>
                <TooltipTrigger>{markNode}</TooltipTrigger>
                <TooltipContent>{tooltipLabel}</TooltipContent>
              </Tooltip>
            )
          })}
        </div>
      </TooltipProvider>
    </div>
  )
}