/**
 * Generates branded placeholder SVG artwork so the site renders complete
 * before real photography is dropped in.
 *
 * Run: npm run assets
 *
 * REPLACE these files with real photography before launch — keep the same
 * paths and everything else keeps working.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, "..", "public");

/* Sampled from the MANNA Group logo */
const ORANGE = "#f47920";
const ORANGE_LT = "#f79340";
const GRAPHITE = "#4a4a4c";
const INK = "#0a0a0c";
const INK_2 = "#1a1a20";

/** Deterministic PRNG so regenerating assets doesn't churn the diff. */
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

function write(rel, svg) {
  const file = join(PUBLIC, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, svg.trim().replace(/\n\s*/g, "\n"), "utf8");
  console.log("  ✓", rel);
}

function writeBuffer(rel, buffer) {
  const file = join(PUBLIC, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, buffer);
  console.log("  ✓", rel, `(${(buffer.length / 1024).toFixed(1)} kB)`);
}

const defs = (id) => `
<defs>
  <linearGradient id="bg-${id}" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="${INK_2}"/>
    <stop offset="55%" stop-color="${INK}"/>
    <stop offset="100%" stop-color="#141419"/>
  </linearGradient>
  <radialGradient id="glow-${id}" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="${ORANGE}" stop-opacity="0.55"/>
    <stop offset="60%" stop-color="${ORANGE}" stop-opacity="0.12"/>
    <stop offset="100%" stop-color="${ORANGE}" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="acc-${id}" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="${ORANGE_LT}"/>
    <stop offset="100%" stop-color="${ORANGE}"/>
  </linearGradient>
  <pattern id="grid-${id}" width="48" height="48" patternUnits="userSpaceOnUse">
    <path d="M48 0H0V48" fill="none" stroke="#ffffff" stroke-opacity="0.05" stroke-width="1"/>
  </pattern>
</defs>`;

/* ── Tread-block pattern used on product cards ─────────────── */
function treadBand(id, x, y, w, h, rows, cols, skew, seed) {
  const r = rng(seed);
  const bw = w / cols;
  const bh = h / rows;
  let out = "";
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (r() < 0.14) continue;
      const bx = x + j * bw + bw * 0.1;
      const by = y + i * bh + bh * 0.12;
      const bwid = bw * 0.8;
      const bhei = bh * 0.76;
      const op = (0.28 + r() * 0.55).toFixed(2);
      out += `<rect x="${bx.toFixed(1)}" y="${by.toFixed(1)}" width="${bwid.toFixed(1)}" height="${bhei.toFixed(1)}" rx="${(bh * 0.18).toFixed(1)}" fill="url(#acc-${id})" opacity="${op}"/>`;
    }
  }
  return `<g transform="skewX(${skew})">${out}</g>`;
}

