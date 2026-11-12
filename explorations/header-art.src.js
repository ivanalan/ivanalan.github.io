import dunesUrl from "./assets/header/dunes.png";
import bostonUrl from "./assets/header/boston.webp";
import {
  ShaderMount, getShaderColorFromString as col,
  ShaderFitOptions, DitheringShapes, DitheringTypes,
  ditheringFragmentShader,
} from "@paper-design/shaders";

const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (id) => document.getElementById(id);
const el = (cls, tag = "div") => { const e = document.createElement(tag); if (cls) e.className = cls; return e; };

/* =====================================================================
   The page content: real copy, chips and covers from src/projects/*
   ===================================================================== */
const ICONS = {
  person: '<path fill="currentColor" d="M332.64 64.58C313.18 43.57 286 32 256 32c-30.16 0-57.43 11.5-76.8 32.38c-19.58 21.11-29.12 49.8-26.88 80.78C156.76 206.28 203.27 256 256 256s99.16-49.71 103.67-110.82c2.27-30.7-7.33-59.33-27.03-80.6M432 480H80a31 31 0 0 1-24.2-11.13c-6.5-7.77-9.12-18.38-7.18-29.11C57.06 392.94 83.4 353.61 124.8 326c36.78-24.51 83.37-38 131.2-38s94.42 13.5 131.2 38c41.4 27.6 67.74 66.93 76.18 113.75c1.94 10.73-.68 21.34-7.18 29.11A31 31 0 0 1 432 480"/>',
  "calendar-clear": '<path fill="currentColor" d="M480 128a64 64 0 0 0-64-64h-16V48.45c0-8.61-6.62-16-15.23-16.43A16 16 0 0 0 368 48v16H144V48.45c0-8.61-6.62-16-15.23-16.43A16 16 0 0 0 112 48v16H96a64 64 0 0 0-64 64v12a4 4 0 0 0 4 4h440a4 4 0 0 0 4-4ZM32 416a64 64 0 0 0 64 64h320a64 64 0 0 0 64-64V180a4 4 0 0 0-4-4H36a4 4 0 0 0-4 4Z"/>',
  analytics: '<path fill="currentColor" d="M456 128a40 40 0 0 0-37.23 54.6l-84.17 84.17a39.86 39.86 0 0 0-29.2 0l-60.17-60.17a40 40 0 1 0-74.46 0L70.6 306.77a40 40 0 1 0 22.63 22.63L193.4 229.23a39.86 39.86 0 0 0 29.2 0l60.17 60.17a40 40 0 1 0 74.46 0l84.17-84.17A40 40 0 1 0 456 128"/>',
  "logo-apple": '<path fill="currentColor" d="M349.13 136.86c-40.32 0-57.36 19.24-85.44 19.24c-28.79 0-50.75-19.1-85.69-19.1c-34.2 0-70.67 20.88-93.83 56.45c-32.52 50.16-27 144.63 25.67 225.11c18.84 28.81 44 61.12 77 61.47h.6c28.68 0 37.2-18.78 76.67-19h.6c38.88 0 46.68 18.89 75.24 18.89h.6c33-.35 59.51-36.15 78.35-64.85c13.56-20.64 18.6-31 29-54.35c-76.19-28.92-88.43-136.93-13.08-178.34c-23-28.8-55.32-45.48-85.79-45.48Z"/><path fill="currentColor" d="M340.25 32c-24 1.63-52 16.91-68.4 36.86c-14.88 18.08-27.12 44.9-22.32 70.91h1.92c25.56 0 51.72-15.39 67-35.11c14.72-18.77 25.88-45.37 21.8-72.66"/>',
};
const BRANDS = {
  qualtrics: { label: "Qualtrics", src: "../src/icons/xmMarkColor.svg", style: "height:auto;width:.875rem" },
  "ab-initio": { label: "Ab Initio", src: "../src/icons/AbInitioLogo.svg", style: "width:.75rem;height:.75rem" },
};
/* From src/components/CoverDither.tsx */
const BACKDROPS = {
  "quiet-ripple": { colorBack: "#171b22", colorFront: "#243040", shape: "ripple", size: 4.8, scale: .85, rotation: 0, strength: .55 },
  "deep-teal": { colorBack: "#0e1416", colorFront: "#1a2c2e", shape: "wave", size: 4.2, scale: .95, rotation: 6, strength: .5 },
  "night-indigo": { colorBack: "#101218", colorFront: "#222848", shape: "ripple", size: 5, scale: .8, rotation: 0, strength: .48 },
  "pine-simplex": { colorBack: "#12191c", colorFront: "#1e5245", shape: "simplex", size: 5.2, scale: .75, rotation: 0, strength: .17 },
  "cobalt-warp": { colorBack: "#171b22", colorFront: "#1831ec", shape: "warp", size: 5.2, scale: 1.6, rotation: 0, strength: .1 },
};
const person = (l) => ({ label: l, icon: "person" });
const year = (y) => ({ label: String(y), icon: "calendar-clear" });
const WORK = [
  { id: "survey-building-guidance", title: "Increasing guidance usage by 600% for 250k MAU", subtitle: "Replacing Expert Review with guidance survey builders actually use.", brand: "qualtrics", meta: [person("Designer"), year(2026)], backdrop: "quiet-ripple" },
  { id: "ab-initio-data-platform", title: "Launching a 0→1 platform in 6 months", subtitle: "Unifying three products into one data-wrangling platform.", brand: "ab-initio", meta: [person("Sole designer"), year(2024)], backdrop: "deep-teal" },
  { id: "ab-initio-active-decisions", title: "Leading a 1-year MVP without PM, users, or research", subtitle: "Automating marketing decisions on real-time customer metrics.", brand: "ab-initio", meta: [person("Lead designer"), year(2023)], backdrop: "night-indigo" },
];
const SIDE = [
  { id: "guardias", title: "DeGuardia", subtitle: "Shift scheduling for medical rotations.", meta: [{ label: "App development", icon: "logo-apple" }, { label: "30 downloads", icon: "analytics" }, year(2026)], backdrop: "pine-simplex" },
  { id: "table-layout-switcher", title: "Table Layout Switcher", subtitle: "Swap Figma table layouts without rebuilding.", meta: [{ label: "Figma plugin", mark: "../src/icons/figma.svg" }, { label: "100% adoption", icon: "analytics" }, year(2025)], backdrop: "cobalt-warp" },
];

