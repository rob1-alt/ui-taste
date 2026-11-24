"use client";
import { useState } from "react";

const TABS = [
  { k: "Claude Code", cmd: "/plugin marketplace add rob1-alt/ui-taste\n/plugin install ui-taste@ui-taste", note: "Two commands inside Claude Code. The plugin keeps the skill up to date." },
  { k: "npx skills", cmd: "npx skills add rob1-alt/ui-taste", note: "With the open skills CLI, for any agent that reads SKILL.md files. Run it again to update." },
  { k: "By hand", cmd: "git clone https://github.com/rob1-alt/ui-taste.git\ncp -r ui-taste/skills/ui-taste ~/.claude/skills/", note: "Copy the folder into your agent's skills directory." },
];
const AGENTS = ["Claude Code", "Codex", "Cursor", "OpenCode", "Gemini CLI", "Any agent with SKILL.md"];

export function Install() {
  const [t, setT] = useState(0);
  const tab = TABS[t];
  return (
    <section className="install" id="install">
      <div className="install-card">
        <div>
          <h2>Install</h2>
          <p>Then ask for a pricing page, a dashboard that looks generic, or a design system for a project that has none. Search and review need Python 3; capturing new pages also needs Playwright.</p>
        </div>
        <div className="inst">
          <div className="inst-tabs" role="tablist" aria-label="Install method">
            {TABS.map((x, k) => <button key={x.k} type="button" role="tab" aria-selected={k === t} onClick={() => setT(k)}>{x.k}</button>)}
          </div>
          <div className="cmd"><pre>{tab.cmd.split("\n").map((l) => <span key={l}><b>$</b> {l}{"\n"}</span>)}</pre><button type="button" className="copy" data-copy={tab.cmd}>Copy</button></div>
          <p className="inst-note">{tab.note}</p>
        </div>
      </div>
      <ul className="agents" aria-label="Works with">
        {AGENTS.map((a) => <li key={a}>{a}</li>)}
      </ul>
    </section>
  );
}
