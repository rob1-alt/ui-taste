#!/usr/bin/env python3
"""
Flag captures that are blank, black or a flat single colour (WebGL sites, failed
renders), so they are dropped without a visual review.

    .venv/bin/python ingest/blank_check.py id1 id2 ...   -> prints "BLANK|id|reason" lines,
                                                            then the ids that look fine
"""

import sys
from pathlib import Path
from PIL import Image, ImageStat

Image.MAX_IMAGE_PIXELS = None
S = Path(__file__).resolve().parent.parent / "skills/ui-taste/library/screens"


def blank(path: Path) -> str | None:
    if not path.exists():
        return "missing file"
    im = Image.open(path).convert("L")
    top = im.crop((0, 0, im.width, min(im.height, im.width * 2)))  # first ~2 screens
    small = top.resize((64, max(1, int(64 * top.height / top.width))))
    st = ImageStat.Stat(small)
    if st.stddev[0] < 6:
        return f"flat (mean {st.mean[0]:.0f}, sd {st.stddev[0]:.1f})"
    # share of near-identical pixels: a lone logo on an empty page
    hist = small.histogram()
    if max(hist) / sum(hist) > 0.97:
        return "almost empty"
    if im.height < 500:
        return f"too short ({im.height}px)"
    return None


ok = []
for id_ in sys.argv[1:]:
    why = blank(S / f"{id_}-desktop.jpg") or blank(S / f"{id_}-mobile.jpg")
    print(f"BLANK|{id_}|{why}") if why else ok.append(id_)
print("OK", *ok)
