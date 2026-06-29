import type { Metadata } from "next";
import Link from "next/link";

import { Badge } from "@workspace/ui/components/ui/badge";

import { FeaturedHero } from "@/components/blog/featured-hero";
import { PostCard } from "@/components/blog/post-card";
import { getAllPosts } from "@/lib/blog/posts";
import { getAllTags } from "@/lib/blog/types";

export const metadata: Metadata = {
  title: "Blog — DeesseJS",
  description: "Articles, tutorials, and updates from the DeesseJS team.",
  alternates: {
    canonical: "/blog",
    types: {
      "application/rss+xml": "/blog/feed.xml",
    },
  },
};

export default function BlogPage() {
  const posts = getAllPosts();
  const tags = getAllTags();
  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <header className="mb-12 max-w-3xl">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h1 className="text-balance text-4xl font-bold tracking-tighter sm:text-5xl">
            Blog
          </h1>
          <span className="font-mono text-xs text-muted-foreground">
            {posts.length} {posts.length === 1 ? "post" : "posts"}
          </span>
        </div>
        <p className="mt-4 text-pretty text-lg text-muted-foreground">
          Articles, tutorials, and updates from the DeesseJS team. Open-source
          content — each post is markdown in our repo. Subscribe via{" "}
          <a
            href="/blog/feed.xml"
            className="underline underline-offset-4 hover:text-foreground"
          >
            RSS
          </a>{" "}
          — no vendor lock-in.
        </p>
      </header>

      {posts.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {/* Featured hero — the most recent post, large format */}
          {featured ? <FeaturedHero post={featured} /> : null}

          {/* Tag chips — quick filters to tag archives */}
          {tags.length > 0 ? (
            <nav
              aria-label="Filter by tag"
              className="mb-8 flex flex-wrap items-center gap-2 border-y border-border/40 py-4"
            >
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Topics
              </span>
              {tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog/tag/${encodeURIComponent(tag)}`}
                  aria-label={`View posts tagged ${tag}`}
                >
                  <Badge
                    variant="outline"
                    className="cursor-pointer transition-colors hover:bg-foreground hover:text-background"
                  >
                    {tag}
                  </Badge>
                </Link>
              ))}
            </nav>
          ) : null}

          {/* Grid of remaining posts */}
          {rest.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              That&apos;s everything for now — subscribe via{" "}
              <a
                href="/blog/feed.xml"
                className="underline underline-offset-4 hover:text-foreground"
              >
                RSS
              </a>{" "}
              to be notified when we publish more.
            </p>
          )}
        </>
      )}
    </section>
  );
}

/**
 * EmptyState — designed placeholder when there are no posts.
 * Replaces the previous plain-text "No posts yet" line.
 */
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-card/30 px-6 py-16 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
        No posts yet
      </p>
      <p className="mt-3 max-w-md text-pretty text-base text-muted-foreground">
        Subscribe to the{" "}
        <a
          href="/blog/feed.xml"
          className="font-medium text-foreground underline underline-offset-4 hover:text-foreground/80"
        >
          RSS feed
        </a>{" "}
        to be notified when we publish. We&apos;re working on the first
        articles.
      </p>
    </div>
  );
}