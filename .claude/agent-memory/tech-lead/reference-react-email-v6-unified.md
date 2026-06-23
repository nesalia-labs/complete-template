---
name: react-email-v6-unified
description: react-email v6.6.3 (latest, June 2026) unified package — complete component inventory + utilities + features added since v6.0.0
metadata:
  type: reference
---

React Email — reference card verified 2026-06-22 via fresh fetch + direct .d.mts source inspection.

**Current version: `react-email@6.6.3`** (102K weekly downloads, published ~7 days ago). Not v6.0.0 — the package has had 7 minor releases and many patches since the unification on 2026-04-16. Always pin `^6` (or `^6.6`) to get the latest.

**Major change in v6.0.0 (2026-04-16):** all components and rendering utilities moved into the single `react-email` package. Legacy `@react-email/components`, `@react-email/button`, etc. are deprecated. Only `@react-email/render` (still re-exported from `react-email`) and `@react-email/ui` (preview dev server) survive as separate packages.

**Complete component inventory (verified from `dist/index.d.mts` of v6.6.3):**

Layout / structural:
- `Html` — root `<html>` element, sets `lang`/`dir`
- `Head` — `<head>` for meta + `<Font>` + styles
- `Body` — `<body>`, gets `dir`/`lang` defaults in v6.5+
- `Container` — centered content with max-width
- `Section` — block-level content area
- `Row` + `Column` — table-based rows + cells (for multi-column layouts)

