#!/usr/bin/env python3
"""
Render what you built, so you can look at it: a local HTML file or a URL, at desktop (1440) and mobile (390),
and optionally side by side with a library reference at the same scale.

    python3 shot.py index.html --ref linear-landing     # review.png: your fold | the reference's fold, then
                                                        # your whole page at 1440 and at 390
    python3 shot.py http://localhost:3000/pricing --out shots

Open review.png with the Read tool: one image holds everything to review. The side-by-side is the honest test: if a designer had to pick one of the
two folds, would they pick yours? If not, say what the reference does that yours does not (scale, contrast,
one bold decision, real material) and change the page, then shoot again.

Needs Playwright:  pip install playwright pillow && python3 -m playwright install chromium
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
LIB = HERE.parent / "library"


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("target", help="an HTML file or a URL")
    ap.add_argument("--out", default=".", help="folder for the PNGs (default: here)")
    ap.add_argument("--ref", help="a library id (from find_refs.py) to set beside your fold")
    ap.add_argument("--wait", type=int, default=900, help="ms to wait after load, for fonts and motion")
    a = ap.parse_args()

    try:
        from playwright.sync_api import sync_playwright
        from PIL import Image
    except ImportError:
        sys.exit("Playwright or Pillow is missing. Install them, then run this again:\n"
                 "  pip install playwright pillow && python3 -m playwright install chromium\n"
                 "Do not skip the review: a page nobody looked at is not reviewed.")

    t = a.target
    url = t if "://" in t else Path(t).resolve().as_uri()
    out = Path(a.out); out.mkdir(parents=True, exist_ok=True)
    notes = []
    with sync_playwright() as p:
        b = p.chromium.launch()
        for name, w, h, mobile in (("desktop", 1440, 900, False), ("mobile", 390, 844, True)):
            ctx = b.new_context(viewport={"width": w, "height": h}, device_scale_factor=1,
                                is_mobile=mobile, has_touch=mobile, reduced_motion="no-preference")
            pg = ctx.new_page()
            errors = []
            pg.on("pageerror", lambda e: errors.append(str(e)))
            pg.goto(url, wait_until="networkidle", timeout=45000)
            pg.wait_for_timeout(a.wait)
            pg.screenshot(path=str(out / f"shot-{name}.png"))
            pg.screenshot(path=str(out / f"shot-{name}-full.png"), full_page=True)
            over = pg.evaluate("document.documentElement.scrollWidth - innerWidth")
            if over > 1:
                notes.append(f"{name}: the page scrolls sideways by {over}px")
            notes += [f"{name}: script error: {e[:160]}" for e in errors]
            ctx.close()
        b.close()

    # one image to open: your fold beside the reference's (or your mobile fold), then both whole pages
    W, H = 1200, 750
    mine = Image.open(out / "shot-desktop.png").convert("RGB").resize((W, H))
    right, right_label = None, "mobile, first screen"
    if a.ref:
        idx = json.loads((LIB / "index.json").read_text())
        it = next((x for x in idx if x.get("id") == a.ref), None)
        if not it:
            notes.append(f"no library screen with id {a.ref}")
        else:
            ref = Image.open(LIB / it["screens"]["desktop"]["file"]).convert("RGB")
            right = ref.crop((0, 0, ref.width, min(ref.height, round(ref.width * H / W)))).resize((W, H))
            right_label = f"reference: {it.get('site')} ({a.ref})"
    if right is None:
        mob = Image.open(out / "shot-mobile.png").convert("RGB")
        right = Image.new("RGB", (W, H), "white")
        mob = mob.resize((round(mob.width * H / mob.height), H)); right.paste(mob, ((W - mob.width) // 2, 0))
    full_d = Image.open(out / "shot-desktop-full.png").convert("RGB")
    full_m = Image.open(out / "shot-mobile-full.png").convert("RGB")
    DW, MW = 1500, 520
    full_d = full_d.resize((DW, round(full_d.height * DW / full_d.width)))
    full_m = full_m.resize((MW, round(full_m.height * MW / full_m.width)))
    cap = 4200  # very long pages are cut; the files shot-*-full.png keep everything
    full_d, full_m = full_d.crop((0, 0, DW, min(cap, full_d.height))), full_m.crop((0, 0, MW, min(cap, full_m.height)))
    pad, lab = 24, 30
    Wt = W * 2 + pad * 3
    Ht = lab + H + pad + lab + max(full_d.height, full_m.height) + pad
    sheet = Image.new("RGB", (Wt, Ht), (236, 236, 236))
    from PIL import ImageDraw
    d = ImageDraw.Draw(sheet)
    d.text((pad, 8), "yours, desktop first screen (1440)", fill="black"); d.text((pad * 2 + W, 8), right_label, fill="black")
    sheet.paste(mine, (pad, lab)); sheet.paste(right, (pad * 2 + W, lab))
    y = lab + H + pad
    d.text((pad, y + 8), "yours, whole page at 1440", fill="black"); d.text((pad * 2 + DW, y + 8), "yours, whole page at 390", fill="black")
    sheet.paste(full_d, (pad, y + lab)); sheet.paste(full_m, (pad * 2 + DW, y + lab))
    review = out / "review.png"
    sheet.save(review)

    for n in notes:
        print(f"! {n}")
    print(f"review: {review.resolve()}")
    print("Open review.png (one Read) and review it against references/anti-slop.md. "
          "The full-size files shot-desktop.png, shot-mobile.png and shot-*-full.png are there if you need a closer look.")


if __name__ == "__main__":
    main()
