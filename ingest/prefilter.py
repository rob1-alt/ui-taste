#!/usr/bin/env python3
"""
Cheap HTTP check before a headless capture: drop the URLs that would only give
a bot wall, an error, a region gate or an empty shell, without starting Chromium.

    python3 ingest/prefilter.py batch.json            -> batch.json rewritten with the survivors,
                                                         rejects appended to ingest/skipped.tsv
    python3 ingest/prefilter.py batch.json --dry-run  -> only print the verdicts

Also skips URLs already in sources.json or skipped.tsv. Runs 16 requests in parallel.
"""

from __future__ import annotations

import json
import re
import sys
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent.parent
SOURCES = ROOT / "skills/ui-taste/scripts/sources.json"
SKIPPED = ROOT / "ingest/skipped.tsv"
UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/131.0 Safari/537.36")

WALLS = [
    (r"cf-chl|challenge-platform|Just a moment\.\.\.|Checking your browser|cf-browser-verification", "bot wall (cloudflare)"),
    (r"Performing security verification|Verify you are human|Confirm you are human", "bot wall"),
    (r"_Incapsula_Resource|incap_ses|perimeterx|px-captcha|captcha-delivery\.com|datadome", "bot wall"),
    (r"Access Denied|You have been blocked|Request blocked|Attention Required", "bot wall"),
    (r"select your (country|region)|choose your (country|region)|age verification|are you (over|of legal) ", "region or age gate"),
]
SALE = r"black friday|cyber monday|sale ends|up to \d+% off"


def norm(url: str) -> str:
    p = urlparse(url if "://" in url else "https://" + url)
    return (p.netloc.lower().removeprefix("www.") + p.path.rstrip("/")).lower()


SHARED_HOSTS = {"github.io", "vercel.app", "netlify.app", "framer.website", "webflow.io", "notion.site",
                "cargo.site", "carrd.co", "substack.com", "medium.com", "co.uk", "com.au", "co.jp", "com.br"}


def domain(url: str) -> str:
    host = urlparse(url if "://" in url else "https://" + url).netloc.lower().removeprefix("www.")
    parts = host.split(".")
    two = ".".join(parts[-2:])
    return ".".join(parts[-3:]) if two in SHARED_HOSTS and len(parts) > 2 else two


def seen() -> set[str]:
    out = {norm(e["url"]) for e in json.loads(SOURCES.read_text()) if e.get("url")}
    if SKIPPED.exists():
        out |= {norm(l.split("\t")[0]) for l in SKIPPED.read_text().splitlines() if l.strip()}
    return out


def check(entry: dict) -> tuple[dict, str | None]:
    url = entry["url"]
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "text/html",
                                               "Accept-Language": "en-US,en;q=0.9"})
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            final, html = r.geturl(), r.read(400_000).decode("utf-8", "replace")
    except urllib.error.HTTPError as e:
        body = e.read(50_000).decode("utf-8", "replace") if e.fp else ""
        if e.code in (403, 429, 503) and re.search("|".join(w for w, _ in WALLS[:4]), body, re.I):
            return entry, "bot wall"
        if e.code in (401, 403, 429):
            return entry, f"blocked (http {e.code})"
        return entry, f"broken (http {e.code})"
    except Exception as e:  # dns, tls, timeout
        return entry, f"broken ({type(e).__name__})"
    for pat, why in WALLS:
        if re.search(pat, html[:60_000], re.I):
            return entry, why
    a, b = urlparse(url).netloc.removeprefix("www."), urlparse(final).netloc.removeprefix("www.")
    if a.split(".")[-2:] != b.split(".")[-2:]:
        return entry, f"redirects off-site ({b})"
    if re.search(r"/(login|signin|sign-in|auth)\b", urlparse(final).path):
        return entry, "login wall"
    if len(re.findall(SALE, html[:200_000], re.I)) >= 3:
        return entry, "sale takeover"
    return entry, None


def main() -> int:
    path, dry = Path(sys.argv[1]), "--dry-run" in sys.argv
    batch, known = json.loads(path.read_text()), seen()
    # same company on another subdomain or path (intl.nothing.tech vs nothing.tech): skip too
    lib_domains = {domain(e["url"]) for e in json.loads(SOURCES.read_text()) if e.get("url")}
    fresh = [e for e in batch if norm(e["url"]) not in known
             and (domain(e["url"]) not in lib_domains or domain(e["url"]) in SHARED_HOSTS)]
    with ThreadPoolExecutor(16) as ex:
        res = list(ex.map(check, fresh))
    keep = [e for e, why in res if not why]
    # Two sites with the same name (Daylight Computer, Daylight solar) must not share an id:
    # the capture would overwrite the library's screens.
    taken = {x["id"] for x in json.loads((ROOT / "skills/ui-taste/library/index.json").read_text())}
    for e in keep:
        sid = e.get("id") or re.sub(r"[^a-z0-9]+", "-", f"{e['site']}-{e['type']}".lower()).strip("-")
        if sid in taken:
            host = urlparse(e["url"]).netloc.removeprefix("www.").split(".")[0]
            e["id"] = re.sub(r"[^a-z0-9]+", "-", f"{e['site']}-{host}-{e['type']}".lower()).strip("-")
            print(f"id    {sid} is taken, using {e['id']}")
        taken.add(e.get("id") or sid)
    drop = [(e, why) for e, why in res if why]
    for e, why in drop:
        print(f"drop  {e['url']}  {why}")
    print(f"{len(batch) - len(fresh)} already seen, {len(drop)} dropped, {len(keep)} to capture")
    if not dry:
        path.write_text(json.dumps(keep, indent=1, ensure_ascii=False) + "\n")
        with SKIPPED.open("a") as f:
            for e, why in drop:
                f.write(f"{e['url']}\t{why} (prefilter)\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
