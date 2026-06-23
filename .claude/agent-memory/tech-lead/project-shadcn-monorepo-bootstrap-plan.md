---
name: project-shadcn-monorepo-bootstrap-plan
description: Plan to bootstrap shadcn/ui in our existing apps/template/ monorepo when we can't use `init --monorepo` (because project already exists). Manual setup based on docs.
metadata:
  type: project
---

Decision context (2026-06-23): the official `npx shadcn@latest init --monorepo` creates a NEW monorepo from scratch. Our `apps/template/` already exists (nested pnpm workspace, apps/web scaffolded, packages/ui empty). Can't use the monorepo scaffold — must do manual setup. The `add` command still works on existing projects once `components.json` is in place.

## Two paths considered

### Path A — Hybrid: `shadcn init` (no --monorepo) + manual `packages/ui` scaffold

1. `cd apps/template/apps/web && npx shadcn@latest init` — bootstraps shadcn into the existing Next.js app. The CLI creates `components.json`, installs Tailwind plugins, writes `lib/utils.ts` and updated `globals.css`.
2. Manually create `apps/template/packages/ui/{package.json, components.json, src/}` based on our research.
3. Use `pnpm --filter @deessejs/web dlx shadcn@latest add button -c ../../packages/ui` to add primitives to packages/ui.

**Pros**: Less manual config for apps/web (CLI handles Tailwind setup).
**Cons**: CLI may try to overwrite existing files (`apps/web/src/app/page.tsx`, `layout.tsx`, etc.). May force `new-york` style, `neutral` color, etc. — possibly clashing with the Geist fonts setup. Issue #4752 documents "Cannot initialize components.json using init after manual installation".

### Path B — Fully manual

