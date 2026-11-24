#!/usr/bin/env python3
"""
Everything you need before building a screen, in one call: the rules for that kind of page, the review
checklist, and the closest references from the library as one image.

    python3 start.py landing "invoicing app for freelancers, one worked example"
    python3 start.py pricing "three plans, free tier, FAQ"
    python3 start.py dashboard "invoices, late clients, reminders"
    python3 start.py other "settings page with billing"

Then open the printed sheet (one Read), decide, and build. Do not open the reference files one by one:
what they say for this kind of page is printed here.
"""
from __future__ import annotations

import re
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
REF = HERE.parent / "references"

MARKETING = {"landing", "pricing", "about", "careers", "product", "contact", "brand", "customers", "integrations"}


def section(path: Path, *titles: str) -> str:
    """The sections of a markdown file whose heading starts with one of the titles."""
    text = path.read_text()
    parts = re.split(r"(?m)^(?=#{2,3} )", text)
    keep = [p for p in parts if any(p.lstrip("#").strip().startswith(t) for t in titles)]
    return "\n".join(k.rstrip() + "\n" for k in keep)


def main() -> None:
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    kind, query = sys.argv[1].lower(), " ".join(sys.argv[2:])
    out = []
    out.append(f"# ui taste, start: {kind}\n")
    out.append(f"Skill folder: {HERE.parent}  (scripts: {HERE})\n")

    if kind == "landing":
        out.append((REF / "landing-concepts.md").read_text())
        out.append(section(REF / "backgrounds.md", "") if (REF / "backgrounds.md").exists() else "")
    elif kind in MARKETING:
        out.append(
            "## A marketing page gets a concept too\n\n"
            "A pricing, about or product page is marketing: it needs the same one bet and one signature move as a "
            "landing, taken from the product's own world (an invoicing tool's plans can be invoices; a calendar's "
            "can be weeks). Three identical cards with the middle one dark is the default to beat. Keep the facts "
            "scannable: the price is the largest element, the plan names are plain, the comparison is a real table.\n"
        )
        out.append(section(REF / "landing-concepts.md", "3. Give it a signature move"))
        out.append(section(REF / "taste-rules.md", "12.", "11."))
    else:
        out.append(section(REF / "taste-rules.md", "6.", "4.", "3.", "7."))

    out.append(section(REF / "taste-rules.md", "4. Type", "1. One idea") if kind in MARKETING else "")
    out.append((REF / "anti-slop.md").read_text())
    print("\n".join(x for x in out if x))

    sheet = Path.cwd() / "refs.png"
    q = query if kind == "other" else f"{kind} {query}"
    print("\n# References from the library\n")
    r = subprocess.run([sys.executable, str(HERE / "find_refs.py"), q, "--limit", "3", "--sheet", str(sheet)],
                       capture_output=True, text=True)
    print(r.stdout.strip() or r.stderr.strip())
    print(
        "\n# Next\n"
        f"1. Open {sheet} (one Read). Write one line per reference on what it does that a default page does not.\n"
        "2. Decide the concept and the signature move, then write the whole page in one Write.\n"
        f"3. python3 {HERE / 'shot.py'} <your page> --ref <the reference id you leaned on>, open review.png, "
        "fix everything it shows in one pass, shoot once more. Two rounds are usually enough."
    )


if __name__ == "__main__":
    main()
