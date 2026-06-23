---
name: reference-shadcn-monorepo-best-practices
description: shadcn/ui in monorepo — best practices, testing setup, theming, dependency pinning, transpilePackages deep-dive (verified 2026-06-23)
metadata:
  type: reference
---

Best practices, testing, theming, and dependency management for shadcn/ui in a monorepo. Companion to [[reference-shadcn-monorepo]] (happy path) and [[reference-shadcn-monorepo-pitfalls]] (bugs to avoid).

## 1. Dark mode + per-tenant theming

### Standard dark mode (light/dark/system)

shadcn uses `next-themes` + CSS variables + `.dark` class. The pattern is documented and battle-tested.

```tsx
// packages/ui/src/components/theme-provider.tsx
"use client"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
```

```tsx
// apps/web/src/app/layout.tsx
import { ThemeProvider } from "@deessejs/ui/components/theme-provider"

<html lang="en" suppressHydrationWarning>
  <body>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  </body>
</html>
```

```css
/* packages/ui/src/styles/globals.css */
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  /* ... light tokens ... */
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  /* ... dark tokens ... */
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
}
```

**Critical**: `suppressHydrationWarning` on `<html>` is **required** because next-themes sets `.dark` client-side, causing a brief mismatch with the server-rendered HTML.

### Per-tenant theming (multi-tenant SaaS — DeesseJS feature 10.5)

Same pattern, but with `data-theme` attribute set per-tenant:

```tsx
// app/(app)/[orgSlug]/layout.tsx
import { headers } from "next/headers"

export default async function OrgLayout({ children, params }) {
  const { orgSlug } = await params
  const org = await getOrgTheme(orgSlug)
  return (
    <html lang="en" data-theme={org.themeKey} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
```

```css
/* packages/ui/src/styles/globals.css */
:root {
  --primary: oklch(0.205 0 0);   /* default DeesseJS */
  --primary-foreground: oklch(0.985 0 0);
}

[data-theme="org-acme"] {
  --primary: oklch(0.5 0.2 240);  /* Acme's brand blue */
  --primary-foreground: oklch(1 0 0);
}

[data-theme="org-redflag"] {
  --primary: oklch(0.55 0.22 27);  /* red brand */
  --primary-foreground: oklch(1 0 0);
}
```

The component classes (`bg-primary`, `text-primary-foreground`) **don't change** — only the CSS variables do. Same shadcn primitives, infinite themes.

**Best practice**: Resolve the org's theme at the layout level (server component), not per-component. The data attribute cascades to all children via CSS variable inheritance.

---

## 2. Testing with Vitest

### Setup (`packages/ui/vitest.config.ts`)

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',  // or 'happy-dom' (faster, but less spec-compliant)
    globals: true,         // no need to import describe/it/expect
    setupFiles: ['./src/test/setup.ts'],
  },
})
```

### Setup file (`packages/ui/src/test/setup.ts`)

**Critical polyfills** for Radix UI components under jsdom/happy-dom:

```ts
import '@testing-library/jest-dom'  // adds toBeInTheDocument, toHaveClass, etc.

// Radix UI uses pointer events. jsdom/happy-dom don't fully support them.
// Without these polyfills: "target.hasPointerCapture is not a function"
if (!Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = vi.fn().mockReturnValue(false)
}
if (!Element.prototype.setPointerCapture) {
  Element.prototype.setPointerCapture = vi.fn()
}
if (!Element.prototype.releasePointerCapture) {
  Element.prototype.releasePointerCapture = vi.fn()
}
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = vi.fn()
}
```

> **Source**: [StackOverflow — hasPointerCapture not a function](https://stackoverflow.com/questions/79790413). This is the universal workaround — "everyone using Radix or shadcn in Vitest does something similar." Alternative is real-browser tests via Vitest browser mode or Playwright, but those are heavier.

### `userEvent` with Radix (also need)

```ts
// In tests for components that use pointer events
import userEvent from '@testing-library/user-event'

// pointerEventsCheck: 0 disables the check entirely (less safe but pragmatic)
const user = userEvent.setup({ pointerEventsCheck: 0 })
```

### Smoke test example

```tsx
// packages/ui/src/button.test.tsx
import { render, screen } from '@testing-library/react'
import { Button } from './button'

