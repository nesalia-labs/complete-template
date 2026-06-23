---
name: reference-motion
description: Knowledge base on Motion (ex-Framer Motion) — hybrid WAAPI engine, React API, layout animations, AI Kit, and 2026 updates
metadata:
  type: reference
---

# Motion (ex-Framer Motion) — Knowledge base

**État actuel (juin 2026)** :
- **Motion** = ex-**Framer Motion**, rebrandé. Package : `motion`, imports via `motion/react`.
- v12.x = version actuelle. **v12.0 = no breaking changes** pour React.
- **30M+ téléchargements/mois** sur npm. Utilisé par Framer et Figma (millions d'utilisateurs).
- Motion pousse fort sur l'angle **AI-native** (skills, MCP, MotionScore).

## Le moteur hybride (différenciateur clé)

Motion utilise les **Web Animations API + ScrollTimeline** nativement (120fps hardware-accelerated) et **fallback JS uniquement** quand c'est nécessaire :
- ❌ Pas natif (besoin JS) : spring physics, keyframes interruptibles, gesture tracking
- ✅ Natif (WAAPI) : tweens, transforms simples, scroll-linked

→ C'est ce qui permet de garantir 120fps là où d'autres libs calent.

## API principale (React)

```tsx
import { motion } from "motion/react"

// Foundation component : préfixe n'importe quel tag HTML/SVG
<motion.button animate={{ opacity: 1 }} />
```

| Concept | API | Use case |
|---|---|---|
| **Enter animations** | `initial` + `animate` | Mount avec état de départ |
| **Hover/Tap/Focus** | `whileHover`, `whileTap`, `whileFocus` | Micro-interactions natives cross-device |
| **Scroll-triggered** | `whileInView` | Déclenche à l'entrée en viewport |
| **Scroll-linked** | `useScroll()` + `MotionValue` | Parallax, progress bars, scrub |
| **Layout animations** | `layout` prop | Détection auto size/position/reorder |
| **Shared elements** | `layoutId` + `<LayoutGroup>` | Morph entre 2 composants |
| **Exit animations** | `<AnimatePresence>` + `exit` | Anime avant retrait du DOM |
| **Drag** | `drag` prop + `dragConstraints` | Drag-to-reorder via `<Reorder>` |
| **SVG** | `motion.path` + `pathLength` | Line drawing effects |
| **Gestes** | `onHoverStart`, `onDragEnd`, etc. | Callbacks cross-device |

**Convention physique vs visuel** : propriétés physiques (`x`, `scale`) → spring physics par défaut. Propriétés visuelles (`opacity`) → tween easing par défaut. Override via `transition`.

## Layout animations (avancé)

- **`layout`** : anime automatiquement tout changement de layout
- **`layoutId`** : morph entre 2 instances du même `layoutId`
- **`<LayoutGroup id="...">`** : namespace les `layoutId` pour éviter les collisions cross-tree
- **`layout="x"` / `layout="y"`** (mars 2026) : axis-locked pour perf
- **`layoutAnchor`** (mars 2026) : custom anchor point pour projection boxes

## Components haut-niveau (2026)

- **`<AnimatePresence>`** — exit animations (essentiel pour les modals, toasts, etc.)
- **`<Reorder>`** — drag-to-reorder avec layout animations
- **`<Carousel>`** — hardware-accelerated, swipe gestures
- **`<Ticker>`** — infinite marquees avec contrôle de vitesse
- **`<AnimateNumber>`** — chiffres animés avec `trend` prop (spin up/down)
- **`splitText`** — animation par mot/caractère
- **`curtains` / `useCurtains`** (juin 2026) — page/element cover-reveal transitions
- **`AnimateView`** (fév 2026) — view animations pour React

## Updates 2026 (highlights)

- **Juin 2026** : `curtains` / `useCurtains` pour transitions cover/reveal.
- **Mars 2026** (gros lot) :
  - `layout="x"` / `layout="y"` — layout animations axis-locked (perf)
  - `dragSnapToOrigin="x"|"y"` — per-axis snapping
  - `AnimateView` — view animations pour React
  - `ViewTimeline` support pour `scroll` et `useScroll`
  - `useScroll` hardware-accelerated animations
  - Support natif typé pour `oklch`, `oklab`, `lab`, `lch`, `color`, `color-mix`, `light-dark` (très bon avec Tailwind v4 + shadcn)
  - Hardware acceleration des offsets `"start"`/`"end"` dans scroll
- **Fév 2026** : `Carousel`, `Ticker`, `useCarousel`/`useTicker`, `AnimateNumber` avec `trend` prop.
- **Mai 2026** : unification des skills Motion dans `/motion` (design guidelines, perf tips, API gotchas).

## Motion AI Kit (premium)

C'est la partie qui nous intéresse vraiment en tant qu'agent IA :

- **`/motion` skill** — unifiée en mai 2026 : design guidelines, performance tips, API gotchas, référence au Motion Studio MCP
- **`/css-spring`** — génère des CSS spring easing functions
- **`/see-transition`** — visualise easing curves et springs
- **MotionScore** — performance audit (aussi dispo en free audit <60s)
- **Motion Studio MCP** — docs search, examples search, codex avec documentation
- **CSS Studio** — visual site editor pour stacks existants

→ Concrètement, Motion pousse fort sur le fait d'être **AI-native** : installer leurs skills dans Claude/Codex/Cursor pour avoir le bon contexte.

## Migration depuis Framer Motion

```bash
npm uninstall framer-motion
npm install motion
```

```diff
- import { motion } from "framer-motion"
+ import { motion } from "motion/react"
```

**Historique notable** :
- v12 — no breaking changes pour React
- v11 — velocity calculation changes, render scheduling en microtask
- v10 — retrait `IntersectionObserver` fallback
- v9 — tap events keyboard-accessible
- v5 — `AnimateSharedLayout` déprécié au profit de `layoutId` + `LayoutGroup`

## Offre commerciale (Motion+)

- 400+ premium examples
- Motion AI Kit
- CSS Studio
- Lifetime updates (one-time payment)
- Partners : Linear, Figma, Sanity, Clerk
- 110+ step-by-step tutorials avec live code

## Sources canoniques

- Site : https://motion.dev/
- React docs : https://motion.dev/docs/react
- Upgrade guide : https://motion.dev/docs/react-upgrade-guide
- Changelog : https://motion.dev/changelog
- GitHub : https://github.com/motiondivision/motion
- AI Kit / skills : `npx skills add motion`

## How to apply

- Quand on propose des **micro-interactions** : partir des `whileHover` / `whileTap` (CSS fait le job en basique, Motion ajoute cross-device + physique spring).
- Quand on propose des **animations de layout** (reorder, expand, etc.) : utiliser `layout` + `AnimatePresence` + `<LayoutGroup>` plutôt que de mesurer manuellement.
- Quand on anime des **chiffres** : `<AnimateNumber>` avec `trend` prop.
- Quand on propose des **page transitions** : `curtains` (juin 2026) est la nouvelle reco.
- Quand on intègre Motion dans un projet shadcn/Tailwind v4 : support natif des CSS vars en `oklch` confirmé (mars 2026), donc on peut passer les couleurs du theme shadcn directement dans `animate`.
- Pour les **coding agents** : installer les skills Motion (`/motion`, `/css-spring`, `/see-transition`) pour avoir le contexte à jour.
- Quand l'utilisateur demande des **scroll animations** : `useScroll` + `MotionValue` pour scroll-linked, `whileInView` pour trigger.
- Quand on hésite entre CSS et Motion : CSS pour self-contained simple (color/opacity hover), Motion pour orchestration, physique, gestures, layout.
- Voir [[tech-stack]] pour le contexte projet (Tailwind v4 + shadcn/ui).
- Voir [[reference-tailwind-v4]] pour le socle CSS (Motion consomme les CSS vars du `@theme`).
- Voir [[reference-shadcn]] pour les composants UI qu'on anime.
- Voir [[reference-google-design-md]] pour le format de spec qui peut décrire les animations.