#!/usr/bin/env python3
"""
Measure the specimens shown in the landing's "Measured, not guessed" section, on the live pages.

For each page: open it at 1440x1000, screenshot the first screen, then read from the browser where the
headline, the main button and a paragraph of body text actually are, and their computed styles. The
landing draws its marks from these boxes, so every label sits on the element it describes.

    .venv/bin/python web/scripts/measure_specimens.py            (from the repo root)

Writes site/demo/specimens/<id>.jpg and site/demo/specimens/specimens.json.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

from PIL import Image
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "site" / "demo" / "specimens"
W, H = 1440, 1000

PAGES = [
    ("mercury-landing", "Mercury", "https://mercury.com", "#e9e6df"),
    ("dia-landing", "Dia", "https://www.diabrowser.com", "#f3e6b5"),
    ("granola-landing", "Granola", "https://www.granola.ai", "#e7ebdc"),
    ("superhuman-landing", "Superhuman", "https://superhuman.com", "#dfe3f3"),
    ("resend-landing", "Resend", "https://resend.com", "#1a1a1a"),
]

# runs in the page: finds the headline, the main button and a body paragraph in the first screen
PROBE = r"""
() => {
  const W = innerWidth, H = innerHeight;
  const vis = (el) => {
    const r = el.getBoundingClientRect(), cs = getComputedStyle(el);
    return r.width > 4 && r.height > 4 && r.top < H && r.bottom > 0 && r.left < W && r.right > 0
      && cs.visibility !== "hidden" && cs.display !== "none" && parseFloat(cs.opacity) > 0.05;
  };
  const textBox = (el) => {           // the box of the text itself, not of a wide block
    const range = document.createRange(); range.selectNodeContents(el);
    const rs = [...range.getClientRects()].filter((r) => r.width > 1 && r.height > 1);
    if (!rs.length) return el.getBoundingClientRect();
    const l = Math.min(...rs.map((r) => r.left)), t = Math.min(...rs.map((r) => r.top));
    const rr = Math.max(...rs.map((r) => r.right)), b = Math.max(...rs.map((r) => r.bottom));
    return { left: l, top: t, width: rr - l, height: b - t };
  };
  const fam = (cs) => cs.fontFamily.split(",")[0].replace(/["']/g, "").trim();
  const box = (r) => [r.left, r.top, r.width, r.height].map((v) => Math.round(v));

  // headline: the h1 in view, else the largest text in the top half
  let h = [...document.querySelectorAll("h1")].filter(vis)[0];
  if (!h || parseFloat(getComputedStyle(h).fontSize) < 24) {
    h = [...document.querySelectorAll("h1,h2,p,div,span")].filter((e) => vis(e) && e.childElementCount < 4 && (e.innerText || "").trim().length > 6)
      .sort((a, b) => parseFloat(getComputedStyle(b).fontSize) - parseFloat(getComputedStyle(a).fontSize))[0];
  }
  const hcs = getComputedStyle(h), hfs = parseFloat(hcs.fontSize);
  const head = { box: box(textBox(h)), font: fam(hcs), size: Math.round(hfs), lh: hcs.lineHeight === "normal" ? "normal" : +(parseFloat(hcs.lineHeight) / hfs).toFixed(2),
    weight: hcs.fontWeight, ls: hcs.letterSpacing, color: hcs.color, text: (h.innerText || "").trim().slice(0, 80) };

  // main button: a filled, button-sized box (the fill may sit on the link or on a span inside it), closest below the headline
  const hb = h.getBoundingClientRect();
  const filled = (cs) => { const m = cs.backgroundColor.match(/[\d.]+/g); return (m && (m.length < 4 || +m[3] > 0.5)) || /gradient/.test(cs.backgroundImage); };
  const seen = new Set(), btns = [];
  for (const e of document.querySelectorAll("a,button,[role=button],a *,button *")) {
    if (!vis(e)) continue;
    const r = e.getBoundingClientRect(), cs = getComputedStyle(e);
    if (!(r.height >= 28 && r.height <= 72 && r.width >= 60 && r.width <= 560 && filled(cs))) continue;
    const host = e.closest("a,button,[role=button]") || e;
    if (seen.has(host) || !(host.innerText || "").trim() || host.closest("nav,header")) continue;
    seen.add(host); btns.push([host, e]);
  }
  const score = ([host]) => { const r = host.getBoundingClientRect(); const below = r.top >= hb.top - 10 ? 0 : 600; return Math.abs(r.top - hb.bottom) + Math.abs((r.left + r.width / 2) - (hb.left + hb.width / 2)) * 0.3 + below; };
  const pick = btns.sort((a, c) => score(a) - score(c))[0];
  let btn = null;
  if (pick) {
    const [host, face] = pick, cs = getComputedStyle(face), r = face.getBoundingClientRect(), tcs = getComputedStyle(host);
    btn = { box: box(r), label: (host.innerText || "").trim().split("\n")[0].slice(0, 40), h: Math.round(r.height), radius: cs.borderTopLeftRadius,
      bg: cs.backgroundColor, color: tcs.color, font: fam(tcs), size: Math.round(parseFloat(tcs.fontSize)), weight: tcs.fontWeight, px: cs.paddingLeft };
  }

  // body: the paragraph-sized text right under the headline, overlapping it horizontally (not text inside a product shot)
  const ps = [...document.querySelectorAll("p,div,span,h2")].filter((e) => {
    if (!vis(e) || e.childElementCount > 3) return false;
    const t = (e.innerText || "").trim(), cs = getComputedStyle(e), fs = parseFloat(cs.fontSize);
    const r = e.getBoundingClientRect();
    const overlap = Math.min(r.right, hb.right) - Math.max(r.left, hb.left);
    return t.length > 20 && t.length < 400 && fs >= 13 && fs <= 26 && fs < hfs * 0.7 && r.top >= hb.bottom - 6 && r.top < hb.bottom + 260
      && overlap > Math.min(r.width, hb.width) * 0.5 && r.width < 900 && !e.closest("a,button,nav,header");
  }).sort((a, c) => a.getBoundingClientRect().top - c.getBoundingClientRect().top);
  let body = null;
  if (ps[0]) {
    const cs = getComputedStyle(ps[0]), fs = parseFloat(cs.fontSize);
    body = { box: box(textBox(ps[0])), font: fam(cs), size: Math.round(fs), lh: cs.lineHeight === "normal" ? "normal" : +(parseFloat(cs.lineHeight) / fs).toFixed(2), weight: cs.fontWeight, color: cs.color };
  }

  // background: the first opaque background behind the headline
  let bg = null;
  for (let e = h; e; e = e.parentElement) { const cs = getComputedStyle(e); if (filled(cs) && cs.backgroundColor !== "rgba(0, 0, 0, 0)") { bg = cs.backgroundColor; break; } }
  return { head, btn, body, bg: bg || getComputedStyle(document.body).backgroundColor };
}
"""

DISMISS = ["Accept non-essential cookies", "Reject non-essential cookies", "Accept all", "Accept All", "Accept", "I agree", "Agree", "Got it", "OK", "Allow all", "Accept cookies", "Close"]


def hexc(c: str | None) -> str | None:
    if not c:
        return c
    m = re.findall(r"[\d.]+", c)
    if len(m) < 3:
        return c
    return "#" + "".join(f"{round(float(v)):02x}" for v in m[:3])


def clean_font(f: str) -> str:
    return re.sub(r"^__|_[0-9a-f]{5,}$|_Fallback.*$| Fallback$", "", f).replace("-", " ").strip()


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    out = []
    only = set(sys.argv[1:])
    with sync_playwright() as p:
        b = p.chromium.launch()
        for pid, site, url, stage in PAGES:
            if only and pid not in only:
                continue
            ctx = b.new_context(viewport={"width": W, "height": H}, device_scale_factor=1, locale="en-US",
                                user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36")
            pg = ctx.new_page()
            try:
                pg.goto(url, wait_until="domcontentloaded", timeout=45000)
                pg.wait_for_timeout(4500)
                done = False
                for label in DISMISS:
                    for loc in (pg.get_by_role("button", name=label, exact=True), pg.get_by_text(label, exact=True)):
                        try:
                            if loc.count() and loc.first.is_visible():
                                loc.first.click(timeout=1500); pg.wait_for_timeout(800); done = True; break
                        except Exception:
                            pass
                    if done:
                        break
                # whatever banner is left: hide cookie and consent layers before measuring and shooting
                pg.add_style_tag(content="""
                  [id*=cookie i],[class*=cookie i],[id*=consent i],[class*=consent i],[aria-label*=cookie i],
                  #onetrust-banner-sdk,#onetrust-consent-sdk,.osano-cm-window,#CybotCookiebotDialog,[data-testid*=cookie i]
                  { display: none !important; }""")
                pg.evaluate("window.scrollTo(0,0)"); pg.wait_for_timeout(800)
                m = pg.evaluate(PROBE)
                shot = OUT / f"{pid}.png"
                pg.screenshot(path=str(shot))
            except Exception as e:
                print(f"FAIL {pid}: {str(e).splitlines()[0][:140]}")
                ctx.close(); continue
            ctx.close()
            im = Image.open(shot).convert("RGB").resize((1080, 750), Image.LANCZOS)
            im.save(OUT / f"{pid}.jpg", quality=82, optimize=True, progressive=True)
            shot.unlink()
            pct = lambda bx: [round(bx[0] / W * 100, 2), round(bx[1] / H * 100, 2), round(bx[2] / W * 100, 2), round(bx[3] / H * 100, 2)]
            hd, bt, bd = m["head"], m["btn"], m["body"]
            marks = [{"kind": "head", "box": pct(hd["box"]), "label": f"{clean_font(hd['font'])} {hd['size']}/{hd['lh']} w{hd['weight']}"}]
            if bt:
                rad = bt["radius"]; rad = "pill" if float(re.sub(r"[^\d.e+]", "", rad) or 0) >= bt["h"] / 2 else f"r {rad}"
                marks.append({"kind": "button", "box": pct(bt["box"]), "label": f"{bt['h']}px · {rad} · {hexc(bt['bg'])}"})
            if bd:
                marks.append({"kind": "body", "box": pct(bd["box"]), "label": f"body {bd['size']}/{bd['lh']} · {hexc(bd['color'])}"})
            rec = {"id": pid, "site": site, "url": url, "img": f"/demo/specimens/{pid}.jpg", "stage": stage, "bg": hexc(m["bg"]),
                   "fonts": list(dict.fromkeys([clean_font(hd["font"])] + ([clean_font(bd["font"])] if bd else []) + ([clean_font(bt["font"])] if bt else []))),
                   "head": {**hd, "color": hexc(hd["color"])}, "button": bt and {**bt, "bg": hexc(bt["bg"]), "color": hexc(bt["color"])}, "body": bd and {**bd, "color": hexc(bd["color"])},
                   "marks": marks}
            out.append(rec)
            print(f"ok   {pid}: head {hd['box']} {marks[0]['label']} | button {bt and bt['box']} {bt and bt['label']!r} | body {bd and bd['box']}")
        b.close()
    path = OUT / "specimens.json"
    old = {x["id"]: x for x in json.loads(path.read_text())} if path.exists() and only else {}
    for r in out:
        old[r["id"]] = r
    order = [p[0] for p in PAGES]
    path.write_text(json.dumps(sorted(old.values(), key=lambda r: order.index(r["id"])), indent=1, ensure_ascii=False))
    print(f"wrote {path}")


if __name__ == "__main__":
    main()
