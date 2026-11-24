// A page of examples (one page type, or one pattern): a real h1, the figures computed for these pages,
// every page with its note, and links onward. Server-rendered so search engines and answer engines read it all.
import Link from "next/link";
import { libTypeLabel, libraryHref, opt, palette } from "@/lib/format";
import { figures, patternMetas, typeHref } from "@/lib/seo";
import type { Item } from "@/lib/types";
import { LibraryBar } from "./LibraryBar";

export function ExampleList({ h1, lede, items, crumbs, jsonLd, related }: {
  h1: string; lede: string; items: Item[]; crumbs: [string, string][]; jsonLd: object[];
  related?: { title: string; links: [string, string, number?][] }[];
}) {
  const f = figures(items);
  return (
    <>
      <LibraryBar />
      <main className="ex">
        {jsonLd.map((j, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(j) }} />)}
        <nav className="ex-crumbs" aria-label="Breadcrumb">
          {crumbs.map(([name, href], i) => <span key={href}>{i < crumbs.length - 1 ? <Link href={href}>{name}</Link> : <span aria-current="page">{name}</span>}</span>)}
        </nav>
        <section className="intro">
          <h1>{h1}</h1>
          <p className="lede">{lede}</p>
        </section>
        <p className="ex-figures">
          Across these {f.n} pages, the median headline is <b>{f.h1}px</b>, body text is <b>{f.body}px</b> and the main button is <b>{f.btn}px</b> tall
          {f.pillPct ? <>; <b>{f.pillPct}%</b> of buttons are pills</> : null}. <b>{f.darkPct}%</b> are dark.
          {f.topFonts.length ? <> Most set in {f.topFonts.map(([name, n], i) => <span key={name}>{i ? (i === f.topFonts.length - 1 ? " and " : ", ") : " "}<b>{name}</b> ({n})</span>)}.</> : null}
        </p>
        <ol className="grid ex-grid">
          {items.map((it, i) => (
            <li key={it.id}>
              <Link className="card" href={libraryHref(it.id)}>
                <div className="frame">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={opt(it.screens.desktop?.thumb || it.screens.mobile!.thumb, 720)} alt={`${it.site} ${libTypeLabel(it.type).toLowerCase()}, first screen`} loading={i < 6 ? "eager" : "lazy"} decoding="async" />
                </div>
                <div className="meta"><span className="name">{it.site}</span><span className="kind">{libTypeLabel(it.type)}</span><span className="dots" aria-hidden="true">{palette(it, 4).map((c) => <i key={c} style={{ background: c }} />)}</span></div>
                <p className="ex-note">{it.note}</p>
              </Link>
            </li>
          ))}
        </ol>
        {related?.map((r) => (
          <section className="ex-related" key={r.title}>
            <h2>{r.title}</h2>
            <ul>{r.links.map(([name, href, n]) => <li key={href}><Link href={href}>{name}</Link>{n ? <span>{n}</span> : null}</li>)}</ul>
          </section>
        ))}
        <section className="ex-cta">
          <h2>Let your coding agent use these</h2>
          <p>ui taste is a skill for Claude Code, Codex, Cursor and any agent that reads SKILL.md: it searches these pages, opens the screenshot and the measured values before it builds, then reviews what it rendered.</p>
          <Link className="visit" href="/#install">Install it →</Link>
        </section>
      </main>
    </>
  );
}

export function relatedFor(items: Item[], exceptTag?: string) {
  const tags = new Map<string, number>();
  items.forEach((it) => it.tags.forEach((t) => tags.set(t, (tags.get(t) || 0) + 1)));
  const pm = new Map(patternMetas().map((p) => [p.tag, p]));
  const links = [...tags.entries()].filter(([t]) => pm.has(t) && t !== exceptTag).sort((a, b) => b[1] - a[1]).slice(0, 18)
    .map(([t]) => [pm.get(t)!.name, `/patterns/${t}`, pm.get(t)!.count] as [string, string, number]);
  return links;
}
export { typeHref };
