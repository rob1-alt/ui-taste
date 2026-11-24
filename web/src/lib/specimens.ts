// The specimens of the "Measured, not guessed" section, measured on the live pages by
// web/scripts/measure_specimens.py: real boxes of the headline, the main button and the body text.
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

export type SpecMark = { kind: "head" | "button" | "body"; box: [number, number, number, number]; label: string };
export type Specimen = {
  id: string; site: string; url: string; img: string; stage: string; bg: string; fonts: string[];
  head: { color: string }; button: { bg: string; color: string } | null; body: { color: string } | null; marks: SpecMark[];
};

const FILE = resolve(process.cwd(), "..", "site", "demo", "specimens", "specimens.json");

export function getSpecimens(): Specimen[] {
  if (!existsSync(FILE)) return [];
  return JSON.parse(readFileSync(FILE, "utf8"));
}
