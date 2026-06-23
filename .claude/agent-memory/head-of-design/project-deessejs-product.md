---
name: project-deessejs-product
description: DeesseJS product context — commercial Next.js SaaS template, agentic positioning (pivoted 2026-06-22 from "Apple of SaaS templates"), 6 load-bearing design principles, target buyer profile
metadata:
  type: project
---

# DeesseJS — Product context

**DeesseJS** = commercial **Next.js fullstack SaaS starter template**, vendu one-time (lifetime license) à des fondateurs solo et petites équipes (2-5 personnes) qui veulent shipper une SaaS en 30-90 jours.

**Pricing** : tiers one-time (lifetime updates). Current rate per `landing-page.md` §6: Starter $399 / Pro $599 / Team $999 (regular) or $249 / $499 / $899 (founder rate). Founding-member program at $99 capped at 50.

**Repo sur disque** : `complete-template/` (rename opérationnel en discussion). **Apps** : `apps/web` (preview + marketing site `deessejs.com`), `apps/cloud` (variant), `apps/template` (le produit lui-même), `apps/demo`, `apps/lite` (lead magnet), `apps/docs`.

## Positioning pivot (2026-06-22)

The marketing positioning was pivoted from **"The Apple of SaaS templates"** (completeness + DX, from `documents/internal/product/positioning.md`) to **"The SaaS template that never sleeps — your agents are the developers"** (the **agentic** wedge, from `documents/internal/marketing/landing-page.md`).

**Original wedge (deprecated as primary):**
1. Completeness — every feature ships out of the box
2. DX (easiest to customize) — opinionated defaults, modular, easy to delete what you don't need

**Why:** No competitor owns "agentic" as primary positioning. supastarter and MakerKit mention AI coding agents, but as dev tooling — not as "your agents are your developers." DeesseJS can own this space if the claim is backed by real agent primitives (tool-calling, multi-step reasoning, per-tenant metering, human-in-the-loop) and one or two visible agent workflows shipped with the template. (See `landing-page.md` §1.)

**What survives from "Apple":** restraint, polish, completeness, peer-to-peer tone. The wedge changed; the bar didn't.

## Audience

developers/founders sophisticated, anglophones, dev-tool mindset. **PAS** consumer marketing. The new audience is also AI-native builders — founders using Claude Code / Cursor / Codex to ship, who want a template that wires everything for their agents to call.

**Why:** Buyer voice research confirme le wedge (Stain Lu quote, Aneel Panyam, WEI). Le ton doit parler aux founders **comme pairs**, pas comme customers.

## The 6 load-bearing design principles (rules of the build)

If a decision violates one, the decision is wrong.

1. **Opinionated defaults** — We make the choice. The buyer overrides if they need to.
2. **Modular by default** — Every feature can be removed without breaking the rest.
3. **One coherent product, not a collection of parts** — Same UI patterns, same naming, same error handling, same auth flow, same billing story across the surface.
4. **Docs are a feature, not an afterthought** — Fumadocs ships with the template. The buyer's first hour is reading the docs.
5. **Polished UX everywhere** — Every screen, every empty state, every error. Not a chatbot demo — a *product*.
6. **No half-built features** — If it's not done, it doesn't ship. Better to ship 10 at 100% than 18 at 80%.

## Implications design concrètes (for the agentic + Apple sub-principle frame)

- **Aesthetic** : restrained, opinionated, peer-to-peer. Restrained neutrals dominate; primary color is punctuation (not a brand surface). Monospace has equal weight with sans (tabular figures, code in agents). Terminal/code aesthetics welcome in agent-facing surfaces.
- **Audience literacy** : buyers sont devs/founders + AI-native builders. On peut/devrait être techniques dans l'UI (shortcuts, keyboard hints, monospace pour data, terminal vibes OK).
- **Dark mode** : important (dev audience + aligne avec Geist/Linear/Raycast). Light = alternate.
- **Modular = visible** : chaque feature doit avoir un toggle visible dans la doc, un delete-safe story. Le DS doit exposer ce qui est "core" vs "feature" vs "polish".
- **Empty states & errors** : load-bearing, pas afterthought. Première impression buyer.
- **Voice (copy)** : Title Case labels, sentence case body, verb+noun actions, errors = what+what-to-do, no "successfully", numerals not words. Cohérent avec Geist.
- **No per-tenant theming** : user decided (2026-06-22) — DS uses shadcn's standard token model with no per-tenant override mechanism. The "white-label Studio tier" story from the product brief is deferred.

## How to apply

- Quand on propose une feature UI : vérifier qu'elle est **100% shipped** (sinon on la défrise), qu'elle a un **delete-safe story**, qu'elle suit les conventions du DS partagé.
- Quand on propose un composant : vérifier qu'il matche les 6 principes (opinionated, modular, coherent, documented, polished, complete).
- Quand on propose un design pattern : penser **agentic + Apple-restrained** — peer-to-peer tone, code-friendly aesthetics, no decorative motion.
- Quand on parle aesthetic : restrained, monospace equal weight, peer-to-peer, dev-tool native. Inspiration directe : Linear, Raycast, Cursor, Vercel Geist.
- Quand on parle copy/voice : peer-to-peer tone, verb+noun actions, errors = what+what-to-do, no fluff.
- Voir [[tech-stack]] (Tailwind v4 + shadcn/ui) pour les outils.
- Voir [[reference-vercel-geist]] pour les patterns intent-based scale, role-based typography, two-layer focus ring, motion philosophy.
- Voir [[reference-shadcn]] pour la convention sémantique (background/foreground pairs).
- Voir [[reference-tailwind-v4]] pour le pattern `@theme` qui s'aligne naturellement avec les semantic tokens.
- Voir `documents/internal/marketing/landing-page.md` pour le positioning marketing source-of-truth.
- Voir `DESIGN.md` (racine du monorepo) pour le design system spec.