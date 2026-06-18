---
name: project-deessejs-cloud-marketing
description: DeesseJS Cloud (managed variant) — the post-launch upgrade path, the 30-tenant private beta plan, and what marketing needs to know for the v0 launch
metadata:
  type: project
---

**What it is:** DeesseJS Cloud is the **managed SaaS template** — the same DeesseJS repo, but operator-provisioned and operator-hosted. The buyer gets a single `DEESSEJS_SECRET` env var; the operator runs the Vercel project, Turso DB, Upstash namespace, Trigger.dev project, Resend sender domain, and Stripe Connect account behind the scenes.

**Why this matters for marketing:** It's the natural upgrade path for the self-host buyer who doesn't want to provision the 6 services (Postgres, Upstash, R2, Stripe, Resend, Trigger.dev). **The two SKUs are complements, not substitutes** — the self-host one-time product does not get retired when Cloud ships.

**The opportunity:**
- **Greenfield category** — no vendor currently sells a Next.js SaaS template AND operates a per-tenant managed hosting tier. This is the marketing wedge for Cloud.
- StartKit.AI's $7,995 Concierge tier is the demand signal that buyers will pay MORE for managed.
- The per-tenant LLM cost tracking (3.5/3.19/17.15-17.17) is the natural billing differentiator pure-template competitors can't replicate without becoming a SaaS themselves.
- 87%+ gross margin at median Team-tier usage.

**The v0 plan (8-12 weeks, private beta in 2026-Q3):**
- 30-tenant hard cap, single shared Upstash database.
- $99/mo lifetime-locked founder's rate for 20-30 design partners.
- Operator admin dashboard at app.deessejs.com.
- The `DEESSEJS_SECRET` JWT scheme with Vercel project ID binding.
- Public launch gated on de-risking the Vercel 12-concurrent-builds ceiling and the shared Upstash noisy-neighbor risk.

**Pricing tiers (mirror v1 self-host + add usage overage):**
- Starter $299/mo
- Team $599/mo
- Studio $999/mo
- Enterprise $2,500+/mo (SOC2/HIPAA add-ons, SSO, EU-only residency, 99.95% SLA)
- Overage: $1.50/1M LLM tokens, $0.50/1M Vercel invocations, $0.10/GB Trigger.dev compute

**How to apply:**
- Do not market Cloud publicly before the v0 beta ships — the 12-build ceiling and noisy-neighbor risk are not yet de-risked.
- The "greenfield" claim is the marketing wedge for Cloud (no competitor exists in this category).
- The self-host product is the funnel; Cloud is the upgrade. Don't let Cloud cannibalize the bottom of the funnel.
- See head-of-product [[project-deessejs-cloud-2026-06]] for the full feasibility report (the source doc is `documents/internal/product/deessejs-cloud-feasibility-2026-06.md`).
