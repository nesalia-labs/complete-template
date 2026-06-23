---
name: tech-stack
description: Tech stack for upcoming work — Tailwind CSS v4 + shadcn/ui as the design system foundation
metadata:
  type: project
---

Stack design du projet : **Tailwind CSS v4** + **shadcn/ui**.

**Why:** Choix d'outillage annoncé par l'utilisateur le 2026-06-17 comme base sur laquelle on va bosser ensemble. shadcn/ui s'appuie nativement sur Tailwind et fournit des composants accessibles et personnalisables (Radix primitives + styles copiés localement, pas une dépendance npm figée).

**Font: Geist via `next/font/google` (decision 2026-06-22).** On garde le setup actuel (` Geist` + `Geist_Mono` dans `layout.tsx`) plutôt que de passer par `registry:font` shadcn. Plus simple, pas de complexité de registry. Le CSS variable `--font-geist-sans` et `--font-geist-mono` sont déjà câblés dans `layout.tsx` et exposés en tokens Tailwind via `@theme inline`.

**Monorepo: CLI fait tout.** Pour installer le DS dans un workspace : lancer `npx shadcn@latest init --template next --monorepo --base radix` depuis le bon répertoire. La CLI crée automatiquement `packages/ui` + met en place les workspace aliases. Ne pas scler à la main.

**How to apply:**
- Toujours proposer des solutions qui s'intègrent à Tailwind v4 (utility-first, support natif des CSS variables, `@theme` directive, CSS-first config plutôt que `tailwind.config.js`).
- Pour les composants UI (boutons, dialogs, dropdowns, forms, tables, etc.), recommander shadcn/ui en priorité — pas une autre lib comme MUI, Chakra, Mantine.
- Préférer `npx shadcn@latest add <component>` pour installer les composants, et garder à l'esprit qu'ils sont copiés dans le projet donc modifiables.
- Penser accessibilité (focus rings, ARIA) — c'est un des gros apports de shadcn via Radix.
- Si l'utilisateur demande un design system custom, partir des tokens shadcn (CSS variables `--background`, `--foreground`, `--primary`, etc.) plutôt que de réinventer la roue.
- Pour inspector ce que la CLI va écrire avant de lancer un `add` : utiliser `--dry-run` / `--diff`.
- Avant de toucher au DS : vérifier `npx shadcn@latest info` pour avoir le contexte complet.