const PATTERN = { fit: "none", scale: 1, rotation: 0, offsetX: 0, offsetY: 0, originX: .5, originY: .5, worldWidth: 0, worldHeight: 0 };
const sizing = (o = {}) => { const s = { ...PATTERN, ...o }; return { u_fit: ShaderFitOptions[s.fit], u_scale: s.scale, u_rotation: s.rotation, u_offsetX: s.offsetX, u_offsetY: s.offsetY, u_originX: s.originX, u_originY: s.originY, u_worldWidth: s.worldWidth, u_worldHeight: s.worldHeight }; };

function chip(m) {
  const lead = m.icon || m.mark;
  const inner = (m.mark ? `<img class="mark" src="${m.mark}" alt="">` : "") + (m.icon ? `<svg viewBox="0 0 512 512" aria-hidden="true">${ICONS[m.icon]}</svg>` : "") + m.label;
  return `<span class="chip ${lead ? "lead" : ""}" ${lead ? 'style="padding-right:.375rem"' : ""}>${inner}</span>`;
}
function cardHTML(c, i) {
  const brand = c.brand ? BRANDS[c.brand] : null;
  const chips = (brand ? `<span class="chip brand"><span class="tile"><img src="${brand.src}" alt="" style="${brand.style}"></span>${brand.label}</span>` : "") + c.meta.map(chip).join("");
  const base = `../src/projects/${c.id}/assets/`;
  const bd = BACKDROPS[c.backdrop];
  return `<a class="card reveal" href="#" style="--i:${i}">
    <div class="cover" style="background:${bd.colorBack}" data-backdrop="${c.backdrop}">
      <div class="dither" style="opacity:${bd.strength}"></div>
      <video muted loop playsinline autoplay preload="metadata" poster="${base}cover-poster.webp" width="1280" height="720">
        <source src="${base}cover-hevc.mp4" type='video/mp4; codecs="hvc1"'><source src="${base}cover.webm" type="video/webm">
      </video>
    </div>
    <div class="card-body"><div class="chiprow">${chips}</div><h2>${c.title}</h2><p>${c.subtitle}</p></div></a>`;
}

