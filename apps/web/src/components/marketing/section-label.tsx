import type { ReactNode } from "react"

/**
 * SectionLabel — small mono uppercase tracking-widest label
 * that sits above a section headline.
 *
 * Pattern lifted from Sophie Wodey's flowline repo
 * ([[reference-flowline-decomposition]]): the same 3-line component
 * is reused 9+ times across her home page. We do the same.
 *
 * Visual rules (mono brand):
 *   - `font-mono` for the document/research vibe
 *   - `text-xs` so it reads as a label, not a heading
 *   - `uppercase tracking-widest` for the typographic signature
 *   - `text-muted-foreground` so it sits behind the headline
 *   - `mb-4` for the standard headline→label gap
 *
 * Usage:
 *   <SectionLabel>What you won't find elsewhere</SectionLabel>
 *   <h2>Why DeesseJS is different.</h2>
 */
export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mb-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
      {children}
    </p>
  )
}
