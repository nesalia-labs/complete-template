import { codeToHtml } from "shiki"

interface CodeBlockProps {
  code: string
  language?: string
  title?: string
  size?: "sm" | "lg"
  tabs?: boolean
}

const sizeClasses = {
  sm: "p-3 text-xs",
  lg: "p-6 text-sm",
}

/**
 * CodeBlock — server-rendered syntax-highlighted code block.
 *
 * Uses Shiki's `codeToHtml` (the bundled-converter API) to produce a fully
 * styled <pre> at request time. Inline styles are emitted by Shiki so the
 * output works regardless of the consumer's Tailwind theme — but the
 * theme choice (github-dark) means the code panel always renders dark,
 * matching the convention of marketing hero code blocks.
 *
 * Wrap in a parent with `overflow-hidden` if you want the border to clip
 * to your container's radius.
 */
export async function CodeBlock({
  code,
  language = "typescript",
  title,
  size = "sm",
  tabs = true,
}: CodeBlockProps) {
  const html = await codeToHtml(code, {
    lang: language,
    theme: "github-dark",
  })

  return (
    <div className="h-full w-full overflow-hidden rounded-none border border-border bg-background">
      {title && (
        <div className="flex items-center gap-1.5 border-b bg-muted/30 px-3 py-2">
          <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <div className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
          <div className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-2 font-mono text-[13px] text-muted-foreground">
            {title}
          </span>
        </div>
      )}
      <div
        className={`${sizeClasses[size]}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}
