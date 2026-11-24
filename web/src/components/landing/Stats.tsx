// Numbers computed from the measured values of every page, at build time.
import { lum } from "@/lib/format";
import type { Item } from "@/lib/types";

const med = (arr: number[]) => { const s = arr.slice().sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : 0; };
const pct = (n: number, d: number) => Math.round((n / d) * 100);

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
  const fin = (a: number[]) => a.filter(Number.isFinite);
  const lhH1 = med(fin(h1s.map((t) => t.lineHeight))), bodyMed = med(bodies.map((t) => t.size));
  const small = pct(btns.filter((b) => radius(b) <= 8).length, btns.length);
  const N = (v: React.ReactNode) => <b className="nb">{v}</b>;
  // the eight figures that used to sit in a grid of tiles, said as one paragraph: the numbers carry it
  return (
    <section className="numbers" id="numbers">
      <p className="nums-lead"><span className="nums-big">{LIB.length}</span> good pages, measured. Here is what they agree on.</p>
      <p className="nums">
        The median headline is {N(`${h1Med}px`)}, set tight at {N(lhH1)}. Its most common weight is {N(topWeight[0])}: good pages rarely shout in bold.
        Only {N(`${pct(interN, LIB.length)}%`)} are set in Inter, and {N(`${pct(oneFamily, LIB.length)}%`)} load a single typeface.
        Body text sits at {N(`${bodyMed}px`)}. Buttons are small: the most common one is{" "}
        <span className="nums-btn" style={{ height: `${topHeight[0]}px` }}>{topHeight[0]}px</span>{" "}tall, {N(`${small}%`)} have a radius of 8px or less and {N(`${pct(pills, btns.length)}%`)} are pills.
        And {N(`${pct(darkN, LIB.length)}%`)} of pages are dark. Dark is a choice, not a default.
      </p>
      <p className="nums-note">Computed at build time from the values read on every page of the library. They are what the skill steers Claude toward.</p>
    </section>
  );
}
