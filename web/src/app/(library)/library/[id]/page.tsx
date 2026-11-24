import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DetailPage } from "@/components/library/DetailPage";
import { libTypeLabel } from "@/lib/format";
import { getItem, getLibrary } from "@/lib/library";

type Params = { params: Promise<{ id: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return getLibrary().map((it) => ({ id: it.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const it = getItem(id);
  if (!it) return {};
  const title = `${it.site} ${libTypeLabel(it.type).toLowerCase()}`;
  return { title, description: it.note, alternates: { canonical: `/library/${it.id}` }, openGraph: { title: `${title} · ui taste`, description: it.note, type: "article", url: `/library/${it.id}`, siteName: "ui taste" } };
}

export default async function Page({ params }: Params) {
  const { id } = await params;
  const all = getLibrary();
  const i = all.findIndex((x) => x.id === id);
  if (i < 0) notFound();
  const prev = all[(i - 1 + all.length) % all.length], next = all[(i + 1) % all.length];
  return <DetailPage item={all[i]} prevId={prev.id} nextId={next.id} />;
}
