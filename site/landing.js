(() => {
  const LIB = (window.LIBRARY || []).slice();
  const byId = Object.fromEntries(LIB.map((x) => [x.id, x]));
  const $ = (s, el = document) => el.querySelector(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const TYPE = {
    landing: "Landing", pricing: "Pricing", "design-system": "Design system", "404": "404", about: "About",
    careers: "Careers", contact: "Contact", integrations: "Integrations", developers: "Developers", brand: "Brand",
    auth: "Sign-up", product: "Product", changelog: "Changelog", docs: "Docs", customers: "Customers", blog: "Blog",
  };
  const typeLabel = (t) => TYPE[t] || t;
  const pad = (n) => String(n).padStart(3, "0");

  // ---- counts, real ----
  const sites = new Set(LIB.map((x) => x.site)).size;
  const shots = LIB.reduce((n, x) => n + Object.keys(x.screens).length, 0);
  const last = LIB.map((x) => x.captured).sort().pop();
  for (const id of ["n-pages", "n-pages-2", "n-rows", "c-pages"]) { const el = $("#" + id); if (el) el.textContent = LIB.length; }
  $("#n-sites").textContent = sites;
  $("#c-shots").textContent = shots;
  $("#c-date").textContent = last || "";

  // ---- ruler ----
  const ticks = $("#ticks");
  function drawRuler() {
    const w = innerWidth; let html = "";
    for (let x = 0; x <= w; x += 25) {
      const major = x % 100 === 0;
      html += `<i class="${major ? "major" : ""}" style="left:${x}px" ${major ? `data-n="${x}"` : ""}></i>`;
    }
    ticks.innerHTML = html;
  }
  drawRuler();
  addEventListener("resize", drawRuler);
  const rc = $("#ruler-cursor");
  addEventListener("pointermove", (e) => { rc.style.setProperty("--x", e.clientX + "px"); rc.firstElementChild.textContent = Math.round(e.clientX); }, { passive: true });

  // ---- §1 specimen ----
  const fmtType = (t) => t ? `${t.font} ${t.size}/${t.lineHeight} w${t.weight}${t.letterSpacing && t.letterSpacing !== "normal" ? " ls " + t.letterSpacing : ""}` : null;
  const sw = (x) => `<i style="background:${esc(x)}"></i>${esc(x)}`;
  function renderSpec(id) {
    const it = byId[id]; if (!it || !it.screens.desktop) return;
    $("#spec-img").src = it.screens.desktop.thumb;
    $("#spec-img").alt = `${it.site} ${typeLabel(it.type)} page: ${it.note}`;
    $("#spec-link").textContent = `${it.site} · ${typeLabel(it.type).toLowerCase()}`;
    $("#spec-link").href = `library.html#id=${encodeURIComponent(id)}`;
    $("#spec-url").textContent = it.url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
    $("#spec-note").textContent = it.note;
    const c = it.colors || {}, b = (it.buttons || [])[0], ts = it.typeScale || {};
    const rows = [
      ["fonts", esc(it.fonts.join(", "))],
      ["h1", esc(fmtType(ts.h1) || fmtType(ts.h2))],
      ["body", esc(fmtType(ts.body))],
      ["background", c.background ? sw(c.background) : ""],
      ["text", (c.text || []).slice(0, 3).map(sw).join(" ")],
      ["button", b ? `"${esc(b.label)}" ${esc(b.bg)} on ${esc(b.color)} · r ${esc(b.radius)} · h ${b.height} · px ${b.paddingX}` : ""],
      ["width", it.contentWidth ? it.contentWidth + "px" : ""],
      ["captured", `${esc(it.captured)} · 1440 and 390`],
    ].filter(([, v]) => v && v !== "null");
    $("#redlines").innerHTML = rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("");
    document.querySelectorAll("[data-spec]").forEach((btn) => btn.setAttribute("aria-current", btn.dataset.spec === id));
  }
  renderSpec("lindy-landing");
  document.querySelectorAll("[data-spec]").forEach((btn) => btn.addEventListener("click", () => renderSpec(btn.dataset.spec)));
  const frame = $("#spec-frame");
  frame.addEventListener("pointermove", (e) => {
    const r = frame.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    frame.style.setProperty("--x", x + "px"); frame.style.setProperty("--y", y + "px");
    // coordinates in the captured page's pixels (1440 wide), not the thumbnail's
    $("#coord").textContent = `${Math.round(x / r.width * 1440)}, ${Math.round(y / r.width * 1440)}`;
  });

  // ---- §2 index ----
  const counts = {};
  LIB.forEach((x) => { counts[x.type] = (counts[x.type] || 0) + 1; });
  const types = Object.keys(counts).sort((a, b) => counts[b] - counts[a] || a.localeCompare(b));
  $("#type-filter").innerHTML = [["all", LIB.length], ...types.map((t) => [t, counts[t]])]
    .map(([t, n]) => `<button type="button" data-type="${esc(t)}" aria-pressed="${t === "all"}">${t === "all" ? "All" : esc(typeLabel(t))}<b>${n}</b></button>`).join("");
  const sorted = LIB.slice().sort((a, b) => a.site.localeCompare(b.site) || a.type.localeCompare(b.type));
  $("#index-rows").innerHTML = sorted.map((it, i) => {
    const h1 = it.typeScale?.h1 || it.typeScale?.h2;
    const bg = it.colors?.background;
    const pats = it.tags.filter((t) => !["light", "dark", "design-system", it.type].includes(t)).slice(0, 3).map((t) => t.replace(/^ds-/, "").replace(/-/g, " "));
    return `<tr data-id="${esc(it.id)}" data-type="${esc(it.type)}" tabindex="0">
      <td class="c-n">${pad(i + 1)}</td>
      <td class="c-site">${esc(it.site)}</td>
      <td>${esc(typeLabel(it.type))}</td>
      <td class="c-pat">${esc(pats.join(", "))}</td>
      <td class="c-font">${esc((it.fonts[0] || "").replace(/^__/, "").replace(/_[0-9a-f]{6}$/, "").replace(/_Fallback.*$/, ""))}</td>
      <td class="c-h1">${h1 ? `${h1.size}/${h1.lineHeight}` : ""}</td>
      <td class="c-bg">${bg ? sw(bg) : ""}</td>
    </tr>`;
  }).join("");
  const rows = [...document.querySelectorAll("#index-rows tr")];
  $("#type-filter").addEventListener("click", (e) => {
    const b = e.target.closest("[data-type]"); if (!b) return;
    const current = b.dataset.type;
    document.querySelectorAll("#type-filter button").forEach((x) => x.setAttribute("aria-pressed", x === b));
    let n = 0;
    rows.forEach((r) => { const show = current === "all" || r.dataset.type === current; r.hidden = !show; if (show) { n++; r.firstElementChild.textContent = pad(n); } });
    $("#n-rows").textContent = n;
  });
  const preview = $("#preview"), pimg = $("#preview img"), pcap = $(".preview-cap");
  let onRow = null;
  function showRow(tr) {
    if (!tr || tr === onRow) return;
    onRow?.classList.remove("on"); onRow = tr; tr.classList.add("on");
    const it = byId[tr.dataset.id]; if (!it?.screens.desktop) return;
    pimg.src = it.screens.desktop.thumb; preview.classList.add("show");
    pcap.innerHTML = `<b>${esc(it.site)} · ${esc(typeLabel(it.type).toLowerCase())}</b><br>${esc(it.note)}`;
  }
  $("#index-rows").addEventListener("pointerover", (e) => showRow(e.target.closest("tr")));
  $("#index-rows").addEventListener("focusin", (e) => showRow(e.target.closest("tr")));
  $("#index-rows").addEventListener("click", (e) => { const tr = e.target.closest("tr"); if (tr) location.href = `library.html#id=${encodeURIComponent(tr.dataset.id)}`; });
  $("#index-rows").addEventListener("keydown", (e) => { if (e.key === "Enter") e.target.closest("tr")?.click(); });
  showRow(rows[0]);

  // ---- §4 the checklist (mirrors references/anti-slop.md) ----
  const CHECK = {
    Colour: [
      "No purple-to-blue or pink-to-orange gradient as the hero background or headline fill, unless it is the brand.",
      "One accent colour, used for actions and state. Not on every heading, icon and border.",
      "No glow, neon or aurora blobs added for atmosphere.",
      "Grey text passes contrast: 4.5:1 for body, 3:1 for large text.",
      "Dark mode uses near-black surfaces in steps, not pure black with grey boxes.",
    ],
    Type: [
      "One family, or a deliberate display and text pair. Not three fonts.",
      "Two or three weights. No bold everywhere.",
      "A visible scale: the h1 clearly larger than h2, h2 than body.",
      "Large headings have tight line height and slightly negative tracking; body has 1.5 to 1.7.",
      "Lines of body text stay under about 75 characters.",
      "No text in all caps except short labels, which get letter spacing.",
    ],
    Layout: [
      "Not everything centred. Left-aligned text on a clear grid reads as designed.",
      "No row of three identical cards with an emoji, a two-word title and one line of text.",
      "Sections have different shapes: split, full-bleed, list, table, screenshot.",
      "Spacing follows a scale: large between sections, small inside groups.",
      "Content has a max width; nothing stretches across a 1920px screen.",
      "Mobile is designed, not squeezed: 44px targets, no horizontal scroll.",
    ],
    Components: [
      "One radius family. Not pills next to sharp cards next to rounded inputs.",
      "Shadows only where something floats. Cards use a border or a surface step.",
      "One primary button per view. Secondary actions look secondary.",
      "Icons from one set, one stroke width. No emoji as icons.",
      "Borders are quiet, not 1px black boxes everywhere.",
    ],
    Content: [
      "No invented customers, logos, testimonials, ratings, user counts or statistics.",
      "No “Seamless”, “Next-generation”, “Supercharge”, “Unlock the power of”.",
      "Headlines say what the product does for whom. Buttons say what happens.",
      "Real screenshots beat abstract 3D blobs and stock illustrations.",
    ],
    Motion: [
      "Animations are short, explain a change, and respect prefers-reduced-motion.",
      "Nothing fades in on scroll just to fade in. Content is readable without waiting.",
    ],
  };
  $("#checklist").innerHTML = Object.entries(CHECK).map(([g, items]) =>
    `<div class="check-group"><h3>${g}</h3><ul>${items.map((t) => `<li class="done">${esc(t)}</li>`).join("")}</ul></div>`).join("");

  // ---- measure mode: the page annotates itself with its real computed values ----
  const layer = $("#measure-layer");
  const toggle = $("#measure");
  const hex = (c) => { const m = c.match(/\d+(\.\d+)?/g); return m ? "#" + m.slice(0, 3).map((n) => Math.round(+n).toString(16).padStart(2, "0")).join("") : c; };
  function measure() {
    layer.innerHTML = "";
    if (!document.body.classList.contains("measuring")) return;
    const sy = scrollY, sx = scrollX;
    const main = $("main").getBoundingClientRect();
    layer.insertAdjacentHTML("beforeend", `<div class="m-dim" style="left:${main.left + sx + 24}px;top:${main.top + sy + 12}px;width:${main.width - 48}px"><span>${Math.round(main.width - 48)}</span></div>`);
    const targets = document.querySelectorAll("[data-measure], h2, .method-grid h3, .sec-lede, .index-table, .output pre, .cmd pre, .colophon dl, .spec-frame, .checklist li:first-child");
    for (const el of targets) {
      const r = el.getBoundingClientRect(); if (!r.width || !r.height) continue;
      const cs = getComputedStyle(el);
      const fam = cs.fontFamily.split(",")[0].replace(/["']/g, "");
      const lh = cs.lineHeight === "normal" ? "normal" : (parseFloat(cs.lineHeight) / parseFloat(cs.fontSize)).toFixed(2);
      const ls = cs.letterSpacing === "normal" ? "" : ` · ls ${cs.letterSpacing}`;
      const isBox = el.matches(".spec-frame, .index-table, .colophon dl");
      const tag = isBox
        ? `${Math.round(r.width)}×${Math.round(r.height)}${cs.borderTopWidth !== "0px" ? ` · border ${cs.borderTopWidth} ${hex(cs.borderTopColor)}` : ""}`
        : `${fam} ${cs.fontWeight} · ${parseFloat(cs.fontSize)}/${lh}${ls} · ${hex(cs.color)} · ${Math.round(r.width)}×${Math.round(r.height)}`;
      layer.insertAdjacentHTML("beforeend",
        `<div class="m-box" style="left:${r.left + sx}px;top:${r.top + sy}px;width:${r.width}px;height:${r.height}px"></div>
         <div class="m-tag" style="left:${r.left + sx}px;top:${r.top + sy - 2}px">${esc(tag)}</div>`);
    }
  }
  function setMeasuring(on) {
    document.body.classList.toggle("measuring", on);
    toggle.setAttribute("aria-pressed", String(on));
    measure();
  }
  toggle.addEventListener("click", () => setMeasuring(!document.body.classList.contains("measuring")));
  addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "m" && !e.metaKey && !e.ctrlKey && !e.altKey && !/input|textarea/i.test(document.activeElement.tagName)) setMeasuring(!document.body.classList.contains("measuring"));
  });
  let rt; addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(measure, 120); });

  // ---- current section in the nav ----
  const navLinks = [...document.querySelectorAll(".toc-nav a")];
  const secs = navLinks.map((a) => $(a.getAttribute("href"))).filter(Boolean);
  const io = new IntersectionObserver((es) => {
    es.forEach((en) => { if (en.isIntersecting) navLinks.forEach((a) => a.classList.toggle("current", a.getAttribute("href") === "#" + en.target.id)); });
  }, { rootMargin: "-40% 0px -55% 0px" });
  secs.forEach((s) => io.observe(s));

  // ---- copy ----
  let tt;
  const toast = (m) => { const t = $("#toast"); t.textContent = m; t.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => t.classList.remove("show"), 1400); };
  document.addEventListener("click", async (e) => {
    const b = e.target.closest("[data-copy]"); if (!b) return;
    try { await navigator.clipboard.writeText(b.dataset.copy); toast("Copied"); } catch (err) { toast("Copy not allowed here"); }
  });
})();
