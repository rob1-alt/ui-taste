#!/usr/bin/env python3
"""
Contact sheets to review new captures: desktop (top 2200px) + mobile side by side, 4 per sheet.

    .venv/bin/python ingest/review_sheet.py out_prefix id1 id2 ...   -> out_prefix_1.jpg, ...
"""
import sys
from pathlib import Path
from PIL import Image, ImageDraw

Image.MAX_IMAGE_PIXELS = None
S = Path(__file__).resolve().parent.parent / "skills/ui-taste/library/screens"
DW, MW = 560, 180
W, H = DW + MW + 10, int(2200 * DW / 1440) + 30


def sheet(out, ids):
    im = Image.new("RGB", (W * len(ids), H), "white"); d = ImageDraw.Draw(im)
    for i, id_ in enumerate(ids):
        x = i * W
        d.text((x + 4, 8), id_, fill="black")
        try:
            a = Image.open(S / f"{id_}-desktop.jpg").convert("RGB")
            a = a.crop((0, 0, a.width, min(a.height, int(a.width * 2200 / 1440))))
            im.paste(a.resize((DW, int(a.height * DW / a.width))), (x, 30))
            m = Image.open(S / f"{id_}-mobile.jpg").convert("RGB")
            m = m.resize((MW, int(m.height * MW / m.width)))
            im.paste(m.crop((0, 0, MW, H - 30)), (x + DW + 5, 30))
        except Exception as e:
            d.text((x, 40), str(e), fill="red")
    im.save(out, quality=80)


prefix, ids = sys.argv[1], sys.argv[2:]
for n in range(0, len(ids), 4):
    out = f"{prefix}_{n // 4 + 1}.jpg"; sheet(out, ids[n:n + 4]); print(out, *ids[n:n + 4])
