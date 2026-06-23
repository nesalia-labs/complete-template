---
name: reference-vercel-geist
description: Vercel's Geist design system as inspiration — intent-based color scale, role-based typography, motion philosophy, voice rules, and patterns worth stealing (without becoming a clone)
metadata:
  type: reference
---

# Vercel Geist — Inspiration design system

**Origine** : design system de Vercel, crystallisé en ~2022 lors du rebrand produit. L'esthétique "dev-tool premium" qui a défini tout un mouvement (Cursor, Linear, Raycast, etc.).

**⚠️ Garde-fou principal** : l'esthétique est tellement distinctive que la copier produit un "Vercel-clone". Geist est **optimisé pour surfaces dev** (dashboards, logs, code editors) — pas pour consumer marketing. À piquer **pattern par pattern**, pas à cloner wholesale.

## Ce qui est connu (et à valider avant de s'en inspirer)

- Geist Sans + Geist Mono open-source → devenu de-facto type stack pour dev tools
- Restraint comme feature : neutrals dominent, accent comme ponctuation
- Tabular numerics partout (monospaced dans tables, logs, metrics) → lit comme "engineering-grade"

## Ce qui est sous-estimé

- **Dark mode est canonique, light est l'alternate** (inverse de la plupart des DS)
- Patterns dialog/command-bar extraordinairement cohérents partout sur la plateforme (primary action, secondary action, escape — même vocab)
- Voice rules ultra-précises qui font que le produit *parle* comme une équipe senior

## 🎨 Pattern "intent-based scale" — LE truc à voler

**10 scales** : `backgrounds`, `gray`, `gray-alpha`, `blue`, `red`, `amber`, `green`, `teal`, `purple`, `pink`.

**Révolution conceptuelle** : chaque step encode **une intention**, pas une luminosité.

| Step | Rôle |
|---|---|
| `100` | Default background |
| `200` | Hover background |
| `300` | Active background |
| `400` | Default border |
| `500` | Hover border |
| `600` | Active border |
| `700` | Solid fill high contrast |
| `800` | Solid fill hover |
| `900` | Secondary text & icons |
| `1000` | Primary text & icons |

→ C'est infiniment plus puissant qu'une scale classique "50-950 lightness" : le state machine est codé dans le token. `bg-gray-100` → `bg-gray-200` au hover n'est plus une décision design, c'est une évidence.

