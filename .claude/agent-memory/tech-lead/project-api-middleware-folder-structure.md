---
name: api-middleware-folder-structure
description: packages/api middleware folder layout — single src/middlewares/ with hono/ and orpc/ subfolders (refactored 2026-06-19)
metadata:
  type: project
---

`packages/api` uses ONE folder for all middlewares: `src/middlewares/`, with two subfolders that mirror the request pipeline layers:

```
src/middlewares/
├── hono/    # Hono middlewares — run BEFORE route handler matches
│   ├── request-id.ts
│   ├── auth-context.ts
│   ├── rate-limit.ts
│   ├── logging.ts
│   └── cors.ts
└── orpc/    # oRPC middlewares — run INSIDE procedure chain via .use(...)
    ├── auth.ts
    ├── org-context.ts
    └── logger.ts
```

**Why:** an earlier split between `src/middleware/` (singular, Hono) and `src/middlewares/` (plural, oRPC) was too subtle — the plural vs singular distinction was a naming trick instead of a structural one. Subfolders encode the layer distinction directly in the folder structure, no naming tricks needed.

**How to apply:**
- New Hono middleware → `src/middlewares/hono/<name>.ts`, import from `'../../types'` for `AppVariables`.
- New oRPC middleware → `src/middlewares/orpc/<name>.ts`, import from `'../../context'` for `base`.
- Do NOT reintroduce `src/middleware/` (singular) at the root. If you see it, it's a regression — refactor back to `src/middlewares/hono/`.
- Doc reference: `documents/internal/architecture/11-packages/api/structure.md#srcmiddlewares--the-middleware-layer`.

**Imports inside the subfolders go up TWO levels** (`../../`), not one (`../`). The depth is intentional — it matches the mental model of "two layers under the request pipeline root".