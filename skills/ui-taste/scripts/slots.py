#!/usr/bin/env python3
"""
List the image slots of a page and measure the images placed in them, so the page can be
adapted to the client's real photos and artworks (references/imagery.md).

    python3 slots.py path/to/index.html

A slot is any element with data-slot, data-src (the file the client drops in, relative to the
page), data-ratio (e.g. 16/9) and data-tone (dark or light: what the layout expects behind text).
For each slot it reports whether the file is there and, if so: size, ratio against the expected
one, mean brightness of the whole image and of its bottom third (where text usually sits),
the text colour that reads on it, and its dominant colours. Then open each image with the Read
tool and adapt: object-position for the crop, overlay strength, text colour, accent.

Requires Pillow.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

from PIL import Image

Image.MAX_IMAGE_PIXELS = None
ATTR = re.compile(r'(data-[a-z-]+)="([^"]*)"')


def slots(html: str) -> list[dict]:
    out = []
    for tag in re.findall(r"<[^>]*\bdata-slot=\"[^\"]+\"[^>]*>", html):
        out.append({k[5:]: v for k, v in ATTR.findall(tag)})
    return out


def luminance(img: Image.Image) -> float:
    hist = img.convert("L").resize((64, 64)).histogram()
    return sum(i * n for i, n in enumerate(hist)) / sum(hist) / 255


def palette(img: Image.Image, n: int = 5) -> list[str]:
    q = img.convert("RGB").resize((96, 96)).quantize(colors=n, method=Image.Quantize.MEDIANCUT)
    pal = q.getpalette()[: n * 3]
    counts = sorted(q.getcolors(), reverse=True)
    return ["#%02x%02x%02x" % tuple(pal[i * 3 : i * 3 + 3]) for _, i in counts[:n]]


def ratio_of(text: str) -> float | None:
    try:
        a, b = text.split("/")
        return float(a) / float(b)
    except (ValueError, ZeroDivisionError):
        return None


def main() -> int:
    if len(sys.argv) != 2:
        print(__doc__)
        return 1
    page = Path(sys.argv[1]).resolve()
    found = slots(page.read_text(encoding="utf-8"))
    if not found:
        print("no data-slot elements in", page)
        return 1
    filled = 0
    for s in found:
        name, src = s.get("slot", "?"), s.get("src", "")
        path = page.parent / src
        want = ratio_of(s.get("ratio", ""))
        print(f"\n## {name}  ({src or 'no data-src'})")
        if s.get("brief"):
            print(f"brief: {s['brief']}")
        if not src or not path.exists():
            print(f"status: EMPTY · expected ratio {s.get('ratio', '?')}, tone {s.get('tone', '?')}")
            continue
        filled += 1
        img = Image.open(path)
        w, h = img.size
        r = w / h
        lum = luminance(img)
        bottom = luminance(img.crop((0, int(h * 2 / 3), w, h)))
        print(f"status: filled · {w}x{h} · ratio {r:.2f}" + (f" (expected {want:.2f}{', will be cropped' if abs(r - want) / want > 0.08 else ''})" if want else ""))
        if w < 1600 and want and want > 1.4:
            print("warning: under 1600px wide, will look soft full-bleed")
        print(f"brightness: {lum:.2f} overall, {bottom:.2f} bottom third")
        text = "white text" if bottom < 0.5 else "dark text"
        tone = s.get("tone")
        if tone in ("dark", "light") and ((tone == "dark") != (bottom < 0.5)):
            print(f"mismatch: layout expects {tone}, image is {'dark' if bottom < 0.5 else 'light'} → switch the text colour or add an overlay")
        busy = 0.3 <= bottom <= 0.75  # mid-grey zones: text needs help
        veil = ("a dark veil (black 35-45%) behind the text" if bottom < 0.5 else "a light veil (white 45-55%) behind the text")
        print(f"reads with: {text}" + (f", plus {veil}" if busy else ""))
        print("colours: " + ", ".join(palette(img)))
    print(f"\n{filled}/{len(found)} slots filled")
    return 0


if __name__ == "__main__":
    sys.exit(main())
