"use client";
// Same brief, same model, one run each, no retries, no edits: the first screen of each result at 1440px.
import { useState } from "react";
import type { Compare as C } from "@/lib/compare";

const NOTES: Record<string, { without: string; with: string }> = {
  landing: {
    without: "A good page, and the 2025 default: a cream background, a serif headline with one phrase in italics, small-caps eyebrows above every section. The look the skill lists as generated.",
    with: "One sans family. The headline strikes the word the product removes. The hero is one worked example: a single invoice going from sent to paid, step by step, that you can replay.",
  },
  pricing: {
    without: "Serif on cream again, three cards, the middle one dark with a badge. Correct and familiar.",
    with: "Each plan is an invoice slip: features on dotted lines like line items, on faint ledger paper. The headline states the deal: five invoices free, pay when you are busy.",
  },
  dashboard: {
    without: "The closest pair. A competent dashboard: totals, a split bar, late clients, a reminder feed.",
    with: "Same parts, cleaner hierarchy: months compared in one chart, each late client shows what was already tried and the next action. The difference is smaller here; dashboards are where models are already strongest.",
  },
};
const TITLE: Record<string, string> = { landing: "Landing page", pricing: "Pricing page", dashboard: "Dashboard" };

export function Compare({ data }: { data: C }) {
  const [i, setI] = useState(0);
  const p = data.pairs[i], n = NOTES[p.name];
  return (
    <section className="compare" id="compare">
      <header className="ph">
        <h2>Same prompt.<br />Same model.</h2>
        <p>Three briefs, each sent twice to {data.model.replace("claude-", "Claude ").replace(/-(\d+)-(\d+)$/, " $1.$2").replace("sonnet", "Sonnet")} in {data.tool}: once in an empty folder with skills turned off, once with ui taste installed. One run each, no retries, nothing edited. Open any of them.</p>
      </header>
      <div className="cmp-tabs" role="tablist" aria-label="Brief">
        {data.pairs.map((x, k) => <button key={x.name} type="button" role="tab" aria-selected={k === i} onClick={() => setI(k)}>{TITLE[x.name] || x.name}</button>)}
      </div>
      <div className="cmp-grid">
        {(["without", "with"] as const).map((v) => (
          <figure key={v} className={`cmp-side cmp-${v}`}>
            <figcaption><b>{v === "without" ? "Without ui taste" : "With ui taste"}</b><span>{p[v].turns} steps · {Math.round(p[v].seconds / 60)} min</span></figcaption>
            <a href={p[v].html} target="_blank" rel="noopener" className="cmp-shot" aria-label={`Open the ${TITLE[p.name].toLowerCase()} built ${v} ui taste`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p[v].img} alt={`${TITLE[p.name]} generated ${v} ui taste, first screen at 1440px`} width={1200} height={750} loading="lazy" />
              <span className="cmp-open">Open the page ↗</span>
            </a>
            <p>{n[v]}</p>
          </figure>
        ))}
      </div>
      <details className="cmp-prompt"><summary>The prompt, word for word</summary><p>{p.prompt}</p></details>
      <p className="cmp-note">With the skill, the model searched the library and wrote down its concept before building. It could not run its final visual review: the sandbox had no browser. These are first drafts on both sides.</p>
    </section>
  );
}