function productSvg({ id, label, rows, cols, skew, seed, arc }) {
  const W = 1200;
  const H = 900;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${label} placeholder artwork">
${defs(id)}
<rect width="${W}" height="${H}" fill="url(#bg-${id})"/>
<rect width="${W}" height="${H}" fill="url(#grid-${id})"/>
<ellipse cx="${W * 0.68}" cy="${H * 0.3}" rx="460" ry="380" fill="url(#glow-${id})"/>
<g opacity="0.95">
  <circle cx="${W / 2}" cy="${H / 2 + 40}" r="${arc}" fill="none" stroke="#ffffff" stroke-opacity="0.10" stroke-width="2"/>
  <circle cx="${W / 2}" cy="${H / 2 + 40}" r="${arc - 58}" fill="none" stroke="${ORANGE}" stroke-opacity="0.28" stroke-width="2"/>
  <circle cx="${W / 2}" cy="${H / 2 + 40}" r="${arc - 130}" fill="none" stroke="#ffffff" stroke-opacity="0.06" stroke-width="24"/>
</g>
<g clip-path="inset(0 0 0 0)">
  ${treadBand(id, 120, 300, 960, 300, rows, cols, skew, seed)}
</g>
<rect x="0" y="${H - 6}" width="${W}" height="6" fill="url(#acc-${id})"/>
<text x="72" y="${H - 72}" font-family="ui-sans-serif,system-ui,sans-serif" font-size="46" font-weight="700" fill="#ffffff" fill-opacity="0.92" letter-spacing="-1.5">${label}</text>
<text x="72" y="${H - 34}" font-family="ui-sans-serif,system-ui,sans-serif" font-size="21" font-weight="500" fill="${ORANGE_LT}" letter-spacing="3.5">MANNA RUBBER</text>
</svg>`;
}

/* ── Plant scenes for the gallery ─────────────────────────────
 *
 * Each category draws a recognisable subject on a nominal 1400×1000
 * stage, which is then scaled to *cover* the requested aspect. The
 * gallery crops panels hard, so cover keeps the subject in frame at
 * every span rather than letterboxing it. Still stylised placeholder
 * art — but a viewer can tell a curing chamber from a container.
 */

const STAGE_W = 1400;
const STAGE_H = 1000;

/** Curing chamber bank under a lit gantry. */
function stageFactory(id, r, v) {
  const n = 3 + (v % 2);
  let o = `<rect x="0" y="104" width="1400" height="22" fill="#ffffff" opacity="0.09"/>`;
  for (let i = 0; i < 5; i++) {
    const x = 130 + i * 290;
    o += `<rect x="${x}" y="126" width="12" height="78" fill="#ffffff" opacity="0.07"/>`;
    o += `<path d="M${x + 6} 214 L${x - 150} 1000 L${x + 162} 1000 Z" fill="${ORANGE}" opacity="0.06"/>`;
    o += `<circle cx="${x + 6}" cy="212" r="20" fill="${ORANGE_LT}" opacity="0.9"/>`;
  }
  for (let i = 0; i < n; i++) {
    const h = Math.min(150, 560 / n);
    const y = 300 + i * (620 / n);
    const w = 880 + r() * 300;
    const x = 120 + r() * 100;
    o += `<rect x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="${w.toFixed(0)}" height="${h.toFixed(0)}" rx="${(h / 2).toFixed(0)}" fill="#1c1c23" stroke="${ORANGE}" stroke-opacity="0.38" stroke-width="3"/>`;
    o += `<rect x="${(x + 20).toFixed(0)}" y="${(y + h * 0.18).toFixed(0)}" width="${(w - 40).toFixed(0)}" height="${(h * 0.2).toFixed(0)}" rx="${(h * 0.1).toFixed(0)}" fill="url(#acc-${id})" opacity="0.24"/>`;
    o += `<circle cx="${(x + w - 58).toFixed(0)}" cy="${(y + h / 2).toFixed(0)}" r="${(h * 0.26).toFixed(0)}" fill="none" stroke="${ORANGE_LT}" stroke-opacity="0.65" stroke-width="6"/>`;
    o += `<circle cx="${(x + 54).toFixed(0)}" cy="${(y + h / 2).toFixed(0)}" r="12" fill="${ORANGE}" opacity="0.55"/>`;
  }
  return o + `<rect x="0" y="944" width="1400" height="5" fill="#ffffff" opacity="0.12"/>`;
}

/** Calender rollers with a rubber sheet threading over them. */
function stageManufacturing(id, r, v) {
  let o = `<rect x="60" y="180" width="16" height="700" fill="#ffffff" opacity="0.07"/>`;
  o += `<rect x="1324" y="180" width="16" height="700" fill="#ffffff" opacity="0.07"/>`;
  o += `<path d="M40 620 C 240 640 220 280 450 420 S 740 150 900 430 S 1200 480 1400 540" fill="none" stroke="url(#acc-${id})" stroke-width="${28 + v * 5}" stroke-opacity="0.5" stroke-linecap="round"/>`;
  for (const [cx, cy, rad] of [
    [250, 430, 150],
    [610, 330, 190],
    [980, 440, 155],
    [1270, 600, 96],
  ]) {
    o += `<circle cx="${cx}" cy="${cy}" r="${rad}" fill="#15151b" stroke="#ffffff" stroke-opacity="0.14" stroke-width="9"/>`;
    o += `<circle cx="${cx}" cy="${cy}" r="${(rad * 0.56).toFixed(0)}" fill="none" stroke="${ORANGE}" stroke-opacity="0.45" stroke-width="8"/>`;
    o += `<circle cx="${cx}" cy="${cy}" r="${(rad * 0.13).toFixed(0)}" fill="${ORANGE_LT}" opacity="0.85"/>`;
  }
  o += `<rect x="110" y="872" width="1180" height="14" rx="7" fill="#ffffff" opacity="0.11"/>`;
  for (let i = 0; i < 14; i++)
    o += `<circle cx="${160 + i * 84}" cy="922" r="24" fill="none" stroke="${ORANGE}" stroke-opacity="${(0.2 + r() * 0.2).toFixed(2)}" stroke-width="6"/>`;
  return o;
}

/** Pyramid stack of coiled tread rolls, seen end-on. */
function stageProducts(id, r, v) {
  const coil = (cx, cy, rad) => {
    let s = `<circle cx="${cx}" cy="${cy}" r="${rad}" fill="#131318" stroke="${ORANGE}" stroke-opacity="0.42" stroke-width="4"/>`;
    for (let k = 1; k <= 4; k++)
      s += `<circle cx="${cx}" cy="${cy}" r="${(rad * (1 - k * 0.19)).toFixed(0)}" fill="none" stroke="url(#acc-${id})" stroke-opacity="${(0.46 - k * 0.07).toFixed(2)}" stroke-width="${(rad * 0.11).toFixed(0)}"/>`;
    return s + `<circle cx="${cx}" cy="${cy}" r="${(rad * 0.15).toFixed(0)}" fill="${INK}"/>`;
  };
  let o = "";
  for (const x of [310, 700, 1090]) o += coil(x, 760, 150);
  for (const x of [505, 895]) o += coil(x, 480, 150);
  o += coil(700 + (v % 2) * 90, 200, 150);
  return o + `<rect x="0" y="912" width="1400" height="6" fill="#ffffff" opacity="0.10"/>`;
}

/** Tread slab on the bench under a magnifier, with caliper and dial. */
function stageQuality(id, r, v) {
  let o = `<rect x="140" y="360" width="1120" height="400" rx="28" fill="#141419" stroke="#ffffff" stroke-opacity="0.1" stroke-width="3"/>`;
  o += treadBand(id, 170, 392, 1060, 336, 3, 9, 0, 7 + v);
  o += `<path d="M250 240 H610 M250 240 V318 M610 240 V318" fill="none" stroke="${ORANGE}" stroke-opacity="0.7" stroke-width="12" stroke-linecap="round"/>`;
  o += `<circle cx="930" cy="430" r="178" fill="#000000" fill-opacity="0.34" stroke="${ORANGE_LT}" stroke-width="14"/>`;
  o += `<circle cx="930" cy="430" r="146" fill="none" stroke="#ffffff" stroke-opacity="0.18" stroke-width="3"/>`;
  o += `<rect x="1042" y="536" width="150" height="32" rx="16" transform="rotate(45 1042 536)" fill="${ORANGE}" opacity="0.85"/>`;
  o += `<circle cx="360" cy="856" r="86" fill="#15151b" stroke="#ffffff" stroke-opacity="0.16" stroke-width="6"/>`;
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    o += `<line x1="${(360 + Math.cos(a) * 66).toFixed(0)}" y1="${(856 + Math.sin(a) * 66).toFixed(0)}" x2="${(360 + Math.cos(a) * 78).toFixed(0)}" y2="${(856 + Math.sin(a) * 78).toFixed(0)}" stroke="#ffffff" stroke-opacity="0.35" stroke-width="4"/>`;
  }
  return o + `<path d="M360 856 L406 800" stroke="${ORANGE_LT}" stroke-width="9" stroke-linecap="round"/>`;
}

/** Corrugated container being stuffed, pallets in the foreground. */
function stageExport(id, r, v) {
  let o = `<rect x="90" y="270" width="780" height="330" rx="12" fill="#121217" stroke="#ffffff" stroke-opacity="0.08" stroke-width="3"/>`;
  for (let i = 0; i < 18; i++)
    o += `<rect x="${120 + i * 42}" y="288" width="14" height="294" fill="#ffffff" opacity="0.04"/>`;
  o += `<rect x="280" y="392" width="1010" height="430" rx="14" fill="url(#acc-${id})" opacity="0.82"/>`;
  for (let i = 0; i < 23; i++)
    o += `<rect x="${306 + i * 42}" y="412" width="16" height="390" fill="#000000" opacity="0.17"/>`;
  o += `<rect x="1076" y="404" width="202" height="406" rx="8" fill="#000000" opacity="0.24"/>`;
  for (const bx of [1110, 1160, 1210])
    o += `<rect x="${bx}" y="420" width="12" height="374" rx="6" fill="#ffffff" opacity="0.22"/>`;
  o += `<rect x="0" y="856" width="1400" height="6" fill="#ffffff" opacity="0.12"/>`;
  for (let i = 0; i < 3; i++) {
    const x = 120 + i * 150 + (v % 2) * 40;
    o += `<rect x="${x}" y="880" width="120" height="24" rx="6" fill="#ffffff" opacity="0.09"/>`;
    o += `<rect x="${x + 10}" y="904" width="100" height="46" rx="6" fill="url(#acc-${id})" opacity="${(0.25 + r() * 0.25).toFixed(2)}"/>`;
  }
  return o;
}

/** Buffed casing on the stand with fresh tread being laid over the crown. */
function stageRetreading(id, r, v) {
  const cx = 470;
  const cy = 540;
  const rad = 296;
  let o = `<path d="M334 900 L402 690 H548 L616 900 Z" fill="#15151b" stroke="#ffffff" stroke-opacity="0.08" stroke-width="3"/>`;

  /* Casing: sidewall, bead ring, buffed crown. */
  o += `<circle cx="${cx}" cy="${cy}" r="${rad}" fill="#121217" stroke="#ffffff" stroke-opacity="0.15" stroke-width="10"/>`;
  o += `<circle cx="${cx}" cy="${cy}" r="${rad - 70}" fill="none" stroke="${ORANGE}" stroke-opacity="0.34" stroke-width="6"/>`;
  o += `<circle cx="${cx}" cy="${cy}" r="${rad - 148}" fill="${INK}" stroke="#ffffff" stroke-opacity="0.12" stroke-width="6"/>`;
  o += `<circle cx="${cx}" cy="${cy}" r="${rad - 214}" fill="none" stroke="${ORANGE_LT}" stroke-opacity="0.5" stroke-width="4"/>`;

  /* Rasp marks left across the buffed crown. */
  for (let i = 0; i < 44; i++) {
    const a = (i / 44) * Math.PI * 2;
    const r1 = rad - 14;
    const r2 = rad - 52 - r() * 14;
    o += `<line x1="${(cx + Math.cos(a) * r1).toFixed(0)}" y1="${(cy + Math.sin(a) * r1).toFixed(0)}" x2="${(cx + Math.cos(a) * r2).toFixed(0)}" y2="${(cy + Math.sin(a) * r2).toFixed(0)}" stroke="#ffffff" stroke-opacity="${(0.06 + r() * 0.1).toFixed(2)}" stroke-width="7"/>`;
  }

  /* Buffing rasp head riding the crown on its swing arm, and the dust it
     throws off the contact point. Sits low on the shoulder so it stays
     clear of the tread strip coming in overhead. */
  const hx = cx + rad + 104;
  const hy = cy + 84;
  o += `<path d="M${hx + 60} ${hy - 30} L1330 ${hy - 210}" stroke="#ffffff" stroke-opacity="0.1" stroke-width="26" stroke-linecap="round"/>`;
  o += `<rect x="${hx - 40}" y="${hy - 74}" width="240" height="148" rx="26" fill="#1c1c23" stroke="${ORANGE}" stroke-opacity="0.4" stroke-width="3"/>`;
  o += `<rect x="${hx - 16}" y="${hy - 44}" width="112" height="20" rx="10" fill="url(#acc-${id})" opacity="0.4"/>`;
  o += `<circle cx="${hx - 70}" cy="${hy}" r="62" fill="#15151b" stroke="${ORANGE_LT}" stroke-opacity="0.75" stroke-width="8"/>`;
  for (let i = 0; i < 18; i++) {
    const a = (i / 18) * Math.PI * 2;
    o += `<line x1="${(hx - 70 + Math.cos(a) * 44).toFixed(0)}" y1="${(hy + Math.sin(a) * 44).toFixed(0)}" x2="${(hx - 70 + Math.cos(a) * 60).toFixed(0)}" y2="${(hy + Math.sin(a) * 60).toFixed(0)}" stroke="${ORANGE}" stroke-opacity="0.6" stroke-width="6"/>`;
  }
  for (let i = 0; i < 16; i++)
    o += `<circle cx="${(hx - 150 - r() * 90).toFixed(0)}" cy="${(hy - 130 + r() * 250).toFixed(0)}" r="${(3 + r() * 8).toFixed(0)}" fill="${ORANGE_LT}" opacity="${(0.2 + r() * 0.4).toFixed(2)}"/>`;

  /* Tread strip feeding in from the applicator over the crown. */
  o += `<path d="M1400 ${300 + v * 40} L820 ${300 + v * 40} A ${rad + 46} ${rad + 46} 0 0 0 ${cx} ${cy - rad - 46}" fill="none" stroke="url(#acc-${id})" stroke-width="54" stroke-opacity="0.55" stroke-linecap="round"/>`;
  o += treadBand(id, 880, 274 + v * 40, 500, 52, 1, 8, -10, 31 + v);
  for (const [rx, ry] of [
    [900, 200 + v * 40],
    [1120, 200 + v * 40],
  ]) {
    o += `<circle cx="${rx}" cy="${ry}" r="76" fill="#15151b" stroke="#ffffff" stroke-opacity="0.14" stroke-width="8"/>`;
    o += `<circle cx="${rx}" cy="${ry}" r="26" fill="${ORANGE}" opacity="0.6"/>`;
  }

  return o + `<rect x="0" y="900" width="1400" height="8" fill="#ffffff" opacity="0.12"/>`;
}

/** Gear wheel drawn as a hub plus radial teeth — used by the machinery scene. */
function gear(cx, cy, rad, teeth) {
  let s = `<circle cx="${cx}" cy="${cy}" r="${rad}" fill="#16161c" stroke="${ORANGE}" stroke-opacity="0.45" stroke-width="5"/>`;
  for (let i = 0; i < teeth; i++) {
    const a = (i / teeth) * 360;
    s += `<rect x="${(cx - rad * 0.1).toFixed(0)}" y="${(cy - rad - rad * 0.16).toFixed(0)}" width="${(rad * 0.2).toFixed(0)}" height="${(rad * 0.22).toFixed(0)}" rx="3" fill="${ORANGE_LT}" opacity="0.55" transform="rotate(${a.toFixed(1)} ${cx} ${cy})"/>`;
  }
  s += `<circle cx="${cx}" cy="${cy}" r="${(rad * 0.42).toFixed(0)}" fill="none" stroke="#ffffff" stroke-opacity="0.14" stroke-width="6"/>`;
  return s + `<circle cx="${cx}" cy="${cy}" r="${(rad * 0.14).toFixed(0)}" fill="${ORANGE}" opacity="0.8"/>`;
}

/** Curing press between its platens, gear train and control console alongside. */
function stageMachinery(id, r, v) {
  /* Press frame: four tie-bar columns carrying top and bottom platens. */
  let o = `<rect x="150" y="150" width="700" height="60" rx="10" fill="#1c1c23" stroke="${ORANGE}" stroke-opacity="0.35" stroke-width="3"/>`;
  o += `<rect x="150" y="770" width="700" height="70" rx="10" fill="#1c1c23" stroke="${ORANGE}" stroke-opacity="0.35" stroke-width="3"/>`;
  for (const x of [186, 300, 690, 800])
    o += `<rect x="${x}" y="210" width="24" height="560" fill="#ffffff" opacity="0.08"/>`;

  /* Platens closed on the mould. */
  const gap = 40 + v * 22;
  o += `<rect x="230" y="${360 - gap / 2}" width="540" height="${68}" rx="8" fill="#15151b" stroke="#ffffff" stroke-opacity="0.13" stroke-width="4"/>`;
  o += `<rect x="230" y="${560 + gap / 2}" width="540" height="${68}" rx="8" fill="#15151b" stroke="#ffffff" stroke-opacity="0.13" stroke-width="4"/>`;
  o += `<ellipse cx="500" cy="494" rx="210" ry="${96 - gap / 3}" fill="#121217" stroke="url(#acc-${id})" stroke-width="8" stroke-opacity="0.8"/>`;
  o += `<ellipse cx="500" cy="494" rx="120" ry="${(96 - gap / 3) * 0.55}" fill="none" stroke="${ORANGE}" stroke-opacity="0.4" stroke-width="5"/>`;

  /* Steam and hydraulic lines feeding the platens. */
  for (let i = 0; i < 3; i++)
    o += `<path d="M850 ${300 + i * 170} C 960 ${300 + i * 170} 940 ${240 + i * 150} 1050 ${240 + i * 150}" fill="none" stroke="#ffffff" stroke-opacity="0.09" stroke-width="14" stroke-linecap="round"/>`;

  /* Gear train on the drive side. */
  o += gear(1130, 300, 130, 14);
  o += gear(1300, 452, 90, 11);
  o += gear(1120, 566, 66, 9);

  /* Control console with indicator lamps and a gauge. */
  o += `<rect x="1010" y="680" width="330" height="200" rx="18" fill="#1a1a20" stroke="#ffffff" stroke-opacity="0.12" stroke-width="3"/>`;
  for (let i = 0; i < 8; i++)
    o += `<circle cx="${1052 + (i % 4) * 62}" cy="${728 + Math.floor(i / 4) * 54}" r="15" fill="${i % 3 === v % 3 ? ORANGE_LT : "#ffffff"}" opacity="${i % 3 === v % 3 ? 0.85 : 0.12}"/>`;
  o += `<rect x="1040" y="822" width="270" height="28" rx="14" fill="url(#acc-${id})" opacity="0.3"/>`;

  return o + `<rect x="0" y="912" width="1400" height="8" fill="#ffffff" opacity="0.12"/>`;
}

