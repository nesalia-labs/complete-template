/**
 * Release queries + related-posts join (15.15 in spec 15).
 */

import { allPosts, allReleases } from "content-collections";

import type { Post, Release } from "./types";
import { sortReleasesDesc } from "./types";

/**
 * All releases, sorted by semver desc then date desc.
 */
export function getAllReleases(): Release[] {
  return sortReleasesDesc(allReleases);
}

/**
 * Get a single release by slug.
 */
export function getReleaseBySlug(slug: string): Release | undefined {
  return allReleases.find((r) => r.slug === slug);
}

/**
 * Latest release, or undefined if no releases exist.
 */
export function getLatestRelease(): Release | undefined {
  return getAllReleases()[0];
}

/**
 * Cross-link to blog posts that explain the release in depth.
 * Manual list — buyer (or author) decides which posts to link.
 *
 * @see spec 15.15 — frontmatter `relatedPosts: string[]` lists blog slugs.
 */
export function getRelatedBlogPosts(release: Release): Post[] {
  if (!release.relatedPosts?.length) return [];
  return release.relatedPosts
    .map((slug) => allPosts.find((p) => p.slug === slug))
    .filter((p): p is Post => Boolean(p));
}

/**
 * Get the previous and next release by semver, relative to the current release.
 * Mirrors `getAdjacentPosts` so the changelog UI matches the blog navigation.
 */
export function getAdjacentReleases(slug: string): {
  prev: Release | undefined;
  next: Release | undefined;
} {
  const sorted = getAllReleases();
  const idx = sorted.findIndex((r) => r.slug === slug);
  if (idx === -1) return { prev: undefined, next: undefined };
  return {
    prev: sorted[idx + 1],
    next: sorted[idx - 1],
  };
}