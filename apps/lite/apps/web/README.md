# DeesseJS Lite

The free, OSS, demo instance of [DeesseJS](https://deessejs.com).

> **Status:** `v0.0.1` — Next.js scaffold only. No features yet. Incremental delivery in progress.

## What this is

`apps/lite/` is a per-instance copy of the DeesseJS template (see ADR-0012). It exists to:

1. Ship a **public demo** of the DeesseJS stack — sign up, create an org, manage projects.
2. Become the **OSS lead magnet** (post-v1) — a public GitHub repo that funnels to the full template.

## Status

| Version | What ships |
|---|---|
| `v0.0.1` | Next.js scaffold + Vercel deploy (this commit) |
| `v0.0.2` | Auth (sign up / sign in) wired to `@deessejs/auth` |
| `v0.0.3` | Org switcher + RBAC |
| `v0.0.4` | Projects CRUD + landing page = first demoable build |

## Local dev

```bash
pnpm install          # at repo root
pnpm --filter @deessejs/lite-web dev
```

Open [http://localhost:3000](http://localhost:3000).

## Architecture note

Until `v0.0.4`, this app imports directly from `apps/template/packages/*` (a pragmatic exception to ADR-0012, documented in ADR-0013). Once `scripts/extract-instance/` ships, lite gets its own copy of each package per the per-instance pattern.