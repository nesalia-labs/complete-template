import { FileText, Folder } from "lucide-react"

/**
 * CodePreview — hero centerpiece of the DeesseJS landing page.
 *
 * A static IDE window mockup: mac-dot header, an "EXPLORER" file tree on the
 * left, and a syntax-highlighted code block on the right. No interactivity
 * — the goal is the visual "this is the codebase" signal in the first fold.
 *
 * Decorative only; the file tree and the code block are hardcoded to match
 * the monorepo inventory of the product.
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
        <div className="ml-4 font-mono text-xs text-muted-foreground">monorepo</div>
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
            <div className="pl-4 flex items-center gap-1.5 py-0.5">
              <Folder className="h-3.5 w-3.5 text-muted-foreground" /> web/
            </div>
            <div className="pl-8 flex items-center gap-1.5 py-0.5 text-muted-foreground">
              <FileText className="h-3.5 w-3.5" /> page.tsx
            </div>
            <div className="pl-8 flex items-center gap-1.5 py-0.5 text-muted-foreground">
              <FileText className="h-3.5 w-3.5" /> layout.tsx
            </div>
            <div className="pl-4 flex items-center gap-1.5 py-0.5 mt-1">
              <Folder className="h-3.5 w-3.5 text-muted-foreground" /> cloud/
            </div>
            <div className="flex items-center gap-1.5 py-0.5 mt-2">
              <Folder className="h-3.5 w-3.5 text-muted-foreground" /> packages/
            </div>
            <div className="pl-4 flex items-center gap-1.5 py-0.5 text-muted-foreground">
              <Folder className="h-3.5 w-3.5" /> ui/
            </div>
            <div className="pl-4 flex items-center gap-1.5 py-0.5 text-muted-foreground">
              <Folder className="h-3.5 w-3.5" /> config/
            </div>
          </div>
        </div>

        {/* Code Editor */}
        <div className="bg-background p-6 font-mono text-[13px] sm:text-sm leading-loose md:col-span-8 lg:col-span-9 overflow-x-auto">
          <div className="text-muted-foreground">
            <span className="mr-4 inline-block w-4 text-right opacity-50">1</span>
            <span className="text-purple-400">import</span> {"{ Button }"}{" "}
            <span className="text-purple-400">from</span>{" "}
            <span className="text-green-400">"@workspace/ui"</span>
          </div>
          <div className="text-muted-foreground">
            <span className="mr-4 inline-block w-4 text-right opacity-50">2</span>
          </div>
          <div className="text-muted-foreground">
            <span className="mr-4 inline-block w-4 text-right opacity-50">3</span>
            <span className="text-purple-400">export default function</span>{" "}
            <span className="text-blue-400">Home</span>() {"{"}
          </div>
          <div className="text-muted-foreground">
            <span className="mr-4 inline-block w-4 text-right opacity-50">4</span>
            <span>{"  "}</span>
            <span className="text-purple-400">return</span> (
          </div>
          <div className="text-foreground">
            <span className="mr-4 inline-block w-4 text-right text-muted-foreground opacity-50">
              5
            </span>
            <span>{"    "}</span>
            <span className="text-gray-400">&lt;</span>
            <span className="text-blue-400">Button</span>
            <span className="text-gray-400">&gt;</span>Get started
            <span className="text-gray-400">&lt;/</span>
            <span className="text-blue-400">Button</span>
            <span className="text-gray-400">&gt;</span>
          </div>
          <div className="text-muted-foreground">
            <span className="mr-4 inline-block w-4 text-right opacity-50">6</span>
            <span>{"  "})
            </span>
          </div>
          <div className="text-muted-foreground">
            <span className="mr-4 inline-block w-4 text-right opacity-50">7</span>
            <span>{"}"}</span>
          </div>
        </div>
      </div>
    </div>
  )
}