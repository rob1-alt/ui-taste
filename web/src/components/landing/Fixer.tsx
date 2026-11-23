"use client";
// The page agents build by default. Each line of the checklist fixes one habit, as a class on the demo.
import { useEffect, useRef, useState } from "react";

const FIXES: [string, string][] = [
  ["gradient", "No purple-to-pink gradient behind everything"],
  ["glow", "No glow blob for atmosphere"],
  ["copy", "Say what the product does. No “Supercharge”, no emoji in copy"],
  ["emoji", "No emoji as icons"],
  ["center", "Show the product, not adjectives"],
  ["cards", "No row of three emoji cards: three plain facts"],
  ["shadow", "Shadows only where something floats"],
  ["weight", "Two or three weights, not bold everywhere"],
  ["buttons", "One primary button. The second action looks secondary"],
  ["radius", "One radius family"],
];

export function Fixer() {
  const [on, setOn] = useState<Set<string>>(() => new Set());
  const playing = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (playing.current) clearTimeout(playing.current); }, []);
  const toggle = (k: string, v?: boolean) => setOn((prev) => { const n = new Set(prev); if (v ?? !n.has(k)) n.add(k); else n.delete(k); return n; });
  const fixAll = () => {
    if (playing.current) clearTimeout(playing.current);
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const todo = FIXES.map(([k]) => k).filter((k) => !on.has(k));
    const step = () => { const k = todo.shift(); if (!k) return; toggle(k, true); playing.current = setTimeout(step, still ? 0 : 420); };
    step();
  };
  const reset = () => { if (playing.current) clearTimeout(playing.current); setOn(new Set()); };
  const left = FIXES.length - on.size;
  return (
    <div className="fixer">
      <div className="fix-list">
        <div className="fix-score">
          <span className={`fs-n${left === 0 ? " zero" : ""}`} id="fs-n">{left}</span>
          <span className="fs-k">{left ? <>habits left<br />that read as generated</> : <>habits left.<br />Reads as designed.</>}</span>
        </div>
        <ul id="fixes">
          {FIXES.map(([k, t]) => <li key={k}><button type="button" data-fix={k} aria-pressed={on.has(k)} onClick={() => toggle(k)}>{t}</button></li>)}
        </ul>
        <div className="fix-actions">
          <button type="button" className="btn btn-ink" id="fix-all" onClick={fixAll}>Fix all</button>
          <button type="button" className="btn btn-line" id="fix-reset" onClick={reset}>Reset</button>
        </div>
      </div>
      <div className="demo-frame">
        <div className="demo-bar" aria-hidden="true"><i /><i /><i /><span>A demo page · not a real product · placeholder visuals</span></div>
        <div className={["demo", ...[...on].map((k) => `fix-${k}`)].join(" ")} id="demo">
          <div className="d-sky" aria-hidden="true" />
          <div className="d-glow" aria-hidden="true" />
          <nav className="d-nav">
            <b className="d-logo"><span className="d-mark" />Tally</b>
            <span className="d-links"><span>Product</span><span>Pricing</span><span>Docs</span></span>
            <span className="d-nav-r"><a className="d-btn d-ghost">Sign in</a><a className="d-btn d-btn-1 d-nav-cta"><span className="slop-copy">Get Started 🚀</span><span className="taste-copy">Start free <i className="arr">→</i></span></a></span>
          </nav>
          <div className="d-hero">
            <p className="d-eyebrow"><span className="slop-copy">✨ Now with AI ✨</span><span className="taste-copy"><b>New</b>Bank matching for every account</span></p>
            <h4 className="d-h1"><span className="slop-copy">Supercharge Your Invoicing Workflow</span><span className="taste-copy">Invoices sent.<br />Payments chased.</span></h4>
            <p className="d-sub"><span className="slop-copy">The all-in-one platform to unlock seamless, next-generation billing for modern teams.</span><span className="taste-copy">Tally sends the reminders, matches the payments and tells you who is late.</span></p>
            <div className="d-ctas"><a className="d-btn d-btn-1"><span className="slop-copy">Get Started Free</span><span className="taste-copy">Start free trial <i className="arr">→</i></span></a><a className="d-btn d-btn-2"><span className="slop-copy">Learn More</span><span className="taste-copy">Book a demo</span></a></div>
          </div>
          <div className="d-product" aria-hidden="true">
            <aside className="p-side"><b><span className="d-mark" />Tally</b><span className="on">Invoices</span><span>Clients</span><span>Reminders</span><span>Payments</span><span>Reports</span></aside>
            <div className="p-main">
              <div className="p-head"><div><b>Invoices</b><small>Who owes what, and what Tally is doing about it.</small></div><span className="p-chip">March 2026</span></div>
              <div className="p-sum">
                <div><em>Outstanding</em><strong>€15,650</strong><small>4 invoices</small></div>
                <div><em>Paid this month</em><strong>€42,300</strong><small>+12% on February</small></div>
                <div><em>Avg. days to pay</em><strong>9</strong><small>was 21 before Tally</small></div>
              </div>
              <div className="p-row"><span className="p-who">Northwind Studio<small>INV-0142</small></span><span className="p-amt">€4,800</span><span className="p-st st-paid">Paid</span></div>
              <div className="p-row"><span className="p-who">Hale &amp; Co<small>INV-0139</small></span><span className="p-amt">€1,250</span><span className="p-st st-sent">Reminder 2 sent</span></div>
              <div className="p-row"><span className="p-who">Orbit Labs<small>INV-0131</small></span><span className="p-amt">€9,600</span><span className="p-st st-late">23 days late</span></div>
            </div>
          </div>
          <div className="d-hills" aria-hidden="true" />
          <div className="d-cards">
            <div className="d-card"><span className="d-ico">⚡</span><b>Lightning Fast</b><p>Blazing performance for your team.</p><strong>Reminders on day 3, 7 and 14</strong></div>
            <div className="d-card"><span className="d-ico">🔒</span><b>Secure by Default</b><p>Enterprise-grade security built in.</p><strong>Bank payments matched overnight</strong></div>
            <div className="d-card"><span className="d-ico">🎯</span><b>Easy to Use</b><p>An intuitive interface anyone can use.</p><strong>One list of who is late</strong></div>
          </div>
        </div>
        <p className="demo-note"><b>About the visuals.</b> The sky and hills here are drawn placeholders, the kind you would generate or shoot. taster does not make your visuals: it gives Claude the layout ideas (where the product sits, how the scene frames it, what goes on top), and the images come from you or an image model.</p>
      </div>
    </div>
  );
}
