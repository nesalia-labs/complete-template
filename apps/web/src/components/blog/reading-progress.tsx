"use client";

import { useEffect, useState } from "react";

/**
 * ReadingProgress — fixed top bar showing scroll progress through an article.
 *
 * Tracks scroll position relative to the article container (passed via
 * `targetId`). Shows a thin horizontal line that fills as the reader
 * scrolls down. Uses rAF for smooth updates without scroll jank.
 *
 * Pattern: dev.to / Medium / most long-form reader sites.
 *
 * Visual rules:
 *   - Fixed to top of viewport (z-50)
 *   - Hairline (h-0.5)
 *   - Color = text-foreground (mono palette)
 *   - Origin-left so it grows right-ward
 *
 * Respects prefers-reduced-motion via no-op (we don't animate, we just
 * respond to scroll — so this is naturally accessible).
 */
export function ReadingProgress({ targetId }: { targetId: string }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target) return;

    let frame = 0;
    const update = () => {
      const rect = target.getBoundingClientRect();
      const total = target.offsetHeight - window.innerHeight;
      if (total <= 0) {
        setProgress(rect.bottom <= window.innerHeight ? 100 : 0);
        return;
      }
      // Negative rect.top means we've scrolled past the top of the target
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      setProgress((scrolled / total) * 100);
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [targetId]);

  return (
    <div
      aria-hidden
      className="fixed inset-x-0 top-0 z-50 h-0.5 bg-border/40"
    >
      <div
        className="h-full bg-foreground transition-[width] duration-75 ease-linear"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}