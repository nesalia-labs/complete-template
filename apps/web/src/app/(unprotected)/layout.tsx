import { HomeHeader } from "#components/headers/home-header"

/**
 * Layout for public routes — /changelog, /blog, /login, /signup,
 * plus any future marketing pages under (unprotected)/(marketing).
 *
 * Provides the sticky header + centered main shell. The footer is NOT
 * included here — pages that need it (e.g. the marketing home) render
 * <HomeFooter /> themselves.
 */
export default function UnprotectedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col selection:bg-foreground selection:text-background">
      <HomeHeader />
      <main className="flex-1 border-x border-border/40 mx-auto w-full max-w-[1400px]">
        {children}
      </main>
    </div>
  )
}