/** Covers sit on the same Paper dither the real site uses (frozen: it moves at ~0.07). */
function initCovers(panel) {
  panel.querySelectorAll(".cover[data-backdrop]").forEach((cover) => {
    if (cover.dataset.ready) return; cover.dataset.ready = "1";
    const p = BACKDROPS[cover.dataset.backdrop], host = cover.querySelector(".dither");
    new ShaderMount(host, ditheringFragmentShader, {
      u_colorBack: col(p.colorBack), u_colorFront: col(p.colorFront), u_shape: DitheringShapes[p.shape], u_type: DitheringTypes["4x4"], u_pxSize: p.size,
      ...sizing({ scale: p.scale, rotation: p.rotation }),
    }, undefined, 0, 0);
  });
}

(function renderTabs() {
  const root = $("tabs");
  root.innerHTML = `
    <div class="tablist reveal" style="--i:1" role="tablist" aria-label="Work collections">
      <button class="tab" role="tab" data-tab="work" aria-selected="true">Work</button>
      <button class="tab" role="tab" data-tab="side" aria-selected="false">Side projects</button></div>
    <div class="panel" data-panel="work">${WORK.map((c, i) => cardHTML(c, 2 + i)).join("")}</div>
    <div class="panel" data-panel="side" hidden>${SIDE.map((c, i) => cardHTML(c, 2 + i)).join("")}</div>`;
  root.querySelectorAll("a.card").forEach((a) => a.addEventListener("click", (e) => e.preventDefault()));
  initCovers(root.querySelector('[data-panel="work"]'));
  root.querySelectorAll(".tab").forEach((t) => t.addEventListener("click", () => {
    root.querySelectorAll(".tab").forEach((x) => x.setAttribute("aria-selected", String(x === t)));
    root.querySelectorAll(".panel").forEach((p) => { p.hidden = p.dataset.panel !== t.dataset.tab; if (!p.hidden) { initCovers(p); p.querySelectorAll("video").forEach((v) => v.play().catch(() => {})); } });
  }));
})();

/* =====================================================================
   Research
   ===================================================================== */
const REFS = [
  ["Esben Lorenzen", "https://www.esbenlorenzen.com/", "Full-bleed photo as the header, text straight on it. No canvas or shader in the markup: the photograph is the atmosphere.", "confirmed · image in markup", true],
  ["Paper Shaders", "https://shaders.paper.design/", "The library this site already ships. Dithering is the one behind your card covers, and the basis for all ten directions here.", "confirmed · site dependency", true],
  ["David Haz", "https://www.awwwards.com/inspiration/hero-david-haz-portfolio", "Animated-gradient hero on a designer portfolio (gradient / animation / typography).", "from listing · Awwwards tags", false],
  ["Satin Hero (21st.dev)", "https://21st.dev/@ham7a311/components/satin-hero.md", "Full-bleed WebGL portfolio hero with a draped-satin shader.", "from listing · search snippet", false],
  ["ShaderGradient", "https://shadergradient.co/", "Open-source animated 3D mesh gradients, common on Framer portfolios.", "from listing · search snippet", false],
  ["Bruno Simon", "https://bruno-simon.com/", "The extreme: the whole portfolio is a WebGL world.", "from listing · search snippet", false],
  ["Brittany Chiang", "https://brittanychiang.com/", "Cursor-following spotlight over a dark page: a quiet accent that still has personality.", "from memory · fetch was text only", false],
  ["Josh Comeau", "https://joshwcomeau.com/", "Personality via a theme-reactive illustrated portrait rather than a background.", "confirmed · image names in markup", true],
  ["Dennis Snellenberg", "https://www.dennissnellenberg.com/", "Oversized name and one photograph; motion carries it. Typography-first contrast case.", "partial · text only", false],
  ["Rauno Freiberg", "https://rauno.me/", "Almost no background at all: the restraint baseline every direction must beat.", "partial · text only", false],
];
$("refs").innerHTML = REFS.map(([n, u, d, v, ok]) => `<div class="ref"><b><a href="${u}" target="_blank" rel="noopener">${n}</a></b><span>${d}</span><span class="v ${ok ? "ok" : ""}">${v}</span></div>`).join("");

