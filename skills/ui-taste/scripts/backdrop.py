#!/usr/bin/env python3
"""
Prepare hero images for the image-sandwich landing (references/landing-recipe.md).

    # cut the foreground (hills, grass, canopy) out of a backdrop so it can sit over the product
    python3 backdrop.py foreground hero.jpg hero-front.png --edge "0,62 18,55 35,60 52,70 70,52 88,48 100,56"
    python3 backdrop.py foreground hero.jpg hero-front.png --auto        # needs: pip install rembg

    # one-colour halftone duotone, like an engraving printed in blue (Orbit)
    python3 backdrop.py duotone statue.jpg hero.jpg --ink "#1f1fff" --paper "#ffffff" --dots 5

    # warm or cool colour cast so photos from different sources match
    python3 backdrop.py grade hero.jpg hero.jpg --tint "#ffe9c4" --amount 0.18

--edge is the top outline of the foreground as "x,y" pairs in percent of the image (x 0 to 100,
left to right; y from the top). Look at the image, trace the crest of the hills, and the script
smooths it into a curve and keeps everything below it. Requires Pillow.
"""

from __future__ import annotations

import argparse
import math
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageOps

Image.MAX_IMAGE_PIXELS = None


def hex_rgb(h: str) -> tuple[int, int, int]:
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def catmull_rom(points: list[tuple[float, float]], steps: int = 24) -> list[tuple[float, float]]:
    """Smooth a polyline through every point."""
    if len(points) < 3:
        return points
    pts = [points[0]] + points + [points[-1]]
    out = []
    for i in range(1, len(pts) - 2):
        p0, p1, p2, p3 = pts[i - 1], pts[i], pts[i + 1], pts[i + 2]
        for s in range(steps):
            t = s / steps
            t2, t3 = t * t, t * t * t
            out.append(tuple(
                0.5 * ((2 * p1[k]) + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2
                       + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3)
                for k in (0, 1)
            ))
    out.append(points[-1])
    return out


def foreground(src: Path, out: Path, edge: str | None, auto: bool, feather: float) -> None:
    img = Image.open(src).convert("RGBA")
    w, h = img.size
    if auto:
        try:
            from rembg import remove  # type: ignore
        except ImportError:
            raise SystemExit("--auto needs rembg: pip install rembg (or trace the crest with --edge)")
        cut = remove(img)
        cut.save(out)
        print(f"saved {out} ({w}x{h}) with rembg")
        return
    if not edge:
        raise SystemExit("give --edge with the crest outline, or --auto")
    pts = [tuple(float(v) for v in p.split(",")) for p in edge.split()]
    pts = sorted(pts, key=lambda p: p[0])
    if pts[0][0] > 0:
        pts.insert(0, (0.0, pts[0][1]))
    if pts[-1][0] < 100:
        pts.append((100.0, pts[-1][1]))
    curve = [(x / 100 * w, y / 100 * h) for x, y in catmull_rom(pts)]
    mask = Image.new("L", (w, h), 0)
    ImageDraw.Draw(mask).polygon(curve + [(w, h), (0, h)], fill=255)
    if feather:
        mask = mask.filter(ImageFilter.GaussianBlur(feather))
    img.putalpha(mask)
    img.save(out)
    print(f"saved {out} ({w}x{h}); foreground below the traced crest, feather {feather}px")


def duotone(src: Path, out: Path, ink: str, paper: str, dots: int) -> None:
    g = ImageOps.autocontrast(Image.open(src).convert("L"), cutoff=1)
    if dots > 1:
        # rotated-screen halftone: sample on a 45° grid, draw a dot sized by darkness
        w, h = g.size
        big = 4
        halftone = Image.new("L", (w * big, h * big), 255)
        d = ImageDraw.Draw(halftone)
        step = dots
        diag = int(math.hypot(w, h))
        ang = math.radians(45)
        ca, sa = math.cos(ang), math.sin(ang)
        for gy in range(-diag, diag, step):
            for gx in range(-diag, diag, step):
                x = gx * ca - gy * sa + w / 2
                y = gx * sa + gy * ca + h / 2
                if 0 <= x < w and 0 <= y < h:
                    dark = 1 - g.getpixel((int(x), int(y))) / 255
                    r = (step * big / 2) * math.sqrt(dark) * 1.25
                    if r > 0.4:
                        d.ellipse([x * big - r, y * big - r, x * big + r, y * big + r], fill=0)
        g = halftone.resize((w, h), Image.LANCZOS)
    tone = ImageOps.colorize(g, black=hex_rgb(ink), white=hex_rgb(paper))
    tone.convert("RGB").save(out, quality=88)
    print(f"saved {out}: duotone {ink} on {paper}" + (f", halftone {dots}px" if dots > 1 else ""))


def grade(src: Path, out: Path, tint: str, amount: float) -> None:
    img = Image.open(src).convert("RGB")
    layer = Image.new("RGB", img.size, hex_rgb(tint))
    graded = Image.blend(img, ImageChops.multiply(img, layer) if amount < 0 else ImageChops.soft_light(img, layer), abs(amount))
    graded.save(out, quality=90)
    print(f"saved {out}: graded toward {tint} by {amount}")


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    f = sub.add_parser("foreground", help="cut the foreground out so it can overlap the product")
    f.add_argument("src", type=Path); f.add_argument("out", type=Path)
    f.add_argument("--edge", help='crest outline, "x,y x,y ..." in percent')
    f.add_argument("--auto", action="store_true", help="use rembg instead of a traced outline")
    f.add_argument("--feather", type=float, default=1.5)
    d = sub.add_parser("duotone", help="one-ink duotone, optionally as a halftone")
    d.add_argument("src", type=Path); d.add_argument("out", type=Path)
    d.add_argument("--ink", default="#1f1fff"); d.add_argument("--paper", default="#ffffff")
    d.add_argument("--dots", type=int, default=0, help="halftone cell size in px (0 = smooth duotone)")
    g = sub.add_parser("grade", help="colour cast toward a tint")
    g.add_argument("src", type=Path); g.add_argument("out", type=Path)
    g.add_argument("--tint", default="#ffe9c4"); g.add_argument("--amount", type=float, default=0.18)
    a = ap.parse_args()
    if a.cmd == "foreground":
        foreground(a.src, a.out, a.edge, a.auto, a.feather)
    elif a.cmd == "duotone":
        duotone(a.src, a.out, a.ink, a.paper, a.dots)
    else:
        grade(a.src, a.out, a.tint, a.amount)


if __name__ == "__main__":
    main()
