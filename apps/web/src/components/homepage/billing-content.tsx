import { ArrowDownRight, ArrowUpRight, CircleDot } from "lucide-react"

import { Badge } from "@workspace/ui/components/ui/badge"

import { cn } from "@workspace/ui/lib/utils"

/**
 * BillingContent — fake Billing dashboard for the "Everything you need
 * to scale" capability pillar. Renders inside <AppShell active="billing">.
 *
 * Per [[feedback-illustrations-use-css-not-svg]] (2026-06-29): capability
 * cards are CSS product mockups, not SVG diagrams. This one shows what
 * the buyer ships for billing on day one — a Stripe-style revenue
 * dashboard with KPI, sparkline, stats row, and recent invoices.
 *
 * The sparkline is hand-written inline SVG (no Recharts dependency).
 * For static mockups, a 30-point path is enough to convey "growing
 * trend with realistic variation." Recharts would be 200kb+ for the
 * same visual outcome.
 *
 * Visual rules (mono DeesseJS):
 *   - Currency in tabular-nums font-mono
 *   - Delta arrow color = foreground (not emerald/red)
 *   - Status dots text-foreground (not emerald)
 *   - Sparkline stroke = currentColor with low-opacity area fill
 */

interface MockTransaction {
  id: string
  customer: string
  amount: string
  status: "paid" | "pending" | "failed"
  relativeTime: string
}

const recentTransactions: MockTransaction[] = [
  {
    id: "INV-0047",
    customer: "Acme Inc.",
    amount: "$299.00",
    status: "paid",
    relativeTime: "2h ago",
  },
  {
    id: "INV-0046",
    customer: "Beta Co.",
    amount: "$99.00",
    status: "paid",
    relativeTime: "5h ago",
  },
  {
    id: "INV-0045",
    customer: "Gamma Labs",
    amount: "$599.00",
    status: "pending",
    relativeTime: "1d ago",
  },
  {
    id: "INV-0044",
    customer: "Delta LLC",
    amount: "$299.00",
    status: "paid",
    relativeTime: "1d ago",
  },
  {
    id: "INV-0043",
    customer: "Epsilon Corp",
    amount: "$99.00",
    status: "failed",
    relativeTime: "2d ago",
  },
]

const statusBadgeClass: Record<MockTransaction["status"], string> = {
  paid: "bg-foreground/5 text-foreground",
  pending: "bg-muted text-muted-foreground",
  failed: "bg-muted text-muted-foreground line-through",
}

const statusDotClass: Record<MockTransaction["status"], string> = {
  paid: "bg-foreground",
  pending: "bg-muted-foreground/40",
  failed: "bg-muted-foreground/20",
}

/**
 * Hand-drawn 30-day revenue sparkline (mono currentColor, 280×60 viewBox).
 * Trending up with realistic variation. Data normalized so y=10 (top) maps
 * to value 95 and y=50 (bottom) maps to value 38.
 */
const SPARKLINE_PATH =
  "M 0,47.2 L 9.7,50 L 19.3,45.1 L 29,47.9 L 38.6,43 L 48.3,40.2 L 57.9,42.3 L 67.6,38.1 L 77.2,36 L 86.9,38.8 L 96.6,34.6 L 106.2,36.7 L 115.9,32.5 L 125.5,29.7 L 135.2,31.8 L 144.8,27.5 L 154.5,29 L 164.1,26.1 L 173.8,24 L 183.4,25.4 L 193.1,21.9 L 202.8,23.3 L 212.4,19.1 L 222.1,20.5 L 231.7,17 L 241.4,14.9 L 251,17.7 L 260.7,13.5 L 270.3,12.1 L 280,10"

const SPARKLINE_AREA_PATH = `${SPARKLINE_PATH} L 280,50 L 0,50 Z`

export function BillingContent() {
  return (
    <div className="flex flex-col">
      {/* 1. KPI header */}
      <div className="flex items-baseline justify-between border-b border-border/40 px-4 py-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Revenue this month
          </p>
          <p className="mt-1 font-mono text-2xl font-semibold tabular-nums tracking-tight text-foreground">
            $4,290.00
          </p>
        </div>
        <div className="flex items-center gap-1 text-xs">
          <ArrowUpRight className="size-3 text-foreground" aria-hidden />
          <span className="font-medium text-foreground">+18%</span>
          <span className="text-muted-foreground">vs May</span>
        </div>
      </div>

      {/* 2. Sparkline */}
      <div className="border-b border-border/40 px-4 py-3">
        <svg
          viewBox="0 0 280 60"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-12 w-full text-foreground"
          aria-label="30-day revenue trend"
        >
          <path
            d={SPARKLINE_AREA_PATH}
            fill="currentColor"
            stroke="none"
            opacity={0.08}
          />
          <path d={SPARKLINE_PATH} vectorEffect="non-scaling-stroke" />
        </svg>
      </div>

      {/* 3. Stats row */}
      <div className="grid grid-cols-3 divide-x divide-border/40 border-b border-border/40">
        <div className="px-4 py-3">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Active subs
          </p>
          <p className="mt-1 flex items-baseline gap-1.5 font-mono text-base font-semibold tabular-nums text-foreground">
            47
            <CircleDot className="size-2 text-foreground" aria-hidden />
          </p>
        </div>
        <div className="px-4 py-3">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            New
          </p>
          <p className="mt-1 flex items-baseline gap-1.5 font-mono text-base font-semibold tabular-nums text-foreground">
            12
            <ArrowUpRight className="size-3 text-foreground" aria-hidden />
          </p>
        </div>
        <div className="px-4 py-3">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Churn
          </p>
          <p className="mt-1 flex items-baseline gap-1.5 font-mono text-base font-semibold tabular-nums text-foreground">
            2
            <ArrowDownRight className="size-3 text-muted-foreground" aria-hidden />
          </p>
        </div>
      </div>

      {/* 4. Recent transactions */}
      <div>
        <div className="flex items-center justify-between border-b border-border/40 px-4 py-2">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Recent
          </p>
          <button className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground">
            View all 47 →
          </button>
        </div>
        <table className="w-full text-xs">
          <tbody>
            {recentTransactions.map((tx) => (
              <tr
                key={tx.id}
                className="border-b border-border/20 last:border-b-0"
              >
                <td className="px-4 py-2 font-mono text-muted-foreground">
                  {tx.id}
                </td>
                <td className="px-2 py-2 text-foreground">{tx.customer}</td>
                <td className="px-2 py-2 text-right font-mono tabular-nums text-foreground">
                  {tx.amount}
                </td>
                <td className="px-2 py-2">
                  <Badge
                    variant="secondary"
                    className={cn(
                      "h-5 gap-1 px-1.5 text-[10px] font-medium",
                      statusBadgeClass[tx.status],
                    )}
                  >
                    <span
                      className={cn(
                        "size-1.5 rounded-full",
                        statusDotClass[tx.status],
                      )}
                      aria-hidden
                    />
                    {tx.status}
                  </Badge>
                </td>
                <td className="px-2 py-2 text-right text-muted-foreground">
                  {tx.relativeTime}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}