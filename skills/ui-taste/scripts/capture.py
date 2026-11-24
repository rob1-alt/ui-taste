#!/usr/bin/env python3
"""
Capture a page into the ui-taste library: a desktop and a mobile screenshot,
plus the design tokens the page really uses (fonts, type scale, colours,
radii, content width), read from the browser's computed styles.

    python3 capture.py https://linear.app/pricing --site Linear --type pricing \
        --tags "pricing-3-tier,comparison-table" --note "Why it works..."
    python3 capture.py --batch sources.json      # every entry in a sources file

Requires: pip install playwright pillow && python3 -m playwright install chromium

Screens land in ../library/screens/<id>-desktop.jpg and <id>-mobile.jpg and
their entry is added to (or replaced in) ../library/index.json.
"""

from __future__ import annotations

import argparse
import datetime as dt
import io
import json
import os
import re
import sys
from pathlib import Path

from PIL import Image

Image.MAX_IMAGE_PIXELS = None  # long pages at 2x are big but trusted
from playwright.sync_api import Page, sync_playwright

ROOT = Path(__file__).resolve().parent.parent
LIBRARY = ROOT / "library"
SCREENS = LIBRARY / "screens"
LIBRARY_IDS: set = set()
INDEX = Path(os.environ["UI_TASTE_INDEX"]) if os.environ.get("UI_TASTE_INDEX") else LIBRARY / "index.json"
# ingest/capture_parallel.sh sets UI_TASTE_INDEX to a staging index per batch, so a capture can run
# while the previous batch is reviewed; ingest/apply_review.py merges the kept screens.

DESKTOP = {"width": 1440, "height": 900}
MOBILE = {"width": 390, "height": 844}
# Long pages are cut: the top folds carry the decisions worth copying, and
# the library has to stay light enough to live in git.
MAX_DESKTOP_HEIGHT = 3600
MAX_MOBILE_HEIGHT = 2600
JPEG_QUALITY = 72

# Cookie and consent banners hide the page. Refuse first (privacy-preserving),
# then hide whatever is left.
REFUSE_LABELS = [
    "Reject all", "Reject All", "Decline", "Decline all", "Refuse all",
    "Only necessary", "Necessary only", "Reject", "Deny", "Tout refuser",
    "Refuser", "Continuer sans accepter", "Opt out of all", "Reject non-essential",
    "Accept only essential", "Essential only", "Only essential cookies", "Reject all cookies",
    "Rejeter tout", "Reject All, Except Strictly Necessary", "Accept All Except Strictly Necessary",
]
HIDE_CSS = """
[id*="cookie" i], [class*="cookie" i], [id*="consent" i], [class*="consent" i],
[id*="onetrust" i], [class*="onetrust" i], #CybotCookiebotDialog, .cky-consent-container,
[aria-label*="cookie" i], [id*="intercom" i], [class*="intercom" i],
iframe[title*="chat" i], [id*="hubspot-messages" i], .crisp-client, #crisp-chatbox,
[class*="announcement-bar" i] { display: none !important; visibility: hidden !important; }
html, body { scroll-behavior: auto !important; }
"""

