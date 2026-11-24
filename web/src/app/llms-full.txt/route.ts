// llms-full.txt: every page of the library with its measured values and the note on what to learn from it.
import { cleanFont, libTypeLabel } from "@/lib/format";
import { getLibrary } from "@/lib/library";
import { BASE_URL } from "@/lib/meta";

export const dynamic = "force-static";

export function GET() {
  const lines = getLibrary().map((it) => {
    const h1 = it.typeScale.h1, b = it.buttons[0];
    const measured = [
      it.fonts.length ? `fonts ${it.fonts.map(cleanFont).join(", ")}` : "",
      h1 ? `h1 ${h1.size}px/${h1.lineHeight} weight ${h1.weight}` : "",
      it.typeScale.body ? `body ${it.typeScale.body.size}px` : "",
      it.colors.background ? `background ${it.colors.background}` : "",
      b ? `button ${b.height}px high, radius ${b.radius}, ${b.bg}` : "",
    ].filter(Boolean).join("; ");
    return `## ${it.site}, ${libTypeLabel(it.type).toLowerCase()}\n${BASE_URL}/library/${it.id} (live page: ${it.url})\nPatterns: ${it.tags.join(", ")}\nMeasured: ${measured}\n${it.note}\n`;
  });
  return new Response(`# ui taste library, full text\n\nEvery page in the library: what to learn from it and what was measured on the live page.\n\n${lines.join("\n")}`, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