/* =====================================================================
   Art plumbing. A direction is build(ctx); ctx owns everything it makes so
   switching directions can tear it down (shaders, rAF loops, listeners).
   ===================================================================== */
const loadImg = (src) => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });

function mount(ctx, frag, uniforms, speed, frame = 0) {
  if (ctx.dead) return;
  const host = el("fill"); ctx.art.append(host);
  const m = new ShaderMount(host, frag, uniforms, undefined, reduced ? 0 : speed, frame);
  ctx.own(() => m.dispose());
}

/** Canvas tracking the art area (DPR aware), paused offscreen, pointer-aware. */
function liveCanvas(ctx, { draw, onResize, pointer = false }) {
  const art = ctx.art, c = el("", "canvas"); art.append(c);
  const g = c.getContext("2d");
  const st = { w: 0, h: 0, t: 0, px: -9999, py: -9999, visible: true };
  const render = () => { g.clearRect(0, 0, st.w, st.h); draw(g, st); };
  const fit = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    st.w = art.clientWidth; st.h = art.clientHeight;
    c.width = st.w * dpr; c.height = st.h * dpr; g.setTransform(dpr, 0, 0, dpr, 0, 0);
    onResize?.(st); render();
  };
  const ro = new ResizeObserver(fit); ro.observe(art);
  const io = new IntersectionObserver(([e]) => { st.visible = e.isIntersecting; }); io.observe(art);
  let last = 0, raf = 0;
  const loop = (now) => { raf = requestAnimationFrame(loop); if (!st.visible || now - last < 33) return; st.t += Math.min(now - last, 100) / 1000; last = now; render(); };
  if (!reduced) raf = requestAnimationFrame((n) => { last = n; loop(n); });
  if (pointer) {
    ctx.stage.addEventListener("pointermove", (e) => { const r = art.getBoundingClientRect(); st.px = e.clientX - r.left; st.py = e.clientY - r.top; }, { signal: ctx.signal });
    ctx.stage.addEventListener("pointerleave", () => { st.px = st.py = -9999; }, { signal: ctx.signal });
  }
  ctx.own(() => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); });
  fit();
}

/* ---- A. Halftone: a photo re-printed as dots, dark areas become ink ---- */
function halftone({ src, cell = 7, rgb, alpha = .5, cut = .6, gain = 2.4, zoom = 1, shiftY = 0, cx = .5, maxR = .55, wind = .12 }) {
  return async (ctx) => {
    const img = await loadImg(src); if (ctx.dead) return;
    let lum = new Float32Array(0), cols = 0, rows = 0;
    const off = document.createElement("canvas"), octx = off.getContext("2d", { willReadFrequently: true });
    const fill = `rgb(${rgb} / ${alpha})`;
    liveCanvas(ctx, {
      pointer: true,
      onResize: (s) => {
        cols = Math.ceil(s.w / cell) + 1; rows = Math.ceil(s.h / (cell * .87)) + 1;
        off.width = cols; off.height = rows;
        const k = (cols / img.width) * zoom, dw = img.width * k, dh = img.height * k;
        octx.drawImage(img, (cols - dw) * cx, -shiftY * dh, dw, dh);
        const d = octx.getImageData(0, 0, cols, rows).data; lum = new Float32Array(cols * rows);
        for (let i = 0; i < lum.length; i++) { const l = (d[i * 4] * .3 + d[i * 4 + 1] * .59 + d[i * 4 + 2] * .11) / 255; lum[i] = Math.min(1, Math.max(0, (cut - l) * gain)); }
      },
      draw: (g, s) => {
        g.fillStyle = fill;
        for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
          const l = lum[r * cols + c]; if (l < .04) continue;
          const x = c * cell + (r % 2 ? cell / 2 : 0), y = r * cell * .87;
          let rad = cell * maxR * l * (1 - wind + wind * Math.sin(x * .02 + y * .008 - s.t * 1.4));
          const dx = x - s.px, dy = y - s.py; rad *= 1 + .7 * Math.exp(-(dx * dx + dy * dy) / (2 * 70 * 70));
          g.beginPath(); g.arc(x, y, rad, 0, 6.2832); g.fill();
        }
      },
    });
  };
}

