"use client";

import { useEffect, useState } from "react";

import { cn } from "@workspace/ui/lib/utils";

/**
 * TableOfContents — auto-generated TOC from the article's h2/h3 headings.
 *
 * Strategy: after mount, query the article container (passed via
 * `targetId`) for all h2/h3 elements. Build a nested list (h3 indented
 * under the previous h2). Each item gets an id (slugified from text) so
 * we can scroll-spy.
 *
 * Scroll-spy: tracks which heading is currently in view using
 * IntersectionObserver. The active heading gets text-foreground + border-l;
 * inactive headings get text-muted-foreground.
 *
 * Pattern: Vercel docs / Fumadocs / Stripe docs — sticky sidebar TOC on
 * desktop, hidden on mobile (the article is short enough not to need it).
 */
interface TocItem {
  id: string
  text: string
  level: 2 | 3
}

export function TableOfContents({ targetId }: { targetId: string }) {
  const [items, setItems] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)

  // 1. Extract headings on mount + when target changes.
  useEffect(() => {
    const target = document.getElementById(targetId)
    if (!target) return

    const headings = target.querySelectorAll<HTMLHeadingElement>("h2, h3")

    const next: TocItem[] = []
    headings.forEach((h) => {
      // Skip h2 inside the article header area (already in page header).
      // Use the text content as id seed if no id is set.
      if (!h.id) {
        h.id = slugify(h.textContent || "")
      }
      const level = h.tagName === "H3" ? 3 : 2
      next.push({ id: h.id, text: h.textContent || "", level })
    })
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(next)
  }, [targetId])

  // 2. Scroll-spy: highlight the heading currently in view.
  useEffect(() => {
    if (items.length === 0) return

    const target = document.getElementById(targetId)
    if (!target) return

    const headings = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => Boolean(el))

    if (headings.length === 0) return

    const visible = new Set<string>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visible.add(entry.target.id)
          } else {
            visible.delete(entry.target.id)
          }
        }
        // Pick the topmost visible heading.
        const ordered = items.map((i) => i.id).filter((id) => visible.has(id))
        setActiveId(ordered[0] ?? null)
      },
      {
        // Heading is "active" when its top crosses the upper third of the viewport.
        rootMargin: "-15% 0px -70% 0px",
        threshold: 0,
      },
    )

    headings.forEach((h) => observer.observe(h))
    return () => observer.disconnect()
  }, [items, targetId])

  if (items.length === 0) return null

  return (
    <nav aria-label="Table of contents" className="sticky top-20">
      <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        On this page
      </p>
      <ul className="space-y-1 border-l border-border/40">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={cn(
                "-ml-px block border-l py-1 pl-3 text-xs leading-relaxed transition-colors",
                item.level === 3 && "pl-6",
                activeId === item.id
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/**
 * Convert a heading text to a URL-safe id.
 * Mirrors what rehype-slug does — kept inline so we don't add a dep.
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80)
}