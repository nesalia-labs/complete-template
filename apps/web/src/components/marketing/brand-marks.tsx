import type { SVGProps } from "react"

import { Database } from "lucide-react"

/**
 * Brand marks — petite bibliothèque de logos inline utilisée par les
 * constellations de la section "Why DeesseJS is different".
 *
 * Décision d'architecture : tout est **inline** plutôt que passé par
 * `simple-icons` ou `lobe-icons` parce que :
 *   - Le projet a déjà une dépendance `lucide-react@1.21.0` exotique
 *     (per memory); ajouter une 2ᵉ lib de brand icons aggrave le drift.
 *   - On n'utilise ces logos que sur 3 cards, pas besoin d'un runtime
 *     complet.
 *   - Inliner permet `currentColor` partout → cohérent avec la palette
 *     mono (logos = exception per [[feedback-deessejs-mono-design-language]]
 *     nuance).
 *
 * Sources (toutes MIT ou CC0, attribution respectée dans les commentaires
 * de chaque composant) :
 *   - Agents (LobeHub `lobe-icons` CC0) : Codex, Claude Code, OpenCode,
 *     Gemini
 *   - Pi (multica-ai/multica MIT, sourced from pi.dev/logo.svg) : Pi
 *   - Infra (Better-Auth official brand kit MIT) : Better-Auth
 *   - Runtime : Hono + Drizzle + Vercel via `@icons-pack/react-simple-icons`
 *     (déjà installé) — ré-exportés ici pour symétrie d'API
 *   - Neon (DB) : fallback lucide `<Database />` car le logo officiel
 *     n'est pas publiquement packagé (le brand kit est privé sur le
 *     CDN de neon.com)
 *
 * API uniforme : chaque composant accepte un `className` ET hérite de
 * tous les `<svg>` props via spread. Style de base `text-foreground`
 * (mono). Pour forcer une couleur de marque, override via className
 * (ex: `className="text-blue-500"`).
 */

type MarkProps = SVGProps<SVGSVGElement>

/* ─── Agents (LobeHub CC0) ───────────────────────────────────────────── */

export function CodexMark(props: MarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      {...props}
    >
      <path
        clipRule="evenodd"
        d="M8.086.457a6.105 6.105 0 013.046-.415c1.333.153 2.521.72 3.564 1.7a.117.117 0 00.107.029c1.408-.346 2.762-.224 4.061.366l.063.03.154.076c1.357.703 2.33 1.77 2.918 3.198.278.679.418 1.388.421 2.126a5.655 5.655 0 01-.18 1.631.167.167 0 00.04.155 5.982 5.982 0 011.578 2.891c.385 1.901-.01 3.615-1.183 5.14l-.182.22a6.063 6.063 0 01-2.934 1.851.162.162 0 00-.108.102c-.255.736-.511 1.364-.987 1.992-1.199 1.582-2.962 2.462-4.948 2.451-1.583-.008-2.986-.587-4.21-1.736a.145.145 0 00-.14-.032c-.518.167-1.04.191-1.604.185a5.924 5.924 0 01-2.595-.622 6.058 6.058 0 01-2.146-1.781c-.203-.269-.404-.522-.551-.821a7.74 7.74 0 01-.495-1.283 6.11 6.11 0 01-.017-3.064.166.166 0 00.008-.074.115.115 0 00-.037-.064 5.958 5.958 0 01-1.38-2.202 5.196 5.196 0 01-.333-1.589 6.915 6.915 0 01.188-2.132c.45-1.484 1.309-2.648 2.577-3.493.282-.188.55-.334.802-.438.286-.12.573-.22.861-.304a.129.129 0 00.087-.087A6.016 6.016 0 015.635 2.31C6.315 1.464 7.132.846 8.086.457zm-.804 7.85a.848.848 0 00-1.473.842l1.694 2.965-1.688 2.848a.849.849 0 001.46.864l1.94-3.272a.849.849 0 00.007-.854l-1.94-3.393zm5.446 6.24a.849.849 0 000 1.695h4.848a.849.849 0 000-1.696h-4.848z"
      />
    </svg>
  )
}

export function ClaudeCodeMark(props: MarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      {...props}
    >
      <path
        clipRule="evenodd"
        d="M20.998 10.949H24v3.102h-3v3.028h-1.487V20H18v-2.921h-1.487V20H15v-2.921H9V20H7.488v-2.921H6V20H4.487v-2.921H3V14.05H0V10.95h3V5h17.998v5.949zM6 10.949h1.488V8.102H6v2.847zm10.51 0H18V8.102h-1.49v2.847z"
      />
    </svg>
  )
}

