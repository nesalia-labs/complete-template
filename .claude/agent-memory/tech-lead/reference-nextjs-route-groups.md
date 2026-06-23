---
name: reference-nextjs-route-groups
description: Next.js App Router route groups (parens) — convention, use cases, layout composition, caveats (verified 2026-06-23 from official docs)
metadata:
  type: reference
---

How Next.js App Router route groups work. **Verified 2026-06-23** from `nextjs.org/docs/app/api-reference/file-conventions/route-groups` and related pages.

## TL;DR

A folder name in parens like `app/(groupName)/` is a **route group**. It is for **organizational purposes** and is **omitted from the URL**.

## Convention

```ts
// app/(marketing)/pricing/page.tsx  → URL: /pricing
// app/(marketing)/about/page.tsx   → URL: /about
// app/(app)/dashboard/page.tsx      → URL: /dashboard
// app/(app)/[orgSlug]/page.tsx     → URL: /[orgSlug]  (group omitted, dynamic param kept)
```

The folder's name (between the parens) is irrelevant to the URL. Use it to describe the grouping (e.g. `marketing`, `app`, `auth`, `unprotected`).

## 3 main use cases

1. **Organize routes by team/feature/role** without affecting URLs
2. **Define multiple root layouts** (e.g. one for marketing pages, one for the app)
3. **Group routes that share a layout** (the group's `layout.tsx` wraps only routes inside the group)

For DeesseJS (per `documents/internal/architecture/03-web-app/pages.md`):
- `(marketing)` — public pages, top nav + footer layout
- `(auth)` — login/signup, centered card layout
- `(app)` — authenticated app with org sidebar layout
- `(system)` — system admin, separate auth + MFA

## Use case 3 example (the `(unprotected)` pattern)

```ts
app/
├── (unprotected)/
│   ├── login/
│   │   └── page.tsx           → URL: /login
│   └── signup/
│       └── page.tsx           → URL: /signup
├── (protected)/
│   ├── dashboard/
│   │   └── page.tsx           → URL: /dashboard
│   └── settings/
│       └── page.tsx           → URL: /settings
├── layout.tsx                 → Root layout (HTML, body, providers)
└── page.tsx                   → URL: /
```

You can attach a `layout.tsx` to each group:
- `app/(unprotected)/layout.tsx` — minimal layout, no nav
- `app/(protected)/layout.tsx` — full nav + auth check wrapper

Routes inside each group inherit the group's layout + the root layout. So `/login` renders with `[rootLayout, unprotectedLayout, loginPage]`; `/dashboard` renders with `[rootLayout, protectedLayout, dashboardPage]`.

## How layouts compose (component hierarchy)

In Next.js App Router, layouts are **nested**:

```
app/layout.tsx                    → RootLayout (html, body)
app/(app)/layout.tsx              → AppLayout (sidebar, topbar) — wraps ALL routes in (app)
app/(app)/dashboard/layout.tsx    → DashboardLayout — wraps only /dashboard
app/(app)/dashboard/page.tsx      → DashboardPage
```

When a user navigates to `/dashboard`, Next.js composes:
```
<RootLayout>
  <AppLayout>
    <DashboardLayout>
      <DashboardPage />
    </DashboardLayout>
  </AppLayout>
</RootLayout>
```

Layouts at the same level are NOT shared (no automatic merging). For two routes to share a layout, they must be in the same folder (or in a subfolder).

## Multiple root layouts caveat

If you create a route group with its own root layout (one that includes `<html>` and `<body>`):

- The official `app/layout.tsx` (root layout) is **replaced** by the group's root layout
- This means **all routes in OTHER groups lose the root layout wrapping** unless you ALSO have `app/layout.tsx` (which must not include `<html>` if a group has its own)
- If you have multiple root layouts (one per group), navigating between groups triggers a **full page reload** (not client-side navigation)

For DeesseJS: we use ONE root layout `app/layout.tsx` with `<html>` and `<body>`. The route groups `(marketing)`, `(auth)`, `(app)` have their own **inner layouts** (not root layouts) that wrap the group.

## Caveats (verbatim from docs)

1. **Full page load between groups** with different root layouts.
2. **Conflicting paths**: `(marketing)/about/page.tsx` and `(shop)/about/page.tsx` both resolve to `/about` → build error.
3. **No top-level root layout**: if you use multiple root layouts, you MUST define your home route (`/`) inside one of the route groups, not at the app root.

## Private folders (related convention)

Folders starting with underscore `_folderName` are **NOT routable**. Use them to colocate components/utilities that should not be routes:

```ts
app/blog/_components/Post.tsx     → Not a route, safe to colocate UI
app/blog/_lib/data.ts              → Not a route, safe to colocate utils
```

For our `apps/web`, the `src/components/` folder at the root of the app is **app-level** components, not pages. These would go in `app/(app)/_components/` if they were app-specific, but since they're not route-affecting, they live wherever.

## Related conventions (from the same doc)

| Convention | Pattern | Purpose |
|---|---|---|
| Route group | `(group)` | Group routes without URL impact |
| Private folder | `_folder` | Colocate non-routable code |
| Dynamic segment | `[param]` | Single dynamic URL segment |
| Catch-all | `[...slug]` | Multiple segments |
| Optional catch-all | `[[...slug]]` | Multiple segments, optional |
| Parallel route slot | `@folder` | Named slot in parent layout |
| Intercept same level | `(.)folder` | Modal over sibling |
| Intercept parent | `(..)folder` | Modal over child of parent |
| Intercept from root | `(...)folder` | Modal over arbitrary route |

## How to apply for DeesseJS

Our `apps/web/src/app/` structure (per `pages.md`):

```ts
src/app/
├── layout.tsx                          → RootLayout: html, body, providers, font vars
├── (marketing)/
│   ├── layout.tsx                      → MarketingLayout: top nav + footer
│   ├── page.tsx                        → / (landing) — OR put page.tsx at root
│   ├── pricing/page.tsx
│   ├── legal/terms/page.tsx
│   ├── legal/privacy/page.tsx
│   ├── features/page.tsx               → M2
│   ├── changelog/page.tsx              → M2
│   └── api-explorer/page.tsx            → M2
├── (auth)/
│   ├── layout.tsx                      → AuthLayout: minimal centered card
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   ├── forgot-password/page.tsx
│   ├── reset-password/page.tsx
│   ├── verify-email/page.tsx
│   ├── magic-link/page.tsx
│   └── auth/callback/[provider]/page.tsx
├── (app)/
│   ├── layout.tsx                      → AppLayout: sidebar + topbar + auth check
│   ├── [orgSlug]/
│   │   ├── page.tsx                   → org dashboard
│   │   ├── settings/
│   │   ├── members/
│   │   └── admin/
│   ├── onboarding/                    → wizard (parallel routes later)
│   └── accept-invite/[token]/page.tsx
├── (system)/
│   └── ...                             → M3
├── api/
│   ├── auth/[...all]/route.ts          → Better Auth handler
│   └── [[...route]]/route.ts          → Hono catch-all
├── error.tsx
├── not-found.tsx
└── loading.tsx
```

Each `app/(group)/layout.tsx` provides the layout for that group. The root `layout.tsx` provides the universal shell (HTML, body, providers, fonts, theme).

## Sources (verified 2026-06-23 via fresh)

- [Next.js Route Groups docs](https://nextjs.org/docs/app/api-reference/file-conventions/route-groups)
- [Next.js Project Structure](https://nextjs.org/docs/app/getting-started/project-structure)
- [Next.js layout.js](https://nextjs.org/docs/app/api-reference/file-conventions/layout)
- [Next.js Dynamic Segments](https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes)

## How to apply (next session)

When working on `apps/web`:
- **Route groups** = organization without URL impact. Use for (marketing), (auth), (app), (system).
- **Group layout** = a `layout.tsx` inside a group folder wraps only that group's routes.
- **Always** have a top-level `app/layout.tsx` as the root.
- **Don't** put two pages with the same URL in different groups — it errors.
- For DeesseJS, we use ONE root layout + 4 group layouts. No multiple root layouts (avoids full-page reloads).