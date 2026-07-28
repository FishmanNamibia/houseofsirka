const path = require("path");

/**
 * The monorepo root — one level above `apps/`, where the single lockfile and
 * node_modules live.
 */
const workspaceRoot = path.join(__dirname, "..", "..");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // In a workspace the app directory is not the root. Both of these must point
  // at the repo root or Turbopack resolves modules against apps/storefront and
  // file tracing misses hoisted dependencies in the shared node_modules.
  turbopack: {
    root: workspaceRoot,
  },
  outputFileTracingRoot: workspaceRoot,
  // Shared package is plain JavaScript published straight from source.
  transpilePackages: ["@sirka/shared"],
  images: {
    // Seed catalogue imagery is hosted on Unsplash. Admin uploads are base64
    // data URLs and bypass the optimizer via SmartImage's `unoptimized` path.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 414, 640, 768, 1024, 1280, 1536, 1920],
  },
};

module.exports = nextConfig;
