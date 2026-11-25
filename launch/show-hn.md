# Show HN launch checklist · ui taste

HN rewards a plain, specific post from the person who built the thing, a repo that works in two minutes, and a founder who answers every comment for a day. Everything below serves that.

## Before anything: rights

- [ ] **Decide what the public repo contains.** The README says the captures are private design references and the repo must stay private; the repo is public. Either make it private and publish a second repo without `library/screens/`, or accept the risk knowingly. HN will notice, and the first comment will be about it.
- [ ] **Ship the recipe, not the screenshots.** The clean version: `sources.json` (URLs, tags, notes), the scripts, the skill. Users rebuild the library locally with `capture.py --batch sources.json`. Two upsides to say out loud: nothing redistributed, and the screens are always current.
- [ ] **Remove or clear `examples/relay-x/`.** It carries a client's logos, partner logos, a booth photo and a portrait. Get Relay X's written OK or replace the example with a fictional product.
- [ ] **The hero mosaic on the site** is made of third-party captures. Same question. A mosaic of measured colours (as in the launch video) is rights-free.
- [ ] Fonts: Archivo is OFL, fine. The two paintings are public domain, credited. Keep the credits.

## The repo, as a stranger sees it

- [ ] **Rename everywhere**: taster in README title, plugin manifests (`.claude-plugin/*.json`: name, displayName, description), site `<title>`, favicon, OG image. Today it is still "UI taste" and "ui-taste@ui-taste" in the install commands.
- [ ] **First screen of the README**: one sentence, one image (the before/after or the anti-slop list), the two install commands, a 60-second "try it" (`find_refs.py "pricing page"`), then everything else.
- [ ] **A 2-minute path that works on a fresh machine**: clone, `pip install playwright pillow`, `playwright install chromium`, one search, one capture. Test it in a clean venv or container. Note Python 3.11+ and the ~1 GB Chromium download.
- [ ] **Works without Claude Code**: say which parts (search, capture, slots, the references as plain Markdown) are usable from Cursor, Codex or by hand. HN is not all Claude users.
- [ ] **LICENSE file** (MIT or Apache-2.0 for the code; state separately that `sources.json` notes are CC BY and that screenshots are not covered).
- [ ] **CONTRIBUTING**: how to propose a site (the note must say what to learn, not describe), how to add a page type, how to run `site/build.py` and `readme_table.py`.
- [ ] **Issues enabled**, a few good first issues open (sites to add, a page type, a `find_refs` improvement).
- [ ] **Tag v0.1.0** and a GitHub Release with the video or a GIF.
- [ ] **Site**: ~~remove `noindex`~~ (done, site indexable on uitaste.dev); add an OG image (the logo on paper, 1200×630); add the GitHub link and the install block above the fold; show the plugin version.
- [ ] **Secrets and personal data**: grep for emails, tokens, `.vercel`, absolute `/home/rob/` paths in docs and in `index.json` (`find_refs` prints absolute paths; that is fine at runtime, not in committed docs).

## Done on 2026-11-25

- Rights: the repo stays public. `LICENSE` (MIT) covers code, references and metadata, not the screenshots; README "Rights" says so, offers removal on request, and points to `sources.json` for recapture.
- Client work removed: `examples/relay-x/`, `examples/fleuret/`, `site/work/fleuret/`, the Relay X library entry and the Relay X video frames.
- Naming: README title, plugin displayName and description say "ui taste"; plugin homepage and GitHub homepage are https://www.uitaste.dev.

## Ready to post (draft, 2026-11-25)

**Title** (75 chars):

    Show HN: Ui taste – real, measured UI references so coding agents stop building slop

Alternatives:
- `Show HN: Ui taste – 1,200 measured web pages and a render-and-compare loop for agents`
- `Show HN: Ui taste – a Claude Code skill that makes the agent look at what it built`

**URL**: https://github.com/rob1-alt/ui-taste (the repo, not the site; the site goes in the comment).

**Text field**: leave empty (a Show HN with a URL takes no text; the context goes in the first comment).

**First comment** (post within a minute):

