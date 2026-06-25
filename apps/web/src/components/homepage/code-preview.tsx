import { FileText, Folder } from "lucide-react"

import { CodeBlock } from "#components/code-block"

const EXAMPLE_CODE = `import { Button } from "@workspace/ui"

export default function Home() {
  return (
    <Button>Get started</Button>
  )
}
`

/**
 * CodePreview — hero centerpiece of the DeesseJS landing page.
 *
 * A static IDE window mockup: mac-dot header + "monorepo" title on top, a
 * 12-col grid body with a file tree on the left and a Shiki-rendered code
 * block on the right. No interactivity — the goal is the visual "this is
 * the codebase" signal in the first fold.
 *
 * Decorative only; the file tree is hardcoded and the code block shows the
 * same `app/page.tsx` snippet regardless. Replace `EXAMPLE_CODE` to update.
 */
export function CodePreview() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/50 bg-background shadow-2xl">
      {/* Window header */}
      <div className="flex h-10 items-center gap-2 border-b border-border/50 bg-muted/30 px-4">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-red-500/80" />
          <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
          <div className="h-3 w-3 rounded-full bg-green-500/80" />
        </div>
        <div className="ml-4 font-mono text-xs text-muted-foreground">
          monorepo
        </div>
        <div className="ml-auto font-mono text-xs text-muted-foreground">
          apps/web/src/app/page.tsx
        </div>
      </div>

      {/* IDE Content */}
      <div className="grid grid-cols-1 divide-y divide-border/50 md:grid-cols-12 md:divide-x md:divide-y-0">
        {/* File Tree */}
        <div className="bg-muted/10 p-6 font-mono text-sm leading-relaxed md:col-span-4 lg:col-span-3">
          <div className="text-muted-foreground/60 mb-2">EXPLORER</div>
          <div className="text-foreground/90">
            <div className="flex items-center gap-1.5 py-0.5">
              <Folder className="h-3.5 w-3.5 text-muted-foreground" /> apps/
            </div>
            <div className="flex items-center gap-1.5 py-0.5 pl-4">
              <Folder className="h-3.5 w-3.5 text-muted-foreground" /> web/
            </div>
            <div className="flex items-center gap-1.5 py-0.5 pl-8 text-muted-foreground">
              <FileText className="h-3.5 w-3.5" /> page.tsx
            </div>
            <div className="flex items-center gap-1.5 py-0.5 pl-8 text-muted-foreground">
              <FileText className="h-3.5 w-3.5" /> layout.tsx
            </div>
            <div className="mt-1 flex items-center gap-1.5 py-0.5 pl-4">
              <Folder className="h-3.5 w-3.5 text-muted-foreground" /> cloud/
            </div>
            <div className="mt-2 flex items-center gap-1.5 py-0.5">
              <Folder className="h-3.5 w-3.5 text-muted-foreground" /> packages/
            </div>
            <div className="flex items-center gap-1.5 py-0.5 pl-4 text-muted-foreground">
              <Folder className="h-3.5 w-3.5" /> ui/
            </div>
            <div className="flex items-center gap-1.5 py-0.5 pl-4 text-muted-foreground">
              <Folder className="h-3.5 w-3.5" /> config/
            </div>
          </div>
        </div>

        {/* Code Editor — Shiki-rendered via @workspace/ui CodeBlock */}
        <div className="overflow-hidden md:col-span-8 lg:col-span-9">
          <CodeBlock code={EXAMPLE_CODE} language="tsx" size="lg" />
        </div>
      </div>
    </div>
  )
}
