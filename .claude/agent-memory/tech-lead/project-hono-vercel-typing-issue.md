---
name: project-hono-vercel-typing-issue
description: Hono 4.12.26 (installed) has an unresolved TypeScript typing incompatibility with Next.js 15+ App Router route handlers — multiple PRs (#4877, #4878, #4888, #4964) closed unmerged; cast required in route.ts
metadata:
  type: project
---

## The issue

`handle(app)` from `hono/vercel` (installed Hono 4.12.26) is typed as:

```ts
(req: Request) => Response | Promise<Response>
```

Next.js 15+ App Router route handlers expect a wider signature: parameter `NextRequest | Request` (NextRequest extends Request), and return `Response | void | Promise<Response | void>` (the `void` allows handlers that don't return).

Multiple Hono PRs attempted to fix it (#4878, #4888, #4964) — **all closed unmerged** as of 2026-06-23. The fix has been "incoming" for months but never lands. Runtime works fine; only TS is unhappy.

## The workaround in `apps/web/app/api/[[...route]]/route.ts`

```ts
import type { NextRequest } from "next/server"
import { handle } from "hono/vercel"
import { app } from "@deessejs/api"

type NextHandler = (
  req: NextRequest | Request,
  ctx?: unknown,
) => Response | Promise<Response>

export const GET = handle(app) as unknown as NextHandler
export const POST = handle(app) as unknown as NextHandler
export const PUT = handle(app) as unknown as NextHandler
export const PATCH = handle(app) as unknown as NextHandler
export const DELETE = handle(app) as unknown as NextHandler
// OPTIONS auto-handled by Next.js if not exported (huge bonus).
```

The `as unknown as NextHandler` double cast is the standard escape hatch. Alternative: `// @ts-expect-error` on each line — uglier but localizes the suppression.

## Why this matters for our Phase 0

Without the cast, `pnpm tsc` fails on the route.ts file. The build step in CI would catch this. We must include the cast in the very first commit of the Hono mount.

## How to apply

When writing/editing `apps/web/app/api/[[...route]]/route.ts`:
- Always wrap each `handle(app)` export in the `NextHandler` cast
- Don't bother exporting `OPTIONS` — Next.js auto-generates it from the `Allow` header based on the other exported methods
- The `runtime` config is **NOT** set per-route in Next.js 16 — that's set at the Vercel project level or via `vercel.json`. Default is Node.js for Vercel Functions (matches our hosting.md requirement)
- `maxDuration = 1800` lives in this file (route-level config that Vercel picks up)

## Sources (verified 2026-06-23)

- [Hono Next.js docs](https://hono.dev/docs/getting-started/nextjs) — only shows GET/POST, doesn't document the cast
- [Hono issue #4877](https://github.com/honojs/hono/issues/4877) — original report
- [Hono PR #4888](https://github.com/honojs/hono/pull/4888) — the closest "fix" attempt, closed May 24 2026 without merging
- [Next.js route.ts docs (16.x)](node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route.md) — confirms Web standard Request/Response + OPTIONS auto-handling
