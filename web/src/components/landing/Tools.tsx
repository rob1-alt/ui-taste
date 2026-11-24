"use client";
// What the skill does, one tool per row, each with a small demo that runs when it comes on screen.
// The demos replay real data: the search results, tokens and image are the library's own.
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { libraryHref, typeLabel } from "@/lib/format";
import { haystack, search, type SearchItem, type Synonyms } from "@/lib/search";
import { useInView } from "./useInView";
import { Head } from "./Head";

export type SearchHit = { id: string; site: string; type: string; why: string; thumb: string; pal: string[]; meta?: string };
export type Measured = { id: string; site: string; thumb: string; chips: { x: number; y: number; label: string }[] };

const still = () => typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

function SearchDemo({ hits, total }: { hits: SearchHit[]; total: number }) {
  // Plays "pricing page, dark" on its own; as soon as the visitor clicks, it is a real search over the library,
  // ranked like find_refs.py, on an index loaded the first time.
  const Q = "pricing page, dark";
  const [ref, on] = useInView<HTMLDivElement>();
  const [q, setQ] = useState(""), [shown, setShown] = useState(0), [live, setLive] = useState(false);
  const [res, setRes] = useState<SearchHit[]>(hits);
  const idx = useRef<{ items: SearchItem[]; syn: Synonyms; hays: Map<string, string> } | null>(null);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!on || live) return;
    if (still()) { setQ(Q); setShown(hits.length); return; }
    let i = 0, t: ReturnType<typeof setTimeout>;
    const run = () => {
      setQ(""); setShown(0); i = 0;
      const type = () => { i++; setQ(Q.slice(0, i)); if (i < Q.length) t = setTimeout(type, 55); else t = setTimeout(show, 350); };
      let k = 0; const show = () => { k++; setShown(k); t = setTimeout(k < hits.length ? show : run, k < hits.length ? 380 : 6000); };
      t = setTimeout(type, 400);
    };
    run();
    return () => clearTimeout(t);
  }, [on, live, hits.length]);

  const goLive = async () => {
    if (live) return;
    setLive(true); setQ(""); setRes([]); setShown(0);
    if (!idx.current) {
      const r = await fetch("/search-index.json").then((x) => x.json());
      idx.current = { items: r.items, syn: r.synonyms, hays: new Map(r.items.map((it: SearchItem) => [it.id, haystack(it, r.synonyms)])) };
    }
  };
  const onType = (v: string) => {
    setQ(v);
    const I = idx.current; if (!I) return;
    const found = search(I.items, v, I.syn, I.hays, 3).map((it) => ({
      id: it.id, site: it.site, type: typeLabel(it.type), why: it.note.split(/(?<=\.)\s/)[0], thumb: it.thumb, pal: it.pal,
      meta: [it.h1 && `h1 ${it.h1}`, it.btn && `button ${it.btn}`].filter(Boolean).join(" · "),
    }));
    setRes(found); setShown(found.length);
  };

  return (
    <div className="demo-term live" ref={ref}>
      <div className="dt-bar"><span>find_refs.py</span><span>{live ? "your search" : "click to try your own"} · {total} pages</span></div>
      <label className="dt-line" onClick={() => { goLive(); input.current?.focus(); }}>
        <b>$</b> find_refs.py "
        <input ref={input} value={q} onFocus={goLive} onChange={(e) => onType(e.target.value)} placeholder={live ? "dark pricing, empty state, bento…" : ""}
          aria-label="Search the library like Claude does" spellCheck={false} autoComplete="off" size={Math.max(4, q.length || (live ? 26 : 1))} />"
        {!live && <i className={q.length < Q.length ? "caret" : "caret blink"} />}
      </label>
      <ol className="dt-hits">
        {res.map((h, i) => (
          <li key={h.id} className={i < shown ? "in" : ""}>
            <Link href={libraryHref(h.id)} tabIndex={i < shown ? 0 : -1}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={h.thumb} alt="" />
              <div><b>{h.site}</b><small>{h.type}</small><p>{h.why}</p>{h.meta && <em>{h.meta}</em>}</div>
              <span className="dt-pal">{h.pal.map((c) => <i key={c} style={{ background: c }} />)}</span>
            </Link>
          </li>
        ))}
        {live && q.trim() && !res.length && <li className="in dt-none">Nothing ranks for that. Try a page type, a pattern or a site: “pricing”, “bento”, “Linear”.</li>}
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
