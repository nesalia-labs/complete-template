import {
  Activity,
  ArrowRight,
  BookOpen,
  Check,
  CreditCard,
  Lock,
  Terminal,
  Users,
  Zap,
} from "lucide-react"
import {
  SiDrizzle,
  SiNextdotjs,
  SiPostgresql,
  SiShadcnui,
  SiStripe,
  SiTailwindcss,
  SiTypescript,
} from "@icons-pack/react-simple-icons"

import { HomeFooter } from "@/components/footers/home-footer"
import { HomeHeader } from "@/components/headers/home-header"
import { AppShell } from "@/components/homepage/app-shell"
import { BentoSection } from "@/components/homepage/bento-section"
import { BillingContent } from "@/components/homepage/billing-content"
import { DXContent } from "@/components/homepage/dx-content"
import { ObservabilityContent } from "@/components/homepage/observability-content"
import { UsersContent } from "@/components/homepage/users-content"
import PixelBlast from "@/components/homepage/pixel-blast"
import { CodePreview } from "@/components/homepage/code-preview"
import { WhyDifferentSection } from "@/components/marketing/why-different-section"

import { tiers } from "@/lib/pricing/data"

import Link from "next/link"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/ui/accordion"
import { Button } from "@workspace/ui/components/ui/button"
import { Badge } from "@workspace/ui/components/ui/badge"
import { Separator } from "@workspace/ui/components/ui/separator"
import { Card } from "@workspace/ui/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/ui/tooltip"

// --- DONNÉES STATIQUES ---

// The previous 4-card hero tier + 15-card standard tier were removed on
// 2026-06-29 and replaced with a single capability pillar (claim +
// AppShell + UsersContent). See the FEATURES SECTION comment below.
// TODO: add 7 more pillars (Data, Backend, Comms, Billing, Storage,
// Observability, DX) with their own content variants.

const faqs = [
  {
    question: "What does \"agentic\" mean in DeesseJS?",
    answer: "Your AI agents are the executors, not just the users. Every surface in DeesseJS has a tool your agent calls: auth, billing, storage, jobs, notifications, API. Your agents run multi-step workflows against a complete, wired system — not a blank canvas.",
  },
  {
    question: "How is this different from supastarter or MakerKit?",
    answer: "They optimize AI for the developer — Claude Code, Cursor, Codex integration. DeesseJS optimizes the system for AI agents. Your agents don't just help you code — they run on DeesseJS, call the tools directly, and build your product while you sleep.",
  },
  {
    question: "What if DeesseJS doesn't work for my project?",
    answer: "14-day money-back guarantee — no questions asked. If your agents don't save you 3 months of development work in the first 14 days, email us for a full refund.",
  },
  {
    question: "Do I need to know how to prompt my agents?",
    answer: "You need to know what you want. The prompts and workflows are in the AI Agent Workflow Library (Team tier). Your agents handle the implementation.",
  },
  {
    question: "Is there a free version?",
    answer: "Yes — DeesseJS Lite. It's an open-source subset of the template, free to download, ships with auth + billing + the agent primitives. Try it before you buy the full template.",
  },
  {
    question: "What about DeesseJS Cloud?",
    answer: "Coming Q3 2026. It's the managed variant — your agents run on infrastructure we operate. Private beta opens before public launch.",
  },
  {
    question: "Can I use my own database and infrastructure?",
    answer: "Yes. DeesseJS is self-hosted by default — you own every line of code. Deploy on Vercel, Docker, your own infra. No vendor lock-in.",
  },
  {
    question: "When does the founder pricing close?",
    answer: "July 31, 2026. After that, regular pricing kicks in at $399 / $599 / $999. Founding-member ($99) is capped at 50 and closes when the cap hits.",
  },
]

// "Why choose" section was extracted on 2026-06-26 into
// apps/web/src/components/marketing/why-different-section.tsx
// (see lib/marketing/why-different.ts for the data). The previous
// 6-card generic grid answered 4 different questions at once; the
// new 3-card section answers ONE (vs alternatives) with verifiable
// claims.

// --- PAGE PRINCIPALE ---

