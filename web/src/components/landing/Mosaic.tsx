"use client";
// The word TASTE spelled with the pages of the library. The grid fills the first screen: the column count is
// chosen so the tiles stay close to a phone screen for the space the headline leaves. Imperative on purpose:
// 500 tiles, a torch following the pointer and swaps every two seconds are cheaper outside React's render loop.
import Link from "next/link";
import { useEffect, useRef } from "react";
import { libraryHref, typeLabel } from "@/lib/format";
import type { Tile } from "@/lib/types";

const GLYPH: Record<string, string[]> = {
  T: ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
  A: ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
  S: ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
  E: ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
};
type Letters = [string, number, number][];
type Word = { minCols: number; maxCols?: number; minRows: number; aspect: number; letters: (co: number, ro: number) => Letters; pad: (cols: number, rows: number) => [number, number] };
const WORD: Record<"wide" | "tall", Word> = {
  wide: { minCols: 39, minRows: 7, aspect: 507 / 260, letters: (co, ro) => [["T", ro, 5 + co], ["A", ro, 11 + co], ["S", ro, 17 + co], ["T", ro, 23 + co], ["E", ro, 29 + co]], pad: (cols, rows) => [Math.floor((cols - 39) / 2), Math.floor((rows - 7) / 2)] },
  tall: { minCols: 13, maxCols: 15, minRows: 21, aspect: 1.08, letters: (co, ro) => [["T", ro, 1 + co], ["A", ro, 7 + co], ["S", 7 + ro, 1 + co], ["T", 7 + ro, 7 + co], ["E", 14 + ro, 4 + co]], pad: (cols, rows) => [Math.floor((cols - 13) / 2), Math.floor((rows - 21) / 2)] },
};
const STAR = ["stripe-press-landing", "playdate-landing", "kagi-pricing", "hey-landing", "lindy-landing", "netlify-landing", "duolingo-landing", "oatly-landing", "glossier-landing", "panic-landing", "cosmos-landing", "anthropic-landing", "basecamp-landing", "tailscale-landing", "mailchimp-landing", "notion-landing"];
const esc = (s: unknown) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);

