import Link from "next/link";
import { Calendar } from "lucide-react";

import { Badge } from "@workspace/ui/components/ui/badge";
import { Card, CardContent } from "@workspace/ui/components/ui/card";

import { cn } from "@workspace/ui/lib/utils";

import type {
  Release,
  ReleaseCategory,
  ReleaseGroup,
} from "@/lib/blog/types";
import { RELEASE_CATEGORY_LABELS } from "@/lib/blog/types";

/**
 * Keep-a-Changelog category → Badge variant mapping.
 * "Added" → solid (high-signal). "Removed" → outline (de-emphasized).
 * Distinct from PostCard: changelog is more technical (mono code, dense),
 * blog is more marketing-y (larger text, softer hierarchy).
 */
const CATEGORY_VARIANT: Record<
  ReleaseCategory,
  "default" | "secondary" | "outline"
> = {
  added: "default",
  changed: "secondary",
  fixed: "secondary",
  deprecated: "outline",
  removed: "outline",
  security: "default",
};

/**
 * ReleaseGroupCard — one release inside a version cohort.
 *
 * Visually distinct from PostCard:
 *   - No Card primitive (we want the borders to merge cleanly with the
 *     group header)
 *   - Denser padding (p-4 instead of p-6)
 *   - Larger mono version (text-2xl)
 *   - Categories badges inline with version
 *
 * Pattern per Stripe changelog: utility first, no marketing copy.
 */
function ReleaseGroupCard({ release }: { release: Release }) {
  return (
    <article className="border-b border-border/40 px-1 py-4 last:border-b-0">
      <div className="flex flex-wrap items-center gap-2">
        <code className="rounded bg-muted px-2 py-0.5 font-mono text-sm font-medium text-foreground">
          v{release.version}
        </code>
        {release.categories.map((cat) => (
          <Badge
            key={cat}
            variant={CATEGORY_VARIANT[cat]}
            className="text-xs"
          >
            {RELEASE_CATEGORY_LABELS[cat]}
          </Badge>
        ))}
      </div>
      <h3 className="mt-2 text-base font-semibold tracking-tight">
        <Link
          href={release.url}
          className="transition-colors hover:text-foreground"
        >
          {release.title}
        </Link>
      </h3>
      {release.description ? (
        <p className="mt-1 text-pretty text-sm leading-relaxed text-muted-foreground">
          {release.description}
        </p>
      ) : null}
      <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
        <Calendar className="size-3" />
        <time dateTime={release.date}>{release.date}</time>
      </div>
    </article>
  );
}

/**
 * ReleaseGroup — one version cohort with a sticky-style header.
 *
 * Pattern per Linear changelog (gold standard): each cohort gets a bold
 * label that creates visual separation between groups. The label is
 * not a link (anchors come later as the archive grows).
 *
 * Visual treatment:
 *   - Sticky-style header with mono uppercase tracking-widest label
 *   - Vertical stack of ReleaseGroupCard inside
 *   - Bottom border per release (subtle hairline rhythm)
 */
export function ReleaseGroupView({
  group,
  isFirst = false,
}: {
  group: ReleaseGroup
  isFirst?: boolean
}) {
  return (
    <section
      className={cn(
        "rounded-xl border border-border/40 bg-card/30 p-4 sm:p-6",
        !isFirst && "mt-6",
      )}
    >
      <header className="mb-2 flex items-center justify-between gap-3 border-b border-border/40 pb-3">
        <div className="flex items-baseline gap-3">
          <h2 className="font-mono text-lg font-semibold tracking-tight text-foreground">
            v{group.label}.x
          </h2>
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {group.releases.length} release
            {group.releases.length === 1 ? "" : "s"}
          </span>
        </div>
      </header>
      <div>
        {group.releases.map((release) => (
          <ReleaseGroupCard key={release.slug} release={release} />
        ))}
      </div>
    </section>
  );
}