export default function HomePage() {
  const bodyContainerClass = "mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8"
  const sectionPadding = "py-24 sm:py-32"

  return (
    <div className="flex min-h-screen flex-col selection:bg-foreground selection:text-background">
      <main className="flex-1 border-x border-border/40 mx-auto w-full max-w-[1400px]">
        {/* HERO SECTION */}
        <section className="relative flex min-h-[calc(100vh-3.5rem)] items-center justify-center overflow-hidden py-24">
          {/* WebGL pixel-blast background */}
          <PixelBlast
            variant="square"
            pixelSize={4}
            color="#ffffff"
            patternScale={2}
            patternDensity={1}
            pixelSizeJitter={0}
            enableRipples
            rippleSpeed={0.4}
            rippleThickness={0.12}
            rippleIntensityScale={1.5}
            liquid={false}
            liquidStrength={0.12}
            liquidRadius={1.2}
            liquidWobbleSpeed={5}
            speed={0.5}
            edgeFade={0.25}
            transparent
            style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, opacity: 0.1 }}
          />

          <div className={`relative z-10 ${bodyContainerClass} flex max-w-4xl flex-col items-center text-center`}>
            <Link
              href="/blog/agents-are-now-first-class-developers"
              className="mb-8 flex items-center justify-center space-x-2 rounded-full border border-border/80 bg-background px-3 py-1.5 text-sm font-medium shadow-sm backdrop-blur-md transition-colors hover:bg-muted/50"
            >
              <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
              <span className="text-foreground">Agents are now first-class developers</span>
              <ArrowRight className="ml-1 h-3.5 w-3.5 text-muted-foreground" />
            </Link>
            
            <h1 className="text-6xl md:text-heading-48 lg:text-heading-64 text-balance text-center max-w-6xl font-semibold tracking-tighter text-foreground">
              The SaaS template that never sleeps.
            </h1>

            <p className="mt-8 max-w-2xl text-pretty text-lg font-medium text-muted-foreground sm:text-xl">
              Every surface your agents need — auth, billing, jobs, storage, notifications, API — is already wired. Your agents don&apos;t start from scratch. They start from a complete system.
            </p>
            
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button
                size="lg"
                className="h-12 gap-2 rounded-full px-8 text-base font-semibold shadow-md transition-transform hover:scale-105"
                nativeButton={false}
                render={<Link href="/pricing" />}
              >
                Start building
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 gap-2 rounded-full px-8 text-base font-medium shadow-sm backdrop-blur-md"
                nativeButton={false}
                render={<Link href="/docs" />}
              >
                <BookOpen className="h-4 w-4" />
                Read the docs
              </Button>
            </div>
            <p className="mt-6 text-sm font-medium text-muted-foreground/80">
              Free during beta · No credit card required
            </p>

            {/* Stack — 8 main techs, smaller */}
            <TooltipProvider delay={150}>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 px-6">
                {([
                  { name: "Next.js", Icon: SiNextdotjs },
                  { name: "TypeScript", Icon: SiTypescript },
                  { name: "Tailwind CSS", Icon: SiTailwindcss },
                  { name: "shadcn/ui", Icon: SiShadcnui },
                  { name: "PostgreSQL", Icon: SiPostgresql },
                  { name: "Drizzle ORM", Icon: SiDrizzle },
                  { name: "Better Auth", Icon: Lock },
                  { name: "Stripe", Icon: SiStripe },
                ] as const).map(({ name, Icon }) => (
                  <Tooltip key={name}>
                    <TooltipTrigger>
                      <Icon
                        size={20}
                        aria-label={name}
                        className="text-muted-foreground transition-colors hover:text-foreground"
                      />
                    </TooltipTrigger>
                    <TooltipContent>{name}</TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </TooltipProvider>

            {/* CodePreview — static IDE mockup */}
            <div className="mt-12 w-full max-w-4xl">
              <CodePreview />
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className={`border-t border-border/40 ${sectionPadding}`}>
          <div className={bodyContainerClass}>
            <div className="mb-16 max-w-3xl">
              <h2 className="text-balance text-4xl font-bold tracking-tighter text-foreground sm:text-5xl">
                Everything you need to scale.
              </h2>
              <p className="mt-4 text-pretty text-lg text-muted-foreground">
                Skip the boilerplate. We&apos;ve wired together the best tools in the ecosystem so you can focus on your product.
              </p>
            </div>

            {/* Capability pillar — proof of concept (2026-06-29)
                Replaces the previous hero tier (4 cards) + standard tier (15 cards)
                grid that was redundant with "Why DeesseJS is different" and
                showed generic lucide icons instead of the actual product.

                Pattern: AppShell + Content variant from Sophie's flowline repo.
                Each pillar pairs a strong claim with a CSS-built mini admin page
                showing what the buyer will actually ship.

                TODO: add 7 more pillars (Data, Backend, Comms, Billing, Storage,
                Observability, DX) — same AppShell, different content variants. */}
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              {/* Claim side */}
              <div>
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border/40 bg-background">
                  <Users className="size-5 text-foreground" aria-hidden />
                </div>
                <h3 className="mb-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                  Auth, the admin you actually ship.
                </h3>
                <p className="text-pretty text-base leading-relaxed text-muted-foreground">
                  Email, OAuth, passkeys, and 2FA wired to a typed RPC layer.
                  You get the full Users page — search, roles, invites, status —
                  on day one. No auth boilerplate, no separate admin to build.
                </p>
                <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-foreground" aria-hidden />
                    Typed RPC, not REST — agents call the surface directly
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-foreground" aria-hidden />
                    Multi-tenant sessions, per-org roles
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-foreground" aria-hidden />
                    Invite flow with email + magic link
                  </li>
                </ul>
              </div>

              {/* Mockup side */}
              <div>
                <AppShell active="users">
                  <UsersContent />
                </AppShell>
              </div>
            </div>

            {/* Billing pillar — proof of concept for the "non-table" content variant.
                Reuses AppShell with active="billing". Alternated layout (mockup on
                the left, claim on the right) per Sophie's reversed pattern. */}
            <div className="mt-24 grid gap-12 lg:grid-cols-2 lg:items-center">
              {/* Mockup side (alternated to left) */}
              <div className="lg:order-1">
                <AppShell active="billing">
                  <BillingContent />
                </AppShell>
              </div>

              {/* Claim side (alternated to right) */}
              <div className="lg:order-2">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border/40 bg-background">
                  <CreditCard className="size-5 text-foreground" aria-hidden />
                </div>
                <h3 className="mb-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                  Billing, the way Stripe would have built it.
                </h3>
                <p className="text-pretty text-base leading-relaxed text-muted-foreground">
                  Subscriptions, invoices, MRR — wired with Stripe under the hood.
                  You get the full revenue dashboard on day one. Per-seat, metered,
                  flat-rate — all supportable through one typed RPC surface.
                </p>
                <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-foreground" aria-hidden />
                    Stripe Checkout + Customer Portal pre-wired
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-foreground" aria-hidden />
                    Typed subscription state on the client (no webhooks to babysit)
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-foreground" aria-hidden />
                    Per-tenant invoices, one query away
                  </li>
                </ul>
              </div>
            </div>

            {/* Observability pillar — third proof of concept. Alternated back to
                left/right (claim left, mockup right) to break the rhythm.
                Demonstrates the ScrollArea primitive (added 2026-06-29) and
                inline SVG bar charts (no Recharts dep). */}
            <div className="mt-24 grid gap-12 lg:grid-cols-2 lg:items-center">
              {/* Claim side */}
              <div>
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border/40 bg-background">
                  <Activity className="size-5 text-foreground" aria-hidden />
                </div>
                <h3 className="mb-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                  Logs and metrics, shipped together.
                </h3>
                <p className="text-pretty text-base leading-relaxed text-muted-foreground">
                  OpenTelemetry-compatible exporters wired through day one.
                  Tail logs by request ID, drill from a 5xx alert to the exact
                  handler. No agent glue, no separate Datadog bill.
                </p>
                <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-foreground" aria-hidden />
                    Logs, metrics, traces — same surface, same query
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-foreground" aria-hidden />
                    Per-tenant retention, exportable on request
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-foreground" aria-hidden />
                    Agent-callable: query the last 50 errors as a typed RPC
                  </li>
                </ul>
              </div>

              {/* Mockup side */}
              <div>
                <AppShell active="logs">
                  <ObservabilityContent />
                </AppShell>
              </div>
            </div>

            {/* DX pillar — fourth proof of concept. The 3-column kanban needs
                more horizontal space than other mockups, so the grid ratio
                is inverted: the mockup gets the wider column (~60%), the
                claim gets the narrower (~40%). Combined with lg:order-1/2
                to keep the alternation (mockup on the left). */}
            <div className="mt-24 grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:items-center">
              {/* Mockup side (alternated to left) */}
              <div className="lg:order-1">
                <AppShell active="dashboard">
                  <DXContent />
                </AppShell>
              </div>

              {/* Claim side (alternated to right) */}
              <div className="lg:order-2">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border/40 bg-background">
                  <Terminal className="size-5 text-foreground" aria-hidden />
                </div>
                <h3 className="mb-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                  Your agents, on a kanban you can read.
                </h3>
                <p className="text-pretty text-base leading-relaxed text-muted-foreground">
                  AGENTS.md ships in the repo. Every workflow — bootstrap, migrate,
                  seed, deploy — is typed, versioned, and assigned to an agent.
                  You watch them work. You ship while they run.
                </p>
                <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-foreground" aria-hidden />
                    AGENTS.md read by Codex, Claude Code, Pi, Cursor, OpenCode
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-foreground" aria-hidden />
                    Workflows are typed procedures — agents call them like any API
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4 text-foreground" aria-hidden />
                    Live run history, no separate CI dashboard to babysit
                  </li>
                </ul>
              </div>
            </div>

            {/* Bento grid — supporting features (Email hero, Storage, Search,
                Docs wide, i18n, Webhooks, Git, Notif). Sits below the 4
                capability pillars as a compressed scan surface. */}
            <BentoSection />
          </div>
        </section>

        {/* WHY DIFFERENT SECTION — 3 verifiable differentiators vs other templates */}
        <section id="why" className={`border-t border-border/40 ${sectionPadding}`}>
          <div className={bodyContainerClass}>
            <WhyDifferentSection />
          </div>
        </section>

        {/* PRICING TEASER — compact 3-card row linking to /pricing for full detail */}
        <section id="pricing" className={`border-t border-border/40 ${sectionPadding}`}>
          <div className={bodyContainerClass}>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-balance text-4xl font-bold tracking-tighter text-foreground sm:text-5xl">
                One-time price. Lifetime access.
              </h2>
              <p className="mt-4 text-pretty text-lg text-muted-foreground">
                No subscriptions. Lock in the founder rate before it closes.
              </p>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {tiers.map((tier) => (
                <Card
                  key={tier.name}
                  className="flex flex-col rounded-lg border bg-background p-6 shadow-sm"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold tracking-tight text-foreground">
                        {tier.name}
                      </span>
                      {tier.highlighted ? (
                        <Badge className="rounded-full border-transparent bg-foreground px-2 py-0.5 text-[10px] font-medium text-background [&_svg]:size-3 flex items-center gap-1">
                          <Zap className="size-3" aria-hidden />
                          Most popular
                        </Badge>
                      ) : null}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {tier.description}
                    </p>
                  </div>

                  <Separator className="my-4 bg-border" />

                  <div className="flex items-baseline gap-1 font-semibold">
                    <span className="text-base leading-none">$</span>
                    <span className="text-3xl leading-none tracking-tight">
                      {tier.founderPrice}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    one-time · lifetime updates
                  </p>

                  <ul className="mt-4 flex flex-col gap-1.5">
                    {tier.features.slice(0, 3).map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <Check
                          className="size-4 shrink-0 text-foreground"
                          aria-hidden
                        />
                        <span className="line-clamp-1">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/pricing"
                    className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-foreground hover:underline"
                  >
                    See full pricing
                    <ArrowRight className="size-3.5" />
                  </Link>
                </Card>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Button
                variant="outline"
                className="h-9 gap-2 rounded-md px-6 text-sm font-medium"
                nativeButton={false}
                render={<Link href="/pricing" />}
              >
                Compare all features
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className={`border-t border-border/40 bg-muted/10 ${sectionPadding}`}>
          <div className={bodyContainerClass}>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-balance text-3xl font-bold tracking-tighter text-foreground sm:text-4xl">
                Questions, answered.
              </h2>
              <p className="mt-4 text-pretty text-lg text-muted-foreground">
                What &quot;agentic&quot; means, how the refund works, and where the founder pricing closes.
              </p>
            </div>
            <Accordion className="mx-auto mt-16 max-w-2xl w-full">
              {faqs.map((faq) => (
                <AccordionItem key={faq.question} value={faq.question} className="border-border/50">
                  <AccordionTrigger className="text-left text-base font-medium hover:no-underline hover:text-foreground text-foreground/90 transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className={`relative border-t border-border/40 overflow-hidden ${sectionPadding}`}>
          {/* Subtle glow behind CTA */}
          <div className="absolute left-1/2 top-1/2 -z-10 h-[400px] w-[800px] -translate-x-1/2 -translate-y-1/2 opacity-20 blur-[100px] bg-foreground/20 rounded-full pointer-events-none"></div>
          
          <div className={`${bodyContainerClass} flex flex-col items-center text-center`}>
            <h2 className="text-balance text-4xl font-bold tracking-tighter text-foreground sm:text-6xl">
              Ready to ship your agents?
            </h2>
            <p className="mt-6 max-w-2xl text-pretty text-lg font-medium text-muted-foreground sm:text-xl">
              Get started in minutes. No credit card required.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button
                size="lg"
                className="h-12 gap-2 rounded-full px-8 text-base font-semibold shadow-md transition-transform hover:scale-105"
                nativeButton={false}
                render={<Link href="/pricing" />}
              >
                Get DeesseJS
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 gap-2 rounded-full px-8 text-base font-medium shadow-sm backdrop-blur-md"
                nativeButton={false}
                render={<Link href="/docs" />}
              >
                Read the docs
              </Button>
            </div>
          </div>
        </section>
      </main>

      <HomeFooter />
    </div>
  )
}