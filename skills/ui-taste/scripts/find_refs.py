#!/usr/bin/env python3
"""
Find UI references in the ui-taste library.

    python3 find_refs.py "pricing page with comparison table"
    python3 find_refs.py "dark hero" --platform mobile --limit 2
    python3 find_refs.py --list            # what the library covers

Prints up to --limit screens (3 by default), best match first, each with the
absolute path of its screenshots (open them with the Read tool to see them),
the design tokens measured on the live page, and why it is in the library.
When nothing matches well, the closest screens are labelled as such.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from collections import Counter
from pathlib import Path

LIBRARY = Path(__file__).resolve().parent.parent / "library"
INDEX = LIBRARY / "index.json"

# Words people use for a page type, mapped to the library's types.
SYNONYMS = {
    "landing": ["landing", "home", "homepage", "hero", "marketing", "above the fold", "website", "site"],
    "pricing": ["pricing", "price", "plans", "plan", "tiers", "billing", "checkout", "upgrade"],
    "changelog": ["changelog", "release notes", "releases", "updates", "what's new", "whats new"],
    "docs": ["docs", "documentation", "api reference", "guide", "developer", "reference", "sidebar"],
    "dashboard": ["dashboard", "admin", "analytics", "app ui", "kpi", "metrics", "saas app", "data table", "charts"],
    "app": ["app screen", "app", "web app", "booking", "scheduling", "calendar", "trading", "exchange", "stock page",
            "music player", "player", "weather", "forecast", "kanban", "board", "roadmap", "leaderboard", "ci", "workflow runs",
            "league table", "standings", "chart page", "data viz", "data visualisation", "data visualization",
            "directory", "listing", "facet filters", "filters sidebar", "search results", "marketplace"],
    "status": ["status page", "status", "uptime", "incident", "incidents"],
    "customers": ["customers", "case study", "case studies", "testimonials", "social proof", "logos", "stories"],
    "blog": ["blog", "articles", "posts", "news", "journal", "editorial"],
    "auth": ["login", "log in", "sign in", "signin", "signup", "sign up", "register", "auth", "onboarding"],
    "about": ["about", "company", "mission", "manifesto", "team page", "our story"],
    "careers": ["careers", "jobs", "hiring", "open roles", "join us", "recruiting"],
    "contact": ["contact", "talk to sales", "contact sales", "demo request", "book a demo", "lead form"],
    "404": ["404", "not found", "error page", "lost page", "missing page"],
    "integrations": ["integrations", "integration", "marketplace", "app store", "apps directory", "extensions", "plugins", "store"],
    "developers": ["developers", "developer page", "api", "sdk", "developer portal", "platform page"],
    "brand": ["brand", "media kit", "press kit", "brand assets", "logo guidelines", "press"],
    "design-system": ["design system", "design-system", "tokens", "design tokens", "style guide", "styleguide",
                      "component library", "ui kit", "guidelines", "foundations", "color scale", "colour scale",
                      "type scale", "typography scale"],
    "product": ["product page", "product detail", "pdp", "e-commerce", "ecommerce", "shop", "buy", "hardware"],
}


def tokens(text: str) -> list[str]:
    return [t for t in re.split(r"[^a-z0-9#.+-]+", text.lower()) if len(t) > 1]


def haystack(item: dict) -> str:
    t = item.get("tokens", {}) or {}
    parts = [
        item["site"], item["type"], " ".join(item.get("tags", [])), item.get("note", ""),
        t.get("title", ""), " ".join(t.get("fonts", []) or []),
        " ".join(SYNONYMS.get(item["type"], [])),
    ]
    return " ".join(parts).lower()


def score(item: dict, query: str) -> float:
    q = query.lower()
    s = 0.0
    for typ, words in SYNONYMS.items():
        if any(w in q for w in words) and item["type"] == typ:
            s += 6
    if item["site"].lower() in q:
        s += 5
    for tag in item.get("tags", []):
        plain = tag.removeprefix("ds-").replace("-", " ")
        if plain in q or tag in q or (plain.endswith("s") and plain[:-1] in q):
            s += 6
    hay = haystack(item)
    for word in set(tokens(q)):
        if word in hay:
            s += 1.5 if len(word) > 3 else 0.5
    # A dark or light request matches the measured background.
    bg = ((item.get("tokens") or {}).get("colors") or {}).get("background", "#ffffff")
    if bg.startswith("#") and len(bg) == 7:
        lum = sum(int(bg[i:i + 2], 16) for i in (1, 3, 5)) / 3
        if "dark" in q and lum < 60:
            s += 3
        if "light" in q and lum > 200:
            s += 1
    return s


def fmt_type(t: dict | None) -> str:
    if not t:
        return "n/a"
    lh = t.get("lineHeight")
    return f"{t['font']} {t['size']}px/{lh} w{t['weight']}" + (
        f" ls {t['letterSpacing']}" if t.get("letterSpacing") not in (None, "normal") else ""
    )


def show(item: dict, platform: str, rank: int, close: bool) -> str:
    t = item.get("tokens") or {}
    c = t.get("colors") or {}
    lines = [
        f"## {rank}. {item['site']} · {item['type']}"
        + "".join(f" ({t[3:]})" for t in item.get("tags", []) if t.startswith("ds-"))
        + ("  (closest match, not exact)" if close else ""),
        f"url: {item['url']}  ·  captured {item.get('captured', '?')}",
    ]
    for name in (["desktop", "mobile"] if platform == "both" else [platform]):
        scr = item.get("screens", {}).get(name)
        if scr:
            lines.append(f"{name}: {(LIBRARY / scr['file']).resolve()}  ({scr['width']}x{scr['height']})")
    if item.get("tags"):
        lines.append("patterns: " + ", ".join(item["tags"]))
    if item.get("note"):
        lines.append("why: " + item["note"])
    if t:
        lines.append("fonts: " + ", ".join(t.get("fonts") or []))
        ty = t.get("type") or {}
        lines.append(f"type: h1 {fmt_type(ty.get('h1'))} · h2 {fmt_type(ty.get('h2'))} · body {fmt_type(ty.get('body'))}")
        lines.append(
            f"colours: bg {c.get('background')} · surfaces {', '.join(c.get('surfaces') or [])} · text {', '.join(c.get('text') or [])}"
        )
        btns = t.get("buttons") or []
        if btns:
            b = btns[0]
            lines.append(
                f"button: \"{b['label']}\" bg {b['bg']} text {b['color']} radius {b['radius']} "
                f"height {b['height']}px padding-x {b['paddingX']}px {b['font']} {b['size']}px w{b['weight']}"
            )
        if t.get("contentWidth"):
            lines.append(f"content max-width: {t['contentWidth']}px")
    return "\n".join(lines)


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("query", nargs="?", default="")
    ap.add_argument("--platform", choices=["desktop", "mobile", "both"], default="desktop")
    ap.add_argument("--limit", type=int, default=3)
    ap.add_argument("--list", action="store_true", help="summarise what the library covers")
    args = ap.parse_args()

    if not INDEX.exists():
        print("Library is empty: run scripts/capture.py first.", file=sys.stderr)
        return 1
    items = json.loads(INDEX.read_text())

    if args.list or not args.query:
        types = Counter(i["type"] for i in items)
        tags = Counter(t for i in items for t in i.get("tags", []))
        print(f"{len(items)} screens from {len({i['site'] for i in items})} sites\n")
        print("types: " + ", ".join(f"{k} ({v})" for k, v in types.most_common()))
        print("patterns: " + ", ".join(f"{k} ({v})" for k, v in tags.most_common()))
        print("sites: " + ", ".join(sorted({i['site'] for i in items})))
        return 0

    ranked = sorted(items, key=lambda i: score(i, args.query), reverse=True)
    best = score(ranked[0], args.query) if ranked else 0
    print(f"query: {args.query}\n")
    for n, item in enumerate(ranked[: args.limit], 1):
        s = score(item, args.query)
        print(show(item, args.platform, n, close=s < 6 or s < best * 0.5))
        print()
    if best < 6:
        print("Nothing in the library answers this exactly: treat the screens above as loose references.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
