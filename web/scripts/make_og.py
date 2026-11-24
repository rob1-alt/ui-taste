# Builds the 1200x630 share banner (the TASTE mosaic from real library tiles). Usage:
#   python3 web/scripts/make_og.py /tmp/og.html, then screenshot it at 1200x630 with Playwright
#   and copy the PNG over web/src/app/(landing)/opengraph-image.png (and twitter-image.png, and the library ones).
import json, random, os, sys
ROOT = "/home/rob/projects/ui-taste"
OUT = sys.argv[1]
items = json.load(open(f"{ROOT}/skills/ui-taste/library/index.json"))
def lum(h):
    try:
        n = int(h.lstrip("#"), 16); return ((n>>16)*0.299 + ((n>>8)&255)*0.587 + (n&255)*0.114)/255
    except Exception: return 1
pages = [x for x in items if x.get("source") not in ("user-reference","worked-example") and os.path.exists(f"{ROOT}/site/thumbs/{x['id']}-tile.jpg")]
from PIL import Image, ImageStat
def bright(x):
    im = Image.open(f"{ROOT}/site/thumbs/{x['id']}-tile.jpg").convert("L"); im = im.crop((0,0,im.width,int(im.width*430/260)))
    return ImageStat.Stat(im).mean[0]/255
# the letters are made of pages that actually look light at tile size, not just light by their measured background
light = [x for x in pages if "dark" not in x.get("tags",[]) and bright(x) > 0.78]
rnd = random.Random(7)
GLYPH = {"T":["11111","00100","00100","00100","00100","00100","00100"],"A":["01110","10001","10001","11111","10001","10001","10001"],"S":["01111","10000","10000","01110","00001","00001","11110"],"E":["11111","10000","10000","11110","10000","10000","11111"]}
COLS, ROWS = 39, 9
co, ro = (COLS-29)//2, 1
lit = set()
for k, ch in enumerate("TASTE"):
    for r, line in enumerate(GLYPH[ch]):
        for c, v in enumerate(line):
            if v == "1": lit.add((ro+r)*COLS + co + k*6 + c)
STAR = ["stripe-press-landing","playdate-landing","kagi-pricing","hey-landing","lindy-landing","netlify-landing","duolingo-landing","oatly-landing","glossier-landing","panic-landing","anthropic-landing","basecamp-landing","tailscale-landing","notion-landing"]
byid = {x["id"]: x for x in light}
litpages = [byid[i] for i in STAR if i in byid] + rnd.sample([x for x in light if x["id"] not in STAR], len(lit))
litpages = litpages[:len(lit)]; rnd.shuffle(litpages)
rest = [x for x in pages if x not in litpages]; rnd.shuffle(rest)
cells = []; a = b = 0
for i in range(COLS*ROWS):
    if i in lit: cells.append((litpages[a], True)); a += 1
    else: cells.append((rest[b % len(rest)], False)); b += 1
tiles = "".join(f'<i class="{"on" if on else ""}" style="background-image:url(file://{ROOT}/site/thumbs/{it["id"]}-tile.jpg)"></i>' for it, on in cells)
n = len(pages)
html = f"""<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&display=block" rel="stylesheet">
<style>
*{{box-sizing:border-box;margin:0}}
body{{width:1200px;height:630px;background:#0e0e0e;color:#fff;font-family:Archivo,sans-serif;overflow:hidden;position:relative}}
.mosaic{{position:absolute;left:32px;right:32px;top:30px;display:grid;grid-template-columns:repeat({COLS},1fr);gap:3px}}
.mosaic i{{display:block;aspect-ratio:260/430;border-radius:2px;background:#1b1b1a center top/cover no-repeat;opacity:.13;filter:grayscale(1) brightness(.7)}}
.mosaic i.on{{opacity:1;filter:none;box-shadow:0 0 0 1px rgb(255 255 255 / .35)}}
.fade{{position:absolute;left:0;right:0;bottom:0;height:300px;background:linear-gradient(to bottom,rgb(14 14 14 / 0),#0e0e0e 55%)}}
.foot{{position:absolute;left:40px;right:40px;bottom:34px;display:flex;align-items:flex-end;justify-content:space-between;gap:40px}}
h1{{font-stretch:62%;font-weight:800;text-transform:uppercase;font-size:66px;line-height:.86;letter-spacing:-.01em;max-width:800px}}
.side{{display:grid;gap:14px;justify-items:end;text-align:right}}
.logo{{width:209px;height:45px;background:#fff;-webkit-mask:url(file://{ROOT}/site/brand/uitaste-logo-mask.svg) center/contain no-repeat}}
.n{{font-stretch:125%;font-size:13px;font-weight:600;letter-spacing:.03em;text-transform:uppercase;color:#a7a7a3}}
.n b{{color:#ff3d1f}}
</style></head><body>
<div class="mosaic">{tiles}</div><div class="fade"></div>
<div class="foot"><h1>Show your agent what good looks like.</h1>
<div class="side"><div class="logo"></div><div class="n"><b>{n}</b> real pages, measured<br>A Claude Code skill</div></div></div>
</body></html>"""
open(OUT, "w").write(html)
print(n, "pages,", len(lit), "lit")
