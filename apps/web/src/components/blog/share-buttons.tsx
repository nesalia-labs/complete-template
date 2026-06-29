"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";

import { cn } from "@workspace/ui/lib/utils";

/**
 * ShareButtons — 3 share actions for an article.
 *
 * Pattern per convention (Vercel blog, dev.to): inline icon buttons in
 * a horizontal row.
 *
 * - Twitter: pre-filled tweet with title + URL
 * - LinkedIn: shares URL with title (LinkedIn auto-fetches via OG)
 * - Copy link: navigator.clipboard with success state
 *
 * Brand icons (X, LinkedIn) are inline SVGs since lucide-react@1.21.0
 * dropped brand icons (Twitter, Linkedin exports don't exist).
 */
export function ShareButtons({
  url,
  title,
  className,
}: {
  url: string
  title: string
  className?: string
}) {
  const [copied, setCopied] = useState(false)

  const fullUrl = makeAbsoluteUrl(url)
  const twitterIntent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(fullUrl)}`
  const linkedInIntent = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(fullUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard API can fail in insecure contexts (no HTTPS).
      // Silently no-op — the URL is visible in the address bar.
    }
  }

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <a
        href={twitterIntent}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Share "${title}" on X (Twitter)`}
        className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted/30 hover:text-foreground"
      >
        {/* X (Twitter) brand mark */}
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-3"
          aria-hidden
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </a>
      <a
        href={linkedInIntent}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Share "${title}" on LinkedIn`}
        className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted/30 hover:text-foreground"
      >
        {/* LinkedIn brand mark */}
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-3.5"
          aria-hidden
        >
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      </a>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? "Link copied" : "Copy link"}
        className={cn(
          "inline-flex size-7 items-center justify-center rounded-md transition-colors hover:bg-muted/30",
          copied
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        {copied ? (
          <Check className="size-3.5" aria-hidden />
        ) : (
          <Link2 className="size-3.5" aria-hidden />
        )}
      </button>
    </div>
  )
}

/**
 * Resolve a path to an absolute URL for share intents.
 * Uses window.location in the browser; falls back to the path-only URL on SSR.
 */
function makeAbsoluteUrl(path: string): string {
  if (typeof window === "undefined") return path
  if (path.startsWith("http")) return path
  return new URL(path, window.location.origin).toString()
}