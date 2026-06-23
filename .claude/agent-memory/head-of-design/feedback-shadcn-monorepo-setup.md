---
name: feedback-shadcn-monorepo-setup
description: shadcn/ui monorepo setup — CLI v4 workflow + correct config for both root and template monorepos
metadata:
  type: feedback
---

# shadcn/ui monorepo setup

## Project structure

There are TWO monorepos in this project:

1. **Root monorepo** (`/`) — uses `@workspace/ui` package
2. **Template monorepo** (`/apps/template`) — uses `@deessejs/ui` package

Both have the same pattern but different package names.

## Animations (Tailwind v4)

Install `tw-animate-css` for dialog, accordion, and other animated components:

```bash
pnpm add -D tw-animate-css
```

Add to `packages/ui/src/styles/globals.css`:
```css
@import "tailwindcss";
@import "tw-animate-css";
```

**Next.js 16:** Add to `transpilePackages` in `next.config.ts`:
```ts
transpilePackages: ["@workspace/ui", "tw-animate-css"]
```

## Required configuration

### packages/ui/package.json
```json
{
  "name": "@deessejs/ui",  // or "@workspace/ui" in root
  "exports": {
    "./globals.css": "./src/styles/globals.css",
    "./components/*": "./src/components/*.tsx",
    "./lib/*": "./src/lib/*.ts"
  },
  "imports": {
    "#components/*": "./src/components/*.tsx",
    "#lib/*": "./src/lib/*.ts"
  }
}
```

### apps/web/package.json
```json
{
  "imports": {
    "#components/*": "./src/components/*.tsx",
    "#lib/*": "./src/lib/*.ts"
  },
  "dependencies": {
    "@deessejs/ui": "workspace:*"  // or "@workspace/ui" in root
  }
}
```

### apps/web/components.json
```json
{
  "aliases": {
    "ui": "@deessejs/ui/components",  // or "@workspace/ui/components" in root
    "utils": "@deessejs/ui/lib/utils"
  }
}
```

### apps/web/globals.css
```css
@import "tailwindcss";
@import "@deessejs/ui/globals.css";
```

## Correct import pattern
```tsx
import { Button } from "@deessejs/ui/components/ui/button"
```

## CLI usage
```bash
cd apps/web
pnpm dlx shadcn@latest add button
# Installs to packages/ui/src/components/ui/
```

## Common issues
- CLI `--monorepo` creates nested structure — use manual setup instead
- Wildcard exports don't work — use explicit `./components/*` pattern
- Import path: `@deessejs/ui/components/ui/button` NOT `@deessejs/ui`
- **CLI generates wrong radix imports** — always fix after `shadcn add`:
  - `import { X } from "radix-ui"` → `import * as X from "@radix-ui/react-x"`
  - Or `import { X } from "@radix-ui/react-x"` depending on the primitive
