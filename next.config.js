const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Several lockfiles exist above this directory; pin the workspace root so
  // Turbopack doesn't infer the wrong one.
  turbopack: {
    root: __dirname,
  },
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