# Read in the page: what the design really uses, not what a theme claims.
TOKENS_JS = r"""
() => {
  const px = v => Math.round(parseFloat(v) || 0);
  const vis = el => {
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none';
  };
  const family = f => f.split(',')[0].replace(/["']/g, '').trim();
  const pick = sel => {
    const el = [...document.querySelectorAll(sel)].find(vis);
    if (!el) return null;
    const s = getComputedStyle(el);
    return {
      font: family(s.fontFamily), size: px(s.fontSize), weight: s.fontWeight,
      lineHeight: s.lineHeight === 'normal' ? 'normal' : +(parseFloat(s.lineHeight) / parseFloat(s.fontSize)).toFixed(2),
      letterSpacing: s.letterSpacing, color: s.color,
    };
  };
  const toHex = c => {
    const m = c.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const [r, g, b, a = 1] = m[1].split(/[ ,/]+/).filter(Boolean).map(Number);
    if (a < 0.5) return null;
    return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
  };

  // Colours weighted by the area they cover in the first two folds.
  const area = {}, text = {};
  const limit = innerHeight * 2;
  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect();
    if (r.top > limit || r.bottom < 0 || r.width < 2 || r.height < 2) continue;
    const s = getComputedStyle(el);
    const bg = toHex(s.backgroundColor);
    if (bg) area[bg] = (area[bg] || 0) + r.width * Math.min(r.height, limit);
    if (el.childNodes.length && [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) {
      const c = toHex(s.color);
      if (c) text[c] = (text[c] || 0) + (el.textContent || '').trim().length;
    }
  }
  const bodyBg = toHex(getComputedStyle(document.body).backgroundColor)
    || toHex(getComputedStyle(document.documentElement).backgroundColor) || '#ffffff';
  const top = (o, n) => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, n).map(e => e[0]);

  // Buttons: radius and fill of the visible call-to-actions.
  const buttons = [...document.querySelectorAll('a, button')].filter(el => {
    if (!vis(el)) return false;
    const r = el.getBoundingClientRect();
    if (r.top > limit) return false;
    const s = getComputedStyle(el);
    if (/skip to|cookie|accept|reject/i.test(el.innerText || '')) return false;
    return toHex(s.backgroundColor) && r.height >= 28 && r.height <= 72 && r.width <= 360;
  }).slice(0, 6).map(el => {
    const s = getComputedStyle(el);
    return {
      label: (el.innerText || '').trim().slice(0, 40), bg: toHex(s.backgroundColor), color: toHex(s.color),
      radius: s.borderRadius, height: Math.round(el.getBoundingClientRect().height),
      paddingX: px(s.paddingLeft), font: family(s.fontFamily), size: px(s.fontSize), weight: s.fontWeight,
    };
  });

  // Main content width: the widest centred block narrower than the viewport.
  let contentWidth = null;
  for (const el of document.querySelectorAll('main *, section *, div')) {
    const s = getComputedStyle(el);
    if (s.maxWidth && s.maxWidth !== 'none' && s.maxWidth.endsWith('px')) {
      const w = px(s.maxWidth);
      if (w >= 640 && w <= 1600) { contentWidth = Math.max(contentWidth || 0, w); }
    }
  }

  const fonts = {};
  for (const el of document.querySelectorAll('h1,h2,h3,p,a,button,li,span')) {
    if (!vis(el)) continue;
    const f = family(getComputedStyle(el).fontFamily);
    fonts[f] = (fonts[f] || 0) + 1;
  }

  return {
    title: document.title,
    fonts: top(fonts, 3),
    type: { h1: pick('h1'), h2: pick('h2'), h3: pick('h3'), body: pick('main p, p') },
    colors: { background: bodyBg, surfaces: top(area, 5), text: top(text, 4) },
    buttons,
    contentWidth,
  };
}
"""


