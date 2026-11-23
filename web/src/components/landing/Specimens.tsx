"use client";
// Marks placed on the screenshot (percent of the 1440×1000 top), labels read from the measured tokens.
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cleanFont, libraryHref, palette, typeLabel } from "@/lib/format";
import type { Item } from "@/lib/types";

type Tok = { type: Item["typeScale"]; bg: string; btn: Item["buttons"][number] | Record<string, never>; btns: Item["buttons"] };
type Mark = { x: number; y: number; w?: number; h?: number; side: "top" | "right" | "bottom" | "dot"; label: (t: Tok) => string };
export const SPECS: { id: string; stage: string; dark?: boolean; marks: Mark[] }[] = [
  { id: "lindy-landing", stage: "#f1e7d6", marks: [
    { x: 32, y: 11, w: 35, h: 19, side: "top", label: (t) => `${t.type.h1!.font} ${t.type.h1!.size}/${t.type.h1!.lineHeight}` },
    { x: 67, y: 57, w: 10, h: 5, side: "right", label: (t) => `button ${t.btn.height}px · r ${parseInt(t.btn.radius as string)}` },
    { x: 9, y: 46, side: "dot", label: (t) => t.bg },
  ] },
  { id: "linear-pricing", stage: "#16171a", dark: true, marks: [
    { x: 5, y: 16, w: 10, h: 5, side: "right", label: (t) => `${t.type.h1!.font} ${t.type.h1!.size}/${t.type.h1!.lineHeight} w${t.type.h1!.weight}` },
    { x: 52, y: 78, w: 10, h: 4.5, side: "top", label: (t) => `${t.btns[1].height}px · r ${parseInt(t.btns[1].radius)} · ${t.btns[1].bg}` },
    { x: 92, y: 60, side: "dot", label: (t) => t.bg },
  ] },
  { id: "kagi-pricing", stage: "#fbecc9", marks: [
    { x: 42.5, y: 11, w: 15, h: 7.5, side: "right", label: (t) => `${t.type.h1!.font} ${t.type.h1!.size}/${t.type.h1!.lineHeight} w${t.type.h1!.weight}` },
    { x: 30.5, y: 32.5, w: 7, h: 4.5, side: "bottom", label: (t) => `${t.btn.height}px · r ${parseInt(t.btn.radius as string)} · ${t.btn.bg}` },
  ] },
  { id: "stripe-press-landing", stage: "#dfe6ee", marks: [
    { x: 8, y: 8.5, w: 50, h: 6, side: "bottom", label: (t) => `${t.type.h2!.font} ${t.type.h2!.size}/${t.type.h2!.lineHeight} w${t.type.h2!.weight}` },
    { x: 95, y: 40, side: "dot", label: (t) => t.bg },
  ] },
  { id: "hey-landing", stage: "#ece6fb", marks: [
    { x: 18, y: 31, w: 64, h: 18, side: "top", label: (t) => `${t.type.h1!.font} ${t.type.h1!.size}/${t.type.h1!.lineHeight} w${t.type.h1!.weight}` },
    { x: 37, y: 62, w: 25, h: 6.5, side: "right", label: () => "the one filled button" },
  ] },
];

const tokensOf = (it: Item): Tok => ({ type: it.typeScale || {}, bg: it.colors?.background || "", btn: (it.buttons || [])[0] || {}, btns: it.buttons || [] });

export function Specimens({ items }: { items: Item[] }) {
  const specs = SPECS.filter((s) => items.some((it) => it.id === s.id));
  const byId = Object.fromEntries(items.map((it) => [it.id, it]));
  const [cur, setCur] = useState(0);
  const [shown, setShown] = useState<{ i: number; src: string } | null>(null); // the specimen whose image has loaded
  const [marksOn, setMarksOn] = useState(false);
  const cycle = useRef<ReturnType<typeof setInterval> | null>(null);

  // gently cycle through the specimens until the visitor picks one
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    cycle.current = setInterval(() => setCur((c) => (c + 1) % specs.length), 6000);
    return () => { if (cycle.current) clearInterval(cycle.current); };
  }, [specs.length]);
  const stopCycle = () => { if (cycle.current) { clearInterval(cycle.current); cycle.current = null; } };

  // swap the image only once the next one has loaded, then let the marks in
  useEffect(() => {
    const it = byId[specs[cur].id]; if (!it) return;
    setMarksOn(false);
    let alive = true;
    const next = new Image();
    next.onload = () => { if (!alive) return; setShown({ i: cur, src: next.src }); requestAnimationFrame(() => requestAnimationFrame(() => alive && setMarksOn(true))); };
    next.src = it.screens.desktop!.thumb;
    return () => { alive = false; };
  }, [cur]); // eslint-disable-line react-hooks/exhaustive-deps

  const s = specs[cur], it = byId[s.id];
  const shownSpec = shown ? specs[shown.i] : null;
  const pal = palette(it, 4).filter((c) => c);
  return (
    <div className="measured-stage">
      <figure className={`stage${s.dark ? " dark" : ""}`} id="stage" aria-labelledby="stage-cap" style={{ ["--stage" as string]: s.stage }} onPointerEnter={stopCycle}>
        <div className="stage-shot">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img id="spec-img" className={shown && shown.i === cur ? "" : "swap"} src={shown?.src || it.screens.desktop!.thumb} alt={`${it.site} ${typeLabel(it.type).toLowerCase()}: ${it.note}`} width={720} height={500} />
          <div className={`marks${marksOn ? " on" : ""}`} id="marks" aria-hidden="true">
            {shownSpec && shownSpec.marks.map((m, i) => {
              let label = ""; try { label = m.label(tokensOf(byId[shownSpec.id])); } catch { return null; }
              const style = m.side === "dot" ? { left: `${m.x}%`, top: `${m.y}%` } : { left: `${m.x}%`, top: `${m.y}%`, width: `${m.w}%`, height: `${m.h}%` };
              return <div key={i} className={`mark ${m.side === "dot" ? "dot right" : m.side}`} style={style}><span>{label}</span></div>;
            })}
          </div>
        </div>
        <figcaption id="stage-cap" className="stage-cap">
          <div className="stage-title"><Link id="spec-link" href={libraryHref(it.id)}>{it.site}</Link><span id="spec-type">{typeLabel(it.type)}</span></div>
          <div className="stage-specs" id="stage-specs">
            {it.fonts.slice(0, 2).map((f) => <span key={f} className="chip">{cleanFont(f)}</span>)}
            {pal.map((c) => <span key={c} className="chip"><i style={{ background: c }} />{c}</span>)}
          </div>
        </figcaption>
      </figure>
      <div className="switch" id="switch" role="tablist" aria-label="Specimens">
        {specs.map((sp, i) => {
          const x = byId[sp.id];
          return (
            <button key={sp.id} type="button" role="tab" aria-selected={i === cur} onClick={() => { setCur(i); stopCycle(); }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={x.screens.desktop!.thumb} alt="" width={84} height={58} />{x.site}
            </button>
          );
        })}
      </div>
    </div>
  );
}
