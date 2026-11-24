#!/usr/bin/env python3
"""
Render what you built, so you can look at it: a local HTML file or a URL, at desktop (1440) and mobile (390),
and optionally side by side with a library reference at the same scale.

    python3 shot.py index.html                          # shot-desktop.png, shot-mobile.png, shot-full.png
    python3 shot.py http://localhost:3000/pricing --out shots
    python3 shot.py index.html --ref linear-landing     # also vs-linear-landing.png: your fold | the reference's fold

Open every PNG with the Read tool. The side-by-side is the honest test: if a designer had to pick one of the
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
    made = []
    with sync_playwright() as p:
        b = p.chromium.launch()
        for name, w, h, mobile in (("desktop", 1440, 900, False), ("mobile", 390, 844, True)):
            ctx = b.new_context(viewport={"width": w, "height": h}, device_scale_factor=1 if not mobile else 2,
                                is_mobile=mobile, has_touch=mobile, reduced_motion="no-preference")
            pg = ctx.new_page()
            errors = []
            pg.on("pageerror", lambda e: errors.append(str(e)))
            pg.goto(url, wait_until="networkidle", timeout=45000)
            pg.wait_for_timeout(a.wait)
            pg.screenshot(path=str(out / f"shot-{name}.png"))
            made.append(out / f"shot-{name}.png")
            if not mobile:
                pg.screenshot(path=str(out / "shot-full.png"), full_page=True)
                made.append(out / "shot-full.png")
            over = pg.evaluate("document.documentElement.scrollWidth - innerWidth")
            if over > 1:
                print(f"! {name}: the page scrolls sideways by {over}px")
            for e in errors:
                print(f"! {name}: script error: {e[:160]}")
            ctx.close()
        b.close()

    if a.ref:
        idx = json.loads((LIB / "index.json").read_text())
        it = next((x for x in idx if x.get("id") == a.ref), None)
        if not it:
            print(f"! no library screen with id {a.ref}")
        else:
            ref = Image.open(LIB / it["screens"]["desktop"]["file"]).convert("RGB")
            ref = ref.crop((0, 0, ref.width, min(ref.height, round(ref.width * 900 / 1440))))
            mine = Image.open(out / "shot-desktop.png").convert("RGB")
            W = 1200; H = round(W * 900 / 1440)
            ref = ref.resize((W, H)); mine = mine.resize((W, H))
            pair = Image.new("RGB", (W * 2 + 24, H), "white")
            pair.paste(mine, (0, 0)); pair.paste(ref, (W + 24, 0))
            path = out / f"vs-{a.ref}.png"
            pair.save(path)
            made.append(path)
            print(f"left: yours. right: {it.get('site')} ({a.ref})")

    for m in made:
        print(f"wrote {m}")
    print("Now open them with the Read tool and review against references/anti-slop.md.")


if __name__ == "__main__":
    main()
