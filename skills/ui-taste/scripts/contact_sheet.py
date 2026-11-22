#!/usr/bin/env python3
"""
Build contact sheets of the library for the README: one image per page type,
each screen cropped to its first fold with the site name under it.

    python3 contact_sheet.py ../../../docs     # writes docs/<type>.jpg
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

LIBRARY = Path(__file__).resolve().parent.parent / "library"
THUMB_W, THUMB_H = 480, 300  # a 1440x900 fold at a third
COLS = 3
GAP = 24
LABEL_H = 34
BG = (246, 245, 242)
INK = (24, 24, 27)


def font(size: int):
    for path in (
        "/System/Library/Fonts/SFNS.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    ):
        try:
            return ImageFont.truetype(path, size)
        except OSError:
            continue
    return ImageFont.load_default()


def thumb(item: dict) -> Image.Image:
    img = Image.open(LIBRARY / item["screens"]["desktop"]["file"]).convert("RGB")
    fold = img.crop((0, 0, img.width, min(img.height, int(img.width * 900 / 1440))))
    return fold.resize((THUMB_W, THUMB_H), Image.LANCZOS)


def sheet(items: list[dict], out: Path) -> None:
    rows = (len(items) + COLS - 1) // COLS
    w = COLS * THUMB_W + (COLS + 1) * GAP
    h = rows * (THUMB_H + LABEL_H) + (rows + 1) * GAP
    canvas = Image.new("RGB", (w, h), BG)
    draw = ImageDraw.Draw(canvas)
    f = font(17)
    for n, item in enumerate(items):
        x = GAP + (n % COLS) * (THUMB_W + GAP)
        y = GAP + (n // COLS) * (THUMB_H + LABEL_H + GAP)
        canvas.paste(thumb(item), (x, y))
        draw.rectangle((x, y, x + THUMB_W - 1, y + THUMB_H - 1), outline=(218, 216, 210))
        label = item["site"] if item["type"] != "design-system" else f"{item['site']} · {item['id'].split('-')[-1]}"
        draw.text((x, y + THUMB_H + 9), label if item["type"] in ("landing", "design-system") else f"{label} · {item['type']}", fill=INK, font=f)
    out.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(out, "JPEG", quality=80, optimize=True, progressive=True)


def mobile_sheet(items: list[dict], out: Path) -> None:
    """First fold of each mobile capture, side by side."""
    tw, th, gap = 234, 506, 20
    canvas = Image.new("RGB", (len(items) * (tw + gap) + gap, th + LABEL_H + 2 * gap), BG)
    draw = ImageDraw.Draw(canvas)
    f = font(16)
    for n, item in enumerate(items):
        img = Image.open(LIBRARY / item["screens"]["mobile"]["file"]).convert("RGB")
        fold = img.crop((0, 0, img.width, min(img.height, int(img.width * 844 / 390))))
        x = gap + n * (tw + gap)
        canvas.paste(fold.resize((tw, th), Image.LANCZOS), (x, gap))
        draw.rectangle((x, gap, x + tw - 1, gap + th - 1), outline=(218, 216, 210))
        draw.text((x, gap + th + 8), item["site"], fill=INK, font=f)
    out.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(out, "JPEG", quality=80, optimize=True, progressive=True)


def main() -> int:
    out_dir = Path(sys.argv[1] if len(sys.argv) > 1 else "docs").resolve()
    items = [i for i in json.loads((LIBRARY / "index.json").read_text()) if "desktop" in i.get("screens", {})]
    by_type: dict[str, list[dict]] = {}
    for i in items:
        by_type.setdefault(i["type"], []).append(i)
    mobile_sheet([i for i in items if "mobile" in i.get("screens", {}) and i["type"] == "landing"][:8],
                 out_dir / "mobile.jpg")
    print(f"mobile: -> {out_dir / 'mobile.jpg'}")
    for old in out_dir.glob("*.jpg"):
        if old.name != "mobile.jpg":
            old.unlink()
    for typ, group in by_type.items():
        group = sorted(group, key=lambda i: (i["site"].lower(), i["id"]))
        # Long types are split so each image stays readable on GitHub.
        parts = -(-len(group) // 30)
        size = -(-len(group) // parts)
        chunks = [group[k:k + size] for k in range(0, len(group), size)]
        for n, chunk in enumerate(chunks, 1):
            name = f"{typ}.jpg" if len(chunks) == 1 else f"{typ}-{n}.jpg"
            sheet(chunk, out_dir / name)
            print(f"{typ}: {len(chunk)} screens -> {out_dir / name}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
