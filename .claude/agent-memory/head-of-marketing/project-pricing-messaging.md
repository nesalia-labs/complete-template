---
name: project-pricing-messaging
description: Pricing structure for marketing — the 3 tiers, gate philosophy, pricing-page copy angles, and the open pricing questions
metadata:
  type: project
---

**Locked structure (2026-06-16):** 3 tiers, one-time payment, lifetime license. No recurring/subscription tier for v1 (universal in the band).

| Tier | Price | Marketing message |
|---|---|---|
| **Solo** | $299 | Indie founder, first SaaS. 1 app, 1 seat, all features, community Discord, 1 year of updates. |
| **Team** | $599 | Small team (2-5 people), first SaaS in production. Up to 3 apps, 10 seats, all features, email support (48h), 1 year of updates. |
| **Studio** | $999 | Agency / studio / power user. Unlimited apps + seats, white-label rights, priority + Slack support, lifetime updates, 1 onboarding session. |

**Gate philosophy (consistent — load-bearing for marketing):** All tiers get the **full feature set**. The gates are commercial: app count, seat count, support level, updates window, white-label rights, onboarding. This aligns with "no half-built features" — we cannot hold back features to push upgrades. The upgrade moments are earned (you outgrew 1 app, you need white-label), not forced.

**Pricing-page messaging rules:**
- Lead with what's INCLUDED at every tier, not what's gated.
- The "all features at every tier" line is itself a marketing differentiator.
- The Studio tier's "1 onboarding session" is real value at $999 — make it visible.
- Don't compare to the 50% renewal fee in copy; it shows in the renewal flow.

**Objection handling (use in pricing page FAQ):**
- "Why not ShipFast for $199?" → "ShipFast is lean by design. DeesseJS is complete + modular. The $100 buys you a dozen features you'd otherwise build yourself."
- "Why not supastarter at the same price?" → "supastarter is complete too. We're the only one that's complete AND truly modular — every feature is a self-contained module you can delete without breaking the rest."
- "Why not DIY with Better Auth + Next.js + Stripe?" → "You could. It would take you 2-3 months. We've done it. You get there in 30 minutes."

**Updates policy (proposed):** Solo/Team = 1 year of updates, then 50% renewal for new versions. Studio = lifetime updates. The 50% renewal is friendly to indie buyers and creates a recurring-revenue path without the "subscription" stigma.

**Open pricing questions (P1, block M7 — landing + sales):**
- Concrete gates: 1 vs 3 seats for Solo, 3 vs 5 apps for Team, 10 vs unlimited seats for Team.
- Updates scope after 1 year: 50% renewal (default), 30%, free, or no-renewal.
- Who delivers Studio's "1 onboarding session" (founder / contractor / agency partner) — affects Studio margin.
- Monorepo tool (pnpm + Turborepo default), CLI language (Bun default), Stripe-only vs Lemon Squeezy/Polar wrapper.

**Open pricing questions (P2, can decide anytime before launch):**
- Multi-currency (USD-only v1 default; add EUR at launch if asked).
- Education / non-profit discount (30% with .edu verification recommended).
- Free / OSS tier as top-of-funnel (defer; competitor set is 100% paid-only).
- Recurring revenue: optional support/upgrades subscription as separate product line (re-evaluate at 6 months).

**Recommended conversion-boosters:**
- 14-day free trial, no card required.
- 30-day money-back guarantee ("If DeesseJS doesn't save you 2 weeks, full refund.").
- "First 100 buyers" framing for the launch (recruits design partners, creates FOMO).

**How to apply:** Never recommend feature-gating — it breaks the "no half-built features" principle. The pricing page is a load-bearing artifact; treat its design as a feature, not a footer. See [[project-funnel-math]] for the revenue model.
