import React, { useEffect, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

// The site's identity: near-black, white, one vermilion. Archivo across its width axis.
export const INK = "#0e0e0e";
export const WHITE = "#ffffff";
export const RED = "#ff3d1f";
export const DIM = "rgba(255,255,255,.58)";
export const LINE = "rgba(255,255,255,.14)";
export const SANS = "Archivo, 'Helvetica Neue', Arial, sans-serif";
export const MONO = "'Liberation Mono', 'DejaVu Sans Mono', Menlo, monospace";
export const PAD = 96;

/** The display voice of the site: condensed, black, uppercase. */
export const display = (size: number, extra: React.CSSProperties = {}): React.CSSProperties => ({
  fontFamily: SANS, fontStretch: "62%", fontWeight: 800, textTransform: "uppercase", fontSize: size, lineHeight: 0.86, letterSpacing: "-0.01em", ...extra,
});
/** Small expanded labels, as in the site's nav. */
export const label = (size = 18, extra: React.CSSProperties = {}): React.CSSProperties => ({
  fontFamily: SANS, fontStretch: "125%", fontWeight: 600, textTransform: "uppercase", fontSize: size, letterSpacing: "0.04em", ...extra,
});

export const useArchivo = () => {
  const [handle] = useState(() => delayRender("Archivo"));
  useEffect(() => {
    const face = new FontFace("Archivo", `url(${staticFile("Archivo.ttf")})`, { weight: "100 900", stretch: "62% 125%" });
    face.load().then((f) => { document.fonts.add(f); continueRender(handle); }).catch(() => continueRender(handle));
  }, [handle]);
};

export const ease = (t: number) => 1 - Math.pow(1 - t, 3);
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
/** 0→1 between two frames, eased. */
export const ramp = (frame: number, a: number, b: number) => interpolate(frame, [a, b], [0, 1], { ...clamp, easing: ease });

export const useRise = (from: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - from, fps, config: { damping: 200, stiffness: 140, mass: 0.8 }, durationInFrames: 30 });
};

/** Full-frame scene on ink, fading at both ends. */
export const Scene: React.FC<{ total: number; children: React.ReactNode; bg?: string }> = ({ total, children, bg = INK }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 10, total - 10, total], [0, 1, 1, 0], clamp);
  return <AbsoluteFill style={{ background: bg, color: WHITE, fontFamily: SANS, opacity: o, overflow: "hidden" }}>{children}</AbsoluteFill>;
};

/** A line of display type that rises out of a mask, word by word. */
export const Rise: React.FC<{ text: string; from: number; size: number; color?: string; stagger?: number; style?: React.CSSProperties }> = ({ text, from, size, color = WHITE, stagger = 3, style }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ ...display(size), color, display: "flex", flexWrap: "wrap", columnGap: size * 0.22, ...style }}>
      {text.split(" ").map((w, i) => {
        const p = ramp(frame, from + i * stagger, from + i * stagger + 14);
        return (
          <span key={i} style={{ display: "inline-block", overflow: "hidden", paddingBottom: size * 0.06 }}>
            <span style={{ display: "inline-block", transform: `translateY(${(1 - p) * 105}%)` }}>{w}</span>
          </span>
        );
      })}
    </div>
  );
};

/** A small red tag with a leader dot, for calling things out on a screenshot. */
export const Tag: React.FC<{ x: number; y: number; text: string; at: number; left?: boolean }> = ({ x, y, text, at, left }) => {
  const frame = useCurrentFrame();
  const p = ramp(frame, at, at + 10);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: p, transform: `scale(${0.9 + 0.1 * p})`, transformOrigin: left ? "100% 50%" : "0 50%", display: "flex", alignItems: "center", gap: 10, flexDirection: left ? "row-reverse" : "row", translate: left ? "-100% -50%" : "0 -50%" }}>
      <span style={{ width: 16, height: 16, borderRadius: 8, background: RED, boxShadow: `0 0 0 5px rgba(255,61,31,.28)` }} />
      <span style={{ ...label(17), background: RED, color: WHITE, padding: "8px 12px", borderRadius: 4, whiteSpace: "nowrap" }}>{text}</span>
    </div>
  );
};
