---
name: project-positioning-hybrid-2026-06
description: Positioning decision — "the Apple of SaaS templates" = hybrid wedge of completeness (all features ship) + DX (easiest to customize)
metadata:
  type: project
---

The user picked the **hybrid** wedge on 2026-06-16, after the AI-first framing was de-prioritized.

**Product name:** DeesseJS (locked 2026-06-16). Repo is still `complete-template/` on disk — rename is an open operational decision.

## The positioning

**"The Apple of SaaS templates."**

Two commitments, equal weight:

1. **Completeness** — every feature ships out of the box. Auth, orgs, billing, blog, docs, mails, storage, AI SDK, jobs, CLI, API, i18n, onboarding. The buyer does not need another template on top of this one.
2. **DX (easiest to customize)** — opinionated defaults, strong conventions, modular architecture, easy to delete what you don't need, great docs. The buyer can shape this to their product without fighting it.

**Why this is the wedge:** No competitor in the $299-799 band competes on this axis:
- ShipFast is lean (completeness ✗, DX ✓)
- SaasRock is heavy (completeness ✓, DX ✗ — deep but hard to reshape)
- Makerkit is fragmented (three parallel stacks, no opinion)
- TurboStarter is multi-app focused
- supastarter is positioning-first, not product-first
- Nexty is below the band

**Why this is high-risk:** "Apple" positioning breaks on the first half-baked feature. Every feature has to feel considered; the docs have to be the best in the category; the architecture has to actually be modular. A template with 18 features done at 80% is worse than one with 8 done at 100%.

## What this changes vs the original AI-first brief

- **AI depth is available, not headline.** Vercel AI SDK + the primitives (structured output, streaming, agents, observability, evals, cost tracking) ship, but the landing page leads with completeness + DX. Vector DB is deferred (see [[project-stack-and-scope-2026-06]]).
- **Operational features are the selling point.** Auth, orgs, billing, blog, docs, mails, storage, CLI, API, i18n, onboarding — these are the bullets.
- **DX is a real design constraint, not a tagline.** Modular architecture is a hard requirement, not a nice-to-have.

## Design principles (to enforce in the build)

1. **Opinionated defaults.** We make the choice. The buyer overrides if they need to.
2. **Modular by default.** Every feature can be removed without breaking the rest. The buyer can delete a feature and the app still runs.
3. **One coherent product, not a collection of parts.** Same UI patterns, same naming, same error handling, same auth flow, same billing story across the surface.
4. **Docs are a feature, not an afterthought.** Fumadocs is the right pick; the docs site ships with the template and is the buyer's first experience of DX.
5. **Polished UX everywhere.** Every screen, every empty state, every error. Not a chatbot demo — a *product*.
6. **No half-built features.** If it's not done, it doesn't ship. Better to ship 10 features done at 100% than 18 at 80%.

## How to apply

- Push back on scope creep that adds features at the cost of quality. Completeness ≠ feature count; completeness = every shipped feature works end-to-end.
- Push back on conventions that don't serve the buyer. Opinionated doesn't mean stubborn.
- When in doubt, look at the buyer's first hour with the template: install → delete what's not needed → ship the rest. That hour is the product.
