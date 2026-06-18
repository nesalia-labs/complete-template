---
name: project-deessejs-cloud-2026-06
description: DeesseJS Cloud feasibility (2026-06-16) — managed SaaS template variant, per-client Vercel Platforms + Turso + Upstash, single DEESSEJS_SECRET env var. Recommendation: build v0 behind 30-tenant private beta in 2026-Q3.
metadata:
  type: project
---

Deep-research workflow output (4 phases, 9 agents, ~20 min wall time, ~369k tokens, 375 tool uses). Sweep across Vercel Platforms docs, Turso docs, Upstash docs, single-env-var abstraction patterns, user needs for managed SaaS templates, and competitive analysis of managed offerings.

**Why this memory exists:** the user asked the question "would a DeesseJS Cloud product (managed, per-client instances, single env var) make sense?" The workflow answered: **yes, build v0 behind a private beta**. The category is greenfield (no vendor currently sells a Next.js SaaS template AND operates a per-tenant managed hosting tier). The technology is fully capable. Unit economics work (87%+ gross margin at median Team-tier usage). The 3.5 / 3.19 per-tenant LLM token metering already shipping in v1 of DeesseJS is the natural billing differentiator that pure-template competitors cannot replicate without becoming a SaaS themselves.

**How to apply:** when the user asks "should we build DeesseJS Cloud?", the answer is yes, behind a beta. When the user asks "what's the Cloud pricing?", refer to this report. When the user asks "is Vercel Platforms + Turso + Upstash the right stack?", the answer is yes. The full report is at `documents/internal/product/deessejs-cloud-feasibility-2026-06.md`.

## The recommendation in one line

**Build a v0 of DeesseJS Cloud behind a private beta in 2026-Q3, with a hard 30-tenant cap and a single shared Upstash database.** Do not launch publicly until the Vercel 12-concurrent-builds ceiling and the shared Upstash noisy-neighbor risk are both de-risked in production.

## Top user needs (P0 = must serve, P1 = should serve)

**P0:**
1. Zero-Touch Ship-It Buyer Persona (solo founders, indie hackers, non-technical AI-builders, agencies)
2. Deployment / DevOps Time-Sink Pain (1-2 weeks per project wiring Vercel, env, DB, auth, email, Stripe, CI)
3. Predictable Pricing / No Bill Shock (Vercel function-loop fear; Supabase spend caps as the defensive pattern)
4. Self-Host / One-Time Tier Must Remain (Cloud is the upgrade path, not a replacement)
5. Market Gap: No "Managed SaaS Template" Category Exists (greenfield — but validate with closed beta)

**P1:**
6. Security, Patching, and Compliance Bundle (SOC2/HIPAA/SSO/SLA)
7. Agency Tier: Multi-Tenant, White-Label, Per-Client ($199-499/mo)
8. Backups, Monitoring, and Observability Out of the Box (operator admin dashboard 21.x)

## Technical feasibility: doable, high confidence (80%+)

