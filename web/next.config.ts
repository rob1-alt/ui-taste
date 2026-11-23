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
  async headers() {
    // the site is not meant to be found yet; drop this header with the noindex meta when launching
    return [{ source: "/(.*)", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
  },
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/library.html", destination: "/library", permanent: true },
      { source: "/site/:path*", destination: "/:path*", permanent: false },
    ];
  },
};

export default config;