/** Racked tread stock down a warehouse aisle, forklift working the bay. */
function stageWarehouse(id, r, v) {
  const shelves = [250, 470, 690];
  let o = "";

  /* Two rack runs — uprights, beams and the stock sitting on them. */
  for (const bay of [0, 1]) {
    const x0 = bay === 0 ? 80 : 760;
    const w = 560;
    for (const ux of [x0, x0 + w / 2, x0 + w])
      o += `<rect x="${ux}" y="180" width="18" height="700" fill="#ffffff" opacity="0.09"/>`;
    for (const y of shelves) {
      o += `<rect x="${x0}" y="${y}" width="${w + 18}" height="16" rx="4" fill="url(#acc-${id})" opacity="0.42"/>`;
      /* Coiled rolls stood on the shelf below each beam. */
      const n = 4 + ((bay + v) % 2);
      for (let i = 0; i < n; i++) {
        const cx = x0 + 70 + i * ((w - 60) / (n - 1));
        const rad = 54 + r() * 16;
        o += `<circle cx="${cx.toFixed(0)}" cy="${(y - rad - 12).toFixed(0)}" r="${rad.toFixed(0)}" fill="#131318" stroke="${ORANGE}" stroke-opacity="0.4" stroke-width="4"/>`;
        o += `<circle cx="${cx.toFixed(0)}" cy="${(y - rad - 12).toFixed(0)}" r="${(rad * 0.55).toFixed(0)}" fill="none" stroke="${ORANGE_LT}" stroke-opacity="0.35" stroke-width="${(rad * 0.2).toFixed(0)}"/>`;
        o += `<circle cx="${cx.toFixed(0)}" cy="${(y - rad - 12).toFixed(0)}" r="${(rad * 0.16).toFixed(0)}" fill="${INK}"/>`;
      }
    }
  }

  /* Aisle floor with a painted bay marking. */
  o += `<rect x="0" y="880" width="1400" height="8" fill="#ffffff" opacity="0.12"/>`;
  o += `<path d="M620 888 L560 1000 H840 L780 888 Z" fill="${ORANGE}" opacity="0.07"/>`;

  /* Forklift working the aisle: mast, body, wheels, palletised load. */
  const fx = 470 + (v % 2) * 340;
  o += `<rect x="${fx + 150}" y="560" width="20" height="300" fill="#ffffff" opacity="0.16"/>`;
  o += `<rect x="${fx + 186}" y="560" width="20" height="300" fill="#ffffff" opacity="0.16"/>`;
  o += `<path d="M${fx + 150} 800 H${fx + 300}" stroke="url(#acc-${id})" stroke-width="16" stroke-linecap="round"/>`;
  /* Palletised load on the forks. */
  o += `<rect x="${fx + 206}" y="694" width="116" height="88" rx="6" fill="url(#acc-${id})" opacity="0.5"/>`;
  o += `<rect x="${fx + 206}" y="782" width="116" height="18" rx="4" fill="#ffffff" opacity="0.12"/>`;
  /* Body, overhead guard and the wheels under it. */
  o += `<rect x="${fx - 20}" y="654" width="170" height="146" rx="14" fill="url(#acc-${id})" opacity="0.72"/>`;
  o += `<rect x="${fx - 4}" y="534" width="14" height="120" fill="#ffffff" opacity="0.14"/>`;
  o += `<rect x="${fx + 116}" y="534" width="14" height="120" fill="#ffffff" opacity="0.14"/>`;
  o += `<rect x="${fx - 16}" y="518" width="162" height="18" rx="9" fill="#ffffff" opacity="0.12"/>`;
  for (const [wx, wr] of [
    [fx + 14, 42],
    [fx + 124, 30],
  ])
    o += `<circle cx="${wx}" cy="${800 + (42 - wr)}" r="${wr}" fill="#101015" stroke="#ffffff" stroke-opacity="0.2" stroke-width="8"/>`;

  return o;
}

