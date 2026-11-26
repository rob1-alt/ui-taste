import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import data from "../public/data.json";
import { clamp, DIM, display, INK, label, LINE, MONO, PAD, ramp, RED, Rise, Scene, Tag, useRise, WHITE } from "./ui";

type TileT = { id: string; site: string; light: number; spread: number };
const TILES = data.tiles as TileT[];
const STATS = data.stats as { pages: number; sites: number; shots: number };
type Run = { turns: number; seconds: number };
const PAIRS = (data.compare as { pairs: { name: string; without: Run; with: Run; iterate?: Run }[] }).pairs;
const tile = (t: TileT) => staticFile(`tiles/${t.id}.jpg`);
const fmt = (n: number) => n.toLocaleString("en-US");

/* ---------------------------------------------------------------------------------------------
 * 1 · Open: the library's pages fill the frame, then only the ones that spell TASTE stay lit.
 *     The site's headline arrives underneath, as on uitaste.dev.
 * ------------------------------------------------------------------------------------------- */
const GLYPH: Record<string, string[]> = {
  T: ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
  A: ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
  S: ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
  E: ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
};
const COLS = 43, ROWS = 9, GAP = 4;
const LIT = (() => {
  const s = new Set<number>();
  [["T", 7], ["A", 13], ["S", 19], ["T", 25], ["E", 31]].forEach(([ch, c0]) =>
    GLYPH[ch as string].forEach((line, r) => [...line].forEach((v, c) => { if (v === "1") s.add((1 + r) * COLS + (c0 as number) + c); })));
  return s;
})();
const MOSAIC = (() => {
  const bright = TILES.slice().sort((a, b) => b.light + b.spread - (a.light + a.spread));
  const lit = bright.slice(0, LIT.size), rest = TILES.filter((t) => !lit.includes(t));
  let a = 0, b = 0;
  return Array.from({ length: COLS * ROWS }, (_, i) => (LIT.has(i) ? lit[a++] : rest[b++ % rest.length]));
})();

