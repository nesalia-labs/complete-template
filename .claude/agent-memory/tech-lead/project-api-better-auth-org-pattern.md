---
name: api-better-auth-org-pattern
description: Why packages/api wraps getFullOrganization + getActiveMemberRole in helpers (Better Auth inference bug #4222) — verified 2026-06-19
metadata:
  type: project
---

In `packages/api`, we call `auth.api.getFullOrganization({headers})` and `auth.api.getActiveMemberRole({headers})` to resolve the active org + member role per request (in `src/middlewares/hono/auth-context.ts`). These calls go through `src/middlewares/hono/auth-client.ts`, which is the ONLY place that casts `auth.api`.

**Why the cast exists:** Better Auth 1.6.19's `Session` type loses the `Options["plugins"]` generic when re-exported through `@deessejs/auth` (Better Auth issue #4222). The `organization()` plugin's methods — `getFullOrganization`, `getActiveMemberRole`, `setActiveOrganization`, etc. — exist at runtime but are NOT in the inferred type. We verified the methods exist in v1.6.19 by reading `packages/better-auth/src/plugins/organization/organization.ts` and `routes/crud-org.ts`.

**Why we localize the cast to ONE file** (auth-client.ts): any consumer that needs these methods imports `getActiveOrganization()` and `getActiveMemberRole()` from there. Consumers never see the cast. If Better Auth fixes the inference (or we add `satisfies BetterAuthOptions` to the auth package config), we delete auth-client.ts and rename imports — one-line change per consumer.

**The upstream fix** (not yet applied) is to change `apps/template/packages/auth/src/auth.ts` to:
```ts
const options = { /* ... */ } as const
const _auth = betterAuth({
  ...options,
  plugins: [organization({ ...options.plugins }), /* ... */],
})
export const auth = _auth satisfies BetterAuth
```
This preserves the `Options["plugins"]` tuple generic through the re-export. Out of scope for the api package — should be done as a separate auth package change.

**The wrong pattern we tried and abandoned:**
- `declare module '@deessejs/auth'` module augmentation to add `activeOrganizationId?: string | null` to `Session`. This was de la merde per the user (correctly) — it augments the WRONG module (wrapper, not source), and Better Auth maintainers don't recommend it (per issues #5909, #4222, #7005).
- `auth.api as any` scattered at consumer sites — created N casts instead of 1.

**What we did instead (Option A):** Hono middleware resolves the org once via `getFullOrganization` + `getActiveMemberRole` and stashes the result on `c.get('activeOrg')` as `{id, slug, memberRole}`. The oRPC `orgContextMiddleware` reads from `context.activeOrg.id` — no cast, no DB call in the oRPC layer.

**How to apply:**
- New Better Auth org API methods: add to `auth-client.ts`'s `AuthApiSubset` interface, then expose a typed wrapper. NEVER cast `auth.api` outside this file.
- If you add a procedure that needs org info: read `context.activeOrg.id` (already populated by the Hono middleware).
- If you find yourself wanting to read `session.activeOrganizationId` directly: stop. Use `getActiveOrganization()` via auth-client.ts or read from `context.activeOrg.id`.
- Track: when the auth package applies the upstream fix, delete `src/middlewares/hono/auth-client.ts` and update consumers (likely 1-2 sites: `auth-context.ts` for the middleware, possibly future feature modules).