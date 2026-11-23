// A single toast element per page (#toast); shared by the copy buttons.
let timer: ReturnType<typeof setTimeout> | undefined;
export function showToast(msg: string) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(timer);
  timer = setTimeout(() => t.classList.remove("show"), 1400);
}
export async function copyText(text: string) {
  try { await navigator.clipboard.writeText(text); showToast("Copied " + (text.length > 32 ? "command" : text)); }
  catch { showToast("Copy not allowed here"); }
}
