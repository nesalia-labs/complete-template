import type {
  ComparisonBlock,
  FounderOffer,
  Guarantee,
  PricingFaq,
  ProofItem,
  Tier,
} from "./types"

/**
 * Tier data — 3 tiers: Lite (free lead magnet), Starter (solo dev),
 * Team (agency / multi-project). Updated 2026-06-29 to remove Pro and
 * simplify to the lead-magnet → solo → agency scope.
 *
 * `highlighted` removed — with 3 tiers the visitor doesn't need a
 * default selection. Visual hierarchy comes from the tier names + scope
 * copy instead.
 */
export const tiers: Tier[] = [
  {
    name: "Lite",
    description: "MIT, lead magnet, demo.",
    regularPrice: 0,
    founderPrice: 0,
    features: [
      "Auth (email + OAuth + passkeys)",
      "Billing (Stripe subscriptions)",
      "AGENTS.md + agent rules",
      "MIT licensed — fork freely",
      "Community Discord",
    ],
    cta: "Get Lite",
    highlighted: false,
    slug: "lite",
    freeTier: true,
    githubUrl: "https://github.com/nesalia-inc/deessejs-lite",
    cardVariant: "dashed",
  },
  {
    name: "Starter",
    description: "1 project, 1 dev, full stack.",
    regularPrice: 299,
    founderPrice: 299,
    features: [
      "Everything in Lite, plus:",
      "Database (Postgres + Drizzle)",
      "Backend (Hono + oRPC typed RPC)",
      "Storage (R2 / S3 compatible)",
      "Background jobs (Trigger.dev + QStash)",
      "Docs site (Fumadocs)",
      "AI agent primitives + AGENTS.md",
      "Lifetime updates",
    ],
    cta: "Get Starter",
    highlighted: false,
    slug: "starter",
    buyUrl: "mailto:founders@deessejs.com?subject=Get%20DeesseJS%20Starter",
  },
  {
    name: "Team",
    description: "Multi-project, seats, agency scope.",
    regularPrice: 899,
    founderPrice: 899,
    features: [
      "Everything in Starter, plus:",
      "Up to 10 projects",
      "10 seats included",
      "Multi-tenant architecture",
      "White-label / rebrand rights",
      "AI Agent Workflow Library",
      "Private Discord community",
      "Priority support (24h SLA)",
    ],
    cta: "Get Team",
    highlighted: false,
    slug: "team",
    buyUrl: "mailto:founders@deessejs.com?subject=Get%20DeesseJS%20Team",
  },
]

/**
 * Founding-member offer — shown as the FounderBanner at the top of the
 * pricing page. Limited to 50 customers total; closes July 31, 2026.
 *
 * Updated 2026-06-29: removed $99 reference after pricing was simplified
 * to 3 tiers (no Pro). The banner now signals "limited cohort" without
 * claiming a specific tier price.
 */
export const founderOffer: FounderOffer = {
  label: "Founding-member cohort",
  regularPrice: 0,
  price: 0,
  unit: "limited to the first 50 customers",
  body: "Lock in founding-member pricing. After July 31, 2026, prices go up.",
  cap: 50,
  claimed: 37,
  closesAt: "2026-07-31",
}

/**
 * 14-day money-back guarantee.
 */
export const guarantee: Guarantee = {
  label: "14-day money-back guarantee",
  body: "If your agents don't save you 3 months of development work in the first 14 days, email us for a full refund — no questions asked.",
  detail:
    "Email founders@deessejs.com within 14 days of purchase. Refunds are processed within 2 business days.",
}

/**
 * Exceptions + comparison block (Raze Layer 3).
 * Sourced from the FAQ answer about how DeesseJS differs from supastarter / MakerKit.
 */
