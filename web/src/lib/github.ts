// The repository and its star count. Read once at build time; the badge refreshes it in the browser.
export const REPO = "rob1-alt/ui-taste";
export const REPO_URL = `https://github.com/${REPO}`;

export async function getStars(): Promise<number | null> {
  try {
    const r = await fetch(`https://api.github.com/repos/${REPO}`, { headers: { Accept: "application/vnd.github+json" }, signal: AbortSignal.timeout(5000) });
    if (!r.ok) return null;
    const j = await r.json();
    return typeof j.stargazers_count === "number" ? j.stargazers_count : null;
  } catch {
    return null;
  }
}