export function OpenCodeMark(props: MarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      {...props}
    >
      <path d="M16 6H8v12h8V6zm4 16H4V2h16v20z" />
    </svg>
  )
}

export function GeminiMark(props: MarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      {...props}
    >
      <path d="M20.616 10.835a14.147 14.147 0 01-4.45-3.001 14.111 14.111 0 01-3.678-6.452.503.503 0 00-.975 0 14.134 14.134 0 01-3.679 6.452 14.155 14.155 0 01-4.45 3.001c-.65.28-1.318.505-2.002.678a.502.502 0 000 .975c.684.172 1.35.397 2.002.677a14.147 14.147 0 014.45 3.001 14.112 14.112 0 013.679 6.453.502.502 0 00.975 0c.172-.685.397-1.351.677-2.003a14.145 14.145 0 013.001-4.45 14.113 14.113 0 016.453-3.678.503.503 0 000-.975 13.245 13.245 0 01-2.003-.678z" />
    </svg>
  )
}

/* ─── Pi (multica-ai MIT, sourced from pi.dev/logo.svg) ─────────────── */

export function PiMark(props: MarkProps) {
  return (
    <svg
      viewBox="0 0 800 800"
      fill="none"
      aria-hidden
      {...props}
    >
      <rect width="800" height="800" rx="150" fill="currentColor" />
      <path
        fill="#fff"
        fillRule="evenodd"
        d="M165.29 165.29H517.36V400H400V517.36H282.65V634.72H165.29ZM282.65 282.65V400H400V282.65Z"
      />
      <path fill="#fff" d="M517.36 400H634.72V634.72H517.36Z" />
    </svg>
  )
}

/* ─── Cursor (LobeHub CC0) ──────────────────────────────────────────── */

export function CursorMark(props: MarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      {...props}
    >
      <path d="M22.106 5.68L12.5.135a.998.998 0 00-.998 0L1.893 5.68a.84.84 0 00-.419.726v11.186c0 .3.16.577.42.727l9.607 5.547a.999.999 0 00.998 0l9.608-5.547a.84.84 0 00.42-.727V6.407a.84.84 0 00-.42-.726zm-.603 1.176L12.228 22.92c-.063.108-.228.064-.228-.061V12.34a.59.59 0 00-.295-.51l-9.11-5.26c-.107-.062-.063-.228.062-.228h18.55c.264 0 .428.286.296.514z" />
    </svg>
  )
}

/* ─── Runtime (simple-icons, re-wrapped) ─────────────────────────────── */

// Note: Hono, Drizzle, Vercel sont déjà consommés ailleurs via les
// imports `SiHono` / `SiDrizzle` / `SiVercel` de
// `@icons-pack/react-simple-icons`. On les ré-exporte ici en wrappers
// locaux pour symétrie d'API avec les autres brand marks et pour
// permettre un override `className` cohérent.

import { SiHono, SiDrizzle, SiVercel, SiZod, SiResend } from "@icons-pack/react-simple-icons"

export const HonoMark = SiHono
export const DrizzleMark = SiDrizzle
export const VercelMark = SiVercel
export const ZodMark = SiZod
export const ResendMark = SiResend

/* ─── Better-Auth (official brand kit, MIT) ─────────────────────────── */

export function BetterAuthMark(props: MarkProps) {
  return (
    <svg
      viewBox="0 0 400 300"
      fill="currentColor"
      aria-hidden
      {...props}
    >
      <path d="M200 0h200v300H200V200h100V100H200zM0 0h100v100h100v100H100v100H0z" />
    </svg>
  )
}

/* ─── oRPC (official icon from orpc.dev, MIT) ────────────────────────── */

// Source: https://orpc.dev/icon.svg — a solid circle with a hairline
// outer ring. Two-tone via currentColor for the outer ring and a
// slightly muted foreground for the inner fill.
export function OrpcMark(props: MarkProps) {
  return (
    <svg
      viewBox="0 0 600 600"
      fill="none"
      aria-hidden
      {...props}
    >
      <circle
        cx="300"
        cy="300"
        r="299"
        fill="currentColor"
        className="text-foreground"
      />
      <circle
        cx="300"
        cy="300"
        r="298"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="text-muted-foreground"
      />
    </svg>
  )
}

/* ─── Neon (DB) — fallback lucide <Database /> ───────────────────────── */

// Justification du fallback : Neon ne publie pas de brand kit
// accessible (CDN privé, pas de npm package officiel). On utilise un
// pictogramme lucide honnête, sans prétendre représenter leur logo.

export function NeonMark({ className, ...props }: MarkProps) {
  return <Database className={className} aria-hidden {...props} />
}
