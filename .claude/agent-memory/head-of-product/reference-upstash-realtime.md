---
name: reference-upstash-realtime
description: Upstash Realtime — typed SSE pub/sub library on top of Upstash Redis Streams, used in DeesseJS for in-app notifications
metadata:
  type: reference
---

**Upstash Realtime** is a lightweight (~2.6kB gzipped, zero-dep) library for adding realtime features to Next.js apps. Powered by **Redis Streams**, delivered over **Server-Sent Events (SSE)**, no WebSockets.

**Why we use it in DeesseJS:** the in-app notifications surface. Picked over DIY SSE (more work) and over Pusher/Ably/Knock (more vendor / cost). Pairs naturally with the Apple positioning — real-time, ships in-template, no third-party dashboard for the buyer to learn.

## Key facts

- **Packages:** `@upstash/realtime`, `@upstash/redis`, `zod` (peer)
- **Auth:** Upstash Redis REST credentials (`UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`)
- **Type safety:** event schemas defined with Zod, end-to-end typed emit/subscribe
- **Serverless-friendly:** HTTP-based, works on Vercel / Netlify / edge runtimes
- **Built-in message history:** the bell-icon dropdown can show missed notifications on reconnect — no extra plumbing
- **Debugging:** realtime dashboard at app.upstash.com

## Implication: Redis is now a stack-level dependency

Upstash Realtime is built on Upstash Redis, so the template needs Upstash Redis provisioned. This opens the door for:
- Better Auth sessions / rate-limiting (same Redis)
- Caching layer
- Future: any pub/sub need (agent streaming, real-time updates, etc.)

We **don't** use it for:
- Trigger.dev queues (Trigger.dev manages its own)
- Main application data (Drizzle + Postgres)

## DX in a Next.js app

1. Install the three packages
2. Configure env vars
3. Define a typed event schema with Zod
4. One route handler at `app/api/realtime/route.ts` using `handle({ realtime })`
5. Wrap the app in `<RealtimeProvider>`
6. Use a typed `useRealtime()` hook on the client
7. Emit server-side: `await realtime.emit("notification.alert", { ... })`

Notification flows are one of the documented demos.

## Buyer experience

- Onboarding step: "Connect Upstash" (sign up → create Redis DB → paste REST URL + token)
- Free tier (256MB, 500K commands/month) is enough for indie buyers indefinitely
- Paid tiers scale linearly via Upstash Redis pricing

## Pricing snapshot (Upstash Redis, the underlying service)

- **Free:** 256MB, 500K commands/month, 10GB bandwidth
- **Pay-as-you-go:** $0.20 per 100K commands
- **Fixed plans:** $10 / $20 / $100 / $200 / $400 / $800 / $1,500 per month for 250MB → 500GB

See https://upstash.com/pricing for the latest.

## How to use

When designing the notifications surface, default to Upstash Realtime. The alternative is DIY SSE (more work, no vendor) or polling (deferred, simplest). Don't introduce Pusher/Ably/Knock without a strong reason — adds cost + vendor lock-in for a problem Upstash Realtime already solves.

Related: [[project-stack-and-scope-2026-06]], [[project-positioning-hybrid-2026-06]].
