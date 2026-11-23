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
  document.querySelectorAll(".n-all").forEach((el) => { el.textContent = LIB.length; });
  $("#c-shots").textContent = shots;
  $("#c-date").textContent = LIB.map((x) => x.captured).sort().pop() || "";

  // ---- hero: the word TASTE spelled with every page of the library ----
  // desktop: 39 × 7 = 273, one line. mobile: 13 × 21 = 273, "TA / ST / E".
  const GLYPH = {
    T: ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
    A: ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
    S: ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
    E: ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
  };
  const LAYOUTS = {
    // one cell per page: the grid grows with the library and the word stays centred
    wide: (() => { const cols = Math.max(39, Math.ceil(LIB.length / 7)), o = Math.floor((cols - 39) / 2); return { cols, rows: 7, letters: [["T", 0, 5 + o], ["A", 0, 11 + o], ["S", 0, 17 + o], ["T", 0, 23 + o], ["E", 0, 29 + o]] }; })(),
    tall: (() => { const rows = Math.max(21, Math.ceil(LIB.length / 13)), o = Math.floor((rows - 21) / 2); return { cols: 13, rows, letters: [["T", o, 1], ["A", o, 7], ["S", 7 + o, 1], ["T", 7 + o, 7], ["E", 14 + o, 4]] }; })(),
  };
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const shuffle = (arr) => { for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; };
  const lum = (h) => { const m = /^#([0-9a-f]{6})$/i.exec(h || ""); if (!m) return 1; const n = parseInt(m[1], 16); return ((n >> 16) * 0.299 + ((n >> 8) & 255) * 0.587 + (n & 255) * 0.114) / 255; };
  const light = (x) => lum(x.colors?.background) > 0.6 && !x.tags.includes("dark");
  const STAR = ["stripe-press-landing", "playdate-landing", "kagi-pricing", "hey-landing", "lindy-landing", "netlify-landing", "duolingo-landing", "oatly-landing", "glossier-landing", "panic-landing", "cosmos-landing", "anthropic-landing", "basecamp-landing", "tailscale-landing", "mailchimp-landing", "notion-landing"];
  const starred = STAR.filter((id) => byId[id] && light(byId[id])).map((id) => byId[id]);
  const lightPages = [...starred, ...shuffle(LIB.filter((x) => light(x) && !STAR.includes(x.id)))];
  const mosaic = $("#mosaic");
  const tileSrc = (it) => it.screens.mobile?.tile || it.screens.mobile?.thumb || it.screens.desktop?.thumb;
  let cells = [], lit = new Set(), layout = null, centers = null;

  function buildMosaic() {
    const L = matchMedia("(max-width: 720px)").matches ? LAYOUTS.tall : LAYOUTS.wide;
    if (L === layout) return;
    layout = L; seed = 7;
    lit = new Set();
    L.letters.forEach(([ch, r0, c0]) => GLYPH[ch].forEach((line, r) => [...line].forEach((v, c) => { if (v === "1") lit.add((r0 + r) * L.cols + c0 + c); })));
    const litPages = lightPages.slice(0, lit.size);
    const rest = shuffle(LIB.filter((x) => !litPages.includes(x)));
    const pool = shuffle(litPages.slice());
    cells = [];
    for (let i = 0, a = 0, b = 0; i < L.cols * L.rows; i++) cells.push(lit.has(i) ? pool[a++] : rest[b++] || null);
    mosaic.style.setProperty("--cols", L.cols);
    mosaic.classList.remove("in");
    mosaic.innerHTML = cells.map((it, i) => {
      if (!it) return `<span class="tile off" data-i="${i}"></span>`;
      const col = i % L.cols, row = Math.floor(i / L.cols), on = lit.has(i);
      const delay = L === LAYOUTS.wide ? col * 14 + rnd() * 160 : row * 30 + rnd() * 120;
      return `<a class="tile${on ? "" : " off"}" href="library.html#id=${encodeURIComponent(it.id)}" data-i="${i}" style="--d:${Math.round(delay)}ms" aria-label="${esc(it.site)}, ${esc(typeLabel(it.type).toLowerCase())}"><img src="${esc(tileSrc(it))}" alt="" decoding="async"></a>`;
    }).join("");
    requestAnimationFrame(() => requestAnimationFrame(() => mosaic.classList.add("in")));
    centers = null;
  }
  buildMosaic();
  matchMedia("(max-width: 720px)").addEventListener("change", buildMosaic);

  // name of the hovered page
  const tiN = $("#ti-n"), tiText = $("#ti-text");
  const tileInfo = (a) => {
    const i = +a.dataset.i, it = cells[i]; if (!it) return;
    tiN.textContent = `Page ${String(i + 1).padStart(3, "0")} of ${LIB.length}`;
    tiText.innerHTML = `<b>${esc(it.site)}</b>${esc(typeLabel(it.type))} · ${esc(it.note.split(/[.:]/)[0])}`;
  };
  mosaic.addEventListener("pointerover", (e) => { const a = e.target.closest(".tile"); if (a) tileInfo(a); });
  mosaic.addEventListener("focusin", (e) => { const a = e.target.closest(".tile"); if (a) tileInfo(a); });

  // a torch: the dimmed pages light up around the pointer
  let px = -1e4, py = -1e4, torchRaf = 0;
  const measureCenters = () => { centers = [...mosaic.children].map((t) => { const r = t.getBoundingClientRect(); return [t, r.left + r.width / 2, r.top + r.height / 2 + scrollY]; }); };
  function torch() {
    torchRaf = 0;
    if (!centers) measureCenters();
    const R = 150;
    for (const [t, cx, cy] of centers) {
      if (!t.classList.contains("off")) continue;
      const d = Math.hypot(cx - px, cy - py);
      t.style.setProperty("--glow", d < R ? (1 - d / R).toFixed(2) : "0");
    }
  }
  if (matchMedia("(hover: hover)").matches) {
    mosaic.addEventListener("pointermove", (e) => { px = e.clientX; py = e.clientY + scrollY; if (!torchRaf) torchRaf = requestAnimationFrame(torch); });
    mosaic.addEventListener("pointerleave", () => { px = py = -1e4; torch(); });
    addEventListener("resize", () => { centers = null; });
  }

  // the word shimmers: now and then a page in a letter trades places with a light page outside it
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let hovering = false;
  mosaic.addEventListener("pointerenter", () => { hovering = true; });
  mosaic.addEventListener("pointerleave", () => { hovering = false; });
  function swapOnce() {
    if (hovering || document.hidden) return;
    const litIdx = [...lit], offLight = cells.map((it, i) => (it && !lit.has(i) && light(it) ? i : -1)).filter((i) => i >= 0);
    if (!offLight.length) return;
    for (let k = 0; k < 3; k++) {
      const a = litIdx[Math.floor(Math.random() * litIdx.length)], b = offLight[Math.floor(Math.random() * offLight.length)];
      [cells[a], cells[b]] = [cells[b], cells[a]];
      for (const i of [a, b]) {
        const t = mosaic.children[i], it = cells[i];
        t.classList.add("flip");
        setTimeout(() => {
          t.querySelector("img").src = tileSrc(it);
          t.href = `library.html#id=${encodeURIComponent(it.id)}`;
          t.setAttribute("aria-label", `${it.site}, ${typeLabel(it.type).toLowerCase()}`);
          t.classList.remove("flip");
        }, 220);
      }
    }
  }
  if (!still) setInterval(swapOnce, 1800);

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

  // ---- numbers: computed from the measured values of every page ----
  const med = (arr) => { const s = arr.slice().sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : 0; };
  const pct = (n, d) => Math.round((n / d) * 100);
  const h1s = LIB.map((x) => x.typeScale?.h1).filter((t) => t && t.size > 0);
  const bodies = LIB.map((x) => x.typeScale?.body).filter((t) => t && t.size > 0);
  const btns = LIB.map((x) => (x.buttons || [])[0]).filter(Boolean);
  const radius = (b) => parseFloat(b.radius) || 0;
  const weightCount = {}; h1s.forEach((t) => { const w = String(t.weight); weightCount[w] = (weightCount[w] || 0) + 1; });
  const topWeight = Object.entries(weightCount).sort((x, y) => y[1] - x[1])[0];
  const interN = LIB.filter((x) => /inter/i.test(x.fonts[0] || "")).length;
  const oneFamily = LIB.filter((x) => x.fonts.length === 1).length;
  const darkN = LIB.filter((x) => lum(x.colors?.background) < 0.3).length;
  const pills = btns.filter((b) => radius(b) >= 50).length;
  const heights = {}; btns.forEach((b) => { if (b.height) heights[b.height] = (heights[b.height] || 0) + 1; });
  const topHeight = Object.entries(heights).sort((x, y) => y[1] - x[1])[0];
  const bars = (vals, on) => `<div class="stat-viz" aria-hidden="true">${vals.map(([v, n]) => `<i class="${on(v) ? "on" : ""}" style="height:${Math.max(4, n)}%"></i>`).join("")}</div>`;
  const hist = (arr, lo, hi, step) => { const out = []; for (let v = lo; v <= hi; v += step) out.push([v, arr.filter((x) => x >= v && x < v + step).length]); const mx = Math.max(...out.map((o) => o[1])); return out.map(([v, n]) => [v, (n / mx) * 100]); };
  const h1Med = med(h1s.map((t) => t.size));
  const STATS = [
    { n: med(h1s.map((t) => t.size)), unit: "px", k: "Median headline size", p: `At a line height of ${med(h1s.map((t) => t.lineHeight).filter(Number.isFinite))}. Big, but tightly set.`, viz: bars(hist(h1s.map((t) => t.size), 16, 128, 8), (v) => v <= h1Med && v + 8 > h1Med) },
    { n: topWeight[0], unit: "", k: "Most common headline weight", p: `${topWeight[1]} of ${h1s.length} headlines are regular weight. Good pages rarely shout in bold.`, red: true },
    { n: pct(interN, LIB.length), unit: "%", k: "Set in Inter", p: "The default font is not the problem. What makes a page generated is how everything else is decided." },
    { n: pct(oneFamily, LIB.length), unit: "%", k: "Use a single typeface", p: `${oneFamily} pages load one family and nothing else. Most of the rest use two.` },
    { n: med(bodies.map((t) => t.size)), unit: "px", k: "Median body text", p: `At ${med(bodies.map((t) => t.lineHeight).filter(Number.isFinite))} line height. Not 18, not 14.` },
    { n: topHeight[0], unit: "px", k: "Most common button height", p: `${topHeight[1]} pages. Median ${med(btns.map((b) => b.height).filter(Boolean))}px: small, confident buttons.`, btn: true },
    { n: pct(pills, btns.length), unit: "%", k: "Pill buttons", p: `The rest are square-ish: ${pct(btns.filter((b) => radius(b) <= 8).length, btns.length)}% have a radius of 8px or less.` },
    { n: pct(darkN, LIB.length), unit: "%", k: "Dark pages", p: `${LIB.length - darkN} pages are light. Dark is a choice, not a default.` },
  ];
  $("#stats").innerHTML = STATS.map((s) => `<div class="stat">
      <span class="stat-n${s.red ? " red" : ""}">${esc(s.n)}<small>${s.unit}</small></span>
      <span class="stat-k">${esc(s.k)}</span>
      <p>${esc(s.p)}</p>
      ${s.viz || ""}${s.btn ? `<span class="stat-btn" style="height:${esc(s.n)}px">${esc(s.n)}px button</span>` : ""}
    </div>`).join("");

  // ---- fix the slop ----
  const FIXES = [
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
  const demo = $("#demo"), fixesEl = $("#fixes"), fsN = $("#fs-n");
  fixesEl.innerHTML = FIXES.map(([k, t]) => `<li><button type="button" data-fix="${k}" aria-pressed="false">${esc(t)}</button></li>`).join("");
  const updateScore = () => {
    const left = FIXES.length - demo.className.split(" ").filter((c) => c.startsWith("fix-")).length;
    fsN.textContent = left; fsN.classList.toggle("zero", left === 0);
    $(".fs-k").innerHTML = left ? "habits left<br>that read as generated" : "habits left.<br>Reads as designed.";
  };
  const setFix = (k, on) => {
    demo.classList.toggle("fix-" + k, on);
    fixesEl.querySelector(`[data-fix="${k}"]`).setAttribute("aria-pressed", String(on));
    updateScore();
  };
  fixesEl.addEventListener("click", (e) => { const b = e.target.closest("[data-fix]"); if (b) setFix(b.dataset.fix, b.getAttribute("aria-pressed") !== "true"); });
  let playing = 0;
  $("#fix-all").addEventListener("click", () => {
    clearTimeout(playing);
    const todo = FIXES.map(([k]) => k).filter((k) => !demo.classList.contains("fix-" + k));
    const step = () => { const k = todo.shift(); if (!k) return; setFix(k, true); playing = setTimeout(step, still ? 0 : 420); };
    step();
  });
  $("#fix-reset").addEventListener("click", () => { clearTimeout(playing); FIXES.forEach(([k]) => setFix(k, false)); });
  updateScore();

  // ---- review checklist (mirrors references/anti-slop.md) ----
  const CHECK = {
    Colour: ["No purple-to-blue or pink-to-orange hero gradient unless it is the brand.", "One accent colour, for action and state only.", "No glow or aurora blobs for atmosphere.", "Grey text passes contrast: 4.5:1 for body.", "Dark mode uses near-black surfaces in steps."],
    Type: ["One family, or a deliberate display and text pair.", "Two or three weights, not bold everywhere.", "A visible scale between h1, h2 and body.", "Tight line height on large headings, 1.5 to 1.7 on body.", "Lines of body text under about 75 characters."],
    Layout: ["Not everything centred: left-aligned text on a clear grid.", "No row of three identical emoji cards.", "Sections with different shapes, not one card grid repeated.", "Spacing on a scale: large between sections, small inside groups.", "Mobile designed, not squeezed: 44px targets, no sideways scroll."],
    Components: ["One radius family.", "Shadows only where something floats.", "One primary button per view.", "Icons from one set, no emoji as icons.", "Quiet borders, not black boxes everywhere."],
    Content: ["No invented customers, logos, ratings or numbers.", "No “Seamless”, “Supercharge”, “Unlock the power of”.", "Headlines say what the product does, buttons say what happens.", "Real screenshots over abstract blobs."],
    Motion: ["Short animations that explain a change.", "Respects reduced motion.", "Nothing fades in on scroll just to fade in."],
  };
  $("#n-checks").textContent = Object.values(CHECK).flat().length + " items";
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

  // ---- background: the fine grid brightens around the pointer, with page coordinates ----
  const spot = $("#bg-spot"), coord = $("#bg-coord");
  if (matchMedia("(hover: hover)").matches && spot) {
    let mx = 0, my = 0, raf = 0;
    const paint = () => {
      raf = 0;
      document.documentElement.style.setProperty("--mx", mx + "px");
      document.documentElement.style.setProperty("--my", my + "px");
      coord.textContent = `x ${Math.round(mx)} · y ${Math.round(my + scrollY)}`;
    };
    addEventListener("pointermove", (e) => {
      mx = e.clientX; my = e.clientY;
      const dark = e.target.closest(".hero, .masthead, .install-card, .demo-frame, .sheet, .stage");
      spot.classList.toggle("on", !dark); coord.classList.toggle("on", !dark);
      if (!raf) raf = requestAnimationFrame(paint);
    }, { passive: true });
    document.addEventListener("pointerleave", () => { spot.classList.remove("on"); coord.classList.remove("on"); });
  }

  // ---- copy ----
  let tt;
  const toast = (m) => { const t = $("#toast"); t.textContent = m; t.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => t.classList.remove("show"), 1400); };
  document.addEventListener("click", async (e) => {
    const b = e.target.closest("[data-copy]"); if (!b) return;
    try { await navigator.clipboard.writeText(b.dataset.copy); toast("Copied"); } catch (err) { toast("Copy not allowed here"); }
  });
})();
