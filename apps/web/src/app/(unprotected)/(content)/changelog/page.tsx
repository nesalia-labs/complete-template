import type { Metadata } from "next";

import { ReleaseEntry } from "@/components/blog/release-entry";
import { getAllReleases } from "@/lib/blog/releases";

export const metadata: Metadata = {
  title: "Changelog — DeesseJS",
  description:
    "Public release notes for DeesseJS. Subscribe via RSS — no vendor lock-in.",
  alternates: {
    canonical: "/changelog",
    types: {
      "application/rss+xml": "/changelog/feed.xml",
    },
  },
};

export default function ChangelogPage() {
  const releases = getAllReleases();

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <header className="mb-12">
        <h1 className="text-balance text-4xl font-bold tracking-tighter sm:text-5xl">
          Changelog
        </h1>
        <p className="mt-4 text-pretty text-lg text-muted-foreground">
          Public release notes for DeesseJS. Subscribe via{" "}
          <a
            href="/changelog/feed.xml"
            className="underline underline-offset-4 hover:text-foreground"
          >
            RSS
          </a>{" "}
          to get notified when a new version ships.
        </p>
      </header>

      {releases.length === 0 ? (
        <p className="text-muted-foreground">
          No releases yet. Subscribe to the RSS feed to be notified when we ship.
        </p>
      ) : (
        <div className="space-y-6">
          {releases.map((release) => (
            <ReleaseEntry key={release.slug} release={release} />
          ))}
        </div>
      )}
    </section>
  );
}