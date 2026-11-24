"use client";
// Five live pages, screenshotted at 1440x1000 and measured in the browser (web/scripts/measure_specimens.py):
// each mark sits on the real box of the headline, the main button or the body text, and its label is that
// element's computed style.
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { libraryHref } from "@/lib/format";
import type { Specimen } from "@/lib/specimens";

const NAME: Record<string, string> = { head: "Headline", button: "Main button", body: "Body text" };
const dark = (hex: string) => { const n = parseInt((hex || "#fff").slice(1), 16); return ((n >> 16) * 0.299 + ((n >> 8) & 255) * 0.587 + (n & 255) * 0.114) / 255 < 0.35; };

export function Specimens({ specs }: { specs: Specimen[] }) {
  const [cur, setCur] = useState(0);
  const [shown, setShown] = useState<number | null>(null); // the specimen whose image has loaded
  const cycle = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || specs.length < 2) return;
    cycle.current = setInterval(() => setCur((c) => (c + 1) % specs.length), 6500);
    return () => { if (cycle.current) clearInterval(cycle.current); };
  }, [specs.length]);
  const stopCycle = () => { if (cycle.current) { clearInterval(cycle.current); cycle.current = null; } };

  useEffect(() => {
    let alive = true;
    setShown(null);
    const next = new Image();
    next.onload = () => { if (alive) requestAnimationFrame(() => alive && setShown(cur)); };
    next.src = specs[cur].img;
    return () => { alive = false; };
  }, [cur, specs]);

  if (!specs.length) return null;
  const s = specs[cur];
  const colours = [...new Set([s.bg, s.button?.bg, s.head.color, s.body?.color].filter(Boolean))] as string[];
  return (
    <div className="measured-stage">
      <figure className={`stage${dark(s.stage) ? " dark" : ""}`} id="stage" aria-labelledby="stage-cap" style={{ ["--stage" as string]: s.stage }} onPointerEnter={stopCycle}>
        <div className="stage-shot">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img id="spec-img" className={shown === cur ? "" : "swap"} src={s.img} alt={`${s.site}, first screen at 1440 by 1000, measured`} width={1080} height={750} />
          <div className={`marks${shown === cur ? " on" : ""}`} id="marks" aria-hidden="true">
            {s.marks.map((m, i) => (
              <div key={m.kind} className="mark pin" style={{ left: `${m.box[0]}%`, top: `${m.box[1]}%`, width: `${m.box[2]}%`, height: `${m.box[3]}%` }}>
                <b>{i + 1}</b>
              </div>
            ))}
          </div>
        </div>
        <figcaption id="stage-cap" className="stage-cap">
          <div className="stage-title"><Link id="spec-link" href={libraryHref(s.id)}>{s.site}</Link><span id="spec-type">Measured on {s.url.replace(/^https?:\/\/(www\.)?/, "")}</span></div>
          <ol className="legend">
            {s.marks.map((m, i) => <li key={m.kind}><b>{i + 1}</b><span>{NAME[m.kind]}</span><code>{m.label.replace(/^body /, "")}</code></li>)}
          </ol>
          <div className="stage-specs" id="stage-specs">
            {colours.map((c) => <span key={c} className="chip"><i style={{ background: c }} />{c}</span>)}
          </div>
        </figcaption>
      </figure>
      <div className="switch" id="switch" role="tablist" aria-label="Specimens">
        {specs.map((x, i) => (
          <button key={x.id} type="button" role="tab" aria-selected={i === cur} onClick={() => { setCur(i); stopCycle(); }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={x.img} alt="" width={84} height={58} />{x.site}
          </button>
        ))}
      </div>
    </div>
  );
}
