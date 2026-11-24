"""The ui taste logo: a 3x3 tile mark (five lit tiles draw a T, one cell of the TASTE mosaic) and the name set in
Archivo (width 125, weight 750) converted to outlines, so the SVGs need no font.

    .venv/bin/python web/scripts/make_logo.py        (needs fonttools)

Writes site/brand/: uitaste-logo.svg (ink on light), uitaste-logo-dark.svg, uitaste-logo-mask.svg (black, used as
a CSS mask painted in currentColor), and keeps the mark files as they are.
"""
import re
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.transformPen import TransformPen

ROOT = Path(__file__).resolve().parents[2]
BRAND = ROOT / "site" / "brand"
FONT = ROOT / "launch" / "video" / "public" / "Archivo.ttf"
WORD = "ui taste"

TILE, GAP, R = 30, 7, 6
LIT = {0, 1, 2, 4, 7}            # the T
H = 3 * TILE + 2 * GAP           # 104: the mark's height, also the lockup's
# the name sits where "taster" sat in the first lockup: x-height and baseline unchanged
X0, BASELINE, XHEIGHT = 127.9, 72.9, 72.9 - 31.9

font = instantiateVariableFont(TTFont(FONT), {"wdth": 125, "wght": 750})
gs, cmap, hmtx = font.getGlyphSet(), font.getBestCmap(), font["hmtx"]
xh = font["OS/2"].sxHeight
scale = XHEIGHT / xh

def word_path(text):
    pen = SVGPathPen(gs); bpen = BoundsPen(gs)
    x = 0.0
    kern = {}
    for ch in text:
        g = cmap[ord(ch)]
        t = (scale, 0, 0, -scale, X0 + x * scale, BASELINE)
        gs[g].draw(TransformPen(pen, t)); gs[g].draw(TransformPen(bpen, t))
        x += hmtx[g][0]
    return pen.getCommands(), bpen.bounds

def svg(tile_on, tile_off, ink, off_opacity=None):
    d, (x0, y0, x1, y1) = word_path(WORD)
    w = round(x1 + 2)
    rects = []
    for i in range(9):
        r, c = divmod(i, 3)
        on = i in LIT
        fill = tile_on if on else tile_off
        extra = "" if on or off_opacity is None else f' fill-opacity="{off_opacity}"'
        rects.append(f'  <rect x="{c*(TILE+GAP)}" y="{r*(TILE+GAP)}" width="{TILE}" height="{TILE}" rx="{R}" fill="{fill}"{extra}/>')
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {H}" width="{w}" height="{H}">\n'
            + "\n".join(rects) + f'\n  <path d="{d}" fill="{ink}"/>\n</svg>\n'), w

light, w = svg("#0e0e0e", "#e6e6e2", "#0e0e0e")
dark, _ = svg("#ffffff", "#3a3a38", "#ffffff")
mask, _ = svg("#000", "#000", "#000", off_opacity=".22")
(BRAND / "uitaste-logo.svg").write_text(light)
(BRAND / "uitaste-logo-dark.svg").write_text(dark)
(BRAND / "uitaste-logo-mask.svg").write_text(mask)
print(f"lockup {w} x {H}")
