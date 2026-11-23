# Overnight ingestion loop

One iteration = one batch, closed end to end. Every iteration:

1. **Take the next batch.** Pop the first 50 entries of `ingest/queue.json` into the session scratchpad as `nN.json` (N = next batch number; check `git log` for the last batch number). Drop any URL already in `skills/ui-taste/scripts/sources.json` or `ingest/skipped.tsv`. Write the queue back without them. When the queue has fewer than 50 entries, append a new list of design-forward sites first (tools, studios, labs, indie apps, hardware, type foundries; avoid big commerce, fashion and news, which block headless capture), skipping everything already seen.
2. **Capture**: `ingest/capture_parallel.sh <scratchpad>/nN.json 1` (one shard: the machine has 3.7 GB). Run it in the background and wait for the completion notification.
3. **Triage with Haiku**: `ingest/review_sheet.py <scratchpad>/rN <ids...>`, then one Haiku subagent sorts BROKEN / GENERIC / CANDIDATE into `<scratchpad>/nN_haiku.txt` (same prompt as batch 8).
4. **Judge the candidates yourself**: sheets of the candidates only, look at each, keep or drop on taste, write tags and a note that says what decision to learn. Write `<scratchpad>/nN.txt` (DROP line + `slug|tags|note` lines) and run `python3 ingest/apply_review.py <scratchpad>/nN.txt <scratchpad>/nN.json`. Add capture failures to `ingest/skipped.tsv`.
5. **Update the skill** with what the batch teaches (taste-rules, landing-concepts, backgrounds, anti-slop, find_refs vocabulary, `bg-*` tags). Small and specific; skip if the batch teaches nothing new.
6. **Rebuild and commit**: `.venv/bin/python site/build.py`, `.venv/bin/python skills/ui-taste/scripts/contact_sheet.py docs`, `python3 site/readme_table.py`, then one commit `library: <n> landing pages (batch N: ...), <what the skill learned>` and `git push`.
7. **Schedule the next iteration** right away.

Stop condition: 1000 landing pages in the library, or the user says stop. Every batch is committed and pushed, so a usage limit mid-batch loses at most the uncommitted batch; on wake, check `git status` and finish or discard what is half done (remove screens of entries not in sources.json) before taking a new batch.
