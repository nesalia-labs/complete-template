---
name: better-auth-cookiecache-workaround
description: Why packages/api uses asResponse:true + manual set-cookie propagation (until Better Auth PR #9667 lands) — verified 2026-06-19
metadata:
  type: project
---

**In `packages/api/src/middlewares/hono/auth-context.ts`** we call:
```ts
const response = await auth.api.getSession({ headers: c.req.raw.headers, asResponse: true })
for (const [key, value] of response.headers) {
  if (key.toLowerCase() === 'set-cookie') c.header(key, value, { append: true })
}
const json = await response.json()
```

The `asResponse: true` + manual set-cookie propagation is **NOT in the official Better Auth Hono docs** (verified 2026-06-19 at `better-auth.com/docs/integrations/hono`). The official pattern is just `await auth.api.getSession({ headers })`. But that pattern drops the `Set-Cookie` refresh header from Better Auth's cookieCache mechanism.

**Tracking the upstream fix:** Better Auth **PR #9667** ("fix: forward session cookie refresh headers", by kgarg2468, opened 2026-05-18, state **open**) introduces two things:
1. A new `returnHeaders: true` option on `getSession` (cleaner than `asResponse: true`).
2. Server-side automatic forwarding of refresh headers to the endpoint response.

**When the PR merges:**
1. We can drop the manual `for ([key, value] of response.headers)` loop — Better Auth will do it for us.
2. Switch from `asResponse: true` to `returnHeaders: true`.
3. Update the comment in `auth-context.ts` to point to the new pattern.

**Why we diverge from the docs NOW:** the official Hono docs are wrong (or at least incomplete) — they show a pattern that breaks cookieCache refresh. Our divergence is intentional and necessary.

**Other divergences from the official Hono docs** (none of these are bugs):
- We try/catch `getSession` and proceed with `authContext = null` on error. The doc lets it throw. Our pattern is more resilient (DB hiccup ≠ all requests fail).
- We resolve the active org via `getFullOrganization` + `getActiveMemberRole` (multi-tenant). The doc only sets session/user — it doesn't cover multi-org at all.
- We declare `AppVariables` in `src/types.ts` and import it in each sub-app. The doc inlines the type once — fine for a single `Hono` app, awkward for our 3 sub-app composition.

**How to apply:**
- When touching `auth-context.ts`, don't "fix" the `asResponse: true` pattern thinking it's a workaround that shouldn't be there. It IS the workaround, for now.
- Don't try to align our code to the official Hono doc unless the doc gets updated (which it should, when PR #9667 lands).
- If PR #9667 changes the public API, update both `auth-context.ts` AND `packages/auth/integrations.md` §2 together.