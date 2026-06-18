---
name: project-stack-and-scope-2026-06
description: Stack and feature scope decisions for DeesseJS — runtime, libraries, and the operational feature surface
metadata:
  type: project
---

Decisions made in the 2026-06-16 conversation. These are **load-bearing** — don't reopen without cause.

**Product name:** DeesseJS (locked 2026-06-16). Repo is still `complete-template/` on disk — rename is an open operational decision.

## Stack (locked)

- **Next.js** — front-end + fullstack framework
- **Tailwind + shadcn** — UI (shadcn components copied in, customized, design tokens, themeable per-tenant)
- **Drizzle** — ORM (chosen over Prisma; aligns with one of Makerkit's three parallel stacks)
- **Better Auth** — auth, including its native orgs / sessions / 2FA / passkeys / magic links / multi-factor / admin / rate-limiting plugins
- **API (internal)** — **oRPC** (locked 2026-06-16), type-safe, OpenAPI-native, runtime-agnostic
- **API (public)** — **REST with Hono, mounted inside the Next.js app** at `app/api/[[...route]]/route.ts` (locked 2026-06-16). One deploy, full Node API, oRPC contract sharing is trivial. Tradeoffs: no edge benefits, R2 accessed over public S3-compatible API (not a binding).
- **Vercel AI SDK** — LLM provider abstraction floor
- **Trigger.dev** — background jobs (chosen over Inngest for code-first ergonomics)
- **Resend + React Email** — mail (confirmed 2026-06-16)
- **Upstash Realtime** — in-app notifications surface (locked 2026-06-16). Built on **Upstash Redis** (REST). Same Redis used for Better Auth sessions / rate-limiting / caching.
- **Fumadocs** — documentation site; can also host the blog
- **CLI** — **user-facing CLI** that ships with the buyer's product (gh / vercel-style), not a dev-time scaffolder. The buyer gets a CLI as a feature of their SaaS, installable by their end users. This is a real differentiator — almost no competitor in the band ships a user-facing CLI.
- **SDK** — **Auto-generated TypeScript SDK from the Hono public API's OpenAPI spec** (locked 2026-06-16). Buyer publishes to npm for their end users. Modern SaaS pattern (Stripe, Resend). Same source of truth as the user-facing CLI.
- **Vector DB** — **deferred for now** (user decision 2026-06-16). Weakened the RAG pillar of the wedge; the wedge is now completeness + DX per [[project-positioning-hybrid-2026-06]].
- **Observability (Langfuse / Helicone)** — **skipped for v1** (user decision 2026-06-16). Saves a vendor and build time. Buyers add their own when they need it. Evals (Promptfoo / Braintrust) likely follows — flag for confirmation.

## Feature surface (locked for v1)

- **Web app** — the template itself
- **API** — internal oRPC + public Hono REST
- **CLI** — user-facing (gh-style), ships in buyer's product
- **SDK** — TBD
- **i18n** — **English only for v1** (locked 2026-06-16). Architecture (route + content + email + LLM prompt translatable) ships, but only `en` JSON ships. Other locales easy to add later.
- **Onboarding** — multi-step wizard + post-signup checklist
- **Storage** — **Cloudflare R2** (locked 2026-06-16). S3-compatible API, no egress fees, $0.015/GB/month. Pairs with Hono on Cloudflare Workers for the public API.
- **Mails** — Resend + React Email, templates for auth/billing/transactional
- **In-app notifications** — **Upstash Realtime** on top of **Upstash Redis** (locked 2026-06-16). Real-time, type-safe, ships in-template, generous free tier, no third-party dashboard for the buyer.
- **Blog** — Fumadocs blog (paired with docs)
- **Payments** — Stripe (assumed; confirm)
- **Organizations** — Better Auth's orgs plugin is the foundation; org-scoped data (billing, content, notifications)
- **Observability** — Langfuse (recommended) or Helicone, confirm

## Why this is the right shape

Better Auth collapses a huge amount of work: orgs, sessions, 2FA, passkeys, magic links, multi-factor, account linking, admin, rate-limiting all ship natively. That **frees build time to spend on the wedge** ([[project-positioning-hybrid-2026-06]]): completeness + DX, with AI primitives well-built but not headline.

**How to apply:**
- Don't reinvent anything Better Auth already does. Build on its primitives; don't fight them.
- The operational surface is the selling point. Every feature must be polished end-to-end (no half-built features — Apple positioning rule).
- The README at `documents/internal/product/README.md` is the source of truth for the living product spec; update it as decisions land.
