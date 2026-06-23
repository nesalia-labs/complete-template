---
name: apps-web-pages-inventory
description: Pointer to the canonical apps/web page inventory (now in 03-web-app/pages.md, not here). Memory kept minimal.
metadata:
  type: project
---

The full page inventory for `apps/template/apps/web` lives in the architecture docs at **`documents/internal/architecture/03-web-app/pages.md`**. This memory file is just a pointer.

**Why a memory pointer and not a copy**: the page inventory is a structured doc (tables, priorities, cross-refs) that lives with the other architecture decisions. Agent memory is for the surprising / non-obvious / cross-session. The page list is in the code-adjacent docs and can be re-read directly.

**Key takeaways** (the things that survive the doc not being open):
- Current state (2026-06-23): `apps/web` has only `create-next-app` placeholder + Geist fonts. Zero product pages.
- M1 = 27 elements (24 pages + 3 special files: `error.tsx`, `not-found.tsx`, `loading.tsx`).
- 3 placeholder pages in M1 (dashboard, members, admin) prove the routing before the feature ships.
- **Critical M1 blocker**: `/api/[[...route]]/route.ts` doesn't exist yet — Hono app from `@deessejs/api` not mounted. Pages can't be functional until this lands. See `documents/internal/architecture/11-packages/api/hosting.md`.
- Scaffolding order: Hono mount → Better Auth client → layouts (auth → marketing → app → system/docs) → M1 pages (auth → onboarding → app placeholders → marketing → special).
- 5 open decisions documented in `pages.md` (URL scheme, wizard pattern, placeholder policy, etc.) — not yet confirmed with the user.

**How to apply**:
- When asked to add a page to `apps/web`: read `documents/internal/architecture/03-web-app/pages.md` first, find the right surface table, follow the convention (route group = layout boundary).
- When the user asks for the "M1 list" or "what pages does apps/web need" → point them to `pages.md` and quote the M1 recap table.
- Don't try to re-enumerate pages from memory — the doc is the source of truth.