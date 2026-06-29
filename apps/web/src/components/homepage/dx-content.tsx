import {
  CheckCircle2,
  Clock,
  GitBranch,
  Loader2,
  PlayCircle,
  Plus,
} from "lucide-react"

import { Button } from "@workspace/ui/components/ui/button"

import { cn } from "@workspace/ui/lib/utils"

/**
 * DXContent — fake Workflows kanban for the "Everything you need to
 * scale" capability pillar. Renders inside <AppShell active="...">.
 *
 * Materializes the central DeesseJS claim: AGENTS.md + agent-callable
 * workflows. The visitor sees a real kanban with workflows assigned to
 * specific agents (Claude Code, Cursor, Codex, Pi).
 *
 * Per [[feedback-illustrations-use-css-not-svg]] (2026-06-29): capability
 * cards are CSS product mockups. Pattern: 3-column kanban with workflow
 * cards showing name, trigger tag, assigned agent, and status.
 *
 * Visual rules:
 *   - 3 columns: Backlog (outline muted), In progress (active border),
 *     Done (outline with check icon and muted name)
 *   - Each workflow card: icon + name + trigger tag + agent + relative time
 *   - No emojis — lucide icons only, mono palette
 *   - Footer line: "Last agent run · <agent> · <time>" with status
 */

type ColumnId = "backlog" | "in-progress" | "done"

interface MockWorkflow {
  name: string
  trigger: string
  agent: string
  relativeTime: string
  status: "queued" | "running" | "done"
}

const backlog: MockWorkflow[] = [
  {
    name: "bootstrap-project",
    trigger: "on clone",
    agent: "Claude Code",
    relativeTime: "—",
    status: "queued",
  },
  {
    name: "add-stripe-billing",
    trigger: "manual",
    agent: "Cursor",
    relativeTime: "—",
    status: "queued",
  },
  {
    name: "run-e2e-tests",
    trigger: "weekly",
    agent: "Pi",
    relativeTime: "—",
    status: "queued",
  },
]

const inProgress: MockWorkflow[] = [
  {
    name: "add-posts-cms",
    trigger: "manual",
    agent: "Codex",
    relativeTime: "12 min",
    status: "running",
  },
  {
    name: "open-pr",
    trigger: "on push",
    agent: "OpenCode",
    relativeTime: "1 min",
    status: "running",
  },
]

const done: MockWorkflow[] = [
  {
    name: "run-migrations",
    trigger: "pre-commit",
    agent: "Claude Code",
    relativeTime: "2h ago",
    status: "done",
  },
  {
    name: "seed-users",
    trigger: "manual",
    agent: "Claude Code",
    relativeTime: "1d ago",
    status: "done",
  },
  {
    name: "update-deps",
    trigger: "weekly",
    agent: "Pi",
    relativeTime: "3d ago",
    status: "done",
  },
]

interface ColumnDef {
  id: ColumnId
  label: string
  count: number
  icon: typeof Clock
  items: MockWorkflow[]
  accent?: boolean
}

const columns: ColumnDef[] = [
  {
    id: "backlog",
    label: "Backlog",
    count: backlog.length,
    icon: Clock,
    items: backlog,
  },
  {
    id: "in-progress",
    label: "In progress",
    count: inProgress.length,
    icon: Loader2,
    items: inProgress,
    accent: true,
  },
  {
    id: "done",
    label: "Done",
    count: 24,
    icon: CheckCircle2,
    items: done,
  },
]

const triggerIcon: Record<string, typeof GitBranch> = {
  "on clone": GitBranch,
  manual: PlayCircle,
  weekly: Clock,
  "on push": GitBranch,
  "pre-commit": GitBranch,
}

function WorkflowCard({
  workflow,
  inDoneColumn,
}: {
  workflow: MockWorkflow
  inDoneColumn: boolean
}) {
  const TriggerIcon = triggerIcon[workflow.trigger] ?? GitBranch

  return (
    <div
      className={cn(
        "rounded-md border border-border/40 bg-background p-2 transition-colors hover:bg-muted/10",
        workflow.status === "running" && "border-foreground/30 bg-muted/20",
      )}
    >
      <div className="flex items-center gap-1.5">
        <TriggerIcon
          className={cn(
            "size-3 shrink-0",
            inDoneColumn ? "text-muted-foreground" : "text-foreground",
          )}
          aria-hidden
        />
        <span
          className={cn(
            "font-mono text-[11px] font-medium",
            inDoneColumn
              ? "text-foreground/60 line-through decoration-muted-foreground/40"
              : "text-foreground",
          )}
        >
          {workflow.name}
        </span>
      </div>
      <div className="mt-1 flex items-center justify-between gap-1 text-[10px]">
        <span className="font-mono uppercase tracking-wider text-muted-foreground">
          {workflow.trigger}
        </span>
        <span className="font-mono text-muted-foreground">
          {workflow.relativeTime}
        </span>
      </div>
      <div className="mt-1 flex items-center gap-1 text-[10px]">
        <span className="font-mono text-muted-foreground/70">agent:</span>
        <span className="font-mono font-medium text-foreground/80">
          {workflow.agent}
        </span>
      </div>
    </div>
  )
}

export function DXContent() {
  return (
    <div className="flex h-full flex-col">
      {/* 1. Page header */}
      <div className="flex items-center justify-between border-b border-border/40 px-4 py-3">
        <div className="flex items-baseline gap-2">
          <h3 className="text-sm font-semibold tracking-tight text-foreground">
            Workflows
          </h3>
          <span className="font-mono text-xs text-muted-foreground">
            29 total
          </span>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="h-7 gap-1.5 px-2.5 text-xs"
        >
          <Plus className="size-3" aria-hidden />
          New workflow
        </Button>
      </div>

      {/* 2. Kanban columns */}
      <div className="grid flex-1 grid-cols-3 divide-x divide-border/40">
        {columns.map((col) => {
          const Icon = col.icon
          return (
            <div key={col.id} className="flex flex-col">
              {/* Column header */}
              <div className="flex items-center justify-between border-b border-border/40 px-3 py-2">
                <div className="flex items-center gap-1.5">
                  <Icon
                    className={cn(
                      "size-3",
                      col.accent ? "text-foreground" : "text-muted-foreground",
                      col.id === "in-progress" && "animate-spin",
                    )}
                    aria-hidden
                  />
                  <span
                    className={cn(
                      "font-mono text-[10px] font-medium uppercase tracking-widest",
                      col.accent ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {col.label}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-muted-foreground">
                  ({col.count})
                </span>
              </div>

              {/* Column body */}
              <div className="flex-1 space-y-1.5 p-2">
                {col.items.map((workflow) => (
                  <WorkflowCard
                    key={workflow.name}
                    workflow={workflow}
                    inDoneColumn={col.id === "done"}
                  />
                ))}
                {col.id === "done" && col.count > col.items.length && (
                  <button
                    type="button"
                    className="w-full rounded-md border border-dashed border-border/40 px-2 py-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:bg-muted/10 hover:text-foreground"
                  >
                    View {col.count - col.items.length} more →
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* 3. Footer status line */}
      <div className="flex items-center justify-between border-t border-border/40 px-4 py-2 text-[10px]">
        <span className="font-mono text-muted-foreground">
          Last agent run ·{" "}
          <span className="text-foreground">Claude Code</span> · 2h ago
        </span>
        <span className="flex items-center gap-1 font-mono text-foreground">
          <CheckCircle2 className="size-3" aria-hidden />
          no errors
        </span>
      </div>
    </div>
  )
}