---
name: project-lead-magnets-strategy
description: Lead magnet strategy — DeesseJS Lite as primary, plus State of SaaS Templates report, public demo, and the Buyer's Guide as anti-competitive twist
metadata:
  type: project
---

**Funnel math constraint:** $299-999 one-time product means 0.5% average visitor→customer. To hit 25-100 customers in 90 days we need 250K-1M visitors. The lead magnet must have **compounding reach** (SEO, social, community) — not just paid traffic. A public GitHub repo is the only lead magnet with compounding reach for a developer audience.

**The 3-tier combined strategy (recommended, runs in parallel):**
1. **DeesseJS Lite (GitHub, MIT)** — primary top-of-funnel. Next.js + Drizzle + Better Auth + Tailwind + shadcn + Stripe billing + the modular contract + "Deleting features" doc. Reuses v1 code. 3-4 weeks effort. Ship M5-M6 of the build.
2. **State of SaaS Templates 2026 (PDF, 20-30 pages)** — mid-funnel thought leadership, email-gated. 2-3 weeks writing + design. Ship M5 of the build.
3. **Public deployed demo (app.deessejs.com)** — bottom-funnel conversion. Real DeesseJS instance, free tier with limits, auto-converts to paid at threshold. Infra cost ~$100/mo cap. Ship M7 at launch.

**The anti-competitive twist — the most differentiating lead magnet: "SaaS Template Buyer's Guide 2026"** (PDF, 20-30 pages). Objectively compares 6-8 templates (ShipFast, Makerkit, SaasRock, supastarter, TurboStarter, Nexty, DeesseJS) on 20+ dimensions across 23 surfaces, with a scoring matrix and use-case recommendations. **Nobody else can produce it** — we have the internal data (unmet-needs research, competitive teardowns, the spec). Lightly branded, email-gated, updated quarterly. Effort 3-4 weeks.

**Funnel integration:** GitHub (anonymous) → README CTA → landing page (deessejs.com) → email capture → waitlist → launch. The mini-template is the lynchpin (SEO + audience + wedge proof + email capture).

**Decisions still open (with defaults):**
- Lite license: MIT (default — max reach) or source-available
- One feature in Lite: billing (default — most-needed, most-missed by competitors, most demonstrable)
- Money-back guarantee: 30 days (default) or 60
- Free trial of full DeesseJS: at launch (default) or post-launch
- Public demo infra budget: $100/mo cap (default)

**Why:** Without compounding reach we cannot hit the funnel math. The GitHub repo gets us SEO + shares + stars + contributions. The PDF report gets us credibility + email capture for non-developers. The demo gets us the lowest-friction conversion. The Buyer's Guide gets us "nobody else can produce this" differentiation.

**How to apply:** Recommend the 3-tier + Buyer's Guide combo unless the user changes the lead magnet decision. Don't propose a newsletter-only or Slack/Discord community lead magnet — the research says those don't compound for this audience. Don't propose free trial of Cloud (managed variant) before Cloud ships — infra cost too high for an unproven funnel.

See [[reference-competitor-marketing]] for per-competitor counter-play in the Buyer's Guide. See head-of-product [[project-lead-magnets-2026-06]] (the source of this strategy, in the product docs at `documents/internal/product/lead-magnets.md`).
