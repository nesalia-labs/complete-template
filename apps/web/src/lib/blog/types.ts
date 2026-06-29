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

/**
 * Group releases by major.minor version (e.g. "0.1", "0.2", "1.0").
 * Returns groups in semver-desc order. Each group contains its releases
 * already sorted desc.
 *
 * Pattern: Linear / Vercel changelogs — visual separator between version
 * cohorts helps the visitor navigate volume.
 */
export interface ReleaseGroup {
  /** The major.minor label (e.g. "0.1"). */
  label: string
  /** Releases in this group, sorted desc by patch version. */
  releases: Release[]
}

export function groupReleasesByMinor(releases: Release[]): ReleaseGroup[] {
  const sorted = sortReleasesDesc(releases)
  const map = new Map<string, Release[]>()
  for (const r of sorted) {
    const parts = r.version.split(".")
    const minor = `${parts[0] ?? "0"}.${parts[1] ?? "0"}`
    const list = map.get(minor) ?? []
    list.push(r)
    map.set(minor, list)
  }
  return Array.from(map.entries()).map(([label, releases]) => ({
    label,
    releases,
  }))
}