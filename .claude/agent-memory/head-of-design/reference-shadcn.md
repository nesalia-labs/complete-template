---
name: reference-shadcn
description: shadcn/ui monorepo setup, CLI v4 flags, preset system, registry:font, and workspace import conventions
metadata:
  type: reference
---

# shadcn/ui — Monorepo + CLI v4 notes

## Monorepo setup (via CLI, pas à la main)

`npx shadcn@latest init --template next --monorepo` crée automatiquement :
- Structure `apps/web` + `packages/ui`
- `turbo.json`
- 2 fichiers `components.json` (un par workspace, avec bons alias)
- Configuration pnpm workspace
- Package `packages/ui` exposé via `@workspace/ui`

Pour DeesseJS : lancer depuis `apps/template/` (le nested workspace) pour que le workspace pick up le nouveau package.

## Pattern d'import

```tsx
// Apps consomment via @workspace/ui
import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"
import { useTheme } from "@workspace/ui/hooks/use-theme"

// Le workspace ui utilise des alias locaux
import { Button } from "#components/button"
import { cn } from "#lib/utils"
```

CLI route automatiquement les fichiers au bon workspace selon où la commande est lancée.

## CLI v4 — flags clés

| Flag | Usage |
|---|---|
| `--dry-run` / `--diff` / `--view` | Inspector ce que la CLI va écrire avant de lancer. Pipe vers un agent pour review. |
| `--preset <code>` | Pack tout le DS en un string partageable. Build sur shadcn/create, grab le code après. |
| `--template next\|vite\|astro\|react-router\|tanstack-start\|laravel` | Choisit le template de scaffolding. |
| `--monorepo` | Scaffolds la structure monorepo. |
| `--base radix\|base` | Choisit la lib de primitives. shadcn v4 supporte les deux avec parité Radix + Base UI depuis fév 2026. |
| `--defaults` | Utilise les defaults (--template=next --preset=nova). |
| `--yes` / `-y` | Skip les prompts interactifs. |
| `--force` / `-f` | Force overwrite des fichiers existants. |

## Presets

Un preset = design system complet encodé en string court (url-safe). Contient : couleurs, theme, font, radius, icon library.

```bash
npx shadcn@latest init --preset a1Dg5eFl
npx shadcn@latest apply a2r6bw
```

On peut créer un preset DeesseJS custom et le partager dans l'équipe / prompts d'agents. Le CLI route les fichiers correctement via `components.json`.

## registry:font (CLI v4)

Fonts = first-class registry type depuis v4 (mars 2026). Installer Geist comme un composant :

```bash
npx shadcn@latest add font-geist
```

Le registry installe le font config + génère le preset `registry:font` en un seul coup.

## registry:base

Distribue un DS complet (composants + deps + CSS vars + fonts + config) en un payload installable via `npx shadcn@latest add <registry:base-name>`.

## shadcn info

```bash
npx shadcn@latest info
```

Affiche : framework, version, CSS vars, composants installés, path des fichiers, links docs. Parfait pour donner du contexte à un coding agent.

## shadcn docs

```bash
npx shadcn@latest docs combobox
```

Affiche : docs URL, examples URL, API reference. Plus besoin d'ouvrir le browser.

## shadcn/skills (AI Kit)

```bash
npx skills add shadcn/ui
```

Donne aux coding agents le contexte pour travailler avec les composants, registry, et CLI. Le skill couvre Radix + Base UI patterns, APIs, registry workflows.

## Structure monorepo canonique (shadcn pattern)

```
apps/
  web/                    # Le consumer app
    components.json         # Alias workspace (@workspace/ui)
    app/
      globals.css
packages/
  ui/                     # Le package UI
    src/
      components/           # Composants primitifs
      hooks/                # useTheme, etc.
      lib/
        utils.ts           # cn
      styles/
        globals.css        # Tokens (le seul CSS file)
    components.json         # Alias locales (#components, #lib)
    package.json            # exports + dependencies
    exports field           # Expose les paths pour @workspace/ui
turbo.json                  # Build orchestration
```

## Style par défaut pour DeesseJS

- `--style new-york` (default historique, recommandé pour v1)
- `--baseColor neutral` (standard)
- `--base radix` (choix DeesseJS : Radix pour v1, Base UI suit)
- `--iconLibrary lucide` (lucide-react)
- `--cssVariables true` (CSS variables enabled pour theming)
- `tailwindcss@4` + `@tailwindcss/postcss` (Tailwind v4 via PostCSS)

## Sources

- Docs monorepo : https://ui.shadcn.com/docs/monorepo
- CLI v4 changelog : https://ui.shadcn.com/docs/changelog/2026-03-cli-v4
- Skills : https://ui.shadcn.com/docs/changelog/2026-03-cli-v4
- Changelog principal : https://ui.shadcn.com/docs/changelog
- Rhea (mai 2026) : https://ui.shadcn.com/docs/changelog/2026-05-rhea
- Blocks (fév 2026) : https://ui.shadcn.com/docs/changelog/2026-02-blocks
- Registry : https://ui.shadcn.com/docs/registry

## How to apply

- Pour initialiser le DS dans un workspace : `cd apps/template && npx shadcn@latest init --template next --monorepo --base radix --style new-york -y`.
- Pour ajouter un composant : `cd apps/template/apps/web && npx shadcn@latest add button` (CLI route vers `packages/ui`).
- Pour inspector avant d'ajouter : `npx shadcn@latest add button --dry-run`.
- Pour créer un preset DeesseJS custom : utiliser shadcn/create (en ligne) puisgrabber le code.
- Pour partager le DS avec un agent : `npx shadcn info` pour lui donner le contexte complet.
- Quand on demande à un agent de travailler sur le DS : `npx skills add shadcn/ui` en premier.
- Pour les fonts : vérifier si `registry:font` Geist existe avant de wiring manuellement via `next/font/google`.
- [[tech-stack]] : Tailwind v4 est confirmé, shadcn y est intégré via PostCSS.
- [[reference-tailwind-v4]] : le socle CSS.
- [[reference-motion]] : l'outil d'animation si spring/drag/layout sont nécessaires.