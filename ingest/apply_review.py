#!/usr/bin/env python3
"""
Apply a review of freshly captured screens to the library.

    python3 ingest/apply_review.py notes.txt batch.json [batch2.json ...]

notes.txt has one line per kept screen and DROP lines for the rest:

    DROP some-site (blocked), other-site (generic)
    site-slug|tag-a,tag-b|What to learn from it.

Slugs are the capture ids without the "-<type>" suffix (type comes from the
batch entry). Kept screens get their tags and note in index.json and are
appended to scripts/sources.json; dropped screens lose their files and their
URL goes to ingest/skipped.tsv with the reason. Run it only when no capture is
running (index.json is rewritten).
"""

from __future__ import annotations

import fcntl
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKILL = ROOT / "skills" / "ui-taste"
INDEX = SKILL / "library" / "index.json"
SOURCES = SKILL / "scripts" / "sources.json"
SKIPPED = ROOT / "ingest" / "skipped.tsv"


def slug(s: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")


def main() -> None:
    notes, batches = Path(sys.argv[1]), sys.argv[2:]
    entries = {}
    for b in batches:
        for e in json.loads(Path(b).read_text()):
            entries[e.get("id") or slug(f"{e['site']}-{e['type']}")] = e
    by_slug = {slug(e["site"]): i for i, e in entries.items()}

    keep, drop = {}, {}
    for line in notes.read_text().splitlines():
        line = line.strip()
        if line.startswith("DROP"):
            for m in re.finditer(r"([a-z0-9-]+) \(([^)]*)\)", line):
                drop[m.group(1)] = m.group(2)
        elif line.count("|") == 2:
            s, tags, note = line.split("|")
            keep[s] = ([t.strip() for t in tags.split(",") if t.strip()], note.strip())

    def resolve(s):
        return s if s in entries else by_slug.get(s)

    # captures write to a staging index next to the batch file (see capture_parallel.sh)
    staged = {}
    for b in batches:
        st = Path(b[:-5] + "_index.json")
        if st.exists():
            staged |= {x["id"]: x for x in json.loads(st.read_text())}
    lock = open(INDEX.with_suffix(".lock"), "w")
    fcntl.flock(lock, fcntl.LOCK_EX)
    drop_ids = {resolve(s): r for s, r in drop.items() if resolve(s)}
    keep_ids = {resolve(s): v for s, v in keep.items() if resolve(s)}
    idx = json.loads(INDEX.read_text())
    have_ids = {x["id"] for x in idx}
    # only kept screens enter the library; a batch can be reviewed in several passes
    idx += [x for i, x in staged.items() if i not in have_ids and i in keep_ids]
    ids = {x["id"] for x in idx} | set(staged)
    unknown = [s for s in list(keep) + list(drop) if not resolve(s)]
    if unknown:
        sys.exit(f"unknown slugs: {unknown}")
    unreviewed = [i for i in entries if i in ids and i not in keep_ids and i not in drop_ids]

    for i in drop_ids:
        for f in (SKILL / "library" / "screens").glob(f"{i}-*.jpg"):
            f.unlink()
    idx = [x for x in idx if x["id"] not in drop_ids]
    for x in idx:
        if x["id"] in keep_ids:
            x["tags"], x["note"] = keep_ids[x["id"]]
    idx.sort(key=lambda e: (e["type"], e["site"].lower()))
    INDEX.write_text(json.dumps(idx, indent=2, ensure_ascii=False) + "\n")
    lock.close()

    src = json.loads(SOURCES.read_text())
    gone = {entries[i]["url"] for i in drop_ids}  # a screen dropped on a later pass leaves sources too
    src = [e for e in src if e["url"] not in gone]
    have = {e["url"] for e in src}
    for i, (tags, note) in keep_ids.items():
        e = entries[i]
        if e["url"] not in have:
            src.append({"site": e["site"], "type": e["type"], "url": e["url"], "tags": tags, "note": note})
    SOURCES.write_text(json.dumps(src, indent=1, ensure_ascii=False) + "\n")

    skipped = SKIPPED.read_text() if SKIPPED.exists() else ""
    with SKIPPED.open("a") as f:
        for i, r in drop_ids.items():
            if entries[i]["url"] not in skipped:
                f.write(f"{entries[i]['url']}\t{r}\n")

    print(f"kept {len(keep_ids)}, dropped {len(drop_ids)}, unreviewed {unreviewed}")


if __name__ == "__main__":
    main()
