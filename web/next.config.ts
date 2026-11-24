import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  // the per-page OG image reads its thumbnail from disk: ship those files with that function
  outputFileTracingIncludes: { "/library/[id]/opengraph-image": ["./public/thumbs/*-desktop.jpg"] },
  images: {
    formats: ["image/avif", "image/webp"],
    // thumbs are 720 (desktop) and 260 (mobile) wide: no need for the large default set
    deviceSizes: [390, 640, 828, 1080, 1440],
    imageSizes: [96, 120, 150, 260, 360, 480, 720],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  async redirects() {
    return [
      // one address: the Vercel hostname and the bare domain go to www.uitaste.dev, path kept
      { source: "/:path*", has: [{ type: "host", value: "ui-taste-six.vercel.app" }], destination: "https://www.uitaste.dev/:path*", permanent: true },
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/library.html", destination: "/library", permanent: true },
      { source: "/site/:path*", destination: "/:path*", permanent: false },
    ];
  },
};

export default config;
