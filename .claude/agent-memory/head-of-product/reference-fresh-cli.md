---
name: reference-fresh-cli
description: Fresh CLI tool — AI-powered web search and fetch, used via `fresh` command in bash
metadata:
  type: reference
---

Fresh CLI — AI-powered web search and fetch, powered by Exa.ai.

## Top-level
- `fresh --help` lists commands and options
- Global flags: `-V/--version`, `-h/--help`

## Subcommands

### `fresh auth` — Authentication
- `login [options]` — device authorization flow
- `logout` — sign out and clear stored credentials
- `status` — check authentication status
- `whoami` — show current user info

### `fresh search` — Web search via Exa.ai
- `-q, --query <text>` — search query
- `-l, --limit <number>` — max results (default: 10)
- `-t, --type <type>` — auto | fast | deep-lite | deep | deep-reasoning | instant (default: auto)

### `fresh fetch <url>` — Fetch and extract content
- Argument: `url` (required)
- `-p, --prompt <text>` — prompt for content extraction

## When to use
- For ad-hoc web research or fetching specific URLs from the terminal
- Search types vary cost/depth: `fast`/`instant` for quick lookups, `deep*` for thorough research
