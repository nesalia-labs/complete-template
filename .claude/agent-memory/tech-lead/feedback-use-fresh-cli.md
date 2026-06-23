---
name: feedback-use-fresh-cli
description: Always use `fresh` CLI (Exa.ai) for web search/fetch instead of built-in WebSearch/WebFetch
metadata:
  type: feedback
---

Always use `fresh search` and `fresh fetch` for any web research task. Do not use the built-in `WebSearch` / `WebFetch` tools.

**Why:** The user installed `fresh` (Exa.ai-powered CLI at `C:\Users\dpereira\tools\node\...`) specifically to get more reliable results — built-in `WebSearch` has returned API errors on real queries (e.g. Hono latest version lookup) and `WebFetch` truncates large npm registry payloads. The user explicitly said "tu dois utiliser fresh tout le temps" on 2026-06-18.

**How to apply:**
- For any "search the web" / "find latest version" / "fetch this URL" task: shell out to `fresh search "<query>"` or `fresh fetch <url>` via the Bash tool
- Default to `fresh` for Hono / oRPC / Better Auth / Drizzle / Next.js doc lookups during the API package build
- Check `fresh --help` first if a subcommand is unfamiliar (supports `search`, `fetch`, `auth`, `help`)
- Treat the fresh output as the source of truth; no need to verify with WebFetch in parallel
