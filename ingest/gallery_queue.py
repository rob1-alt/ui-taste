#!/usr/bin/env python3
"""
Build the capture queue from a human-curated gallery instead of hand-written lists:
minimal.gallery (WordPress, ~3000 hand-picked sites, tagged by kind).

    python3 ingest/gallery_queue.py [--tags startup,saas,...] [--max 400]
        -> appends new entries to ingest/queue.json (newest picks first, interleaved
           across tags so a batch is not 50 agencies), skipping every URL already in
           sources.json, skipped.tsv or the queue.

Sites the gallery marks "Offline" are left out. Run ingest/prefilter.py on each batch
before capturing.
"""

from __future__ import annotations

import html
import json
import re
import sys
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from itertools import zip_longest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from prefilter import norm, seen  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
QUEUE = ROOT / "ingest/queue.json"
API = "https://minimal.gallery/wp-json/wp/v2"
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/131.0 Safari/537.36"
OFFLINE = 48
# product-side kinds first; agencies and portfolios are plentiful, keep them a minority
DEFAULT_TAGS = ["startup", "saas", "ai", "tools", "app", "product", "software", "type-foundry",
                "science", "research", "programming", "platform", "finance", "branding",
                "museum-gallery", "editorial", "music", "food-drink", "personal", "agency"]
SKIP_HOSTS = r"(instagram|behance|dribbble|cargo\.site|readymag|framer\.website|webflow\.io|notion\.site)"


def get(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=20) as r:
        return r.read().decode("utf-8", "replace")


def tag_ids() -> dict[str, int]:
    tags = json.loads(get(f"{API}/tags?per_page=100&_fields=id,slug"))
    return {t["slug"]: t["id"] for t in tags}


def posts(tag: int, limit: int) -> list[dict]:
    out, page = [], 1
    while len(out) < limit:
        try:
            batch = json.loads(get(f"{API}/posts?tags={tag}&categories_exclude={OFFLINE}&per_page=100"
                                   f"&page={page}&_fields=link,title"))
        except Exception:
            break
        if not batch:
            break
        out += batch; page += 1
    return out[:limit]


def outbound(post: dict) -> dict | None:
    try:
        m = re.search(r'href="(https?://[^"?]+)[^"]*\?ref=minimal\.gallery"', get(post["link"]))
    except Exception:
        return None
    if not m or re.search(SKIP_HOSTS, m.group(1)):
        return None
    url = m.group(1).rstrip("/")
    return {"site": html.unescape(post["title"]["rendered"]).strip(), "url": url,
            "type": "landing", "tags": [], "note": "", "via": "minimal.gallery"}


def main() -> int:
    args = sys.argv[1:]
    want = args[args.index("--tags") + 1].split(",") if "--tags" in args else DEFAULT_TAGS
    cap = int(args[args.index("--max") + 1]) if "--max" in args else 400
    ids = tag_ids()
    per_tag = [posts(ids[t], 120) for t in want if t in ids]
    order, done = [], set()
    for row in zip_longest(*per_tag):  # interleave: newest of each tag, then the next...
        for p in row:
            if p and p["link"] not in done:
                done.add(p["link"]); order.append(p)
    queue = json.loads(QUEUE.read_text()) if QUEUE.exists() else []
    known = seen() | {norm(e["url"]) for e in queue}
    new = []
    with ThreadPoolExecutor(12) as ex:
        for e in ex.map(outbound, order):
            if e and norm(e["url"]) not in known:
                known.add(norm(e["url"])); new.append(e)
                if len(new) >= cap:
                    break
    QUEUE.write_text(json.dumps(queue + new, indent=1, ensure_ascii=False) + "\n")
    print(f"{len(new)} new entries, queue now {len(queue) + len(new)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
