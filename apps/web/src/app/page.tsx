"use client"

import { useState } from "react"

export default function Home() {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <main className="w-full max-w-2xl space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            DeesseJS
          </h1>
          <p className="text-lg text-muted-foreground">
            AI-native code intelligence for your IDE
          </p>
        </div>
      </main>
    </div>
  )
}
