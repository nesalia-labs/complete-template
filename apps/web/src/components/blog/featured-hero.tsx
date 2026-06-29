import Link from "next/link";
import { ArrowRight, Calendar, Clock } from "lucide-react";

import type { Post } from "@/lib/blog/types";
import { TagList } from "./tag-list";

/**
 * FeaturedHero — the most recent post displayed as a large hero card
 * at the top of the blog index.
 *
 * Layout (per Medium / Notion / Vercel blog pattern):
 *   - 2-column on md+: cover image (if any) on one side, content on other
 *   - Title is large (text-3xl sm:text-4xl)
 *   - Description is full (not line-clamped)
 *   - CTA: arrow link to article
 *
 * When no cover image, falls back to a stacked single-column layout.
 * Always shows the post in a way that's distinct from the grid cards below.
 */
export function FeaturedHero({ post }: { post: Post }) {
  const hasCover = Boolean(post.cover);

  return (
    <article
      className={`group mb-12 overflow-hidden rounded-xl border border-border/40 bg-card/30 transition-colors hover:border-foreground/30 ${
        hasCover ? "md:grid md:grid-cols-2" : ""
      }`}
    >
      {hasCover ? (
        <Link
          href={post.url}
          className="block aspect-video overflow-hidden bg-muted md:aspect-auto"
          aria-label={post.title}
          tabIndex={-1}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.cover}
            alt=""
            loading="eager"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
      ) : null}

      <div className="flex flex-col justify-center p-6 sm:p-8">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Latest
        </p>

        <h2 className="mt-2 text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
          <Link
            href={post.url}
            className="transition-colors hover:text-foreground"
          >
            {post.title}
          </Link>
        </h2>

        <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
          {post.description}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Calendar className="size-3" />
            <time dateTime={post.date}>{post.date}</time>
          </span>
          <span aria-hidden>·</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3" />
            {post.readingTime} min read
          </span>
          <span aria-hidden>·</span>
          <span>
            by{" "}
            <Link
              href={`/blog/author/${encodeURIComponent(post.author.handle)}`}
              className="font-medium text-foreground/80 transition-colors hover:text-foreground"
            >
              {post.author.name}
            </Link>
          </span>
        </div>

        {post.tags.length > 0 ? (
          <div className="mt-4">
            <TagList tags={post.tags} size="sm" />
          </div>
        ) : null}

        <Link
          href={post.url}
          className="mt-5 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-foreground/80"
        >
          Read article
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </Link>
      </div>
    </article>
  );
}