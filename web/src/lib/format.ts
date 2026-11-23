// Labels and small helpers shared by the server and the browser.
import type { Item } from "./types";

export const TYPE: Record<string, string> = {
  landing: "Landing page", pricing: "Pricing", "design-system": "Design system", "404": "404 page", about: "About",
  careers: "Careers", contact: "Contact", integrations: "Integrations", developers: "Developers", brand: "Brand",
  auth: "Sign-up", product: "Product page", changelog: "Changelog", docs: "Docs", customers: "Customers", blog: "Blog",
  app: "App screen",
};
export const typeLabel = (t: string) => TYPE[t] || t;

// the library's own, slightly different wording
export const LIB_TYPE: Record<string, string> = {
  all: "All", landing: "Landing", pricing: "Pricing", "design-system": "Design system",
  "404": "404", about: "About", careers: "Careers", contact: "Contact sales",
  integrations: "Integrations", developers: "Developers", brand: "Brand", auth: "Sign-up & login",
  product: "Product", changelog: "Changelog", docs: "Docs", customers: "Customers", blog: "Blog", app: "App screen",
};
export const libTypeLabel = (t: string) => LIB_TYPE[t] || t.charAt(0).toUpperCase() + t.slice(1);

export const cleanFont = (f: string | undefined) => (f || "").replace(/^__/, "").replace(/_[0-9a-f]{6}$/, "").replace(/_Fallback.*$/, "");
export const prettyTag = (t: string) => t.replace(/^ds-/, "").replace(/-/g, " ");

export const lum = (h: string | undefined) => {
  const m = /^#([0-9a-f]{6})$/i.exec(h || "");
  if (!m) return 1;
  const n = parseInt(m[1], 16);
  return ((n >> 16) * 0.299 + ((n >> 8) & 255) * 0.587 + (n & 255) * 0.114) / 255;
};
export const isLight = (x: Item) => lum(x.colors?.background) > 0.6 && !x.tags.includes("dark");

export const palette = (it: Item, n: number) =>
  [...new Set([it.colors?.background, ...(it.colors?.surfaces || []), ...(it.colors?.text || [])].filter(Boolean))].slice(0, n) as string[];

export const libraryHref = (id: string) => `/library/${encodeURIComponent(id)}`;

// A thumbnail through Next's image optimiser as a plain URL (AVIF/WebP, cached), without a 12-entry srcset per image.
// w must be one of the sizes allowed in next.config.ts.
export const opt = (src: string, w: 150 | 260 | 360 | 480 | 720) => `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=75`;
