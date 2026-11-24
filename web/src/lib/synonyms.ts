// SYNONYMS read from scripts/find_refs.py at build time (a plain Python dict of lists of strings).
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Synonyms } from "./search";

const FILE = resolve(process.cwd(), "..", "skills", "ui-taste", "scripts", "find_refs.py");

export function getSynonyms(): Synonyms {
  if (!existsSync(FILE)) return {};
  const src = readFileSync(FILE, "utf8");
  const block = /SYNONYMS\s*=\s*\{([\s\S]*?)\n\}/.exec(src)?.[1] || "";
  const out: Synonyms = {};
  for (const m of block.matchAll(/"([^"]+)"\s*:\s*\[([\s\S]*?)\]/g)) out[m[1]] = [...m[2].matchAll(/"([^"]*)"/g)].map((x) => x[1]);
  return out;
}
