// Copies the images the pages reference into public/: the thumbnails built by site/build.py,
// the full captures of the library and the brand files. Run before dev and build (npm scripts do).
import { cpSync, existsSync, mkdirSync, rmSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..", "..");
const pub = resolve(here, "..", "public");
mkdirSync(pub, { recursive: true });

const pairs = [
  [join(root, "site", "thumbs"), join(pub, "thumbs")],
  [join(root, "skills", "ui-taste", "library", "screens"), join(pub, "screens")],
  [join(root, "site", "brand"), join(pub, "brand")],
  [join(root, "site", "tally-sky.svg"), join(pub, "tally-sky.svg")],
  [join(root, "site", "tally-hills.svg"), join(pub, "tally-hills.svg")],
  [join(root, "site", "work"), join(pub, "work")],  // client redesigns made with the skill, e.g. /work/fleuret/
];
for (const [from, to] of pairs) {
  if (!existsSync(from)) { console.warn(`sync-assets: missing ${from}`); continue; }
  rmSync(to, { recursive: true, force: true });
  cpSync(from, to, { recursive: true, dereference: true });
  const n = statSync(from).isDirectory() ? "dir" : "file";
  console.log(`sync-assets: ${n} ${from.replace(root + "/", "")} → public/${to.replace(pub + "/", "")}`);
}
