import type { ComponentType, SVGProps } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@workspace/ui/components/ui/button"

import { whyDifferentCards } from "@/lib/marketing/why-different"
import type { WhyDifferentMarkId } from "@/lib/marketing/why-different"

import {
  BetterAuthMark,
  ClaudeCodeMark,
  CodexMark,
  CursorMark,
  DrizzleMark,
  GeminiMark,
  HonoMark,
  NeonMark,
  OpenCodeMark,
  OrpcMark,
  PiMark,
  ResendMark,
  VercelMark,
  ZodMark,
} from "@/components/marketing/brand-marks"
import { SectionLabel } from "@/components/marketing/section-label"
import { WhyDifferentCard } from "@/components/marketing/why-different-card"

/**
 * WhyDifferentSection — the home-page section that explains
 * what makes DeesseJS different from other SaaS templates.
 *
 * Replaces the previous "Why choose a SaaS boilerplate?" 6-card
 * generic grid (anti-pattern #4 in [[reference-ai-design-workflow]]).
 * The new design answers Q2 (vs alternatives) instead of muddling
 * through 4 different questions at once.
 *
 * Anatomy (per [[reference-decomposition-method]]):
 *   - SectionLabel + headline + subhead (the framing)
 *   - Hairline-bordered vertical stack of <WhyDifferentCard />
 *     (Linear recipe #11 — no per-card backgrounds, dividers do the work)
 *   - Final CTA → /pricing#compare (the comparison matrix)
 *
 * Constellation resolution:
 *   - `markMap` below resolves the string `markIds` from data to
 *     actual React components from `brand-marks.tsx`.
 *   - Adding a new brand mark = one entry in this map + one new
 *     component in `brand-marks.tsx`. No other file changes.
 *
 * Visual rules:
 *   - Mono brand: no chromatic accents, no gradients, no shadows
 *   - `divide-y divide-border/40 border-y border-border/40` on the
 *     list gives every card a hairline above without any card needing
 *     its own border
 *   - Vertical stack (not grid) so each card has its full weight
 *     and so future illustrations slot in cleanly
 *
 * NOTE: container (`<section>` + `bodyContainerClass` + `sectionPadding`)
 * is owned by the page.tsx composer. This component only owns the
 * INNER content. Keeps it composable across pages if we ever want
 * to reuse it.
 */
const markMap: Record<WhyDifferentMarkId, ComponentType<SVGProps<SVGSVGElement>>> = {
  "codex": CodexMark,
  "pi": PiMark,
  "opencode": OpenCodeMark,
  "claude-code": ClaudeCodeMark,
  "gemini": GeminiMark,
  "cursor": CursorMark,
  "hono": HonoMark,
  "orpc": OrpcMark,
  "zod": ZodMark,
  "drizzle": DrizzleMark,
  "vercel": VercelMark,
  "neon": NeonMark,
  "resend": ResendMark,
  "better-auth": BetterAuthMark,
}

/**
 * Human-readable display names for each brand mark, used as
 * tooltip labels on hover. Kept in lockstep with `markMap` —
 * if you add a new markId, add the matching displayName here.
 */
const markLabels: Record<WhyDifferentMarkId, string> = {
  "codex": "Codex",
  "pi": "Pi",
  "opencode": "OpenCode",
  "claude-code": "Claude Code",
  "gemini": "Gemini",
  "cursor": "Cursor",
  "hono": "Hono",
  "orpc": "oRPC",
  "zod": "Zod",
  "drizzle": "Drizzle",
  "vercel": "Vercel",
  "neon": "Neon",
  "resend": "Resend",
  "better-auth": "Better-Auth",
}

/**
 * Official brand colors for each mark. The "mono" value (defined as
 * `"currentColor"`) falls back to `text-foreground` from the parent —
 * applied to marks without a strong brand color identity (Codex, Pi,
 * OpenCode, oRPC, Vercel, Better-Auth) where the visual mark IS the
 * brand and the color is just the page's foreground tone.
 *
 * Per [[feedback-deessejs-mono-design-language]] nuance (2026-06-26):
 * logos are an exception to the no-chromatic-accent rule — their
 * native color carries the brand identity, which is the whole point
 * of the constellation. The "no flashy" rule still applies to
 * surrounding UI, not to logo glyphs themselves.
 *
 * Sources: official brand kits / simple-icons color metadata where
 * available. Hex values picked for adequate contrast against both
 * light (`bg-background`) and dark (`dark:bg-...`) backgrounds.
 */
const markColors: Record<WhyDifferentMarkId, string> = {
  // Mono brands — the glyph itself is the brand
  "codex": "currentColor",
  "pi": "currentColor",
  "opencode": "currentColor",
  "orpc": "currentColor",
  "vercel": "currentColor",
  "cursor": "currentColor",
  "resend": "currentColor",
  "better-auth": "currentColor",

  // Chromatic brands
  "claude-code": "#D97757", // Anthropic clay
  "gemini": "#4285F4", // Google blue (simplified from the official gradient)
  "hono": "#E36002", // Hono orange
  "zod": "#3E67B1", // Zod deep blue (official)
  "drizzle": "#C5F74F", // Drizzle green-yellow (current brand)
  "neon": "#00E699", // Neon teal-green
}

export function WhyDifferentSection() {
  return (
    <>
      <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
        <SectionLabel>What you won&apos;t find elsewhere</SectionLabel>
        <h2 className="text-balance text-4xl font-bold tracking-tighter text-foreground sm:text-5xl">
          Why DeesseJS is different.
        </h2>
        <p className="mt-4 text-pretty text-lg text-muted-foreground">
          Three things other templates don&apos;t give you. Verified, not promised.
        </p>
      </div>

      <div className="divide-y divide-border/40 border-y border-border/40">
        {whyDifferentCards.map((card) => {
          if (!card.constellation) {
            return <WhyDifferentCard key={card.ordinal} card={card} />
          }
          const markIds = card.constellation.markIds
          const constellationMarks = markIds
            .map((id) => markMap[id])
            .filter(Boolean)
          const constellationLabels = markIds.map((id) => markLabels[id])
          const constellationColors = markIds.map((id) => markColors[id])
          return (
            <WhyDifferentCard
              key={card.ordinal}
              card={card}
              constellationMarks={constellationMarks}
              constellationLabels={constellationLabels}
              constellationColors={constellationColors}
            />
          )
        })}
      </div>

      <div className="mt-12 flex justify-center sm:mt-16">
        <Button
          variant="outline"
          className="h-9 gap-2 rounded-md px-6 text-sm font-medium"
          nativeButton={false}
          render={<Link href="/pricing#compare" />}
        >
          See the full comparison
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </>
  )
}
