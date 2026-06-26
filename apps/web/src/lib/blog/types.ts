/**
 * Type derivations for the blog + changelog content collections.
 *
 * Each type flows from the Zod schema in `content-collections.ts` →
 * transform return → content-collections generated type → this re-export.
 * Zero manual type definitions.
 */

import { allAuthors, allPosts, allReleases } from "content-collections";

export type Author = (typeof allAuthors)[number];
export type Post = (typeof allPosts)[number];
export type Release = (typeof allReleases)[number];

/**
 * All unique tags across the blog, sorted alphabetically.
 * Used by the tag index page.
 */
export function getAllTags(): string[] {
  const tagSet = new Set<string>();
  for (const post of allPosts) {
    for (const tag of post.tags) {
      tagSet.add(tag);
    }
  }
  return Array.from(tagSet).sort();
}

/**
 * Keep-a-Changelog category labels.
 * Order matters — this is the canonical display order on the changelog index.
 */
export const RELEASE_CATEGORIES = [
  "added",
  "changed",
  "fixed",
  "deprecated",
  "removed",
  "security",
] as const;

export type ReleaseCategory = (typeof RELEASE_CATEGORIES)[number];

export const RELEASE_CATEGORY_LABELS: Record<ReleaseCategory, string> = {
  added: "Added",
  changed: "Changed",
  fixed: "Fixed",
  deprecated: "Deprecated",
  removed: "Removed",
  security: "Security",
};

/**
 * Sort releases by version (semver desc), then date desc as tiebreaker.
 */
export function sortReleasesDesc(releases: Release[]): Release[] {
  return [...releases].sort((a, b) => {
    const va = a.version.split(".").map(Number);
    const vb = b.version.split(".").map(Number);
    for (let i = 0; i < 3; i++) {
      const diff = (vb[i] ?? 0) - (va[i] ?? 0);
      if (diff !== 0) return diff;
    }
    return b.date.localeCompare(a.date);
  });
}