(() => {
  const LIB = window.LIBRARY || [];
  const byId = Object.fromEntries(LIB.map((x) => [x.id, x]));
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const TYPE_LABELS = {
    landing: "Landing", pricing: "Pricing", "design-system": "Design system", "404": "404 page", about: "About",
    careers: "Careers", contact: "Contact sales", integrations: "Integrations", developers: "Developers",
    brand: "Brand", auth: "Sign-up & login", product: "Product", changelog: "Changelog", docs: "Docs",
    customers: "Customers", blog: "Blog",
  };
  const typeLabel = (t) => TYPE_LABELS[t] || t;
  const thumb = (id) => byId[id]?.screens.desktop?.thumb;

  // Counts
  const sites = new Set(LIB.map((x) => x.site)).size;
  const shots = LIB.reduce((n, x) => n + Object.keys(x.screens).length, 0);
  $("#n-pages").textContent = LIB.length;
  $("#n-sites").textContent = sites;
  $("#n-shots").textContent = shots;
  $("#hero-sub").textContent = `${LIB.length} real pages from ${sites} products known for their design, with the fonts, sizes, colours and buttons measured on the live page. Claude looks before it builds, then reviews what it rendered.`;

  // Screens set into the headline
  document.querySelectorAll(".inline-shot").forEach((el) => {
    const t = thumb(el.dataset.shot);
    if (t) el.style.backgroundImage = `url("${t}")`;
  });

  // Reel: two rows of real screens, duplicated so the loop is seamless
  const REEL = [
    ["stripe-press-landing", "playdate-landing", "teenage-engineering-landing", "obsidian-landing", "pentagram-landing", "hey-landing", "sentry-landing", "anthropic-landing", "pika-landing", "affinity-landing", "kagi-landing", "beehiiv-landing", "cash-app-landing", "lindy-landing"],
    ["linear-pricing", "procreate-landing", "netlify-landing", "cosmos-landing", "partiful-landing", "panic-landing", "vercel-geist-overview", "basecamp-landing", "frame-io-landing", "ghost-landing", "slack-landing", "turso-landing", "readwise-reader-landing", "sketch-landing"],
  ];
  document.querySelectorAll(".reel-row").forEach((row, i) => {
    const items = REEL[i].filter((id) => thumb(id));
    const card = (id, hidden) => {
      const it = byId[id];
      return `<a href="library.html#id=${esc(id)}" ${hidden ? 'aria-hidden="true" tabindex="-1"' : ""}>
        <div class="frame"><img src="${esc(thumb(id))}" alt="${hidden ? "" : esc(it.site) + " " + esc(typeLabel(it.type))}" loading="lazy" decoding="async"></div>
        <div class="cap"><b>${esc(it.site)}</b><span>${esc(typeLabel(it.type))}</span></div></a>`;
    };
    row.innerHTML = items.map((id) => card(id, false)).join("") + items.map((id) => card(id, true)).join("");
  });

  // Specimen: real tokens for a few screens
  const SPEC = ["linear-pricing", "stripe-press-landing", "playdate-landing", "obsidian-landing", "hey-landing"].filter((id) => byId[id]);
  const tabs = $("#spec-tabs");
  tabs.innerHTML = SPEC.map((id, i) => `<button type="button" role="tab" aria-selected="${i === 0}" data-id="${esc(id)}">${esc(byId[id].site)} · ${esc(typeLabel(byId[id].type))}</button>`).join("");

  function swatches(list) {
    return `<div class="swatches">${[...new Set(list.filter(Boolean))].slice(0, 6)
      .map((c) => `<button type="button" class="swatch" data-copy="${esc(c)}" aria-label="Copy ${esc(c)}"><i style="background:${esc(c)}"></i><span>${esc(c)}</span></button>`).join("")}</div>`;
  }
  function renderSpec(id) {
    const it = byId[id];
    tabs.querySelectorAll("button").forEach((b) => b.setAttribute("aria-selected", b.dataset.id === id));
    $("#spec-shot").innerHTML = `<img src="${esc(it.screens.desktop.thumb)}" alt="${esc(it.site)} ${esc(typeLabel(it.type))} page">`;
    const ts = it.typeScale || {};
    const roles = ["h1", "h2", "h3", "body"].filter((r) => ts[r]).slice(0, 3);
    const c = it.colors || {};
    const b = (it.buttons || [])[0];
    $("#spec-info").innerHTML = `
      <div><h3>Why it is in the library</h3><p class="why">${esc(it.note)}</p></div>
      ${it.fonts.length ? `<div><h3>Fonts</h3><p class="why" style="font-size:15px">${it.fonts.map(esc).join(", ")}</p></div>` : ""}
      ${roles.length ? `<div><h3>Type scale</h3><div class="scale">${roles.map((r) => {
        const t = ts[r];
        return `<div class="scale-row"><span class="role">${r}</span><div><span class="sample" style="font-family:'${esc(t.font)}',var(--font);font-size:${Math.min(t.size, r === "body" ? 17 : 36)}px;font-weight:${esc(t.weight)}">${r === "body" ? "The quick brown fox" : "Aa Bb Cc"}</span><span class="spec">${esc(t.font)} ${t.size}px/${t.lineHeight} w${esc(t.weight)}</span></div></div>`;
      }).join("")}</div></div>` : ""}
      <div><h3>Colours</h3>${swatches([c.background, ...(c.surfaces || []), ...(c.text || [])])}</div>
      ${b ? `<div><h3>Primary button</h3><div class="btn-sample"><span class="b" style="${esc(`background:${b.bg};color:${b.color};border-radius:${b.radius};height:${Math.min(b.height || 36, 52)}px;padding:0 ${b.paddingX ?? 14}px;font-family:'${b.font}',var(--font);font-size:${b.size}px;font-weight:${b.weight}`)}">${esc(b.label || "Button")}</span><span class="spec">radius ${esc(b.radius)} · ${b.height}px high · ${b.paddingX}px sides</span></div></div>` : ""}
      <a class="visit" href="library.html#id=${esc(id)}">Open in the library →</a>`;
  }
  tabs.addEventListener("click", (e) => { const b = e.target.closest("[data-id]"); if (b) renderSpec(b.dataset.id); });
  if (SPEC.length) renderSpec(SPEC[0]);

  // Table of contents by page type
  const counts = {};
  LIB.forEach((x) => { counts[x.type] = (counts[x.type] || 0) + 1; });
  $("#toc").innerHTML = Object.keys(counts).sort((a, b) => counts[b] - counts[a] || a.localeCompare(b))
    .map((t) => `<li><a href="library.html#type=${encodeURIComponent(t)}"><span class="arrow">→</span>${esc(typeLabel(t))}<span class="leader"></span><span class="n">${String(counts[t]).padStart(3, "0")}</span></a></li>`)
    .join("");

  // Design systems, as one line of names
  const systems = [...new Map(LIB.filter((x) => x.type === "design-system").map((x) => [x.site, x])).values()]
    .sort((a, b) => a.site.localeCompare(b.site));
  $("#systems").innerHTML = systems
    .map((x) => `<a href="library.html#type=design-system&q=${encodeURIComponent(x.site)}">${esc(x.site)}</a>`)
    .join(' <span class="sep">/</span> ');

  // Copy and toast
  let timer;
  function toast(msg) {
    const t = $("#toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(timer); timer = setTimeout(() => t.classList.remove("show"), 1400);
  }
  document.addEventListener("click", async (e) => {
    const el = e.target.closest("[data-copy]");
    if (!el) return;
    try { await navigator.clipboard.writeText(el.dataset.copy); toast(el.dataset.copy.length > 20 ? "Copied" : "Copied " + el.dataset.copy); }
    catch (err) { toast("Copy not allowed here"); }
  });

  $("#theme").addEventListener("click", () => {
    const root = document.documentElement;
    const dark = root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    root.dataset.theme = dark ? "light" : "dark";
    try { localStorage.setItem("uitaste-theme", root.dataset.theme); } catch (err) {}
  });
})();
