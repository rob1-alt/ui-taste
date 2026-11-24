import type { Metadata } from "next";

export const SITE_NAME = "ui taste";
// The one address the site answers to. Canonical links, the sitemap and Open Graph URLs are built from it,
// and the Vercel hostnames redirect here (next.config.ts). Override with NEXT_PUBLIC_SITE_URL for a preview.
export const SITE_HOST = "www.uitaste.dev";
export const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || (process.env.NODE_ENV === "production" ? `https://${SITE_HOST}` : "http://localhost:3000");

export const baseMetadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "ui taste: real, measured UI references for Claude Code and AI coding agents",
  description: "An open-source skill for Claude Code, Codex and Cursor: a library of real web pages from products known for their design, measured on the live page, a reference search and an anti-slop review, so your agent builds interfaces that do not look generated.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  openGraph: { siteName: SITE_NAME, type: "website", url: "/" },
  icons: {
    icon: [{ url: "/brand/favicon.svg", type: "image/svg+xml" }, { url: "/brand/favicon-32.png", sizes: "32x32", type: "image/png" }],
    apple: "/brand/apple-touch-icon.png",
  },
};
