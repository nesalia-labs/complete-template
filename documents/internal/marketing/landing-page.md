# DeesseJS — Pre-Launch Landing Page

> **Status:** Pivot positioning — from "Apple of SaaS templates" to **"The agentic SaaS template."** The emotional core shifts from "complete + modular" to "your agents build, you ask." See §1 for the new positioning.
>
> **Date:** 2026-06-17
>
> **Research sources:**
> - [`offer-design-research.md`](./offer-design-research.md) — adversarial research, 5 HIGH CONFIDENCE confirmed findings. 14 surviving claims, 11 refuted.
> - **This version:** adds the **agentic positioning pivot** (new §1). The "Founder Edition" mechanics, the 14-day guarantee, the 3 bonuses, and the pricing structure from the previous version are preserved and integrated.
>
> **The pivot:** No competitor owns "agentic" as a primary positioning. supastarter and MakerKit mention AI coding agents, but as dev tooling — not as "your agents are your developers." DeesseJS can own this space if the claim is backed by real agent primitives (tool-calling, multi-step reasoning, per-tenant metering, human-in-the-loop) and one or two visible agent workflows shipped with the template.

---

## TL;DR — The new positioning

**Old:** "The Apple of SaaS templates — complete + modular."

**New:** "The SaaS template that never sleeps."

> *"You stop being the developer. Your agents become the developers."*

**The three axes of the new positioning:**

| Axis | Old framing | New framing |
|---|---|---|
| **What it is** | "Complete SaaS template" | "An agentic system your agents run on" |
| **Who it's for** | "Founders who want to ship" | "Founders who want their agents to ship" |
| **What you do** | "You assemble + customize" | "You ask, they build" |
| **The emotional payoff** | "Ship in days, not months" | "Stop hiring developers. Start asking your agents." |

**The headline candidates:**

- **Option A:** "The SaaS template that never sleeps."
- **Option B:** "Stop hiring developers. Start asking your agents."
- **Option C:** "You build the product. Your AI agents build the rest."

**Option A is recommended** — it's memorable, it implies the agentic system without stating it explicitly, and it's ownable. "Never sleeps" signals 24/7 agents, not just "AI features."

**Option B is the emotional punch** — use it in the sub-head or the founder note.

---

## §1 — The Agentic Positioning (the pivot)

### What "agentic" means here — and why it's the wedge

"Agentic" in DeesseJS means: **your AI agents are the executors, not the buyers.**

The template ships with primitives that let the buyer's agents:
- **Call tools** (auth, billing, storage, jobs, notifications, API)
- **Reason multi-step** (agent loops with checkpoints)
- **Operate per tenant** (per-tenant metering, per-tenant rate limits)
- **Get paid for** (usage-based billing via Stripe, per-tenant cost tracking)

In practice: the buyer's agent doesn't wire auth from scratch — it calls `deesse.auth.createUser()`. It doesn't build Stripe billing — it calls `deesse.billing.createSubscription()`. The system is already wired. The agent just asks.

### Why this is the wedge — and why no competitor owns it

| Competitor | AI story | Agentic story |
|---|---|---|
| **supastarter** | "Ready for Claude Code, Cursor, Codex" | Dev tooling for the developer — not agents running the system |
| **MakerKit** | MCP server + AI agent rules | Dev-side AI — not agent primitives that agents call |
| **ShipFast** | Zero native LLM modules | Not even on the map |
| **SaasRock** | Prompt Flow Builder, OpenAI-only | Rigid agents, Remix stack, not multi-step primitives |
| **TurboStarter** | "AI Kit: providers, tool calling, memory" | Tool calling exists, but no per-tenant metering, no billing integration |
| **Nexty** | Multi-modal demos | Showroom AI, not production agents |

**No competitor ships:**
- Per-tenant LLM cost tracking + token budgets
- Usage-based billing integration (Stripe metered usage)
- Agent loops with human-in-the-loop checkpoints
- Tool-calling against a complete wired system (not a demo)

**This is the wedge.** Not "we have AI" — but "your agents run on a complete, wired system and you can charge your users for their work."

### The claim — how to word it without overpromising

**Do say:** "DeesseJS gives your agents a complete wired system — auth, billing, storage, jobs, notifications, API — so your agents spend time building your product instead of wiring infrastructure."