describe('Button component', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('applies default variant classes', () => {
    render(<Button>Test</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-primary')
  })
})
```

### Test command integration with monorepo

```jsonc
// packages/ui/package.json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "typecheck": "tsc --noEmit"
  }
}
```

Then root `pnpm --filter @deessejs/ui test` runs it. Vitest is the natural monorepo choice (Vite-native, fast TS support, integrates with Turborepo caching even if we're not on Turborepo).

---

## 3. `transpilePackages` deep-dive (Next.js 16)

### When you need it

From Next.js Discussion #93542 (answered by `icyJoseph` — Next.js maintainer, 2026-06-03):

| Situation | Need `transpilePackages`? |
|---|---|
| Local workspace package symlinked in `node_modules` | **Yes** — Next.js treats it as external, won't transpile by default |
| Local workspace package resolved as a relative file path | No — Next.js sees it as part of project root |
| Package contains `.css` files imported in components | **Yes** — Next.js throws "Global CSS cannot be imported from within node_modules" |
| Package needs different JSX/runtime config | **Yes** — force the transpiler to pass through |
| Package has no source, just compiled JS | No (it's already JS) |
| Package uses modern JS features not in browser target | **Yes** — to apply the transform |

**For our setup (`apps/template/` pnpm workspace)**:
- `packages/ui` is symlinked via pnpm into `apps/web/node_modules/@deessejs/ui`
- It contains `.tsx` source (raw TSX, not built)
- It imports `.css` from `packages/ui/src/styles/globals.css`
- It uses Radix UI (which itself uses `class-variance-authority` etc.)

→ **`transpilePackages: ['@deessejs/ui']` is REQUIRED.**

### What it does

`transpilePackages` tells Next.js: "Treat this specific `node_modules` entry as if it were part of my local app code." It applies the same SWC config (JSX transform, TS strip, target browsers) to the package's source.

### Performance implication

Per the Next.js docs, transpilation happens once at build time. There's a small per-package overhead. For a small `packages/ui`, this is negligible. For a monorepo with 20+ shared packages, the overhead adds up — but that's not our situation.

### Turbopack (Next.js 16 default)

Turbopack has its own workspace resolution and works similarly. The `transpilePackages` option is still respected. No special config needed for `packages/ui`.

### Configuration

```ts
// apps/web/next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@deessejs/ui'],
  // ... other config
}

export default nextConfig
```

---

## 4. Dependency version pinning

### The shared deps

`packages/ui` needs (as direct deps, not peer):

```jsonc
// packages/ui/package.json
{
  "dependencies": {
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.5",
    "lucide-react": "^0.469.0",
    "@radix-ui/react-slot": "^1.1.1"
    // ... one entry per Radix primitive you use
  },
  "peerDependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "tailwindcss": "^4.0.0"
  }
}
```

### Why these must be direct deps (not just transitive)

- `apps/web` doesn't need to install them directly IF pnpm hoists them to the root
- But Next.js + Turbopack sometimes can't find transitive deps that aren't in the app's `node_modules`
- **Safe pattern**: declare every Radix primitive you use as a direct dep in `packages/ui`. The bundle won't bloat (tree-shaking), but the build will succeed.

### `lucide-react` and version drift

If `apps/web` and `packages/ui` use different `lucide-react` versions:
- pnpm dedupes
- But icon imports might resolve to different versions
- Tree-shaking can produce different bundle sizes

**Best practice**: Pin the same version in BOTH `apps/web/package.json` and `packages/ui/package.json`. Add to root `pnpm-workspace.yaml` overrides if needed.

### `tailwind-merge`

The `cn()` helper in `packages/ui/src/lib/utils.ts` uses `tailwind-merge` to dedupe conflicting Tailwind classes:

```ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

Pin `tailwind-merge@^2.5.5` (or current latest) in `packages/ui`. Critical: it must support Tailwind v4 classes (`size-*`, OKLCH, etc.) — older versions don't.

### React 19 peer dep

shadcn v4 components are designed for React 19. The peer dep declaration:
```jsonc
"peerDependencies": {
  "react": "^19.0.0",
  "react-dom": "^19.0.0"
}
```

`apps/web` uses React 19.2.4. Compatible. ✓

### Tailwind v4 peer dep

```jsonc
"peerDependencies": {
  "tailwindcss": "^4.0.0"
}
```

This signals to consumers that they need Tailwind v4. `apps/web` has it. ✓

---

## 5. Production repo example (raptr45/turborepo-shadcn-starter, 2025-11)

A working production-style repo (Turborepo, not pnpm, but same shape):

```bash
# Add shared component to packages/ui (from repo root):
pnpm dlx shadcn@latest add button -c packages/ui

# Add app-scoped component to apps/web:
pnpm dlx shadcn@latest add login-form -c apps/web
```

**`-c` flag** = "components.json location" = tells the CLI which workspace to install to. This is the official way to do mixed-scope components in a monorepo.

For us: same flag works with our `apps/template/` workspace. `pnpm --filter @deessejs/web dlx shadcn@latest add <primitive> -c ../../packages/ui` (or set up `components.json` paths so the CLI auto-detects).

---

## 6. Recommended full `packages/ui/package.json` for DeesseJS

