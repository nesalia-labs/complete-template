---
name: reference-shadcn-monorepo-pitfalls
description: Real-world problems and solutions for shadcn/ui in monorepos (verified 2026-06-23 from GitHub issues, Nx guide, Tailwind v4 discussion)
metadata:
  type: reference
---

Concrete pitfalls people hit when using shadcn/ui in a monorepo, with the actual fixes that worked. Companion to [[reference-shadcn-monorepo]] which covers the happy path.

## Pitfall #1 — Tailwind v4 doesn't scan cross-package sources by default

**Symptoms**: shadcn primitives render without styles. Destructive button has white text on white background. `bg-destructive` not in the generated CSS.

**Root cause** (per [Tailwind v4 Discussion #19314](https://github.com/tailwindlabs/tailwindcss/discussions/19314) + [shadcn-ui #6878](https://github.com/shadcn-ui/ui/issues/6878)): Tailwind v4 uses **automatic content detection** from CSS imports. It scans the import graph of the CSS entry, NOT the `content` field in `tailwind.config.ts`. When `packages/ui` has no CSS import of its own (just components that use Tailwind classes), those classes are invisible to the Tailwind instance in `apps/web`.

**Fix** (confirmed by `wongjn`, Tailwind maintainer, in #19314 — *marked as the official answer*):

In `apps/web/src/app/globals.css` (the file `apps/web`'s `components.json` points to):

```css
@import 'tailwindcss';

/* CRITICAL: must be immediately after @import 'tailwindcss' (per #6878 comment) */
@source "../../../packages/ui/src/**/*.{ts,tsx}";
```

**Two key details from the bug threads**:
1. **`@source` must come RIGHT AFTER `@import 'tailwindcss'`**. If you put other `@import` (like `@import "tw-animate-css"`) between them, scanning breaks silently. Order matters.
2. **Don't add a `tailwind.config.ts` to opt into v3-style `content`**. v4 deliberately ignores `content` unless you explicitly `@config "./tailwind.config.ts"`. Stay on v4 patterns.

**Symptom → root cause → fix**:
- Symptom: styles missing on shadcn primitives → root cause: @source not in globals.css OR wrong order → fix: add `@source` immediately after `@import 'tailwindcss'`.

Sources: [tailwindlabs/tailwindcss #19314](https://github.com/tailwindlabs/tailwindcss/discussions/19314), [shadcn-ui #6878](https://github.com/shadcn-ui/ui/issues/6878) (with the `brettpostin` comment about order).

---

## Pitfall #2 — shadcn CLI generates wrong `@source` paths in monorepo `globals.css`

**Symptoms**: After `npx shadcn@latest init --monorepo`, the generated `packages/ui/src/styles/globals.css` has:
```css
@source "../../../apps/**/*.{ts,tsx}";   /* WRONG — only goes up to packages/ */
```

**Root cause** ([shadcn-ui #7821](https://github.com/shadcn-ui/ui/issues/7821), open since 2025-07-15): The CLI calculates the relative path wrong. From `packages/ui/src/styles/`, `../../../` lands on `packages/`, not the monorepo root. Should be `../../../../`.

**Fix**: Manually correct the paths in `packages/ui/src/styles/globals.css`:
```css
@source "../../../../apps/**/*.{ts,tsx}";
@source "../../../../components/**/*.{ts,tsx}";
```

The user who reported this also says "Removing the 2 sources seems to have no effect on tailwind ability to detect classes in those folders" — so the CLI-generated `@source` lines in `packages/ui/globals.css` may be dead code anyway. The active scanning happens in `apps/web/globals.css` (see Pitfall #1).

**Status**: Issue still open as of 2026-06-23. No commit has fixed it.

---

## Pitfall #3 — Multiple `globals.css` files in the monorepo, only one gets edited

**Symptoms**: Run `npx shadcn@latest add button`, the CLI says "updating 2 globals.css files" but only one actually gets updated.

**Root cause** ([shadcn-ui #8697](https://github.com/shadcn-ui/ui/issues/8697), open since 2025-11-03): The CLI is confused by having `globals.css` in both `apps/web` and `packages/ui`. With Vite/TanStack Start, the behavior is especially broken.

**Fix / workaround**:
1. Keep **`packages/ui/src/styles/globals.css` as the SOURCE of truth** for Tailwind base (the `@theme` variables, `@import "tailwindcss"`, `@source` directives).
2. **`apps/web/src/app/globals.css` should ONLY `@import` it**: `@import "@workspace/ui/globals.css";` (using the workspace import alias, not a relative path).
3. Don't try to keep two `globals.css` in sync — pick one owner.

In our case: `packages/ui/src/styles/globals.css` owns everything. `apps/web/src/app/globals.css` just re-exports it. Cleaner.

---

## Pitfall #4 — `apps/web` doesn't have `@tailwindcss/postcss` even though the workspace does

**Symptoms**: `next dev` fails with `Can't find @tailwindcss/postcss` even though `packages/ui` has it as a dependency.

**Root cause** ([shadcn-ui #8697](https://github.com/shadcn-ui/ui/issues/8697)): Next.js PostCSS resolves plugins from the **consuming app's** `node_modules`, not the workspace's. The init scaffold expects you to also install Tailwind/PostCSS in `apps/web`.

**Fix**: Install Tailwind v4 in BOTH `apps/web/package.json` AND `packages/ui/package.json`:
```jsonc
// apps/web/package.json
"devDependencies": {
  "@tailwindcss/postcss": "^4.0.0",
  "tailwindcss": "^4.0.0"
}
// packages/ui/package.json
"devDependencies": {
  "tailwindcss": "^4.0.0"   // no postcss needed — only the app uses PostCSS
}
```

This is "wasteful" but necessary. It's how the shadcn monorepo template ships.

---

## Pitfall #5 — Nx + Tailwind v4 + Next.js 15 styles missing

**Symptoms**: With Nx monorepo, importing `Button` from `@myorg/ui` renders without styles.

**Root cause** ([shadcn-ui #7828](https://github.com/shadcn-ui/ui/issues/7828), closed as completed 2025-07-17): Nx has its own way of handling workspace imports that bypasses the standard shadcn config. The package's `styles.css` wasn't being applied.

**Fix** (per the issue's resolution): In Nx projects, `apps/web/styles.css` must explicitly `@import "@myorg/ui/styles.css";` (not relative). Plus the `@source` directive from Pitfall #1.

For our `apps/template/` (not Nx, just pnpm workspace): this caveat doesn't apply directly. But the lesson is: **always import the shared CSS via the workspace alias, never relative**.

---

## Pitfall #6 — vite/turbopack vs Next.js bundler differences

**Symptoms**: Works in `apps/web` (Next.js) but not in `apps/docs` (Vite + React Router) — or vice versa.

**Root cause**: Tailwind v4 uses different integrations per bundler:
- **Next.js**: `@tailwindcss/postcss` plugin in `postcss.config.mjs`
- **Vite**: `@tailwindcss/vite` plugin in `vite.config.ts`
- **Turbopack** (Next.js 16 default): has its own Tailwind v4 support, slightly different config

**Fix for our setup** (Next.js 16 + Turbopack by default):
- `apps/web/postcss.config.mjs` with `@tailwindcss/postcss` plugin (mirrors what we already have)
- The Tailwind v4 scanner reads through the PostCSS plugin → scans the CSS imports → finds `@source` directives → outputs the final CSS

---

## Pitfall #7 — `tw-animate-css` import order breaks scanning

**Symptoms**: Tailwind classes work, but the shadcn animations don't.

**Root cause** ([shadcn-ui #6878 comment by brettpostin](https://github.com/shadcn-ui/ui/issues/6878)): If `@import "tw-animate-css"` is placed BETWEEN `@import "tailwindcss"` and `@source`, scanning silently fails.

**Fix** (verbatim from the bug):
```css
/* Works */
@import "tailwindcss";
@source "../../../packages/ui/src/**/*.{ts,tsx}";
@import "tw-animate-css";

/* Does NOT work */
@import "tailwindcss";
@import "tw-animate-css";
@source "../../../packages/ui/src/**/*.{ts,tsx}";
```

**Rule**: All `@source` directives must come immediately after `@import "tailwindcss"`, before any other `@import`.

---

## Pitfall #8 — `tailwind.config.ts` left over from v3 causes confusion

**Symptoms**: Half the team thinks we're using v3 patterns. Content scanning doesn't pick up everything. Classes work in `apps/web` but not from `packages/ui`.

**Root cause**: If a `tailwind.config.ts` exists with `content: [...]`, v4 picks it up via `@config` only if you explicitly reference it. Without `@config`, the config file is ignored. This creates ambiguity.

**Fix**: **Delete any `tailwind.config.ts` for v4 projects.** All config goes in `globals.css` via `@theme inline { ... }`. If you absolutely need JS config (e.g., for a plugin that only has a JS API), reference it explicitly:
```css
@import "tailwindcss";
@config "../../tailwind.config.ts";
```

For us: we're v4-only. **No `tailwind.config.ts` in `apps/template/`.** Verified 2026-06-23.

---

## Pitfall #9 — `lucide-react` bundle size in shared UI

**Symptoms**: Every shadcn primitive imports `lucide-react`. The `packages/ui` bundle grows linearly with the number of icons used.

**Root cause** (community finding, not a specific GitHub issue): `lucide-react` tree-shakes well, but if you `import { Icon } from 'lucide-react'` from `packages/ui` and the consumer doesn't have the right `lucide-react` version, you get duplicate copies.

**Fix**: Pin `lucide-react` to the same version in BOTH `apps/web` and `packages/ui`:
```jsonc
// Both packages: same version
"dependencies": {
  "lucide-react": "^0.469.0"
}
```

Plus: in `packages/ui`, re-export only the icons you need from `src/icons.ts`, not the whole `lucide-react` library. Reduces accidental bundling.

---

## Pitfall #10 — `radix-ui` packages transitive deps mismatch

**Symptoms**: `Module not found: Can't resolve '@radix-ui/react-dialog'` at build time in `apps/web` despite `packages/ui` exporting Dialog.

**Root cause**: shadcn components import individual `@radix-ui/react-*` packages. If `apps/web` doesn't have them in its `node_modules` (because pnpm hoisted them under `packages/ui/node_modules` instead of the root), the bundler can't find them.

**Fix**: In `apps/web/package.json`, declare the Radix deps you actually use as **direct dependencies**:
```jsonc
{
  "dependencies": {
    "@radix-ui/react-dialog": "^1.1.0",
    "@radix-ui/react-dropdown-menu": "^2.1.0",
    // ... every Radix primitive used by any shadcn component
  }
}
```

Yes, this is duplication. Yes, pnpm is supposed to hoist. In practice, Next.js + Turbopack bundling needs the direct dep to find it. Annoying but real.

Alternative: use `transpilePackages: ['@workspace/ui']` in `next.config.ts` (Next.js default in 13+) — this makes Next.js bundle `packages/ui` and resolve its transitive deps from inside the package. Often works without the explicit deps.

For our setup: **use `transpilePackages: ['@deessejs/ui']`** in `apps/web/next.config.ts`. Cleaner than declaring 20 Radix packages.

---

## Summary table

| # | Pitfall | Severity | Fix complexity |
|---|---|---|---|
| 1 | Tailwind v4 doesn't scan cross-package | **Critical** — silent style loss | 1 line in globals.css |
| 2 | CLI generates wrong `@source` paths | Low (cosmetic in packages/ui) | Manual edit |
| 3 | Two `globals.css` files, only one edits | Medium — confusing | Pick one owner |
| 4 | `apps/web` missing `@tailwindcss/postcss` | **High** — dev server crashes | Install in both |
| 5 | Nx-specific issues | N/A for us (pnpm not Nx) | — |
| 6 | Bundler differences (Next vs Vite) | Low (we're Next-only) | — |
| 7 | `@import` order with `@source` | Medium — silent | Order matters |
| 8 | Leftover v3 `tailwind.config.ts` | Low — confusion | Delete |
| 9 | `lucide-react` version drift | Low — bundle size | Pin both |
| 10 | Radix transitive dep mismatch | **High** — build fails | `transpilePackages` |

## Final recommended setup for `apps/template/`

Based on all the above:

```
apps/template/
├── apps/web/
│   ├── package.json              # @deessejs/ui + @tailwindcss/postcss + tailwindcss (dev)
│   ├── next.config.ts            # transpilePackages: ['@deessejs/ui']
│   ├── postcss.config.mjs        # @tailwindcss/postcss plugin
│   ├── components.json           # style: new-york, iconLibrary: lucide, css: src/app/globals.css
│   └── src/app/
│       ├── globals.css          # @import "tailwindcss"; @source "../../../packages/ui/src/**/*"; @import "tw-animate-css";
│       └── ...
├── packages/ui/                  # NEW package, currently empty
│   ├── package.json              # workspace name "@deessejs/ui", lucide-react dep
│   ├── components.json           # same style/iconLibrary/baseColor
│   └── src/
│       ├── components/           # button.tsx, card.tsx, etc.
│       ├── hooks/
│       ├── lib/
│       │   └── utils.ts          # cn() helper
│       └── styles/
│           └── globals.css       # @import "tailwindcss"; @theme inline { ... }; @source "../../../apps/**/*";
└── pnpm-workspace.yaml           # already has packages/*
```

**Order of imports in `apps/web/globals.css` (CRITICAL)**:
```css
@import "tailwindcss";
@source "../../../packages/ui/src/**/*.{ts,tsx}";
/* any other @source first */
@import "tw-animate-css";
```

## Sources (verified 2026-06-23 via fresh)

- [shadcn-ui #6878 — Tailwind 4 classes missing when using shadcn from monorepo](https://github.com/shadcn-ui/ui/issues/6878) — the canonical bug thread, 12+ comments with workarounds
- [shadcn-ui #7821 — Incorrect @source paths in monorepo globals.css template](https://github.com/shadcn-ui/ui/issues/7821) — CLI bug, still open
- [shadcn-ui #7828 — ShadCN UI styles not working in Nx Monorepo with Tailwind v4](https://github.com/shadcn-ui/ui/issues/7828) — closed as completed
- [shadcn-ui #8697 — Monorepo setup with shadcn cli doesnt work with vitest or next](https://github.com/shadcn-ui/ui/issues/8697) — open, mostly Vite-specific
- [tailwindlabs/tailwindcss #19314 — content scanning doesn't work with cross-package paths](https://github.com/tailwindlabs/tailwindcss/discussions/19314) — official answer from `wongjn` (Tailwind maintainer)
- [Nx blog — Configure Tailwind 4 with Vite in an NPM Workspace](https://nx.dev/blog/setup-tailwind-4-npm-workspace) — Juri Strumpflohner's deep dive
- shadcn/ui official Monorepo docs (https://ui.shadcn.com/docs/monorepo)

## How to apply

When you (or the user) start scaffolding `packages/ui`:
1. Read this file FIRST — 80% of common pitfalls are here.
2. Start with one primitive (`button`) to validate the wiring before bulk-adding.
3. Use `pnpm --filter @deessejs/web dev` and check that the button has the destructive variant's red bg.
4. If styles missing: check `globals.css` order (Pitfall #1, #7).
5. If build crash: check `transpilePackages` (Pitfall #10).