**Don't say:** "Your agents build your entire SaaS." (Overpromise. The agents build features on top of a wired system — that's the honest version.)

**The honest headline:**

> "Your agents run on DeesseJS. Everything they need is already wired."

**The emotional headline:**

> "Stop hiring developers. Start asking your agents."

### What must ship to back this claim

The agentic positioning requires **visible proof**, not just primitives in the spec. At launch, the following must ship:

1. **One agent workflow example in the repo** — a documented, runnable agent that does something non-trivial (e.g., "create a billing subscription + send a welcome email + set up the first org" in one multi-step loop). This is the visual proof.

2. **The agent primitives visible in the docs** — a dedicated "Agents" section in Fumadocs showing: how to call tools, how to run agent loops, how to meter per-tenant costs.

3. **The per-tenant metering dashboard** — visible in the admin UI. The buyer sees their agents' LLM costs per tenant. This is the "charge your users" mechanism.

Without these three things, the agentic positioning is a tagline. With them, it's a product story.

### The three axes of the agentic positioning

**Axis 1 — "Without writing code"**
> You don't write code. You ask. The agents write the code.
- AGENTS.md shipped with the template
- AI agent rules for Cursor, Claude Code, Codex
- MCP server wired
- Tool-calling primitives for every surface

**Axis 2 — "Without assembling"**
> You don't wire auth + billing + jobs + storage + notifications. It's already done.
- Every feature ships, every feature wired
- Every feature deletable (modular contract)
- The system is complete before the agents start working

**Axis 3 — "Without limits"**
> You don't pay per agent, per call, per tenant. Pay once. Your agents run.
- Per-tenant LLM metering included
- Usage-based billing ready (Stripe metered usage)
- No per-seat agent cost
- Agents work across all apps and tenants

### The emotional payoff

The buyer doesn't think: "I'm buying a template."
The buyer thinks: "I'm hiring a team of agents that never sleep, never quit, and work for the price of one template."

> "The best developers don't work for salary. They work for electricity."

This is the line that converts.

---

## §2 — Why this page first (waitlist, not product)

**The case for the page, unchanged from the previous version:**

1. **The wedge is now agentic, not "Apple of SaaS templates"** — a pre-launch page lets us test whether "agentic" + "never sleep" resonates before we commit the messaging. Watch for: email signup rate, which CTAs convert, which testimonials surface.

2. **SEO compounds from day one.** New keyword clusters: "agentic SaaS template", "AI agents SaaS starter", "agents run your SaaS", "per-tenant LLM billing template". These are unclaimed.

3. **Day-1 buyers require a pre-launch list.** 500-1000 emails = real PH traction + IH thread + design partners.

4. **Cost is days, not weeks.** <$50/mo all-in. The build ships in parallel.

5. **The build is the proof of the agentic claim.** The demo app at M7 is where the agent workflow gets demonstrated. The page captures demand before the proof exists.

**The boundary:** The agentic positioning requires real agent primitives in the product. Don't ship the page with this messaging until M4 at minimum — enough to show one working agent workflow and the metering dashboard.

---

## §3 — The page structure

Single-page site at `deessejs.com`. No CMS, no blog, no auth. Sections in order:

