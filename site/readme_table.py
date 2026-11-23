#!/usr/bin/env python3
"""
Rewrite the library table and the total line in README.md from index.json,
so the README never drifts from the library:

    python3 site/readme_table.py
"""

from __future__ import annotations

import json
import re
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
INDEX = ROOT / "skills" / "ui-taste" / "library" / "index.json"
README = ROOT / "README.md"

ORDER = ["landing", "pricing", "dashboard", "app", "status", "design-system", "404", "about", "careers",
         "contact", "integrations", "developers", "brand", "auth", "product", "changelog", "docs", "customers", "blog"]
LABEL = {"app": "app screen", "status": "status page", "design-system": "design system", "404": "404 page"}


def main() -> None:
    items = [it for it in json.loads(INDEX.read_text()) if it.get("source") not in ("user-reference", "worked-example")]
    by_type: dict[str, list] = defaultdict(list)
    for it in items:
        by_type[it["type"]].append(it)
    types = [t for t in ORDER if t in by_type] + sorted(t for t in by_type if t not in ORDER)
    rows = ["| Page type | Screens | Sites |", "|---|---|---|"]
    for t in types:
        sites = sorted({it["site"] for it in by_type[t]}, key=str.lower)
        rows.append(f"| {LABEL.get(t, t)} | {len(by_type[t])} | {', '.join(sites)} |")
    n_sites = len({it["site"] for it in items})
    total = (f"**{len(items)} pages from {n_sites} sites and design systems, "
             f"each captured on desktop and mobile ({len(items) * 2} screenshots).**")

    text = README.read_text()
    text = re.sub(r"\| Page type \| Screens \| Sites \|\n(?:\|.*\|\n)+", "\n".join(rows) + "\n", text, count=1)
    text = re.sub(r"\*\*\d+ pages from \d+ sites and design systems[^\n]*\*\*", total, text, count=1)
    # one image line per landing contact sheet in docs/
    sheets = sorted(ROOT.glob("docs/landing-*.jpg"), key=lambda q: int(q.stem.split("-")[1]))
    block = "\n\n".join(f"![landing pages {q.stem.split('-')[1]}](docs/{q.name})" for q in sheets)
    text = re.sub(r"!\[landing pages 1\]\(docs/landing-1\.jpg\)(?:\n\n!\[landing pages \d+\]\(docs/landing-\d+\.jpg\))*", block, text, count=1)
    README.write_text(text)
    print(total)


if __name__ == "__main__":
    main()