const STAGES = {
  Factory: stageFactory,
  Manufacturing: stageManufacturing,
  Products: stageProducts,
  Quality: stageQuality,
  Export: stageExport,
  Retreading: stageRetreading,
  Machinery: stageMachinery,
  Warehouse: stageWarehouse,
};

function scene({ id, label, category, seed, kind, variant = 0 }) {
  const W = 1400;
  const H = kind === "tall" ? 1800 : kind === "wide" ? 900 : 1200;
  const r = rng(seed);
  const draw = STAGES[category] ?? stageFactory;

  /* Cover-fit: scale by the larger ratio, then centre the overflow. */
  const s = Math.max(W / STAGE_W, H / STAGE_H);
  const tx = (W - STAGE_W * s) / 2;
  const ty = (H - STAGE_H * s) / 2;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${label}">
${defs(id)}
<rect width="${W}" height="${H}" fill="url(#bg-${id})"/>
<rect width="${W}" height="${H}" fill="url(#grid-${id})"/>
<ellipse cx="${W * 0.34}" cy="${H * 0.28}" rx="${W * 0.52}" ry="${H * 0.34}" fill="url(#glow-${id})"/>
<g transform="translate(${tx.toFixed(1)} ${ty.toFixed(1)}) scale(${s.toFixed(4)})">
${draw(id, r, variant)}
</g>
<rect x="56" y="56" width="${(category.length * 15 + 52).toFixed(0)}" height="52" rx="26" fill="#000000" fill-opacity="0.42" stroke="${ORANGE}" stroke-opacity="0.5"/>
<text x="82" y="90" font-family="ui-sans-serif,system-ui,sans-serif" font-size="22" font-weight="600" fill="${ORANGE_LT}" letter-spacing="1.5">${category}</text>
</svg>`;
}

/* ── Hero poster (shown until the video decodes) ───────────── */
function heroPoster() {
  const W = 1920;
  const H = 1080;
  const r = rng(99);
  let bands = "";
  for (let i = 0; i < 26; i++) {
    const x = i * (W / 26);
    bands += `<rect x="${x.toFixed(0)}" y="0" width="${(W / 26 - 22).toFixed(0)}" height="${H}" fill="url(#acc-hero)" opacity="${(0.03 + r() * 0.09).toFixed(3)}"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Tyre retreading production line">
${defs("hero")}
<rect width="${W}" height="${H}" fill="url(#bg-hero)"/>
<g transform="skewX(-12)">${bands}</g>
<rect width="${W}" height="${H}" fill="url(#grid-hero)"/>
<ellipse cx="${W * 0.62}" cy="${H * 0.42}" rx="720" ry="520" fill="url(#glow-hero)"/>
<circle cx="${W * 0.74}" cy="${H * 0.52}" r="330" fill="none" stroke="#ffffff" stroke-opacity="0.07" stroke-width="46"/>
<circle cx="${W * 0.74}" cy="${H * 0.52}" r="252" fill="none" stroke="${ORANGE}" stroke-opacity="0.22" stroke-width="3"/>
<circle cx="${W * 0.74}" cy="${H * 0.52}" r="150" fill="none" stroke="#ffffff" stroke-opacity="0.05" stroke-width="60"/>
<rect y="${H - 8}" width="${W}" height="8" fill="url(#acc-hero)"/>
</svg>`;
}

/**
 * Square app icon: white MANNA "M" on a flat orange tile.
 *
 * The M is a stroked polyline with round caps and joins — that is exactly the
 * letterform's construction (thick rounded strokes, stems splaying outward at
 * the baseline, middle vertex descending to ~63% of cap height), so it needs
 * no font and stays crisp at 16px.
 *
 * @param radius corner radius in viewBox units; 0 = flat square (favicon)
 */
function logoMark(radius = 0) {
  const S = 512;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${S} ${S}" width="${S}" height="${S}" role="img" aria-label="MANNA Group">
<rect width="${S}" height="${S}"${radius ? ` rx="${radius}"` : ""} fill="${ORANGE}"/>
<path d="M146 356 L180 148 L256 324 L332 148 L366 356"
      fill="none" stroke="#ffffff" stroke-width="94"
      stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
}

/** Minimal multi-size .ico wrapping PNG payloads (16/32/48). */
function buildIco(pngs) {
  const count = pngs.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(count, 4);

  let offset = 6 + count * 16;
  const entries = [];
  for (const { size, data } of pngs) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0); // width (0 => 256)
    e.writeUInt8(size >= 256 ? 0 : size, 1); // height
    e.writeUInt8(0, 2); // palette size
    e.writeUInt8(0, 3); // reserved
    e.writeUInt16LE(1, 4); // colour planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    entries.push(e);
    offset += data.length;
  }

  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.data)]);
}

/**
 * Wordmark placeholders written to public/brand/. Overwrite these two files
 * with the real vector and flip REAL_LOGO in src/components/ui/Logo.tsx.
 */
function wordmark(graphite) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 248 132" width="248" height="132" role="img" aria-label="MANNA Group">
<ellipse cx="112" cy="60" rx="105" ry="47" fill="none" stroke="${graphite}" stroke-width="8"/>
<text x="112" y="82" text-anchor="middle" font-family="ui-rounded,'Arial Rounded MT Bold',ui-sans-serif,system-ui,sans-serif" font-size="62" font-weight="800" letter-spacing="-2.5">
<tspan fill="${ORANGE}">MA</tspan><tspan fill="${graphite}">NN</tspan><tspan fill="${ORANGE}">A</tspan>
</text>
<text x="244" y="126" text-anchor="end" font-family="ui-rounded,'Arial Rounded MT Bold',ui-sans-serif,system-ui,sans-serif" font-size="27" font-weight="700" fill="${graphite}">Group</text>
<text x="240" y="22" text-anchor="end" font-family="ui-sans-serif,system-ui,sans-serif" font-size="15" fill="${graphite}">®</text>
</svg>`;
}

