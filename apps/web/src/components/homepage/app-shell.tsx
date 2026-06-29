import type { ReactNode } from "react"

import {
  Bell,
  CreditCard,
  Database,
  FileText,
  LayoutDashboard,
  LifeBuoy,
  type LucideIcon,
  MessageSquare,
  Settings,
  Shield,
  Users,
} from "lucide-react"

import { cn } from "@workspace/ui/lib/utils"

/**
 * AppShell — fake SaaS chrome used as the wrapper for content variants
 * in the "Everything you need to scale" capability pillars.
 *
 * Per [[feedback-illustrations-use-css-not-svg]] (2026-06-29): feature
 * cards should be CSS product mockups, not decorative SVG. This shell
 * is the chrome of that mockup — sidebar nav + top bar + content area.
 *
 * The pattern is lifted from Sophie Wodey's flowline repo
 * (src/components/home/app-shell.tsx), adapted for DeesseJS's nav.
 *
 * Visual rules:
 *   - Mono palette, no chromatic accents
 *   - Hairline borders, no shadows
 *   - Active nav item: bg-muted + text-foreground, no left bar
 *   - Sidebar nav uses lucide icons (already a project dep)
 *
 * The shell is purely presentational. The content variant (e.g.
 * UsersContent) is responsible for the actual mock content. This split
 * keeps each component small and lets us swap content without changing
 * the chrome — same AppShell renders 8 different pages.
 */

export type AppShellNavKey =
  | "dashboard"
  | "users"
  | "billing"
  | "storage"
  | "logs"
  | "settings"

interface NavItem {
  key: AppShellNavKey
  label: string
  icon: LucideIcon
}

const navItems: readonly NavItem[] = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "users", label: "Users", icon: Users },
  { key: "billing", label: "Billing", icon: CreditCard },
  { key: "storage", label: "Storage", icon: Database },
  { key: "logs", label: "Logs", icon: FileText },
  { key: "settings", label: "Settings", icon: Settings },
] as const

const footerItems: readonly NavItem[] = [
  { key: "dashboard", label: "Docs", icon: MessageSquare },
  { key: "dashboard", label: "Support", icon: LifeBuoy },
] as const

interface AppShellProps {
  /** Which sidebar nav item is currently active. */
  active: AppShellNavKey
  /** The mock page content (Users table, Schema browser, etc.). */
  children: ReactNode
  /** Optional className override on the outer frame. */
  className?: string
}

export function AppShell({ active, children, className }: AppShellProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border/40 bg-background",
        className,
      )}
    >
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden w-44 shrink-0 border-r border-border/40 bg-muted/20 sm:flex sm:flex-col">
          {/* Brand */}
          <div className="flex h-12 items-center gap-2 border-b border-border/40 px-4">
            <span className="flex h-5 w-5 items-center justify-center rounded bg-foreground text-[10px] font-bold text-background">
              ▲
            </span>
            <span className="text-sm font-semibold tracking-tight text-foreground">
              deessejs
            </span>
          </div>

          {/* Nav */}
          <nav className="flex-1 space-y-0.5 p-2">
            {navItems.map((item) => {
              const isActive = item.key === active
              return (
                <div
                  key={item.label}
                  className={cn(
                    "flex h-7 items-center gap-2 rounded-md px-2 text-xs",
                    isActive
                      ? "bg-foreground/5 font-medium text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  <item.icon className="size-3.5" aria-hidden />
                  <span>{item.label}</span>
                </div>
              )
            })}
          </nav>

          {/* Footer nav */}
          <div className="space-y-0.5 border-t border-border/40 p-2">
            {footerItems.map((item) => (
              <div
                key={item.label}
                className="flex h-7 items-center gap-2 rounded-md px-2 text-xs text-muted-foreground"
              >
                <item.icon className="size-3.5" aria-hidden />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* Main */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Top bar */}
          <header className="flex h-12 items-center justify-between border-b border-border/40 px-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Shield className="size-3.5" aria-hidden />
              <span className="font-mono">deessejs.com/dashboard</span>
            </div>
            <div className="flex items-center gap-3">
              <Bell className="size-3.5 text-muted-foreground" aria-hidden />
              <div className="flex size-6 items-center justify-center rounded-full bg-foreground/10 text-[10px] font-semibold text-foreground">
                SK
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-hidden">{children}</main>
        </div>
      </div>
    </div>
  )
}