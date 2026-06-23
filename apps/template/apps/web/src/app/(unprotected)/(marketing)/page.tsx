/**
 * Homepage. Placeholder content for M1 — to be replaced with a real
 * landing page in a follow-up. Keep the heading + subhead + 2 CTAs
 * so the page is non-empty and the shadcn/Base UI/Tailwind wiring is
 * visibly working end-to-end.
 *
 * URL: /
 */
export default function HomePage() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-5xl flex-col items-center justify-center px-4 text-center">
      <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
        DeesseJS
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
        The commercial Next.js SaaS template. Replace this with the real
        landing page.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <a
          href="/signup"
          className="rounded-md bg-primary px-5 py-2.5 font-medium text-primary-foreground hover:bg-primary/90"
        >
          Get started
        </a>
        <a
          href="/login"
          className="rounded-md border border-border bg-background px-5 py-2.5 font-medium text-foreground hover:bg-accent"
        >
          Log in
        </a>
      </div>
    </section>
  )
}