export const Open: React.FC<{ total: number }> = ({ total }) => {
  const frame = useCurrentFrame();
  const W = 1920 - PAD * 2, tw = (W - GAP * (COLS - 1)) / COLS, th = tw * 1.95;
  const dimAt = 46;
  const push = interpolate(frame, [0, total], [1.0, 1.05]);
  return (
    <Scene total={total}>
      <div style={{ position: "absolute", left: PAD, top: 92, width: W, height: ROWS * th + (ROWS - 1) * GAP, transform: `scale(${push})`, transformOrigin: "50% 40%" }}>
        {MOSAIC.map((t, i) => {
          const c = i % COLS, r = Math.floor(i / COLS);
          const inP = ramp(frame, c * 0.7 + ((r * 7) % 5), c * 0.7 + ((r * 7) % 5) + 12);
          const on = LIT.has(i);
          const d0 = dimAt + ((c * 13 + r * 7) % 18);
          const dim = on ? 0 : ramp(frame, d0, d0 + 14);
          return (
            <div key={i} style={{ position: "absolute", left: c * (tw + GAP), top: r * (th + GAP), width: tw, height: th, borderRadius: 2, overflow: "hidden", opacity: inP * (1 - 0.84 * dim), transform: `translateY(${(1 - inP) * 20}px)`, filter: `grayscale(${dim}) brightness(${1 - 0.5 * dim})` }}>
              <Img src={tile(t)} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: PAD, right: PAD, bottom: 84, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <Rise from={82} size={92} text="A Claude Code skill that shows your agent what good looks like." style={{ maxWidth: 1380 }} />
        <div style={{ opacity: ramp(frame, 100, 116), textAlign: "right" }}>
          <Img src={staticFile("uitaste-logo-dark.svg")} style={{ height: 56 }} />
          <div style={{ ...label(16), color: DIM, marginTop: 16 }}>{fmt(STATS.pages)} pages in the library</div>
        </div>
      </div>
    </Scene>
  );
};

/* ---------------------------------------------------------------------------------------------
 * 2 · The problem: ask for a landing page, get the default. 2024 was a purple gradient; the 2026
 *     default is cream, a serif with an italic word, a pill, a stamp, invented numbers. The second
 *     frame is not a mock: it is what Opus built for our brief without the skill.
 * ------------------------------------------------------------------------------------------- */
const Purple: React.FC = () => (
  <div style={{ width: 1200, height: 750, background: "#fff", fontFamily: "Inter, Arial, sans-serif" }}>
    <div style={{ height: 430, background: "linear-gradient(135deg,#7c3aed,#3b82f6)", display: "grid", placeItems: "center", textAlign: "center", color: "#fff" }}>
      <div>
        <div style={{ fontSize: 64, fontWeight: 800, letterSpacing: "-0.02em" }}>Revolutionize Your Workflow</div>
        <div style={{ fontSize: 24, opacity: 0.85, marginTop: 16 }}>Unlock the power of seamless, next-generation productivity.</div>
        <div style={{ display: "inline-block", marginTop: 30, padding: "16px 34px", borderRadius: 999, background: "#fff", color: "#6d28d9", fontWeight: 700, fontSize: 20 }}>Get Started →</div>
      </div>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 28, padding: 44 }}>
      {[["🚀", "Lightning Fast"], ["🔒", "Secure by Design"], ["✨", "AI Powered"]].map(([e, t]) => (
        <div key={t} style={{ padding: 30, borderRadius: 18, boxShadow: "0 12px 40px rgba(0,0,0,.12)", textAlign: "center" }}>
          <div style={{ fontSize: 48 }}>{e}</div>
          <div style={{ fontWeight: 700, fontSize: 24, marginTop: 10, color: "#111" }}>{t}</div>
          <div style={{ color: "#6b7280", marginTop: 8, fontSize: 16 }}>Supercharge your team.</div>
        </div>
      ))}
    </div>
  </div>
);

export const Problem: React.FC<{ total: number }> = ({ total }) => {
  const frame = useCurrentFrame();
  const swap = ramp(frame, 96, 112);
  const S = 0.78; // the 1200×750 frames at 936×585
  const fx = 1920 - PAD - 1200 * S, fy = 250;
  const at = (x: number, y: number) => ({ x: fx + x * S, y: fy + y * S });
  return (
    <Scene total={total}>
      <div style={{ position: "absolute", left: PAD, top: 120, width: 760 }}>
        <div style={{ ...label(18), color: DIM }}>You ask an agent for a landing page</div>
        <Rise from={8} size={150} text="It builds the default." style={{ marginTop: 28 }} />
        <div style={{ marginTop: 56, height: 160, position: "relative" }}>
          <div style={{ position: "absolute", opacity: 1 - swap }}>
            <div style={{ ...display(120), color: DIM }}>2024</div>
            <div style={{ ...label(18), color: DIM, marginTop: 14 }}>Purple gradient, three cards, emoji</div>
          </div>
          <div style={{ position: "absolute", opacity: swap }}>
            <div style={{ ...display(120), color: RED }}>2026</div>
            <div style={{ ...label(18), color: DIM, marginTop: 14 }}>Opus, our brief, no skill. Not a mock-up.</div>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: fx, top: fy, width: 1200 * S, height: 750 * S, borderRadius: 10, overflow: "hidden", boxShadow: `0 0 0 1px ${LINE}, 0 50px 120px -40px rgba(0,0,0,.9)`, transform: `translateY(${(1 - ramp(frame, 14, 34)) * 40}px)`, opacity: ramp(frame, 14, 30) }}>
        <div style={{ position: "absolute", inset: 0, transform: `scale(${S})`, transformOrigin: "0 0", opacity: 1 - swap }}><Purple /></div>
        <Img src={staticFile("cmp-without-landing.jpg")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: swap, transform: `scale(${1.04 - 0.04 * swap})` }} />
      </div>
      <Tag {...at(40, 80)} at={124} text="Cream by default" />
      <Tag {...at(470, 300)} at={136} text="Serif, one word in italics" />
      <Tag {...at(390, 150)} at={148} text="Pill badge" />
      <Tag {...at(1010, 245)} at={160} text="Rubber stamp" />
      <Tag {...at(240, 715)} at={172} text="Invented stats" />
    </Scene>
  );
};

/* ---------------------------------------------------------------------------------------------
 * 3 · The library: columns of real pages scroll behind the count; then one page and the numbers
 *     measured on it.
 * ------------------------------------------------------------------------------------------- */
