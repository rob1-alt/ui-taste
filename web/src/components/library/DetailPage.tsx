"use client";
// /library/<id> on a fresh load: the same view as the dialog, as a page, with neighbours in alphabetical order.
import Link from "next/link";
import { useState } from "react";
import { libraryHref } from "@/lib/format";
import type { Item } from "@/lib/types";
import { DetailView, Icon, type Shot } from "./DetailView";
import { LibraryBar } from "./LibraryBar";

export function DetailPage({ item, prevId, nextId }: { item: Item; prevId: string; nextId: string }) {
  const [shot, setShot] = useState<Shot>(item.screens.desktop ? "desktop" : "mobile");
  return (
    <>
      <LibraryBar />
      <main className="detail-page">
        <DetailView item={item} shot={shot} onShot={setShot}
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
