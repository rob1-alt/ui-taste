// The library search, as scripts/find_refs.py does it, so the site and the skill rank the same way.
// Pure functions: used at build time and in the browser.
export type SearchItem = {
  id: string; site: string; type: string; tags: string[]; note: string; fonts: string[]; bg: string;
  thumb: string; pal: string[]; h1: string; body: string; btn: string;
};
export type Synonyms = Record<string, string[]>;

export const tokens = (text: string) => text.toLowerCase().split(/[^a-z0-9#.+-]+/).filter((t) => t.length > 1);

export function haystack(it: SearchItem, syn: Synonyms) {
  const tags = it.tags.join(" ");
  return [it.site, it.type, tags, tags.replace(/-/g, " "), it.note, it.fonts.join(" "), (syn[it.type] || []).join(" ")].join(" ").toLowerCase();
}

// whole words only: "ci" must not match inside "pricing"
const esc = (x: string) => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
export const has = (q: string, phrase: string) => new RegExp(`(?<![a-z0-9])${esc(phrase)}(?![a-z0-9])`).test(q);

export function score(it: SearchItem, query: string, syn: Synonyms, hay: string) {
  const q = query.toLowerCase();
  let s = 0;
  for (const [typ, words] of Object.entries(syn)) if (it.type === typ && words.some((w) => has(q, w))) s += 6;
  if (has(q, it.site.toLowerCase())) s += 5;
  for (const tag of it.tags) {
    const plain = tag.replace(/^ds-/, "").replace(/^bg-/, "").replace(/-/g, " ");
    if (has(q, plain) || has(q, tag) || (plain.endsWith("s") && has(q, plain.slice(0, -1)))) s += 6;
  }
  for (const w of new Set(tokens(q))) if (hay.includes(w)) s += w.length > 3 ? 1.5 : 0.5;
  // a dark or light request matches the measured background
  if (/^#[0-9a-f]{6}$/i.test(it.bg)) {
    const n = parseInt(it.bg.slice(1), 16), lum = ((n >> 16) + ((n >> 8) & 255) + (n & 255)) / 3;
    if (q.includes("dark") && lum < 60) s += 3;
    if (q.includes("light") && lum > 200) s += 1;
  }
  return s;
}

export function search(items: SearchItem[], query: string, syn: Synonyms, hays: Map<string, string>, limit = 3) {
  if (!query.trim()) return [];
  return items.map((it) => ({ it, s: score(it, query, syn, hays.get(it.id)!) })).filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s).slice(0, limit).map((x) => x.it);
}