**Special tokens** :
- `gray-alpha-*` = translucides (pour borders/overlays superposés)
- `solid gray-*` = opaque (pour texte/fills qui doivent garder leur contraste)
- Chaque accent scale a un `*-p3` en `oklch()` pour Display P3
- `background-100` (primary surface) vs `background-200` (secondary surface pour séparation subtile — **NE PAS** l'utiliser comme fill général)

## ✍️ Typography — convention `text-{role}-{size}`

**4 rôles typographiques** distincts (pas juste des tailles) :

| Rôle | Use case | Sizes |
|---|---|---|
| `heading-*` | Titres pages/sections, letterSpacing se resserre quand la size grandit | 72, 64, 56, 48, 40, 32, 24, 20, 16, 14 |
| `label-*` | Single-line scannable (nav, form labels, table headers, metadata) | 20, 18, 16, 14, 13, 12 |
| `copy-*` | Multi-line body, line-height plus haute | 24, 20, 18, 16, 14, 13 |
| `button-*` | Boutons et contrôles compacts seulement | 16, 14, 12 |

**Modificateurs** :
- `-mono` : paire avec Geist Mono (code, tabular data)
- `<strong>` : "Strong" (utilisé dans copy/label-14 par défaut)
- `Subtle` : version plus légère (heading-32/24/20/16)

**Convention d'écriture** :
- `copy-14` + `label-14` couvrent 80% du texte
- Tabular figures pour nombres alignés (Geist Mono)
- Geist Sans = UI/prose, Geist Mono = code/data/tabular

## 📐 Layout & spacing

- **Scale 4px** : 4, 8, 12, 16, 24, 32, 40, 64, 96
- **Three-step rhythm** : 8px dans un groupe, 16px entre groupes, 32-40px entre sections
- **Card padding** : 24px standard, 16px compact, 32px hero
- **Container** : 1200px centré, side padding qui grandit aux breakpoints larges
- **Breakpoints** : `sm` 401, `md` 601, `lg` 961, `xl` 1200, `2xl` 1400

## 🏔️ Elevation — subtlety first

> "Hierarchy comes from tonal surfaces and borders first, so shadows stay subtle."

```css
/* Raised cards */
box-shadow: 0 2px 2px rgba(0, 0, 0, 0.04);

/* Popovers & menus */
box-shadow: 0 1px 1px rgba(0,0,0,0.02),
            0 4px 8px -4px rgba(0,0,0,0.04),
            0 16px 24px -8px rgba(0,0,0,0.06);

/* Modals & dialogs */
box-shadow: 0 1px 1px rgba(0,0,0,0.02),
            0 8px 16px -4px rgba(0,0,0,0.04),
            0 24px 32px -8px rgba(0,0,0,0.06);
```

→ Tooltips prennent le plus léger des trois. Toujours pair avec le radius approprié.

## 🎬 Motion philosophy — "0ms is often snappiest"

> "Use motion only when it clarifies a change, never for decoration. Most interactions should feel instant: a duration of `0ms` is often the snappiest and best choice."

**Easing signature** : `cubic-bezier(0.175, 0.885, 0.32, 1.1)` (overshoot subtil, spring-feel sans spring physics).

**Durations** :
- `0ms` — souvent le meilleur choix (instant feel)
- `150ms` — state changes
- `200ms` — popovers, tooltips
- `300ms` — overlays, modals

**Rules** :
- Pas de long loops / attention-grabbing animation
- Toujours honor `prefers-reduced-motion`

## 🔘 Buttons pattern (référence à piquer)

| Variant | Style |
|---|---|
| **Primary** | Solid `gray-1000` fill + `background-100` label — single most important action |
| **Secondary** | `background-100` fill + translucent `gray-alpha-400` border |
| **Tertiary** | Transparent fill + `gray-1000` text (low-emphasis) — tint avec `gray-alpha` au hover |
| **Error** | Solid `red-800` fill + white text |

**Sizes** : `button-large` (48px + button-16), medium default (40px), `button-small` (32px).

**State machine** : 100 → 200 → 300 (backgrounds) et 400 → 500 → 600 (borders) au hover/active.

**Disabled** = gray-100 fill + gray-700 text + not-allowed cursor.

**Focus ring — DEVIS SIGNATURE** :
```css
box-shadow: 0 0 0 2px #fff, 0 0 0 4px #006bff;
```
→ 2px gap en surface color + 2px blue-700 ring. **À copier absolument**, c'est le détail qui fait premium.

## 🗣️ Voice & content rules

- **Title Case** pour labels/buttons/titles/tabs
- **Sentence case** pour body/helper text/toasts
- Actions = **verb + noun** (`Deploy Project`, `Delete Member`) — JAMAIS `Confirm`, `OK`
- Errors = **what happened + what to do next** (`Build failed. Bundle exceeds 50 MB. Reduce it or raise the limit.`)
- Toasts = **specific thing + no period + never "successfully"** (`Project deleted`)
- Empty states = **point to first action** (`No deployments yet. Push to your Git repository to create one.`)
- In-progress = **present participle + ellipsis** (`Deploying…`, `Saving…`)
- Numerals (`3 projects`), curly quotes, ellipsis character
- No `please`, no marketing superlatives

## 🆕 Geist Pixel (fév 2026)

**Nouveau membre** de la famille : typeface bitmap-inspired construite sur le même grid que Geist Sans/Mono.

**5 variants** : `Square`, `Grid`, `Circle`, `Triangle`, `Line`.

**Specs** : 480 glyphs, 7 stylistic sets, 32 supported languages. Métriques alignées avec Geist/Mono pour seamless mixing.

**Use cases** : banners, dashboards, moments expérimentaux où la typo devient "part of the interface language".

**À venir** : **Geist Serif** — même system thinking, nouvelle voix.

## 📦 Stack technique

- **Package** : `geist` (npm) — installe Geist Sans/Mono/Pixel
- **UI components** : `@vercel/geist-ui` (open-source)
- **Tailwind classes** : `text-heading-*`, `text-label-*`, `text-copy-*`, `text-button-*`
- **Couleurs** : P3 + sRGB hex, via `oklch()` pour les wide-gamut
- **Fonts** : open-source sur GitHub (`vercel/geist-font`)

## Sources canoniques

- Intro : https://vercel.com/geist/introduction
- Colors : https://vercel.com/geist/colors
- Typography : https://vercel.com/geist/typography
- Vercel Design (overview) : https://vercel.com/design
- Geist Pixel blog : https://vercel.com/blog/introducing-geist-pixel
- Geist NPM : https://www.npmjs.com/package/geist
- GitHub : https://github.com/vercel/geist-font
- Geist UI components : https://www.shadcn.io/design/vercel
- Breakdown communautaire : https://www.designsystems.one/design-systems/vercel-geist

## How to apply

**Patterns forts à piquer** (sans cloner) :
1. **Intent-based color scale** — réécrire nos tokens couleur avec `100=default bg, 200=hover bg, 300=active bg, 400-600=borders, 700-800=solid fill, 900-1000=text`. Marche avec n'importe quelle palette.
2. **Role-based typography** (`heading/label/copy/button`) plutôt que `h1/h2/p` ou `text-xl/text-sm`. Plus expressif.
3. **Two-layer focus ring** (`0 0 0 2px surface, 0 0 0 4px accent`) — détail qui fait premium.
4. **Motion philosophy "0ms is often best"** — par défaut on n'anime PAS, on n'anime que pour clarifier un changement.
5. **Voice rules** — verb+noun actions, errors = what+what-to-do, no "successfully".

**Patterns à éviter pour notre projet** :
- La single-accent blue (très Vercel-coded)
- Les 1200px container max (trop étriqué pour du marketing/content)
- Le dark-first canonique (à moins que notre produit soit dev-focused)
- Le restraint absolu sur consumer/marketing (lit comme froid)

**Quand s'en inspirer** : pour tout produit dev/data/observability/dashboard. Pas pour B2C grand public.
**Voir aussi** : [[tech-stack]] (Tailwind v4 + shadcn — `text-heading-*` et intent-based scales s'intègrent naturellement dans `@theme`), [[reference-tailwind-v4]], [[reference-shadcn]], [[reference-motion]] (le cubic-bezier Geist est faisable avec un Motion `ease`), [[reference-google-design-md]].