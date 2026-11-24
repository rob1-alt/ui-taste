"use client";
// The landing directions as a drum: the current one large and red, the next ones stepping back.
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { libraryHref } from "@/lib/format";
import type { Direction } from "@/lib/directions";
import { SectionHead } from "@/components/landing/SectionHead";

export function Directions({ list }: { list: Direction[] }) {
  const [i, setI] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const N = list.length;
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    timer.current = setInterval(() => setI((x) => (x + 1) % N), 3200);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [N]);
  const stop = () => { if (timer.current) { clearInterval(timer.current); timer.current = null; } };
  const go = (d: number) => { stop(); setI((x) => (x + d + N) % N); };
  const cur = list[i];
  return (
    <section className="directions" id="directions">
      <SectionHead n={3} label="Directions" title={`${N} directions, 3 concepts`} lede="Instead of the one average page every model makes, the skill drafts three concepts from three different directions, each with its own references from the library, and builds the one you pick." />
      <div className="drum" onPointerEnter={stop}>
        <button type="button" className="drum-arrow" aria-label="Previous direction" onClick={() => go(-1)}>←</button>
        <ol className="drum-list" aria-live="polite">
          {[0, 1, 2, 3, 4].map((k) => {
            const d = list[(i + k) % N];
            return <li key={`${i}-${k}`} className={`drum-${k}`} onClick={k ? () => go(k) : undefined}>{d.name}</li>;
          })}
        </ol>
        <button type="button" className="drum-arrow" aria-label="Next direction" onClick={() => go(1)}>→</button>
      </div>
      <div className="drum-foot">
        <span className="drum-n"><b>{String(i + 1).padStart(2, "0")}</b> of {N}</span>
        <p className="drum-bet">{cur.bet}</p>
        <span className="drum-refs">{cur.refs.length ? <>Look at {cur.refs.map((r, k) => <span key={r.id}>{k ? ", " : " "}<Link href={libraryHref(r.id)}>{r.site}</Link></span>)}</> : "references/landing-concepts.md"}</span>
      </div>
    </section>
  );
}
