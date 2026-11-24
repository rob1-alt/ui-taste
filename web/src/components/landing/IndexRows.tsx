"use client";
// The index: a first row of strong pages, then alphabetical, filtered by page type.
import Link from "next/link";
import { useState } from "react";
import { libraryHref, opt, TYPE, typeLabel } from "@/lib/format";
import { Head } from "./Head";

export type Row = { id: string; site: string; type: string; note: string; thumb: string; font: string; pal: string[]; h1: number | null };
const SHORT: Record<string, string> = { ...TYPE, landing: "Landing", product: "Product", "404": "404" };
const PAGE = 12;

export function IndexRows({ rows, sites }: { rows: Row[]; sites: number }) {
  const [type, setType] = useState("all");
  const [expanded, setExpanded] = useState(false);
  const counts: Record<string, number> = {};
  rows.forEach((x) => { counts[x.type] = (counts[x.type] || 0) + 1; });
  const types = Object.keys(counts).sort((a, b) => counts[b] - counts[a] || a.localeCompare(b));
  const list = rows.filter((x) => type === "all" || x.type === type);
  const shown = expanded ? list : list.slice(0, PAGE);
  return (
    <section className="index" id="index">
      <Head className="ph-small" title="Every page, measured."><span id="n-rows">{list.length}</span> pages from <span id="n-sites">{sites}</span> products, each on desktop and mobile, each with the values read from the live page.</Head>
      <div className="filters" id="filters" role="tablist" aria-label="Page type">
        {[["all", rows.length] as const, ...types.map((t) => [t, counts[t]] as const)].map(([t, n]) => (
          <button key={t} type="button" role="tab" data-type={t} aria-selected={t === type} onClick={() => { setType(t); setExpanded(false); }}>
            {t === "all" ? "All" : SHORT[t] || t}<b>{n}</b>
          </button>
        ))}
      </div>
      <ol className="rows" id="rows">
        {shown.map((it, i) => (
          <li className="row" key={it.id}>
            <Link href={libraryHref(it.id)}>
              <span className="r-n">{String(i + 1).padStart(3, "0")}</span>
              <span className="r-img">{it.thumb && <img src={opt(it.thumb, 360)} alt="" loading={i < 4 ? "eager" : "lazy"} decoding="async" />}</span>
              <span className="r-main">
                <span className="r-site">{it.site}</span>
                <span className="r-meta">{typeLabel(it.type)}{it.font ? ` · ${it.font}` : ""}</span>
                <span className="r-note">{it.note}</span>
              </span>
              <span className="r-pal" aria-hidden="true">{it.pal.map((c) => <i key={c} style={{ background: c }} />)}</span>
              <span className="r-h1">{it.h1 ? <><b>{it.h1}px</b>h1</> : null}</span>
            </Link>
          </li>
        ))}
      </ol>
      <div className="more" hidden={expanded || list.length <= PAGE}>
        <button type="button" className="btn btn-line" id="more" onClick={() => setExpanded(true)}>Show all <span id="more-n">{list.length}</span></button>
      </div>
    </section>
  );
}
