---
name: feedback-research-before-deciding
description: For non-obvious tech/stack choices, default to "fouille sur le web ce que font les autres" — research community conventions before recommending
metadata:
  type: feedback
---

When the user is asked to choose a stack/tech/library and the answer isn't obvious from the code or existing memory, **default to "what do others do?"** before recommending.

**Why:** the user explicitly said this on 2026-06-23 when asked about `apps/email-preview` tech choice. My initial recommendation was Next.js 16 (mirror `apps/web`), but the user wanted me to first research what popular SaaS starters / shadcn templates / vercel templates use for their email preview apps, then come back with a recommendation grounded in community convention.

**How to apply:**
- For any "which framework / library / architecture pattern?" question where the answer isn't already in code or memory: do a `fresh search` / `fresh fetch` round first to find community conventions (top SaaS starters, official docs, popular templates).
- Present the consensus + the outliers + your recommendation based on that research.
- Don't propose a stack from scratch without checking what similar projects do.
- Particularly relevant for: preview/dev tooling, dev experience choices, deployment topology, test setup. Less relevant for: things already decided in our architecture docs.

**What I found on 2026-06-23 for email-preview:**

The consensus from popular SaaS templates (ShipFast, CREA.MBA article, etc.) is:
- **Just use `email dev` CLI** (port 3000) — no separate app, no deploy story. Dev-only.
- **supastarter** is the outlier: has `apps/mail-preview` (Next.js, port 3005), the only template I've found with a dedicated preview app.

The official `email build` + Vercel deploy path has an **open bug** (resend/react-email #3498, opened 2026-05-13, still open as of 2026-06-23): the preview app returns 404 on Vercel in monorepo setups due to Next.js legacy mode. So you can't easily use the official deploy story.

Decision factors:
- **Want a public demo URL** (`demo.deessejs.dev/email-preview` for prospects) → Next.js standalone app, the bug workaround (our own Next.js scaffold bypasses the official `email build`).
- **Just a dev tool for the team** → CLI `email dev -p 3005` is enough.
- **Want it deployable AND official** → not possible today due to #3498.

User confirmed "on fait tout ça demain" earlier but asked this question on 2026-06-23 — the session continued into a new day. Stack choice pending.