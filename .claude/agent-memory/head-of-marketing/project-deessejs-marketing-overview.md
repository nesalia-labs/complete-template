---
name: project-deessejs-marketing-overview
description: Marketing-side view of DeesseJS — the product, brand, wedge, ICP, and what we commit to in copy
metadata:
  type: project
---

DeesseJS is a commercial Next.js fullstack SaaS starter template, sold one-time ($299-999), to solo founders and small startup teams (2-5 people) building a SaaS in 30-90 days. The product is a git repo the buyer downloads — NOT a hosted platform and NOT a no-code builder. The repo is `complete-template/` on disk; the product name everywhere the buyer sees is `DeesseJS`. Brand locked 2026-06-16.

**The wedge — pivot from "Apple of SaaS templates" to "The agentic SaaS template that never sleeps" (2026-06-17):**

**Old positioning:** "Apple of SaaS templates" = completeness + DX.

**New positioning:** "The SaaS template that never sleeps."

Core claim: "You stop being the developer. Your agents become the developers."

Three axes:
1. **"Without writing code"** — you ask, the agents write the code (AGENTS.md, MCP server, AI agent rules, tool-calling)
2. **"Without assembling"** — every surface wired before the agents start (auth, billing, storage, jobs, notifications, API)
3. **"Without limits"** — per-tenant metering, usage-based billing, no per-agent cost

**Why this is the wedge:** No competitor owns "agentic" as primary positioning. supastarter and MakerKit use AI for dev tooling (Cursor, Claude Code integration). DeesseJS optimizes the SYSTEM for AI agents to run on — every surface is a tool the agent calls.

**The claim (credible version):** "Your agents run on DeesseJS. Every surface is wired. Every tool is callable. Your agents don't start from scratch — they start from a complete system."

**What must ship to back the claim:**
- One visible agent workflow demo at M4 (before the page ships)
- Agent primitives documented in Fumadocs
- Per-tenant metering dashboard visible in admin UI

**The emotional payoff:** "Stop hiring developers. Start asking your agents." / "The best developers don't work for salary. They work for electricity."

**Buyer pain we sell against:** "I want to ship but I don't have a developer." / "Every template makes me wire the same plumbing before my agents can work." / "What if I could just ask and it gets built?"

**Brand voice:** Calm, confident, opinionated. Speaks to founders as peers. No hype, no jargon, no superlatives. Copy describes the product, doesn't oversell it.

**What we commit to in marketing copy (load-bearing):**
- Agentic positioning leads — "your agents run on DeesseJS" is the primary hook, not "complete + modular" (this is now supporting).
- Agent primitives are the lead features (tool-calling, multi-step loops, per-tenant metering, usage-based billing) — NOT "built in, ready to use" as a sub-section.
- The live agent workflow demo (one concrete example of an agent building a feature) ships at M4 — this is the visual proof of the agentic claim.
- Per-tenant metering + usage-based billing are the "charge your users" mechanism — these are the agentic payoff, not just technical features.
- Pricing is consistent-gated: all tiers get the full feature set; gates are commercial (app count, seats, support, updates, white-label).
- "Modular" stays — it's the "without assembling" axis. Delete tests + "Deleting features" doc back it.

**How to apply:**
- Never claim "agents build your entire SaaS" — the honest claim is "agents build features on a wired system."
- Never ship the agentic positioning without the agent workflow demo visible — it's vaporware without the proof.
- Never demote agent primitives to a sub-section — in the new positioning, they ARE the lead.
- The emotional payoff ("Stop hiring developers. Start asking your agents.") goes in the sub-head or the founder note.
- See the full positioning in `documents/internal/marketing/landing-page.md` §1, and [[project-offer-design-research-2026-06]] for the offer mechanics.
