---
name: project-market-research-2026-06
description: First deep-research pass on the paid Next.js template market — competitors, pricing, AI depth gap
metadata:
  type: project
---

Deep research pass on the paid Next.js fullstack template market, run 2026-06-16 via the `deep-research` workflow (103 agents, 21 sources, 21/25 claims confirmed, 4 refuted by adversarial vote). Research was scoped for `DeesseJS` (then codenamed `complete-template`).

**Why:** Discovery phase of [[project-purpose]] — needed market intel before committing to a stack/feature set.

**Headline finding (high confidence):** Every competitor in the $299-799 band markets "AI" as **dev-side tooling** (Cursor / Claude Code / MCP / AGENTS.md). End-user LLM features are uniformly shallow — Vercel AI SDK chatbot wrapper is the ceiling. **No competitor ships RAG + vector DB + agent loops + observability + evals + cost tracking together.** That's the wedge for `complete-template`.

**Verified competitor set (Next.js, in-band):**
- supastarter — €349/€799/€1,499 — Vercel AI SDK chat (text/image/audio, streaming), AGENTS.md
- Makerkit — $299/$599 — **three parallel stacks** (Supabase / Drizzle+Better Auth / Prisma 7+Better Auth), MCP server 12→56 tools, AI agent rules, **zero end-user AI**
- ShipFast — $199/$249/$299 — **zero** native LLM modules, distribution monster (Marc Lou 135k Twitter, self-reported 8,330 makers, PH "Maker of the Year 2023")
- TurboStarter — $249/$399 — multi-app (web+mobile), "AI Kit" with multi-provider + tool calling + memory + rate-limiting + credits
- SaasRock — $249/$499/$1,999 — **Remix/React Router 7 (not Next.js — adjacent)**, Prompt Flow Builder OpenAI-only, **deepest RBAC: 6 roles, 30 permissions, impersonation, IP blacklist, GDPR**
- Nexty (nextforge) — $188 — below band, multi-modal demos (chat/t2i/i2i/video) via Vercel AI SDK

**Non-findings:** mrrobot (no paid product in band), supafast.co (unreliable, no verified claims). Treat as not-competitors.

**Pricing norms:** median tier $249-499, lifetime license universal, 3-tier structure (Solo/Pro/Agency), free lifetime updates table stakes, **no recurring/subscription models** in band.

**Distribution norms:** own landing page + Stripe checkout universal. ShipFast is the unreplicable outlier (one-person brand).

**Caveat:** Demand signals (buyer-voice mining) didn't survive verification — the "what buyers actually say is missing" question is inferred from absence of features, not direct complaints. **Validate before building.**

**How to apply:** Use this as the working hypothesis for the wedge, but treat demand-side claims as TBD. Pricing benchmarks are solid. The AI depth gap is the strongest signal — build a competitor teardown that scores each on a checklist of (RAG, vector DB, agents, observability, evals, cost tracking, structured output) to make the gap visible at a glance.

Related: [[reference-template-competitors]], [[project-purpose]].
