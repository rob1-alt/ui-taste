(() => {
  const LIB = (window.LIBRARY || []).slice();
  const byId = Object.fromEntries(LIB.map((x) => [x.id, x]));
  const $ = (s, el = document) => el.querySelector(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const TYPE = {
    landing: "Landing page", pricing: "Pricing", "design-system": "Design system", "404": "404 page", about: "About",
    careers: "Careers", contact: "Contact", integrations: "Integrations", developers: "Developers", brand: "Brand",
    auth: "Sign-up", product: "Product page", changelog: "Changelog", docs: "Docs", customers: "Customers", blog: "Blog",
  };
  const typeLabel = (t) => TYPE[t] || t;
  const cleanFont = (f) => (f || "").replace(/^__/, "").replace(/_[0-9a-f]{6}$/, "").replace(/_Fallback.*$/, "");

  // ---- real counts ----
  const sites = new Set(LIB.map((x) => x.site)).size;
  const shots = LIB.reduce((n, x) => n + Object.keys(x.screens).length, 0);
  ["n-pages", "n-rows", "c-pages", "more-n"].forEach((id) => { const el = $("#" + id); if (el) el.textContent = LIB.length; });
  $("#n-sites").textContent = sites;
  $("#c-shots").textContent = shots;
  $("#c-date").textContent = LIB.map((x) => x.captured).sort().pop() || "";

  // ---- hero specimens: marks placed on the screenshot (percent of the 1440×1000 top), labels read from the measured tokens ----
  const SPECS = [
    { id: "lindy-landing", stage: "#f1e7d6", marks: [
      { x: 32, y: 11, w: 35, h: 19, side: "top", label: (t) => `${t.type.h1.font} ${t.type.h1.size}/${t.type.h1.lineHeight}` },
      { x: 67, y: 57, w: 10, h: 5, side: "right", label: (t) => `button ${t.btn.height}px · r ${parseInt(t.btn.radius)}` },
      { x: 9, y: 46, side: "dot", label: (t) => t.bg },
    ] },
    { id: "linear-pricing", stage: "#16171a", dark: true, marks: [
      { x: 5, y: 16, w: 10, h: 5, side: "right", label: (t) => `${t.type.h1.font} ${t.type.h1.size}/${t.type.h1.lineHeight} w${t.type.h1.weight}` },
      { x: 52, y: 78, w: 10, h: 4.5, side: "top", label: (t) => `${t.btns[1].height}px · r ${parseInt(t.btns[1].radius)} · ${t.btns[1].bg}` },
      { x: 92, y: 60, side: "dot", label: (t) => t.bg },
    ] },
    { id: "kagi-pricing", stage: "#fbecc9", marks: [
      { x: 42.5, y: 11, w: 15, h: 7.5, side: "right", label: (t) => `${t.type.h1.font} ${t.type.h1.size}/${t.type.h1.lineHeight} w${t.type.h1.weight}` },
      { x: 30.5, y: 32.5, w: 7, h: 4.5, side: "bottom", label: (t) => `${t.btn.height}px · r ${parseInt(t.btn.radius)} · ${t.btn.bg}` },
    ] },
    { id: "stripe-press-landing", stage: "#dfe6ee", marks: [
      { x: 8, y: 8.5, w: 50, h: 6, side: "bottom", label: (t) => `${t.type.h2.font} ${t.type.h2.size}/${t.type.h2.lineHeight} w${t.type.h2.weight}` },
      { x: 95, y: 40, side: "dot", label: (t) => t.bg },
    ] },
    { id: "hey-landing", stage: "#ece6fb", marks: [
      { x: 18, y: 31, w: 64, h: 18, side: "top", label: (t) => `${t.type.h1.font} ${t.type.h1.size}/${t.type.h1.lineHeight} w${t.type.h1.weight}` },
      { x: 37, y: 62, w: 25, h: 6.5, side: "right", label: () => "the one filled button" },
    ] },
  ].filter((s) => byId[s.id]);

  const stage = $("#stage"), img = $("#spec-img"), marks = $("#marks");
  function tokensOf(it) {
    return {
      type: it.typeScale || {}, bg: it.colors?.background || "",
      btn: (it.buttons || [])[0] || {}, btns: it.buttons || [],
    };
  }
  function show(i) {
    const s = SPECS[i], it = byId[s.id], t = tokensOf(it);
    stage.style.setProperty("--stage", s.stage);
    stage.classList.toggle("dark", !!s.dark);
    marks.classList.remove("on");
    img.classList.add("swap");
    const next = new Image();
    next.onload = () => {
      img.src = next.src; img.alt = `${it.site} ${typeLabel(it.type).toLowerCase()}: ${it.note}`;
      img.classList.remove("swap");
      marks.innerHTML = s.marks.map((m) => {
        let label = ""; try { label = m.label(t); } catch (e) { return ""; }
        const style = m.side === "dot" ? `left:${m.x}%;top:${m.y}%` : `left:${m.x}%;top:${m.y}%;width:${m.w}%;height:${m.h}%`;
        const side = m.side === "dot" ? "dot right" : m.side;
        return `<div class="mark ${side}" style="${style}"><span>${esc(label)}</span></div>`;
      }).join("");
      requestAnimationFrame(() => requestAnimationFrame(() => marks.classList.add("on")));
    };
    next.src = it.screens.desktop.thumb;
    $("#spec-link").textContent = it.site;
    $("#spec-link").href = `library.html#id=${encodeURIComponent(it.id)}`;
    $("#spec-type").textContent = typeLabel(it.type);
    const pal = [...new Set([it.colors?.background, ...(it.colors?.surfaces || []), ...(it.colors?.text || [])].filter(Boolean))].slice(0, 4);
    $("#stage-specs").innerHTML =
      it.fonts.slice(0, 2).map((f) => `<span class="chip">${esc(cleanFont(f))}</span>`).join("") +
      pal.map((c) => `<span class="chip"><i style="background:${esc(c)}"></i>${esc(c)}</span>`).join("");
    document.querySelectorAll("#switch button").forEach((b, j) => b.setAttribute("aria-selected", String(j === i)));
  }
  $("#switch").innerHTML = SPECS.map((s, i) => {
    const it = byId[s.id];
    return `<button type="button" role="tab" aria-selected="${i === 0}" data-i="${i}"><img src="${esc(it.screens.desktop.thumb)}" alt="">${esc(it.site)}</button>`;
  }).join("");
  $("#switch").addEventListener("click", (e) => { const b = e.target.closest("[data-i]"); if (b) { show(+b.dataset.i); stopCycle(); } });
  show(0);
  // gently cycle through the specimens until the visitor picks one
  let cur = 0, cycle = matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : setInterval(() => { cur = (cur + 1) % SPECS.length; show(cur); }, 6000);
  function stopCycle() { clearInterval(cycle); cycle = 0; }
  stage.addEventListener("pointerenter", stopCycle);

  // ---- index ----
  const counts = {};
  LIB.forEach((x) => { counts[x.type] = (counts[x.type] || 0) + 1; });
  const types = Object.keys(counts).sort((a, b) => counts[b] - counts[a] || a.localeCompare(b));
  const SHORT = { ...TYPE, landing: "Landing", product: "Product", "404": "404" };
  $("#filters").innerHTML = [["all", LIB.length], ...types.map((t) => [t, counts[t]])]
    .map(([t, n]) => `<button type="button" role="tab" data-type="${esc(t)}" aria-selected="${t === "all"}">${t === "all" ? "All" : esc(SHORT[t] || t)}<b>${n}</b></button>`).join("");
  const FIRST = ["stripe-press-landing", "linear-pricing", "playdate-landing", "anthropic-landing", "teenage-engineering-landing", "obsidian-landing", "kagi-pricing", "pentagram-landing", "vercel-geist-overview", "lindy-landing", "hey-landing", "cognition-landing"];
  const rank = (it) => { const i = FIRST.indexOf(it.id); return i < 0 ? 99 : i; };
  const ordered = LIB.slice().sort((a, b) => rank(a) - rank(b) || a.site.localeCompare(b.site));
  let type = "all", expanded = false;
  const PAGE = 12;
  function row(it, n) {
    const pal = [...new Set([it.colors?.background, ...(it.colors?.surfaces || []), ...(it.colors?.text || [])].filter(Boolean))].slice(0, 5);
    const h1 = it.typeScale?.h1?.size ? it.typeScale.h1 : it.typeScale?.h2;
    return `<li class="row"><a href="library.html#id=${encodeURIComponent(it.id)}">
      <span class="r-n">${String(n).padStart(3, "0")}</span>
      <span class="r-img"><img src="${esc(it.screens.desktop?.thumb || "")}" alt="" loading="lazy" decoding="async"></span>
      <span class="r-main">
        <span class="r-site">${esc(it.site)}</span>
        <span class="r-meta">${esc(typeLabel(it.type))}${it.fonts[0] ? " · " + esc(cleanFont(it.fonts[0])) : ""}</span>
        <span class="r-note">${esc(it.note)}</span>
      </span>
      <span class="r-pal" aria-hidden="true">${pal.map((c) => `<i style="background:${esc(c)}"></i>`).join("")}</span>
      <span class="r-h1">${h1?.size ? `<b>${h1.size}px</b>h1` : ""}</span>
    </a></li>`;
  }
  function renderRows() {
    const list = ordered.filter((x) => type === "all" || x.type === type);
    const shown = expanded ? list : list.slice(0, PAGE);
    $("#rows").innerHTML = shown.map((it, i) => row(it, i + 1)).join("");
    $("#n-rows").textContent = list.length;
    $(".more").hidden = expanded || list.length <= PAGE;
    $("#more-n").textContent = list.length;
  }
  $("#filters").addEventListener("click", (e) => {
    const b = e.target.closest("[data-type]"); if (!b) return;
    type = b.dataset.type; expanded = false;
    document.querySelectorAll("#filters button").forEach((x) => x.setAttribute("aria-selected", String(x === b)));
    renderRows();
  });
  $("#more").addEventListener("click", () => { expanded = true; renderRows(); });
  renderRows();

  // ---- review checklist (mirrors references/anti-slop.md) ----
  const CHECK = {
    Colour: ["No purple-to-blue or pink-to-orange hero gradient unless it is the brand.", "One accent colour, for action and state only.", "No glow or aurora blobs for atmosphere.", "Grey text passes contrast: 4.5:1 for body.", "Dark mode uses near-black surfaces in steps."],
    Type: ["One family, or a deliberate display and text pair.", "Two or three weights, not bold everywhere.", "A visible scale between h1, h2 and body.", "Tight line height on large headings, 1.5 to 1.7 on body.", "Lines of body text under about 75 characters."],
    Layout: ["Not everything centred: left-aligned text on a clear grid.", "No row of three identical emoji cards.", "Sections with different shapes, not one card grid repeated.", "Spacing on a scale: large between sections, small inside groups.", "Mobile designed, not squeezed: 44px targets, no sideways scroll."],
    Components: ["One radius family.", "Shadows only where something floats.", "One primary button per view.", "Icons from one set, no emoji as icons.", "Quiet borders, not black boxes everywhere."],
    Content: ["No invented customers, logos, ratings or numbers.", "No “Seamless”, “Supercharge”, “Unlock the power of”.", "Headlines say what the product does, buttons say what happens.", "Real screenshots over abstract blobs."],
    Motion: ["Short animations that explain a change.", "Respects reduced motion.", "Nothing fades in on scroll just to fade in."],
  };
  $("#checks").innerHTML = Object.entries(CHECK).map(([g, items]) =>
    `<div class="check-group"><h3>${g}</h3><ul>${items.map((t) => `<li>${esc(t)}</li>`).join("")}</ul></div>`).join("");

  // ---- measure mode: the page annotates itself with its computed values ----
  const ticks = $("#ticks"), rc = $("#ruler-cursor"), layer = $("#measure-layer"), toggle = $("#measure");
  function drawRuler() {
    let h = "";
    for (let x = 0; x <= innerWidth; x += 20) h += `<i class="${x % 100 ? "" : "major"}" style="left:${x}px" ${x % 100 ? "" : `data-n="${x}"`}></i>`;
    ticks.innerHTML = h;
  }
  addEventListener("pointermove", (e) => { rc.style.setProperty("--x", e.clientX + "px"); rc.firstElementChild.textContent = Math.round(e.clientX); }, { passive: true });
  const hex = (c) => { const m = c.match(/[\d.]+/g); return m ? "#" + m.slice(0, 3).map((n) => Math.round(+n).toString(16).padStart(2, "0")).join("") : c; };
  function measure() {
    layer.innerHTML = "";
    if (!document.body.classList.contains("measuring")) return;
    const sx = scrollX, sy = scrollY;
    const els = document.querySelectorAll("[data-measure], .head h2, .head-lede, .stage, .steps h3, .step-n, .sheet, .install-card, .row:first-child a");
    let html = "";
    for (const el of els) {
      const r = el.getBoundingClientRect(); if (!r.width) continue;
      const cs = getComputedStyle(el);
      const fam = cs.fontFamily.split(",")[0].replace(/["']/g, "");
      const lh = cs.lineHeight === "normal" ? "normal" : (parseFloat(cs.lineHeight) / parseFloat(cs.fontSize)).toFixed(2);
      const boxy = el.matches(".stage, .sheet, .install-card, .row a");
      const label = boxy
        ? `${Math.round(r.width)} × ${Math.round(r.height)} · radius ${cs.borderTopLeftRadius} · ${hex(cs.backgroundColor)}`
        : el.matches(".btn")
          ? `${Math.round(r.height)}px high · padding ${cs.paddingLeft} · radius ${cs.borderTopLeftRadius} · ${fam} ${parseFloat(cs.fontSize)}`
          : `${fam} ${parseFloat(cs.fontSize)}/${lh} · w${cs.fontWeight} · ${hex(cs.color)}`;
      html += `<div class="m-box" style="left:${r.left + sx}px;top:${r.top + sy}px;width:${r.width}px;height:${r.height}px"></div>
               <div class="m-tag" style="left:${r.left + sx}px;top:${r.top + sy}px">${esc(label)}</div>`;
    }
    layer.innerHTML = html;
  }
  function setMeasuring(on) {
    document.body.classList.toggle("measuring", on);
    toggle.setAttribute("aria-pressed", String(on));
    if (on) drawRuler();
    requestAnimationFrame(measure);
  }
  toggle.addEventListener("click", () => setMeasuring(!document.body.classList.contains("measuring")));
  addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "m" && !e.metaKey && !e.ctrlKey && !e.altKey && !/input|textarea/i.test(document.activeElement.tagName)) setMeasuring(!document.body.classList.contains("measuring"));
  });
  let rt; addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => { drawRuler(); measure(); }, 120); });
  new MutationObserver(() => document.body.classList.contains("measuring") && measure()).observe($("#rows"), { childList: true });

  // ---- copy ----
  let tt;
  const toast = (m) => { const t = $("#toast"); t.textContent = m; t.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => t.classList.remove("show"), 1400); };
  document.addEventListener("click", async (e) => {
    const b = e.target.closest("[data-copy]"); if (!b) return;
    try { await navigator.clipboard.writeText(b.dataset.copy); toast("Copied"); } catch (err) { toast("Copy not allowed here"); }
  });
})();
