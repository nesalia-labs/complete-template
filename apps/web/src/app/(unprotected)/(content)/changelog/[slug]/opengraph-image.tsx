import { ImageResponse } from "next/og";

import { getReleaseBySlug } from "@/lib/blog/releases";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "DeesseJS Changelog";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const release = getReleaseBySlug(slug);

  const title = release
    ? `v${release.version} — ${release.title}`
    : "DeesseJS Changelog";
  const description =
    release?.description ?? "Public release notes for DeesseJS.";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background: "#0a0a0a",
          color: "#fafafa",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 9999,
              background: "#fafafa",
            }}
          />
          <div style={{ fontSize: 20, opacity: 0.8 }}>DeesseJS Changelog</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              fontSize: 56,
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              display: "flex",
            }}
          >
            {title}
          </div>
          <div style={{ fontSize: 24, opacity: 0.7, display: "flex" }}>
            {description}
          </div>
        </div>
        <div style={{ fontSize: 18, opacity: 0.5, display: "flex" }}>
          deessejs.com/changelog
        </div>
      </div>
    ),
    { ...size },
  );
}