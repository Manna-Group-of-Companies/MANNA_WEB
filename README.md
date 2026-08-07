# Manna Rubber Products — Tyre Retreading

A redesign of [mannarubber.com/our-products/tyre-retreading](https://www.mannarubber.com/our-products/tyre-retreading)
as a premium, interactive, conversion-focused industrial page.

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion · lucide-react

---

## Quick start

```bash
npm install
npm run assets     # generates branded placeholder artwork (already committed)
npm run dev        # http://localhost:3000
```

| Script | Does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run assets` | Regenerate placeholder SVG artwork |
| `npm run clean` | Delete `.next` and `.next-dev` |

> **Dev and production builds use separate output directories** — `next dev`
> writes to `.next-dev`, `next build` writes to `.next`. Sharing one folder lets
> a production client manifest leak into the dev server and fail with
> `Could not find the module …segment-explorer-node.js#SegmentViewNode in the
> React Client Manifest`. Configured in [`next.config.ts`](next.config.ts);
> hosting is unaffected because production still emits to `.next`.

---

## Before you go live

Three things need real content. Everything else is production-ready.

### 1. Hero video *(optional but recommended)*

Drop footage at:

```
public/videos/hero-retreading.webm   ← preferred
public/videos/hero-retreading.mp4    ← fallback
```

No file is needed for the page to work — the hero falls back to a branded
poster with the particle field and floating tyre graphics over it, and the
`<video>` element hides itself silently on error.

Keep it short (8–15s), muted, and under ~4 MB.

### 2. The real logo vector

The brand lockup currently renders as an **inline SVG approximation** built from
the loaded display font — outlined ellipse, "MA"/"A" in orange, "NN" in
graphite, "Group" bottom-right. It's on-brand but it is *not* your actual
letterforms.

To use the real mark:

1. Save the vector as `public/brand/manna-group.svg`
2. In [`src/components/ui/Logo.tsx`](src/components/ui/Logo.tsx), set
   `REAL_LOGO = true` and update `INTRINSIC` to your file's real dimensions
   (it only establishes the aspect ratio)

Nothing else changes — `<Logo />` is sized entirely by CSS height classes at
each call site (`h-12 lg:h-16` in the header, `h-14 lg:h-16` in the footer,
`h-20 sm:h-24` on the loader) and width follows the ratio. Never pass an inline
height: it beats the responsive classes. Two more notes:

- **Dark mode.** The graphite half of the logo disappears on the near-black
  header, footer and loader. The inline version solves this with
  `--logo-graphite`, which flips to near-white under `.dark`. If your vector
  hard-codes `#4a4a4c`, either change those fills to `currentColor` or supply a
  second light-on-dark file and point `darkSrc` at it.
- **Square contexts.** The wordmark is ~2:1 and can't square well, so the
  favicon and app icons use the MANNA "M" on an orange tile. The M is drawn as
  a stroked polyline (round caps and joins) rather than set in a font, so it
  needs no webfont and stays exact at 16px. Geometry lives in two places that
  must stay in sync: `logoMark()` in
  [`scripts/generate-assets.mjs`](scripts/generate-assets.mjs) and `LogoMark`
  in [`Logo.tsx`](src/components/ui/Logo.tsx).

  `npm run assets` rasterises it with sharp into the full icon set:

  | File | Used by |
  | --- | --- |
  | `favicon.ico` | legacy browsers (16/32/48 in one file) |
  | `icon.svg` | modern browsers |
  | `apple-icon.png` (180) | iOS home screen |
  | `icon-192.png`, `icon-512.png` | Android / PWA, via `manifest.webmanifest` |

**Brand colours** are sampled from the logo image, not from a brand guide:
`--color-brand-500: #f47920` (orange) and `--color-ink-700: #4a4a4c`
(graphite), both in [`globals.css`](src/app/globals.css). If you have exact
values, change those two lines — the rest of the palette derives from them.

### 3. Photography

Replace the generated SVGs, keeping the same paths so nothing else changes:

```
public/images/products/{pctr,pctr-radial,pctr-nylon,hot,pctr-off-road}.svg
public/images/gallery/{factory,manufacturing,products,quality,export}-0*.svg
public/images/hero-poster.svg
public/images/og.svg
```

Real raster photos (`.jpg`/`.webp`) get automatic AVIF/WebP conversion and
responsive `srcset` from `next/image` — SVGs are served as-is. If you switch
extensions, update the paths in `src/data/products.ts` and `src/data/content.ts`.

### 4. ⚠️ Testimonials

`src/data/content.ts` → `testimonials` are **placeholder copy**, each flagged
`placeholder: true`. They are attributed by role and region only (no invented
individuals), but they are still not real quotes. **Replace them with approved
customer quotes, or delete the `<Testimonials />` section from
`src/app/page.tsx`, before publishing.**

---

## Enquiry form delivery

The form posts to `POST /api/enquiry`. Copy `.env.example` to `.env.local` and
configure **one** channel:

```bash
# Option A — any webhook (Zapier, Make, Slack, your CRM)
ENQUIRY_WEBHOOK_URL="https://hooks.example.com/..."

# Option B — email via Resend
RESEND_API_KEY="re_..."
ENQUIRY_TO_EMAIL="mail@hi-techtreads.com"
ENQUIRY_FROM_EMAIL="website@yourverifieddomain.com"
```

With neither set, the endpoint returns `501` and the form **falls back to
opening the visitor's mail client or WhatsApp pre-filled with their enquiry** —
so no lead is silently swallowed. A hidden honeypot field drops bot submissions.

---

## Content model

All copy and catalogue data lives in `src/data/` — no content is hard-coded in
components.

| File | Contains |
| --- | --- |
| `site.ts` | Company facts, address, phone, markets, certifications, stats |
| `products.ts` | The five ranges and every published size |
| `content.ts` | Process steps, benefits, comparison, industries, testimonials, gallery, FAQ |
| `nav.ts` | Navigation and mega-menu structure |

### Catalogue accuracy

Category names and **all 43 size codes** are taken verbatim from the existing
page:

| Range | Sizes |
| --- | --- |
| PCTR (Pre-Cure Tread Rubber) | 23 |
| PCTR Radial | 4 |
| PCTR Nylon | 2 |
| HOT (Hot Retreading) | 14 |
| PCTR Off Road | made to order |

Two fields are **presentation aids, not manufacturer claims**, and are labelled
as such in the UI:

- **`fitment`** — groups each size into a vehicle class (Truck & Bus, LCV,
  Passenger, OTR & Earthmover, Small / 3-Wheeler) so the catalogue can be
  filtered and sorted. Derived from the size code.
- **`performance`** — 0–100 scores comparing our own ranges against each other,
  to support range selection. Surfaced with an explicit "indicative, not a
  laboratory result" caveat everywhere it appears.

Pricing is **"on request"** throughout, matching the source page.

---

## Architecture

```
src/
├─ app/
│  ├─ layout.tsx          metadata, fonts, JSON-LD, theme bootstrap, providers
│  ├─ page.tsx            section composition
│  ├─ globals.css         design tokens, dark mode, utilities, keyframes
│  ├─ robots.ts · sitemap.ts
│  └─ api/enquiry/route.ts
├─ components/
│  ├─ layout/             Navbar (mega menu), SearchDialog, Breadcrumb,
│  │                      Footer, FloatingCTA, StickyContactBar, PageLoader
│  ├─ sections/           Hero, Products, ProductExplorer, Process, Benefits,
│  │                      Comparison, Industries, Trust, Testimonials,
│  │                      Gallery, FAQ, Contact, ParticleField, FloatingTyres
│  ├─ ui/                 Button, Badge, Modal, Tabs, Accordion, Toast, Reveal,
│  │                      Counter, Tilt, Marquee, Section (heading/bar/gauge),
│  │                      ThemeToggle, Icon
│  └─ QuoteContext.tsx    "Request Quote" → scrolls to and pre-fills the form
├─ data/                  all content (above)
└─ lib/                   utils, motion variants, hooks, icons, datasheet, schema
```

### Design system

Brand is **orange + white**, with near-black surfaces carrying the dark theme.
Tokens live in `globals.css`:

- `--color-brand-50…950` — orange ramp, `brand-500` (`#ff6a00`) is primary
- `--bg`, `--surface`, `--fg`, `--border`, `--glass` — semantic surfaces that
  swap under `.dark`
- `--text-fluid-*` — `clamp()` type scale, mobile-first
- Utilities: `.glass`, `.glass-strong`, `.text-gradient-brand`, `.glow-blob`,
  `.bg-grid`, `.skeleton`, `.container-page`, `.section-y`

Dark mode is class-based on `<html>`, applied by a blocking inline script
before first paint (no flash), and read through `useSyncExternalStore` so
there is no hydration mismatch.

### Datasheets

"Download Datasheet" generates a styled, print-ready HTML document client-side
(`src/lib/datasheet.ts`) — no PDF service, no server round-trip, works on a
fully static export. Users get a PDF via **Print → Save as PDF**.

---

## Accessibility

- Single `<h1>`; landmarks and heading hierarchy throughout
- Skip link; visible brand focus ring on every interactive element
- Tabs, accordions and the carousel follow WAI-ARIA authoring patterns with
  full arrow-key support
- Modals trap focus, restore it on close, and close on <kbd>Esc</kbd>
- Animated counters expose the final value to screen readers, not the tick-up
- Form errors use `aria-invalid` + `aria-describedby`, and focus moves to the
  first invalid field on submit
- `prefers-reduced-motion` disables the particle canvas, page loader, carousel
  autoplay, and all decorative motion

## Performance

- Static prerender; ~228 kB first-load JS for the whole page
- Particle canvas is DPR-aware, capped, and pauses via `IntersectionObserver`
  and `visibilitychange`
- Below-fold images lazy-load; `next/image` handles AVIF/WebP and `srcset`
- `optimizePackageImports` for `lucide-react` and `framer-motion`
- Long-cache immutable headers on static assets (`next.config.ts`)

## SEO

- Full metadata, canonical, Open Graph, Twitter card
- JSON-LD graph: `Organization`, `WebPage`, `BreadcrumbList`, `ItemList` of all
  five `Product`s with sizes and price-on-request offers, and `FAQPage`
- `sitemap.xml` and `robots.txt` generated at build

Set `NEXT_PUBLIC_SITE_URL` in production so canonical, OG and sitemap URLs
resolve against the right origin.

---

## Deployment

Deploys as-is to Vercel, or any Node host:

```bash
npm run build && npm start
```

The only dynamic route is `/api/enquiry`. If you'd rather host fully statically,
drop that route and point the form at a third-party form endpoint — the
mail/WhatsApp fallback already covers the no-backend case.
