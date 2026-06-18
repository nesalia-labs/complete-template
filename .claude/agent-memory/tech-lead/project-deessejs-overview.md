---
name: project-deessejs-overview
description: DeesseJS product context — wedge, stack, scope, current state for tech-lead work
metadata:
  type: project
---

# DeesseJS — product context (for tech-lead work)

**What:** Commercial Next.js SaaS fullstack template, one-time $299/$599/$999. Sold to solo founders + small teams. "Apple of SaaS templates" = completeness + DX + modular.

**Wedge:** Complete out-of-the-box AND truly modular (delete-what-you-don't-need). supastarter competes on completeness but doesn't prove modularity. The differentiator is the architectural contract + CI-enforced delete tests (20.1, 20.2, 23.25).

**Stack (locked):** Next.js + Drizzle + Better Auth + Tailwind/shadcn + Vercel AI SDK + Trigger.dev + Fumadocs + oRPC (internal) + Hono (public REST, mounted in Next.js) + user-facing CLI + auto-gen TS SDK + Stripe + Resend + Cloudflare R2 + Upstash Redis/Realtime.

**Spec corpus:** `documents/internal/product/` (15 root + 23 feature specs = ~400 features). Features tagged C/U/D (competitive/user-research/differentiator) with status ✅/🟡/🔵/⚪/🟣. "Done" definition = 10 dimensions including delete test.

**Current status (as of 2026-06-16):** All positioning + stack + pricing decisions landed. Build not started. P1 questions still open: monorepo tool (Turborepo default), CLI language (Bun default), concrete tier gates, Studio onboarding session delivery, Stripe vs Lemon Squeezy. See [[open-questions]] for full list.

**Roadmap:** M0 scaffold → M1 auth+orgs → M2 RBAC → M3 billing → M4 ops features → M5 API+SDK+CLI → M6 AI primitives → M7 landing+sales → M8 QA. ~10 weeks solo, ~6 weeks for two devs. M8 is under-budgeted (1 week) — real QA for 400 features needs 3-4 weeks.

**Why:** User is building a commercial template business. Tech-lead work = de-risk the architecture, validate the modular contract, sequence build correctly.

**How to apply:** When asked about DeesseJS technical decisions, anchor on the modular contract (everything deletable, tested) and the wedge (complete + modular). Avoid scope creep into Cloud or Lite until v1 ships.