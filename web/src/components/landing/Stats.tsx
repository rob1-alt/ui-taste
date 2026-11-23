// Numbers computed from the measured values of every page, at build time.
import { lum } from "@/lib/format";
import type { Item } from "@/lib/types";

const med = (arr: number[]) => { const s = arr.slice().sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : 0; };
const pct = (n: number, d: number) => Math.round((n / d) * 100);
const hist = (arr: number[], lo: number, hi: number, step: number) => {
  const out: [number, number][] = [];
  for (let v = lo; v <= hi; v += step) out.push([v, arr.filter((x) => x >= v && x < v + step).length]);
  const mx = Math.max(...out.map((o) => o[1]));
  return out.map(([v, n]) => [v, (n / mx) * 100] as [number, number]);
};

export function Stats({ items }: { items: Item[] }) {
  const LIB = items;
  const h1s = LIB.map((x) => x.typeScale?.h1).filter((t): t is NonNullable<typeof t> => !!t && t.size > 0);
  const bodies = LIB.map((x) => x.typeScale?.body).filter((t): t is NonNullable<typeof t> => !!t && t.size > 0);
  const btns = LIB.map((x) => (x.buttons || [])[0]).filter(Boolean);
  const radius = (b: Item["buttons"][number]) => parseFloat(b.radius) || 0;
  const weightCount: Record<string, number> = {}; h1s.forEach((t) => { const w = String(t.weight); weightCount[w] = (weightCount[w] || 0) + 1; });
  const topWeight = Object.entries(weightCount).sort((x, y) => y[1] - x[1])[0] || ["400", 0];
  const interN = LIB.filter((x) => /inter/i.test(x.fonts[0] || "")).length;
  const oneFamily = LIB.filter((x) => x.fonts.length === 1).length;
  const darkN = LIB.filter((x) => lum(x.colors?.background) < 0.3).length;
  const pills = btns.filter((b) => radius(b) >= 50).length;
  const heights: Record<string, number> = {}; btns.forEach((b) => { if (b.height) heights[b.height] = (heights[b.height] || 0) + 1; });
  const topHeight = Object.entries(heights).sort((x, y) => y[1] - x[1])[0] || ["36", 0];
  const h1Med = med(h1s.map((t) => t.size));
  const h1Hist = hist(h1s.map((t) => t.size), 16, 128, 8);
  const fin = (a: number[]) => a.filter(Number.isFinite);
  const STATS: { n: string | number; unit: string; k: string; p: string; red?: boolean; btn?: boolean; viz?: [number, number][]; on?: (v: number) => boolean }[] = [
    { n: h1Med, unit: "px", k: "Median headline size", p: `At a line height of ${med(fin(h1s.map((t) => t.lineHeight)))}. Big, but tightly set.`, viz: h1Hist, on: (v) => v <= h1Med && v + 8 > h1Med },
    { n: topWeight[0], unit: "", k: "Most common headline weight", p: `${topWeight[1]} of ${h1s.length} headlines are regular weight. Good pages rarely shout in bold.`, red: true },
    { n: pct(interN, LIB.length), unit: "%", k: "Set in Inter", p: "The default font is not the problem. What makes a page generated is how everything else is decided." },
    { n: pct(oneFamily, LIB.length), unit: "%", k: "Use a single typeface", p: `${oneFamily} pages load one family and nothing else. Most of the rest use two.` },
    { n: med(bodies.map((t) => t.size)), unit: "px", k: "Median body text", p: `At ${med(fin(bodies.map((t) => t.lineHeight)))} line height. Not 18, not 14.` },
    { n: topHeight[0], unit: "px", k: "Most common button height", p: `${topHeight[1]} pages. Median ${med(btns.map((b) => b.height || 0).filter(Boolean))}px: small, confident buttons.`, btn: true },
    { n: pct(pills, btns.length), unit: "%", k: "Pill buttons", p: `The rest are square-ish: ${pct(btns.filter((b) => radius(b) <= 8).length, btns.length)}% have a radius of 8px or less.` },
    { n: pct(darkN, LIB.length), unit: "%", k: "Dark pages", p: `${LIB.length - darkN} pages are light. Dark is a choice, not a default.` },
  ];
  return (
    <section className="numbers" id="numbers">
      <header className="head">
        <h2>What <span className="n-all">{LIB.length}</span> good pages have in common</h2>
        <p className="head-lede">Computed from the values measured on every page of the library. They are what the skill steers Claude toward, and a few of them are not what you would guess.</p>
      </header>
      <div className="stats" id="stats">
        {STATS.map((s) => (
          <div className="stat" key={s.k}>
            <span className={`stat-n${s.red ? " red" : ""}`}>{s.n}<small>{s.unit}</small></span>
            <span className="stat-k">{s.k}</span>
            <p>{s.p}</p>
            {s.viz && <div className="stat-viz" aria-hidden="true">{s.viz.map(([v, n]) => <i key={v} className={s.on!(v) ? "on" : ""} style={{ height: `${Math.max(4, n)}%` }} />)}</div>}
            {s.btn && <span className="stat-btn" style={{ height: `${s.n}px` }}>{s.n}px button</span>}
          </div>
        ))}
      </div>
    </section>
  );
}
