"use client";
// What the skill does, one tool per row, each with a small demo that runs when it comes on screen.
// The demos replay real data: the search results, tokens and image are the library's own.
import { useEffect, useState } from "react";
import { useInView } from "./useInView";
import { Head } from "./Head";

export type SearchHit = { id: string; site: string; type: string; why: string; thumb: string; pal: string[] };
export type Measured = { id: string; site: string; thumb: string; chips: { x: number; y: number; label: string }[] };

const still = () => typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

function SearchDemo({ hits, total }: { hits: SearchHit[]; total: number }) {
  const Q = '"pricing page, dark"';
  const [ref, on] = useInView<HTMLDivElement>();
  const [typed, setTyped] = useState(0), [shown, setShown] = useState(0);
  useEffect(() => {
    if (!on) return;
    if (still()) { setTyped(Q.length); setShown(hits.length); return; }
    let i = 0, t: ReturnType<typeof setTimeout>;
    const run = () => {
      setTyped(0); setShown(0); i = 0;
      const type = () => { i++; setTyped(i); if (i < Q.length) t = setTimeout(type, 55); else t = setTimeout(show, 350); };
      let k = 0; const show = () => { k++; setShown(k); t = setTimeout(k < hits.length ? show : run, k < hits.length ? 380 : 5200); };
      t = setTimeout(type, 400);
    };
    run();
    return () => clearTimeout(t);
  }, [on, hits.length]);
  return (
    <div className="demo-term" ref={ref} aria-hidden="true">
      <div className="dt-bar"><span>find_refs.py</span><span>{total} pages</span></div>
      <div className="dt-line"><b>$</b> find_refs.py {Q.slice(0, typed)}<i className={typed < Q.length ? "caret" : "caret blink"} /></div>
      <ol className="dt-hits">
        {hits.map((h, i) => (
          <li key={h.id} className={i < shown ? "in" : ""}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={h.thumb} alt="" />
            <div><b>{h.site}</b><small>{h.type}</small><p>{h.why}</p></div>
            <span className="dt-pal">{h.pal.map((c) => <i key={c} style={{ background: c }} />)}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function MeasureDemo({ m }: { m: Measured }) {
  const [ref, on] = useInView<HTMLDivElement>();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!on) return;
    if (still()) { setN(m.chips.length); return; }
    let k = 0, t: ReturnType<typeof setTimeout>;
    const tick = () => { k = k >= m.chips.length ? 0 : k + 1; setN(k); t = setTimeout(tick, k === m.chips.length ? 4200 : k === 0 ? 900 : 650); };
    t = setTimeout(tick, 900);
    return () => clearTimeout(t);
  }, [on, m.chips.length]);
  return (
    <div className="demo-measure" ref={ref} aria-hidden="true">
      <div className="dm-shot">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={m.thumb} alt="" />
        <span className={`dm-scan${on && n === 0 ? " go" : ""}`} />
        {m.chips.map((c, i) => <span key={c.label} className={`dm-chip${i < n ? " in" : ""}`} style={{ left: `${c.x}%`, top: `${c.y}%` }}>{c.label}</span>)}
      </div>
      <div className="dm-foot"><span>capture.py {m.site.toLowerCase()}.app/pricing</span><span>{n === m.chips.length ? "saved to the library" : "reading computed styles…"}</span></div>
    </div>
  );
}

function SlotDemo() {
  const [ref, on] = useInView<HTMLDivElement>();
  const [filled, setFilled] = useState(false);
  useEffect(() => {
    if (!on) return;
    if (still()) { setFilled(true); return; }
    let t: ReturnType<typeof setTimeout>;
    const loop = (v: boolean) => { setFilled(v); t = setTimeout(() => loop(!v), v ? 4800 : 2600); };
    t = setTimeout(() => loop(true), 1600);
    return () => clearTimeout(t);
  }, [on]);
  return (
    <div className={`demo-slot${filled ? " filled" : ""}`} ref={ref} aria-hidden="true">
      <div className="ds-page">
        <div className="ds-nav"><b>Maison Kalf</b><span>Collection · Atelier · Visit</span></div>
        <div className="ds-art">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/demo/kalf.jpg" alt="" />
          <div className="ds-brief"><b>hero-art</b> · 16/9 · tone dark<br />A still life on a dark ground: one object lit from the left, room on the right for the headline.</div>
          <div className="ds-copy"><h4>Objects worth<br />keeping.</h4><span>Book a visit</span></div>
        </div>
      </div>
      <div className="dm-foot"><span>slots.py index.html</span><span>{filled ? "dark, bottom third 0.18 → white text, 40% veil" : "hero-art: EMPTY, brief shown"}</span></div>
    </div>
  );
}

export function Tools({ hits, measured, total }: { hits: SearchHit[]; measured: Measured; total: number }) {
  const rows = [
    { k: "find_refs.py", h: "It looks before it builds.", p: "For the one question it has to settle, a pricing table, an empty state, a dark hero, Claude searches the library and opens the screenshot before deciding. One strong reference is enough. Three is the limit.", demo: <SearchDemo hits={hits} total={total} /> },
    { k: "capture.py", h: "It reads the numbers off the live page.", p: "Every page is captured on desktop and mobile, then read from the browser's computed styles: fonts, sizes, line heights, colours, buttons. Point it at any site and it joins your library the same way.", demo: <MeasureDemo m={measured} /> },
    { k: "slots.py", h: "It leaves room for your pictures.", p: "It does not invent photos or art. It lays out image slots with a brief, a ratio and a tone. You drop in the real files, and it measures them and adapts the crop, the veil and the text colour.", demo: <SlotDemo /> },
  ];
  return (
    <section className="toolset" id="tools">
      <Head title={<>Looks first.<br />Builds second.</>}>Three things Claude does on its own before and after it writes a line of CSS. Each one below replays real data from the library.</Head>
      <div className="figs">
        {rows.map((r, i) => (
          <figure className="fig" key={r.k}>
            <div className="fig-demo">{r.demo}</div>
            <figcaption className="fig-cap">
              <span className="fig-n">Fig. {i + 1}<em>{r.k}</em></span>
              <h3>{r.h}</h3>
              <p>{r.p}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
