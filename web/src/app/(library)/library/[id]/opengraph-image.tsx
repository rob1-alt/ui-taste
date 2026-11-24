import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { libTypeLabel, palette } from "@/lib/format";
import { getItem } from "@/lib/library";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "A page from the ui taste library";

export default async function OpenGraph({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const it = getItem(id);
  const thumb = await readFile(join(process.cwd(), "public", "thumbs", `${id}-desktop.jpg`)).then((b) => `data:image/jpeg;base64,${b.toString("base64")}`).catch(() => null);
  const pal = it ? palette(it, 5) : [];
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#0e0e0e", color: "#fff", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", width: 660, padding: "40px 0 40px 40px" }}>
          {thumb ? <img src={thumb} width={620} height={430} alt="" style={{ borderRadius: 8, objectFit: "cover", objectPosition: "top" }} /> : <div style={{ width: 620, height: 430, background: "#1b1b1a", borderRadius: 8 }} />}
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1, padding: "48px 48px 40px 20px" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 22, color: "#a7a7a3", textTransform: "uppercase", letterSpacing: 1 }}>{it ? libTypeLabel(it.type) : "Page"}</div>
            <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1, marginTop: 10, textTransform: "uppercase" }}>{it?.site || id}</div>
            <div style={{ fontSize: 22, lineHeight: 1.4, color: "#d6d5d0", marginTop: 24, display: "-webkit-box", overflow: "hidden" }}>{(it?.note || "").slice(0, 160)}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: 8 }}>{pal.map((c) => <div key={c} style={{ width: 36, height: 36, borderRadius: 6, background: c, border: "1px solid rgba(255,255,255,.2)" }} />)}</div>
            <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: -1 }}>ui taste</div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
