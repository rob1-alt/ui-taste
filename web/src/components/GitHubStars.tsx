"use client";
// A link to the repository with its live star count: the build-time number first, then the current one.
import { useEffect, useState } from "react";
import { REPO, REPO_URL } from "@/lib/github";

const KEY = "uitaste-stars";
const fmt = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : String(n));

export function GitHubStars({ initial }: { initial: number | null }) {
  const [n, setN] = useState(initial);
  useEffect(() => {
    try { const c = JSON.parse(sessionStorage.getItem(KEY) || "null"); if (c && Date.now() - c.t < 600000) { setN(c.n); return; } } catch {}
    fetch(`https://api.github.com/repos/${REPO}`).then((r) => (r.ok ? r.json() : null)).then((j) => {
      if (typeof j?.stargazers_count !== "number") return;
      setN(j.stargazers_count);
      try { sessionStorage.setItem(KEY, JSON.stringify({ n: j.stargazers_count, t: Date.now() })); } catch {}
    }).catch(() => {});
  }, []);
  return (
    <a className="gh" href={REPO_URL} target="_blank" rel="noopener" aria-label={n == null ? "ui taste on GitHub" : `ui taste on GitHub, ${n} stars`}>
      <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
      <span className="gh-label">GitHub</span>
      {n != null && <span className="gh-n"><svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path fill="currentColor" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/></svg>{fmt(n)}</span>}
    </a>
  );
}
