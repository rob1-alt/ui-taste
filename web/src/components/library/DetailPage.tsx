"use client";
// /library/<id> on a fresh load: the same view as the dialog, as a page, with neighbours in alphabetical order.
import Link from "next/link";
import { useState } from "react";
import { libraryHref, libTypeLabel } from "@/lib/format";
import type { Item } from "@/lib/types";
import { DetailView, Icon, type Shot } from "./DetailView";
import { LibraryBar } from "./LibraryBar";

export function DetailPage({ item, prevId, nextId, typeHref, typeName, jsonLd }: { item: Item; prevId: string; nextId: string; typeHref: string; typeName: string; jsonLd: object }) {
  const [shot, setShot] = useState<Shot>(item.screens.desktop ? "desktop" : "mobile");
  return (
    <>
      <LibraryBar />
      <main className="detail-page">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <DetailView item={item} shot={shot} onShot={setShot} asPage
          more={<section><h3>More like this</h3><p className="note"><Link href={typeHref}>{typeName}</Link>{item.tags.slice(0, 4).map((t) => <span key={t}>{" · "}<Link href={`/patterns/${t}`}>{t.replace(/-/g, " ")}</Link></span>)}</p><p className="visually-hidden">{item.site} {libTypeLabel(item.type).toLowerCase()}: {item.note}</p></section>}
          nav={<>
            <Link className="icon-btn" href={libraryHref(prevId)} aria-label="Previous screen">{Icon.prev}</Link>
            <Link className="icon-btn" href={libraryHref(nextId)} aria-label="Next screen">{Icon.next}</Link>
            <Link className="icon-btn" href="/library" aria-label="All pages">{Icon.close}</Link>
          </>} />
      </main>
      <div className="toast" id="toast" role="status" aria-live="polite" />
    </>
  );
}
