---
name: feedback-workspace-ui-export-issue
description: shadcn monorepo import paths — correct pattern is @workspace/ui/components/ui/button
metadata:
  type: feedback
---

# shadcn monorepo import paths

## Correct import pattern

```tsx
import { Button } from "@workspace/ui/components/ui/button"
```

NOT:
```tsx
import { Button } from "@workspace/ui/components/ui/button.tsx"  // wrong extension
import { Button } from "@workspace/ui"  // wrong - no barrel export
```

## Required configuration

### packages/ui/package.json
```json
{
  "name": "@workspace/ui",
  "imports": {
    "#components/*": "./src/components/*.tsx",
    "#lib/*": "./src/lib/*.ts",
    "#hooks/*": "./src/hooks/*.ts"
  },
  "exports": {
    "./globals.css": "./src/styles/globals.css",
    "./components/*": "./src/components/*.tsx",
    "./lib/*": "./src/lib/*.ts",
    "./hooks/*": "./src/hooks/*.ts"
  }
}
```

### apps/web/package.json
```json
{
  "imports": {
    "#components/*": "./src/components/*.tsx",
    "#lib/*": "./src/lib/*.ts",
    "#hooks/*": "./src/hooks/*.ts"
  }
}
```

### apps/web/components.json aliases
```json
{
  "aliases": {
    "components": "#components",
    "ui": "@workspace/ui/components",
    "lib": "#lib",
    "hooks": "#hooks",
    "utils": "@workspace/ui/lib/utils"
  }
}
```

### packages/ui/components.json aliases
```json
{
  "aliases": {
    "components": "#components",
    "ui": "#components",
    "lib": "#lib",
    "hooks": "#hooks",
    "utils": "#lib/utils"
  }
}
```

**Why:** The shadcn CLI documentation explicitly shows this pattern. Exports use `./components/*` which maps to `./src/components/*.tsx` — so `@workspace/ui/components/ui/button` resolves to `./src/components/ui/button`.

**How to apply:** When adding components, ensure exports are set up. The CLI handles this automatically when using `--monorepo`.