export function Mosaic({ tiles }: { tiles: Tile[] }) {
  const mosaicRef = useRef<HTMLDivElement>(null);
  const nRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const mosaic = mosaicRef.current!, tiN = nRef.current!, tiText = textRef.current!;
    const LIB = tiles, N = LIB.length;
    let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const shuffle = <T,>(arr: T[]) => { for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; };
    const byId = Object.fromEntries(LIB.map((x) => [x.id, x]));
    const starred = STAR.filter((id) => byId[id]?.light).map((id) => byId[id]);
    const lightPages = [...starred, ...shuffle(LIB.filter((x) => x.light && !STAR.includes(x.id)))];

    let cells: Tile[] = [], lit = new Set<number>(), layout: { key: string; cols: number; rows: number; letters: Letters; wide: boolean } | null = null, centers: [HTMLElement, number, number][] | null = null;

    function fitLayout(word: Word, W: number, H: number, gap: number) {
      let best: { cols: number; rows: number; err: number } | null = null;
      for (let cols = word.minCols; cols <= (word.maxCols || 160); cols++) {
        const tw = (W - gap * (cols - 1)) / cols;
        // capped grids (phones) take as many rows as the height allows; open grids take one cell per page
        const rows = Math.max(word.minRows, word.maxCols ? Math.round((H + gap) / (tw * word.aspect + gap)) : Math.ceil(N / cols));
        const th = (H - gap * (rows - 1)) / rows;
        const err = Math.abs(Math.log((th / tw) / word.aspect));
        if (!best || err < best.err) best = { cols, rows, err };
      }
      const b = best!, [co, ro] = word.pad(b.cols, b.rows);
      return { key: `${word.minCols}:${b.cols}x${b.rows}`, cols: b.cols, rows: b.rows, letters: word.letters(co, ro), wide: word === WORD.wide };
    }

    function build() {
      const cs = getComputedStyle(mosaic), gap = parseFloat(cs.columnGap) || 3;
      const W = mosaic.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      const H = Math.max(mosaic.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom), 120);
      const L = fitLayout(matchMedia("(max-width: 720px)").matches ? WORD.tall : WORD.wide, W, H, gap);
      // rows in px so the grid's height never depends on the images: it is exactly the space the hero leaves
      mosaic.style.gridTemplateRows = `repeat(${L.rows}, ${((H - gap * (L.rows - 1)) / L.rows).toFixed(2)}px)`;
      if (layout && L.key === layout.key) return;
      layout = L; seed = 7;
      lit = new Set();
      L.letters.forEach(([ch, r0, c0]) => GLYPH[ch].forEach((line, r) => [...line].forEach((v, c) => { if (v === "1") lit.add((r0 + r) * L.cols + c0 + c); })));
      const litPages = lightPages.slice(0, lit.size);
      const rest = shuffle(LIB.filter((x) => !litPages.includes(x)));
      const pool = shuffle(litPages.slice());
      cells = [];
      // the grid rarely divides the library exactly: the last cells repeat dimmed pages rather than leave a ragged row
      for (let i = 0, a = 0, b = 0; i < L.cols * L.rows; i++) cells.push(lit.has(i) ? pool[a++] : rest[b++ % rest.length]);
      mosaic.style.setProperty("--cols", String(L.cols));
      mosaic.classList.remove("in");
      mosaic.innerHTML = cells.map((it, i) => {
        if (!it) return `<span class="tile off" data-i="${i}"></span>`;
        const col = i % L.cols, row = Math.floor(i / L.cols), on = lit.has(i);
        const delay = L.wide ? col * 14 + rnd() * 160 : row * 30 + rnd() * 120;
        return `<a class="tile${on ? "" : " off"}" href="${libraryHref(it.id)}" data-i="${i}" style="--d:${Math.round(delay)}ms" aria-label="${esc(it.site)}, ${esc(typeLabel(it.type).toLowerCase())}"><img src="${esc(it.src)}" alt="" decoding="async"></a>`;
      }).join("");
      requestAnimationFrame(() => requestAnimationFrame(() => mosaic.classList.add("in")));
      centers = null;
    }
    build();
    // the mosaic's box changes when the font lands (the headline rewraps) and on resize: refit the grid then
    let rt: ReturnType<typeof setTimeout>; const refit = () => { clearTimeout(rt); rt = setTimeout(build, 120); };
    const ro = new ResizeObserver(refit); ro.observe(mosaic);
    document.fonts?.ready.then(refit);

    // name of the hovered page
    const tileInfo = (a: HTMLElement) => {
      const i = +a.dataset.i!, it = cells[i]; if (!it) return;
      tiN.textContent = `Page ${String(i + 1).padStart(3, "0")} of ${N}`;
      tiText.innerHTML = `<b>${esc(it.site)}</b>${esc(typeLabel(it.type))} · ${esc(it.hint)}`;
    };
    const onOver = (e: Event) => { const a = (e.target as HTMLElement).closest<HTMLElement>(".tile"); if (a) tileInfo(a); };
    mosaic.addEventListener("pointerover", onOver);
    mosaic.addEventListener("focusin", onOver);

    // a torch: the dimmed pages light up around the pointer
    let px = -1e4, py = -1e4, torchRaf = 0;
    const measureCenters = () => { centers = [...mosaic.children].map((t) => { const r = t.getBoundingClientRect(); return [t as HTMLElement, r.left + r.width / 2, r.top + r.height / 2 + scrollY]; }); };
    function torch() {
      torchRaf = 0;
      if (!centers) measureCenters();
      const R = 150;
      for (const [t, cx, cy] of centers!) {
        if (!t.classList.contains("off")) continue;
        const d = Math.hypot(cx - px, cy - py);
        t.style.setProperty("--glow", d < R ? (1 - d / R).toFixed(2) : "0");
      }
    }
    const onMove = (e: PointerEvent) => { px = e.clientX; py = e.clientY + scrollY; if (!torchRaf) torchRaf = requestAnimationFrame(torch); };
    const onLeaveTorch = () => { px = py = -1e4; torch(); };
    const onResize = () => { centers = null; };
    const hover = matchMedia("(hover: hover)").matches;
    if (hover) {
      mosaic.addEventListener("pointermove", onMove);
      mosaic.addEventListener("pointerleave", onLeaveTorch);
      addEventListener("resize", onResize);
    }

    // the word shimmers: now and then a page in a letter trades places with a light page outside it
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let hovering = false;
    const onEnter = () => { hovering = true; }, onLeave = () => { hovering = false; };
    mosaic.addEventListener("pointerenter", onEnter);
    mosaic.addEventListener("pointerleave", onLeave);
    const timers: ReturnType<typeof setTimeout>[] = [];
    function swapOnce() {
      if (hovering || document.hidden) return;
      const litIdx = [...lit], offLight = cells.map((it, i) => (it && !lit.has(i) && it.light ? i : -1)).filter((i) => i >= 0);
      if (!offLight.length) return;
      for (let k = 0; k < 3; k++) {
        const a = litIdx[Math.floor(Math.random() * litIdx.length)], b = offLight[Math.floor(Math.random() * offLight.length)];
        [cells[a], cells[b]] = [cells[b], cells[a]];
        for (const i of [a, b]) {
          const t = mosaic.children[i] as HTMLAnchorElement, it = cells[i];
          t.classList.add("flip");
          timers.push(setTimeout(() => {
            t.querySelector("img")!.src = it.src;
            t.href = libraryHref(it.id);
            t.setAttribute("aria-label", `${it.site}, ${typeLabel(it.type).toLowerCase()}`);
            t.classList.remove("flip");
          }, 220));
        }
      }
    }
    const swap = still ? 0 : setInterval(swapOnce, 1800);

    return () => {
      clearTimeout(rt); ro.disconnect(); clearInterval(swap); timers.forEach(clearTimeout);
      mosaic.removeEventListener("pointerover", onOver); mosaic.removeEventListener("focusin", onOver);
      mosaic.removeEventListener("pointermove", onMove); mosaic.removeEventListener("pointerleave", onLeaveTorch);
      mosaic.removeEventListener("pointerenter", onEnter); mosaic.removeEventListener("pointerleave", onLeave);
      removeEventListener("resize", onResize);
      mosaic.innerHTML = "";
    };
  }, [tiles]);

  return (
    <section className="hero">
      <div className="mosaic" id="mosaic" ref={mosaicRef} role="img" aria-label="The word TASTE spelled out with the page screenshots of the library" />
      <div className="hero-foot">
        <h1>A Claude Code skill that shows your agent what good looks&nbsp;like.</h1>
        <div className="hero-side">
          <p className="tile-info" id="tile-info" aria-live="polite">
            <span className="ti-n" ref={nRef}><span className="n-all">{tiles.length}</span></span>
            <span ref={textRef}>pages, one per tile. Hover any of them.</span>
          </p>
          <div className="actions">
            <Link className="btn btn-ink btn-lg" href="/library">Browse the library</Link>
            <a className="btn btn-line btn-lg" href="#install">Install</a>
          </div>
        </div>
      </div>
    </section>
  );
}