```
[Nav: Logo · Pricing · Docs · Founder Edition]

[Hero]
  Headline (Option A): "The SaaS template that never sleeps."
  Headline (Option B): "Stop hiring developers. Start asking your agents."
  Sub-head: "Every surface your agents need — auth, billing, jobs, storage, notifications,
             API — is already wired. Your agents don't start from scratch.
             They start from a complete system."
  CTA primary: "Lock in the Founder Rate →" (email capture)
  CTA secondary: "See the agent primitives →" (anchor to #agents section)
  Strikethrough: ~~$399~~ → $249 founder rate. "Offer ends July 31, 2026."

[Social proof bar]
  "Join 247 indie founders building the next generation of agentic SaaS."
  (Pre-launch: show waitlist count. Post-launch: replace with named testimonials.)

[The emotional hook — the paradigm shift]
  "The old model: hire a developer, wait 3 months, ship.
   The new model: ask your agents, they build, you ship."
  Link to the "Agents" section.

[What ships — The agentic system]
  "Your agents run on DeesseJS. Here's everything wired for them:"
  17 surfaces listed, each framed as: "Your agent calls → deesse.{surface}.{action}"
  Auth: "deesse.auth.createUser()"
  Billing: "deesse.billing.createSubscription()"
  Jobs: "deesse.jobs.enqueue()"
  Storage: "deesse.storage.upload()"
  Notifications: "deesse.notifications.send()"
  API: "deesse.api.call()"
  Each: one line, code-style, showing the agent is the executor

[What ships — Agent primitives]
  4 bullets, promoted from sub-section to LEAD:
  1. Tool-calling — every surface has a tool the agent calls
  2. Multi-step reasoning — agent loops with human-in-the-loop checkpoints
  3. Per-tenant metering — every LLM call metered per tenant, hard caps enforced
  4. Usage-based billing — Stripe metered usage integration, charge per tenant for what their agents do
  "This isn't a chatbot. This is a system your agents run on."

[Live demo — One agent workflow]
  "Watch an agent set up billing, send a welcome email, and create the first org —
   in one multi-step loop."
  [Play button / screenshot / code block]
  This section ships at M4 (before the full product).

[Build vs. buy — the new framing]
  OLD: "You vs. 3-6 months of wiring."
  NEW: "Your agents vs. wiring everything from scratch."
  Mini-table: "Your agent calls → deesse.auth.createUser()" vs.
             "Developer wires auth: 2-4 weeks"
  Anchor: "$249 vs. 500+ hours of developer time."

[Pricing]
  3 tiers, strikethrough + "Most Popular" on Pro.
  Founder rate: ~~$399~~ → $249 / ~~$599~~ → $499 / ~~$999~~ → $899.
  "Offer ends July 31, 2026."
  14-day money-back guarantee in a visible guarantee box.
  "All features at every tier. No feature-gating."

[Bonuses]
  3 concrete bonuses: Figma UI Kit, Private Discord, AI Agent Workflow Library.
  The AI Agent Workflow Library = the live demo agent workflow + prompt templates.

[Social proof — testimonials]
  5-7 named testimonials with: full name, company, specific quantified outcome, link.
  Pre-launch fallback: "I'm in." quotes from the waitlist.
  Target format: "[Name], [Role], [outcome]" — e.g., "My support agent handles tier-1 tickets automatically. I haven't touched billing code in 3 months."

[Founder note]
  5-8 lines. Tone: "I'm not building a template. I'm building a system
  where you stop being the developer and start being the architect."
  Link to the public roadmap + the agent primitives docs.

[Buyer's Guide teaser]
  "Get the 4-page preview of the SaaS Template Buyer's Guide 2026.
   The full 30-page report ships at launch."
  Email-gated download.

[FAQ]
  6 questions (drafted in §4).

[Footer]
  Founder photo + bio + LinkedIn + GitHub
  Public roadmap link
  "Agents" docs link
  Email · Twitter · Indie Hackers
```

---

## §4 — The copy (drafted)

### Hero headline (Option A — recommended)

> **The SaaS template that never sleeps.**

### Hero headline (Option B — emotional punch)

> **Stop hiring developers. Start asking your agents.**

### Hero sub-headline

> Every surface your agents need — auth, billing, jobs, storage, notifications, API — is already wired. Your agents don't start from scratch. They start from a complete system.

> DeesseJS gives you the primitives: tool-calling against every surface, multi-step agent loops, per-tenant metering, and usage-based billing. Your agents run. You ask.

### The paradigm-shift hook (the emotional section)

> **The old model:**
> Hire a developer → Wait 3 months → Ship.

> **The new model:**
> Ask your agents → They build on DeesseJS → You ship.

> The best developers don't work for salary. They work for electricity.

### The agentic system section (code-style framing)

> **Your agents run on DeesseJS. Here's everything wired for them:**

> `deesse.auth.createUser()` → Better Auth, email + OAuth + 2FA + passkeys
> `deesse.billing.createSubscription()` → Stripe, per-seat, usage-based
> `deesse.jobs.enqueue()` → Trigger.dev, cron, retries, queues
> `deesse.storage.upload()` → Cloudflare R2, no egress
> `deesse.notifications.send()` → Upstash Realtime, real-time bell
> `deesse.api.call()` → Auto-generated SDK, typed, OpenAPI-native

> Every surface. Every tool. Already wired.

### Agent primitives section (the lead)

> **Built for agents, not just developers.**

