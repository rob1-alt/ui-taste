import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import lib from "../public/library.json";
import { Caption, GREY, INK, MONO, MUTED, PAPER, SANS, Scene, Small, Tiles, useRise } from "./ui";

const PAD = 120;

/* 1 · Cold open: the tiles light up into a T, the word arrives. */
export const Open: React.FC<{ total: number }> = ({ total }) => {
  const frame = useCurrentFrame();
  const lit = Math.min(5, Math.floor(interpolate(frame, [10, 50], [0, 5.99], { extrapolateRight: "clamp", extrapolateLeft: "clamp" })));
  const word = useRise(55);
  const tag = useRise(80);
  return (
    <Scene total={total}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 36 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 34 }}>
          <Tiles size={150} lit={lit} />
          <div style={{ width: 560, overflow: "hidden" }}>
            <Img src={staticFile("taster-logo.svg")} style={{ height: 150, width: "auto", marginLeft: -150 - 32, clipPath: `inset(0 ${(1 - word) * 100}% 0 0)` }} />
          </div>
        </div>
        <Small from={80} style={{ fontSize: 30, opacity: tag }}>Show your coding agent what good looks like.</Small>
      </AbsoluteFill>
    </Scene>
  );
};

/* 2 · The problem: the page every agent builds, assembling itself, then labelled. */
export const Problem: React.FC<{ total: number }> = ({ total }) => {
  const frame = useCurrentFrame();
  const hero = useRise(20), cards = useRise(50), labels = useRise(110), every = useRise(170);
  const stamps = ["purple gradient", "centred everything", "three cards, emoji icons", "Inter, shadows, 'Revolutionize'"];
  return (
    <Scene total={total}>
      <div style={{ position: "absolute", left: PAD, top: 96, width: 560 }}>
        <Small>You ask an agent for a landing page.</Small>
        <Caption from={6} size={56} style={{ marginTop: 16 }}>It builds this one.</Caption>
        <div style={{ marginTop: 40, display: "grid", gap: 12 }}>
          {stamps.map((s, i) => {
            const p = interpolate(frame, [110 + i * 14, 130 + i * 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 26, opacity: p, transform: `translateX(${(1 - p) * -16}px)` }}>
                <span style={{ width: 28, height: 28, borderRadius: 14, background: "#c0321e", color: "#fff", display: "grid", placeItems: "center", fontSize: 18, fontWeight: 700 }}>×</span>
                {s}
              </div>
            );
          })}
        </div>
        <Caption from={170} size={40} style={{ marginTop: 44, opacity: every, color: MUTED }}>Every single time.</Caption>
      </div>
      {/* the slop page */}
      <div style={{ position: "absolute", right: PAD, top: 120, width: 960, height: 840, borderRadius: 14, overflow: "hidden", background: "#fff", boxShadow: "0 0 0 1px rgba(0,0,0,.08), 0 30px 80px -30px rgba(0,0,0,.35)", fontFamily: "Inter, Arial, sans-serif", opacity: labels ? 1 : 1 }}>
        <div style={{ height: 460, background: "linear-gradient(135deg,#7c3aed,#3b82f6)", display: "grid", placeItems: "center", textAlign: "center", color: "#fff", opacity: hero }}>
          <div>
            <div style={{ fontSize: 52, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.1 }}>Revolutionize Your Workflow</div>
            <div style={{ fontSize: 20, opacity: 0.85, marginTop: 14 }}>Unlock the power of seamless, next-generation productivity.</div>
            <div style={{ display: "inline-block", marginTop: 26, padding: "14px 30px", borderRadius: 999, background: "#fff", color: "#6d28d9", fontWeight: 700 }}>Get Started →</div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24, padding: 40, opacity: cards, transform: `translateY(${(1 - cards) * 30}px)` }}>
          {[["🚀", "Lightning Fast"], ["🔒", "Secure by Design"], ["✨", "AI Powered"]].map(([e, t]) => (
            <div key={t} style={{ padding: 28, borderRadius: 16, boxShadow: "0 12px 40px rgba(0,0,0,.12)", textAlign: "center" }}>
              <div style={{ fontSize: 44 }}>{e}</div>
              <div style={{ fontWeight: 700, fontSize: 22, marginTop: 10 }}>{t}</div>
              <div style={{ color: "#6b7280", marginTop: 8, fontSize: 15 }}>Supercharge your team with cutting-edge tools.</div>
            </div>
          ))}
        </div>
      </div>
    </Scene>
  );
};

