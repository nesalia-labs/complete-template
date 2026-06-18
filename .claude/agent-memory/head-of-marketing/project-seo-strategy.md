---
name: project-seo-strategy
description: SEO strategy — long-tail keywords anchored on completeness + DX, content pillars, and AI-search schema as table-stakes
metadata:
  type: project
---

**Why SEO is the primary long-term channel:** The lead magnet math requires 250K-1M visitors in 90 days. SEO is the only compounding channel for a developer audience. Paid acquisition doesn't work for a one-time $299-999 product.

**Winnable keyword clusters (no competitor owns them):**
- "Next.js SaaS template with orgs and billing"
- "Next.js template that ships everything"
- "Opinionated Next.js starter"
- "Modular Next.js boilerplate"
- "Next.js SaaS starter with [Stripe / Better Auth / Drizzle]"
- "vs" keywords: "ShipFast vs Makerkit", "supastarter vs DeesseJS", "best Next.js SaaS template 2026"

**Content pillars (double as SEO and as proof of Apple positioning):**
1. **Design-principle write-ups:** "Why we ship a CLI as a product feature", "How we make every feature deletable", "What 'modular' actually means"
2. **Competitor teardowns (light version, not the full internal doc):** "ShipFast vs DeesseJS: when lean stops being enough"
3. **The buyer-voice research write-up:** "What we learned from 6 months of buyer voice research"
4. **The State of SaaS Templates 2026 report** (see [[project-lead-magnets-strategy]])
5. **Technical deep-dives on the wedge features:** "How we test that every feature is deletable", "How per-tenant LLM cost tracking works"

**AI-search / schema is table-stakes, not premium:**
- ShipFast is being audited at 50/100 on schema markup. The 50/100 is a public trust failure (Imis4n, X).
- Ship the SEO differentiators (JSON-LD, rich snippets, Lighthouse SEO in CI, Core Web Vitals in CI) at v1 launch — they're already in the spec at `documents/internal/product/features/22-seo.md`.
- AI is already sending measurable traffic to competitor sites (ShipFast: 200 visitors/month, Marc Lou on X). Ship FAQ schema, SoftwareApplication schema, llms.txt, and an `/og-debug` tool for marketing teams.
- Treat SEO like CI: blocks PRs that regress (Lighthouse ≥ 90, Core Web Vitals thresholds).

**Distribution of SEO effort (from the spec at `features/22-seo.md`):**
- 22.1-22.8 are baseline — most templates ship these. Get them right.
- 22.4 (JSON-LD), 22.13 (rich snippets), 22.16 (Lighthouse SEO in CI), 22.25 (Core Web Vitals in CI) are wedge SEO differentiators — surface in marketing copy.
- 22.18 (social sharing debug) is small but high-signal for marketing teams.
- 22.9 (hreflang) is v2 with i18n. 22.21 (AMP) is deprecated, skip.

**How to apply:** Recommend the "compete on completeness + DX keywords nobody owns" framing, not the head terms ("Next.js template") that ShipFast + Makerkit already dominate. Use the [[project-lead-magnets-strategy]] content as SEO fuel. The 6-month SEO play is to rank for the long-tail via blog content + the docs site (Fumadocs is SEO-friendly out of the box).
