---
name: reference-vercel-30min-changelog
description: Vercel Functions 30 min changelog (2026-06-15) — Node.js/Python only, > 800s in beta, Fluid Compute required
metadata:
  type: reference
---

# Vercel Functions 30 min changelog

**Date:** 2026-06-15
**URL:** https://vercel.com/changelog/vercel-functions-can-now-run-up-to-30-minutes

**Key facts:**
- Vercel Functions: **800s → 1800s (30 min)** on Pro and Enterprise plans
- Runtimes covered: **Node.js and Python only** (Edge NOT mentioned)
- Requires **Fluid Compute** + opt-in via `maxDuration: 1800`
- **Durations above 800s are in BETA** — not yet production-stable
- Billing unchanged: Fluid Compute bills **active CPU only** (pauses on I/O)
- Prior baseline was 800s (NOT 300s as often cited in older docs)

**Implications for DeesseJS Cloud:**
- The 2026-06-16 feasibility doc's Risk #5 ("300s Vercel Function ceiling blocks long agent loops") is **OBSOLETE** — see [[project-deessejs-cloud-feasibility-outdated-assumption]]
- Long AI agent runs can now sync-run on Vercel Functions up to 30 min
- Trigger.dev queue primitive justification collapses for sub-30-min jobs
- Beta caveat: v0 prod should not depend on > 800s duration being stable
- Control plane on Vercel Edge is **NOT helped by this changelog** — Edge max unchanged

**How to apply:** When reasoning about DeesseJS Cloud architecture, default to "Vercel Function can run up to 30 min" unless explicitly Edge. Flag the beta status for any > 800s use case in v0. See [[project-deessejs-cloud-tech-2026-06]] for the post-changelog architecture.
