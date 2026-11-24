// What search engines and answer engines read: the example pages by page type and by pattern, their copy,
// the figures computed for each, and the JSON-LD. Everything is derived from the measured library.
import { cleanFont, lum, prettyTag } from "./format";
import { getLibrary } from "./library";
import { BASE_URL } from "./meta";
import type { Item } from "./types";

// ---------- page types ----------
export type TypeMeta = { type: string; slug: string; name: string; plural: string; intro: string };
const TYPES: Omit<TypeMeta, "intro">[] = [
  { type: "landing", slug: "landing-pages", name: "Landing page", plural: "landing pages" },
  { type: "pricing", slug: "pricing-pages", name: "Pricing page", plural: "pricing pages" },
  { type: "dashboard", slug: "dashboards", name: "Dashboard", plural: "dashboards" },
  { type: "design-system", slug: "design-systems", name: "Design system", plural: "design systems" },
  { type: "app", slug: "app-screens", name: "App screen", plural: "app screens" },
  { type: "status", slug: "status-pages", name: "Status page", plural: "status pages" },
  { type: "404", slug: "404-pages", name: "404 page", plural: "404 pages" },
  { type: "careers", slug: "careers-pages", name: "Careers page", plural: "careers pages" },
  { type: "integrations", slug: "integrations-pages", name: "Integrations page", plural: "integrations pages" },
  { type: "about", slug: "about-pages", name: "About page", plural: "about pages" },
  { type: "auth", slug: "sign-up-pages", name: "Sign-up and login page", plural: "sign-up and login pages" },
  { type: "contact", slug: "contact-pages", name: "Contact sales page", plural: "contact sales pages" },
  { type: "brand", slug: "brand-pages", name: "Brand page", plural: "brand pages" },
  { type: "changelog", slug: "changelogs", name: "Changelog", plural: "changelogs" },
  { type: "developers", slug: "developer-pages", name: "Developer page", plural: "developer pages" },
  { type: "docs", slug: "docs-pages", name: "Docs page", plural: "docs pages" },
  { type: "product", slug: "product-pages", name: "Product page", plural: "product pages" },
  { type: "blog", slug: "blogs", name: "Blog", plural: "blogs" },
  { type: "customers", slug: "customer-pages", name: "Customer stories page", plural: "customer stories pages" },
];
const INTRO: Record<string, string> = {
  landing: "Homepages from companies known for their design: AI labs, developer tools, fintech, hardware, studios and type foundries. Each one was captured on desktop and mobile and measured on the live page, with a note on the one decision worth copying.",
  pricing: "Pricing pages that make a decision easy: how many plans, which one is highlighted, where the billing toggle sits, how the comparison table is set. Each was measured on the live page.",
  dashboard: "Dashboards and analytics screens from products people use every day, measured on the live page: how they lay out totals, charts, tables and state.",
  "design-system": "Design system sites from teams that publish theirs: overviews, colour scales, type scales and component pages, with the tokens read on the live page.",
  app: "App screens beyond the dashboard: trading terminals, players, schedulers, boards and leaderboards, measured on the live page.",
  status: "Status pages that stay readable during an incident: uptime bars, component lists and incident history, measured on the live page.",
  "404": "404 pages that keep the visitor instead of losing them, measured on the live page.",
};

export function typeMetas(items: Item[] = getLibrary()): TypeMeta[] {
  const n = (t: string) => items.filter((x) => x.type === t).length;
  return TYPES.filter((t) => n(t.type) >= 2).map((t) => ({ ...t, intro: INTRO[t.type] || `${t.plural[0].toUpperCase() + t.plural.slice(1)} from products known for their design, captured on desktop and mobile and measured on the live page.` }));
}
export const typeBySlug = (slug: string) => typeMetas().find((t) => t.slug === slug);
export const typeHref = (type: string) => { const t = TYPES.find((x) => x.type === type); return t ? `/examples/${t.slug}` : "/library"; };

// ---------- patterns (tags) ----------
// tags that only restate a page type or are too broad to be a pattern
const SKIP = new Set(["light", "design-system", "ds-overview", "status-page", "landing", "pricing", "product", "small-type", "loud", "serif-free", "warm-neutral", "light-grey"]);
export type PatternMeta = { tag: string; name: string; count: number };
export function patternMetas(items: Item[] = getLibrary()): PatternMeta[] {
  const c = new Map<string, number>();
  items.forEach((it) => it.tags.forEach((t) => c.set(t, (c.get(t) || 0) + 1)));
  return [...c.entries()].filter(([t, n]) => n >= 6 && !SKIP.has(t)).sort((a, b) => b[1] - a[1])
    .map(([tag, count]) => ({ tag, count, name: patternName(tag) }));
}
export function patternName(tag: string) {
  const p = prettyTag(tag).replace(/^bg /, "").replace(/\bui\b/g, "UI").replace(/\bds\b/g, "design system");
  if (tag === "dark") return "Dark mode";
  return p.charAt(0).toUpperCase() + p.slice(1);
}

// ---------- figures for a set of pages ----------
const med = (a: number[]) => { const s = a.filter(Number.isFinite).sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : 0; };
export function figures(items: Item[]) {
  const h1 = items.map((x) => x.typeScale.h1?.size || 0).filter(Boolean);
  const body = items.map((x) => x.typeScale.body?.size || 0).filter(Boolean);
  const btn = items.map((x) => x.buttons[0]?.height || 0).filter(Boolean);
  // one family under its variants: "Inter", "inter", "Inter Variable" and "InterVariable" count together
  const fonts = new Map<string, [string, number]>();
  items.forEach((x) => {
    const f = cleanFont(x.fonts[0]).replace(/\s*(variable|var|vf|display)$/i, "").replace(/variable$/i, "").trim(); if (!f) return;
    const k = f.toLowerCase().replace(/[\s_-]/g, ""), cur = fonts.get(k);
    fonts.set(k, [cur?.[0] && /[A-Z]/.test(cur[0][0]) ? cur[0] : f, (cur?.[1] || 0) + 1]);
  });
  const topFonts = [...fonts.values()].sort((a, b) => b[1] - a[1]).slice(0, 4);
  const dark = items.filter((x) => lum(x.colors.background) < 0.3).length;
  const pills = items.filter((x) => x.buttons[0] && parseFloat(x.buttons[0].radius) >= (x.buttons[0].height || 40) / 2).length;
  return { n: items.length, h1: med(h1), body: med(body), btn: med(btn), topFonts, darkPct: Math.round((dark / Math.max(1, items.length)) * 100), pillPct: Math.round((pills / Math.max(1, items.filter((x) => x.buttons[0]).length)) * 100) };
}

// ---------- JSON-LD ----------
export const abs = (path: string) => `${BASE_URL}${path}`;
export function breadcrumbs(trail: [string, string][]) {
  return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: trail.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: abs(path) })) };
}
export function itemList(name: string, items: Item[]) {
  return {
    "@context": "https://schema.org", "@type": "ItemList", name, numberOfItems: items.length,
    itemListElement: items.slice(0, 100).map((it, i) => ({ "@type": "ListItem", position: i + 1, url: abs(`/library/${it.id}`), name: `${it.site} ${it.type}` })),
  };
}