Stack: Vercel Platforms (multi-project) + Turso (per-tenant DB with auth token minting) + Upstash (shared Global DB with per-tenant Ratelimit prefix) + Trigger.dev v3 (per-tenant projects on a shared org) + Resend (per-tenant sender domain) + Stripe Connect Standard (buyer's own connected account) + Cloudflare DNS (operator-owned wildcard `*.tenants.deessejs.com`).

**Hard blocker:** Vercel Pro's 12-concurrent-builds ceiling caps onboarding at ~480 tenants/day. Fine for v0 30-tenant beta; hard wall at 1,000+ tenants/mo (graduate to Vercel Enterprise $20K+/yr).

## Architecture: the 12-step provisioning flow

1. Signup (deessejs.com) → Stripe Payment Link → Trigger.dev webhook → `POST /tenants` to control plane (~2s)
2. Control plane mints Vercel project via `POST /v1/projects` (~5s, costs 1 of 12 concurrent builds)
3. Control plane mints Turso DB + auth token (~4s)
4. Control plane reserves Upstash namespace (shared with `t:{tenantId}:` prefix, or dedicated for Enterprise) (~2s)
5. Control plane mints Trigger.dev project (~3s)
6. Control plane signs `DEESSEJS_SECRET` JWT (`{ tenant_id, vercel_project_id, turso_url, turso_token, upstash_url, upstash_token, trigger_project_ref, region, plan, exp: now+365d }`, ES256 signed; no raw creds stored in control plane DB)
7. Operator Trigger.dev job deploys (~90-150s build)
8. Buyer deploys via post-purchase email "Deploy to Vercel" button (pastes `DEESSEJS_SECRET` into env)
9. First boot: `/api/internal/boot` verifies JWT, validates project ID via `x-vercel-project-id` header, validates service tokens, writes resolved creds to LRU + `/tmp/.deessejs-resolved.json` (4-6 min Standard, 8-12 min Enterprise)
10. Runtime: all 23 v1 surfaces run unchanged; per-tenant LLM metering (17.15) + rate limit (17.16/17.17) + notifications (11.1) + jobs (4.x) all namespaced via `t:{tenantId}:*`
11. Updates: push to `deessejs-cloud-template` triggers Vercel deploy hook, wave-staged rollouts respect 12-build ceiling
12. Billing: Stripe metered usage (LLM tokens, Vercel invocations, Trigger.dev compute); Stripe Connect Standard routes buyer revenue to buyer's own connected account; auto-upgrade rule at 1.4x trailing-90-day cost

**Operator admin dashboard (app.deessejs.com):** Cloudflare Access + operator SSO. Lists tenants with status, last deploy, Turso row count, Upstash command count, Stripe MRR. Suspend / resume / rotate-secret / offboard actions. Copy-to-clipboard view of resolved per-service credentials (the "escape hatch" pattern for ejection to self-host).

## Cost & pricing

| Band | Total cost | Sell at | Margin |
|---|---|---|---|
| Low (Team $599) | $25.86/mo | $599 | 91.0% |
| Medium (Studio $999) | $80.27/mo | $999 | 92.0% |
| High (Studio $999 + AI-heavy) | $457.27/mo | $999 | 54.2% (unsubsidized) |

**Pricing tiers (mirrors v1 self-host pricing in 3.4 + usage overage):**
- Starter $299/mo — 1M LLM tokens, 500k Vercel inv, 5 GB Turso, 10 GB Trigger.dev
- Team $599/mo — 10M LLM tokens, 5M Vercel inv, 25 GB Turso, 50 GB Trigger.dev
- Studio $999/mo — 50M LLM tokens, 25M Vercel inv, 100 GB Turso, 200 GB Trigger.dev
- Enterprise $2,500+/mo — dedicated everything, SOC2/HIPAA/SSO/SLA, EU-only residency option

**Overage (Stripe metered usage):** $1.50/1M LLM tokens, $0.50/1M Vercel invocations, $0.10/GB Trigger.dev compute. Annual: 15% off Team/Studio. Trial: 14 days no card. Setup fee: $0.

## Top 5 risks

1. Vercel 12-concurrent-builds ceiling — graduate to Enterprise at 1,000+ tenants/mo
2. AI-heavy tenants collapse margin (54% at $999 / 100M tokens) — fix with overage priced at 5x markup
3. Upstash shared-DB noisy-neighbor — per-tenant daily command counter in Turso + 60s poison-pill kill switch
4. DEESSEJS_SECRET is a single high-value credential — 365-day JWT expiry + Vercel project ID binding + Upstash read-only token for read paths + Stripe Connect Standard (payments go to buyer's account) + Resend sender domain ownership transfer + LLM keys managed by buyer
5. Vercel Function 300s duration ceiling — AI features must enqueue long agent runs as Trigger.dev jobs, stream back via Upstash Realtime (already the 17.x architecture intent)

## v0 scope (8-12 weeks)

1. Control plane Edge function with `/exchange`, `/tenants/{id}/status`, `/rotate-secret`, `/offboard`
2. Signup flow on deessejs.com with Stripe Payment Link + 14-day no-card trial
3. The `DEESSEJS_SECRET` JWT scheme with Vercel project ID binding
4. Per-tenant Turso DB + Upstash shared namespace + Trigger.dev project
5. Operator admin dashboard at app.deessejs.com
6. Per-tenant LLM token meter (17.15) + per-tenant rate limit (17.16/17.17) wired to metering plane
7. Auto-upgrade rule at 1.4x trailing-90-day cost

**Out of scope for v0:** SOC2/HIPAA, SAML SSO, EU-only residency, multi-locale, observability for the buyer, dedicated Upstash DBs.

## Next steps

1. **2 weeks:** one-page private-beta landing page at deessejs.com/cloud (email waitlist), recruit 20-30 design partners at $99/mo lifetime-locked
2. **4 weeks:** control plane as a single Vercel Edge function (or Express on Fly.io if Edge cold-start is too slow)
3. **8 weeks:** wire marketplace listing, Stripe Payment Link, "Deploy to Vercel" email button, operator admin dashboard; onboard 20-30 design partners
4. **12 weeks:** run beta 30 days, collect MRR/infra cost/support tickets/churn/AI-token distribution; decide: public launch / graduate to Vercel Enterprise / defer to v2
5. **Open paid annual contracts:** Vercel Pro seat ($20/seat/mo) + Upstash Pro Pack ($200/mo) ahead of public launch

## Open questions

1. Stripe Connect Standard vs Express (Standard recommended; confirm with legal)
2. EU-only deployment pricing impact (Vercel Frankfurt + Turso eu-west + Upstash eu-west costs not modeled)
3. Support tier for Cloud buyers (self-serve vs 24h-SLA email vs Slack channel)
4. At what tenant count migrate per-tenant Turso DBs from single group to per-tenant groups (Turso support question)
5. Vercel Enterprise plan timing (recommend 200-tenant / $20k-MRR trigger)

## Related memories

- [[project-purpose]] — what DeesseJS is
- [[project-stack-and-scope-2026-06]] — the v1 stack
- [[project-positioning-hybrid-2026-06]] — the wedge + design principles
- [[project-unmet-needs-2026-06]] — prior market research
- [[project-market-research-2026-06]] — earlier market research
- [[reference-template-competitors]] — verified competitor set
- [[reference-upstash-realtime]] — Upstash Realtime (already used in v1)
