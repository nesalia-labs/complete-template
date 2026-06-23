---
name: project-neon-drizzle-push-gotchas
description: Drizzle-kit push to Neon Postgres hits 2 gotchas — channel_binding=require breaks postgres-js 3.4, and the .env file must not quote the value or parsing fails silently
metadata:
  type: project
---

Two non-obvious gotchas hit when running `drizzle-kit push` against a Neon Postgres instance on 2026-06-23.

## Gotcha 1: `channel_binding=require` breaks postgres-js 3.4

Neon's pooled connection string (from the dashboard) includes `?sslmode=require&channel_binding=require`. The `channel_binding=require` requires SCRAM-SHA-256-PLUS channel binding, which the `postgres@^3.4.9` driver (used by `@deessejs/database`) does not support. The first connection attempt produces a `read ECONNRESET` error after the SSL handshake.

**Workaround**: drop `&channel_binding=require` from the URL before pushing. The remaining `?sslmode=require` works.

```bash
# Extract, strip channel_binding, write to packages/database/.env
DATABASE_URL=$(grep '^DATABASE_URL=' apps/web/.env | cut -d= -f2- | sed 's/&channel_binding=require//')
printf "DATABASE_URL=%s\n" "$DATABASE_URL" > packages/database/.env
cd packages/database && pnpm exec drizzle-kit push --force
```

The direct (non-pooler) Neon URL also has the same `channel_binding=require` — same fix.

## Gotcha 2: `.env` files must NOT have quotes around the value

When generating a `.env` from bash with `echo "DATABASE_URL='...'" > .env`, the single quotes end up as PART of the value. dotenv parses it as the literal string `'postgresql://...'` (with leading/trailing quotes), and the postgres-js driver fails to parse the URL — `address: undefined, port: undefined` in the error, then `CONNECT_TIMEOUT`.

**Fix**: use `printf "DATABASE_URL=%s\n" "$URL"` (no quotes) or write the file by hand.

## Why these aren't documented elsewhere

- Drizzle docs assume local Postgres — no guidance on Neon specifics.
- postgres-js 3.4 changelog mentions channel binding as a known limitation but doesn't say "strip it from the URL".
- dotenv has always parsed quotes, but the failure mode is silent (the URL string has visible quotes in the error).

## How to apply

When running `drizzle-kit push` against any Neon-hosted database:
1. Strip `&channel_binding=require` from the URL.
2. Write `.env` with `printf`, never `echo` with surrounding quotes.
3. Use `drizzle-kit push --force` to skip the interactive confirmation (the prompt hangs in non-TTY contexts).
4. Clean up the temp `.env` from `packages/database/` after — it shouldn't persist (no secrets).

The `db:push` script is now in `packages/database/package.json` (line 17, with `--force` baked in).
