import type { NextConfig } from "next";
import { withContentCollections } from "@content-collections/next";

/**
 * Next.js config for apps/web (the marketing site).
 *
 * Only one wrapper: withContentCollections. MDX is compiled by content-collections
 * via mdx-bundler (inside the transform), so we don't need @next/mdx or
 * mdx-components.tsx. This keeps the config surface minimal and avoids the
 * Turbopack loader configuration that's still experimental in Next 16.
 *
 * Issue #690: withContentCollections returns Promise<Partial<NextConfig>>.
 * Under Next 16 strict typing, the maintainer-recommended fix is to export
 * the result directly. If withContentCollections were wrapped inside a sync
 * plugin, the chain would break.
 *
 * To chain with a sync plugin (e.g. withNextIntl), you'd need:
 *   async function applyPlugins(cfg: NextConfig) {
 *     const withCc = await withContentCollections(cfg);
 *     return withNextIntl(withCc); // sync plugin gets sync input
 *   }
 */
const nextConfig: NextConfig = {
  // Allow MDX files as page extensions so content-collections can compile them.
  // (MDX content is compiled inside the transform via mdx-bundler — not as
  // Next.js page routes.)
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],

  // shiki is ESM-only — let Next bundle it as an external on the server
  // so Turbopack/Webpack don't try to resolve its WASM-oniguruma imports
  // and fail with "Module not found" mid-HMR.
  serverExternalPackages: ["shiki"],

  // Permit HMR from 127.0.0.1 (Next 16 blocks cross-origin dev resources by default)
  allowedDevOrigins: ["127.0.0.1", "localhost"],

  transpilePackages: ["@workspace/ui", "tw-animate-css"],
};

export default withContentCollections(nextConfig);