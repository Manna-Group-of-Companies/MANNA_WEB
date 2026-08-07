import { site } from "@/data/site";
import { PERFORMANCE_LABELS, type Product } from "@/data/products";

/**
 * Builds a self-contained, print-ready datasheet and triggers a download.
 * Generated client-side so the site stays fully static — no PDF service, no
 * server round-trip. Users can "Print → Save as PDF" from the opened file.
 */
export function buildDatasheetHtml(product: Product) {
  const rows = (items: string[]) =>
    items.map((i) => `<li>${escapeHtml(i)}</li>`).join("");

  const sizes = product.sizes.length
    ? product.sizes
        .map(
          (s) =>
            `<tr><td class="mono">${escapeHtml(s.code)}</td><td>${escapeHtml(s.fitment)}${
              s.hd ? " · Heavy duty" : ""
            }</td></tr>`,
        )
        .join("")
    : `<tr><td colspan="2" class="muted">Sizes confirmed at enquiry — send your fitment list.</td></tr>`;

  const specs = product.specs
    .map(
      (s) =>
        `<tr><td>${escapeHtml(s.label)}</td><td><strong>${escapeHtml(s.value)}</strong></td></tr>`,
    )
    .join("");

  const perf = (Object.keys(product.performance) as (keyof typeof product.performance)[])
    .map((k) => {
      const v = product.performance[k];
      return `<div class="bar-row">
        <span>${escapeHtml(PERFORMANCE_LABELS[k])}</span>
        <span class="bar"><i style="width:${v}%"></i></span>
        <span class="val">${v}</span>
      </div>`;
    })
    .join("");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(product.name)} — Datasheet | ${escapeHtml(site.name)}</title>
<style>
  :root { --o:#f47920; --ink:#131315; --mut:#65656a; --line:#e6e6e6; }
  * { box-sizing:border-box; }
  body { margin:0; font:15px/1.6 ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif; color:var(--ink); background:#f6f6f7; }
  .sheet { max-width:52rem; margin:0 auto; background:#fff; padding:0 0 3rem; }
  header { background:linear-gradient(120deg,#1c1c1e,#0d0d0e); color:#fff; padding:2.6rem 3rem 2.2rem; }
  header .eyebrow { color:var(--o); font-size:.72rem; letter-spacing:.22em; text-transform:uppercase; font-weight:700; margin:0 0 .7rem; }
  header h1 { margin:0; font-size:2.1rem; letter-spacing:-.03em; line-height:1.1; }
  header p { margin:.6rem 0 0; color:#ffffffa8; max-width:36rem; }
  .bar-top { height:6px; background:linear-gradient(90deg,#f79340,var(--o)); }
  main { padding:2.2rem 3rem; }
  section { margin-bottom:2.2rem; page-break-inside:avoid; }
  h2 { font-size:.74rem; letter-spacing:.2em; text-transform:uppercase; color:var(--o); margin:0 0 .9rem; }
  table { width:100%; border-collapse:collapse; font-size:.9rem; }
  td { padding:.55rem .2rem; border-bottom:1px solid var(--line); vertical-align:top; }
  td:first-child { color:var(--mut); width:45%; }
  .mono { font-family:ui-monospace,SFMono-Regular,Menlo,monospace; font-weight:600; color:var(--ink); }
  ul { margin:0; padding-left:1.1rem; font-size:.92rem; }
  li { margin:.3rem 0; }
  .grid2 { display:grid; grid-template-columns:1fr 1fr; gap:2rem; }
  .bar-row { display:grid; grid-template-columns:1fr 8rem 2rem; align-items:center; gap:.8rem; font-size:.86rem; margin:.45rem 0; }
  .bar { display:block; height:8px; background:#eeeef0; border-radius:99px; overflow:hidden; }
  .bar i { display:block; height:100%; background:linear-gradient(90deg,#f79340,var(--o)); border-radius:99px; }
  .val { text-align:right; font-variant-numeric:tabular-nums; color:var(--mut); }
  .note { font-size:.78rem; color:var(--mut); background:#faf9f8; border-left:3px solid var(--o); padding:.7rem .9rem; border-radius:0 8px 8px 0; }
  .muted { color:var(--mut); }
  footer { padding:1.6rem 3rem; border-top:1px solid var(--line); font-size:.8rem; color:var(--mut); }
  footer strong { color:var(--ink); }
  @media print { body { background:#fff; } .sheet { max-width:none; } @page { margin:14mm; } }
  @media (max-width:640px){ header,main,footer{padding-left:1.4rem;padding-right:1.4rem} .grid2{grid-template-columns:1fr} }
</style>
</head>
<body>
<div class="sheet">
  <div class="bar-top"></div>
  <header>
    <p class="eyebrow">${escapeHtml(site.shortName)} · Tyre Retreading</p>
    <h1>${escapeHtml(product.name)}</h1>
    <p>${escapeHtml(product.summary)}</p>
  </header>
  <main>
    <section>
      <h2>Overview</h2>
      <p style="margin:0;font-size:.94rem">${escapeHtml(product.description)}</p>
    </section>

    <section>
      <h2>Technical Specification</h2>
      <table>${specs}</table>
    </section>

    <section>
      <h2>Available Sizes${product.sizes.length ? ` (${product.sizes.length})` : ""}</h2>
      <table>${sizes}</table>
    </section>

    <section>
      <h2>Indicative Performance Profile</h2>
      ${perf}
      <p class="note">Indicative comparison between our own ranges on a 0–100 scale, intended
      for range selection. Not a substitute for testing in your duty cycle.</p>
    </section>

    <section class="grid2">
      <div>
        <h2>Applications</h2>
        <ul>${rows([...product.applications])}</ul>
      </div>
      <div>
        <h2>Key Features</h2>
        <ul>${rows([...product.features])}</ul>
      </div>
    </section>

    <section>
      <h2>Recommended For</h2>
      <ul>${rows([...product.recommendedFor])}</ul>
    </section>

    <section>
      <h2>Pricing</h2>
      <p class="note">All products are quoted on request. Price depends on range, size mix,
      order volume and destination. Send your size list for a quotation.</p>
    </section>
  </main>
  <footer>
    <strong>${escapeHtml(site.name)}</strong><br>
    ${escapeHtml(site.address.line1)}, ${escapeHtml(site.address.line2)}<br>
    ${escapeHtml(site.address.city)}, ${escapeHtml(site.address.state)} ${escapeHtml(site.address.postalCode)}, ${escapeHtml(site.address.country)}<br>
    ${escapeHtml(site.phoneDisplay)} · ${escapeHtml(site.email)} · ${escapeHtml(site.url)}
  </footer>
</div>
</body>
</html>`;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function downloadDatasheet(product: Product) {
  const html = buildDatasheetHtml(product);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Manna-Rubber-${product.abbr.replace(/[^\w-]/g, "")}-Datasheet.html`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