export const comparisonBlocks: ComparisonBlock[] = [
  {
    title: "Optimized for AI agents, not just AI-assisted developers",
    rows: [
      {
        label: "Tool-calling primitives agents invoke",
        values: [
          "Auth, billing, jobs, storage, notifications, API",
          "Auth, billing only",
          "Auth, billing only",
        ],
      },
      {
        label: "End-to-end typed RPC",
        values: ["Hono + oRPC (no codegen)", "REST only", "REST only"],
      },
      {
        label: "AGENTS.md + agent workflow library",
        values: ["Yes (Pro+)", "Partial", "No"],
      },
      {
        label: "Multi-tenant LLM metering",
        values: ["Yes (Team)", "No", "No"],
      },
    ],
  },
  {
    title: "Ship-ready wiring out of the box",
    rows: [
      {
        label: "Storage provider",
        values: [
          "Cloudflare R2 (S3-compatible)",
          "AWS S3 only",
          "AWS S3 only",
        ],
      },
      {
        label: "Background jobs",
        values: ["Trigger.dev + QStash", "Inngest only", "None"],
      },
      {
        label: "Email + React Email templates",
        values: ["Yes (Pro+)", "Add-on", "Add-on"],
      },
      {
        label: "Monitoring (Sentry)",
        values: ["Yes (Pro+)", "Add-on", "Add-on"],
      },
    ],
  },
  {
    title: "Enterprise / custom needs",
    rows: [
      {
        label: "Self-hosted",
        values: ["Yes (you own every line)", "Yes", "Yes"],
      },
      {
        label: "White-label / rebrand",
        values: ["Yes (Team)", "No", "Yes"],
      },
      {
        label: "Onboarding session",
        values: ["Yes (Team, 60 min)", "No", "Yes (paid)"],
      },
    ],
  },
]

/**
 * Proof row items — "what you ship on day 1".
 * The `image` paths are placeholders. Replace with real screenshots once
 * available in /public.
 */
export const proofItems: ProofItem[] = [
  {
    title: "Auth + 2FA + passkeys",
    caption:
      "Wired with Better Auth. Sessions, magic links, OAuth, and passkeys out of the box.",
  },
  {
    title: "Stripe billing + metered usage",
    caption:
      "Per-seat subscriptions plus metered LLM usage. Stripe Customer Portal included.",
  },
  {
    title: "Admin dashboard + tenants",
    caption:
      "Per-tenant isolation, RBAC, audit log, and the agent activity feed.",
  },
]

/**
 * Pricing-specific FAQ subset.
 *
 * Source: the home page FAQ list. Items selected are the ones where the
 * answer is pricing-specific or a money-back / refund / cap question.
 * General agentic / DeesseJS Cloud / prompting questions stay on home.
 */
export const pricingFaqs: PricingFaq[] = [
  {
    question: "How is this different from supastarter or MakerKit?",
    answer:
      "They optimize AI for the developer — Claude Code, Cursor, Codex integration. DeesseJS optimizes the system for AI agents. Your agents don't just help you code — they run on DeesseJS, call the tools directly, and build your product while you sleep.",
  },
  {
    question: "What if DeesseJS doesn't work for my project?",
    answer:
      "14-day money-back guarantee — no questions asked. If your agents don't save you 3 months of development work in the first 14 days, email us for a full refund.",
  },
  {
    question: "Is there a free version?",
    answer:
      "Yes — DeesseJS Lite. It's an open-source subset of the template, free to download, ships with auth + billing + the agent primitives. Try it before you buy the full template.",
  },
  {
    question: "What about DeesseJS Cloud?",
    answer:
      "Coming Q3 2026. It's the managed variant — your agents run on infrastructure we operate. Private beta opens before public launch.",
  },
  {
    question: "When does the founder pricing close?",
    answer:
      "July 31, 2026. After that, regular pricing kicks in at $399 / $599 / $999. Founding-member ($99) is capped at 50 and closes when the cap hits.",
  },
  {
    question: "Can I upgrade tiers later?",
    answer:
      "Yes — pay the difference between your current tier and the new one. Founder pricing locks in for the duration of the program; upgrades after July 31, 2026 use the regular-price delta.",
  },
]