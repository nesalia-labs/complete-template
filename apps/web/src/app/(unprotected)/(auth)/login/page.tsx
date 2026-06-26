import type { Metadata } from "next"
import { Quote } from "lucide-react"

import { LoginCard } from "#components/auth/login-card"

export const metadata: Metadata = {
  title: "Sign in — DeesseJS",
  description: "Sign in to your DeesseJS account.",
}

export default function LoginPage() {
  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] grid-cols-1 md:grid-cols-2">
      {/* Form side */}
      <div className="flex items-center justify-center border-border border-b p-8 md:border-b-0 md:border-r md:p-12 lg:p-16">
        <LoginCard />
      </div>

      {/* Branding side */}
      <div className="flex items-center justify-center bg-muted/20 p-8 md:p-12 lg:p-16">
        <div className="max-w-md text-center">
          <Quote className="mx-auto size-8 text-muted-foreground/40" />
          <blockquote className="mt-6 text-balance text-xl font-medium tracking-tight text-foreground sm:text-2xl">
            The SaaS template that never sleeps.
          </blockquote>
          <p className="mt-4 text-sm text-muted-foreground">
            Auth, billing, jobs, storage — every surface your agents need,
            wired from day one.
          </p>
        </div>
      </div>
    </div>
  )
}