/* 3 · The library: 345 pages as the colours measured on them, then the mosaic steps aside for the numbers. */
export const Library: React.FC<{ total: number }> = ({ total }) => {
  const frame = useCurrentFrame();
  const { pages, stats } = lib as { pages: { site: string; bg: string; accent: string; font: string; h1: number | null; type: string }[]; stats: { pages: number; sites: number; shots: number } };
  const COLS = 23, ROWS = 15, cellW = 1920 / COLS, cellH = 1080 / ROWS;
  const n = Math.min(pages.length, COLS * ROWS);
  const ease = (t: number) => 1 - Math.pow(1 - t, 3);
  const count = (to: number, from: number) => Math.round(interpolate(frame, [from, from + 60], [0, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease }));
  // after the fill, the whole mosaic shrinks into the right column
  const shift = interpolate(frame, [75, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
  const panel = useRise(95);
  const picks = ["Linear", "Stripe", "Vercel"].map((site) => pages.findIndex((p) => p.site === site)).filter((i) => i >= 0);
  const pickRise = [useRise(200), useRise(212), useRise(224)];
  return (
    <Scene total={total} dark>
      <AbsoluteFill style={{ transformOrigin: "100% 50%", transform: `translateX(${shift * -0}px) scale(${1 - 0.46 * shift})`, left: shift * 0 }}>
        {Array.from({ length: n }, (_, i) => {
          const order = (i * 97) % n;
          const p = interpolate(frame, [order * 0.18, order * 0.18 + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const pg = pages[i];
          return (
            <div key={i} style={{ position: "absolute", left: (i % COLS) * cellW, top: Math.floor(i / COLS) * cellH, width: cellW - 3, height: cellH - 3, background: pg.bg, opacity: p, transform: `scale(${0.6 + 0.4 * p})`, borderRadius: 3, boxShadow: "inset 0 0 0 1px rgba(255,255,255,.06)" }}>
              <div style={{ position: "absolute", left: 10, bottom: 10, width: 14, height: 14, borderRadius: 3, background: pg.accent }} />
            </div>
          );
        })}
      </AbsoluteFill>
      <div style={{ position: "absolute", left: PAD, top: 120, width: 900, opacity: panel, transform: `translateY(${(1 - panel) * 20}px)` }}>
        <Small dark>taster replaces the default with evidence.</Small>
        <div style={{ display: "grid", gap: 26, marginTop: 36 }}>
          {[[stats.pages, "real pages"], [stats.sites, "products and design systems"], [stats.shots, "screenshots, desktop and mobile"]].map(([v, l], i) => (
            <div key={l as string} style={{ display: "flex", alignItems: "baseline", gap: 22 }}>
              <div style={{ fontSize: 112, fontWeight: 650, letterSpacing: "-0.05em", lineHeight: 1, fontVariantNumeric: "tabular-nums", color: "#fff", minWidth: 250 }}>{count(v as number, 100 + i * 10)}</div>
              <div style={{ fontSize: 26, color: "rgba(255,255,255,.6)" }}>{l}</div>
            </div>
          ))}
        </div>
        <Caption from={170} dark size={34} style={{ marginTop: 40, maxWidth: 820, color: "rgba(255,255,255,.85)" }}>Each one measured on the live page: fonts, type scale, colours, radii, button sizes, content width.</Caption>
        <div style={{ display: "flex", gap: 16, marginTop: 34 }}>
          {picks.map((i, k) => {
            const pg = pages[i]; const p = pickRise[k];
            return (
              <div key={i} style={{ opacity: p, transform: `translateY(${(1 - p) * 16}px)`, width: 280, padding: "14px 18px", borderRadius: 12, background: "rgba(255,255,255,.08)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.14)", fontFamily: MONO, fontSize: 16, lineHeight: 1.6, color: "rgba(255,255,255,.85)" }}>
                <div style={{ fontFamily: SANS, fontWeight: 650, fontSize: 20, color: "#fff", marginBottom: 4 }}>{pg.site} · {pg.type}</div>
                <div><span style={{ display: "inline-block", width: 13, height: 13, borderRadius: 3, background: pg.bg, verticalAlign: -1, marginRight: 8, boxShadow: "0 0 0 1px rgba(255,255,255,.3)" }} />bg {pg.bg}</div>
                <div>font {pg.font}</div>
                <div>h1 {pg.h1 ?? "—"}px</div>
              </div>
            );
          })}
        </div>
      </div>
    </Scene>
  );
};

/* 4 · The search: a terminal types a question, the library answers with a measured reference. */
export const Search: React.FC<{ total: number }> = ({ total }) => {
  const frame = useCurrentFrame();
  const cmd = `python3 scripts/find_refs.py "pricing page with comparison table"`;
  const typed = cmd.slice(0, Math.floor(interpolate(frame, [15, 75], [0, cmd.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })));
  const out = [
    ["## 1. Ghost · pricing", 1],
    ["url: https://ghost.org/pricing/  ·  captured 2026-11-23", 0],
    ["desktop: library/screens/ghost-pricing-desktop.jpg  (1440x3600)", 0],
    ["patterns: light, pricing-4-tier, audience-slider, comparison-table", 0],
    ["why: A members slider updates the prices of four plans; a long comparison table with checkmarks follows.", 2],
    ["fonts: InterVariable", 0],
    ["type: h1 InterVariable 48px/1.15 w700 ls -1.2px · body 20px/1.5 w400", 0],
    ["colours: bg #ffffff · surfaces #15171a, #f3f4f6, #ff247d · text #4b5563, #111827", 0],
    ["button: \"Get Started — free\" bg #15171a text #ffffff radius 6px height 39px padding-x 16px", 0],
    ["content max-width: 1400px", 0],
  ] as const;
  const caption = useRise(190);
  return (
    <Scene total={total}>
      <div style={{ position: "absolute", left: PAD, top: 100, width: 1680 }}>
        <Small>Before it builds, it looks something up. Only for a concrete decision.</Small>
        <div style={{ marginTop: 28, borderRadius: 14, background: INK, color: "#e8e8e3", padding: "28px 34px", fontFamily: MONO, fontSize: 23, lineHeight: 1.62, minHeight: 560, boxShadow: "0 30px 80px -30px rgba(0,0,0,.4)" }}>
          <div><span style={{ color: "#8f8f88" }}>$ </span>{typed}<span style={{ opacity: frame % 30 < 15 && frame < 80 ? 1 : 0 }}>▍</span></div>
          {out.map(([line, kind], i) => {
            const at = 85 + i * 9;
            const p = interpolate(frame, [at, at + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
            return <div key={i} style={{ opacity: p, color: kind === 1 ? "#fff" : kind === 2 ? "#f0d36b" : "#cfcfc8", fontWeight: kind === 1 ? 700 : 400, marginTop: kind === 1 ? 14 : 0 }}>{line}</div>;
          })}
        </div>
        <Caption from={190} size={38} style={{ marginTop: 30, opacity: caption, maxWidth: 1300 }}>Up to three references, best first. The agent opens the screenshot and reads the numbers. Evidence, never a template.</Caption>
      </div>
    </Scene>
  );
};

/* 5 · The review: the anti-slop checklist run on the rendered screen. */
export const Review: React.FC<{ total: number }> = ({ total }) => {
  const frame = useCurrentFrame();
  const items: [string, boolean][] = [
    ["One accent colour, used for actions and state", true],
    ["Not everything centred", true],
    ["No row of three identical cards with emoji", true],
    ["Real content: no invented logos, numbers or quotes", true],
    ["Grey text passes 4.5:1", true],
    ["Mobile designed at 390px, not squeezed", true],
    ["The current AI look: cream, serif with an italic word, mono labels, pills", false],
    ["Swap test: with a competitor's logo, the page must stop working", false],
  ];
  const cap = useRise(10);
  return (
    <Scene total={total}>
      <div style={{ position: "absolute", left: PAD, top: 100, width: 640 }}>
        <Small>Then it renders the screen and looks at it.</Small>
        <Caption from={6} size={56} style={{ marginTop: 16, opacity: cap }}>An anti-slop review, at 1440 and 390.</Caption>
        <Small from={30} style={{ marginTop: 28, maxWidth: 520 }}>Forty checks on colour, type, layout, components, content, motion and accessibility. Two of them are new this month.</Small>
      </div>
      <div style={{ position: "absolute", right: PAD, top: 110, width: 980, display: "grid", gap: 14 }}>
        {items.map(([t, ok], i) => {
          const at = 30 + i * 16;
          const p = interpolate(frame, [at, at + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const tick = interpolate(frame, [at + 14, at + 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: 18, padding: "18px 22px", borderRadius: 12, background: ok ? "#fff" : INK, color: ok ? INK : "#fff", opacity: p, transform: `translateX(${(1 - p) * 24}px)`, fontSize: 26, fontWeight: 500, boxShadow: ok ? "inset 0 0 0 1px rgba(0,0,0,.08)" : "none" }}>
              <span style={{ width: 34, height: 34, borderRadius: 8, flex: "none", background: ok ? "#e5f3ea" : "#fff", color: ok ? "#1f7a44" : INK, display: "grid", placeItems: "center", fontWeight: 800, fontSize: 20, transform: `scale(${tick})` }}>{ok ? "✓" : "!"}</span>
              {t}
            </div>
          );
        })}
      </div>
    </Scene>
  );
};

/* 6 · A real brief, three rounds: templated → loud → real material. */
export const BeforeAfter: React.FC<{ total: number }> = ({ total }) => {
  const frame = useCurrentFrame();
  const shots = [
    ["before.jpg", "v1", "The template. Fine. Forgettable."],
    ["loud.jpg", "v2", "Bold. Ugly. Still generated."],
    ["after.jpg", "v3", "Real product screen, real logos, real art. One typeface."],
  ] as const;
  const step = 80;
  return (
    <Scene total={total}>
      <div style={{ position: "absolute", left: PAD, top: 90 }}>
        <Small>A real brief, three rounds. What the skill learned.</Small>
      </div>
      {shots.map(([src, v, label], i) => {
        const at = 20 + i * step;
        const p = interpolate(frame, [at, at + 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 3) });
        const x = PAD + i * 70, y = 190 + i * 56;
        return (
          <div key={src} style={{ position: "absolute", left: x, top: y, width: 1420, opacity: p, transform: `translateY(${(1 - p) * 60}px)` }}>
            <div style={{ borderRadius: 14, overflow: "hidden", height: 700, boxShadow: "0 0 0 1px rgba(0,0,0,.1), 0 40px 100px -30px rgba(0,0,0,.45)", background: "#fff" }}>
              <Img src={staticFile(src)} style={{ width: "100%", display: "block" }} />
            </div>
            <div style={{ position: "absolute", left: 0, top: -58, display: "flex", gap: 14, alignItems: "center" }}>
              <span style={{ fontFamily: MONO, fontSize: 18, padding: "6px 10px", borderRadius: 6, background: INK, color: "#fff" }}>{v}</span>
              <span style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em" }}>{label}</span>
            </div>
          </div>
        );
      })}
    </Scene>
  );
};

/* 7 · Outro: the mark, the two commands, the repo. */
export const Outro: React.FC<{ total: number }> = ({ total }) => {
  const logo = useRise(5), cmds = useRise(40), url = useRise(80);
  return (
    <Scene total={total} dark>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 44 }}>
        <Img src={staticFile("taster-logo-dark.svg")} style={{ height: 140, opacity: logo, transform: `scale(${0.96 + 0.04 * logo})` }} />
        <div style={{ opacity: cmds, transform: `translateY(${(1 - cmds) * 14}px)`, fontFamily: MONO, fontSize: 30, lineHeight: 1.7, color: "#e8e8e3", padding: "22px 36px", borderRadius: 14, background: "rgba(255,255,255,.07)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.14)" }}>
          <div><span style={{ color: "#8f8f88" }}>/</span>plugin marketplace add rob1-alt/ui-taste</div>
          <div><span style={{ color: "#8f8f88" }}>/</span>plugin install ui-taste@ui-taste</div>
        </div>
        <Small dark from={80} style={{ fontSize: 28, opacity: url }}>Open source · github.com/rob1-alt/ui-taste · bring your own screens</Small>
      </AbsoluteFill>
    </Scene>
  );
};
