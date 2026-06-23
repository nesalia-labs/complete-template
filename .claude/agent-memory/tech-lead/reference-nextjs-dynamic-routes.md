---
name: reference-nextjs-dynamic-routes
description: Next.js 16 App Router dynamic routes deep-dive — [param], [...slug], [[...slug]], async params/searchParams, PageProps utility, generateStaticParams, pitfalls (verified 2026-06-23)
metadata:
  type: reference
---

How dynamic routes work in Next.js 16 (App Router). **Verified 2026-06-23** from `nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes` and related pages.

## TL;DR

Three dynamic segment patterns + async params + searchParams + PageProps utility type. The big change for our project (Next 16.2.9) is that **`params` and `searchParams` are now Promises** that must be `await`-ed.

## The 3 patterns

| Pattern | Example | URL matches | `params` type |
|---|---|---|---|
| `[slug]` | `app/blog/[slug]/page.tsx` | `/blog/abc` | `{ slug: string }` |
| `[...slug]` | `app/shop/[...slug]/page.tsx` | `/shop`, `/shop/a`, `/shop/a/b` (must have ≥1) | `{ slug: string[] }` |
| `[[...slug]]` | `app/shop/[[...slug]]/page.tsx` | `/shop`, `/shop/a`, `/shop/a/b` (zero or more) | `{ slug?: string[] }` (slug can be `undefined`) |

## The big breaking change: async params (Next 15+ → 16 strict)

In **Next.js 14 and earlier**, params was a sync object:
```tsx
// Next 14 — still works in 15/16 with deprecation warning
export function Page({ params }: { params: { slug: string } }) {
  return <div>{params.slug}</div>
}
```

In **Next.js 15**, params became a Promise (with backward compat).
In **Next.js 16**, params MUST be awaited. The sync form is removed.

```tsx
// Next 15+ / Next 16 — REQUIRED
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return <div>{slug}</div>
}
```

**Why the change**: enables partial prerendering and streaming. Next.js can render the static shell of a page immediately while the dynamic params resolve in parallel.

## The `PageProps<'/route'>` utility type (recommended)

Instead of writing `params: Promise<{ slug: string }>` by hand, use the auto-generated `PageProps` helper:

```tsx
export default async function Page({
  params,
  searchParams,
}: PageProps<'/blog/[slug]'>) {
  const { slug } = await params
  const { page } = await searchParams
  // slug is `string`, searchParams is `Promise<Record<string, string|string[]|undefined>>`
}
```

The path string `'/blog/[slug]'` is type-checked against the app's actual route tree. If you typo the path, TypeScript errors:
```
Type '"/blog/[foobar]"' does not satisfy the constraint 'AppRoutes'.
```

Same helpers exist for:
- `PageProps<'/route'>` — for `page.tsx`
- `LayoutProps<'/route'>` — for `layout.tsx`
- `RouteContext<'/route'>` — for `route.ts` (API handlers)

## searchParams (also async in Next 15+)

```tsx
// URL: /articles?page=2&tag=react
export default async function Page({
  searchParams,
}: PageProps<'/articles'>) {
  const { page, tag } = await searchParams
  // page: string | string[] | undefined
  // tag: string | string[] | undefined
  return <Articles page={Number(page) || 1} tag={tag} />
}
```

In **Client Components**, use the `use` hook:
```tsx
'use client'
import { use } from 'react'

export default function Page({ searchParams }: {
  searchParams: Promise<{ [k: string]: string | string[] | undefined }>
}) {
  const { page } = use(searchParams)
  return <div>Page: {page}</div>
}
```

Or use the `useSearchParams` hook (anywhere in the tree, not just page).

## generateStaticParams (SSG for known param values)

For routes you want to pre-render at build time (blog posts, product pages, org pages):

```tsx
// app/blog/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = await fetch('https://api.example.com/posts').then(r => r.json())
  return posts.map((post) => ({ slug: post.slug }))
  // Returns: [{slug: 'foo'}, {slug: 'bar'}, ...]
}

export default async function Page({
  params,
}: PageProps<'/blog/[slug]'>) {
  const { slug } = await params
  const post = await getPost(slug)
  return <article>{post.title}</article>
}
```

For DeesseJS:
- `/[orgSlug]` → `generateStaticParams` would need to fetch all orgs from the DB. Probably NOT worth it (orgs are dynamic, multi-tenant). Use `dynamicParams: true` (default) and render on-demand.
- `/blog/[slug]` (M3) → use generateStaticParams for known blog posts.
- `/accept-invite/[token]` → never SSG, always dynamic.

## Build-time validation in Next 16

Next 16 validates at build time that dynamic content is correctly handled. If you access runtime APIs (like `cookies()`, `headers()`) without wrapping in `Suspense` or `generateStaticParams`, the build will warn or fail.

