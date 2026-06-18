---
name: project-offer-design-research-2026-06
description: Deep-research on offer design for DeesseJS — buyer psychology, conversion benchmarks, competitor teardowns, and the 14 surviving claims from adversarial verification
metadata:
  type: project
---

**Source:** Deep-research workflow, 5 phases, 47 agents, ~756K tokens, 2026-06-17. Adversarial verification (3 votes per claim, 2/3 refutes to kill). 14 surviving claims, 11 refuted. Full report at `documents/internal/marketing/offer-design-research.md`.

## The 5 Confirmed Findings (HIGH CONFIDENCE — use them)

**1. Time-to-market panic is the dominant emotional driver.**
All three major competitors (MakerKit, supastarter, SaasRock) lead with "ship in days, not weeks." The indie hacker fear is not cost — it's missing a window. Every headline and the hero sub-head should address this.

**2. Money-back guarantee is a genuine competitive gap.**
None of the three major competitors (MakerKit, SaasRock, supastarter) advertises a money-back guarantee on their pricing page. MakerKit's FAQ explicitly says "No formal money-back guarantee is offered." A 14-day guarantee differentiates DeesseJS and removes the last objection for hesitant buyers. Refund rate estimates: 2-8% for well-presented products at this price. **Use: "14-day money-back guarantee. If DeesseJS doesn't save you months of development time in your first 14 days, email us for a full refund — no questions asked."**

**3. Payment plans do not exist across any major competitor.**
Zero major competitors offer payment plans at $249-1,999. The one-time payment model is itself a trust signal. Adding a subscription undermines the "pay once, done" positioning. **Use: do not offer payment plans. Alternative: SaasRock-style "try the MVP edition, then upgrade by paying the difference."**

**4. Social proof requires specificity — vague testimonials do not convert.**
Named endorsements from recognizable developer figures (Lee Robinson @ Vercel, Nikolas Burk @ Prisma) carry outsized weight. The specificity of testimonials (names, companies, specific outcomes) is what converts. **Use: 5-7 named testimonials at launch with full name + company + quantified outcome + social link. Pre-launch fallback: collect via email sequence.**

**5. Strikethrough pricing + real deadline is the urgency pattern that works.**
MakerKit uses ~~$349~~ → $299. Fabricated countdown timers are detected and rejected by savvy developer buyers. "New" badges tied to real product updates are credible. **Use: "Founder rate: $249. Regularly $399. Offer ends July 31, 2026." — must be a real price and a real date.**

## The 5 Uncertain Findings (use with caution)

**1. "Design partner program" framing — no published conversion data.**
Low confidence. "Founder Edition" or "Early Backer" is more proven and understood by indie hackers. **Use: "Founder Edition — Lock In Your Rate."**

**2. AI coding agent compatibility as a buyer trigger.**
Medium confidence on competitor behavior (supastarter and MakerKit both prominently feature it), low confidence on it being a genuine buyer-wide behavioral shift. **Use: mention it as a feature, not as the primary hook.**

**3. Identity framing ("I am a serious founder") outperforms feature-heavy messaging.**
Uncertain. Both supastarter and MakerKit use hybrid messaging — identity + features. **Use: hybrid. Lead with features; identity in the sub-head and the founder note.**

**4. "$15,000-50,000 in developer time" framing.**
Uncertain. The framing is real and used by MakerKit. The specific dollar range has no cited methodology. **Use: time estimates ("500+ hours") not dollar estimates. Present as conservative estimates, not scientific benchmarks.**

**5. Source code ownership as the TOP developer objection.**
Uncertain. All competitors emphasize it, but no independent research confirms it's the top objection. **Use: mention it prominently, but don't lead with it.**

## 11 Refuted Claims (do NOT use these)

1. ~~"Hours saved" framing is the dominant value proposition~~ — the estimates are inflated for experienced devs; the dollar totals are marketing-optimized
2. ~~"One-time pricing is the #1 trust signal"~~ — it's table stakes, not differentiating
3. ~~"Unlimited" framing is friction-free~~ — materially restricted by fair-use policies and seat caps
4. ~~"Daily updates" for MakerKit~~ — actual changelog shows 1-2 releases/month
5. ~~"Build vs. buy table is the most effective objection handler"~~ — DIY estimates are inflated; pre-built path time is treated as zero
6. ~~"Lifetime updates is universal across all competitors"~~ — SaasRock limits to "free updates for 1.x"
7. ~~"Community as conversion driver"~~ — "best support in the market" is self-referential with no methodology
8. ~~"MakerKit bundles 5 bonuses in both paid tiers"~~ — AI Agents Rules and MCP Server are NOT in the Supabase stack Pro tier; the "MakerKit Course" bonus doesn't exist
9. ~~"MakerKit is a subscription model"~~ — supastarter's comparison contains a factual error; MakerKit is one-time
10. ~~"One-time payment is NOT used by all competitors"~~ — actually, it IS used by the three major ones; subscription competitors exist but outside our band
11. ~~"1411 developers" is third-party verified~~ — it's self-reported, not audited

## Conversion Benchmarks (LOW CONFIDENCE — directional only)

| Metric | Benchmark |
|---|---|
| Visitor → email capture | 2-5% |
| Email → paid customer (well-optimized) | 3-10% |
| Pre-launch list → launch customer | 5-15% |
| Landing page → direct purchase (cold) | 1-3% |
| Landing page → direct purchase (warm) | 3-8% |
| Guarantee lift at checkout | +10-25% |
| Strikethrough pricing lift | +5-15% |
| Named testimonials vs. generic | +20-40% |

**No published A/B test data exists specifically for SaaS template products in the $299-999 range.**

## What to Actually Put on the Page

Full details in `documents/internal/marketing/landing-page.md`. The TL;DR:

**Core:**
- "Founder Edition — Lock In Your Rate" framing
- Strikethrough from $399/$599/$999 with real deadline (July 31, 2026)
- 14-day money-back guarantee in a visible guarantee box
- 3 bonuses: Figma UI Kit, Private Discord, AI Agent Workflow Library
- "Most Popular" badge on the Pro ($499) tier
- 5-7 named testimonials with quantified outcomes
- Founder note with photo, bio, LinkedIn, GitHub

**Do NOT:**
- Countdown timers, fake scarcity, "design partner" framing
- Payment plans, "unlimited" without fair-use disclosure
- Inflated hours-saved estimates, "daily updates" claims
- Vague testimonials, generic bonuses, table-stakes as bonuses

## How to apply

- Before writing any landing page section, reference this doc for the confirmed vs. uncertain findings.
- The 5 confirmed findings are safe to use as direct claims. The 5 uncertain findings need to be framed carefully (as estimates, not facts).
- The 11 refuted claims are the anti-patterns to actively avoid.
- Update this memory if the research generates new findings, or if competitive landscape changes materially.
- See `documents/internal/marketing/offer-design-research.md` for the full cited report.
