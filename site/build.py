#!/usr/bin/env python3
"""
Build the gallery site from the library: thumbnails in site/thumbs/ and the
data in site/data.js. Run it after adding screens:

    python3 site/build.py

Then open site/index.html in a browser (no server needed).
"""

from __future__ import annotations

import json
from pathlib import Path

from PIL import Image

Image.MAX_IMAGE_PIXELS = None

ROOT = Path(__file__).resolve().parent.parent
LIBRARY = ROOT / "skills" / "ui-taste" / "library"
SITE = ROOT / "site"
THUMBS = SITE / "thumbs"

DESKTOP_CROP = (1440, 1000)   # top of the page, where the decisions are
DESKTOP_THUMB_W = 720
MOBILE_CROP_H = 760           # in CSS pixels (screens are stored at 390 wide)
MOBILE_THUMB_W = 260


def thumb(src: Path, out: Path, crop_h_ratio: float, width: int) -> None:
    if out.exists() and out.stat().st_mtime > src.stat().st_mtime:
        return
    img = Image.open(src).convert("RGB")
    h = min(img.height, int(img.width * crop_h_ratio))
    img = img.crop((0, 0, img.width, h))
    img = img.resize((width, int(h * width / img.width)), Image.LANCZOS)
    img.save(out, "JPEG", quality=74, optimize=True, progressive=True)


def main() -> None:
    THUMBS.mkdir(parents=True, exist_ok=True)
    items = json.loads((LIBRARY / "index.json").read_text())
    data = []
    for it in items:
        if it.get("source") in ("user-reference", "worked-example"):
            continue  # style references and pages built with the skill are not live pages: not in the gallery
        screens = {}
        for kind, ratio, width in (
            ("desktop", DESKTOP_CROP[1] / DESKTOP_CROP[0], DESKTOP_THUMB_W),
            ("mobile", MOBILE_CROP_H / 390, MOBILE_THUMB_W),
        ):
            s = it.get("screens", {}).get(kind)
            if not s:
                continue
            src = LIBRARY / s["file"]
            out = THUMBS / f"{it['id']}-{kind}.jpg"
            thumb(src, out, ratio, width)
            if kind == "mobile":
                tile = THUMBS / f"{it['id']}-tile.jpg"
                if not tile.exists() or tile.stat().st_mtime < src.stat().st_mtime:
                    im = Image.open(src).convert("RGB")
                    h = min(im.height, int(im.width * 507 / 260))
                    im.crop((0, 0, im.width, h)).resize((240, int(h * 240 / im.width)), Image.LANCZOS).save(tile, "JPEG", quality=72, optimize=True, progressive=True)
            screens[kind] = {
                "full": f"../skills/ui-taste/library/{s['file']}",
                "thumb": f"thumbs/{out.name}",
                **({"tile": f"thumbs/{it['id']}-tile.jpg"} if kind == "mobile" else {}),
                "w": s["width"],
                "h": s["height"],
            }
        tk = it.get("tokens") or {}
        data.append({
            "id": it["id"],
            "site": it["site"],
            "url": it["url"],
            "type": it["type"],
            "tags": it.get("tags", []),
            "note": it.get("note", ""),
            "captured": it.get("captured", ""),
            "screens": screens,
            "fonts": tk.get("fonts", [])[:4],
            "typeScale": {k: v for k, v in (tk.get("type") or {}).items() if v},
            "colors": tk.get("colors") or {},
            "buttons": (tk.get("buttons") or [])[:3],
            "contentWidth": tk.get("contentWidth"),
        })
    data.sort(key=lambda d: (d["site"].lower(), d["type"]))
    js = "window.LIBRARY = " + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + ";\n"
    (SITE / "data.js").write_text(js)
    print(f"{len(data)} pages, data.js {len(js) // 1024} KB")


if __name__ == "__main__":
    main()
