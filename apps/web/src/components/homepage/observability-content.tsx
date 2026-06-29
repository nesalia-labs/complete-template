import { Pause } from "lucide-react"

import { Badge } from "@workspace/ui/components/ui/badge"
import { ScrollArea } from "@workspace/ui/components/ui/scroll-area"

import { cn } from "@workspace/ui/lib/utils"

/**
 * ObservabilityContent — fake Logs page for the "Everything you need
 * to scale" capability pillar. Renders inside <AppShell active="logs">.
 *
 * Per [[feedback-illustrations-use-css-not-svg]] (2026-06-29):
 * capability cards are CSS product mockups. This one shows what the
 * buyer ships for observability on day one — a Datadog-style terminal
 * view of logs with a metrics strip below.
 *
 * Pattern lifted from Sophie Wodey's flowline repo (DashboardContent
 * uses mixed KPI + insights blocks). Here we mix terminal + bar charts
 * to convey "logs + metrics in one screen."
 *
 * Visual rules (mono DeesseJS):
 *   - Log level badges: outline (INFO), secondary (WARN), destructive (ERROR)
 *     — destructive IS allowed per [[feedback-deessejs-mono-design-language]]
 *     ("Status colors are limited to: destructive (red for errors)")
 *   - Mono font for timestamps, paths, request IDs, latency
 *   - Mini bar charts inline SVG (no Recharts dependency)
 *   - ScrollArea primitive (added 2026-06-29) wraps the log feed so the
 *     "tail" feels live without being a fake animation
 */

type LogLevel = "INFO" | "WARN" | "ERROR"

interface MockLogLine {
  time: string
  level: LogLevel
  message: string
  status: string
  latency: string
  requestId: string
}

const mockLogs: MockLogLine[] = [
  {
    time: "12:42:18",
    level: "INFO",
    message: "POST /api/users",
    status: "200",
    latency: "42ms",
    requestId: "req_8x2k",
  },
  {
    time: "12:42:15",
    level: "WARN",
    message: "rate limit approaching (87/100)",
    status: "—",
    latency: "—",
    requestId: "req_8x2j",
  },
  {
    time: "12:42:09",
    level: "ERROR",
    message: "failed to send email to leo@acme.com",
    status: "500",
    latency: "1.2s",
    requestId: "req_8x2h",
  },
  {
    time: "12:42:01",
    level: "INFO",
    message: "POST /auth/login sara@acme.com",
    status: "200",
    latency: "89ms",
    requestId: "req_8x2g",
  },
  {
    time: "12:41:58",
    level: "INFO",
    message: "GET  /users?org=acme",
    status: "200",
    latency: "18ms",
    requestId: "req_8x2f",
  },
  {
    time: "12:41:44",
    level: "INFO",
    message: "POST /billing/checkout",
    status: "200",
    latency: "312ms",
    requestId: "req_8x2d",
  },
  {
    time: "12:41:33",
    level: "INFO",
    message: "GET  /billing/subscriptions",
    status: "200",
    latency: "24ms",
    requestId: "req_8x2c",
  },
  {
    time: "12:41:18",
    level: "WARN",
    message: "session expired for tom@acme.com",
    status: "401",
    latency: "8ms",
    requestId: "req_8x2b",
  },
  {
    time: "12:41:02",
    level: "INFO",
    message: "POST /users leo@acme.com (invite)",
    status: "201",
    latency: "67ms",
    requestId: "req_8x2a",
  },
  {
    time: "12:40:48",
    level: "INFO",
    message: "GET  /storage/avatars/sara.png",
    status: "200",
    latency: "12ms",
    requestId: "req_8x29",
  },
]

const levelBadgeVariant: Record<LogLevel, "outline" | "secondary" | "destructive"> = {
  INFO: "outline",
  WARN: "secondary",
  ERROR: "destructive",
}

interface MetricCard {
  label: string
  value: string
  /** 12 data points, normalized 0..1 — rendered as mini bar chart */
  bars: number[]
}

