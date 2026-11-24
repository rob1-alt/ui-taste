import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DetailPage } from "@/components/library/DetailPage";
import { libTypeLabel } from "@/lib/format";
import { getItem, getLibrary } from "@/lib/library";
import { breadcrumbs, typeHref, typeMetas } from "@/lib/seo";

type Params = { params: Promise<{ id: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return getLibrary().map((it) => ({ id: it.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const it = getItem(id);
  if (!it) return {};
  const title = `${it.site} ${libTypeLabel(it.type).toLowerCase()} design: fonts, colours and buttons, measured`;
  return { title, description: it.note, alternates: { canonical: `/library/${it.id}` }, openGraph: { title: `${title} · ui taste`, description: it.note, type: "article", url: `/library/${it.id}`, siteName: "ui taste" } };
}

export default async function Page({ params }: Params) {
  const { id } = await params;
  const all = getLibrary();
  const i = all.findIndex((x) => x.id === id);
  if (i < 0) notFound();
  const prev = all[(i - 1 + all.length) % all.length], next = all[(i + 1) % all.length];
  const it = all[i], tm = typeMetas(all).find((t) => t.type === it.type);
  const href = tm ? `/examples/${tm.slug}` : typeHref(it.type), name = tm ? `${tm.name} examples` : "Library";
  const ld = breadcrumbs([["ui taste", "/"], [name, href], [`${it.site} ${libTypeLabel(it.type).toLowerCase()}`, `/library/${it.id}`]]);
  return <DetailPage item={it} prevId={prev.id} nextId={next.id} typeHref={href} typeName={name} jsonLd={ld} />;
}
