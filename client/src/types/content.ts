/**
 * Content model for the marketing site.
 *
 * Every section renders from typed data in `src/data`, so copy changes never
 * require touching a component.
 */

/** Abstract art fills used in place of photography. */
export type PatternName =
  | 'tread'
  | 'rings'
  | 'weave'
  | 'grid'
  | 'dots'
  | 'stripe';

export interface NavLink {
  label: string;
  href: string;
}

export interface NavGroup {
  title: string;
  links: NavLink[];
}

/** A promoted entry in the mega menu's right-hand rail. */
export interface NavFeature extends NavLink {
  description: string;
}

export interface NavFeatureGroup {
  title: string;
  items: NavFeature[];
}

/** Full-width panel dropped under the header by a top-level nav entry. */
export interface NavMenu {
  /** One entry per column; a column stacks one or more labelled groups. */
  columns: NavGroup[][];
  /** Right-hand rail, ruled off from the link columns. */
  featured?: NavFeatureGroup[];
  /** Catch-all link parked at the foot of the panel. */
  cta?: NavLink;
}

/** Top-level nav entry, optionally opening a mega-menu panel. */
export interface NavItem extends NavLink {
  description?: string;
  menu?: NavMenu;
}

export interface TileImage {
  src: string;
  /** Responsive candidates, e.g. "card-500w.jpg 500w, card-1000w.jpg 1000w". */
  srcSet?: string;
  /** WebP candidates served ahead of the raster fallback. */
  webpSrcSet?: string;
  /**
   * How the image sits in its frame. Photographs fill it edge to edge, so
   * `cover` is the default. Cut-outs on a transparent ground — the tread
   * renders — must be `contain`, or the frame crops the product itself away.
   */
  fit?: 'cover' | 'contain';
}

export interface ProductTile {
  id: string;
  label: string;
  pattern: PatternName;
  /** Real photography when available; otherwise the CSS-drawn pattern shows. */
  image?: TileImage;
}

export interface Stat {
  id: string;
  /** Numeric target for the count-up animation. */
  value: number;
  suffix?: string;
  label: string;
}

/** Colour wash behind a capability card's artwork. */
export type CardTone = 'ink' | 'teal' | 'clay' | 'slate';

/** Anchor for a chip inside a card's art panel. */
export type ChipAnchor =
  | 'top-left'
  | 'top-right'
  | 'mid-left'
  | 'mid-right'
  | 'bottom-left'
  | 'bottom-right';

/**
 * Floating spec pill laid over a card's artwork — the small proof points
 * ("Shore 68A", "CoC issued") that show the step actually producing something.
 */
export interface CardChip {
  label: string;
  /** Figure shown at the trailing edge of the pill. */
  value?: string;
  at: ChipAnchor;
}

export interface Capability {
  id: string;
  title: string;
  body: string;
  pattern: PatternName;
  /** Photography for the art panel; falls back to `pattern` without it. */
  image?: TileImage;
  tone: CardTone;
  /** Two chips read well at card width; three starts to crowd the art. */
  chips: CardChip[];
  link: NavLink;
}

export interface Product {
  id: string;
  /** Short label shown in the tab strip. */
  tab: string;
  title: string;
  body: string;
  points: string[];
  pattern: PatternName;
}

export interface Testimonial {
  quote: string;
  name: string;
  org: string;
}

/* ── About ─────────────────────────────────────────────────────────
   The eight company pages carried over from the legacy site's About Us
   menu. Each one is a stack of blocks so a page can mix running copy,
   pull quotes, fact tables and milestones without a bespoke component.
------------------------------------------------------------------- */

/** A named point with a paragraph under it — the Goals page shape. */
export interface AboutPoint {
  title: string;
  body: string;
}

/** One row of a fact table, e.g. the export profile. */
export interface AboutFact {
  label: string;
  value: string;
}

/** One entry on the milestones timeline. */
export interface AboutMilestone {
  /** Year or era. Left as text because the early ones are not dated. */
  period: string;
  title: string;
  body: string;
}

export type AboutBlock =
  /** Opening paragraph, set larger than the rest. */
  | { kind: 'lead'; text: string }
  | { kind: 'para'; text: string }
  | { kind: 'heading'; text: string }
  | { kind: 'quote'; text: string; source?: string }
  | { kind: 'points'; items: AboutPoint[] }
  | { kind: 'facts'; rows: AboutFact[] }
  | { kind: 'list'; items: string[] }
  | { kind: 'timeline'; items: AboutMilestone[] };

export interface AboutSection {
  /** URL segment: /about/<slug>. Must be unique and lowercase. */
  slug: string;
  /** Label in the section nav, the mega menu and the breadcrumb. */
  navLabel: string;
  title: string;
  eyebrow: string;
  /** One line under the title, and the summary on the About index card. */
  lede: string;
  blocks: AboutBlock[];
}

/* ── Catalogue ─────────────────────────────────────────────────────
   The showcase `Product` above is a homepage panel. The types below back
   the browsable catalogue at /products and each item's detail page.
------------------------------------------------------------------- */

export interface ProductCategory {
  id: string;
  label: string;
  /** Sits under the heading when the category is the active filter. */
  blurb: string;
  /** Wash behind every card in this category, so a grid reads by colour. */
  tone: CardTone;
}

/** One row of the detail page's specification table. */
export interface ProductSpec {
  label: string;
  value: string;
}

export interface CatalogueProduct {
  id: string;
  /** URL segment: /products/<slug>. Must be unique and lowercase. */
  slug: string;
  name: string;
  /** Matching `ProductCategory.id`. */
  category: string;
  /** One line, shown on the card. */
  summary: string;
  /** Two or three sentences, shown on the detail page. */
  description: string;
  pattern: PatternName;
  /** Real photography when available; otherwise the CSS-drawn pattern shows. */
  image?: TileImage;
  /** Headline figure laid over the card art, e.g. "1–50 mm". */
  badge?: string;
  /**
   * Spec pills floated over the card artwork. Two read well at card width;
   * keep the values short, since a chip does not wrap.
   */
  chips?: CardChip[];
  materials: string[];
  specs: ProductSpec[];
  features: string[];
  applications: string[];
  leadTime: string;
  /**
   * Indicative band only. Every job is quoted on drawing and quantity, so the
   * catalogue never carries a price.
   */
  moq: string;
}
