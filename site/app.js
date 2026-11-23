(() => {
  // A first row of strong, varied pages; the rest follows alphabetically.
  const FEATURED = ["linear-pricing", "stripe-press-landing", "playdate-landing", "teenage-engineering-landing", "anthropic-landing", "obsidian-landing", "vercel-geist-overview", "pentagram-landing"];
  const rank = (it) => { const i = FEATURED.indexOf(it.id); return i < 0 ? 99 : i; };
  const ALL = (window.LIBRARY || []).slice().sort((a, b) => rank(a) - rank(b));
  const TYPE_LABELS = {
    all: "All", landing: "Landing", pricing: "Pricing", "design-system": "Design system",
    "404": "404", about: "About", careers: "Careers", contact: "Contact sales",
    integrations: "Integrations", developers: "Developers", brand: "Brand", auth: "Sign-up & login",
    product: "Product", changelog: "Changelog", docs: "Docs", customers: "Customers", blog: "Blog",
  };
  const typeLabel = (t) => TYPE_LABELS[t] || t.charAt(0).toUpperCase() + t.slice(1);
  // Tags that only repeat the page type are noise in the pattern list.
  const HIDDEN_TAGS = new Set(["design-system", "404", "pricing", "changelog", "docs", "blog", "careers", "about", "contact", "integrations", "brand", "auth", "product", "landing"]);

  const $ = (s, el = document) => el.querySelector(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const prettyTag = (t) => t.replace(/^ds-/, "").replace(/-/g, " ");

  const state = { type: "all", tags: [], q: "", platform: "desktop", id: null, shot: "desktop" };
  let visible = [];

  // ---------- state <-> URL hash ----------
  function readHash() {
    const p = new URLSearchParams(location.hash.slice(1));
    state.type = p.get("type") || "all";
    state.tags = (p.get("tags") || "").split(",").filter(Boolean);
    state.q = p.get("q") || "";
    state.platform = p.get("p") === "mobile" ? "mobile" : "desktop";
    state.id = p.get("id");
  }
  function writeHash() {
    const p = new URLSearchParams();
    if (state.type !== "all") p.set("type", state.type);
    if (state.tags.length) p.set("tags", state.tags.join(","));
    if (state.q) p.set("q", state.q);
    if (state.platform === "mobile") p.set("p", "mobile");
    if (state.id) p.set("id", state.id);
    const h = p.toString();
    history.replaceState(null, "", h ? "#" + h : location.pathname + location.search);
  }

  // ---------- filtering ----------
  function haystack(it) {
    return (it._h ||= [it.site, it.type, typeLabel(it.type), it.note, ...it.tags.map(prettyTag), ...it.fonts].join(" ").toLowerCase());
  }
  function matches(it, { ignoreTags = false, ignoreType = false } = {}) {
    if (!ignoreType && state.type !== "all" && it.type !== state.type) return false;
    if (!ignoreTags && state.tags.some((t) => !it.tags.includes(t))) return false;
    if (state.q) {
      const h = haystack(it);
      if (!state.q.toLowerCase().split(/\s+/).filter(Boolean).every((w) => h.includes(w))) return false;
    }
    return it.screens[state.platform];
  }

  // ---------- render ----------
  function renderTypes() {
    const counts = {};
    ALL.forEach((it) => { if (matches(it, { ignoreType: true })) counts[it.type] = (counts[it.type] || 0) + 1; });
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    const order = Object.keys(counts).sort((a, b) => counts[b] - counts[a] || a.localeCompare(b));
    if (state.type !== "all" && !order.includes(state.type)) order.push(state.type);
    $("#types").innerHTML = [["all", total], ...order.map((t) => [t, counts[t] || 0])]
      .map(([t, n]) => `<button type="button" role="tab" class="type-btn" data-type="${esc(t)}" aria-selected="${state.type === t}">${esc(typeLabel(t))}<span class="n">${n}</span></button>`)
      .join("");
  }

  function renderTags() {
    const freq = {};
    ALL.forEach((it) => {
      if (!matches(it, { ignoreTags: true })) return;
      it.tags.forEach((t) => { if (!HIDDEN_TAGS.has(t)) freq[t] = (freq[t] || 0) + 1; });
    });
    let tags = Object.keys(freq).filter((t) => freq[t] > 1).sort((a, b) => freq[b] - freq[a] || a.localeCompare(b)).slice(0, 28);
    state.tags.forEach((t) => { if (!tags.includes(t)) tags.unshift(t); });
    $("#tags").innerHTML = tags
      .map((t) => `<button type="button" class="tag" data-tag="${esc(t)}" aria-pressed="${state.tags.includes(t)}">${esc(prettyTag(t))}</button>`)
      .join("");
  }

  function dots(it) {
    const c = it.colors || {};
    const list = [...new Set([c.background, ...(c.surfaces || [])].filter(Boolean))].slice(0, 4);
    return list.map((x) => `<i style="background:${esc(x)}"></i>`).join("");
  }

  function renderGrid() {
    visible = ALL.filter((it) => matches(it));
    const grid = $("#grid");
    grid.classList.toggle("mobile", state.platform === "mobile");
    grid.innerHTML = visible
      .map((it, i) => {
        const s = it.screens[state.platform];
        return `<button type="button" class="card" data-id="${esc(it.id)}" aria-label="${esc(it.site)}, ${esc(typeLabel(it.type))}">
          <div class="frame"><img src="${esc(s.thumb)}" alt="" loading="${i < 8 ? "eager" : "lazy"}" decoding="async"><span class="hover-note">${esc(it.note)}</span></div>
          <div class="meta"><span class="name">${esc(it.site)}</span><span class="kind">${esc(typeLabel(it.type))}</span><span class="dots" aria-hidden="true">${dots(it)}</span></div>
        </button>`;
      })
      .join("");
    const sites = new Set(visible.map((v) => v.site)).size;
    $("#count").innerHTML = `<strong>${visible.length}</strong> ${visible.length === 1 ? "screen" : "screens"} from ${sites} ${sites === 1 ? "product" : "products"}`;
    $("#empty").hidden = visible.length > 0;
    $("#clear").hidden = !(state.type !== "all" || state.tags.length || state.q);
  }

  const COLLECTIONS = [
    { name: "Dark heroes", type: "landing", tags: ["dark"], pick: ["obsidian-landing", "linear-landing", "sentry-landing"] },
    { name: "Serif and editorial", tags: ["serif-display"], pick: [] },
    { name: "Illustrated worlds", tags: ["illustration-brand"], pick: [] },
    { name: "Photo-led", tags: ["photo-hero"], pick: [] },
    { name: "Prompt box as the hero", tags: ["prompt-box-hero"], pick: [] },
    { name: "Bold typography", tags: ["bold-typography"], pick: [] },
    { name: "Pricing pages", type: "pricing", tags: [], pick: ["linear-pricing", "kagi-pricing", "ghost-pricing"] },
    { name: "Design systems", type: "design-system", tags: [], pick: ["vercel-geist-overview", "radix-colors", "material-3-overview"] },
  ];
  function collItems(c) {
    return ALL.filter((it) => (!c.type || it.type === c.type) && c.tags.every((t) => it.tags.includes(t)) && it.screens.desktop);
  }
  function renderCollections() {
    const el = $("#collections");
    const show = state.type === "all" && !state.tags.length && !state.q;
    el.hidden = !show;
    if (!show || el.childElementCount) return;
    el.innerHTML = COLLECTIONS.map((c, i) => {
      const items = collItems(c);
      const picked = [...c.pick.map((id) => items.find((x) => x.id === id)).filter(Boolean), ...items].filter((x, j, arr) => arr.indexOf(x) === j).slice(0, 3);
      return `<button type="button" class="coll" data-coll="${i}">
        <div class="fan" aria-hidden="true">${picked.map((x) => `<img src="${esc(x.screens.desktop.thumb)}" alt="" loading="lazy">`).join("")}</div>
        <div class="coll-name"><b>${esc(c.name)}</b><span>${items.length}</span></div></button>`;
    }).join("");
  }
  $("#collections").addEventListener("click", (e) => {
    const b = e.target.closest("[data-coll]");
    if (!b) return;
    const c = COLLECTIONS[+b.dataset.coll];
    state.type = c.type || "all";
    state.tags = c.tags.slice();
    renderAll();
    $(".filters").scrollIntoView({ behavior: "smooth" });
  });

  function renderAll() {
    renderCollections();
    document.querySelectorAll(".bar-actions [data-platform]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.platform === state.platform));
    renderTypes();
    renderTags();
    renderGrid();
    writeHash();
  }

  // ---------- detail ----------
  const dialog = $("#detail");

  function scaleRows(it) {
    const roles = ["h1", "h2", "h3", "body"].filter((r) => it.typeScale[r]);
    if (!roles.length) return "";
    return `<section><h3>Type</h3><div class="scale">${roles
      .map((r) => {
        const t = it.typeScale[r];
        const size = Math.min(t.size, r === "body" ? 18 : 44);
        const ls = t.letterSpacing && t.letterSpacing !== "normal" ? ` · ls ${t.letterSpacing}` : "";
        return `<div class="scale-row"><span class="role">${r}</span><div>
          <span class="sample" style="font-family:'${esc(t.font)}',var(--font);font-size:${size}px;font-weight:${esc(t.weight)};letter-spacing:${esc(t.letterSpacing === "normal" ? "normal" : t.letterSpacing)}">${r === "body" ? "The quick brown fox jumps" : "Aa Bb Cc"}</span>
          <span class="spec">${esc(t.font)} ${t.size}px/${t.lineHeight} w${esc(t.weight)}${esc(ls)}</span></div></div>`;
      })
      .join("")}</div></section>`;
  }

  function swatchGroup(label, list) {
    list = [...new Set((list || []).filter(Boolean))];
    if (!list.length) return "";
    return `<div class="swatch-group"><div class="swatch-label">${label}</div><div class="swatches">${list
      .map((c) => `<button type="button" class="swatch" data-copy="${esc(c)}" aria-label="Copy ${esc(c)}"><i style="background:${esc(c)}"></i><span>${esc(c)}</span></button>`)
      .join("")}</div></div>`;
  }

  function buttonRows(it) {
    if (!it.buttons.length) return "";
    return `<section><h3>Buttons</h3><div class="buttons">${it.buttons
      .map((b) => {
        const style = `background:${b.bg};color:${b.color};border-radius:${b.radius};height:${Math.min(b.height || 36, 56)}px;padding:0 ${b.paddingX ?? 14}px;font-family:'${b.font}',var(--font);font-size:${b.size}px;font-weight:${b.weight}`;
        return `<div class="btn-sample"><span class="b" style="${esc(style)}">${esc(b.label || "Button")}</span>
          <span class="spec">${esc(b.bg)} · radius ${esc(b.radius)} · ${b.height}px high · ${b.paddingX}px sides</span></div>`;
      })
      .join("")}</div></section>`;
  }

  function renderDetail() {
    const it = ALL.find((x) => x.id === state.id);
    if (!it) return closeDetail();
    if (!it.screens[state.shot]) state.shot = it.screens.desktop ? "desktop" : "mobile";
    $("#d-title").textContent = it.site;
    $("#d-type").textContent = typeLabel(it.type);
    document.querySelectorAll("#detail [data-shot]").forEach((b) => {
      b.setAttribute("aria-pressed", b.dataset.shot === state.shot);
      b.disabled = !it.screens[b.dataset.shot];
    });
    const s = it.screens[state.shot];
    const shot = $("#d-shot");
    shot.className = "d-shot " + state.shot;
    shot.innerHTML = `<img src="${esc(s.full)}" alt="${esc(it.site)} ${esc(typeLabel(it.type))} page, ${state.shot}" width="${s.w}" height="${s.h}">`;
    shot.scrollTop = 0;

    const c = it.colors || {};
    $("#d-info").innerHTML = `
      <section>
        <h3>Why it is here</h3>
        <p class="note">${esc(it.note)}</p>
        <a class="visit" href="${esc(it.url)}" target="_blank" rel="noopener noreferrer">${esc(it.url.replace(/^https?:\/\//, "").replace(/\/$/, ""))} ↗</a>
      </section>
      ${it.tags.length ? `<section><h3>Patterns</h3><div class="d-tags">${it.tags.map((t) => `<button type="button" class="tag" data-filter-tag="${esc(t)}">${esc(prettyTag(t))}</button>`).join("")}</div></section>` : ""}
      ${it.fonts.length ? `<section><h3>Fonts</h3><ul class="fonts">${it.fonts.map((f) => `<li>${esc(f)}</li>`).join("")}</ul></section>` : ""}
      ${scaleRows(it)}
      ${c.background || (c.surfaces || []).length ? `<section><h3>Colours</h3>${swatchGroup("Background and surfaces", [c.background, ...(c.surfaces || [])])}${swatchGroup("Text", c.text)}</section>` : ""}
      ${buttonRows(it)}
      ${it.contentWidth ? `<section><h3>Content width</h3><p class="note" style="font-family:var(--mono);font-size:14px">${it.contentWidth}px</p></section>` : ""}
      <section><h3>Use it in Claude</h3><div class="cmd"><code>find_refs.py "${esc(it.site.toLowerCase())} ${esc(it.type)}"</code><button type="button" class="copy-btn" data-copy='python3 scripts/find_refs.py "${esc(it.site.toLowerCase())} ${esc(it.type)}"'>Copy</button></div></section>
    `;
    $("#d-info").scrollTop = 0;
    if (!dialog.open) { dialog.showModal(); shot.focus({ preventScroll: true }); }
    writeHash();
  }

  function openDetail(id) { state.id = id; state.shot = matchMedia("(max-width: 720px)").matches ? "mobile" : state.platform; renderDetail(); }
  function closeDetail() {
    state.id = null;
    if (dialog.open) dialog.close();
    writeHash();
  }
  function step(d) {
    const list = visible.length ? visible : ALL;
    const i = list.findIndex((x) => x.id === state.id);
    if (i < 0) return;
    state.id = list[(i + d + list.length) % list.length].id;
    renderDetail();
  }

  // ---------- toast and copy ----------
  let toastTimer;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 1400);
  }
  async function copy(text) {
    try { await navigator.clipboard.writeText(text); toast("Copied " + (text.length > 32 ? "command" : text)); }
    catch (e) { toast("Copy not allowed here"); }
  }

  // ---------- events ----------
  $("#types").addEventListener("click", (e) => {
    const b = e.target.closest("[data-type]");
    if (!b) return;
    state.type = b.dataset.type;
    renderAll();
  });
  $("#tags").addEventListener("click", (e) => {
    const b = e.target.closest("[data-tag]");
    if (!b) return;
    const t = b.dataset.tag;
    state.tags = state.tags.includes(t) ? state.tags.filter((x) => x !== t) : [...state.tags, t];
    renderAll();
  });
  let qTimer;
  $("#q").addEventListener("input", (e) => {
    clearTimeout(qTimer);
    qTimer = setTimeout(() => { state.q = e.target.value.trim(); renderAll(); }, 120);
  });
  document.querySelectorAll(".bar-actions [data-platform]").forEach((b) =>
    b.addEventListener("click", () => { state.platform = b.dataset.platform; renderAll(); })
  );
  $("#clear").addEventListener("click", () => {
    Object.assign(state, { type: "all", tags: [], q: "" });
    $("#q").value = "";
    renderAll();
  });
  $("#grid").addEventListener("click", (e) => {
    const c = e.target.closest(".card");
    if (c) openDetail(c.dataset.id);
  });
  $("#lib-home").addEventListener("click", (e) => {
    e.preventDefault();
    Object.assign(state, { type: "all", tags: [], q: "" });
    $("#q").value = "";
    renderAll();
    window.scrollTo({ top: 0 });
  });

  document.querySelectorAll("#detail [data-shot]").forEach((b) =>
    b.addEventListener("click", () => { state.shot = b.dataset.shot; renderDetail(); })
  );
  $("#prev").addEventListener("click", () => step(-1));
  $("#next").addEventListener("click", () => step(1));
  $("#close").addEventListener("click", closeDetail);
  dialog.addEventListener("close", () => { if (state.id) { state.id = null; writeHash(); } });
  dialog.addEventListener("click", (e) => {
    const cp = e.target.closest("[data-copy]");
    if (cp) return copy(cp.dataset.copy);
    const tg = e.target.closest("[data-filter-tag]");
    if (tg) {
      state.tags = [tg.dataset.filterTag];
      state.type = "all";
      closeDetail();
      renderAll();
      $(".filters").scrollIntoView({ behavior: "smooth" });
    }
  });

  document.addEventListener("keydown", (e) => {
    if (dialog.open) {
      if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
      return;
    }
    if (e.key === "/" && document.activeElement !== $("#q")) { e.preventDefault(); $("#q").focus(); }
    if (e.key === "Escape" && document.activeElement === $("#q")) { $("#q").blur(); }
  });

  $("#theme").addEventListener("click", () => {
    const root = document.documentElement;
    const dark = root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    root.dataset.theme = dark ? "light" : "dark";
    try { localStorage.setItem("uitaste-theme", root.dataset.theme); } catch (e) {}
  });

  // ---------- start ----------
  readHash();
  $("#q").value = state.q;
  const sites = new Set(ALL.map((x) => x.site)).size;
  $("#lede").textContent = `${ALL.length} real pages from ${sites} products known for their design, with the fonts, sizes, colours and buttons measured on the live page.`;
  renderAll();
  if (state.id) openDetail(state.id);
})();
