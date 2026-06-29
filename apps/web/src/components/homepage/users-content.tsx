import { Filter, MoreHorizontal, Plus, Search } from "lucide-react"

import { Avatar, AvatarFallback } from "@workspace/ui/components/ui/avatar"
import { Badge } from "@workspace/ui/components/ui/badge"
import { Button } from "@workspace/ui/components/ui/button"
import { Input } from "@workspace/ui/components/ui/input"
import { cn } from "@workspace/ui/lib/utils"

/**
 * UsersContent — a fake Users admin page, the content variant that
 * renders inside <AppShell active="users"> for the "Everything you
 * need to scale" capability pillar.
 *
 * Per [[feedback-illustrations-use-css-not-svg]] (2026-06-29): capability
 * cards must be CSS product mockups, not decorative SVG. This is the
 * "what you actually ship" view of the Auth capability — a real users
 * table the buyer would see in their admin on day one.
 *
 * Pattern lifted from Sophie Wodey's flowline repo
 * (src/components/home/task-content.tsx) — same 5-element rhythm:
 *   1. Page header (title + count + primary action)
 *   2. Filter / search row
 *   3. Tab strip (here: column headers)
 *   4. Body rows
 *   5. Pagination / footer
 *
 * Data is hardcoded mock data. No fetch, no state, no interactivity.
 * The whole point is "look like a real screenshot."
 *
 * Visual rules (mono DeesseJS):
 *   - Role badges: outline variant, no chromatic fill
 *   - Status dots: text-foreground (not emerald)
 *   - Email in font-mono for the typographic signal
 *   - Avatars: initials only (no images — keeps it crisp at small size)
 */

interface MockUser {
  initials: string
  name: string
  email: string
  role: "Owner" | "Admin" | "Member"
  status: "active" | "invited" | "disabled"
  lastSeen: string
}

const mockUsers: MockUser[] = [
  {
    initials: "SK",
    name: "Sara Klein",
    email: "sara@acme.com",
    role: "Owner",
    status: "active",
    lastSeen: "2h ago",
  },
  {
    initials: "TR",
    name: "Tom Rivers",
    email: "tom@acme.com",
    role: "Admin",
    status: "active",
    lastSeen: "1d ago",
  },
  {
    initials: "LP",
    name: "Leo Park",
    email: "leo@acme.com",
    role: "Member",
    status: "active",
    lastSeen: "3d ago",
  },
  {
    initials: "MC",
    name: "Mia Chen",
    email: "mia@acme.com",
    role: "Member",
    status: "invited",
    lastSeen: "—",
  },
  {
    initials: "JW",
    name: "June Walsh",
    email: "june@acme.com",
    role: "Admin",
    status: "active",
    lastSeen: "1w ago",
  },
]

const roleBadgeVariant: Record<MockUser["role"], "default" | "outline" | "secondary"> = {
  Owner: "default",
  Admin: "outline",
  Member: "secondary",
}

const statusDotClass: Record<MockUser["status"], string> = {
  active: "bg-foreground",
  invited: "bg-muted-foreground/40",
  disabled: "bg-muted-foreground/20",
}

export function UsersContent() {
  return (
    <div className="flex flex-col">
      {/* 1. Page header */}
      <div className="flex items-center justify-between gap-3 border-b border-border/40 px-4 py-3">
        <div className="flex items-baseline gap-2">
          <h3 className="text-sm font-semibold tracking-tight text-foreground">
            Users
          </h3>
          <span className="font-mono text-xs text-muted-foreground">
            47 total
          </span>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="h-7 gap-1.5 px-2.5 text-xs"
        >
          <Plus className="size-3" aria-hidden />
          Invite user
        </Button>
      </div>

      {/* 2. Filter / search row */}
      <div className="flex items-center gap-2 border-b border-border/40 px-4 py-2">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-2 top-1/2 size-3 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            placeholder="Search users…"
            className="h-7 pl-7 text-xs"
            aria-label="Search users"
          />
        </div>
        <Button
          size="sm"
          variant="outline"
          className="h-7 gap-1.5 px-2 text-xs"
        >
          <Filter className="size-3" aria-hidden />
          Role
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="h-7 gap-1.5 px-2 text-xs"
        >
          <Filter className="size-3" aria-hidden />
          Status
        </Button>
      </div>

      {/* 3+4. Table */}
      <div className="flex-1">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border/40 text-left">
              <th className="px-4 py-2 font-medium text-muted-foreground">Name</th>
              <th className="px-2 py-2 font-medium text-muted-foreground">Email</th>
              <th className="px-2 py-2 font-medium text-muted-foreground">Role</th>
              <th className="px-2 py-2 font-medium text-muted-foreground">Status</th>
              <th className="px-2 py-2 font-medium text-muted-foreground">Last seen</th>
              <th className="w-8 px-2 py-2" aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {mockUsers.map((user) => (
              <tr
                key={user.email}
                className="border-b border-border/20 last:border-b-0"
              >
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <Avatar size="sm" className="size-6 bg-muted">
                      <AvatarFallback className="text-[10px] font-semibold text-foreground">
                        {user.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-foreground">{user.name}</span>
                  </div>
                </td>
                <td className="px-2 py-2 font-mono text-muted-foreground">
                  {user.email}
                </td>
                <td className="px-2 py-2">
                  <Badge
                    variant={roleBadgeVariant[user.role]}
                    className="h-5 px-1.5 text-[10px] font-medium"
                  >
                    {user.role}
                  </Badge>
                </td>
                <td className="px-2 py-2">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        "size-1.5 rounded-full",
                        statusDotClass[user.status],
                      )}
                      aria-hidden
                    />
                    <span className="capitalize text-muted-foreground">
                      {user.status}
                    </span>
                  </div>
                </td>
                <td className="px-2 py-2 text-muted-foreground">{user.lastSeen}</td>
                <td className="px-2 py-2">
                  <MoreHorizontal
                    className="size-3.5 text-muted-foreground"
                    aria-hidden
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 5. Pagination */}
      <div className="flex items-center justify-between border-t border-border/40 px-4 py-2 text-xs text-muted-foreground">
        <span className="font-mono">1–5 of 47</span>
        <div className="flex items-center gap-1">
          <Button size="sm" variant="ghost" className="h-6 px-1.5 text-xs">
            ◀
          </Button>
          <Button size="sm" variant="ghost" className="h-6 px-1.5 text-xs">
            ▶
          </Button>
        </div>
      </div>
    </div>
  )
}