Content:
- `Heading` (with `as` prop for h1/h2/h3)
- `Text` — `<p>` block
- `Link` — `<a>` with email-safe defaults
- `Button` — styled `<a>` (it's actually a link, not a `<button>`)
- `Img` — with empty `alt` fallback added in v6.5+
- `Hr` — divider
- `Preview` — inbox preview text (gmail snippet); `useTitleTag` prop added in v6.6.0
- `Font` — web font loader

Code + Markdown:
- `CodeBlock` — with Prism syntax highlighting (37 themes exported: `xonokai`, `vscDarkPlus`, `dracula`, `nord`, `oneDark`, `oneLight`, `githubDark`, `githubLight`, `solarizedDarkAtom`, etc.)
- `CodeInline` — inline code
- `Markdown` — CommonMark → email-compatible table layout, with `role="presentation"` added in v6.5+

Tailwind:
- `Tailwind` — wrapper that inlines Tailwind classes (Tailwind 4.1.18 internal). Props: `config`, `theme` (CSS string, v6.2+), `utility` (CSS string, v6.2+).
- `pixelBasedPreset` — preset that changes `rem` → `16px` for Outlook compat.
- `setupTailwind(props?)` — internal helper, `{ config, cssConfigs }` shape since v6.2.0.

Rendering utilities (re-exported from `@react-email/render@2.0.9`):
- `render(element, options?)` → HTML string
- `pretty(html)` → formatted HTML (dev only)
- `toPlainText(html, options?)` → plain text fallback
- `Options` — type
- `plainTextSelectors` — DOM selectors to strip for plain text

Internal exports (not for app code, but exposed):
- 37 CodeBlock theme objects
- `inlineStyles`, `renderWhiteSpace`, `sanitizeStyleSheet` — low-level utilities
- `HeadingAs`, `EmailElementProps`, etc. — type utilities

**Single import (v6+):**
```ts
import {
  // Composants
  Html, Head, Body, Container, Section, Row, Column,
  Heading, Text, Button, Link, Img, Preview,
  Hr, Font, CodeBlock, CodeInline, Markdown,
  // Tailwind
  Tailwind, pixelBasedPreset,
  // Rendering utilities
  render, pretty, toPlainText,
} from 'react-email'
```

**Surviving separate packages:**
- `@react-email/render@^2.0.9` — still exists, still works, but `render` is re-exported from `react-email` itself. Has its own version line (separate from `react-email`). Tracks Node / browser / workerd / deno / worker via conditional exports.
- `@react-email/ui@^1` — preview dev server + UI primitives (used by `email dev` CLI). Stays separate, devDep.
- `@react-email/editor@^1` — visual editor (TipTap + ProseMirror). v6+ feature, opt-in, NOT what we need (we code templates directly).

**Key features added since v6.0.0 (worth knowing for our 6 templates + Wrapper):**

- **6.2.0 (Tailwind v4 CSS-first config)**: `<Tailwind theme={cssString} utility={cssString}>` — pass CSS strings directly instead of building a JS config object. Useful for sharing brand tokens with `apps/web`. Preview server, `email export`, and caniemail check all understand Vite-style `?inline` and `?raw` suffixes on CSS imports.
  ```tsx
  import themeCss from "./theme.css?inline"
  <Tailwind theme={themeCss}>
    <div className="bg-brand font-display">Custom themed content</div>
  </Tailwind>
  ```
- **6.5.0 (accessibility defaults)**: `dir`/`lang` on `Body`, empty `alt` fallback on `Img`, `role="presentation"` on `Markdown` table. Out-of-the-box a11y — no extra config needed for our 6 templates.
- **6.5.0 (`email dev --clients <list>`)**: narrow which email clients trigger compatibility warnings. `email dev --clients outlook,apple-mail` for a 2-client subset. `COMPATIBILITY_EMAIL_CLIENTS` env var as alternative.
- **6.6.0 (`useTitleTag` on Preview)**: `<Preview useTitleTag={false}>` to skip the title tag in the inbox preview. Useful if our templates shouldn't put a `<title>` in the HTML head.
- **6.0.x → 6.1.x**: many Tailwind bug fixes (opacity modifiers, `--tw-*` CSS vars in Gmail media queries, non-inlinable config variables). Most are invisible to us unless we use obscure Tailwind patterns.
- **6.1.5 (OOM fix on `email export`)**: if we ever run `email export` on a project with many templates (we don't, only 6), it would batch 10 builds + 25 renders per worker to avoid V8 OOM.

**Migrating from `@react-email/components`:** just rewrite imports to come from `react-email`. The legacy packages are deprecated. Example:
```diff
- import { Button, Html, Head } from "@react-email/components"
+ import { Button, Html, Head } from "react-email"
```

**Install pattern:**
```sh
pnpm add react-email react react-dom -E          # deps (render is runtime)
pnpm add @react-email/ui -D -E                  # devDep (preview dev server only)
```

**`render()` API (from `react-email`):**
```ts
import { render, pretty, toPlainText } from 'react-email'

const html = await render(<MyTemplate {...props} />)   // → string
const pretty = await pretty(html)                       // → formatted string (dev only)
const text = toPlainText(html)                         // → plain text fallback (sync)
```

- `render()` is **Node.js only** (uses `react-dom/server`). Not Edge-compatible.
- In the browser, you need `web-streams-polyfill/polyfill` for Safari/iOS.
- Options: `{ pretty: boolean, plainText: boolean, htmlToTextOptions: object }`.

**`resend.emails.send()` shortcut:** if using Resend, you can pass `react: <Component />` directly — Resend renders server-side. You don't need to call `render()` yourself:
```ts
await resend.emails.send({
  from, to, subject,
  react: <MyTemplate {...props} />,   // Resend handles render
  text: toPlainText(await render(<MyTemplate {...props} />)),  // optional fallback
})
```

**CLI (`email dev`):**
- `pnpm email dev` starts preview server on **localhost:3000 by default**.
- Use `pnpm email dev -p 3005` to avoid conflict with `apps/web` (also port 3000).
- Hot-reloads template changes.
- Each template needs `Template.PreviewProps = {...}` static for the preview to use sample data.

**Tailwind component:**
```tsx
import { Tailwind, pixelBasedPreset, Button } from 'react-email'

<Tailwind
  config={{
    presets: [pixelBasedPreset],   // rem → 16px for Outlook compat
    theme: { extend: { colors: { brand: '#007291' } } },
  }}
>
  <Button href={url} className="bg-brand px-3 py-2 font-medium text-white">
    Click me
  </Button>
</Tailwind>
```
- Limitations: no `useContext` inside `<Tailwind>`, no `@tailwindcss/typography` (`prose`).
- Internal Tailwind version: **4.1.12** (independent of the `apps/web` PostCSS pipeline).

**i18n guides:** official integrations exist for `next-intl`, `react-i18next`, `react-intl`. Pattern: template receives `locale` prop, JSON messages per locale, `createTranslator` in body.

**Why this matters for DeesseJS:** we use React 19.2 + Next.js 16 — both officially supported since React Email 5.0. We do NOT use Edge runtime — our Hono + oRPC handler runs Node.js on Vercel. All green.

**Sources (2026-06-22 via fresh):**
- `react.email/docs/llms.txt` (full doc index, 80+ pages)
- `react.email/docs/utilities/render.md`
- `react.email/docs/getting-started/monorepo-setup/pnpm.md`
- `react.email/docs/getting-started/manual-setup.md`
- `resend.com/blog/react-email-5` and `/react-email-6`
- `github.com/resend/react-email/releases/tag/react-email@6.0.0`

**How to apply:**
- Always `import ... from 'react-email'` (not `@react-email/components`).
- Don't list `@react-email/components` in package.json — it's deprecated.
- Pin `react-email@^6.6` (or just `^6`) to get the latest patches and features.
- Track `@react-email/render` separately — it's still its own package with its own version line (currently 2.0.9).
- For our 6 templates, the components we'll actually use are: `Html`, `Head`, `Body`, `Container`, `Section`, `Heading`, `Text`, `Button`, `Link`, `Img`, `Hr`, `Preview`, `Font`, `Tailwind`, `pixelBasedPreset`. That's it — the 37 CodeBlock themes and Markdown component are over-engineered for transactional auth mail.
- For `packages/mail` wiring, see [[project-packages-mail-architecture]]. For sending, see [[reference-resend-sdk-details]].