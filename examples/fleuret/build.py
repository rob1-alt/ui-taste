#!/usr/bin/env python3
"""Inline Fleuret's real SVG logos into the page: src/index.html -> index.html"""
import re
from pathlib import Path

HERE = Path(__file__).resolve().parent
A = HERE / "assets"


def svg(name, cls):
    s = re.sub(r"<\?xml[^>]*>", "", (A / name).read_text())
    return s.replace("<svg", f'<svg class="{cls}" aria-hidden="true" focusable="false"', 1)


TOKENS = {
    "{{wordmark}}": svg("logo-wordmark-IVRRRKHc.svg", "wm"),
    "{{stoik}}": svg("stoik-YRtqqMQw.svg", "lg lg-stoik"),
    "{{brevo}}": svg("brevo.svg", "lg lg-brevo"),
}
html = (HERE / "src" / "index.html").read_text()
for k, v in TOKENS.items():
    html = html.replace(k, v)
(HERE / "index.html").write_text(html)
print("index.html")
