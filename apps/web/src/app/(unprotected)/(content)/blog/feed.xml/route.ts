import { getAllPosts } from "@/lib/blog/posts";
import { buildBlogFeed } from "@/lib/blog/feed";

/**
 * RSS 2.0 feed for the blog.
 *
 * Per spec 15.16: RSS is the ONLY subscription mechanism — no in-app
 * fan-out, no email digest. Zero vendor lock-in.
 *
 * Note: we hard-code the site origin to "https://deessejs.com". If the
 * deployment domain changes, update this constant. (Reading from
 * headers() would be more correct but adds complexity.)
 */
const SITE_ORIGIN = "https://deessejs.com";

export const dynamic = "force-static";

export function GET() {
  const xml = buildBlogFeed(getAllPosts(), SITE_ORIGIN);
  return new Response(xml, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=3600",
    },
  });
}