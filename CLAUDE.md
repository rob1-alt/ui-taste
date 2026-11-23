# ui-taste repo

The skill lives in `skills/ui-taste/`; the gallery site in `site/` is built from its library.

## Goal

Grow the library to about 1000 landing pages, kept to sites with real design quality (YC companies and other well-designed products). Work in batches of 30-60, and drop weak or generic captures rather than padding the count.

## Ingesting sites: always close the loop

Every time screens are added to the library (one site or a batch), the same session must finish all of these before calling the work done:

1. **Look at every new screen** (desktop and mobile) before writing anything. Drop captures that are broken, blocked (bot walls, blank, cookie walls) or that teach nothing.
2. **Metadata** (write the review as a notes file and run `python3 ingest/apply_review.py notes.txt batch.json`): real `tags` (patterns, reusing existing tag names where they fit) and a `note` that says what decision to learn, not a description. Write them in `skills/ui-taste/scripts/sources.json` (the source of truth, re-capturable) and in `skills/ui-taste/library/index.json`.
3. **Update the skill itself** with what the batch teaches:
   - `references/taste-rules.md`: new rules or new examples for existing rules (cite the sites).
   - `references/anti-slop.md` / `landing-concepts.md` / `design-systems.md` when the batch shows a new pattern, direction or counter-example.
   - `scripts/find_refs.py` `SYNONYMS` when a new page type or vocabulary appears.
   - `SKILL.md` when the workflow, the page types or the file list change.
4. **Rebuild**: `python3 site/build.py` (thumbs + `site/data.js`), and `python3 skills/ui-taste/scripts/contact_sheet.py docs` when a page type's sheet changed.
5. **README**: `python3 site/readme_table.py` rewrites the library table and the total line from `index.json`; update the prose (page-type sections, sheets) by hand if a new page type appeared.
6. **Commit** the batch (screens, index, sources, skill changes, site, README) in one commit, message style `library: <n> <type> pages (<sites>), <what the skill learned>`. Do not push after each batch: push once the ~1000-landing goal is reached, then notify the user.
7. Report what was added, what was dropped and why, and what changed in the skill.

Before a batch, skip every URL already in `sources.json` or in `ingest/skipped.tsv`; after review, add each dropped URL to `ingest/skipped.tsv` with its reason (blocked, generic, broken).

Capture with the venv: `.venv/bin/python skills/ui-taste/scripts/capture.py --batch <file.json>` (run from `skills/ui-taste/scripts/`).

Tools in `ingest/`: `capture_parallel.sh batch.json` (2 parallel shards by default, more only with spare RAM; `save_item` locks `index.json`), `review_sheet.py prefix ids...` (contact sheets, 4 screens each, for the visual review), `apply_review.py notes.txt batch.json` (tags, notes, drops, sources, skipped list). Never write `index.json` from another script while captures are running.

Commerce sites captured during a sale period (Black Friday, end of November) are covered in banners and pop-ups: drop them and recapture outside sale weeks.

Agency and studio sites built on WebGL often capture as black or empty (Resn, Lusion, Active Theory, Koto, Obys): prefer studios with static pages, and drop blank captures.
