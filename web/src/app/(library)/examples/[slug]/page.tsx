import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExampleList, relatedFor } from "@/components/library/ExampleList";
import { getLibrary } from "@/lib/library";
import { breadcrumbs, itemList, typeBySlug, typeMetas } from "@/lib/seo";

type P = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return typeMetas().map((t) => ({ slug: t.slug })); }

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const t = typeBySlug((await params).slug); if (!t) return {};
  const n = getLibrary().filter((x) => x.type === t.type).length;
  const title = `${t.name} examples: ${n} real ${t.plural}, measured`;
  const description = `${n} ${t.plural} from products known for their design, with the fonts, type scale, colours and buttons measured on each live page, and the one decision worth copying.`;
  return { title, description, alternates: { canonical: `/examples/${t.slug}` }, openGraph: { title: `${title} · ui taste`, description, url: `/examples/${t.slug}`, siteName: "ui taste" } };
}

export default async function Page({ params }: P) {
  const t = typeBySlug((await params).slug); if (!t) notFound();
  const items = getLibrary().filter((x) => x.type === t.type);
  const h1 = `${t.name} examples`;
  const others = typeMetas().filter((x) => x.slug !== t.slug).map((x) => [`${x.name} examples`, `/examples/${x.slug}`, getLibrary().filter((i) => i.type === x.type).length] as [string, string, number]);
  return (
    <ExampleList h1={h1} lede={`${items.length} real ${t.plural}. ${t.intro}`} items={items}
      crumbs={[["ui taste", "/"], ["Examples", "/examples"], [h1, `/examples/${t.slug}`]]}
      jsonLd={[breadcrumbs([["ui taste", "/"], ["Examples", "/examples"], [h1, `/examples/${t.slug}`]]), itemList(h1, items)]}
      related={[{ title: "Patterns on these pages", links: relatedFor(items) }, { title: "Other page types", links: others }]} />
  );
}
