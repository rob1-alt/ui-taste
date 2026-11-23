#!/bin/bash
# Capture a batch file in N parallel shards (default 2) (index.json writes are locked).
#   ingest/capture_parallel.sh batch.json [N]       -> logs next to the batch file
set -e
N=${2:-2}   # parallel shards; 4 ran the 3.7 GB machine out of memory
BATCH=$(realpath "$1"); DIR=$(dirname "$BATCH"); BASE=$(basename "$BATCH" .json)
ROOT=$(cd "$(dirname "$0")/.." && pwd)
python3 - "$BATCH" "$N" <<'PY'
import json,sys
b=json.load(open(sys.argv[1])); base=sys.argv[1][:-5]
for i in range(int(sys.argv[2])): json.dump(b[i::int(sys.argv[2])],open(f"{base}_{i}.json","w"))
PY
cd "$ROOT/skills/ui-taste/scripts"
for i in $(seq 0 $((N-1))); do
  "$ROOT/.venv/bin/python" capture.py --batch "$DIR/${BASE}_$i.json" > "$DIR/${BASE}_$i.log" 2>&1 &
done
wait
cat "$DIR"/${BASE}_?.log | grep -E "^(ok|FAIL)"
