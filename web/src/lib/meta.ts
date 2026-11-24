import type { Metadata } from "next";

export const SITE_NAME = "taster";
export const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

export const baseMetadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: SITE_NAME,
  description: "taster, a Claude Code skill: real pages from products known for their design, measured on the live page, so the agent looks before it builds.",
  robots: { index: true, follow: true },
  icons: {
    icon: [{ url: "/brand/favicon.svg", type: "image/svg+xml" }, { url: "/brand/favicon-32.png", sizes: "32x32", type: "image/png" }],
    apple: "/brand/apple-touch-icon.png",
  },
};
