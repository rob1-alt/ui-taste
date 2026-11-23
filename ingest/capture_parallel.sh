#!/bin/bash
# Capture a batch file in 4 parallel shards (index.json writes are locked).
#   ingest/capture_parallel.sh batch.json        -> logs next to the batch file
set -e
BATCH=$(realpath "$1"); DIR=$(dirname "$BATCH"); BASE=$(basename "$BATCH" .json)
ROOT=$(cd "$(dirname "$0")/.." && pwd)
python3 - "$BATCH" <<'PY'
import json,sys
b=json.load(open(sys.argv[1])); base=sys.argv[1][:-5]
for i in range(4): json.dump(b[i::4],open(f"{base}_{i}.json","w"))
PY
cd "$ROOT/skills/ui-taste/scripts"
for i in 0 1 2 3; do
  "$ROOT/.venv/bin/python" capture.py --batch "$DIR/${BASE}_$i.json" > "$DIR/${BASE}_$i.log" 2>&1 &
done
wait
cat "$DIR"/${BASE}_?.log | grep -E "^(ok|FAIL)"
