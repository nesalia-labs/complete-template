/**
 * Why-different data for the home page marketing surface.
 *
 * The "Why DeesseJS is different" section replaces the previous
 * "Why choose a SaaS boilerplate?" grid of 6 generic features with
 * 3 honest, verifiable differentiators. Each card pairs a strong
 * claim with a fact-based contrast against "most templates."
 *
 * Data-first (per [[reference-decomposition-method]] step 4): adding
 * a 4th differentiator is one object in the array, zero JSX change.
 */

import type { ComponentType, SVGProps } from "react"

/**
 * Identifiers for the bespoke mono SVG illustrations that may
 * accompany each card. The component looks them up by id; the SVG
 * files themselves live under `apps/web/src/components/illustrations/`.
 *
 * `null` means the card renders without an illustration (text-only).
 */
export type WhyDifferentIllustrationId =
  | "agents-md"
  | "typed-rpc"
  | "agents-as-customers"

/**
 * One card in the "Why different" vertical stack.
 */
export interface WhyDifferentCard {
  /** Two-digit ordinal marker (e.g. "01"). Rendered mono, tabular-nums. */
  ordinal: string
  /** Tiny mono uppercase category label (e.g. "File contract"). */
  label: string
  /** Strong claim — one line. The thing the visitor remembers. */
  title: string
  /** 1-2 sentence explanation. Honest, no superlatives. */
  body: string
  /**
   * Honest contrast block. Two lines: what "most templates" do,
   * what DeesseJS does instead. Stays factual, no competitor naming.
   */
  contrast: {
    alternative: string
    ours: string
  }
  /**
   * Optional constellation of brand marks. When present, the card
   * renders a labeled row of logos below the contrast block —
   * materializing the claim visually (e.g. "Read by: [5 agent logos]").
   *
   * Pure data: the component imports the actual React components from
   * `@/components/marketing/brand-marks.tsx`. Keeping the import map
   * there means adding/removing a logo is one entry in `markMap`.
   *
   * `null` means the card renders without a constellation.
   */
  constellation: {
    /** Mono uppercase label above the row (e.g. "Read by"). */
    label: string
    /** Keys resolved via `markMap` in `why-different-section.tsx`. */
    markIds: WhyDifferentMarkId[]
  } | null
  /** Illustration id, or null for text-only rendering. */
  illustration: WhyDifferentIllustrationId | null
}

/**
 * String identifiers for brand marks used by the constellation feature.
 * Resolved against actual React components in `brand-marks.tsx`.
 * Keeping them as strings (not component refs) lets the data stay
 * JSON-serializable and prevents client/server boundary issues.
 */
export type WhyDifferentMarkId =
  | "codex"
  | "pi"
  | "opencode"
  | "claude-code"
  | "gemini"
  | "cursor"
  | "hono"
  | "orpc"
  | "zod"
  | "drizzle"
  | "vercel"
  | "neon"
  | "resend"
  | "better-auth"

/** Placeholder for ClientComponent reference — fully resolved at the
 * card level by the consuming component. Kept here for documentation. */
export type _WhyDifferentMarkComponent = ComponentType<SVGProps<SVGSVGElement>>

/**
 * The 3 differentiators. Order is deliberate:
 *   1. The artifact (AGENTS.md) — most concrete
 *   2. The mechanism (typed RPC) — how it works
 *   3. The philosophy (agents as customers) — why
 *
 * Add a 4th only if it has a verifiable, fact-based contrast.
 * Do NOT pad to 6.
 */
export const whyDifferentCards: WhyDifferentCard[] = [
  {
    ordinal: "01",
    label: "File contract",
    title: "AGENTS.md ships with the template",
    body: "Your agents read it before they write a line. Same syntax humans use. Versioned. Tested in CI.",
    contrast: {
      alternative: "Most templates: no agent contract at all",
      ours: "DeesseJS: AGENTS.md, typed RPC, callable primitives",
    },
    illustration: "agents-md",
    constellation: {
      label: "Read by",
      markIds: ["codex", "pi", "opencode", "claude-code", "gemini", "cursor"],
    },
  },
  {
    ordinal: "02",
    label: "Runtime contract",
    title: "Typed RPC, not just REST",
    body: "Every surface — auth, billing, jobs, storage, notifications — exposes a callable handle your agents invoke. Not a code-completion helper. A runtime contract.",
    contrast: {
      alternative: "Most templates: OpenAPI specs for documentation",
      ours: "DeesseJS: end-to-end typed RPC with Hono + oRPC",
    },
    illustration: "typed-rpc",
    constellation: {
      label: "Powered by",
      markIds: ["hono", "orpc", "zod", "drizzle"],
    },
  },
  {
    ordinal: "03",
    label: "Customer model",
    title: "You're not the customer. Your agents are.",
    body: "Every primitive is designed for an agent to invoke — not for a developer to remember which route does what. The dev is the operator. The agent is the user.",
    contrast: {
      alternative: "Most templates: optimize for Claude Code / Cursor",
      ours: "DeesseJS: optimize for the agents running on it",
    },
    illustration: "agents-as-customers",
    constellation: {
      label: "Runs on",
      markIds: ["vercel", "neon", "resend", "better-auth"],
    },
  },
]
