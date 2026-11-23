// Reads the skill's library at build time and shapes it like the old site/data.js did.
// Thumbnails still come from site/build.py (they crop the top of each capture); the full captures are the
// skill's own screens. scripts/sync-assets.mjs copies both into public/.
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Item, Screen } from "./types";

const ROOT = resolve(process.cwd(), "..");
const INDEX = resolve(ROOT, "skills", "ui-taste", "library", "index.json");
const THUMBS = resolve(ROOT, "site", "thumbs");

type RawScreen = { file: string; width: number; height: number };
type Raw = {
  id: string; site: string; url: string; type: string; tags?: string[]; note?: string; captured?: string; source?: string;
  screens?: Partial<Record<"desktop" | "mobile", RawScreen>>;
  tokens?: { fonts?: string[]; type?: Record<string, Item["typeScale"]["h1"] | null>; colors?: Item["colors"]; buttons?: Item["buttons"]; contentWidth?: number | null };
};

let cache: Item[] | null = null;

export function getLibrary(): Item[] {
  if (cache) return cache;
  // capture.py writes the index with Python's json, which lets NaN through for a line height it could not read
  const raw: Raw[] = JSON.parse(readFileSync(INDEX, "utf8").replace(/:\s*(NaN|-?Infinity)\b/g, ": null"));
  const items: Item[] = [];
  let missing = 0;
  for (const it of raw) {
    // style references and pages built with the skill are not live pages: not in the gallery
    if (it.source === "user-reference" || it.source === "worked-example") continue;
    const screens: Item["screens"] = {};
    for (const kind of ["desktop", "mobile"] as const) {
      const s = it.screens?.[kind];
      if (!s) continue;
      // a page captured since the last `python3 site/build.py` has no thumbnail yet: leave it out rather than 404
      if (!existsSync(resolve(THUMBS, `${it.id}-${kind}.jpg`))) { missing++; continue; }
      const sc: Screen = {
        full: `/screens/${s.file.replace(/^screens\//, "")}`,
        thumb: `/thumbs/${it.id}-${kind}.jpg`,
        w: s.width,
        h: s.height,
      };
      if (kind === "mobile") sc.tile = `/thumbs/${it.id}-tile.jpg`;
      screens[kind] = sc;
    }
    if (!screens.desktop && !screens.mobile) continue;
    const tk = it.tokens || {};
    const typeScale: Item["typeScale"] = {};
    for (const [k, v] of Object.entries(tk.type || {})) if (v) (typeScale as Record<string, unknown>)[k] = v;
    items.push({
      id: it.id,
      site: it.site,
      url: it.url,
      type: it.type,
      tags: it.tags || [],
      note: it.note || "",
      captured: it.captured || "",
      screens,
      fonts: (tk.fonts || []).slice(0, 4),
      typeScale,
      colors: tk.colors || {},
      buttons: (tk.buttons || []).slice(0, 3),
      contentWidth: tk.contentWidth ?? null,
    });
  }
  if (missing) console.warn(`library: ${missing} screens have no thumbnail yet, run python3 site/build.py`);
  items.sort((a, b) => a.site.toLowerCase().localeCompare(b.site.toLowerCase()) || a.type.localeCompare(b.type));
  cache = items;
  return items;
}

export function getItem(id: string): Item | undefined {
  return getLibrary().find((x) => x.id === id);
}

export function libraryCounts(items: Item[]) {
  const sites = new Set(items.map((x) => x.site)).size;
  const shots = items.reduce((n, x) => n + Object.keys(x.screens).length, 0);
  const lastCapture = items.map((x) => x.captured).sort().pop() || "";
  return { pages: items.length, sites, shots, lastCapture };
}
