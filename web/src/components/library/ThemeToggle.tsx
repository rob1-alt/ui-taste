"use client";
export const THEME_KEY = "uitaste-theme";
// runs before paint so the stored theme applies without a flash (inline in the library layout)
export const THEME_INIT = `try{var t=localStorage.getItem("${THEME_KEY}");if(t)document.documentElement.dataset.theme=t}catch(e){}`;

export function ThemeToggle() {
  const toggle = () => {
    const root = document.documentElement;
    const dark = root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    root.dataset.theme = dark ? "light" : "dark";
    try { localStorage.setItem(THEME_KEY, root.dataset.theme); } catch {}
  };
  return (
    <button type="button" className="icon-btn" id="theme" aria-label="Toggle dark mode" onClick={toggle}>
      <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="5.5" /><path d="M8 2.5v11a5.5 5.5 0 0 0 0-11z" fill="currentColor" stroke="none" /></svg>
    </button>
  );
}
