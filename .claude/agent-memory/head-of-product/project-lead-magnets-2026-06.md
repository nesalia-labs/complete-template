---
name: project-lead-magnets-2026-06
description: Lead magnet strategy for DeesseJS (2026-06-16) — top-of-funnel for a $299-999 one-time product. Primary: DeesseJS Lite (public mini-template). Plus 3-tier combined strategy + State of SaaS Templates 2026 report.
metadata:
  type: project
---

The full strategy doc is at `documents/internal/product/lead-magnets.md`. This memory is the condensed version.

**Why this memory exists:** the user asked "what would be a lead magnet for this template?" The answer is **DeesseJS Lite — a public mini-template on GitHub** that ships the foundation + 1 feature (recommended: billing) + the modular contract + a "Deleting features" lite doc. The README points to the full DeesseJS with a CTA. This is the only lead magnet that has compounding reach (SEO + community + shares) for a developer audience.

**How to apply:** when the user asks "what's our lead magnet?" or "how do we get top-of-funnel?", the answer is DeesseJS Lite. When the user asks "should we do X as a lead magnet?", check the alternatives table in the full doc — the strong ones (State of SaaS Templates 2026, public demo) should be combined with Lite, not substituted.

## The funnel math (the constraint)

A $299-999 one-time product needs:
- 0.05% – 0.75% effective visitor-to-customer conversion
- 50 customers in 90 days = 5,000 leads = ~1M visitors

**The constraint:** getting 250k-1M visitors in 90 days is a hard SEO + distribution problem. The lead magnet must have **compounding reach** (SEO, social sharing, community) — not just paid traffic. The mini-template (public GitHub repo) is the only one that has compounding reach for a developer audience.

## The recommendation: DeesseJS Lite

A public GitHub repo that ships:
- Next.js + Drizzle + Better Auth + Tailwind + shadcn (the foundation)
- **One feature done to 100%** — recommended: **billing (Stripe)**
- The **modular contract**: every feature in its own folder, deletable, with a delete test
- A **"Deleting features" doc** (mini version of the flagship doc) — the wedge proof
- The README that points to the full DeesseJS with a clear CTA
- A landing page (deessejs.com/lite) that captures emails for the full launch waitlist

**Why it's the strongest lead magnet:**
1. Demonstrates the wedge in action (code > marketing)
2. Compounding SEO for long-tail keywords
3. Targets the right audience (developers who download Next.js starters)
4. Network effect (forks, stars, shares, contributions)
5. Doesn't cannibalize (1 surface vs 23)
6. Free to operate (GitHub is free)

**Effort:** 3-4 weeks, can run in parallel with v1 build (M5-M6).

## The 3-tier combined strategy

1. **DeesseJS Lite (GitHub)** — top-of-funnel, SEO, audience, wedge proof
2. **The State of SaaS Templates 2026 (PDF)** — mid-funnel, thought leadership, email capture
3. **Public deployed demo (app.deessejs.com)** — bottom-funnel, conversion, product experience

The mini-template is the **lynchpin**. The report is the **long-form complement**. The public demo is the **conversion accelerator**.

## The anti-competitive twist

**The most differentiating lead magnet** is a **"SaaS Template Buyer's Guide 2026"** that objectively compares 6-8 templates (ShipFast, Makerkit, SaasRock, supastarter, TurboStarter, Nexty, DeesseJS) on 20+ dimensions across 23 surfaces. 20-30 pages, scoring matrix, use case recommendations, honest "what's missing" section. Email-gated download, updated quarterly.

**Why it's the most differentiating:**
- Nobody else can produce it (we have the internal data)
- It's **honest** (buyers trust balanced critiques)
- Positions the founder as the **expert** on the market
- Generates SEO for "best Next.js SaaS template 2026," "ShipFast vs Makerkit"
- **Shareable** — buyers send it to cofounders

**Effort:** 3-4 weeks, can run in parallel with v1 build.

## Anti-patterns to avoid

- No newsletter-only lead magnet (too generic)
- No cheat sheet / PDF guide unless it's the Buyer's Guide
- No podcast or webinar as the primary (production cost too high)
- No Slack/Discord community at launch (moderation cost)
- No free trial of Cloud (managed variant) until Cloud ships
- No "lite" feature other than billing at v1 launch
- No "waitlist with countdown timer" gimmick

## Decisions needed (defaults if no objection)

- **Primary lead magnet:** DeesseJS Lite
- **One feature in Lite:** billing (Stripe)
- **Lite license:** MIT (maximum reach)
- **State of SaaS Templates report:** ship in 2026-Q3
- **Public demo infra cost budget:** $100/mo cap
- **Vertical starters (post-launch):** wait-and-see
- **Free trial of full DeesseJS:** at launch
- **Money-back guarantee:** 30 days

## Related memories

- [[project-purpose]] — what DeesseJS is
- [[project-positioning-hybrid-2026-06]] — the wedge + design principles
- [[project-unmet-needs-2026-06]] — the research that informs the Buyer's Guide
- [[project-deessejs-cloud-2026-06]] — the public demo may be the Cloud v0
- [[project-stack-and-scope-2026-06]] — the v1 stack that Lite extracts from
- [[reference-template-competitors]] — the templates the Buyer's Guide compares
