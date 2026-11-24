"use client";
// Same brief, same model, one run each, no retries, no edits: the first screen of each result at 1440px.
import { useState } from "react";
import type { Compare as C } from "@/lib/compare";

const NOTES: Record<string, { without: string; with: string }> = {
  landing: {
    without: "A good page, and the 2025 default: cream, a serif headline with one word in italics, a pill badge, an invoice card on the right, then a row of statistics it made up.",
    with: "A vermilion field, a heavy grotesk headline, and one real invoice (VAT, reverse charge, IBAN) with the reminder Tally just sent pinned to it. Below, the same invoice is followed by date: sent, overdue, paid.",
  },
  pricing: {
    without: "Serif on cream again, three cards, the middle one dark with a badge. Correct and familiar.",
    with: "Pricing, itemised: each plan is an invoice, with billed to, line items and the total set as large as a price. A pricing page with a concept from the product itself.",
  },
  dashboard: {
    without: "The closest pair. A competent dashboard: totals, a split bar, late clients, a reminder feed.",
    with: "Same parts, one decision more: late money split by age, each late client shows what was already tried, and the one final notice that needs your OK waits at the top of the reminders. Dashboards are where models are already strongest.",
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
        <p>Three briefs, each sent twice to {data.model.replace("claude-", "Claude ").replace(/-(\d+)-(\d+)$/, " $1.$2").replace(/\b(sonnet|opus|haiku|fable)\b/, (m) => m[0].toUpperCase() + m.slice(1))} in {data.tool}: once in an empty folder with skills turned off, once with ui taste installed. One run each, no retries, nothing edited. Open any of them.</p>
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
      <p className="cmp-note">With the skill, the model opened references from the library, wrote down a concept, then rendered its page and set it beside a reference before revising it. Without it, the model did not look at what it built. Both sides had the same tools.</p>
    </section>
  );
}
