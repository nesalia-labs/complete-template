import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@workspace/ui", "tw-animate-css"],
};

export default nextConfig;