```jsonc
{
  "name": "@deessejs/ui",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    "./components/*": "./src/components/*",
    "./hooks/*": "./src/hooks/*",
    "./lib/*": "./src/lib/*",
    "./styles/*": "./src/styles/*"
  },
  "scripts": {
    "lint": "eslint src",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.5",
    "lucide-react": "^0.469.0",
    "next-themes": "^0.4.4",
    "@radix-ui/react-slot": "^1.1.1",
    "@radix-ui/react-dialog": "^1.1.4",
    "@radix-ui/react-dropdown-menu": "^2.1.4",
    "@radix-ui/react-label": "^2.1.1",
    "@radix-ui/react-popover": "^1.1.4",
    "@radix-ui/react-select": "^2.1.4",
    "@radix-ui/react-separator": "^1.1.1",
    "@radix-ui/react-tooltip": "^1.1.6",
    "@radix-ui/react-checkbox": "^1.1.3",
    "@radix-ui/react-radio-group": "^1.2.2",
    "@radix-ui/react-switch": "^1.1.2",
    "@radix-ui/react-tabs": "^1.1.2",
    "@radix-ui/react-toast": "^1.2.4",
    "@radix-ui/react-avatar": "^1.1.2",
    "@radix-ui/react-progress": "^1.1.1",
    "@radix-ui/react-slider": "^1.2.2"
  },
  "peerDependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "tailwindcss": "^4.0.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.1.0",
    "@types/node": "^20.12.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "jsdom": "^25.0.1",
    "typescript": "^5.4.0",
    "vitest": "^2.1.0"
  },
  "engines": { "node": ">=20" }
}
```

**`apps/web/package.json` needs only the workspace dep**:
```jsonc
{
  "dependencies": {
    "@deessejs/ui": "workspace:*"
    // ... other app deps
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.0.0",
    "tailwindcss": "^4.0.0"
    // vitest NOT needed in the app (tests are in packages/ui)
  }
}
```

**`apps/web/next.config.ts` needs transpilePackages**:
```ts
const nextConfig = {
  transpilePackages: ['@deessejs/ui'],
}
```

---

## 7. Recommended full `packages/ui/src/styles/globals.css`

```css
/* ORDER MATTERS — see reference-shadcn-monorepo-pitfalls.md */

@import "tailwindcss";
@source "../**/*.{ts,tsx}";   /* scan packages/ui source for primitives */

/* Now the rest, in any order */
@import "tw-animate-css";

/* Theme tokens (light + dark) */
@layer base {
  :root {
    --background: oklch(1 0 0);
    --foreground: oklch(0.145 0 0);
    --primary: oklch(0.205 0 0);
    --primary-foreground: oklch(0.985 0 0);
    /* ... full token set ... */
  }

  .dark {
    --background: oklch(0.145 0 0);
    /* ... dark tokens ... */
  }
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  /* ... etc ... */

  --radius: 0.5rem;
  --radius-sm: calc(var(--radius) * 0.6);
  --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius);
}
```

---

## 8. Final setup checklist for DeesseJS

Before scaffolding `packages/ui`:

- [ ] Add `@tailwindcss/postcss` + `tailwindcss` as devDeps in `apps/web`
- [ ] Add `transpilePackages: ['@deessejs/ui']` in `apps/web/next.config.ts`
- [ ] Create `packages/ui/package.json` with the deps above
- [ ] Create `packages/ui/vitest.config.ts` (jsdom + setup file)
- [ ] Create `packages/ui/src/test/setup.ts` with Radix polyfills
- [ ] Create `packages/ui/src/styles/globals.css` with **the correct `@source` order**
- [ ] Create `apps/web/src/app/globals.css` that `@import`s the ui one
- [ ] Create `apps/web/components.json` (app-side) + `packages/ui/components.json` (package-side)
- [ ] Add a `components.json` script to root `package.json` or use the CLI
- [ ] Run `pnpm install` from `apps/template/`
- [ ] Add a `Button` via `pnpm --filter @deessejs/web dlx shadcn@latest add button -c ../../packages/ui`
- [ ] Test in a page that imports `@deessejs/ui/components/button` and uses `<Button variant="destructive">Delete</Button>` — confirm the red bg appears
- [ ] If missing: check Pitfall #1 (globals.css `@source` order)

## Sources (verified 2026-06-23 via fresh)

- [shadcn/ui Theming docs](https://ui.shadcn.com/docs/theming) — the token convention
- [shadcn/ui Dark mode (Next.js) docs](https://ui.shadcn.com/docs/dark-mode/next) — `next-themes` + provider
- [Next.js Discussion #93542](https://github.com/vercel/next.js/discussions/93542) — when `transpilePackages` is required, answered by `icyJoseph` (Next.js maintainer)
- [Next.js transpilePackages docs](https://nextjs.org/docs/app/api-reference/config/next-config-js/transpilePackages)
- [Vercel Academy — Set up Vitest in UI Package](https://vercel.com/academy/production-monorepos/set-up-vitest) — canonical vitest setup for shared UI
- [StackOverflow — hasPointerCapture is not a function](https://stackoverflow.com/questions/79790413) — the Radix + jsdom polyfill workaround
- [raptr45/turborepo-shadcn-starter](https://github.com/raptr45/turborepo-shadcn-starter) — production example, 2025-11

## How to apply

When scaffolding `packages/ui` for DeesseJS:
1. Use the `package.json` from §6 as the starting point.
2. Use the `globals.css` from §7 — pay attention to `@source` order.
3. Use the `vitest.config.ts` + `setup.ts` from §2.
4. Add `transpilePackages: ['@deessejs/ui']` to `apps/web/next.config.ts`.
5. Start with ONE primitive (`button`), verify it renders with styles, then bulk-add.
6. Reference [[reference-shadcn-monorepo-pitfalls]] at every step — that's the bug list.