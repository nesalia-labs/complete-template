import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "DeesseJS Blog";

export default function Image() {
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
          <div style={{ fontSize: 20, opacity: 0.8 }}>DeesseJS</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              display: "flex",
            }}
          >
            Blog
          </div>
          <div style={{ fontSize: 24, opacity: 0.7, display: "flex" }}>
            Articles, tutorials, and updates from the DeesseJS team.
          </div>
        </div>
        <div style={{ fontSize: 18, opacity: 0.5, display: "flex" }}>
          deessejs.com/blog
        </div>
      </div>
    ),
    { ...size },
  );
}