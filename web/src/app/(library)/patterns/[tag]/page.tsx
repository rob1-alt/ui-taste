import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExampleList, relatedFor } from "@/components/library/ExampleList";
import { getLibrary } from "@/lib/library";
import { breadcrumbs, itemList, patternMetas } from "@/lib/seo";

type P = { params: Promise<{ tag: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return patternMetas().map((p) => ({ tag: p.tag })); }
const find = (tag: string) => patternMetas().find((p) => p.tag === tag);

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const p = find((await params).tag); if (!p) return {};
  const title = `${p.name} examples: ${p.count} real web pages, measured`;
  const description = `${p.count} web pages that use ${p.name.toLowerCase()}, from products known for their design, with fonts, colours and buttons measured on each live page.`;
  return { title, description, alternates: { canonical: `/patterns/${p.tag}` }, openGraph: { title: `${title} · ui taste`, description, url: `/patterns/${p.tag}`, siteName: "ui taste" } };
}

export default async function Page({ params }: P) {
  const p = find((await params).tag); if (!p) notFound();
  const items = getLibrary().filter((x) => x.tags.includes(p.tag));
  const h1 = `${p.name} examples`;
  return (
    <ExampleList h1={h1} lede={`${items.length} real web pages that use ${p.name.toLowerCase()}, each captured on desktop and mobile and measured on the live page, with a note on what to learn from it.`}
      items={items} crumbs={[["ui taste", "/"], ["Patterns", "/examples#patterns"], [h1, `/patterns/${p.tag}`]]}
      jsonLd={[breadcrumbs([["ui taste", "/"], ["Patterns", "/examples"], [h1, `/patterns/${p.tag}`]]), itemList(h1, items)]}
      related={[{ title: "Related patterns", links: relatedFor(items, p.tag) }]} />
  );
}
