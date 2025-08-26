import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  images: {
    remotePatterns: [new URL('https://kingofoc.github.io/image-pApp/p')]
  },
};

export default nextConfig;
