import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, BookOpen } from "lucide-react"

import { Button } from "@workspace/ui/components/ui/button"

import { HomeFooter } from "@/components/footers/home-footer"

import { ComparisonBlock } from "@/components/pricing/comparison-block"
import { FounderBanner } from "@/components/pricing/founder-banner"
import { FeatureMatrix } from "@/components/pricing/feature-matrix"
import { GuaranteeStrip } from "@/components/pricing/guarantee-strip"
import { MockupProofRow } from "@/components/pricing/mockup-proof-row"
import { PricingFaq } from "@/components/pricing/pricing-faq"
import { TierGrid } from "@/components/pricing/tier-grid"

import { comparisonBlocks, founderOffer, guarantee, pricingFaqs, tiers } from "@/lib/pricing/data"
import { featureCategories } from "@/lib/pricing/matrix"

export const metadata: Metadata = {
  title: "Pricing — DeesseJS",
  description:
    "Pick your plan. Three tiers, lifetime updates. One-time price, no subscriptions.",
  alternates: {
    canonical: "/pricing",
  },
  openGraph: {
    title: "Pricing — DeesseJS",
    description:
      "Pick your plan. Three tiers, lifetime updates. One-time price, no subscriptions.",
    url: "/pricing",
  },
}

const bodyContainerClass = "mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8"
const sectionPadding = "py-24 sm:py-32"

/**
 * /pricing — dedicated pricing route.
 *
 * Inherits the HomeHeader + bordered main shell from (unprotected)/layout.tsx.
 * Renders <HomeFooter /> itself (the layout does not include it).
 *
 * Section order follows the Raze 4-layer content model:
 *   1. TierGrid            (Layer 1: Package — leads the page)
 *   2. FeatureMatrix       (Layer 2: Differences — the actual comparison)
 *   3. ComparisonBlock     (Layer 3: Exceptions / vs competitors)
 *   4. MockupProofRow      (Layer 4: what you ship on day 1)
 *   5. GuaranteeStrip      (reassurance)
 *   6. PricingFaq          (pricing-specific Q&A)
 *   7. Final CTA           (twin buttons, same pattern as home)
 */
export default function PricingPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: pricingFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="flex min-h-screen flex-col selection:bg-foreground selection:text-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <main className="flex-1 border-x border-border/40 mx-auto w-full max-w-[1400px]">
        {/* 1. Tier grid + founder banner */}
        <section
          id="tiers"
          className={`border-b border-border/40 ${sectionPadding}`}
        >
          <div className={bodyContainerClass}>
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h1 className="text-balance text-4xl font-bold tracking-tighter text-foreground sm:text-5xl">
                Pick your plan.
              </h1>
              <p className="mt-4 text-pretty text-lg text-muted-foreground">
                Four tiers, one-time price, lifetime updates. Every tier
                ships with the full wired runtime — higher tiers unlock
                team-scale features and priority support.
              </p>
            </div>

            {/* Founder banner — urgency strip (per SaaSHero pattern) */}
            <div className="mx-auto mb-12 max-w-4xl">
              <FounderBanner offer={founderOffer} />
            </div>

            <TierGrid tiers={tiers} />
          </div>
        </section>

        {/* 2. Feature matrix */}
        <section
          id="compare"
          className={`border-b border-border/40 ${sectionPadding}`}
        >
          <div className={bodyContainerClass}>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-balance text-4xl font-bold tracking-tighter text-foreground sm:text-5xl">
                Compare every feature.
              </h2>
              <p className="mt-4 text-pretty text-lg text-muted-foreground">
                The full breakdown across all 3 tiers. Hover any row label
                for details.
              </p>
            </div>
            <FeatureMatrix categories={featureCategories} tiers={tiers} />
          </div>
        </section>

        {/* 3. Comparison block */}
        <section className={`border-b border-border/40 ${sectionPadding}`}>
          <div className={bodyContainerClass}>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-balance text-3xl font-bold tracking-tighter text-foreground sm:text-4xl">
                How we compare.
              </h2>
              <p className="mt-4 text-pretty text-base text-muted-foreground">
                What you get with DeesseJS that other SaaS templates don&apos;t ship.
              </p>
            </div>
            <ComparisonBlock blocks={comparisonBlocks} />
          </div>
        </section>

        {/* 4. Proof row */}
        <section className={`border-b border-border/40 bg-muted/10 ${sectionPadding}`}>
          <div className={bodyContainerClass}>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-balance text-3xl font-bold tracking-tighter text-foreground sm:text-4xl">
                What you ship on day 1.
              </h2>
              <p className="mt-4 text-pretty text-base text-muted-foreground">
                Every surface is wired, tested, and ready to deploy.
              </p>
            </div>
            <MockupProofRow />
          </div>
        </section>

        {/* 5. Guarantee */}
        <section className={`border-b border-border/40 ${sectionPadding}`}>
          <div className={bodyContainerClass}>
            <GuaranteeStrip guarantee={guarantee} />
          </div>
        </section>

        {/* 6. FAQ */}
        <section className={`border-b border-border/40 bg-muted/10 ${sectionPadding}`}>
          <div className={bodyContainerClass}>
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="text-balance text-3xl font-bold tracking-tighter text-foreground sm:text-4xl">
                Pricing questions.
              </h2>
              <p className="mt-4 text-pretty text-base text-muted-foreground">
                Money-back guarantee, free tier, and how the founder pricing works.
              </p>
            </div>
            <PricingFaq faqs={pricingFaqs} />
          </div>
        </section>

        {/* 7. Final CTA — pricing-specific (founder urgency) */}
        <section
          id="claim"
          className={`relative overflow-hidden ${sectionPadding}`}
        >
          <div className="absolute left-1/2 top-1/2 -z-10 h-[400px] w-[800px] -translate-x-1/2 -translate-y-1/2 opacity-20 blur-[100px] bg-foreground/20 rounded-full pointer-events-none" />
          <div className={`${bodyContainerClass} flex flex-col items-center text-center`}>
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Final offer
            </p>
            <h2 className="mt-4 text-balance text-4xl font-bold tracking-tighter text-foreground sm:text-6xl">
              Lock in $99 founder pricing.
            </h2>
            <p className="mt-6 max-w-2xl text-pretty text-lg font-medium text-muted-foreground sm:text-xl">
              37 of 50 spots claimed. Closes July 31, 2026.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button
                size="lg"
                className="h-12 gap-2 rounded-full px-8 text-base font-semibold shadow-md transition-transform hover:scale-105"
                nativeButton={false}
                render={
                  <a href="mailto:founders@deessejs.com?subject=Claim%20DeesseJS%20founder%20pricing" />
                }
              >
                Claim founder pricing
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 gap-2 rounded-full px-8 text-base font-medium shadow-sm backdrop-blur-md"
                nativeButton={false}
                render={<Link href="#compare" />}
              >
                Compare all features
              </Button>
            </div>
          </div>
        </section>
      </main>

      <HomeFooter />
    </div>
  )
}