import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Separator } from "@workspace/ui/components/ui/separator";

import { allPosts } from "content-collections";

import { ArticleCta } from "@/components/blog/article-cta";
import { AuthorBadge } from "@/components/blog/author-badge";
import { PostCard } from "@/components/blog/post-card";
import { PostMeta } from "@/components/blog/post-meta";
import { Prose } from "@/components/blog/prose";
import { MdxRenderer } from "@/components/blog/mdx-renderer";
import {
  getAdjacentPosts,
  getPostBySlug,
  getRelatedPosts,
} from "@/lib/blog/posts";

type Params = { slug: string };

export function generateStaticParams(): Array<Params> {
  return allPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<Params> },
): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} — DeesseJS Blog`,
    description: post.description,
    authors: [{ name: post.author.name }],
    alternates: { canonical: post.url },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      modifiedTime: post.updated,
      authors: [post.author.name],
      tags: post.tags,
      url: post.url,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function PostPage(
  { params }: { params: Promise<Params> },
) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = getRelatedPosts(slug, 3);
  const { prev, next } = getAdjacentPosts(slug);

  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <Link
        href="/blog"
        className="mb-8 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Back to blog
      </Link>

      <header className="mb-10">
        <h1 className="text-balance text-4xl font-bold tracking-tighter sm:text-5xl">
          {post.title}
        </h1>
        <p className="mt-4 text-pretty text-lg text-muted-foreground">
          {post.description}
        </p>
        <div className="mt-6">
          <PostMeta post={post} />
        </div>
      </header>

      <Prose className="mt-10">
        <MdxRenderer code={post.mdxCode} />
      </Prose>

      <ArticleCta />

      {(prev || next) && (
        <>
          <Separator className="my-12" />
          <nav className="grid gap-4 sm:grid-cols-2" aria-label="Post navigation">
            {prev ? (
              <Link
                href={prev.url}
                className="group flex flex-col gap-1 rounded-lg border border-border/40 p-4 transition-colors hover:border-foreground/30 hover:bg-muted/30"
              >
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <ArrowLeft className="size-3" />
                  Previous
                </span>
                <span className="text-sm font-medium text-foreground/90 group-hover:text-foreground">
                  {prev.title}
                </span>
              </Link>
            ) : (
              <div />
            )}
            {next ? (
              <Link
                href={next.url}
                className="group flex flex-col gap-1 rounded-lg border border-border/40 p-4 text-right transition-colors hover:border-foreground/30 hover:bg-muted/30"
              >
                <span className="inline-flex items-center justify-end gap-1 text-xs text-muted-foreground">
                  Next
                  <ArrowRight className="size-3" />
                </span>
                <span className="text-sm font-medium text-foreground/90 group-hover:text-foreground">
                  {next.title}
                </span>
              </Link>
            ) : (
              <div />
            )}
          </nav>
        </>
      )}

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-semibold tracking-tight">
            Related reading
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {related.map((r) => (
              <PostCard key={r.slug} post={r} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}