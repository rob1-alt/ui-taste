"use client";
// One screen with everything measured on it. Used inside the library's dialog and as the page at /library/<id>.
import Link from "next/link";
import { libTypeLabel, prettyTag } from "@/lib/format";
import type { Item } from "@/lib/types";
import { CopyButton } from "./CopyButton";

export type Shot = "desktop" | "mobile";
type Props = {
  item: Item;
  shot: Shot;
  onShot: (s: Shot) => void;
  // where a pattern tag leads: a filter in the dialog, a link on the standalone page
  onTag?: (t: string) => void;
  tagHref?: (t: string) => string;
  nav: React.ReactNode; // prev / next / close controls, supplied by the host
};

function Scale({ it }: { it: Item }) {
  const roles = (["h1", "h2", "h3", "body"] as const).filter((r) => it.typeScale[r]);
  if (!roles.length) return null;
  return (
    <section><h3>Type</h3><div className="scale">
      {roles.map((r) => {
        const t = it.typeScale[r]!;
        const size = Math.min(t.size, r === "body" ? 18 : 44);
        const ls = t.letterSpacing && t.letterSpacing !== "normal" ? ` · ls ${t.letterSpacing}` : "";
        return (
          <div className="scale-row" key={r}><span className="role">{r}</span><div>
            <span className="sample" style={{ fontFamily: `'${t.font}', var(--font)`, fontSize: size, fontWeight: t.weight as React.CSSProperties["fontWeight"], letterSpacing: t.letterSpacing === "normal" ? "normal" : t.letterSpacing }}>{r === "body" ? "The quick brown fox jumps" : "Aa Bb Cc"}</span>
            <span className="spec">{t.font} {t.size}px/{t.lineHeight} w{t.weight}{ls}</span></div></div>
        );
      })}
    </div></section>
  );
}

function Swatches({ label, list }: { label: string; list: (string | undefined)[] | undefined }) {
  const uniq = [...new Set((list || []).filter(Boolean))] as string[];
  if (!uniq.length) return null;
  return (
    <div className="swatch-group"><div className="swatch-label">{label}</div><div className="swatches">
      {uniq.map((c) => <CopyButton key={c} text={c} className="swatch" label={`Copy ${c}`}><i style={{ background: c }} /><span>{c}</span></CopyButton>)}
    </div></div>
  );
}

export function DetailView({ item: it, shot, onShot, onTag, tagHref, nav }: Props) {
  const s = it.screens[shot] || it.screens.desktop || it.screens.mobile!;
  const c = it.colors || {};
  const cmd = `python3 scripts/find_refs.py "${it.site.toLowerCase()} ${it.type}"`;
  return (
    <>
      <div className="d-top">
        <div className="d-heading">
          <h2 id="d-title">{it.site}</h2>
          <span className="d-type" id="d-type">{libTypeLabel(it.type)}</span>
        </div>
        <div className="segmented" role="group" aria-label="Screen">
          {(["desktop", "mobile"] as const).map((k) => (
            <button key={k} type="button" data-shot={k} aria-pressed={shot === k} disabled={!it.screens[k]} onClick={() => onShot(k)}>{k === "desktop" ? "Desktop" : "Mobile"}</button>
          ))}
        </div>
        <div className="d-nav">{nav}</div>
      </div>
      <div className="d-body">
        <div className={`d-shot ${shot}`} id="d-shot" tabIndex={-1}>
          {/* the full capture, as stored: no resizing, it is what the skill reads */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img key={s.full} src={s.full} alt={`${it.site} ${libTypeLabel(it.type)} page, ${shot}`} width={s.w} height={s.h} />
        </div>
        <aside className="d-info" id="d-info">
          <section>
            <h3>Why it is here</h3>
            <p className="note">{it.note}</p>
            <a className="visit" href={it.url} target="_blank" rel="noopener noreferrer">{it.url.replace(/^https?:\/\//, "").replace(/\/$/, "")} ↗</a>
          </section>
          {it.tags.length > 0 && (
            <section><h3>Patterns</h3><div className="d-tags">
              {it.tags.map((t) => onTag
                ? <button key={t} type="button" className="tag" onClick={() => onTag(t)}>{prettyTag(t)}</button>
                : <Link key={t} className="tag" href={tagHref ? tagHref(t) : `/library?tags=${encodeURIComponent(t)}`}>{prettyTag(t)}</Link>)}
            </div></section>
          )}
          {it.fonts.length > 0 && <section><h3>Fonts</h3><ul className="fonts">{it.fonts.map((f) => <li key={f}>{f}</li>)}</ul></section>}
          <Scale it={it} />
          {(c.background || (c.surfaces || []).length > 0) && (
            <section><h3>Colours</h3><Swatches label="Background and surfaces" list={[c.background, ...(c.surfaces || [])]} /><Swatches label="Text" list={c.text} /></section>
          )}
          {it.buttons.length > 0 && (
            <section><h3>Buttons</h3><div className="buttons">
              {it.buttons.map((b, i) => (
                <div className="btn-sample" key={i}>
                  <span className="b" style={{ background: b.bg, color: b.color, borderRadius: b.radius, height: Math.min(b.height || 36, 56), padding: `0 ${b.paddingX ?? 14}px`, fontFamily: `'${b.font}', var(--font)`, fontSize: b.size, fontWeight: b.weight as React.CSSProperties["fontWeight"] }}>{b.label || "Button"}</span>
                  <span className="spec">{b.bg} · radius {b.radius} · {b.height}px high · {b.paddingX}px sides</span>
                </div>
              ))}
            </div></section>
          )}
          {it.contentWidth ? <section><h3>Content width</h3><p className="note" style={{ fontFamily: "var(--mono)", fontSize: 14 }}>{it.contentWidth}px</p></section> : null}
          <section><h3>Use it in Claude</h3><div className="cmd"><code>find_refs.py &quot;{it.site.toLowerCase()} {it.type}&quot;</code><CopyButton text={cmd} /></div></section>
        </aside>
      </div>
    </>
  );
}

export const Icon = {
  prev: <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3 5 8l5 5" /></svg>,
  next: <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m6 3 5 5-5 5" /></svg>,
  close: <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" /></svg>,
};
