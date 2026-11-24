import type { Metadata } from "next";

export const SITE_NAME = "ui taste";
// The one address the site answers to. Canonical links, the sitemap and Open Graph URLs are built from it,
// and the Vercel hostnames redirect here (next.config.ts). Override with NEXT_PUBLIC_SITE_URL for a preview.
export const SITE_HOST = "www.uitaste.dev";
export const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || (process.env.NODE_ENV === "production" ? `https://${SITE_HOST}` : "http://localhost:3000");

export const baseMetadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: SITE_NAME,
  description: "ui taste, a Claude Code skill: real pages from products known for their design, measured on the live page, so the agent looks before it builds.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  openGraph: { siteName: SITE_NAME, type: "website", url: "/" },
  icons: {
    icon: [{ url: "/brand/favicon.svg", type: "image/svg+xml" }, { url: "/brand/favicon-32.png", sizes: "32x32", type: "image/png" }],
    apple: "/brand/apple-touch-icon.png",
  },
};
