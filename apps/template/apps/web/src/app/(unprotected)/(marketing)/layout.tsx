import type { PropsWithChildren } from "react"

/**
 * Layout for public marketing pages (landing, pricing, legal, blog, etc.).
 *
 * The shared top nav is provided by the parent (unprotected)/layout.tsx.
 * This layout only adds the page-specific chrome: the centered main area
 * and the footer.
 *
 * Per docs/internal/architecture/03-web-app/pages.md § "Surface: Marketing".
 */
export default function MarketingLayout({ children }: PropsWithChildren) {
  return (
    <>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        © DeesseJS — coming soon
      </footer>
    </>
  )
}
