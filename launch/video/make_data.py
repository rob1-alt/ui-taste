#!/usr/bin/env python3
"""Rebuild public/library.json from the skill's library (run after adding screens)."""
import collections, json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
d = json.loads((ROOT / "skills/ui-taste/library/index.json").read_text())
pages = []
for x in d:
    t = x.get("tokens") or {}
    c = t.get("colors") or {}
    ty = t.get("type") or {}
    pages.append({"site": x["site"], "type": x["type"], "bg": c.get("background") or "#ffffff",
                  "accent": (c.get("surfaces") or ["#111111"])[-1], "font": (t.get("fonts") or ["?"])[0],
                  "h1": (ty.get("h1") or {}).get("size"), "body": (ty.get("body") or {}).get("size")})
stats = {"pages": len(d), "sites": len({x["site"] for x in d}), "shots": sum(len(x.get("screens", {})) for x in d),
         "types": collections.Counter(x["type"] for x in d).most_common()}
(Path(__file__).parent / "public/library.json").write_text(json.dumps({"pages": pages, "stats": stats}))
print(stats["pages"], "pages,", stats["sites"], "sites,", stats["shots"], "screenshots")
