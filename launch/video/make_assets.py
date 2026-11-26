#!/usr/bin/env python3
"""Copy the video's images into public/: page tiles for the mosaic, the comparison shots, the review frames.
Run with the repo's venv (needs Pillow): ../../.venv/bin/python make_assets.py"""
import json, random, shutil
from pathlib import Path
from PIL import Image, ImageStat

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
PUB = HERE / "public"
THUMBS = ROOT / "site/thumbs"
SCR = ROOT / "skills/ui-taste/library/screens"
CMP = ROOT / "site/demo/compare"
LIB = json.loads((ROOT / "skills/ui-taste/library/index.json").read_text())

# 1. tiles: every page with a tile thumbnail, scored for how bright it is (bright ones spell the word)
(PUB / "tiles").mkdir(parents=True, exist_ok=True)
for f in (PUB / "tiles").glob("*.jpg"): f.unlink()
items = [x for x in LIB if (THUMBS / f"{x['id']}-tile.jpg").exists()]
random.seed(7); random.shuffle(items)
tiles = []
for x in items[:420]:
    im = Image.open(THUMBS / f"{x['id']}-tile.jpg").convert("RGB")
    im.thumbnail((120, 240)); im.save(PUB / "tiles" / f"{x['id']}.jpg", quality=78)
    st = ImageStat.Stat(im)
    tiles.append({"id": x["id"], "site": x["site"], "light": round(sum(st.mean) / 3), "spread": round(sum(st.stddev) / 3)})

# 2. the comparison: same prompt, same model, three ways
for f in CMP.glob("*.jpg"): shutil.copy(f, PUB / f"cmp-{f.name}")
cmp = json.loads((CMP / "compare.json").read_text())

# 3. the review loop of the landing run: the reference sheet, the side-by-side, the page itself
def crop_top(src: Path, dst: Path, w: int, ratio: float):
    im = Image.open(src).convert("RGB"); im = im.crop((0, 0, im.width, min(im.height, round(im.width * ratio))))
    im.thumbnail((w, w)); im.save(dst, quality=86)
SCRATCH = Path("/tmp/claude-1000/-home-rob-projects-ui-taste-skills-ui-taste/958d8ed1-a721-4c30-a929-524706ae9f6c/scratchpad/ba4/with-landing")
if SCRATCH.exists():
    im = Image.open(SCRATCH / "refs.png").convert("RGB"); im.thumbnail((1800, 1800)); im.save(PUB / "refs.jpg", quality=86)
    im = Image.open(SCRATCH / "review.png").convert("RGB"); im.crop((0, 0, im.width, 30 + 750 + 6)).save(PUB / "review-top.jpg", quality=86)
crop_top(SCR / "linear-pricing-desktop.jpg", PUB / "linear-pricing.jpg", 1440, 900 / 1440)

lp = next(x for x in LIB if x["id"] == "linear-pricing")
stats = {"pages": len(items), "sites": len({x["site"] for x in items}), "shots": 2 * len(items)}
(PUB / "data.json").write_text(json.dumps({"tiles": tiles, "stats": stats, "compare": cmp,
    "linear": {"typeScale": lp.get("typeScale"), "colors": lp.get("colors"), "buttons": lp.get("buttons"), "fonts": lp.get("fonts")}}))
print(stats, len(tiles), "tiles")
