import React, { useEffect, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

export const INK = "#0e0e0e";
export const PAPER = "#f3f3f0";
export const GREY = "#e4e4df";
export const MUTED = "#6b6b66";
export const SANS = "Archivo, 'Helvetica Neue', Arial, sans-serif";
export const MONO = "'Liberation Mono', 'DejaVu Sans Mono', Menlo, monospace";

/** Loads the variable Archivo once; the render waits for it. */
export const useArchivo = () => {
  const [handle] = useState(() => delayRender("Archivo"));
  useEffect(() => {
    const face = new FontFace("Archivo", `url(${staticFile("Archivo.ttf")})`, { weight: "100 900", stretch: "62% 125%" });
    face.load().then((f) => { document.fonts.add(f); continueRender(handle); }).catch(() => continueRender(handle));
  }, [handle]);
};

/** 0→1 with a spring, starting at `from` frames into the scene. */
export const useRise = (from: number, config = { damping: 200, stiffness: 120, mass: 0.9 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - from, fps, config, durationInFrames: 40 });
};

export const fadeInOut = (frame: number, total: number, edge = 12) =>
  interpolate(frame, [0, edge, total - edge, total], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

/** A scene wrapper: full frame, paper or ink background, fades at both ends. */
export const Scene: React.FC<{ total: number; dark?: boolean; children: React.ReactNode }> = ({ total, dark, children }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: dark ? INK : PAPER, color: dark ? "#fff" : INK, fontFamily: SANS, opacity: fadeInOut(frame, total) }}>
      {children}
    </AbsoluteFill>
  );
};

/** The mark: 3×3 tiles, five lit as a T. `lit` = how many of the five are on (0..5). */
export const Tiles: React.FC<{ size?: number; lit?: number; ink?: string; off?: string; showOff?: boolean }> = ({ size = 104, lit = 5, ink = INK, off = GREY, showOff = true }) => {
  const order: [number, number][] = [[0, 0], [1, 0], [2, 0], [1, 1], [1, 2]];
  const s = size / 104;
  const cells: React.ReactNode[] = [];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
    const i = order.findIndex(([oc, orr]) => oc === c && orr === r);
    const on = i >= 0 && i < lit;
    if (i < 0 && !showOff) continue;
    cells.push(<rect key={`${c}${r}`} x={c * 37 * s} y={r * 37 * s} width={30 * s} height={30 * s} rx={6 * s} fill={on ? ink : i >= 0 ? "transparent" : off} />);
  }
  return <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>{cells}</svg>;
};

export const Caption: React.FC<{ children: React.ReactNode; from?: number; dark?: boolean; size?: number; style?: React.CSSProperties }> = ({ children, from = 0, dark, size = 44, style }) => {
  const p = useRise(from);
  return (
    <div style={{ fontSize: size, fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1.08, color: dark ? "#fff" : INK, opacity: p, transform: `translateY(${(1 - p) * 18}px)`, textWrap: "balance" as never, ...style }}>
      {children}
    </div>
  );
};

export const Small: React.FC<{ children: React.ReactNode; from?: number; dark?: boolean; style?: React.CSSProperties }> = ({ children, from = 0, dark, style }) => {
  const p = useRise(from);
  return <div style={{ fontSize: 24, color: dark ? "rgba(255,255,255,.6)" : MUTED, opacity: p, transform: `translateY(${(1 - p) * 10}px)`, ...style }}>{children}</div>;
};