/* ---- B. Streak: a photo smeared horizontally into drifting light ---- */
function streak({ src, pos = "center 30%", inner = "", outer = "" }) {
  return (ctx) => {
    const wrap = el("drift");
    wrap.style.cssText = `inset:-10%;width:120%;height:120%;filter:url(#streak) ${outer}`;
    const p = el("photo"); p.style.backgroundImage = `url(${src})`; p.style.backgroundPosition = pos; if (inner) p.style.filter = inner;
    wrap.append(p); ctx.art.append(wrap);
  };
}

/* =====================================================================
   Warp lab. Everything here is the same Paper Dithering / warp shape that
   backs the Table Layout Switcher cover, moved around and faded in different ways.
   W (the current settings) drives both the art and the sidebar controls.
   ===================================================================== */
const ANCHORS = { tl: [0, 0], t: [.5, 0], tr: [1, 0], l: [0, .35], c: [.5, .35], r: [1, .35] };
const SWATCHES = [["#2b46f2", "cobalt"], ["#6272e0", "indigo"], ["#7a95d8", "slate"], ["#3fa5b2", "teal"], ["#46b08c", "pine"], ["#8f7cf0", "violet"], ["#e6c19c", "sand"]];
const W0 = { anchor: "tr", fade: "radial", reach: 900, scale: 1.2, rotation: 0, size: 5.2, type: "4x4", front: "#2b46f2", speed: .04, extra: null };

/** Overlay in --background that erases the pattern with distance from the anchor. */
function veilCSS(w) {
  const [ax, ay] = ANCHORS[w.anchor], p = `${ax * 100}% ${ay * 100}%`, r = w.reach, bg = "var(--background)";
  const a = (k) => `color-mix(in oklab, ${bg} ${k}%, transparent)`;
  switch (w.fade) {
    case "radial": return `radial-gradient(circle at ${p}, transparent 0, transparent ${r * .35}px, ${bg} ${r}px)`;
    case "ellipse": return `radial-gradient(ellipse ${r * .5}px ${r * 1.05}px at ${p}, transparent 0, transparent 30%, ${bg} 100%)`;
    case "steps": return `radial-gradient(circle at ${p}, transparent 0 ${r * .4}px, ${a(30)} ${r * .4}px ${r * .55}px, ${a(60)} ${r * .55}px ${r * .7}px, ${a(88)} ${r * .7}px ${r * .85}px, ${bg} ${r * .85}px)`;
    case "disc": return `radial-gradient(circle at ${p}, transparent 0 ${r * .5}px, ${bg} ${r * .5 + 2}px)`;
    default: return "none";
  }
}

function buildWarp(ctx, w) {
  const [ax, ay] = ANCHORS[w.anchor];
  [{ front: w.front, scale: w.scale, rotation: w.rotation, size: w.size, type: w.type }, ...(w.extra ? [w.extra] : [])].forEach((l) =>
    mount(ctx, ditheringFragmentShader, {
      u_colorBack: col("#00000000"), u_colorFront: col(l.front), u_shape: DitheringShapes.warp, u_type: DitheringTypes[l.type ?? w.type], u_pxSize: l.size ?? w.size,
      ...sizing({ scale: l.scale, rotation: l.rotation ?? 0, offsetX: (ax - .5) * .6 + (l.dx ?? 0), offsetY: (ay - .5) * .6 + (l.dy ?? 0) }),   // pull the pattern toward the anchor, but keep warp's dense centre in view
    }, w.speed, 2000));
  const v = veilCSS(w);
  if (v !== "none") { const veil = el(); veil.style.background = v; ctx.art.append(veil); }
}

