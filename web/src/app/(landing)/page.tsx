import Link from "next/link";
import { Checklist } from "@/components/landing/Checklist";
import { Effects } from "@/components/landing/Effects";
import { Fixer } from "@/components/landing/Fixer";
import { IndexRows, type Row } from "@/components/landing/IndexRows";
import { Mosaic } from "@/components/landing/Mosaic";
import { Specimens } from "@/components/landing/Specimens";
import { Stats } from "@/components/landing/Stats";
import { Tools, type SearchHit, type Measured } from "@/components/landing/Tools";
import { Directions } from "@/components/landing/Directions";
import { Install } from "@/components/landing/Install";
import { getDirections } from "@/lib/directions";
import { Logo } from "@/components/Logo";
import { cleanFont, isLight, opt, palette, typeLabel } from "@/lib/format";
import { getLibrary, libraryCounts } from "@/lib/library";
import { getSpecimens } from "@/lib/specimens";
import { getCompare } from "@/lib/compare";
import { FAQ } from "@/lib/faq";
import { BASE_URL } from "@/lib/meta";
import { typeMetas } from "@/lib/seo";
import { Compare } from "@/components/landing/Compare";
import type { Tile } from "@/lib/types";
import { Head } from "@/components/landing/Head";
import { GitHubStars } from "@/components/GitHubStars";
import { getStars } from "@/lib/github";

// a first row of strong, varied pages in the index; the rest follows alphabetically
const FIRST = ["stripe-press-landing", "linear-pricing", "playdate-landing", "anthropic-landing", "teenage-engineering-landing", "obsidian-landing", "kagi-pricing", "pentagram-landing", "vercel-geist-overview", "lindy-landing", "hey-landing", "cognition-landing"];

export default async function Landing() {
  const stars = await getStars();
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
  const specimens = getSpecimens();
  const compare = getCompare();
  const directions = getDirections(LIB);
  // the search demo replays what find_refs returns for dark pricing pages
  const hits: SearchHit[] = ["clerk-pricing", "linear-pricing", "vercel-pricing"].map((id) => LIB.find((x) => x.id === id)).filter(Boolean).map((it) => ({
    id: it!.id, site: it!.site, type: typeLabel(it!.type), why: it!.note.split(/(?<=\.)\s/)[0], thumb: opt(it!.screens.desktop!.thumb, 360), pal: palette(it!, 4),
  }));
  const lp = LIB.find((x) => x.id === "linear-pricing")!;
  const h1 = lp.typeScale.h1, body = lp.typeScale.body, btn = lp.buttons[1] || lp.buttons[0];
  const measured: Measured = { id: lp.id, site: lp.site, thumb: opt(lp.screens.desktop!.thumb, 720), chips: [
    ...(h1 ? [{ x: 4, y: 9, label: `h1 ${cleanFont(h1.font)} ${h1.size}/${h1.lineHeight} w${h1.weight}` }] : []),
    ...(body ? [{ x: 22, y: 30, label: `body ${body.size}/${body.lineHeight}` }] : []),
    { x: 56, y: 44, label: `bg ${lp.colors.background}` },
    ...(btn ? [{ x: 24, y: 68, label: `button ${btn.height}px · r ${parseInt(btn.radius)} · ${btn.bg}` }] : []),
  ] };

  return (
    <>
      <div className="bg-grid" aria-hidden="true"><div className="bg-fine" /><div className="bg-spot" id="bg-spot" /></div>
      <div className="bg-coord" id="bg-coord" aria-hidden="true" />
      <div className="ruler" aria-hidden="true"><div className="ticks" id="ticks" /><div className="ruler-cursor" id="ruler-cursor"><span>0</span></div></div>

      <header className="masthead">
        <div className="masthead-inner">
          <div className="brand">
            <Link className="wordmark" href="/"><Logo /></Link>
            <GitHubStars initial={stars} />
          </div>
          <nav className="nav" aria-label="Sections">
            <a href="#measured">Measured</a>
            <a href="#tools">Tools</a>
            <a href="#compare">Compare</a>
            <a href="#directions">Directions</a>
            <a href="#numbers">Numbers</a>
            <a href="#index">Index</a>
            <a href="#review">Review</a>
            <a href="#install">Install</a>
            <Link href="/examples">Examples</Link>
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
            <Specimens specs={specimens} />
          </div>
        </section>

        <Tools hits={hits} measured={measured} total={LIB.length} />

        {compare && <Compare data={compare} />}

        {directions.length > 0 && <Directions list={directions} />}

        <Stats items={LIB} />

        <IndexRows rows={rows} sites={counts.sites} />

        <section className="review" id="review">
          <Head title="Fix the slop.">This is the page agents build by default. Each line of the review checklist fixes one habit. Tick them, or let Claude do all of it.</Head>
          <Fixer />
          <Checklist />
        </section>

        <section className="faq" id="faq">
          <h2 className="faq-h">Questions</h2>
          <div className="faq-list">
            {FAQ.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}
          </div>
          <p className="faq-more">Browse by page type: {typeMetas(LIB).slice(0, 8).map((t, i) => <span key={t.slug}>{i ? ", " : ""}<Link href={`/examples/${t.slug}`}>{t.plural}</Link></span>)}, or <Link href="/examples">every page type and pattern</Link>.</p>
        </section>

        <Install />
      </main>

      <footer className="foot">
        <p className="foot-mark"><Logo className="logo-xl" /></p>
        <dl>
          <div><dt>Set in</dt><dd>Archivo, from 62% to 125% width</dd></div>
          <div><dt>Library</dt><dd><span id="c-pages">{counts.pages}</span> pages · <span id="c-shots">{counts.shots}</span> screenshots · last capture <span id="c-date">{counts.lastCapture}</span></dd></div>
          <div><dt>Rights</dt><dd>Screenshots belong to the companies that made them. Private study references, not to be republished.</dd></div>
        </dl>
      </footer>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
        { "@context": "https://schema.org", "@type": "SoftwareApplication", name: "ui taste", applicationCategory: "DeveloperApplication", operatingSystem: "macOS, Linux, Windows",
          description: "An open-source skill for AI coding agents: a library of real web pages measured on the live page, a reference search and an anti-slop review.",
          url: BASE_URL, downloadUrl: "https://github.com/rob1-alt/ui-taste", license: "https://github.com/rob1-alt/ui-taste", isAccessibleForFree: true, offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
        { "@context": "https://schema.org", "@type": "WebSite", name: "ui taste", url: BASE_URL },
        { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
      ]) }} />
      <div className="measure-layer" id="measure-layer" aria-hidden="true" />
      <div className="toast" id="toast" role="status" aria-live="polite" />
      <Effects />
    </>
  );
}