```tsx
// ❌ This might fail validation if accessing cookies() in dynamic branch
import { cookies } from 'next/headers'

export default async function Page({ params }: PageProps<'/blog/[slug]'>) {
  const { slug } = await params
  const cookieStore = await cookies()  // runtime API
  
  if (slug.startsWith('private-')) {
    return <PrivateContent cookieStore={cookieStore} />
  }
  return <PublicContent slug={slug} />
}

// ✅ Wrap in Suspense for proper boundary
import { Suspense } from 'react'

export default function Page({ params }: PageProps<'/blog/[slug]'>) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Content params={params} />
    </Suspense>
  )
}
```

## Catch-all vs optional catch-all

| Pattern | `/shop` | `/shop/a` | `/shop/a/b` |
|---|---|---|---|
| `[...slug]` | ❌ | ✓ (`{slug: ['a']}`) | ✓ (`{slug: ['a','b']}`) |
| `[[...slug]]` | ✓ (`{slug: undefined}`) | ✓ | ✓ |

For DeesseJS, no obvious use for `[[...slug]]` currently. Keep `[...slug]` for `/api/[[...route]]` (the Hono catch-all) — actually that's a `route.ts` not a page, and uses `[[...route]]` for optional catch-all. See [[reference-shadcn-monorepo-pitfalls]] for the Hono mount details.

## `dynamicParams` segment config (advanced)

```tsx
// app/blog/[slug]/page.tsx
export const dynamicParams = true  // default — params not in generateStaticParams render on-demand
export const dynamicParams = false // strict — 404 for params not prerendered
```

## Common pitfalls

1. **Forgetting `await`** on `params` or `searchParams` — TypeScript will yell (in strict mode), but at runtime you get `params.X` is undefined.
2. **`asChild` doesn't exist in Base UI** (use `render={<X />}` instead) — see [[project-shadcn-final-state]] for the Base UI pattern.
3. **Conflicting path** between groups — `(marketing)/about/page.tsx` and `(shop)/about/page.tsx` both → `/about` → build error. Don't duplicate.
4. **Empty `generateStaticParams` array** — the page becomes unreachable (or 404) unless you also set `dynamicParams: true`.
5. **Build time validation** for runtime APIs — wrap in `<Suspense>` or use `generateStaticParams`.

## DeesseJS M1 routes that need dynamic params

From `documents/internal/architecture/03-web-app/pages.md`:

```tsx
// /[orgSlug]/page.tsx — params: Promise<{ orgSlug: string }>
export default async function Page({ params }: PageProps<'/[orgSlug]'>) {
  const { orgSlug } = await params
  // resolve org from DB, then render
}

// /[orgSlug]/projects/[id]/page.tsx (M2) — params: Promise<{ orgSlug: string, id: string }>
export default async function Page({ params }: PageProps<'/[orgSlug]/projects/[id]'>) {
  const { orgSlug, id } = await params
}

// /accept-invite/[token]/page.tsx — params: Promise<{ token: string }>
export default async function Page({ params }: PageProps<'/accept-invite/[token]'>) {
  const { token } = await params
}

// /api/[[...route]]/route.ts — Hono catch-all (optional catch-all)
export const GET = handle(app)
export const POST = handle(app)
// etc.

// /auth/callback/[provider]/page.tsx — params: Promise<{ provider: string }>
export default async function Page({ params }: PageProps<'/auth/callback/[provider]'>) {
  const { provider } = await params
}
```

## How to apply (next session)

When writing a page that uses dynamic segments in DeesseJS:
1. **Always** use `async function Page(props: PageProps<'/path/[param]'>)` — never the inline type.
2. **Always** `await params` (and `searchParams` if used).
3. For Client Components, use `use(params)` from React.
4. For known param values (blog posts, etc.), use `generateStaticParams` + `dynamicParams: true`.
5. Wrap runtime API access (cookies, headers) in `<Suspense>` to satisfy build-time validation.

## Sources (verified 2026-06-23 via fresh)

- [Next.js Dynamic Segments](https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes) — full convention, PageProps utility, TS types
- [Next.js page.js](https://nextjs.org/docs/app/api-reference/file-conventions/page) — props, searchParams
- [Next.js generateStaticParams](https://nextjs.org/docs/app/api-reference/functions/generate-static-params) — SSG patterns
- [Next.js Route Groups](https://nextjs.org/docs/app/api-reference/file-conventions/route-groups) — group convention (see [[reference-nextjs-route-groups]])
- [Async params in Next 16 (dev.to)](https://dev.to/peterlidee/async-params-and-searchparams-in-next-16-5ge9) — practical guide
- [Fixing broken routes after Next 16 upgrade](https://coffey.codes/articles/fixing-broken-routes-after-nextjs-16-upgrade) — migration patterns

## How to apply (recap)

- DeesseJS Next version: **16.2.9** (strict async params, no backward compat).
- Use `PageProps<'/route'>` everywhere — never inline `params: Promise<...>`.
- `searchParams` is also async — `await` it.
- `[[...route]]` for the Hono catch-all (already in plan).
- For dynamic org pages (`/[orgSlug]/*`), use `dynamicParams: true` (default) — render on-demand.