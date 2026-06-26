"use client";

import { MDXContent } from "@content-collections/mdx/react";

/**
 * Client-side MDX renderer wrapper.
 *
 * Why a "use client" boundary here:
 * The server-side `@content-collections/mdx/react/server.js` uses `new Function()`
 * to compile MDX at render time. In Next 16 + Turbopack, this can fail
 * silently and render the raw string. Forcing the render to happen on the
 * client (where `new Function()` works in browsers) sidesteps the issue.
 *
 * The `code` string is serializable, so it can cross the server/client
 * boundary without issue.
 */
export function MdxRenderer({ code }: { code: string }) {
  return <MDXContent code={code} />;
}