const PRESETS = [
  { name: "Top right", group: "Position", o: 70, bias: .4, w: {},
    tag: "The baseline: the cobalt warp from Table Layout Switcher, anchored to the top-right corner with a soft radial fade. Folded bands emerge from the page edge." },
  { name: "Top left", group: "Position", o: 55, bias: 0, scrim: .4, w: { anchor: "tl", reach: 640 },
    tag: "Mirrored to the text side, with the left-dim switched off. Included to show the cost: the pattern now sits behind the name, so it needs a scrim and low intensity." },
  { name: "Right edge", group: "Position", o: 70, bias: .3, w: { anchor: "r", fade: "ellipse", reach: 820, rotation: 30 },
    tag: "Anchored to the middle of the right edge with a tall elliptical fade, so it reads as a column of folds beside the content rather than a corner." },
  { name: "Top edge", group: "Position", o: 42, bias: .5, w: { anchor: "t", fade: "band", scale: 1.5 },
    tag: "No radial fade at all: a full-width band along the top that only fades vertically. The flattest, most 'header banner' of the set." },
  { name: "Stepped fade", group: "Fade", o: 75, bias: .4, w: { fade: "steps", reach: 1050 },
    tag: "The fade is quantised into four bands instead of a smooth ramp, so even the falloff looks dithered. Most in keeping with the pixel texture." },
  { name: "Disc", group: "Fade", o: 80, bias: .2, w: { fade: "disc", reach: 820, scale: 1 },
    tag: "A hard-edged disc of warp cropped by the corner, like a porthole. Crisp where the others dissolve; the strongest graphic shape." },
  { name: "Haze", group: "Fade", o: 45, bias: .4, w: { reach: 1500, scale: 2, size: 4.6, speed: .03 },
    tag: "Very long radial fade and broad, slow folds. Barely there: a tint of cobalt that gives the corner depth without any visible pattern edge." },
  { name: "Slate fine", group: "Colour & grain", o: 80, bias: .4, w: { front: "#7a95d8", type: "2x2", size: 3, scale: 1.25, reach: 950 },
    tag: "Monochrome slate with a fine 2×2 grain. The calmest colourway, and closest to a neutral texture." },
  { name: "Pine chunky", group: "Colour & grain", o: 72, bias: .4, w: { front: "#46b08c", type: "8x8", size: 6.5, scale: 1.9, reach: 950 },
    tag: "Pine green with a coarse 8×8 matrix at 6.5px. Bigger, more deliberate pixels, picking up the DeGuardia cover colour." },
  { name: "Duo", group: "Colour & grain", o: 70, bias: .4, w: { reach: 1000, extra: { front: "#3fa5b2", scale: 2.6, rotation: 40, dx: -.04, dy: .06 } },
    tag: "Two warp layers: cobalt folds under a larger teal layer rotated 40°, so the bands cross. The only multi-hue one." },
];

const DIRS = PRESETS;
const noteOf = (w) => `warp · ${w.anchor} · ${w.fade} · reach ${w.reach} · scale ${w.scale} · ${w.type} px ${w.size}`;

/* =====================================================================
   Switcher + lab controls
   ===================================================================== */
const art = $("art"), stage = $("stage"), root = document.documentElement;
let live = null, current = -1, W = { ...W0 };

const effectiveScrim = () => Math.max(+$("scrim").value / 100, PRESETS[current]?.scrim ?? 0);

/** Tear down the current art and rebuild it from W. */
function render() {
  if (live) { live.ctx.dead = true; live.cleanups.forEach((f) => f()); live.ac.abort(); }
  art.replaceChildren(); art.className = "art";
  const cleanups = [], ac = new AbortController();
  const ctx = { art, stage, signal: ac.signal, dead: false, own: (f) => cleanups.push(f) };
  live = { ctx, cleanups, ac };
  Promise.resolve().then(() => buildWarp(ctx, W)).catch((e) => console.error(e));
  const code = document.querySelector("#about code"); if (code) code.textContent = noteOf(W);
}
let pending = 0;
const rerender = () => { cancelAnimationFrame(pending); pending = requestAnimationFrame(render); };

