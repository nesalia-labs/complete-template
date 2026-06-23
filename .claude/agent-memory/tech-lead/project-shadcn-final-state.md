---
name: project-shadcn-final-state
description: Final state of shadcn/ui in apps/template — Base UI choice, the @source path trap that took 2 hours to find, and the test page that validates it
metadata:
  type: project
---

Final working state of `apps/template` shadcn setup as of 2026-06-23. Built incrementally across 3 sessions.

## Critical path that took 2 hours to debug

**The `@source` paths in `packages/ui/src/styles/globals.css` MUST use 4 ups, not 3.**

The shadcn-ui monorepo scaffold generates paths like `@source "../../../apps/**"` because their `packages/ui/` is at the root of a flat monorepo. **Our `packages/ui/` is at `apps/template/packages/ui/`** (one level deeper) — so we need `../../../../apps/**` (4 ups) to reach the monorepo root.

```css
/* packages/ui/src/styles/globals.css — CORRECT paths for our structure */
@source "../../../../apps/**/*.{ts,tsx}";      /* 4 ups → apps/template/apps/ */
@source "../../../../components/**/*.{ts,tsx}";  /* 4 ups → apps/template/components/ (if it exists) */
@source "../../**/*.{ts,tsx}";                  /* 2 ups → packages/ui/src/ (scans itself) */
```

If the third path is wrong, Tailwind v4 doesn't scan `button.tsx` and the CSS only contains `transition-colors` + a few base utilities. All the shadcn component utilities (`bg-primary`, `hover:bg-primary/90`, `data-open:animate-in`, etc.) are missing.

## The Base UI decision (made implicitly by the shadcn CLI)

When we ran `pnpm dlx shadcn@latest add select dialog`, the CLI **overwrote our `button.tsx` (which used Radix Slot) with the new Base UI version**. The new shadcn v4 components use `@base-ui/react/select`, `@base-ui/react/dialog` etc. — NOT `@radix-ui/react-*`.

**Consequences**:
- We have `@base-ui/react@^1.6.0` in `packages/ui/package.json` deps
- Components use the `data-open` / `data-closed` data attributes (Base UI) instead of `data-[state=open]` (Radix)
- The `render={<Button />}` prop pattern replaces Radix's `asChild={<Slot />}`
- Our shadcn/tailwind.css `@custom-variant data-open` matches BOTH Base UI and Radix patterns, so animations work for both

**If we wanted to stay on Radix**: don't use `shadcn add` — manually copy component sources. Or use `shadcn@3.x` (legacy). But shadcn v4 is the present and future.

**Reference architecture**: supastarter (the closest reference, see `reference-supastarter-mailing-pattern.md`) has also migrated to Base UI in their 2026 templates.

## What the test page (`apps/web/src/app/page.tsx`) does

After we got the dev server running, the test page includes:
- `animate-in fade-in-0 zoom-in-95 duration-500` on the `<main>` — validates that tw-animate-css is being processed
- 2 Buttons — validates `transition-colors` and `hover:bg-primary/90` work
- A `Select` with 3 options — validates `data-open:animate-in`, `data-open:fade-in-0`, `data-open:zoom-in-95` work when opening
- A `Dialog` with Trigger + Content + Close — validates the same data-state animations for the overlay + content

This page serves as a permanent smoke test. If shadcn breaks in the future (e.g. after a Tailwind v4 minor upgrade), the user can run `pnpm dev` and see which animations are missing.

## File state (as of 2026-06-23)

**packages/ui/src/components/** (in `apps/template/packages/ui/`):
- `button.tsx` — Base UI, has `transition-all`, hover variants
- `select.tsx` — Base UI Select with `data-open:animate-in` etc.
- `dialog.tsx` — Base UI Dialog with same animation pattern
- (utils.ts in src/lib/, Wrapper in src/styles/ — unchanged)

**packages/ui/src/styles/globals.css**:
- Imports order: `tailwindcss` → `shadcn/tailwind.css` → `tw-animate-css`
- 3 `@source` directives with 4-ups paths
- `@layer base { * { @apply border-border outline-ring/50; } body { @apply bg-background text-foreground; } }` at the end

**packages/ui/package.json** deps:
- `@base-ui/react@^1.6.0` ← new
- `@radix-ui/react-slot@^1.2.3` ← only because the ORIGINAL button.tsx used Slot (now overwritten by shadcn)
- `class-variance-authority`, `clsx`, `tailwind-merge`, `tw-animate-css`, `lucide-react@^1.21.0`, `next-themes@^0.4.6`, `shadcn@^4.11.0`

**apps/web/src/app/globals.css**:
- Just `@import "tailwindcss";` then `@import "@deessejs/ui/globals.css";` then a small `@theme inline` for fonts
- No `@source` here (those live in packages/ui, see above)

**apps/web/postcss.config.mjs**:
- Just `export { default } from "@deessejs/ui/postcss.config";` (re-export)
- The actual PostCSS plugin (`@tailwindcss/postcss`) is defined in `packages/ui/postcss.config.mjs`

**apps/web/next.config.ts**:
- `transpilePackages: ["@deessejs/ui"]` — REQUIRED for Radix/Base UI to resolve through pnpm symlink

**apps/web/components/theme-provider.tsx**:
- Created during the diagnostic session
- Wraps `next-themes` ThemeProvider for dark mode

**apps/web/components.json**:
- `style: base-nova`
- Points to `../../packages/ui/src/styles/globals.css`
- `ui: @deessejs/ui/components`

**apps/web/tsconfig.json**:
- `@/*: ["./*"]` for app-local imports
- `@deessejs/ui/*: ["../../packages/ui/src/*"]` for workspace imports

## Pitfalls encountered (now documented in code comments)

1. **The `@source` path trap** (above) — `#1 cause of the "page noire" bug
2. **Body styles missing without `@layer base { body { @apply bg-background text-foreground; } }`** — second cause
3. **The `asChild` pattern doesn't exist in Base UI** — use `render={<Component />}` instead
4. **shadcn CLI doesn't auto-install deps** — if a component imports `@base-ui/react` and you don't have it, build fails with `Module not found`. Add deps manually.
5. **shadcn CLI overwrites files silently** — `button.tsx` was overwritten by `shadcn add select dialog`. Read the CLI output for "Created 3 files" clues.
6. **Browser cache masks CSS fixes** — user must hard refresh (Cmd+Shift+R / Ctrl+Shift+R) to see new CSS.

## How to apply (next session)

When working on this stack:
- Read this file FIRST to know the current state.
- When shadcn breaks, check the 6 pitfalls above before debugging.
- If the test page in `page.tsx` stops showing animations, that's the canary — diff against this memory.
- The `@source` paths are FRAGILE — if anyone restructures `apps/template/`, they need to re-verify the 4-up paths.

## Related memories

- [[reference-shadcn-monorepo]] — the happy path (CLI v4, 2 components.json, import patterns)
- [[reference-shadcn-monorepo-pitfalls]] — 10 real-world bugs to avoid
- [[reference-shadcn-monorepo-best-practices]] — theming, testing, deps, setup templates
- [[project-shadcn-monorepo-bootstrap-plan]] — the manual setup plan
- [[project-package-implementation-state]] — overall DeesseJS package state

## Source of truth

`temp/next-monorepo/` (the official `shadcn init --monorepo` scaffold). Not deleted per user request. Use it as a reference when this stack drifts.