---
name: feedback-tailwind-v4-monorepo-source
description: Tailwind v4 requires @source directive to detect classes from packages in monorepos
metadata:
  type: feedback
---

# Tailwind v4 @source directive in monorepos

## Problem
In Tailwind v4 monorepos, shadcn components render without styles (classes like `bg-primary` are missing from compiled CSS). This is a known bug.

## Solution
Add `@source` directive to `packages/ui/src/styles/globals.css`:

```css
@import "tailwindcss";
@source "../**/*.{ts,tsx}";
```

**Important:** `@source` must be placed **immediately after** `@import "tailwindcss"`, before any other imports.

## Why
Tailwind v4 doesn't automatically scan files in monorepo packages. The `@source` directive tells Tailwind which files to scan for class names.

## Order matters
```
@import "tailwindcss";
@source "../**/*.{ts,tsx}";  // ← MUST be here
@import "tw-animate-css";   // ← AFTER @source
```

If `@source` is placed after other imports, it doesn't work.

## References
- GitHub Issue: https://github.com/shadcn-ui/ui/issues/6878
- Docs: https://ui.shadcn.com/docs/tailwind-v4
