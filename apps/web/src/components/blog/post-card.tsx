import Link from "next/link";
import { Calendar, Clock } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/ui/card";

import type { Post } from "@/lib/blog/types";
import { TagList } from "./tag-list";

/**
 * PostCard — grid cell on the blog index.
 *
 * Cover image (optional):
 *   When `post.cover` is set, rendered as a 16:9 hero at the top of the
 *   card with hover scale-105. When absent, the meta header sits at the
 *   top of the card body — no empty placeholder.
 *
 * Multi-author support (2026-06-29):
 *   - Uses `post.authors` (canonical array). Falls back to `post.author`.
 *   - Renders comma-separated names, each linking to its author archive.
 *
 * Tags inline (2026-06-29):
 *   - Tags render at top of card meta (next to date + reading time).
 *   - Below the description, the tag list is also rendered.
 *   - Redundant at small sizes but improves scan-ability for readers
 *     browsing the index.
 *
 * Hover affordance: full-card hover via `hover:border-foreground/30`.
 * The title link is the single focus target.
 */
export function PostCard({ post }: { post: Post }) {
  const hasCover = Boolean(post.cover);
  const authors = post.authors?.length ? post.authors : post.author ? [post.author] : [];

  return (
    <Card className="group h-full overflow-hidden transition-colors hover:border-foreground/30 hover:bg-muted/30">
      {hasCover ? (
        <Link
          href={post.url}
          className="block aspect-video w-full overflow-hidden bg-muted"
          aria-label={post.title}
          tabIndex={-1}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.cover}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
      ) : null}

      <CardHeader>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Calendar className="size-3" />
            <time dateTime={post.date}>{post.date}</time>
          </span>
          <span aria-hidden>·</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3" />
            {post.readingTime} min read
          </span>
          {post.tags.length > 0 ? (
            <>
              <span aria-hidden>·</span>
              <div className="flex flex-wrap items-center gap-1.5">
                {post.tags.slice(0, 2).map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog/tag/${encodeURIComponent(tag)}`}
                    aria-label={`View posts tagged ${tag}`}
                    className="rounded-full border border-border/40 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider transition-colors hover:bg-foreground hover:text-background"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </>
          ) : null}
        </div>
        <CardTitle className="text-balance text-xl tracking-tight">
          <Link
            href={post.url}
            className="transition-colors hover:text-foreground"
          >
            {post.title}
          </Link>
        </CardTitle>
        <CardDescription className="line-clamp-3 text-pretty text-sm text-muted-foreground">
          {post.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-muted-foreground">
            by{" "}
            {authors.map((a, i) => (
              <span key={a.handle}>
                {i > 0 ? ", " : ""}
                <Link
                  href={`/blog/author/${encodeURIComponent(a.handle)}`}
                  className="font-medium text-foreground/80 transition-colors hover:text-foreground"
                >
                  {a.name}
                </Link>
              </span>
            ))}
          </span>
          {post.tags.length > 2 ? (
            <TagList tags={post.tags.slice(2)} size="sm" />
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}