const metrics: MetricCard[] = [
  {
    label: "Requests/min",
    value: "142",
    bars: [0.6, 0.7, 0.5, 0.8, 0.9, 0.7, 0.85, 0.75, 0.95, 0.8, 0.7, 0.65],
  },
  {
    label: "5xx rate",
    value: "0.3%",
    bars: [0.05, 0.1, 0.05, 0.15, 0.2, 0.1, 0.05, 0.15, 0.1, 0.2, 0.15, 0.1],
  },
  {
    label: "p99 latency",
    value: "89ms",
    bars: [0.4, 0.5, 0.6, 0.45, 0.55, 0.7, 0.6, 0.5, 0.65, 0.8, 0.7, 0.6],
  },
  {
    label: "Memory",
    value: "234 MB",
    bars: [0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.78],
  },
]

function MiniBars({ values }: { values: number[] }) {
  // 60×16 viewBox; 12 bars of width 3 with 2 gap.
  const barWidth = 3
  const gap = 2
  const totalWidth = values.length * (barWidth + gap) - gap
  return (
    <svg
      viewBox={`0 0 ${totalWidth} 16`}
      className="h-4 w-full text-foreground"
      fill="currentColor"
      aria-hidden
    >
      {values.map((v, i) => {
        const h = Math.max(2, v * 14)
        return (
          <rect
            key={i}
            x={i * (barWidth + gap)}
            y={16 - h}
            width={barWidth}
            height={h}
            rx={0.5}
            opacity={0.5}
          />
        )
      })}
    </svg>
  )
}

export function ObservabilityContent() {
  return (
    <div className="flex h-full flex-col">
      {/* 1. Filter bar */}
      <div className="flex items-center justify-between border-b border-border/40 px-4 py-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">Logs</span>
          <span className="font-mono">· Last 1h · auto-scroll</span>
        </div>
        <button
          type="button"
          className="inline-flex h-6 items-center gap-1 rounded-md border border-border/40 bg-background px-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
        >
          <Pause className="size-2.5" aria-hidden />
          Pause
        </button>
      </div>

      {/* 2. Terminal log feed */}
      <ScrollArea className="flex-1">
        <div className="font-mono text-[11px] leading-relaxed">
          {mockLogs.map((log, i) => (
            <div
              key={`${log.time}-${i}`}
              className={cn(
                "flex items-center gap-2 border-b border-border/20 px-4 py-1.5 last:border-b-0",
                log.level === "ERROR" && "bg-destructive/5",
              )}
            >
              <span className="shrink-0 text-muted-foreground tabular-nums">
                {log.time}
              </span>
              <Badge
                variant={levelBadgeVariant[log.level]}
                className="h-4 w-12 justify-center px-0 text-[9px] font-medium"
              >
                {log.level}
              </Badge>
              <span className="min-w-0 flex-1 truncate text-foreground">
                {log.message}
              </span>
              <span
                className={cn(
                  "shrink-0 tabular-nums",
                  log.status === "500"
                    ? "text-destructive"
                    : log.status === "401"
                      ? "text-muted-foreground"
                      : "text-muted-foreground",
                )}
              >
                {log.status}
              </span>
              <span className="w-12 shrink-0 text-right text-muted-foreground tabular-nums">
                {log.latency}
              </span>
              <span className="w-16 shrink-0 text-right text-muted-foreground/60">
                {log.requestId}
              </span>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* 3. Metrics strip */}
      <div className="grid grid-cols-4 divide-x divide-border/40 border-t border-border/40">
        {metrics.map((metric) => (
          <div key={metric.label} className="px-3 py-2">
            <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
              {metric.label}
            </p>
            <p className="mt-0.5 font-mono text-sm font-semibold tabular-nums text-foreground">
              {metric.value}
            </p>
            <div className="mt-1">
              <MiniBars values={metric.bars} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}