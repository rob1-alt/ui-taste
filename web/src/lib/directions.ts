// The landing directions, read from the skill's own reference so the site never drifts from it.
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Item } from "./types";

export type Direction = { name: string; bet: string; refs: { id: string; site: string }[] };

const FILE = resolve(process.cwd(), "..", "skills", "ui-taste", "references", "landing-concepts.md");
const plain = (s: string) => s.replace(/\*\*/g, "").replace(/`/g, "").replace(/\s+/g, " ").trim();

export function getDirections(items: Item[]): Direction[] {
  // the reference must reach the build (it is listed in neither .vercelignore nor .gitignore); if it does not,
  // the section is left out rather than failing the whole deploy
  if (!existsSync(FILE)) { console.warn(`directions: ${FILE} not found, section hidden`); return []; }
  const md = readFileSync(FILE, "utf8");
  const byId = new Map(items.map((x) => [x.id, x]));
  const out: Direction[] = [];
  for (const line of md.split("\n")) {
    const m = /^\|\s*\*\*(.+?)\*\*\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*$/.exec(line);
    if (!m) continue;
    // the bet: its first sentence is the idea; the rest are examples
    const bet = plain(m[2]).split(/(?<=\.)\s/)[0];
    const ids = [...m[3].matchAll(/`([a-z0-9-]+-(?:landing|pricing|work-landing))`/g)].map((x) => x[1]);
    const refs = [...new Set(ids)].map((id) => byId.get(id)).filter(Boolean).slice(0, 4).map((x) => ({ id: x!.id, site: x!.site }));
    out.push({ name: plain(m[1]).replace(/\s*\/\s*/g, " / "), bet, refs });
  }
  return out;
}
