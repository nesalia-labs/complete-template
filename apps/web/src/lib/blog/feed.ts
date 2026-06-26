/**
 * RSS feed generators for the blog + changelog.
 *
 * Hand-rolled XML — no extra dependency. The feed spec is RSS 2.0, which
 * every reader (NetNewsWire, Feedly, etc.) understands.
 *
 * Per spec 15.16: RSS is the ONLY subscription mechanism. No in-app fan-out,
 * no email digest. Zero vendor lock-in.
 */

import type { Post, Release } from "./types";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function rfc822(date: string): string {
  // Posts use YYYY-MM-DD. Convert to RFC 822 for RSS.
  return new Date(date + "T00:00:00Z").toUTCString();
}

interface FeedItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  guid: string;
}

function renderItems(items: FeedItem[]): string {
  return items
    .map(
      (item) => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.link)}</link>
      <guid isPermaLink="true">${escapeXml(item.guid)}</guid>
      <pubDate>${item.pubDate}</pubDate>
      <description>${escapeXml(item.description)}</description>
    </item>`,
    )
    .join("\n");
}

function wrapChannel(
  title: string,
  description: string,
  link: string,
  items: FeedItem[],
): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${escapeXml(link)}</link>
    <description>${escapeXml(description)}</description>
    <language>en</language>
${renderItems(items)}
  </channel>
</rss>`;
}

/**
 * Build the blog RSS feed XML.
 */
export function buildBlogFeed(
  posts: Post[],
  siteOrigin: string,
): string {
  const items: FeedItem[] = posts.map((post) => ({
    title: post.title,
    link: `${siteOrigin}${post.url}`,
    description: post.description,
    pubDate: rfc822(post.date),
    guid: `${siteOrigin}${post.url}`,
  }));
  return wrapChannel(
    "DeesseJS Blog",
    "Articles, tutorials, and updates from the DeesseJS team.",
    `${siteOrigin}/blog`,
    items,
  );
}

/**
 * Build the changelog RSS feed XML.
 */
export function buildChangelogFeed(
  releases: Release[],
  siteOrigin: string,
): string {
  const items: FeedItem[] = releases.map((release) => ({
    title: `${release.version} — ${release.title}`,
    link: `${siteOrigin}${release.url}`,
    description: release.description,
    pubDate: rfc822(release.date),
    guid: `${siteOrigin}${release.url}`,
  }));
  return wrapChannel(
    "DeesseJS Changelog",
    "Public release notes for DeesseJS. Subscribe via RSS — no vendor lock-in.",
    `${siteOrigin}/changelog`,
    items,
  );
}