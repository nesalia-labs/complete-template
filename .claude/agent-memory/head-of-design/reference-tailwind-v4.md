---
name: reference-tailwind-v4
description: Knowledge base on Tailwind CSS v4 — major features, breaking changes from v3, current version, and @theme design token pattern
metadata:
  type: reference
---

# Tailwind CSS v4 — Knowledge base

**Dernière version stable connue : 4.3.1** (2026-06-12). v4.0 est sorti le 2025-01-22 (réécriture complète depuis v3).

## Les 12 features majeures de v4.0

1. **Engine hautes perfs** — builds 5x plus rapides, incrémental 100x+ (mesuré en µs).
2. **CSS-first config (`@theme`)** — fini `tailwind.config.js`, tout en CSS.
3. **CSS theme variables** — tokens dispo en `var(--color-*)` nativement (parfait pour interop avec Motion, JS, inline styles).
4. **Auto content detection** — plus de `content: [...]` à maintenir (utilise `.gitignore` + heuristiques).
5. **Vite plugin first-party** — `@tailwindcss/vite` plus performant que PostCSS.
6. **Container queries natives** — `@container`, `@sm:`, `@max-md:`, plus besoin du plugin.
7. **Palette P3 modernisée** — `oklch()` au lieu de `rgb`, gamut étendu.
8. **Valeurs dynamiques** — `grid-cols-15`, `data-current:opacity-100` out of the box (plus besoin d'extensions).
9. **Spacing unifié** — une seule variable `--spacing` → utilities `px-*`, `w-*`, `mt-*`, etc.
10. **3D transforms** — `rotate-x-*`, `translate-z-*`, `perspective-*`.
11. **`@starting-style`** — transitions enter/exit sans JS.
12. **`not-*` variant** — négation de variants/sélecteurs/media queries.

## Breaking changes qui touchent un design system (v3 → v4)

- **Browser baseline** : Safari 16.4+, Chrome 111+, Firefox 128+.
- **`@tailwind` directives supprimés** → `@import "tailwindcss"`.
- **Renommages notables** : `shadow-sm` → `shadow-xs`, `shadow` → `shadow-sm`, `outline-none` → `outline-hidden`, `rounded` → `rounded-sm`, `flex-shrink` → `shrink`.
- **Ring par défaut** : passe de **3px à 1px** → utiliser `ring-3` pour l'ancien comportement.
- **Border color par défaut** : `currentColor` au lieu de `gray-200` (Tailwind moins opinionated, matche les browser defaults).
- **`space-*` et `divide-*`** : changement de sélecteur (perf sur grandes pages) → préférer `gap` avec flex/grid.
- **Gradient variants** : `via-none` nécessaire pour "reset" un 3-stop vers 2-stop.
- **Déprécations** : `bg-opacity-*`, `text-opacity-*`, `flex-shrink-*`, etc. → utiliser les modifiers `/50`.

Outil de migration : `npx @tailwindcss/upgrade` (Node 20+ requis).

## Recipes landing page (v4)

### Container centré
```css
@theme {
  --max-w-container: 1200px;
}
```
```html
<div class="max-w-container mx-auto px-4 lg:px-8">
```

### Grille avec borders comme séparateurs
```html
<div class="grid lg:grid-cols-3 border border-border [&>*]:border-border">
  <div class="p-6 bg-card">Card</div>
</div>
```

### Gradient text (v4 `bg-linear-*`)
```html
<h1 class="bg-linear-to-r from-cyan-400 via-blue-500 to-violet-600 bg-clip-text text-transparent">
```

### Subgrid pour pricing table
```html
<div class="grid grid-cols-3 gap-px bg-border">
  <div class="grid grid-cols-subgrid col-span-3 gap-px bg-border">
    <div>Header spans all</div>
  </div>
  <div>Cell</div>
</div>
```

### `@container` pour cards autonomes
```html
<div class="@container">
  <div class="@sm:flex-row @xs:flex-col">...</div>
</div>
```

### Auto-growing textarea (v4 `field-sizing`)
```html
<textarea class="field-sizing-content" rows="2"></textarea>
```

### Custom utility pour terminal
```css
@utility terminal-window {
  background: var(--card);
  border: 1px solid var(--border);
  shadow: var(--shadow-card);
}
```

### Background CSS var inline
```html
<div class="text-(--foreground) bg-(--background)">
```

### Data state variants (interactive demos)
```html
<div data-state="running" class="data-[state=running]:opacity-100 data-[state=idle]:opacity-50">
```

### Inset shadow pour terminal window
```html
<div class="inset-shadow-sm inset-ring-1">
```

### Transition discrete properties (animate display)
```html
<div class="transition-all transition-discrete data-open:block">
```

### Logical properties (RTL-ready from day one)
```html
<div class="ms-4 me-4 pbs-2 pbe-2">
```

## Updates depuis v4.0 (timeline 2025-2026)

- **v4.1** (oct 2025) : meilleurs messages d'erreur, support Vite env API, parsing errors avec line numbers.
- **v4.2.0** (fév 2026) : nouvelles palettes `mauve`, `olive`, `mist`, `taupe` ; utilities `inline-*`, `block-*`, `inset-s-*`, `inset-e-*` (déprécation des `start-*`/`end-*`) ; package `@tailwindcss/webpack` ; `font-features-*` ; `pbs-*`/`pbe-*`/`mbs-*`/`mbe-*` pour logiques.
- **v4.3.0** (mai 2026) : `@container-size`, `scrollbar-{auto,thin,none}`, `scrollbar-thumb-*`, `scrollbar-track-*`, `scrollbar-gutter-*`, `zoom-*`, `tab-*`.
- **v4.3.1** (juin 2026) : option `--silent` pour CLI, fix Node 26+ hooks, fix tsconfig paths, fixs de canonicalization.

## Pattern `@theme` — la fondation design system

```css
@import "tailwindcss";

@theme {
  /* Tokens → utilities auto-générées */
  --color-avocado-500: oklch(0.84 0.18 117.33);
  --font-display: "Satoshi", sans-serif;
  --breakpoint-3xl: 1920px;
  --ease-fluid: cubic-bezier(0.3, 0, 0, 1);
  --spacing: 0.25rem;  /* single source of truth */
}
```

**Namespaces clés** : `--color-*`, `--font-*`, `--text-*`, `--font-weight-*`, `--tracking-*`, `--leading-*`, `--breakpoint-*`, `--container-*`, `--spacing-*`, `--radius-*`, `--shadow-*`, `--inset-shadow-*`, `--drop-shadow-*`, `--blur-*`, `--ease-*`, `--animate-*`.

**3 modes de customisation** :
- **Extend** : ajouter des tokens (par défaut).
- **Override** : redéfinir un token existant (`--breakpoint-sm: 30rem`).
- **Reset** : `--color-*: initial` pour clear un namespace, ou `--*: initial` pour reset complet du thème.

Les `@keyframes` peuvent être définis DANS `@theme` pour être inclus dans le CSS généré.

## Sources canoniques

- Blog v4.0 : https://tailwindcss.com/blog/tailwindcss-v4
- Upgrade guide : https://tailwindcss.com/docs/upgrade-guide
- Theme variables : https://tailwindcss.com/docs/theme
- CHANGELOG : https://github.com/tailwindlabs/tailwindcss/blob/main/CHANGELOG.md
- Release v4.3.1 : https://github.com/tailwindlabs/tailwindcss/releases/tag/v4.3.1

## How to apply

- Quand on conçoit/propose un design system : partir de `@theme` comme **single source of truth** pour les design tokens (couleurs, typo, spacing, easing, shadows) — chaque token génère automatiquement sa famille d'utilities.
- Quand on propose un composant : vérifier qu'on utilise les v4 patterns (`@container`, `data-*` variants, `not-*`, `@starting-style`) plutôt que des workarounds v3.
- Quand on évoque le spacing : rappeler que c'est désormais `var(--spacing) * n` (généralement `0.25rem` base), donc toutes les valeurs arbitraires sont supportées sans config.
- Quand on parle couleurs : par défaut c'est `oklch()` (P3), à confirmer avec l'utilisateur si on doit rester en `rgb` pour compatibilité ou design tools.
- Quand on propose une migration v3→v4 : recommander `npx @tailwindcss/upgrade` puis review manuel des renommages.
- Voir [[tech-stack]] pour le contexte projet (Tailwind v4 + shadcn/ui).
- Voir aussi [[reference-google-design-md]] pour le format de spec UI qui peut consommer ces tokens.