> Hi HN, I built this because every page my agents built looked the same: purple gradient, three centred cards, Inter. Lately it is a new default: cream background, a serif headline with one word in italics, mono uppercase labels, pill badges.
>
> ui taste is a Claude Code skill. It has three parts:
>
> - A library of over 1,200 real pages (mostly landings, plus pricing, dashboards, docs and design systems), captured at 1440 and 390. For each page it stores the tokens read from the live page's computed styles: fonts, type scale, colours, radii, button sizes, widths.
> - A search that returns the 2-3 closest pages, with a contact sheet, so the agent looks at real screens before choosing a direction.
> - A review loop. The agent renders what it built with Playwright, puts its first screen next to the reference it used, asks itself which one a designer would pick, then fixes the page against an anti-slop checklist.
>
> The test I trust most is on the site: same prompt, same model (Opus 5.5), one run each, nothing edited. Without the skill, the model does not look at what it built. I also ran it without the skill but told it to render the page and iterate until it was excellent and not generic. It took 40/32/27 steps against the skill's 24/18/16, and ended up polishing the same cream-and-serif page. Taking more time did not get it away from the default. Looking at real references did.
>
> Limits: it needs Chromium (about 1 GB). Captures fail on bot walls. It works best in Claude Code today, although the scripts and the Markdown rules work by hand. The dashboard gap is the smallest: models are already decent at dashboards.
>
> Site with the comparison: https://www.uitaste.dev. I would love to know which sites and page types are missing.

**Prepared answers** for the likely threads are below in "Timing and mechanics". Add this one:
- "Why not just tell the model to iterate?" → we tried, see the "told to iterate" switch on the site: more steps, same look.

## The post (original notes)

- [ ] **Title** (≤ 80 chars, factual, no superlatives, no "AI-powered"):
  - `Show HN: Taster – a Claude Code skill that stops generated UIs from looking generated`
  - `Show HN: Taster – 345 measured UI references and an anti-slop review for coding agents`
  - `Show HN: Taster – teach your coding agent UI taste with real, measured screens`
- [ ] **First comment, posted within a minute of the submission**, written as a person, 150–250 words:
  1. What it is in two lines (library of real screens measured on the live page, a reference search, an anti-slop review of what the agent renders).
  2. Why: agents all build the same page; the fix is evidence, not another prompt.
  3. What surprised you building it (the v1→v3 story in three sentences; the "current AI look" list: cream, serif with an italic word, mono micro-labels, pills; the swap test).
  4. What it is not: not a template pack, not a design system, does not redistribute screenshots (if true by then).
  5. Honest limits: Chromium download, captures break on bot walls, French-first examples, works best with Claude Code today.
  6. One ask: which sites and page types are missing.
- [ ] **No marketing voice** in the post, the README or the comments. No emoji, no "excited to share", no exclamation marks.
- [ ] Link goes to the **GitHub repo**, not the landing page. HN prefers the source; the README is the landing page.

## Timing and mechanics

- [ ] Post **Tuesday–Thursday, 14:00–16:00 CET** (morning US East). Avoid Mondays, Fridays after 18:00 CET, US holidays.
- [ ] Submit from the account that will answer. New account is fine; **do not ask anyone to upvote** (voting rings get the post killed). Sharing the link in private channels to say "I posted" is fine; "please upvote" is not.
- [ ] **Clear the day.** Answer every substantive comment within 15 minutes for the first 6 hours, then hourly until you sleep. Short, factual, concede valid points, fix small things live and say so ("fixed in 2f1c9ab").
- [ ] Prepare answers for the predictable threads:
  - "This is just screenshots of other people's sites" → rights decision above, say it plainly.
  - "Why not a design system / Tailwind UI / shadcn?" → references are evidence for a decision; the project's own system always wins; taster sets one up when there is none.
  - "Taste can't be taught to an LLM" → agree partly: it cannot be prompted, it can be constrained by evidence and checked by a review; show the v1→v3 frames.
  - "Benchmarks?" → none yet; propose the swap test and the before/after as the honest evaluation; invite one.
  - "Does it work with Cursor / Codex / Aider?" → what is usable today, what needs a port, PRs welcome.
  - "Cost / tokens?" → one search is a few hundred tokens; the screenshot read is the expensive part and it is optional.
- [ ] If the post does not take off in 90 minutes, do not resubmit the same day. Reposting a week later with a different, more specific title is accepted practice.

## Assets to have ready

- [ ] The launch video (`launch/video`, 55 s, 1920×1080) as MP4 and a 10-second GIF of the before/after for the README.
- [ ] Three stills for the README and social: the problem page with its red labels, the measured-colours mosaic with the counters, the anti-slop list.
- [ ] A text-only summary of the skill's rules (the anti-slop list) as a Gist or a page: people share lists.
- [ ] Links: repo, site, plugin install commands, your contact.

## Right after

- [ ] Same day, post a shorter version with the video on X and LinkedIn, linking the HN thread (not the other way round).
- [ ] Add the repo to the awesome-claude-code lists and the plugin marketplaces; open a thread on r/ClaudeAI.
- [ ] Within a week: turn the best HN objections into issues or README sections; tag v0.1.1 with the fixes; thank contributors by name.
- [ ] Product Hunt only after that, once there are stars, issues and a changelog to show.
