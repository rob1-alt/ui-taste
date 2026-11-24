"use client";
// A section title that measures itself, like the rest of the page: it is set to fill the column, then a red
// dimension line gives its real width, guides mark the cap height and the baseline, and a tag reads its
// computed font. On phones it wraps at a fixed size and keeps the tag and the dimension line.
import { useEffect, useRef, useState } from "react";

// Archivo's vertical metrics (OS/2 typo, units per em): ascender 0.878, descender 0.21, cap height 0.686
const ASC = 0.878, DESC = 0.21, CAP = 0.686, LH = 0.84;
const BASE = (LH - (ASC + DESC)) / 2 + ASC; // baseline from the top of the first line box, in em

export function SectionHead({ n, label, title, lede, id }: { n: number; label: string; title: string; lede: React.ReactNode; id?: string }) {
  const wrap = useRef<HTMLDivElement>(null), h = useRef<HTMLHeadingElement>(null);
  const [m, setM] = useState<{ w: number; fs: number; spec: string } | null>(null);

  useEffect(() => {
    const box = wrap.current!, el = h.current!;
    const fit = () => {
      const phone = matchMedia("(max-width: 720px)").matches;
      if (phone) { el.style.fontSize = ""; el.style.whiteSpace = "normal"; }
      else {
        // fit the title to the column: measure at 100px, scale, cap so short titles do not turn into posters
        el.style.whiteSpace = "nowrap"; el.style.fontSize = "100px";
        const w = el.querySelector(".sh-text")!.getBoundingClientRect().width;
        const fs = Math.min(220, Math.max(56, (100 * box.clientWidth) / w - 0.5));
        el.style.fontSize = `${fs.toFixed(1)}px`;
      }
      const cs = getComputedStyle(el), fs = parseFloat(cs.fontSize);
      const r = document.createRange(); r.selectNodeContents(el.querySelector(".sh-text")!);
      const w = Math.max(...[...r.getClientRects()].map((x) => x.right)) - el.getBoundingClientRect().left;
      const fam = cs.fontFamily.split(",")[0].replace(/["']/g, "").replace(/^__|_[0-9a-f]+$/g, "").replace(/ Fallback$/, "");
      setM({ w: Math.round(w), fs, spec: `${fam} ${cs.fontStretch} · ${Math.round(fs)}px/${(parseFloat(cs.lineHeight) / fs).toFixed(2)} · w${cs.fontWeight}` });
    };
    fit();
    const ro = new ResizeObserver(fit); ro.observe(box);
    document.fonts?.ready.then(fit);
    return () => ro.disconnect();
  }, [title]);

  return (
    <header className="sh" id={id}>
      <div className="sh-top">
        <span className="sh-n">{String(n).padStart(2, "0")}</span>
        <span className="sh-label">{label}</span>
        <span className="sh-spec" aria-hidden="true">{m?.spec || " "}</span>
      </div>
      <div className="sh-title" ref={wrap}>
        <span className="sh-dim" aria-hidden="true" style={{ width: m ? `${m.w}px` : 0, opacity: m ? 1 : 0 }}><b>{m?.w} px</b></span>
        <h2 ref={h}>
          <span className="sh-text">{title}</span>
          <i className="sh-guide sh-cap" style={{ top: `${(BASE - CAP).toFixed(3)}em` }} aria-hidden="true"><em>cap {CAP}</em></i>
          <i className="sh-guide sh-base" style={{ top: `${BASE.toFixed(3)}em` }} aria-hidden="true"><em>baseline</em></i>
        </h2>
      </div>
      <p className="sh-lede"><span>{lede}</span></p>
    </header>
  );
}