export const Library: React.FC<{ total: number }> = ({ total }) => {
  const frame = useCurrentFrame();
  const NC = 12, cw = 1920 / NC, ch = cw * 1.95;
  const count = Math.round(interpolate(frame, [10, 70], [0, STATS.pages], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 4) }));
  const focus = ramp(frame, 118, 140);
  const chips: [number, number, string, number][] = [
    [40, 70, "h1 Inter Variable 48px / 1 · w510 · ls -1.056px", 150],
    [70, 240, "body 15px / 1.6 · #8a8f98", 162],
    [500, 330, "bg #08090a · accent #5e6ad2", 174],
    [300, 460, "button 32px · radius 9999 · #e5e5e6", 186],
  ];
  return (
    <Scene total={total}>
      <AbsoluteFill style={{ opacity: 0.42 - 0.22 * focus }}>
        {Array.from({ length: NC }, (_, c) => {
          const speed = 1.4 + ((c * 7) % 5) * 0.55, dir = c % 2 ? 1 : -1;
          const off = (((frame * speed * dir) % ch) + ch) % ch;
          return (
            <div key={c} style={{ position: "absolute", left: c * cw, top: -ch + off, width: cw - 6 }}>
              {Array.from({ length: 6 }, (_, k) => {
                const t = TILES[(c * 31 + k * 7) % TILES.length];
                return <Img key={k} src={tile(t)} style={{ width: "100%", height: ch - 6, objectFit: "cover", display: "block", marginBottom: 6, borderRadius: 3 }} />;
              })}
            </div>
          );
        })}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `linear-gradient(90deg, ${INK} 0%, rgba(14,14,14,.92) 40%, rgba(14,14,14,.3) 100%)` }} />
      <div style={{ position: "absolute", left: PAD, top: 150 }}>
        <div style={{ ...display(330), fontVariantNumeric: "tabular-nums", lineHeight: 0.8 }}>{fmt(count)}</div>
        <Rise from={40} size={84} text="real pages. Measured on the live page." style={{ marginTop: 30, maxWidth: 760 }} />
        <div style={{ ...label(18), color: DIM, marginTop: 40, opacity: ramp(frame, 70, 86), lineHeight: 1.8 }}>
          Linear · Stripe · Vercel · Anthropic · Teenage Engineering<br />studios, foundries, indie software, design systems
        </div>
      </div>
      <div style={{ position: "absolute", right: PAD, top: 250, width: 900, height: 562, borderRadius: 10, overflow: "hidden", boxShadow: `0 0 0 1px ${LINE}, 0 50px 120px -40px rgba(0,0,0,.9)`, opacity: focus, transform: `translateX(${(1 - focus) * 80}px)` }}>
        <Img src={staticFile("linear-pricing.jpg")} style={{ width: "100%", display: "block" }} />
      </div>
      <div style={{ position: "absolute", right: PAD, top: 206, ...label(16), color: DIM, opacity: focus }}>linear.app/pricing</div>
      {chips.map(([x, y, t, a]) => {
        const p = ramp(frame, a, a + 10);
        return (
          <div key={t} style={{ position: "absolute", left: 1920 - PAD - 900 + x, top: 250 + y, opacity: p, transform: `translateY(${(1 - p) * 10}px)`, fontFamily: MONO, fontSize: 20, background: RED, color: WHITE, padding: "8px 12px", borderRadius: 4, whiteSpace: "nowrap", boxShadow: "0 10px 30px -10px rgba(0,0,0,.6)" }}>{t}</div>
        );
      })}
    </Scene>
  );
};

/* ---------------------------------------------------------------------------------------------
 * 4 · The loop: look at references, build, set the result beside the reference. Real frames from
 *     the Tally run with the skill.
 * ------------------------------------------------------------------------------------------- */
export const Loop: React.FC<{ total: number }> = ({ total }) => {
  const frame = useCurrentFrame();
  const beats: [string, string, string, number][] = [
    ["Look.", "refs.jpg", "start.py finds the three closest pages in the library and lays them side by side.", 0],
    ["Build.", "cmp-with-landing.jpg", "One concept and one signature move, taken from the product itself.", 90],
    ["Compare.", "review-top.jpg", "shot.py renders the page beside its reference. Would a designer pick yours? If not, fix it.", 180],
  ];
  return (
    <Scene total={total}>
      {beats.map(([word, img, line, a], i) => {
        const inP = ramp(frame, a, a + 18), outP = i < 2 ? ramp(frame, a + 84, a + 98) : 0;
        const still = img === "review-top.jpg";
        return (
          <div key={word} style={{ position: "absolute", inset: 0, opacity: inP * (1 - outP) }}>
            <div style={{ position: "absolute", left: PAD, top: 84, display: "flex", alignItems: "flex-end", gap: 36 }}>
              <div style={{ ...display(40), color: RED, paddingBottom: 14 }}>{`0${i + 1}`}</div>
              <Rise from={a + 2} size={190} text={word} />
            </div>
            <div style={{ position: "absolute", right: PAD, top: 120, width: 640, fontFamily: "inherit", fontSize: 28, lineHeight: 1.45, fontWeight: 500, color: DIM, opacity: ramp(frame, a + 10, a + 24) }}>{line}</div>
            <div style={{ position: "absolute", left: PAD, right: PAD, top: 330, height: 670, borderRadius: 10, overflow: "hidden", background: "#ececec", boxShadow: `0 0 0 1px ${LINE}`, transform: `translateY(${(1 - inP) * 60}px)` }}>
              <Img src={staticFile(img)} style={{ width: "100%", display: "block", transform: still ? "none" : `translateY(${-interpolate(frame, [a, a + 98], [0, 40], clamp)}px)` }} />
            </div>
          </div>
        );
      })}
    </Scene>
  );
};

/* ---------------------------------------------------------------------------------------------
 * 5 · The proof: same prompt, same model, three ways. The step counts are the real ones.
 * ------------------------------------------------------------------------------------------- */
