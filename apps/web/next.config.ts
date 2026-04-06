import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@packages/ui", "@packages/shared"],
};

export default nextConfig;