const setRange = (id, v, fmt = (x) => x) => { $(id).value = v; $(id + "Out").textContent = fmt(v); };
function syncControls() {
  document.querySelectorAll("#anchors button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.a === W.anchor)));
  $("fade").value = W.fade; $("type").value = W.type;
  setRange("reach", W.reach, (v) => v + "px"); setRange("scale", W.scale); setRange("rot", W.rotation, (v) => v + "°"); setRange("size", W.size, (v) => (+v).toFixed(1) + "px");
  document.querySelectorAll("#swatches button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.c === W.front)));
}

function select(i) {
  i = (i + PRESETS.length) % PRESETS.length;
  const d = PRESETS[current = i];
  W = { ...W0, ...d.w };
  art.style.setProperty("--bias", d.bias ?? 0);
  $("intensity").value = d.o ?? 100; $("intensity").dispatchEvent(new Event("input"));
  syncControls(); render();
  const n = String(i + 1).padStart(2, "0");
  document.querySelectorAll("#dirs button").forEach((b, k) => b.setAttribute("aria-current", String(k === i)));
  $("about").innerHTML = `<p><b style="color:#ececf0">${n} · ${d.name}</b></p><p>${d.tag}</p><code>${noteOf(W)}</code>`;
  stage.style.setProperty("--scrim", effectiveScrim());
  history.replaceState(null, "", "#" + n);
}

let lastGroup = "";
$("dirs").innerHTML = PRESETS.map((d, i) => {
  const head = d.group !== lastGroup ? `<h3 style="padding:${i ? 10 : 0}px 8px 4px">${(lastGroup = d.group)}</h3>` : "";
  return `${head}<button data-i="${i}"><span class="n">${String(i + 1).padStart(2, "0")}</span><span>${d.name}</span></button>`;
}).join("");
$("dirs").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) select(+b.dataset.i); });
addEventListener("keydown", (e) => {
  if (e.target.matches?.("input,textarea,select") || e.metaKey || e.ctrlKey) return;
  if (e.key === "ArrowDown" || e.key === "ArrowRight") { e.preventDefault(); select(current + 1); }
  if (e.key === "ArrowUp" || e.key === "ArrowLeft") { e.preventDefault(); select(current - 1); }
});

$("swatches").innerHTML = SWATCHES.map(([c, n]) => `<button data-c="${c}" title="${n}" style="background:${c}" aria-pressed="false"></button>`).join("");
$("anchors").addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b) return; W.anchor = b.dataset.a; syncControls(); rerender(); });
$("swatches").addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b) return; W.front = b.dataset.c; syncControls(); rerender(); });
$("fade").addEventListener("input", (e) => { W.fade = e.target.value; rerender(); });
$("type").addEventListener("input", (e) => { W.type = e.target.value; rerender(); });
[["reach", "reach", (v) => v + "px"], ["scale", "scale", (v) => v], ["rot", "rotation", (v) => v + "°"], ["size", "size", (v) => (+v).toFixed(1) + "px"]].forEach(([id, key, fmt]) =>
  $(id).addEventListener("input", (e) => { W[key] = +e.target.value; $(id + "Out").textContent = fmt(e.target.value); rerender(); }));

const bind = (id, fn) => { const inp = $(id), out = $(id + "Out"); const go = () => { out.textContent = fn(inp.value); }; inp.addEventListener("input", go); go(); };
bind("solid", (v) => { root.style.setProperty("--solid", v); return v + "%"; });
bind("height", (v) => { root.style.setProperty("--art-h", v + "px"); return v + "px"; });
bind("intensity", (v) => { root.style.setProperty("--art-o", v / 100); return v + "%"; });
bind("scrim", (v) => { stage.style.setProperty("--scrim", effectiveScrim()); return v; });

/* Copy the current look (preset name + every knob) as text you can paste back to me or into code. */
$("copy").addEventListener("click", async () => {
  const d = PRESETS[current];
  const out = {
    ...W,
    intensity: +$("intensity").value, solidUntil: +$("solid").value, artHeight: +$("height").value,
    leftDim: d.bias ?? 0, scrim: +effectiveScrim().toFixed(2),
  };
  const text = `Header art: ${d.name} (preset ${String(current + 1).padStart(2, "0")})\n${JSON.stringify(out, null, 2)}`;
  try { await navigator.clipboard.writeText(text); }
  catch { const t = document.createElement("textarea"); t.value = text; document.body.append(t); t.select(); document.execCommand("copy"); t.remove(); }
  const btn = $("copy"); btn.textContent = "Copied ✓"; btn.classList.add("done");
  setTimeout(() => { btn.textContent = "Copy settings"; btn.classList.remove("done"); }, 1400);
});

const start = parseInt(location.hash.slice(1), 10);
select(start >= 1 && start <= PRESETS.length ? start - 1 : 0);
