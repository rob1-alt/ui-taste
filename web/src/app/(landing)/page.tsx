import Link from "next/link";
import { Checklist } from "@/components/landing/Checklist";
import { Effects } from "@/components/landing/Effects";
import { Fixer } from "@/components/landing/Fixer";
import { IndexRows, type Row } from "@/components/landing/IndexRows";
import { Mosaic } from "@/components/landing/Mosaic";
import { Specimens } from "@/components/landing/Specimens";
import { Stats } from "@/components/landing/Stats";
import { Logo } from "@/components/Logo";
import { cleanFont, isLight, palette } from "@/lib/format";
import { getLibrary, libraryCounts } from "@/lib/library";
import { SPEC_IDS } from "@/lib/specs";
import type { Tile } from "@/lib/types";

const INSTALL_PLUGIN = "/plugin marketplace add rob1-alt/ui-taste\n/plugin install ui-taste@ui-taste";
const INSTALL_GIT = "git clone https://github.com/rob1-alt/ui-taste.git\ncp -r ui-taste/skills/ui-taste ~/.claude/skills/";
// a first row of strong, varied pages in the index; the rest follows alphabetically
const FIRST = ["stripe-press-landing", "linear-pricing", "playdate-landing", "anthropic-landing", "teenage-engineering-landing", "obsidian-landing", "kagi-pricing", "pentagram-landing", "vercel-geist-overview", "lindy-landing", "hey-landing", "cognition-landing"];