def slug(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def remove_banners(page: Page) -> None:
    """Whatever banner is left: floating boxes that talk about cookies or consent."""
    page.evaluate(
        """() => {
          for (const el of document.querySelectorAll('body *')) {
            const s = getComputedStyle(el);
            if (s.position !== 'fixed' && s.position !== 'sticky') continue;
            if (el.closest('header, nav')) continue;
            const t = (el.innerText || '').slice(0, 600);
            // An empty full-screen layer is a modal backdrop left behind.
            const r = el.getBoundingClientRect();
            if (!t.trim() && !el.querySelector('img, video, canvas, svg') &&
                r.width >= innerWidth * 0.9 && r.height >= innerHeight * 0.9) { el.remove(); continue; }
            if (/cookie|consent|privacy preferences|tracking technologies|looks like you.re in|choose your (country|region)/i.test(t)) el.remove();
          }
        }"""
    )


def tidy_page(page: Page, max_height: int = 6000) -> None:
    for label in REFUSE_LABELS:
        try:
            btn = page.get_by_role("button", name=label, exact=True)
            if btn.count() and btn.first.is_visible():
                btn.first.click(timeout=1500)
                page.wait_for_timeout(400)
                break
        except Exception:
            pass
    page.add_style_tag(content=HIDE_CSS)
    remove_banners(page)
    # Scroll down and back so lazy images and reveal animations settle.
    page.evaluate(
        """async (maxH) => {
          const step = innerHeight * 0.8;
          for (let y = 0; y < Math.min(document.body.scrollHeight, maxH); y += step) {
            scrollTo(0, y); await new Promise(r => setTimeout(r, 120));
          }
          scrollTo(0, 0);
        }""",
        max_height,  # only what the screenshot keeps (plus one screen for lazy loads)
    )
    page.wait_for_timeout(2500)  # let entrance animations finish
    # Some banners only appear once the visitor scrolls.
    remove_banners(page)


def shoot(page: Page, max_height: int, max_width: int, out: Path) -> tuple[int, int]:
    # Render only the part that is kept: a 12000px page rendered whole, then cropped, cost
    # most of the CPU of a capture on a 2-core machine.
    full_h = page.evaluate("() => Math.max(document.documentElement.scrollHeight, document.body ? document.body.scrollHeight : 0)")
    clip = {"x": 0, "y": 0, "width": max_width, "height": max(1, min(full_h, max_height))}
    png = page.screenshot(full_page=True, clip=clip, animations="disabled")
    img = Image.open(io.BytesIO(png)).convert("RGB")
    # Pages that overflow sideways would otherwise come out wider than the screen.
    if img.height > max_height or img.width > max_width:
        img = img.crop((0, 0, min(img.width, max_width), min(img.height, max_height)))
    out.parent.mkdir(parents=True, exist_ok=True)
    img.save(out, "JPEG", quality=JPEG_QUALITY, optimize=True, progressive=True)
    return img.size


def wait_for_memory(min_mb: int = 700, max_wait_s: int = 600) -> None:
    """Small machines: before each site, wait until enough RAM is free instead of being killed."""
    import time
    waited = 0
    while waited < max_wait_s:
        try:
            info = dict(l.split(":", 1) for l in open("/proc/meminfo"))
            avail = int(info["MemAvailable"].split()[0]) // 1024
        except Exception:
            return
        if avail >= min_mb:
            return
        print(f"wait  only {avail} MB free", flush=True)
        time.sleep(15)
        waited += 15


LAUNCH_ARGS = [
    "--disable-dev-shm-usage", "--disable-gpu", "--disable-extensions",
    "--renderer-process-limit=2", "--js-flags=--max-old-space-size=384",
    "--disable-background-networking", "--disable-features=Translate,MediaRouter",
]
# Analytics, session replay and chat widgets: they keep the network busy (networkidle never
# comes) and the chat bubbles end up on the screenshot. Resolved to nothing, at no cost per request.
BLOCKED_HOSTS = [
    "google-analytics.com", "*.google-analytics.com", "googletagmanager.com", "*.googletagmanager.com",
    "*.doubleclick.net", "connect.facebook.net", "*.hotjar.com", "*.hotjar.io", "*.fullstory.com",
    "*.segment.com", "*.segment.io", "*.mixpanel.com", "*.amplitude.com", "*.heap.io", "*.heapanalytics.com",
    "*.clarity.ms", "*.posthog.com", "*.intercom.io", "*.intercomcdn.com", "widget.intercom.io",
    "*.crisp.chat", "*.drift.com", "*.driftt.com", "js.hs-scripts.com", "js.usemessages.com",
    "js.hs-analytics.net", "*.tawk.to", "*.zdassets.com", "*.zopim.com", "static.ads-twitter.com",
    "snap.licdn.com", "*.tiktok.com", "*.bing.com", "*.reddit.com", "*.linkedin.com", "*.quora.com",
    "*.sentry.io", "*.datadoghq-browser-agent.com", "*.newrelic.com", "*.nr-data.net",
]
LAUNCH_ARGS.append("--host-resolver-rules=" + ", ".join(f"MAP {h} ~NOTFOUND" for h in BLOCKED_HOSTS))
SITE_TIMEOUT_S = 120  # a page whose scripts lock the renderer can hang a capture for good


class SiteTimeout(Exception):
    pass


def _on_alarm(signum, frame):
    raise SiteTimeout(f"over {SITE_TIMEOUT_S}s")


def kill_browsers() -> None:
    """Kill the headless Chrome processes started by this capture (not other shards')."""
    import os, signal as sig
    me, children = os.getpid(), {}
    for d in os.listdir("/proc"):
        if d.isdigit():
            try:
                ppid = int(open(f"/proc/{d}/stat").read().rsplit(")", 1)[1].split()[1])
                children.setdefault(ppid, []).append(int(d))
            except Exception:
                pass
    todo, mine = [me], []
    while todo:
        for c in children.get(todo.pop(), []):
            mine.append(c); todo.append(c)
    for pid in mine:
        try:
            if "chrome" in open(f"/proc/{pid}/cmdline").read():
                os.kill(pid, sig.SIGKILL)
        except Exception:
            pass


RESTART_EVERY = 8  # a long-lived browser keeps growing; a fresh one every few sites stays small


def capture(entry: dict, browser) -> dict:
    url = entry["url"]
    site = entry["site"]
    page_type = entry["type"]
    sid = entry.get("id") or slug(f"{site}-{page_type}")
    result = {
        "id": sid,
        "site": site,
        "url": url,
        "type": page_type,
        "tags": entry.get("tags", []),
        "note": entry.get("note", ""),
        "captured": dt.date.today().isoformat(),
        "screens": {},
    }
    for name, viewport, max_h, mobile in (
        ("desktop", DESKTOP, MAX_DESKTOP_HEIGHT, False),
        ("mobile", MOBILE, MAX_MOBILE_HEIGHT, True),
    ):
        ctx = browser.new_context(
            viewport=viewport,
            device_scale_factor=1,  # mobile was shot at 2x then halved: same stored size, 4x the memory
            is_mobile=mobile,
            has_touch=mobile,
            locale="en-US",
            color_scheme="light",
            # Some sites (Stripe docs) forbid injected styles; the banner-hiding CSS needs them.
            bypass_csp=True,
            user_agent=None if not mobile else (
                "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 "
                "(KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1"
            ),
        )
        page = ctx.new_page()
        try:
            page.goto(url, wait_until="domcontentloaded", timeout=45000)
            try:
                page.wait_for_load_state("load", timeout=15000)
                page.wait_for_load_state("networkidle", timeout=6000)
            except Exception:
                pass
            tidy_page(page, max_h + viewport["height"])
            if name == "desktop":
                result["tokens"] = page.evaluate(TOKENS_JS)
            file = SCREENS / f"{sid}-{name}.jpg"
            w, h = shoot(page, max_h, viewport["width"], file)
            result["screens"][name] = {"file": f"screens/{file.name}", "width": w, "height": h}
        finally:
            ctx.close()
    return result


def load_index() -> list[dict]:
    if INDEX.exists():
        return json.loads(INDEX.read_text())
    return []


def save_item(item: dict) -> None:
    """Merge one screen into the index under a lock, so parallel runs can share it."""
    import fcntl

    INDEX.parent.mkdir(parents=True, exist_ok=True)
    with open(INDEX.with_suffix(".lock"), "w") as lock:
        fcntl.flock(lock, fcntl.LOCK_EX)
        items = {e["id"]: e for e in load_index()}
        items[item["id"]] = item
        ordered = sorted(items.values(), key=lambda e: (e["type"], e["site"].lower()))
        INDEX.write_text(json.dumps(ordered, indent=2, ensure_ascii=False) + "\n")


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("url", nargs="?")
    ap.add_argument("--site")
    ap.add_argument("--type", help="landing, pricing, docs, changelog, blog, auth, about, careers, product, customers…")
    ap.add_argument("--tags", default="", help="comma-separated patterns, e.g. bento-grid,logo-cloud")
    ap.add_argument("--note", default="", help="what is worth learning from this screen")
    ap.add_argument("--id")
    ap.add_argument("--batch", help="JSON list of {url, site, type, tags, note}")
    ap.add_argument("--only", help="with --batch: comma-separated ids to (re)capture")
    args = ap.parse_args()

    if args.batch:
        entries = json.loads(Path(args.batch).read_text())
        if args.only:
            wanted = set(args.only.split(","))
            entries = [e for e in entries if (e.get("id") or slug(f"{e['site']}-{e['type']}")) in wanted]
    elif args.url and args.site and args.type:
        entries = [{
            "url": args.url, "site": args.site, "type": args.type, "id": args.id,
            "tags": [t.strip() for t in args.tags.split(",") if t.strip()], "note": args.note,
        }]
    else:
        ap.error("give a url with --site and --type, or --batch")

    failed = []
    global LIBRARY_IDS
    LIBRARY_IDS = {x["id"] for x in json.loads((LIBRARY / "index.json").read_text())} if (LIBRARY / "index.json").exists() else set()
    with sync_playwright() as p:
        browser = p.chromium.launch(args=LAUNCH_ARGS)
        for n, entry in enumerate(entries):
            if n and n % RESTART_EVERY == 0:
                browser.close()
                browser = p.chromium.launch(args=LAUNCH_ARGS)
            wait_for_memory()
            label = entry.get("id") or entry["url"]
            sid = entry.get("id") or slug(f"{entry['site']}-{entry['type']}")
            if INDEX != LIBRARY / "index.json" and sid in LIBRARY_IDS:
                failed.append(label)
                print(f"FAIL  {label}: id {sid} is already in the library, give the entry its own id", file=sys.stderr, flush=True)
                continue
            import signal
            signal.signal(signal.SIGALRM, _on_alarm)
            signal.alarm(SITE_TIMEOUT_S)
            try:
                item = capture(entry, browser)
                signal.alarm(0)
                save_item(item)
                print(f"ok    {item['id']}", flush=True)
            except SiteTimeout as exc:
                signal.alarm(0)
                failed.append(label)
                print(f"FAIL  {label}: {exc}, browser killed", file=sys.stderr, flush=True)
                kill_browsers()
                browser = p.chromium.launch(args=LAUNCH_ARGS)
            except Exception as exc:  # one bad site must not stop the batch
                signal.alarm(0)
                failed.append(label)
                print(f"FAIL  {label}: {str(exc).splitlines()[0][:160]}", file=sys.stderr, flush=True)
        browser.close()
    print(f"{len(entries) - len(failed)} captured, {len(failed)} failed")
    return 1 if failed and len(failed) == len(entries) else 0


if __name__ == "__main__":
    sys.exit(main())
