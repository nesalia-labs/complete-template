---
name: orpc-better-auth-endpoints
description: oRPC v1.14 envelope shape + Better Auth 1.6.19 endpoint renames (verified 2026-06-19 during packages/api smoke test)
metadata:
  type: project
---

Two non-obvious facts discovered while smoke-testing `packages/api` on 2026-06-19.

**1. oRPC v1.14 response envelope.** Procedures that return a JSON object are wrapped under the `json` key, not `result.data`. Example: a handler returning `{status: 'ok', timestamp: '...'}` produces:

```json
{ "json": { "status": "ok", "timestamp": "..." } }
```

The `@orpc/client` unwraps this automatically; raw HTTP consumers (curl, fetch) see the envelope. Other return types get other keys (string → `text`, etc. — see `RPCHandler` Supported Data Types in the oRPC docs).

**Why:** tests that assert `body.result.data.X` will silently fail. Use `body.json.X` for raw JSON object returns.

**How to apply:** when writing smoke tests or debug scripts against `/rpc/*`, expect the envelope. Document this in the auth-test SKIP note too (the auth package's auth.test.ts has a related note about emailOTP renames).

**2. Better Auth 1.6.19 renamed `/api/auth/session` → `/api/auth/get-session`.**

**Why:** the auth package's `auth.test.ts` already notes this for `emailOTP` ("Better Auth 1.6.19 renamed the emailOTP endpoint. The docs example uses `auth.api.sendVerificationOTP` which doesn't exist in this version"). The same happened to the session endpoint.

**How to apply:**
- HTTP clients (curl, fetch, browser SDK): hit `/api/auth/get-session`, not `/api/auth/session`.
- For the oRPC Better Auth integration in `packages/api/middleware/auth-context.ts`, the call `auth.api.getSession({ headers })` is unaffected — the rename only affects the HTTP endpoint, not the `auth.api` server method.
- If any doc reference says `/session`, fix it.

Both facts apply only to Better Auth 1.6.x and oRPC 1.14+. If we bump either, verify the envelope/endpoint names haven't changed again.