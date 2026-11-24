#!/bin/bash
# Commit a reviewed batch without picking up the next batch's captures, which may be
# landing in library/screens/ at the same time (they are not in index.json yet).
#   ingest/commit_batch.sh "library: <n> landing pages (batch N: ...), <what the skill learned>"
set -e
cd "$(dirname "$0")/.."
git add -u
git add ingest site skills/ui-taste/references skills/ui-taste/scripts skills/ui-taste/SKILL.md README.md docs 2>/dev/null || true
python3 - <<'PY' | xargs -r git add --
import json, pathlib
idx = json.loads(pathlib.Path("skills/ui-taste/library/index.json").read_text())
for x in idx:
    for f in pathlib.Path("skills/ui-taste/library/screens").glob(f"{x['id']}-*.jpg"):
        print(f)
PY
git commit -q -m "$1

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
git log --oneline -1