function ogImage() {
  const W = 1200;
  const H = 630;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
${defs("og")}
<rect width="${W}" height="${H}" fill="url(#bg-og)"/>
<rect width="${W}" height="${H}" fill="url(#grid-og)"/>
<ellipse cx="${W * 0.82}" cy="${H * 0.5}" rx="420" ry="360" fill="url(#glow-og)"/>
<circle cx="${W * 0.83}" cy="${H * 0.5}" r="196" fill="none" stroke="#ffffff" stroke-opacity="0.09" stroke-width="40"/>
<circle cx="${W * 0.83}" cy="${H * 0.5}" r="140" fill="none" stroke="${ORANGE}" stroke-opacity="0.35" stroke-width="3"/>
<text x="78" y="250" font-family="ui-sans-serif,system-ui,sans-serif" font-size="30" font-weight="600" fill="${ORANGE}" letter-spacing="5">MANNA RUBBER PRODUCTS</text>
<text x="78" y="345" font-family="ui-sans-serif,system-ui,sans-serif" font-size="76" font-weight="800" fill="#ffffff" letter-spacing="-3">Premium Tyre</text>
<text x="78" y="432" font-family="ui-sans-serif,system-ui,sans-serif" font-size="76" font-weight="800" fill="#ffffff" letter-spacing="-3">Retreading Solutions</text>
<text x="78" y="505" font-family="ui-sans-serif,system-ui,sans-serif" font-size="27" font-weight="500" fill="#ffffff" fill-opacity="0.62">30+ years · Rubber Park, Kerala · Exporting to Africa &amp; the Middle East</text>
<rect y="${H - 9}" width="${W}" height="9" fill="url(#acc-og)"/>
</svg>`;
}

/* ── Emit ───────────────────────────────────────────────────── */
console.log("Generating placeholder assets…");

const productDefs = [
  { id: "pctr", label: "PCTR — Pre-Cure Tread Rubber", rows: 3, cols: 11, skew: -14, seed: 11, arc: 330 },
  { id: "pctr-radial", label: "PCTR Radial", rows: 2, cols: 9, skew: -6, seed: 23, arc: 350 },
  { id: "pctr-nylon", label: "PCTR Nylon", rows: 4, cols: 13, skew: -20, seed: 37, arc: 310 },
  { id: "hot", label: "HOT — Hot Retreading", rows: 2, cols: 6, skew: -26, seed: 53, arc: 360 },
  { id: "pctr-off-road", label: "PCTR Off Road", rows: 2, cols: 5, skew: -30, seed: 71, arc: 340 },
];
for (const p of productDefs) write(`images/products/${p.id}.svg`, productSvg(p));

const galleryDefs = [
  { file: "factory-01", category: "Factory", label: "Manufacturing floor", kind: "tall", seed: 101 },
  { file: "factory-02", category: "Factory", label: "Curing chamber bank", kind: "square", seed: 102 },
  { file: "manufacturing-01", category: "Manufacturing", label: "Compound mixing line", kind: "wide", seed: 103 },
  { file: "manufacturing-02", category: "Manufacturing", label: "Tread extrusion line", kind: "wide", seed: 104 },
  { file: "products-01", category: "Products", label: "Tread rubber rolls", kind: "square", seed: 105 },
  { file: "products-02", category: "Products", label: "Hot process sections", kind: "tall", seed: 106 },
  { file: "quality-01", category: "Quality", label: "Cured tread inspection", kind: "square", seed: 107 },
  { file: "quality-02", category: "Quality", label: "Compound batch testing", kind: "square", seed: 108 },
  { file: "export-01", category: "Export", label: "Container loading", kind: "wide", seed: 109 },
  /* Second pass — brings every category to three scenes so the gallery's
     filtered views have enough panels to read as a gallery. */
  { file: "factory-03", category: "Factory", label: "Mill room and batch-off", kind: "square", seed: 110 },
  { file: "manufacturing-03", category: "Manufacturing", label: "Calendering and liner winding", kind: "wide", seed: 111 },
  { file: "products-03", category: "Products", label: "Cushion gum reels", kind: "square", seed: 112 },
  { file: "quality-03", category: "Quality", label: "Casing shearography check", kind: "tall", seed: 113 },
  { file: "export-02", category: "Export", label: "Export packing bay", kind: "square", seed: 114 },
  { file: "export-03", category: "Export", label: "Dispatch and documentation", kind: "wide", seed: 115 },
  /* Third pass — a fourth scene per category. */
  { file: "factory-04", category: "Factory", label: "Gantry and bay lighting", kind: "tall", seed: 116 },
  { file: "manufacturing-04", category: "Manufacturing", label: "Cooling festoon and take-off", kind: "square", seed: 117 },
  { file: "products-04", category: "Products", label: "Reclaimed rubber bales", kind: "wide", seed: 118 },
  { file: "quality-04", category: "Quality", label: "Dimensional gauge station", kind: "square", seed: 119 },
  { file: "export-04", category: "Export", label: "Container seal-off", kind: "tall", seed: 120 },
  /* Fourth pass — three further categories so the filter rail covers the
     retread process itself, the plant equipment and finished-goods storage. */
  { file: "retreading-01", category: "Retreading", label: "Casing buffing station", kind: "wide", seed: 121 },
  { file: "retreading-02", category: "Retreading", label: "Tread application", kind: "tall", seed: 122 },
  { file: "retreading-03", category: "Retreading", label: "Building drum and cushion gum", kind: "square", seed: 123 },
  { file: "retreading-04", category: "Retreading", label: "Cured retread final trim", kind: "wide", seed: 124 },
  { file: "machinery-01", category: "Machinery", label: "Curing press platens", kind: "square", seed: 125 },
  { file: "machinery-02", category: "Machinery", label: "Mixing mill gear train", kind: "tall", seed: 126 },
  { file: "machinery-03", category: "Machinery", label: "Extruder head and console", kind: "wide", seed: 127 },
  { file: "machinery-04", category: "Machinery", label: "Hydraulic press bank", kind: "square", seed: 128 },
  { file: "warehouse-01", category: "Warehouse", label: "Finished goods racking", kind: "wide", seed: 129 },
  { file: "warehouse-02", category: "Warehouse", label: "Palletised tread rolls", kind: "square", seed: 130 },
  { file: "warehouse-03", category: "Warehouse", label: "Graded stock bay", kind: "tall", seed: 131 },
  { file: "warehouse-04", category: "Warehouse", label: "Loading bay handling", kind: "wide", seed: 132 },
];
for (const g of galleryDefs)
  write(
    `images/gallery/${g.file}.svg`,
    /* `-01`…`-04` in the filename drives the structural variation, so the
       four scenes in a category are not the same drawing four times. */
    scene({ id: g.file, ...g, variant: Number(g.file.slice(-2)) - 1 }),
  );

write("images/hero-poster.svg", heroPoster());
write("images/og.svg", ogImage());
write("brand/manna-group.svg", wordmark(GRAPHITE));
write("brand/manna-group-dark.svg", wordmark("#f0f0f0"));
write("icon.svg", logoMark());
write("logo.svg", logoMark(96));

/* ── Raster icons ─────────────────────────────────────────────
   SVG favicons still aren't universal (older Safari, some Android
   launchers, Windows tiles), so rasterise the same artwork. */
const iconSvg = Buffer.from(logoMark().trim(), "utf8");

const png = (size) =>
  sharp(iconSvg, { density: 384 }).resize(size, size).png({ compressionLevel: 9 }).toBuffer();

const rasterSizes = [
  ["apple-icon.png", 180],
  ["icon-192.png", 192],
  ["icon-512.png", 512],
];

for (const [file, size] of rasterSizes) {
  writeBuffer(file, await png(size));
}

const icoParts = await Promise.all(
  [16, 32, 48].map(async (size) => ({ size, data: await png(size) })),
);
writeBuffer("favicon.ico", buildIco(icoParts));

console.log("Done. Replace these with real photography before launch.");
