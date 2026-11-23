"use client";
// Page-wide behaviour that is not tied to one component: the measure mode (ruler, boxes and labels read from
// the computed styles), the background grid that brightens around the pointer, and the copy buttons.
import { useEffect } from "react";

const esc = (s: unknown) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);

export function Effects() {
  useEffect(() => {
    const $ = <T extends HTMLElement = HTMLElement>(s: string) => document.querySelector<T>(s);
    const ticks = $("#ticks")!, rc = $("#ruler-cursor")!, layer = $("#measure-layer")!, toggle = $("#measure")!;
    const off: (() => void)[] = [];
    const on = <K extends keyof WindowEventMap>(t: EventTarget, k: K | string, f: EventListener, o?: AddEventListenerOptions) => { t.addEventListener(k, f, o); off.push(() => t.removeEventListener(k, f, o)); };

    // ---- measure mode: the page annotates itself with its computed values ----
    function drawRuler() {
      let h = "";
      for (let x = 0; x <= innerWidth; x += 20) h += `<i class="${x % 100 ? "" : "major"}" style="left:${x}px" ${x % 100 ? "" : `data-n="${x}"`}></i>`;
      ticks.innerHTML = h;
    }
    on(window, "pointermove", ((e: PointerEvent) => { rc.style.setProperty("--x", e.clientX + "px"); (rc.firstElementChild as HTMLElement).textContent = String(Math.round(e.clientX)); }) as EventListener, { passive: true });
    const hex = (c: string) => { const m = c.match(/[\d.]+/g); return m ? "#" + m.slice(0, 3).map((n) => Math.round(+n).toString(16).padStart(2, "0")).join("") : c; };
    function measure() {
      layer.innerHTML = "";
      if (!document.body.classList.contains("measuring")) return;
      const sx = scrollX, sy = scrollY;
      const els = document.querySelectorAll<HTMLElement>("[data-measure], .head h2, .head-lede, .stage, .steps h3, .step-n, .sheet, .install-card, .row:first-child a");
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
    function setMeasuring(v: boolean) {
      document.body.classList.toggle("measuring", v);
      toggle.setAttribute("aria-pressed", String(v));
      if (v) drawRuler();
      requestAnimationFrame(measure);
    }
    on(toggle, "click", () => setMeasuring(!document.body.classList.contains("measuring")));
    on(window, "keydown", ((e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "m" && !e.metaKey && !e.ctrlKey && !e.altKey && !/input|textarea/i.test((document.activeElement as HTMLElement).tagName)) setMeasuring(!document.body.classList.contains("measuring"));
    }) as EventListener);
    let rt: ReturnType<typeof setTimeout>;
    on(window, "resize", () => { clearTimeout(rt); rt = setTimeout(() => { drawRuler(); measure(); }, 120); });
    const rows = $("#rows");
    const mo = new MutationObserver(() => document.body.classList.contains("measuring") && measure());
    if (rows) mo.observe(rows, { childList: true });

    // ---- background: the fine grid brightens around the pointer, with page coordinates ----
    const spot = $("#bg-spot"), coord = $("#bg-coord");
    if (matchMedia("(hover: hover)").matches && spot && coord) {
      let mx = 0, my = 0, raf = 0;
      const paint = () => {
        raf = 0;
        document.documentElement.style.setProperty("--mx", mx + "px");
        document.documentElement.style.setProperty("--my", my + "px");
        coord.textContent = `x ${Math.round(mx)} · y ${Math.round(my + scrollY)}`;
      };
      on(window, "pointermove", ((e: PointerEvent) => {
        mx = e.clientX; my = e.clientY;
        const dark = (e.target as HTMLElement).closest?.(".hero, .masthead, .install-card, .demo-frame, .sheet, .stage");
        spot.classList.toggle("on", !dark); coord.classList.toggle("on", !dark);
        if (!raf) raf = requestAnimationFrame(paint);
      }) as EventListener, { passive: true });
      on(document, "pointerleave", () => { spot.classList.remove("on"); coord.classList.remove("on"); });
    }

    // ---- copy ----
    let tt: ReturnType<typeof setTimeout>;
    const toast = (m: string) => { const t = $("#toast")!; t.textContent = m; t.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => t.classList.remove("show"), 1400); };
    on(document, "click", ((e: Event) => {
      const b = (e.target as HTMLElement).closest<HTMLElement>("[data-copy]"); if (!b) return;
      navigator.clipboard.writeText(b.dataset.copy!).then(() => toast("Copied"), () => toast("Copy not allowed here"));
    }) as EventListener);

    return () => { off.forEach((f) => f()); mo.disconnect(); clearTimeout(rt); clearTimeout(tt); };
  }, []);
  return null;
}
