---
name: reference-shadcn-monorepo
description: shadcn/ui in monorepo context — verified patterns from official docs (CLI v4, March 2026), Tailwind v4 specifics, file structure, components.json requirements
metadata:
  type: reference
---

How shadcn/ui works in a monorepo. Verified 2026-06-23 via fresh fetch of the official docs + CLI v4 changelog.

## TL;DR

shadcn CLI v4 (March 2026) has **first-class monorepo support**. No more manual import path fixing. The canonical layout is `apps/web` + `packages/ui` (what `npx shadcn@latest init --monorepo` scaffolds).

## File structure (canonical)

```txt
apps
└── web                  # Next.js / Vite / etc. app
    ├── app/
    ├── components/       # app-only components (login-form, etc.)
    ├── components.json  # FIRST components.json (app-side)
    └── package.json
packages
└── ui                   # shared primitives
    ├── src/
    │   ├── components/   # button.tsx, card.tsx, etc.
    │   ├── hooks/        # use-theme.ts, etc.
    │   ├── lib/          # utils.ts (cn, etc.)
    │   └── styles/
    │       └── globals.css   # Tailwind v4 + CSS variables
    ├── components.json   # SECOND components.json (package-side)
    └── package.json
```

## Two `components.json` files

Both need the same `style`, `iconLibrary`, and `baseColor`. They differ in `aliases` and `tailwind.css`.

**`apps/web/components.json`:**
```jsonc
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",                              // EMPTY for Tailwind v4
    "css": "../../packages/ui/src/styles/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/components",
    "hooks": "@/hooks",
    "lib": "@/lib",
    "utils": "@workspace/ui/lib/utils",
    "ui": "@workspace/ui/components"
  }
}
```

**`packages/ui/components.json`:**
```jsonc
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",                              // EMPTY for Tailwind v4
    "css": "src/styles/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@workspace/ui/components",
    "utils": "@workspace/ui/lib/utils",
    "hooks": "@workspace/ui/hooks",
    "lib": "@workspace/ui/lib",
    "ui": "@workspace/ui/components"
  }
}
```

## Import patterns

**Inside `apps/web`** (app-local):
```tsx
import { Button } from "@/components/ui/button"   // via tsconfig paths or package imports
```

**Cross-workspace** (shared primitives):
```tsx
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
```

**Inside `packages/ui`**:
- Uses workspace's own `exports` field for shared sub-paths (`@workspace/ui/components`, `@workspace/ui/lib`, `@workspace/ui/hooks`).
- The CLI handles import rewriting automatically (CLI v4).

## CLI commands (CLI v4, March 2026)

```bash
# Scaffold a monorepo project (one-time):
npx shadcn@latest init --monorepo

# Add a primitive to packages/ui (run from apps/web):
cd apps/web
npx shadcn@latest add button          # installs to packages/ui, rewrites imports
npx shadcn@latest add card            # same
npx shadcn@latest add login-01       # block: installs primitives to ui + form to apps/web/components

# Preview before writing:
npx shadcn@latest add button --dry-run
npx shadcn@latest add button --diff
npx shadcn@latest add button --view

# New presets (pack design system config into a code):
npx shadcn@latest init --preset a1Dg5eFl

# AI-agent context:
npx skills add shadcn/ui              # installs shadcn/skills
```

## Tailwind v4 specifics

1. **`tailwind.config` MUST be empty** in both `components.json` files. v4 uses CSS-first config (`@theme inline` directives), no `tailwind.config.ts`.
2. **`globals.css` location matters.** v4 imports Tailwind via `@import "tailwindcss"` at the top of `globals.css`. In the monorepo, `packages/ui/src/styles/globals.css` is the source, and apps import it.
3. **CSS variables via `@theme inline`.** All shadcn v4 components read from CSS variables (`--background`, `--foreground`, etc.) for per-tenant theming. This matches our existing `01-stack/tailwind-shadcn.md` per-tenant theming plan.
4. **Shared `globals.css`** is imported once per app (in `app/layout.tsx`). The CSS gets processed by Tailwind's content scanner for both `apps/web/**` and `packages/ui/**`.

## Requirements (verbatim from docs)

> 1. Every workspace must have a `components.json` file. A `package.json` file tells npm how to install the dependencies. A `components.json` file tells the CLI how and where to install components.
> 2. The `components.json` file must properly define aliases for the workspace. This tells the CLI how to import components, hooks, utilities, etc.
> 3. Ensure you have the same `style`, `iconLibrary` and `baseColor` in both `components.json` files.
> 4. For Tailwind CSS v4, leave the `tailwind` config empty in the `components.json` file.

## pnpm workspace specifics

- `apps/web` depends on `@workspace/ui` via `workspace:*` in `package.json`.
- `packages/ui/package.json` exports its sub-paths via the `exports` field:
  ```jsonc
  {
    "name": "@workspace/ui",
    "exports": {
      "./components/*": "./src/components/*",
      "./lib/*": "./src/lib/*",
      "./hooks/*": "./src/hooks/*"
    }
  }
  ```
- The `tsconfig.json` paths alias (or `package.json#imports`) backs the `@workspace/ui/...` imports at runtime.
- `@radix-ui/*`, `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react` are all dependencies of `@workspace/ui` (not the app). Apps don't install them directly.

## Vercel-deploy implications

- `apps/web` is the deploy unit. `@workspace/ui` is bundled in (Next.js handles the workspace package via the `transpilePackages` option in `next.config.ts`, default in Next 13+).
- For Vercel monorepo projects: set Root Directory to `apps/web`, install command uses `pnpm install`, build command `pnpm --filter web build` (or just `next build`).

## DeesseJS context

- Our `apps/template/apps/web` is currently a create-next-app scaffold with no shadcn yet.
- `packages/ui` is listed in `pnpm-workspace.yaml` but EMPTY (no code, no package.json).
- `apps/template/packages/auth/src/auth.ts:54` already uses `deessejs.com`-style config; same for `packages/mail/config.ts`.
- Our docs already reference `01-stack/tailwind-shadcn.md` (the rationale) but no architecture doc on the monorepo layout itself.

## How to apply (when user asks "add shadcn to the template")

1. `cd apps/template/apps/web && npx shadcn@latest init --monorepo` — but adapt to our existing `apps/template/` structure (the CLI defaults to Turborepo + workspaces at the same level).
2. Probably need to do it manually: scaffold `packages/ui/` from the CLI's template, then write `components.json` for both workspaces.
3. Add `@deessejs/ui: workspace:*` to `apps/template/apps/web/package.json`.
4. Configure `apps/web/tsconfig.json` paths to map `@deessejs/ui/*`.
5. Test with one primitive (`button`) before bulk-adding.
6. Document in `documents/internal/architecture/11-packages/ui/README.md` (new package doc).

## Sources (verified 2026-06-23 via fresh)

- [shadcn/ui Monorepo docs](https://ui.shadcn.com/docs/monorepo)
- [shadcn/ui Package Imports docs](https://ui.shadcn.com/docs/package-imports)
- [shadcn/ui components.json docs](https://ui.shadcn.com/docs/components-json)
- [shadcn/ui Tailwind v4 docs](https://ui.shadcn.com/docs/tailwind-v4)
- [shadcn CLI v4 changelog (March 2026)](https://ui.shadcn.com/docs/changelog/2026-03-cli-v4)