#!/usr/bin/env python3
"""Inline the real SVG logos into the concept pages: src/*.html -> *.html"""
import re
from pathlib import Path

HERE = Path(__file__).resolve().parent
A = HERE.parent / "assets"


def svg(name, cls):
    s = (A / name).read_text()
    s = re.sub(r"<\?xml[^>]*>", "", s)
    return s.replace("<svg", f'<svg class="{cls}" aria-hidden="true"', 1)


TOKENS = {
    "{{wordmark}}": svg("logo-wordmark-IVRRRKHc.svg", "wm"),
    "{{mark}}": svg("mark.svg", "mk"),
    "{{stoik}}": svg("stoik-YRtqqMQw.svg", "lg lg-stoik"),
    "{{brevo}}": svg("brevo.svg", "lg lg-brevo"),
}
for src in sorted((HERE / "src").glob("*.html")):
    html = src.read_text()
    for k, v in TOKENS.items():
        html = html.replace(k, v)
    (HERE / src.name).write_text(html)
    print(src.name)