export default function Landing() {
  const LIB = getLibrary();
  const counts = libraryCounts(LIB);
  const tiles: Tile[] = LIB.map((it) => ({
    id: it.id, site: it.site, type: it.type, light: isLight(it),
    src: it.screens.mobile?.tile || it.screens.mobile?.thumb || it.screens.desktop?.thumb || "",
    hint: it.note.split(/[.:]/)[0],
  }));
  const rank = (id: string) => { const i = FIRST.indexOf(id); return i < 0 ? 99 : i; };
  const rows: Row[] = LIB.slice().sort((a, b) => rank(a.id) - rank(b.id) || a.site.localeCompare(b.site)).map((it) => {
    const h1 = it.typeScale?.h1?.size ? it.typeScale.h1 : it.typeScale?.h2;
    return { id: it.id, site: it.site, type: it.type, note: it.note, thumb: it.screens.desktop?.thumb || "", font: cleanFont(it.fonts[0]), pal: palette(it, 5), h1: h1?.size || null };
  });
  const specimens = LIB.filter((it) => SPEC_IDS.includes(it.id));

  return (
    <>
      <div className="bg-grid" aria-hidden="true"><div className="bg-fine" /><div className="bg-spot" id="bg-spot" /></div>
      <div className="bg-coord" id="bg-coord" aria-hidden="true" />
      <div className="ruler" aria-hidden="true"><div className="ticks" id="ticks" /><div className="ruler-cursor" id="ruler-cursor"><span>0</span></div></div>

      <header className="masthead">
        <div className="masthead-inner">
          <Link className="wordmark" href="/"><Logo /></Link>
          <nav className="nav" aria-label="Sections">
            <a href="#measured">Measured</a>
            <a href="#numbers">Numbers</a>
            <a href="#index">Index</a>
            <a href="#method">Method</a>
            <a href="#review">Review</a>
            <a href="#install">Install</a>
          </nav>
          <div className="tools">
            <button type="button" className="measure-toggle" id="measure" aria-pressed="false">Measure <kbd>M</kbd></button>
            <Link className="btn btn-ink" href="/library">Open the library</Link>
          </div>
        </div>
      </header>

      <main>
        <Mosaic tiles={tiles} />

        <section className="measured" id="measured">
          <div className="measured-body">
            <div className="measured-text">
              <h2>Measured,<br />not guessed.</h2>
              <p className="lede" data-measure>Each page was captured on desktop and mobile, then read from the browser&apos;s computed styles: fonts, type scale, colours, radii, widths. Claude opens the screenshot and the numbers before it builds, then checks what it rendered against a list of what makes an interface look generated.</p>
            </div>
            <Specimens items={specimens} />
          </div>
        </section>

        <Stats items={LIB} />

        <IndexRows rows={rows} sites={counts.sites} />

        <section className="method" id="method">
          <header className="head">
            <h2>How Claude uses it</h2>
            <p className="head-lede">Four steps, every time it builds or reviews an interface.</p>
          </header>
          <ol className="lines">
            <li className="line">
              <span className="line-n">01</span>
              <h3 className="line-word">Inspect</h3>
              <p className="line-text">Read the project&apos;s own system first. The project always wins over any reference; if there is no system, the skill writes one down before building on it.</p>
              <div className="line-art art-files" aria-hidden="true">
                <span>DESIGN.md</span><span>tailwind.config.ts</span><span>globals.css</span><span>components/ui/</span>
              </div>
            </li>
            <li className="line">
              <span className="line-n">02</span>
              <h3 className="line-word">Reference</h3>
              <p className="line-text">Search the library only to settle a concrete question. One strong screen is enough, three is the limit, and Claude opens the screenshot before it decides.</p>
              <div className="line-art art-ref" aria-hidden="true">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/thumbs/linear-pricing-desktop.jpg" alt="" width={720} height={500} />
                <span>“linear pricing” → plain columns, one filled button</span>
              </div>
            </li>
            <li className="line">
              <span className="line-n">03</span>
              <h3 className="line-word">Build</h3>
              <p className="line-text">Apply the decision with the project&apos;s components and tokens: one type family, a real scale, neutral surfaces and one accent, real content only.</p>
              <div className="line-art art-tokens" aria-hidden="true">
                <i style={{ background: "#0e0e0e" }} /><i style={{ background: "#3d3d3b" }} /><i style={{ background: "#e8e8e5" }} /><i style={{ background: "#ffffff" }} /><i style={{ background: "#ff3d1f" }} />
                <b>Aa</b><b>Aa</b><b>Aa</b>
              </div>
            </li>
            <li className="line">
              <span className="line-n">04</span>
              <h3 className="line-word">Review</h3>
              <p className="line-text">Render at 1440 and 390 pixels, look at the result, run the checklist below and fix what it finds. A screen nobody looked at is not reviewed.</p>
              <div className="line-art art-frames" aria-hidden="true">
                <span className="f-desk">1440</span><span className="f-mob">390</span>
              </div>
            </li>
          </ol>
          <figure className="sheet">
            <figcaption>What a search returns</figcaption>
            <pre><span className="k">$</span>{' python3 scripts/find_refs.py "linear pricing" --limit 1\n\n'}<span className="h">Linear · pricing</span>{"\n"}<span className="k">url</span>{"        https://linear.app/pricing\n"}<span className="k">patterns</span>{"   dark, pricing-4-tier, comparison-table, billing-toggle-per-plan\n"}<span className="k">why</span>{"        Four plans in plain columns with no card boxes: name, price,\n           one line, a checklist. Only the Business button is filled.\n"}<span className="k">type</span>{"       h1 Inter Variable 48/1 w510 · body 15/1.6\n"}<span className="k">colours</span>{"    "}<i style={{ background: "#08090a" }} />{"#08090a  "}<i style={{ background: "#5e6ad2" }} />{"#5e6ad2  "}<i style={{ background: "#f7f8f8" }} />{"#f7f8f8\n"}<span className="k">button</span>{'     "Sign up" #e5e5e6 · radius 9999 · height 32 · padding 12'}</pre>
          </figure>
        </section>

        <section className="review" id="review">
          <header className="head">
            <h2>Fix the slop</h2>
            <p className="head-lede">This is the page agents build by default. Each line of the review checklist fixes one habit. Tick them, or let Claude do all of it.</p>
          </header>
          <Fixer />
          <Checklist />
        </section>

        <section className="install" id="install">
          <div className="install-card">
            <div>
              <h2>Install</h2>
              <p>Two commands in Claude Code. Then ask for a pricing page, a dashboard that looks generic, or a design system for a project that has none.</p>
            </div>
            <div className="cmds">
              <div className="cmd"><pre>{INSTALL_PLUGIN}</pre><button type="button" className="copy" data-copy={INSTALL_PLUGIN}>Copy</button></div>
              <div className="cmd"><pre>{INSTALL_GIT}</pre><button type="button" className="copy" data-copy={INSTALL_GIT}>Copy</button></div>
            </div>
          </div>
        </section>
      </main>

      <footer className="foot">
        <p className="foot-mark"><Logo className="logo-xl" /></p>
        <dl>
          <div><dt>Set in</dt><dd>Archivo, from 62% to 125% width</dd></div>
          <div><dt>Library</dt><dd><span id="c-pages">{counts.pages}</span> pages · <span id="c-shots">{counts.shots}</span> screenshots · last capture <span id="c-date">{counts.lastCapture}</span></dd></div>
          <div><dt>Rights</dt><dd>Screenshots belong to the companies that made them. Private study references, not to be republished.</dd></div>
        </dl>
      </footer>

      <div className="measure-layer" id="measure-layer" aria-hidden="true" />
      <div className="toast" id="toast" role="status" aria-live="polite" />
      <Effects />
    </>
  );
}
