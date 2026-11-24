#!/usr/bin/env python3
"""
Find public-domain artworks for a page that has no pictures yet, and fetch one with its credit.
Only CC0 / public-domain works from two museums' open-access APIs: The Metropolitan Museum of Art
and the Cleveland Museum of Art. Nothing generated, nothing from stock sites.

    # candidates: a numbered contact sheet in art/sheet.jpg and a list with credits
    python3 find_art.py search "wheat field" --out art
    python3 find_art.py search "storm sky" --type painting --limit 16 --out art

    # fetch one at full size, with art/<slug>.json holding the credit line
    python3 find_art.py get met:436535 --out art
    python3 find_art.py get cma:144676 --out art

Then open the sheet with the Read tool, pick, `get` it, and build with it like a client file:
crop and focus, cut the foreground with backdrop.py if it should pass in front of the product,
veil behind text, measure with slots.py, and print the credit on the page (references/imagery.md,
"No pictures yet").

Requires Pillow for the contact sheet; the rest is the standard library.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

UA = {"User-Agent": "ui-taste-skill/1.0 (public-domain art for web design; find_art.py)"}
MET = "https://collectionapi.metmuseum.org/public/collection/v1.1"
MET_OBJ = "https://collectionapi.metmuseum.org/public/collection/v1/objects/"
CMA = "https://openaccess-api.clevelandart.org/api/artworks/"


def fetch(url: str, timeout: int = 30) -> bytes:
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read()


def fetch_json(url: str) -> dict:
    return json.loads(fetch(url))


def slug(s: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")[:60] or "art"


# ---------- the two museums, shaped the same way ----------

def met_item(oid: int) -> dict | None:
    try:
        o = fetch_json(f"{MET_OBJ}{oid}")
    except Exception:
        return None
    if not o.get("isPublicDomain") or not o.get("primaryImageSmall"):
        return None
    return {
        "ref": f"met:{oid}",
        "title": o.get("title") or "Untitled",
        "artist": o.get("artistDisplayName") or "Unknown artist",
        "date": o.get("objectDate") or "",
        "type": (o.get("classification") or o.get("objectName") or "").lower(),
        "museum": "The Metropolitan Museum of Art",
        "licence": "Public domain (CC0), Met Open Access",
        "page": o.get("objectURL") or f"https://www.metmuseum.org/art/collection/search/{oid}",
        "preview": o.get("primaryImageSmall"),
        "full": o.get("primaryImage") or o.get("primaryImageSmall"),
    }


def met_search(q: str, kind: str | None, limit: int) -> list[dict]:
    params = {"q": q, "hasImages": "true", "isPublicDomain": "true", "limit": str(limit * 3), "offset": "0"}
    if kind == "painting":
        params["departmentId"] = "11"  # European Paintings; American paintings live in 21 (American Wing)
    try:
        ids = fetch_json(f"{MET}/search?{urllib.parse.urlencode(params)}").get("objectIDs") or []
    except Exception as e:
        print(f"met: search failed ({e})", file=sys.stderr)
        return []
    with ThreadPoolExecutor(8) as ex:
        items = [x for x in ex.map(met_item, ids[: limit * 3]) if x]
    if kind:
        items = [x for x in items if kind in x["type"]] or items
    return items[:limit]


def cma_search(q: str, kind: str | None, limit: int) -> list[dict]:
    params = {"q": q, "cc0": "1", "has_image": "1", "limit": str(limit),
              "fields": "id,title,creators,creation_date,images,type,url"}
    if kind:
        params["type"] = kind.capitalize()
    try:
        data = fetch_json(f"{CMA}?{urllib.parse.urlencode(params)}").get("data") or []
    except Exception as e:
        print(f"cma: search failed ({e})", file=sys.stderr)
        return []
    out = []
    for a in data:
        img = a.get("images") or {}
        web = (img.get("web") or {}).get("url")
        full = ((img.get("full") or img.get("print") or {}).get("url")) or web
        if not web:
            continue
        who = (a.get("creators") or [{}])[0].get("description") or "Unknown artist"
        out.append({
            "ref": f"cma:{a['id']}",
            "title": a.get("title") or "Untitled",
            "artist": re.sub(r"\s*\(.*$", "", who),
            "date": a.get("creation_date") or "",
            "type": (a.get("type") or "").lower(),
            "museum": "The Cleveland Museum of Art",
            "licence": "Public domain (CC0), Cleveland Museum of Art Open Access",
            "page": a.get("url") or f"https://www.clevelandart.org/art/{a['id']}",
            "preview": web,
            "full": full,
        })
    return out


def credit(it: dict) -> str:
    date = f", {it['date']}" if it["date"] else ""
    return f"{it['artist']}, {it['title']}{date}. {it['museum']}, public domain."


# ---------- commands ----------

def cmd_search(a) -> None:
    out = Path(a.out); prev = out / "previews"; prev.mkdir(parents=True, exist_ok=True)
    per = max(1, a.limit // 2)
    items = met_search(a.query, a.type, per) + cma_search(a.query, a.type, a.limit - per)
    if not items:
        print("nothing found: try a plainer word (sky, field, harbour, still life, portrait, garden)")
        return
    def grab(it):
        p = prev / f"{it['ref'].replace(':', '-')}.jpg"
        try:
            p.write_bytes(fetch(it["preview"]))
            return p
        except Exception:
            return None
    with ThreadPoolExecutor(8) as ex:
        paths = list(ex.map(grab, items))
    for i, (it, p) in enumerate(zip(items, paths), 1):
        print(f"{i:>2}. {it['ref']:<12} {it['title'][:60]}  |  {it['artist']}, {it['date']}  ({it['type'] or 'artwork'})")
    try:
        from PIL import Image, ImageDraw
        cells = [(i, Image.open(p).convert("RGB")) for i, p in enumerate(paths, 1) if p]
        W, H, cols = 360, 300, 4
        rows = (len(cells) + cols - 1) // cols
        sheet = Image.new("RGB", (cols * W, rows * H), "white")
        d = ImageDraw.Draw(sheet)
        for k, (i, im) in enumerate(cells):
            im.thumbnail((W - 12, H - 34))
            x, y = (k % cols) * W, (k // cols) * H
            sheet.paste(im, (x + 6, y + 6))
            d.text((x + 8, y + H - 24), f"{i}. {items[i - 1]['ref']}", fill="black")
        sheet.save(out / "sheet.jpg", quality=82)
        print(f"\ncontact sheet: {out / 'sheet.jpg'}  (open it, then: find_art.py get <ref> --out {out})")
    except ImportError:
        print("\n(pip install pillow for the contact sheet; previews are in", prev, ")")


def cmd_get(a) -> None:
    src, _, oid = a.ref.partition(":")
    if src == "met":
        it = met_item(int(oid))
    elif src == "cma":
        try:
            o = fetch_json(f"{CMA}{oid}").get("data") or {}
        except Exception as e:
            sys.exit(f"cma: {e}")
        if o.get("share_license_status") != "CC0":
            sys.exit(f"{a.ref} is not CC0: not usable")
        img = o.get("images") or {}
        it = {
            "ref": a.ref, "title": o.get("title") or "Untitled",
            "artist": re.sub(r"\s*\(.*$", "", (o.get("creators") or [{}])[0].get("description") or "Unknown artist"),
            "date": o.get("creation_date") or "", "type": (o.get("type") or "").lower(),
            "museum": "The Cleveland Museum of Art", "licence": "Public domain (CC0), Cleveland Museum of Art Open Access",
            "page": o.get("url") or "", "preview": (img.get("web") or {}).get("url"),
            "full": ((img.get("full") or img.get("print") or img.get("web") or {}).get("url")),
        }
    else:
        sys.exit("ref must look like met:436535 or cma:144676")
    if not it:
        sys.exit(f"{a.ref}: not found or not public domain")
    out = Path(a.out); out.mkdir(parents=True, exist_ok=True)
    name = slug(f"{it['artist'].split()[-1] if it['artist'] else ''}-{it['title']}")
    img_path = out / f"{name}.jpg"
    img_path.write_bytes(fetch(it["full"], timeout=120))
    it["file"] = img_path.name
    it["credit"] = credit(it)
    (out / f"{name}.json").write_text(json.dumps(it, indent=2, ensure_ascii=False))
    size = ""
    try:
        from PIL import Image
        Image.MAX_IMAGE_PIXELS = None
        with Image.open(img_path) as im:
            size = f" ({im.width}x{im.height})"
    except Exception:
        pass
    print(f"saved {img_path}{size}")
    print(f"credit: {it['credit']}")
    print(f"source: {it['page']}")
    print("Museum scans often keep the frame or the canvas edge: crop it before use.")


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    s = sub.add_parser("search"); s.add_argument("query"); s.add_argument("--type", help="painting, print, drawing, photograph")
    s.add_argument("--limit", type=int, default=12); s.add_argument("--out", default="art")
    g = sub.add_parser("get"); g.add_argument("ref"); g.add_argument("--out", default="art")
    a = ap.parse_args()
    {"search": cmd_search, "get": cmd_get}[a.cmd](a)


if __name__ == "__main__":
    main()
