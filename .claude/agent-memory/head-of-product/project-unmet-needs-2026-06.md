---
name: project-unmet-needs-2026-06
description: Unmet-needs analysis (2026-06-16) — top 10 unmet needs in the SaaS template market, scored and cross-validated against the DeesseJS spec. Use this to prioritize features and avoid scope creep.
metadata:
  type: project
---

Deep-research workflow output (4 phases, 9 agents, ~21 min wall time, 9 agent calls, ~378k tokens). Sweep across Reddit, Product Hunt, GitHub issues, Twitter/X, Indie Hackers, Hacker News, and a competitor-gap analysis. **The full report is at `documents/internal/product/unmet-needs-2026-06.md` — this memory is the condensed version.**

## Why

The spec already covers the market's unmet needs, but the report tells us *which* features must ship at 100%, *which* sub-features are differentiators worth marketing, and *which* competitor bait we should not take.

**Why:** validates the wedge ("Apple of SaaS templates" = completeness + DX) and protects against scope creep. Two categories of unmet needs exist: (1) shallow implementations of features every template claims to have (billing, admin, testing, security), and (2) the modular contract with proof. Both are in the DeesseJS spec.

**How to apply:** when prioritizing a feature, check if it's a Top 10 unmet need (high priority) or a P2/P3 backlog item (defer). When tempted to add a new feature, check the "What NOT to ship" list first.

## The Top 10 (in priority order)

1. **Real subscription/billing UX** (not just a Stripe checkout) — 17 mentions, loudest B2B blocker
2. **Auth depth + IdP coverage** (SSO/OAuth) — #1 retrofitting tax
3. **Multi-tenant orgs, RBAC, tenant isolation** — single-user templates disqualify B2B
4. **Per-tenant LLM cost / quota / hard-cap** — structural differentiator, no competitor has
5. **Modular contract + CI-verified delete tests** — Stain Lu quote is the wedge proof
6. **Unopinionated escape hatch** — #1 churn reason between starters
7. **Enterprise security/compliance + procurement guardrails** — SaasRock maker admits "no security tests"
8. **Background jobs / cron / rate limiting** — unspoken re-build tax
9. **Admin dashboard depth** (impersonation, health, feature flags, revenue, API analytics) — ixartz trust failure
10. **Testing/quality discipline** (E2E, CI, multi-tenant, flaky detection) — "untested boilerplate trap" is buyer-named

## Cross-validation against [[project-stack-and-scope-2026-06]] and [[project-positioning-hybrid-2026-06]]

Every Top 10 maps to features already in the spec:
- 1 → `features/03-billing.md` (3.1-3.20)
- 2 → `features/01-auth-and-identity.md` (1.1-1.24)
- 3 → `features/02-orgs-and-rbac.md` (2.1-2.24)
- 4 → `features/17-ai-primitives.md` (17.15-17.17) + `features/03-billing.md` (3.5, 3.19)
- 5 → `features/20-cross-cutting.md` (20.1, 20.2) + `features/23-testing.md` (23.25)
- 6 → same as 5 — modular contract is the proof
- 7 → `features/18-security-and-compliance.md` (18.1-18.20)
- 8 → `features/04-background-jobs.md` (4.1-4.13)
- 9 → `features/21-admin-dashboard.md` (21.1-21.20)
- 10 → `features/23-testing.md` (23.1-23.32)

**Conclusion:** the spec is aligned with the market. The work is execution, not re-design.

## Surprises (positioning ammunition, not new features)

1. **"After launch" gap is the real buyer pain** — supastarter's founder markets against it: "Most SaaS boilerplates help you launch fast. But what happens after you launch?" (x.com/jonathan_wilke/status/2031013767799050398). DeesseJS should claim this narrative explicitly.
2. **ShipFast can't be pushed to GitHub out of the box** — buyers spent ~2 hours working around it. A clean repo that pushes on first try is a wedge.
3. **AI-search / schema markup is a public trust failure** — ShipFast audited 50/100 because "schema markup is tanking the score." CI-enforced Lighthouse SEO is becoming table-stakes.
4. **"195 integration tests" is a buyer-named category** — buyers explicitly call out "I wanted to avoid the untested boilerplate trap by writing 195 backend integration tests." 195 is a number buyers remember; use it in marketing.
5. **"PRO plan mismatch" is a real revenue leak** — ixartz/SaaS-Boilerplate GH issue #92: users paid for PRO and couldn't find the admin panel. A live public demo app that exposes the system admin closes this trust gap.

## What NOT to ship (defensive list)

1. **Multi-payment provider abstraction** (LS / Polar / Creem / Dodo) — abstraction cost vs depth-on-Stripe. Stay direct.
2. **Schema-driven Entity Builder / auto-CRUD** (SaasRock's wedge) — magical-but-brittle, breaks Apple positioning.
3. **Workflow automation builder / no-code** — opens Zapier-style vertical axis. Trigger.dev jobs are the buyer's pattern.
4. **Mobile native apps** — already deferred in README. No team ships web + mobile + docs + blog + CLI + SDK at 100%.
5. **Free / OSS tier** — already deferred. No direct competitor has one. Stay paid-only.
6. **Multi-tenant no-code CMS + paywall + AI translation** (Nexty's wedge) — niche. Buyer uses dedicated CMS.
7. **Browser extension** — niche. v2 candidate.
8. **Embeddable widgets** (SaasRock Enterprise surface) — enterprise-only. Document as buyer extension.

## Recommended next steps (from the report)

1. Add `SECURITY.md` + cadence badge + monthly changelog feed + "last release" widget on landing — solves "is it abandoned?" trust failure in <XS effort.
2. Demo the system admin (21.x), per-tenant LLM cost dashboard (17.15-17.17), billing portal, CLI (9.1), SDK playground (7.14) in the public demo app (16.10).
3. Publish a public roadmap + public changelog + `SECURITY.md` while repo stays private — trust signals don't need repo visibility.
4. Document SAML/SSO-as-Better-Auth-plugin + per-tenant-extension patterns — converts perceived gap into documented buyer pattern.
5. Defer P2/P3 backlog to v2-features.md with one-line rationale each — makes the "what we don't ship" story explicit on the comparison page (16.3).

## Related memories

- [[project-purpose]] — what DeesseJS is
- [[project-positioning-hybrid-2026-06]] — the wedge + design principles
- [[project-stack-and-scope-2026-06]] — stack + scope
- [[project-buyer-voice-2026-06]] — earlier buyer-voice research
- [[project-market-research-2026-06]] — earlier market research
- [[reference-template-competitors]] — verified competitor set