> - **Tool-calling** — every surface has a tool your agent calls. Auth, billing, storage, jobs, notifications, API. No wiring required.
> - **Multi-step reasoning** — agent loops with human-in-the-loop checkpoints. Your agent pauses, you approve, it continues.
> - **Per-tenant metering** — every LLM call metered per tenant. Hard caps enforced. No runaway costs.
> - **Usage-based billing** — Stripe metered usage integration. Your agents generate costs per tenant. You charge back.

> This isn't a chatbot demo. This is a system your agents run on.

### Live demo section (M4 milestone — ships before the full product)

> **Watch an agent do this:**
> 1. Create a new user
> 2. Set up a Stripe subscription
> 3. Send a welcome email
> 4. Create the first org
> 5. Enqueue a background job
>
> One multi-step loop. No manual wiring. Just the agent asking DeesseJS.

[Code block or screenshot showing the agent workflow]

### Founder note (write personally — this is the highest-identity section)

> I spent the last few months reading every Product Hunt comment, Reddit thread, and Twitter argument about Next.js SaaS templates. The same complaint kept showing up: templates are either too thin (you outgrow them in 30 days) or too heavy (you spend weeks ripping out the parts you don't want).

> But the real shift isn't the template. It's the agents.

> DeesseJS is the system your AI agents run on. Every surface is wired. Every tool is callable. Your agents don't start from scratch — they start from a complete system. And you stop being the developer.

> You become the architect.

> The [agent primitives docs] and the [public roadmap] are public. The build starts this month. If you want to be one of the first 100 founders to run your agents on DeesseJS — [lock in the founder rate].

### Pricing section (same structure as previous version, integrated)

**The 3-tier structure:**

| Tier | Founder Rate | Regular | Most Popular | What your agents get |
|---|---|---|---|---|
| **Starter** | ~~$399~~ **$249** | $399 | | Core: auth, billing, jobs, API, CLI, SDK |
| **Pro** | ~~$599~~ **$499** | $599 | ★ Most Popular | + Admin, blog, docs, i18n, E2E, Figma UI Kit |
| **Team** | ~~$999~~ **$899** | $999 | | + White-label, priority support, Discord, AI Agent Workflow Library, 1 onboarding session |

**The guarantee box:**
> "14-day money-back guarantee. If your agents don't save you 3 months of development work in the first 14 days, email us for a full refund — no questions asked."

**The key framing:** All features at every tier. The gates are commercial, not feature-gated. Your agents get the full system at every tier.

**Bonuses (3 maximum):**
1. **Figma UI Kit** — "Included free (worth $99)"
2. **Private Discord** — "Join 500+ indie founders running agents on their SaaS"
3. **AI Agent Workflow Library** — "Pre-built agent workflows for support, billing recovery, onboarding. (worth $200+)" — ships with the live demo agent

### FAQ (7 questions — includes the agentic positioning)

**Q: What does "agentic" mean in DeesseJS?**
A: It means your AI agents are the executors, not just the users. Every surface in DeesseJS has a tool your agent calls: auth, billing, storage, jobs, notifications, API. Your agents run multi-step workflows against a complete, wired system — not a blank canvas.

**Q: When does it ship?**
A: v1 ships in approximately 10 weeks. The agent primitives ship at M4 (week 6). Founder Edition buyers get day-1 access and an invite to the agent workflow demo.

**Q: Is this vaporware?**
A: No. The spec is locked, the agent primitives are documented, and the first agent workflow is being built right now. You'll see it before you buy — we're demoing it live for Founder Edition buyers before launch.

**Q: How is this different from supastarter or MakerKit?**
A: They optimize AI for the developer — Claude Code, Cursor, Codex integration. DeesseJS optimizes the system for AI agents. Your agents don't just help you code — they run on DeesseJS, call the tools directly, and build your product while you sleep.

**Q: What if DeesseJS doesn't work for my project?**
A: 14-day money-back guarantee — no questions asked. If your agents don't save you 3 months of development work in the first 14 days, email us for a full refund.

**Q: What does "Founder Edition" include?**
A: The same DeesseJS as every buyer — full source code, all agent primitives, all features. The difference is:
> - Founder rate locked at $249/$499/$899 (regular price: $399/$599/$999 after July 31, 2026)
> - Day-1 access + live agent workflow demo before launch
> - 14-day money-back guarantee
> - A direct line to the founder for the first 90 days

**Q: Do I need to know how to prompt my agents?**
A: You need to know what you want. The prompts and workflows are in the AI Agent Workflow Library. Your agents handle the implementation.

---

## §5 — The 3 content pillars for SEO (agentic keywords)

To own the "agentic SaaS template" space, publish these before launch:

1. **"What 'agentic' actually means for a SaaS starter template"** (week 1)
   → Defines the term, links to the agent primitives docs, drives "agentic SaaS template" keyword

2. **"How to run a multi-step agent workflow on DeesseJS"** (week 2-3)
   → Code walkthrough of the demo agent workflow, links to the live demo

3. **"AI agents for indie founders: from prompt to production SaaS"** (week 4)
   → The buyer-voice angle: how indie founders are using agents to ship without developers

---

## §6 — What NOT to ship (anti-patterns — unchanged from previous version)

From [`offer-design-research.md`](./offer-design-research.md):

- ❌ **No countdown timer.** Savvy developers check the page the next day.
- ❌ **No "coming soon" framing.** Frame as "Founder Edition."
- ❌ **No vague social proof.** Every testimonial: full name + company + quantified outcome.
- ❌ **No "notify me" as the only CTA.** Give value first.
- ❌ **No payment plans.** Zero competitors offer them.
- ❌ **No "unlimited" without fair-use disclosure.**
- ❌ **No inflated "hours saved" estimates.** Present as conservative estimates.
- ❌ **No fabricated strikethrough prices.**
- ❌ **No "14-day guarantee" without honoring it.**
- ❌ **No "agents build your entire SaaS" claim.** The honest claim is: "agents build features on a wired system."
- ❌ **No agentic positioning without the agent workflow demo.** This is the proof. Don't lead with the claim before the proof exists.

---

## §7 — Decisions needed

- [ ] **Greenlight the agentic positioning** — is "The SaaS template that never sleeps" / "Stop hiring developers. Start asking your agents." the right framing?
- [ ] **Confirm the 3 agentic axes** — "without writing code", "without assembling", "without limits" — does this match what you're building?
- [ ] **Confirm the agent workflow demo** — what does the M4 live demo show? One concrete example needed before the page ships.
- [ ] **Confirm the guarantee** — "If your agents don't save you 3 months..." is the right framing for the refund.
- [ ] **Confirm the pricing** — $249/$499/$899 founder rate, $399/$599/$999 post-launch.
- [ ] **Confirm the July 31, 2026 deadline** — must be real.
- [ ] **Domain ownership** — is `deessejs.com` available?
- [ ] **Timeline: ship page at M4** — not at M-1. The agent workflow demo must ship with the page, not after.
- [ ] **Email service** — Resend Audiences (free up to 3K/mo) vs. Loops vs. ConvertKit.
- [ ] **Social proof collection** — how do we get named testimonials? The pre-launch email sequence is the recommended tactic.

---

## What changes in the marketing roadmap

The agentic pivot changes two things in the marketing roadmap:

1. **The page ships at M4 (not M-1 or M5-M6)** — the agent workflow demo must be visible when the page goes live. Shipping this messaging before the demo exists would be vaporware.
2. **SEO keyword targets shift** — add "agentic SaaS template", "AI agents SaaS starter", "per-tenant LLM billing template", "SaaS template for AI agents" to the long-tail keyword targets.

Everything else (DeesseJS Lite at M5-M6, full report at M7, launch at M8) stays the same.

---

## Cross-references

- [`offer-design-research.md`](./offer-design-research.md) — adversarial research, 14 surviving claims, 11 refuted. Primary source for the offer mechanics (guarantee, pricing, bonuses, urgency).
- `../product/positioning.md` — old positioning (Apple of SaaS templates). The agentic positioning replaces this as the primary frame; "Apple" becomes a supporting principle (completeness + polish).
- `../product/features/17-ai-primitives.md` — the agent primitives that back the agentic claim.
- `../product/features/03-billing.md` — usage-based billing and per-tenant metering (the "charge your users" mechanism).
- `../product/features/09-cli.md` — CLI as the agent interface.
- `../product/lead-magnets.md` — the 3-tier lead magnet strategy (Lite + report + demo).
- Agent memory: `head-of-marketing/project-offer-design-research-2026-06.md`, `head-of-marketing/project-deessejs-marketing-overview.md`, `head-of-marketing/reference-copy-angles.md`
