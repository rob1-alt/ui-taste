import type { Metadata } from "next";
import Link from "next/link";
import { LibraryBar } from "@/components/library/LibraryBar";
import { getLibrary } from "@/lib/library";
import { breadcrumbs, patternMetas, typeMetas } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Web design examples by page type and pattern",
  description: "Real web pages from products known for their design, grouped by page type (landing, pricing, dashboard, design system…) and by pattern (bento grid, dark mode, serif display…), each measured on the live page.",
  alternates: { canonical: "/examples" },
};

export default function Examples() {
  const lib = getLibrary();
  return (
    <>
      <LibraryBar />
      <main className="ex">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs([["ui taste", "/"], ["Examples", "/examples"]])) }} />
        <section className="intro">
          <h1>Web design examples</h1>
          <p className="lede">{lib.length} real pages from products known for their design, grouped by page type and by pattern. Every page was captured on desktop and mobile and measured on the live page: fonts, type scale, colours, buttons.</p>
        </section>
        <section className="ex-related"><h2>By page type</h2>
          <ul>{typeMetas().map((t) => <li key={t.slug}><Link href={`/examples/${t.slug}`}>{t.name} examples</Link><span>{lib.filter((x) => x.type === t.type).length}</span></li>)}</ul>
        </section>
        <section className="ex-related" id="patterns"><h2>By pattern</h2>
          <ul>{patternMetas().map((p) => <li key={p.tag}><Link href={`/patterns/${p.tag}`}>{p.name}</Link><span>{p.count}</span></li>)}</ul>
        </section>
      </main>
    </>
  );
}
