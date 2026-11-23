"use client";
// The library index: filters by page type and pattern, search, desktop or mobile captures, and a dialog for one
// screen. Filters live in the query string; an open screen puts its own URL (/library/<id>) in the address bar so
// it can be shared, and that URL renders as a page of its own on a fresh load.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { libTypeLabel, opt, prettyTag } from "@/lib/format";
import type { Item } from "@/lib/types";
import { DetailView, Icon, type Shot } from "./DetailView";
import { LibraryBar } from "./LibraryBar";

// A first row of strong, varied pages; the rest follows alphabetically.
const FEATURED = ["linear-pricing", "stripe-press-landing", "playdate-landing", "teenage-engineering-landing", "anthropic-landing", "obsidian-landing", "vercel-geist-overview", "pentagram-landing"];
// Tags that only repeat the page type are noise in the pattern list.
const HIDDEN_TAGS = new Set(["design-system", "404", "pricing", "changelog", "docs", "blog", "careers", "about", "contact", "integrations", "brand", "auth", "product", "landing", "app"]);
const COLLECTIONS: { name: string; type?: string; tags: string[]; pick: string[] }[] = [
  { name: "Dark heroes", type: "landing", tags: ["dark"], pick: ["obsidian-landing", "linear-landing", "sentry-landing"] },
  { name: "Serif and editorial", tags: ["serif-display"], pick: [] },
  { name: "Illustrated worlds", tags: ["illustration-brand"], pick: [] },
  { name: "Photo-led", tags: ["photo-hero"], pick: [] },
  { name: "Prompt box as the hero", tags: ["prompt-box-hero"], pick: [] },
  { name: "Bold typography", tags: ["bold-typography"], pick: [] },
  { name: "Pricing pages", type: "pricing", tags: [], pick: ["linear-pricing", "kagi-pricing", "ghost-pricing"] },
  { name: "Design systems", type: "design-system", tags: [], pick: ["vercel-geist-overview", "radix-colors", "material-3-overview"] },
];
type Platform = "desktop" | "mobile";
type Filters = { type: string; tags: string[]; q: string; platform: Platform };
const DEFAULT: Filters = { type: "all", tags: [], q: "", platform: "desktop" };

