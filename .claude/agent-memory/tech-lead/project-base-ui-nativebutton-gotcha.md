---
name: project-base-ui-nativebutton-gotcha
description: Base UI Button defaults to nativeButton:true — when used with render={<Link/>} (polymorphic), must explicitly pass nativeButton={false} or warning fires in dev
metadata:
  type: project
---

Base UI's `<Button>` (the primitive that `@deessejs/ui/components/button` wraps) defaults to `nativeButton: true`. When you use the polymorphic `render={<Link href="..."/>}` prop to turn it into an anchor, Base UI's dev check fires this warning every render:

> A component that acts as a button expected a native `<button>` because the `nativeButton` prop is true. Rendering a non-`<button>` removes native button semantics, which can impact forms and accessibility. Use a real `<button>` in the `render` prop, or set `nativeButton` to `false`.

**Fix**: pass `nativeButton={false}` whenever using `render={<NonButtonElement/>}`. The pattern is:

```tsx
<Button render={<Link href="/x" />} nativeButton={false} variant="ghost">
  Label
</Button>
```

## When you DON'T need it

- `<Button type="submit" onClick={...}>` (default — renders native `<button>`)
- `<Button render={<button onClick={...} />}>` (still a native button — pass nothing)

## When you DO need it

- `<Button render={<Link href="..." />}>` (Next.js Link → `<a>`)
- `<Button render={<a href="..." />}>` (raw anchor)

## Why the warning exists

Base UI's Button adds keyboard handling (Enter/Space), focus ring, and ARIA role="button" by default. When the rendered element is not a real button, those behaviors don't all transfer — keyboard activation of a `<form>` parent still submits, ARIA on a link is wrong, etc. The warning is Base UI's way of saying "I optimized for the wrong case — tell me explicitly you're OK with link semantics."

## How to apply (apps/web)

Every `Button render={<Link ...>}` in apps/web must have `nativeButton={false}`. Search the codebase before declaring Phase 1 done — 3 instances exist as of 2026-06-23:
- `apps/web/src/app/(unprotected)/layout.tsx` (Log in + Sign up)
- `apps/web/src/components/auth/forgot-password-form.tsx` (Back to log in)

If a future shadcn component is added that uses `Button` polymorphically, lint rule candidate: `Button.*render.*Link` must include `nativeButton={false}`. For now, manual discipline.