Write every config file based on:
- shadcn/ui Manual Installation docs (https://ui.shadcn.com/docs/installation/manual)
- Our research (3 memory files: `reference-shadcn-monorepo*.md`)
- Then use `add` for primitives only.

**Pros**: Total control, no surprises from the CLI, no overwrite risk.
**Cons**: More work up front (~15 files to write by hand).

## Recommended path: **B (fully manual)**

Reasoning:
1. We already have a research-grade plan (3 memories) covering every detail.
2. Our `apps/template/apps/web/` has specific config (Tailwind 4, Geist fonts, no `globals.css` yet besides the default Tailwind import) — the CLI's `init` would clobber or add to this in unexpected ways.
3. The CLI's `add` command is the value — it copies the latest primitive source code + rewrites imports. We want to USE it for primitives, AVOID it for scaffolding.
4. The "manual installation" doc (https://ui.shadcn.com/docs/installation/manual) is the canonical reference for our exact scenario.

## Files to create (manual setup, in order)

### A. `packages/ui/` package scaffold

1. `apps/template/packages/ui/package.json` — name `@deessejs/ui`, all 22 deps (Radix, CVA, tailwind-merge, lucide-react, next-themes, etc.), exports field, scripts (test, lint, typecheck)
2. `apps/template/packages/ui/tsconfig.json` — extends root tsconfig.base.json
3. `apps/template/packages/ui/components.json` — package-side config (aliases to `@workspace/ui/components`, etc.)
4. `apps/template/packages/ui/vitest.config.ts` — jsdom + globals: true + setupFiles
5. `apps/template/packages/ui/src/test/setup.ts` — Radix polyfills (hasPointerCapture, etc.)
6. `apps/template/packages/ui/src/lib/utils.ts` — `cn()` helper (clsx + tailwind-merge)
7. `apps/template/packages/ui/src/styles/globals.css` — full token set, light + dark, @theme inline, OKLCH colors, radius scale
8. `apps/template/packages/ui/src/index.ts` — public surface (re-exports of components, hooks, lib)

### B. `apps/web/` updates

9. `apps/template/apps/web/components.json` — app-side config (style: new-york, baseColor: neutral, css path points to packages/ui/src/styles/globals.css)
10. Update `apps/template/apps/web/package.json` — add `@deessejs/ui: workspace:*` in deps, `@tailwindcss/postcss` + `tailwindcss` in devDeps
11. Update `apps/template/apps/web/next.config.ts` — add `transpilePackages: ['@deessejs/ui']`
12. Update `apps/template/apps/web/src/app/globals.css` — REPLACE the existing default with:
    ```css
    @import "tailwindcss";
    @source "../../../packages/ui/src/**/*.{ts,tsx}";  /* CRITICAL order */
    @import "shadcn/tailwind.css";                      /* Radix data-* variants */
    @import "tw-animate-css";
    ```

### C. Root + monorepo level

13. Run `pnpm install` from `apps/template/` to pick up the new dep
14. Run `pnpm --filter @deessejs/web dlx shadcn@latest add button -c ../../packages/ui` to add the first primitive via the CLI
15. Verify by importing `@deessejs/ui/components/button` in a test page

### D. Verification

16. Add `<Button variant="destructive">Test</Button>` in `apps/web/src/app/page.tsx`
17. Run `pnpm --filter @deessejs/web dev`, open localhost:3000
18. Verify: the button has a red background (if missing, check globals.css `@source` order — see [[reference-shadcn-monorepo-pitfalls]])

## Critical learnings from research (applied to this plan)

From [[reference-shadcn-monorepo-pitfalls]]:

- **Pitfall #1 (critical)**: `@source` must come RIGHT AFTER `@import "tailwindcss"`. Other `@import` (like `tw-animate-css`) must come AFTER all `@source` directives.
- **Pitfall #3 (medium)**: Keep `packages/ui/src/styles/globals.css` as the SOLE owner of shadcn tokens. `apps/web/src/app/globals.css` re-exports it.
- **Pitfall #4 (high)**: `apps/web` needs `@tailwindcss/postcss` AND `tailwindcss` as devDeps. Not just in packages/ui.
- **Pitfall #7 (medium)**: `@import "shadcn/tailwind.css"` order matters. Put it AFTER `@source` directives, same family as other imports.
- **Pitfall #10 (high)**: `transpilePackages: ['@deessejs/ui']` is REQUIRED. Without it, Radix dep resolution fails in apps/web.

From [[reference-shadcn-monorepo-best-practices]]:

- § 6 has the full `package.json` deps list (22 entries)
- § 7 has the full `globals.css` template (light + dark + tokens + radius scale)
- § 8 has the 11-point checklist before scaffolding

## New finding: `shadcn` npm package (not just CLI)

The npm package `shadcn@4.10.0` (5.3M weekly downloads, June 2026) is NOT just the CLI. It exports:
- `.` — CLI entry
- `./registry`, `./schema`, `./mcp`, `./utils`, `./icons`, `./preset` — module exports
- `./tailwind.css` — **CRITICAL**: contains `@custom-variant data-open`, `data-closed`, `data-checked`, `data-unchecked` etc. These are required for Radix-based primitives to style their open/closed/checked states correctly.

**Without `@import "shadcn/tailwind.css"` in globals.css**: dropdowns won't visually open, dialogs won't toggle their state styling, checkboxes won't show the checked visual, etc. Components render but their interactive states are invisible.

So `packages/ui/package.json` must add `"shadcn": "^4.10.0"` as a regular dependency (not just for the CLI).

This was a 2026 addition not in older shadcn docs. Confirmed via direct fetch of `https://cdn.jsdelivr.net/npm/shadcn@4.10.0/dist/tailwind.css` (2026-06-23).

## Sources

- [shadcn/ui Manual Installation docs](https://ui.shadcn.com/docs/installation/manual) — the exact file list we need to create
- [shadcn/ui Theming docs](https://ui.shadcn.com/docs/theming) — full token list
- [shadcn/npm `shadcn` package](https://www.npmjs.com/package/shadcn) — confirms `shadcn/tailwind.css` export
- [[reference-shadcn-monorepo]] — happy path
- [[reference-shadcn-monorepo-pitfalls]] — 10 real bugs to avoid
- [[reference-shadcn-monorepo-best-practices]] — full setup templates

## Open question (to decide before starting)

**Path A (hybrid with `init`)** vs **Path B (fully manual)**? My recommendation is **B** based on the analysis above. If the user disagrees, can switch.

## How to apply

When the user says "let's scaffold packages/ui":
1. Read this file.
2. Create files 1-8 (packages/ui scaffold) — uses templates from [[reference-shadcn-monorepo-best-practices]] §6, §7.
3. Update files 9-12 (apps/web updates).
4. `pnpm install`.
5. Run `pnpm --filter @deessejs/web dlx shadcn@latest add button -c ../../packages/ui` — first primitive via CLI.
6. Add a button to `apps/web/src/app/page.tsx`, run dev server, verify the red destructive bg appears.
7. If styles missing → debug with the checklist in [[reference-shadcn-monorepo-pitfalls]].
8. Once verified, bulk-add other primitives (`card`, `dialog`, `dropdown-menu`, `input`, `label`, `select`, etc.).