export const Proof: React.FC<{ total: number }> = ({ total }) => {
  const frame = useCurrentFrame();
  const cols: ["without" | "iterate" | "with", string][] = [["without", "Without the skill"], ["iterate", "Without, told to iterate"], ["with", "With ui taste"]];
  const rows = [["landing", 30], ["pricing", 140], ["dashboard", 230]] as const;
  const cw = (1920 - PAD * 2 - 40 * 2) / 3, chh = cw * 0.625;
  const end = ramp(frame, 320, 336);
  const vis = (r: number, a: number, f = 12) => ramp(frame, a, a + f) * (r < 2 ? 1 - ramp(frame, rows[r + 1][1], rows[r + 1][1] + f) : 1);
  return (
    <Scene total={total}>
      <div style={{ position: "absolute", left: PAD, top: 76 }}>
        <Rise from={0} size={150} text="Same prompt. Same model." />
        <div style={{ ...label(17), color: DIM, marginTop: 22, opacity: ramp(frame, 14, 28) }}>Claude Opus 5.5 in Claude Code · one run each · nothing edited</div>
      </div>
      {cols.map(([k, name], i) => {
        const p = ramp(frame, 20 + i * 8, 40 + i * 8);
        const x = PAD + i * (cw + 40);
        return (
          <div key={k} style={{ position: "absolute", left: x, top: 380, width: cw, opacity: p * (1 - (k === "with" ? 0 : 0.6 * end)), transform: `translateY(${(1 - p) * 40}px)` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 18 }}>
              <span style={{ ...label(20), color: k === "with" ? RED : WHITE }}>{name}</span>
              <span style={{ position: "relative", height: 24, width: 140 }}>
                {rows.map(([n, a], r) => (
                  <span key={n} style={{ position: "absolute", right: 0, ...label(20), color: DIM, opacity: vis(r, a, 10), whiteSpace: "nowrap" }}>{PAIRS.find((x) => x.name === n)![k]!.turns} steps</span>
                ))}
              </span>
            </div>
            <div style={{ position: "relative", width: cw, height: chh, borderRadius: 8, overflow: "hidden", boxShadow: k === "with" ? `0 0 0 3px ${RED}` : `0 0 0 1px ${LINE}` }}>
              {rows.map(([n, a], r) => <Img key={n} src={staticFile(`cmp-${k}-${n}.jpg`)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: vis(r, a) }} />)}
            </div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: PAD, top: 380 + 60 + chh + 50, display: "flex", gap: 30, opacity: 1 - end }}>
        {rows.map(([n, a], r) => {
          const on = frame >= a && (r === 2 || frame < rows[r + 1][1]);
          return <span key={n} style={{ ...label(18), color: on ? WHITE : "rgba(255,255,255,.3)", borderBottom: `2px solid ${on ? RED : "transparent"}`, paddingBottom: 6 }}>{n}</span>;
        })}
      </div>
      <div style={{ position: "absolute", left: PAD, top: 380 + 60 + chh + 40, opacity: end, transform: `translateY(${(1 - end) * 20}px)` }}>
        <div style={display(78)}>Told to iterate, it took more steps and polished the same look. <span style={{ color: RED }}>References changed it.</span></div>
      </div>
    </Scene>
  );
};

/* ---------------------------------------------------------------------------------------------
 * 6 · Outro: the mark, the two commands, where to find it.
 * ------------------------------------------------------------------------------------------- */
export const Outro: React.FC<{ total: number }> = ({ total }) => {
  const frame = useCurrentFrame();
  const logo = useRise(4);
  return (
    <Scene total={total}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 56 }}>
        <Img src={staticFile("uitaste-logo-dark.svg")} style={{ height: 150, opacity: logo, transform: `scale(${0.94 + 0.06 * logo})` }} />
        <div style={{ opacity: ramp(frame, 30, 46), transform: `translateY(${(1 - ramp(frame, 30, 46)) * 16}px)`, fontFamily: MONO, fontSize: 32, lineHeight: 1.75, color: "#e8e8e3", padding: "26px 40px", borderRadius: 8, boxShadow: `inset 0 0 0 1px ${LINE}`, background: "rgba(255,255,255,.04)" }}>
          <div><span style={{ color: RED }}>/</span>plugin marketplace add rob1-alt/ui-taste</div>
          <div><span style={{ color: RED }}>/</span>plugin install ui-taste@ui-taste</div>
        </div>
        <div style={{ display: "flex", gap: 48, ...label(22), opacity: ramp(frame, 60, 76) }}>
          <span>uitaste.dev</span>
          <span style={{ color: DIM }}>github.com/rob1-alt/ui-taste</span>
          <span style={{ color: DIM }}>Open source · MIT</span>
        </div>
      </AbsoluteFill>
    </Scene>
  );
};
