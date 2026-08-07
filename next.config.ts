import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Dev and production builds get separate output directories.
   *
   * Sharing one `.next` folder lets a production build's React Client Manifest
   * survive into the next `next dev`, which fails at runtime with:
   *   "Could not find the module …/segment-explorer-node.js#SegmentViewNode
   *    in the React Client Manifest"
   * followed by `__webpack_modules__[moduleId] is not a function`.
   *
   * Production still emits to `.next`, so hosting platforms are unaffected.
   */
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",

  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 480, 640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [64, 96, 128, 192, 256, 384],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
      {
        source: "/:all*(svg|jpg|jpeg|png|webp|avif|mp4|webm|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
