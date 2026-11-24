// The search index the landing's live demo loads on demand: one small record per page, plus the synonyms.
import { cleanFont, opt, palette } from "@/lib/format";
import { getLibrary } from "@/lib/library";
import type { SearchItem } from "@/lib/search";
import { getSynonyms } from "@/lib/synonyms";

export const dynamic = "force-static";

export function GET() {
  const items: SearchItem[] = getLibrary().filter((it) => it.screens.desktop).map((it) => {
    const h1 = it.typeScale.h1 || it.typeScale.h2, body = it.typeScale.body, b = it.buttons[0];
    return {
      id: it.id, site: it.site, type: it.type, tags: it.tags, note: it.note.length > 240 ? it.note.slice(0, 240) : it.note, fonts: it.fonts.map(cleanFont),
      bg: it.colors.background || "", thumb: opt(it.screens.desktop!.thumb, 360), pal: palette(it, 4),
      h1: h1 ? `${cleanFont(h1.font)} ${h1.size}/${h1.lineHeight}` : "",
      body: body ? `${body.size}/${body.lineHeight}` : "",
      btn: b ? `${b.height}px · r ${parseInt(b.radius) >= 999 ? "pill" : parseInt(b.radius)}` : "",
    };
  });
  return Response.json({ synonyms: getSynonyms(), items });
}