function parseParams(p: URLSearchParams): Filters {
  return { type: p.get("type") || "all", tags: (p.get("tags") || "").split(",").filter(Boolean), q: p.get("q") || "", platform: p.get("p") === "mobile" ? "mobile" : "desktop" };
}
function searchOf(f: Filters) {
  const p = new URLSearchParams();
  if (f.type !== "all") p.set("type", f.type);
  if (f.tags.length) p.set("tags", f.tags.join(","));
  if (f.q) p.set("q", f.q);
  if (f.platform === "mobile") p.set("p", "mobile");
  const s = p.toString();
  return s ? "?" + s : "";
}
const idFromPath = (path: string) => { const m = /^\/library\/([^/?#]+)/.exec(path); return m ? decodeURIComponent(m[1]) : null; };

export function LibraryApp({ items }: { items: Item[] }) {
  const ALL = useMemo(() => { const rank = (it: Item) => { const i = FEATURED.indexOf(it.id); return i < 0 ? 99 : i; }; return items.slice().sort((a, b) => rank(a) - rank(b)); }, [items]);
  const hay = useMemo(() => new Map(ALL.map((it) => [it.id, [it.site, it.type, libTypeLabel(it.type), it.note, ...it.tags.map(prettyTag), ...it.fonts].join(" ").toLowerCase()])), [ALL]);

  const [f, setF] = useState<Filters>(DEFAULT);
  const [qInput, setQInput] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [shot, setShot] = useState<Shot>("desktop");
  const pushed = useRef(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const qTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // state from the address bar on load, then on back and forward
  useEffect(() => {
    const read = (first: boolean) => {
      const p = new URLSearchParams(location.search);
      // the old site kept everything in the hash (#id=…&type=…): still honoured
      const h = new URLSearchParams(location.hash.slice(1));
      h.forEach((v, k) => { if (!p.has(k)) p.set(k, v); });
      const nf = parseParams(p);
      setF(nf); setQInput(nf.q);
      const id = idFromPath(location.pathname) || p.get("id");
      if (first && id) { pushed.current = false; }
      setOpenId(id && items.some((x) => x.id === id) ? id : null);
      if (id) setShot(matchMedia("(max-width: 720px)").matches ? "mobile" : nf.platform);
    };
    read(true);
    const onPop = () => { pushed.current = false; read(false); };
    addEventListener("popstate", onPop);
    return () => removeEventListener("popstate", onPop);
  }, [items]);

  const writeUrl = useCallback((nf: Filters, id: string | null, mode: "replace" | "push") => {
    const url = (id ? `/library/${encodeURIComponent(id)}` : "/library") + searchOf(nf);
    if (mode === "push") history.pushState(null, "", url); else history.replaceState(null, "", url);
  }, []);
  const update = (patch: Partial<Filters>) => { const nf = { ...f, ...patch }; setF(nf); writeUrl(nf, openId, "replace"); };

  // ---------- filtering ----------
  const matches = useCallback((it: Item, opts: { ignoreTags?: boolean; ignoreType?: boolean } = {}) => {
    if (!opts.ignoreType && f.type !== "all" && it.type !== f.type) return false;
    if (!opts.ignoreTags && f.tags.some((t) => !it.tags.includes(t))) return false;
    if (f.q) { const h = hay.get(it.id)!; if (!f.q.toLowerCase().split(/\s+/).filter(Boolean).every((w) => h.includes(w))) return false; }
    return !!it.screens[f.platform];
  }, [f, hay]);
  const visible = useMemo(() => ALL.filter((it) => matches(it)), [ALL, matches]);
  const typeCounts = useMemo(() => { const c: Record<string, number> = {}; ALL.forEach((it) => { if (matches(it, { ignoreType: true })) c[it.type] = (c[it.type] || 0) + 1; }); return c; }, [ALL, matches]);
  const tagList = useMemo(() => {
    const freq: Record<string, number> = {};
    ALL.forEach((it) => { if (!matches(it, { ignoreTags: true })) return; it.tags.forEach((t) => { if (!HIDDEN_TAGS.has(t)) freq[t] = (freq[t] || 0) + 1; }); });
    const tags = Object.keys(freq).filter((t) => freq[t] > 1).sort((a, b) => freq[b] - freq[a] || a.localeCompare(b)).slice(0, 28);
    f.tags.forEach((t) => { if (!tags.includes(t)) tags.unshift(t); });
    return tags;
  }, [ALL, matches, f.tags]);
  const typeOrder = useMemo(() => { const o = Object.keys(typeCounts).sort((a, b) => typeCounts[b] - typeCounts[a] || a.localeCompare(b)); if (f.type !== "all" && !o.includes(f.type)) o.push(f.type); return o; }, [typeCounts, f.type]);
  const total = Object.values(typeCounts).reduce((a, b) => a + b, 0);
  const filtered = f.type !== "all" || f.tags.length > 0 || !!f.q;
  const sites = new Set(visible.map((v) => v.site)).size;
  const allSites = useMemo(() => new Set(ALL.map((x) => x.site)).size, [ALL]);

  // ---------- detail ----------
  const open = useCallback((id: string) => {
    setShot(matchMedia("(max-width: 720px)").matches ? "mobile" : f.platform);
    setOpenId(id);
    writeUrl(f, id, "push"); pushed.current = true;
  }, [f, writeUrl]);
  const close = useCallback(() => {
    if (pushed.current) { pushed.current = false; history.back(); }
    else { setOpenId(null); writeUrl(f, null, "replace"); }
  }, [f, writeUrl]);
  const step = useCallback((d: number) => {
    const list = visible.length ? visible : ALL;
    const i = list.findIndex((x) => x.id === openId); if (i < 0) return;
    const id = list[(i + d + list.length) % list.length].id;
    setOpenId(id); writeUrl(f, id, "replace");
  }, [visible, ALL, openId, f, writeUrl]);
  const item = openId ? ALL.find((x) => x.id === openId) : undefined;

  useEffect(() => {
    const d = dialog.current; if (!d) return;
    if (item && !d.open) { d.showModal(); d.querySelector<HTMLElement>("#d-shot")?.focus({ preventScroll: true }); }
    if (!item && d.open) d.close();
  }, [item]);
  useEffect(() => {
    const d = dialog.current; if (!d) return;
    d.querySelector("#d-shot")?.scrollTo(0, 0); d.querySelector("#d-info")?.scrollTo(0, 0);
  }, [openId, shot]);
  const onDialogClose = () => { if (openId) close(); };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (dialog.current?.open) {
        if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
        if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
        return;
      }
      const q = document.getElementById("q") as HTMLInputElement | null;
      if (e.key === "/" && document.activeElement !== q) { e.preventDefault(); q?.focus(); }
      if (e.key === "Escape" && document.activeElement === q) q?.blur();
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [step]);

  const clear = () => { setQInput(""); update({ type: "all", tags: [], q: "" }); };
  const scrollToFilters = () => document.querySelector(".filters")?.scrollIntoView({ behavior: "smooth" });
  const collItems = (c: typeof COLLECTIONS[number]) => ALL.filter((it) => (!c.type || it.type === c.type) && c.tags.every((t) => it.tags.includes(t)) && it.screens.desktop);

  return (
    <>
      <LibraryBar
        onHome={(e) => { e.preventDefault(); clear(); window.scrollTo({ top: 0 }); }}
        search={
          <label className="search">
            <span className="visually-hidden">Search</span>
            <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="4.5" /><path d="M10.5 10.5 14 14" /></svg>
            <input id="q" type="search" placeholder="Search sites, patterns, notes" autoComplete="off" spellCheck={false} value={qInput}
              onChange={(e) => { const v = e.target.value; setQInput(v); if (qTimer.current) clearTimeout(qTimer.current); qTimer.current = setTimeout(() => update({ q: v.trim() }), 120); }} />
            <kbd>/</kbd>
          </label>
        }
        actions={
          <div className="segmented" role="group" aria-label="Platform">
            {(["desktop", "mobile"] as const).map((p) => <button key={p} type="button" data-platform={p} aria-pressed={f.platform === p} onClick={() => update({ platform: p })}>{p === "desktop" ? "Desktop" : "Mobile"}</button>)}
          </div>
        }
      />

      <main>
        <section className="intro">
          <h1>Index of <span id="h1-n">{ALL.length}</span> pages.</h1>
          <p className="lede" id="lede">{ALL.length} real pages from {allSites} products known for their design, with the fonts, sizes, colours and buttons measured on the live page.</p>
        </section>

        <section className="collections" id="collections" aria-label="Collections" hidden={filtered}>
          {COLLECTIONS.map((c, i) => {
            const its = collItems(c);
            const picked = [...c.pick.map((id) => its.find((x) => x.id === id)).filter(Boolean), ...its].filter((x, j, arr) => arr.indexOf(x) === j).slice(0, 3) as Item[];
            return (
              <button type="button" className="coll" key={i} onClick={() => { update({ type: c.type || "all", tags: c.tags.slice() }); scrollToFilters(); }}>
                <div className="fan" aria-hidden="true">{picked.map((x) => <img key={x.id} src={opt(x.screens.desktop!.thumb, 360)} alt="" loading="lazy" decoding="async" />)}</div>
                <div className="coll-name"><b>{c.name}</b><span>{its.length}</span></div>
              </button>
            );
          })}
        </section>

        <nav className="filters" aria-label="Filters">
          <div className="types" id="types" role="tablist" aria-label="Page type">
            {[["all", total] as const, ...typeOrder.map((t) => [t, typeCounts[t] || 0] as const)].map(([t, n]) => (
              <button key={t} type="button" role="tab" className="type-btn" data-type={t} aria-selected={f.type === t} onClick={() => update({ type: t })}>{libTypeLabel(t)}<span className="n">{n}</span></button>
            ))}
          </div>
          <div className="tags-row">
            <span className="tags-label">Patterns</span>
            <div className="tags" id="tags">
              {tagList.map((t) => <button key={t} type="button" className="tag" data-tag={t} aria-pressed={f.tags.includes(t)} onClick={() => update({ tags: f.tags.includes(t) ? f.tags.filter((x) => x !== t) : [...f.tags, t] })}>{prettyTag(t)}</button>)}
            </div>
          </div>
        </nav>

        <div className="results-head">
          <p id="count" aria-live="polite"><strong>{visible.length}</strong> {visible.length === 1 ? "screen" : "screens"} from {sites} {sites === 1 ? "product" : "products"}</p>
          <button type="button" className="link-btn" id="clear" hidden={!filtered} onClick={clear}>Clear filters</button>
        </div>

        <section id="grid" className={`grid${f.platform === "mobile" ? " mobile" : ""}`} aria-label="Screens">
          {visible.map((it, i) => {
            const s = it.screens[f.platform]!;
            const c = it.colors || {};
            const dots = [...new Set([c.background, ...(c.surfaces || [])].filter(Boolean))].slice(0, 4) as string[];
            return (
              <button type="button" className="card" key={it.id} data-id={it.id} aria-label={`${it.site}, ${libTypeLabel(it.type)}`} onClick={() => open(it.id)}>
                <div className="frame">
                  <img src={opt(s.thumb, f.platform === "mobile" ? 260 : 720)} alt="" loading={i < 8 ? "eager" : "lazy"} decoding="async" />
                  <span className="hover-note">{it.note}</span>
                </div>
                <div className="meta"><span className="name">{it.site}</span><span className="kind">{libTypeLabel(it.type)}</span><span className="dots" aria-hidden="true">{dots.map((x) => <i key={x} style={{ background: x }} />)}</span></div>
              </button>
            );
          })}
        </section>
        <p id="empty" className="empty" hidden={visible.length > 0}>Nothing matches. Try fewer patterns or another word.</p>
      </main>

      <footer className="foot">
        <p>Screenshots belong to the companies that made them. Kept as private design references; do not republish.</p>
        <p>Rebuild after adding screens: <code>python3 site/build.py</code></p>
      </footer>

      <dialog id="detail" aria-labelledby="d-title" ref={dialog} onClose={onDialogClose}>
        {item && (
          <DetailView item={item} shot={shot} onShot={setShot}
            onTag={(t) => { update({ tags: [t], type: "all" }); close(); scrollToFilters(); }}
            nav={<>
              <button type="button" className="icon-btn" id="prev" aria-label="Previous screen (←)" onClick={() => step(-1)}>{Icon.prev}</button>
              <button type="button" className="icon-btn" id="next" aria-label="Next screen (→)" onClick={() => step(1)}>{Icon.next}</button>
              <button type="button" className="icon-btn" id="close" aria-label="Close (Esc)" onClick={close}>{Icon.close}</button>
            </>} />
        )}
      </dialog>
      <div className="toast" id="toast" role="status" aria-live="polite" />
    </>
  );
}
