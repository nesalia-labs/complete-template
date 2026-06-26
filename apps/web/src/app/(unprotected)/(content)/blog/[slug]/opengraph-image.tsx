import { ImageResponse } from "next/og";

import { getPostBySlug } from "@/lib/blog/posts";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "DeesseJS Blog";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  const title = post?.title ?? "DeesseJS Blog";
  const description = post?.description ?? "The SaaS template that never sleeps.";

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
          <div style={{ fontSize: 20, opacity: 0.8 }}>DeesseJS Blog</div>
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
          deessejs.com
        </div>
      </div>
    ),
    { ...size },
  );
}