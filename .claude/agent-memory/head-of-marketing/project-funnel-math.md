---
name: project-funnel-math
description: Conversion math and revenue model for DeesseJS — what funnel performance we need, what revenue that produces
metadata:
  type: project
---

**Funnel math (the hard constraint):** $299-999 one-time product means **0.5% average visitor→customer**. To hit:
- 25 customers / 90 days → 1,250 leads → 250K visitors
- 50 customers / 90 days → 2,500 leads → 500K visitors
- 100 customers / 90 days → 5,000 leads → 1M visitors

**Conversion benchmarks used:**
- Visitor → lead: 5-15% (typical for dev tools with strong lead magnet)
- Lead → customer: 1-5% (typical for $299+ products)
- Effective: 0.05%-0.75% (visitor → customer)

**Revenue model (at 1,000 buyers/year, 60% Solo / 30% Team / 10% Studio, 5% renewal at 50% off):**
- Solo ($299) × 60% × 1000 = $179,400
- Team ($599) × 30% × 1000 = $179,700
- Studio ($999) × 10% × 1000 = $99,900
- Renewals (5% × 50% off) × 1000 = ~$25,000
- **Total: ~$484K at 1,000 buyers/year**

**Key levers (ranked):**
1. **Volume** — single biggest lever. 5,000 buyers/year = $2.4M.
2. **Tier mix** — more Studio helps. Marketing can target agencies.
3. **Renewals** — 5% is conservative. 15% adds ~$50K more.
4. **Average price** — premium structure ($399/$799/$1,499) is possible if the wedge lands harder.

**Comparable benchmarks (cited in the pricing research):**
- ShipFast reportedly $1M+/year at the lower price point (Marc Lou brand moat)
- supastarter / Makerkit reportedly $500K-$2M range

**Pricing structure (locked 2026-06-16):** 3 tiers, one-time payment, lifetime license. No recurring/subscription tier for v1 (universal in the band). All tiers get the full feature set — gates are commercial.

**The DeesseJS Cloud (managed variant) has its own economics** — 87%+ gross margin at median Team-tier usage, $25.86/mo infra at low band, $457/mo at high AI-heavy band. See head-of-product [[project-deessejs-cloud-2026-06]] and my [[project-deessejs-cloud-marketing]] for the marketing-side framing. The two SKUs are complements, not substitutes — Cloud is the post-launch upgrade path.

**How to apply:**
- Use this math when arguing for compounding channels (SEO, content, GitHub) over paid acquisition.
- The volume lever is the one to obsess over; tier mix is a secondary lever.
- The margin at high AI-heavy usage (54% unsubsidized) is a Cloud risk, not a self-host risk — keep concerns separated.
- At <$300 buyer acquisition cost, the unit economics work. Above that, the funnel math breaks.
