# Overnight ingestion loop

One iteration = one batch, closed end to end. Every iteration:

1. **Take the next batch.** Pop the first 50 entries of `ingest/queue.json` into the session scratchpad as `nN.json` (N = next batch number; check `git log`). When the queue runs low, refill it from the curated gallery: `python3 ingest/gallery_queue.py --max 400` (minimal.gallery, interleaved across product tags, already-seen URLs skipped). Do not write site lists by hand: hand-written queues kept 25% of a batch, gallery picks keep far more.
2. **Pre-filter**: `python3 ingest/prefilter.py <scratchpad>/nN.json` (HTTP check in seconds: bot walls, http errors, region gates, off-site redirects, sale takeovers go to `skipped.tsv` without starting Chromium).
3. **Capture**: `ingest/capture_parallel.sh <scratchpad>/nN.json 1` in the background (one shard: 3.7 GB). It writes to a staging index `<scratchpad>/nN_index.json`, never to `index.json`, so **start the capture of batch N+1 as soon as batch N's capture ends**, and review N while N+1 captures.
4. **Auto-drop blanks**: `.venv/bin/python ingest/blank_check.py <ids...>` flags flat, black and empty captures (WebGL, failed renders); they go in the DROP line as broken without a look.
5. **Triage with Haiku** on the remaining ids: `ingest/review_sheet.py <scratchpad>/rN <ids...>`, then one Haiku subagent sorts BROKEN / GENERIC / CANDIDATE into `<scratchpad>/nN_haiku.txt`.
6. **Judge the candidates yourself**: sheets of the candidates only, keep or drop on taste, tags and a note that says what decision to learn. Write `<scratchpad>/nN.txt` (DROP line + `slug|tags|note` lines) and run `python3 ingest/apply_review.py <scratchpad>/nN.txt <scratchpad>/nN.json` (merges the kept screens from the staging index under the index lock). Add capture failures to `ingest/skipped.tsv`.
7. **Update the skill** with what the batch teaches (taste-rules, landing-concepts, backgrounds, anti-slop, find_refs vocabulary, `bg-*` tags). Small and specific; skip if the batch teaches nothing new.
8. **Rebuild and commit**: `.venv/bin/python site/build.py`, `.venv/bin/python skills/ui-taste/scripts/contact_sheet.py docs`, `python3 site/readme_table.py`, then `ingest/commit_batch.sh "library: <n> landing pages (batch N: ...), <what the skill learned>"` (stages only screens that are in `index.json`, so the next batch's captures stay out). Push only at the 1000 goal.
9. **Schedule the next iteration** right away.

Stop condition: 1000 landing pages in the library, or the user says stop. Every batch is committed and pushed, so a usage limit mid-batch loses at most the uncommitted batch; on wake, check `git status` and finish or discard what is half done (remove screens of entries not in sources.json) before taking a new batch.
