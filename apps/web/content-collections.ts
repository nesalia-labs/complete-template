import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import rehypeShiki from "@shikijs/rehype";
import { z } from "zod";
import readingTime from "reading-time";

/**
 * content-collections engine config — single source of truth for the blog.
 *
 * Delete-test anchor (see apps/web/CLAUDE.md §3):
 *   rm -rf apps/web/content \
 *          apps/web/content-collections.ts \
 *          apps/web/lib/blog \
 *          apps/web/src/components/blog \
 *          apps/web/src/app/\(unprotected\)/\(content\)
 *
 * After the rm: apps/web still builds, packages/ui still builds, the rest
 * of the monorepo is unaffected.
 *
 * Architecture choices (mirror of spec 15, scoped to apps/web):
 * - Default parser — extracts frontmatter + raw body, which compileMDX
 *   needs to bundle the MDX into a JS module string. The compiled code is
 *   attached to each post as `mdxCode` and rendered with
 *   `<MDXContent code={post.mdxCode} />` from `@content-collections/mdx/react`.
 * - Drafts and scheduled posts are skipped at build time (no runtime leak).
 * - Authors live in their own collection (decoupled from Better Auth — the
 *   blog must work even when auth is removed per spec 15.3).
 * - cc 0.15+ requires StandardSchema-compliant schemas directly (Zod 3 or 4).
 *   The `schema: (z) => ...` callback form was retired in 0.15.
 */

const authors = defineCollection({
  name: "authors",
  directory: "content/authors",
  include: "*.md",
  schema: z.object({
    handle: z.string().min(1).max(60),
    name: z.string().min(1).max(120),
    avatar: z.string().optional(),
    bio: z.string().optional(),
    // Explicit `content` declaration required by cc 0.15+ — the implicit
    // addition was deprecated. Holds the raw markdown body.
    content: z.string(),
  }),
});

const posts = defineCollection({
  name: "posts",
  directory: "content/posts",
  include: "*.mdx",
  // Default parser: "frontmatter" — extracts frontmatter + raw body, which
  // compileMDX needs to bundle the MDX into a JS module string.
  schema: z.object({
    title: z.string().min(1).max(120),
    description: z.string().min(1).max(280),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    updated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    tags: z.array(z.string()).default([]),
    author: z.string().min(1),
    draft: z.boolean().default(false),
    cover: z.string().optional(),
    scheduled: z.string().datetime().optional(),
    // Explicit `content` declaration required by cc 0.15+ — holds the raw
    // MDX body used by compileMDX and reading-time.
    content: z.string(),
  }),
  transform: async (post, context) => {
    // Skip drafts in production builds. NODE_ENV is set by Next at build time.
    if (post.draft && process.env.NODE_ENV === "production") {
      return context.skip("document is a draft");
    }

    // Skip posts scheduled for a future date.
    if (post.scheduled && new Date(post.scheduled) > new Date()) {
      return context.skip(`scheduled for ${post.scheduled}`);
    }

    // Resolve author FK (decoupled from Better Auth — see spec 15.3).
    const author = context.documents(authors).find(
      (a) => a.handle === post.author,
    );
    if (!author) {
      throw new Error(
        `Post "${post.title}" references unknown author "${post.author}". ` +
          `Add content/authors/${post.author}.md or fix the frontmatter.`,
      );
    }

    // Compute slug from filename (strip directory + extension).
    const slug = post._meta.filePath
      .replace(/^.*\//, "")
      .replace(/\.mdx$/, "");

    // Compile MDX body → JS module source string (mdx-bundler under the hood).
    // Shiki wired here via rehypePlugins so code blocks render with the dual
    // github-light / github-dark theme matching our token system.
    const mdxCode = await compileMDX(context, post, {
      rehypePlugins: [
        [
          rehypeShiki,
          {
            themes: { light: "github-light", dark: "github-dark" },
            defaultColor: false, // emit both themes; CSS controls which shows
          },
        ],
      ],
    });

    // Reading time from raw body content.
    const stats = readingTime(post.content);

    return {
      ...post,
      slug,
      url: `/blog/${slug}`,
      readingTime: Math.max(1, Math.round(stats.minutes)),
      author,
      mdxCode,
    };
  },
});

const releases = defineCollection({
  name: "releases",
  directory: "content/releases",
  include: "*.mdx",
  schema: z.object({
    title: z.string().min(1).max(120),
    description: z.string().min(1).max(280),
    version: z.string().regex(/^\d+\.\d+\.\d+$/, "semver"),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    categories: z
      .array(
        z.enum([
          "added",
          "changed",
          "fixed",
          "removed",
          "deprecated",
          "security",
        ]),
      )
      .default([]),
    cover: z.string().optional(),
    relatedPosts: z.array(z.string()).default([]),
    content: z.string(),
  }),
  transform: async (release, context) => {
    const slug = release._meta.filePath
      .replace(/^.*\//, "")
      .replace(/\.mdx$/, "");

    const mdxCode = await compileMDX(context, release, {
      rehypePlugins: [
        [
          rehypeShiki,
          {
            themes: { light: "github-light", dark: "github-dark" },
            defaultColor: false,
          },
        ],
      ],
    });

    return {
      ...release,
      slug,
      url: `/changelog/${slug}`,
      mdxCode,
    };
  },
});

export default defineConfig({
  // Using `content` (the new name, supported in 0.15.x runtime).
  // TypeScript types in 0.15.x lag slightly — TS errors here are spurious
  // because the runtime accepts this shape (confirmed by successful builds).
  content: [authors, posts, releases],
});