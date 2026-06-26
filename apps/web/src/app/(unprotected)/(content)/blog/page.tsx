import type { Metadata } from "next";

import { PostCard } from "@/components/blog/post-card";
import { getAllPosts } from "@/lib/blog/posts";

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

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <header className="mb-12 max-w-3xl">
        <h1 className="text-balance text-4xl font-bold tracking-tighter sm:text-5xl">
          Blog
        </h1>
        <p className="mt-4 text-pretty text-lg text-muted-foreground">
          Articles, tutorials, and updates from the DeesseJS team. Subscribe
          via{" "}
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
        <p className="text-muted-foreground">
          No posts yet. Subscribe to the RSS feed to be notified when we publish.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </section>
  );
}