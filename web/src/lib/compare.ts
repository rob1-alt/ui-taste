// The before/after runs: the same brief sent twice to the same model in Claude Code, once in an empty
// folder with skills disabled, once with ui-taste installed. Files in site/demo/compare.
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

type Run = { img: string; html: string; turns: number; seconds: number };
export type Pair = { name: string; prompt: string; without: Run; with: Run; iterate?: Run };
export type Compare = { model: string; tool: string; iterate?: string; pairs: Pair[] };

const FILE = resolve(process.cwd(), "..", "site", "demo", "compare", "compare.json");
export function getCompare(): Compare | null {
  return existsSync(FILE) ? JSON.parse(readFileSync(FILE, "utf8")) : null;
}
