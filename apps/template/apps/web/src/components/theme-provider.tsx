"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

/**
 * The app's root theme provider. Wraps the entire React tree so the
 * `next-themes` library can manage the `dark` class on `<html>` (and
 * `data-theme` for per-tenant branding — feature 10.5 of DeesseJS).
 *
 * `attribute="class"` is the standard shadcn pattern. `defaultTheme="system"`
 * means the OS preference is respected on first load.
 *
 * `suppressHydrationWarning` on `<html>` (in app/layout.tsx) is REQUIRED
 * to silence the React warning when next-themes mutates the className
 * client-side after SSR.
 */
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}