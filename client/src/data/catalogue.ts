import type {
  CardChip,
  CatalogueProduct,
  PatternName,
  ProductSpec,
  ProductCategory,
  TileImage,
} from '@/types/content';

/**
 * The browsable catalogue behind /products and /products/<slug>.
 *
 * Every product name here is taken from the legacy site at mannarubber.com.
 * The old site published names and prices-on-request but almost no technical
 * data, so the specs below carry only what the business actually declared:
 * brand, origin, HSN where stated, and the minimum enquiry quantity.
 *
 * ⚠️ Pattern dimensions, gauges, hardness figures and mileage claims are NOT
 * in here because they were never published. Get them from the works before
 * adding them — invented figures on a manufacturing catalogue are a warranty
 * problem, not a copy problem.
 *
 * Kept separate from `products.ts`, which holds the five homepage showcase
 * panels — those are marketing copy, these are the line items a buyer saves,
 * compares and asks us to quote.
 */

export const productCategories: ProductCategory[] = [
  {
    id: 'tread-rubber',
    label: 'Tread rubber',
    blurb:
      'Fifty patterns for highway, hill, mine and agricultural duty, built for mileage and uniform wear.',
    tone: 'ink',
  },
  {
    id: 'retreading',
    label: 'Tyre retreading',
    blurb:
      'Hot and PCTR retreading across nylon, radial and off-road configurations.',
    tone: 'teal',
  },
  {
    id: 'compounds',
    label: 'Rubber compounds & mixing',
    blurb:
      'Sixteen grades across natural rubber, SBR, ISNR and EPDM, mixed to hardness.',
    tone: 'slate',
  },
  {
    id: 'reclaimed',
    label: 'Reclaimed rubber',
    blurb:
      'Recycled feedstock in four reclaim grades plus devulcanized rubber crumb.',
    tone: 'clay',
  },
  {
    id: 'moulded',
    label: 'Rubber moulded goods',
    blurb:
      'Customised moulded components made to your drawing, your sample, or the worn part.',
    tone: 'ink',
  },
];

/* ── Shared values ────────────────────────────────────────────────
   Declared by the business on the legacy site and true of every line.
------------------------------------------------------------------- */

const BRAND: ProductSpec = { label: 'Brand', value: 'Manna Group' };
const ORIGIN: ProductSpec = { label: 'Country of origin', value: 'India' };
const PRICING: ProductSpec = { label: 'Pricing', value: 'On request' };
const MOQ_SPEC: ProductSpec = { label: 'Minimum enquiry quantity', value: '1' };

const LEAD_TIME = 'Confirmed with your quotation';
const MOQ = 'From 1 unit — bulk pricing on request';

/** Turns a product name into a URL segment. */
function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/* ── Tread rubber ─────────────────────────────────────────────────
   Fifty patterns. The range-level benefits below (mileage, traction,
   cooler running, uniform wear) are the ones the old site published for the
   category as a whole; per-pattern detail is still outstanding.
------------------------------------------------------------------- */

interface TreadSeed {
  name: string;
  /** Only set where the pattern name itself states the duty. */
  duty?: string;
  summary?: string;
  description?: string;
  features?: string[];
  applications?: string[];
  pattern?: PatternName;
}

/**
 * Studio render for a pattern, cut out of its backdrop and squared off.
 *
 * Sourced from the works' own "Product images" set (MT-01 – MT-50), one render
 * per pattern, so the file name is just the pattern slug. They sit on a
 * transparent ground rather than the original white sweep — the site is dark,
 * and a white plate behind every tyre would read as a bug. That also means
 * they have to be shown with `fit: 'contain'`; a cover crop eats the tread.
 */
function treadArt(slug: string): TileImage {
  const base = `/products/tread/${slug}`;
  return {
    src: `${base}-800.webp`,
    srcSet: `${base}-800.webp 800w, ${base}-1200.webp 1200w`,
    fit: 'contain',
  };
}

const TREAD_FEATURES = [
  'Improved mileage with uniform wear across the tread',
  'Enhanced traction and cooler running under load',
  'Tread design that supports fuel efficiency on long runs',
  'Gauge and width confirmed against your tyre size at quotation',
];

const TREAD_APPLICATIONS = [
  'Truck and bus tyre retreading',
  'Commercial fleet tyre renewal',
];

const treadSeeds: TreadSeed[] = [
  {
    name: 'VIKING',
    duty: 'Short, long, hill',
    summary:
      'Greater mileage and decreased abrasion, with traction on wet and dry surfaces.',
    description:
      'Greater mileage, decreased abrasion, improved load distribution and an elevated land–sea ratio. Greater driving stability with excellent traction on both wet and dry surfaces. Application: short, long and hill.',
    features: [
      'Greater mileage with decreased abrasion',
      'Improved load distribution across the contact patch',
      'Elevated land–sea ratio for greater driving stability',
      'Excellent traction on both wet and dry surfaces',
    ],
    applications: ['Short-haul routes', 'Long-haul routes', 'Hill application'],
  },
  { name: 'AJAX' },
  { name: 'SEMI LUG', pattern: 'stripe' },
  { name: 'JET TRACK' },
  { name: 'SR' },
  { name: 'TR' },
  { name: 'UNIJET' },
  { name: 'Extra Miler PM' },
  { name: 'R2' },
  { name: 'MSR' },
  { name: 'DR' },
  { name: 'MG' },
  { name: 'CT' },
  { name: 'SG' },
  { name: 'MR' },
  { name: 'AM' },
  { name: 'ENDURA' },
  { name: 'ASTRO' },
  { name: 'EAGLE' },
  { name: 'Z-TRACK' },
  { name: 'LUG MASTER', pattern: 'stripe' },
  { name: 'MAXIMUS' },
  { name: 'BCR' },
  { name: 'M6' },
  { name: 'RTS' },
  {
    name: 'MINE SPECIAL ML',
    duty: 'Mining',
    summary: 'Mine-specific tread pattern for off-road and quarry duty.',
    applications: ['Mining haul vehicles', 'Quarry and aggregate sites'],
  },
  { name: 'TVS' },
  { name: 'B580' },
  { name: 'JKB' },
  { name: 'LD' },
  { name: 'MML' },
  { name: 'MILE GRIP MLG' },
  { name: 'M10' },
  { name: 'TRANSPORT' },
  { name: 'BDY' },
  { name: 'ROADSTAR' },
  { name: 'ADH' },
  { name: 'LGR' },
  { name: 'B582' },
  { name: 'JDE' },
  { name: 'IR' },
  { name: 'MST' },
  {
    name: 'TRACTOR FRONT',
    duty: 'Agricultural',
    summary: 'Front-tyre tread pattern for agricultural tractors.',
    applications: ['Tractor front tyres', 'Farm and field duty'],
    pattern: 'stripe',
  },
  {
    name: 'TRACTOR FRONT NEW',
    duty: 'Agricultural',
    summary: 'Revised front-tyre tread pattern for agricultural tractors.',
    applications: ['Tractor front tyres', 'Farm and field duty'],
    pattern: 'stripe',
  },
  /* MT-45 – MT-50: patterns the works added after the legacy site was last
     written, so the name is all that has been published for them so far. */
  { name: 'MM 30' },
  { name: 'MH' },
  {
    name: 'MINES SUPER',
    duty: 'Mining',
    summary: 'Mine-duty tread pattern for off-road and quarry haulage.',
    applications: ['Mining haul vehicles', 'Quarry and aggregate sites'],
  },
  { name: 'TRACKMAN' },
  { name: 'MCR' },
  { name: 'MARCO' },
];

const treadRubber: CatalogueProduct[] = treadSeeds.map((seed) => {
  const pattern = slugify(seed.name);
  const slug = `tread-${pattern}`;
  return {
    id: slug,
    slug,
    name: seed.name,
    category: 'tread-rubber',
    image: treadArt(pattern),
    summary:
      seed.summary ??
      'Tread rubber pattern from the Manna Group range. Price on request.',
    description:
      seed.description ??
      `${seed.name} is part of Manna Group's tread rubber range, produced at our Rubber Park works in Kerala. Pattern dimensions, available gauges and widths are issued with the quotation — send us the tyre size and the duty the vehicle runs and we will confirm the right specification.`,
    pattern: seed.pattern ?? 'tread',
    badge: seed.duty,
    chips: [
      { label: 'Type', value: 'Tread rubber', at: 'top-right' },
      ...(seed.duty
        ? [{ label: 'Duty', value: seed.duty, at: 'bottom-left' } as CardChip]
        : []),
    ],
    materials: ['Tread rubber compound'],
    specs: [
      { label: 'Product type', value: 'Tread rubber' },
      { label: 'Pattern', value: seed.name },
      ...(seed.duty ? [{ label: 'Application', value: seed.duty }] : []),
      BRAND,
      ORIGIN,
      MOQ_SPEC,
      PRICING,
    ],
    features: seed.features ?? TREAD_FEATURES,
    applications: seed.applications ?? TREAD_APPLICATIONS,
    leadTime: LEAD_TIME,
    moq: MOQ,
  };
});

/* ── Tyre retreading ──────────────────────────────────────────────
   Five processes. The sizes below are the ones the old site listed; it noted
   there were others, so treat this as a sample rather than the full table.
------------------------------------------------------------------- */

const retreading: CatalogueProduct[] = [
  {
    id: 'retreading-pctr',
    slug: 'retreading-pctr',
    name: 'Tyre Retreading PCTR',
    category: 'retreading',
    summary: 'Precured tread retreading for commercial truck and bus casings.',
    description:
      'Precured tread rubber (PCTR) retreading renews a sound casing with a new tread, at a fraction of the oil a new tyre would take to build. Send the casing size and the route it runs and we will confirm the pattern and gauge.',
    pattern: 'rings',
    chips: [
      { label: 'Process', value: 'PCTR', at: 'top-right' },
      { label: 'Sizes', value: '1000×20 – 1200×20', at: 'bottom-left' },
    ],
    materials: ['Precured tread rubber', 'Cushion gum'],
    specs: [
      { label: 'Process', value: 'Precured (PCTR)' },
      { label: 'Sample sizes', value: '1000×20, 1100×20, 1200×20' },
      BRAND,
      ORIGIN,
      MOQ_SPEC,
      PRICING,
    ],
    features: [
      'Renews a sound casing rather than scrapping it',
      'Uses a fraction of the oil a new tyre requires',
      'Checked against industry safety standards before despatch',
      'Pattern selected to match the duty the vehicle runs',
    ],
    applications: ['Truck fleets', 'Bus operators', 'Commercial haulage'],
    leadTime: LEAD_TIME,
    moq: MOQ,
  },
  {
    id: 'retreading-pctr-radial',
    slug: 'retreading-pctr-radial',
    name: 'Tyre Retreading PCTR Radial',
    category: 'retreading',
    summary: 'Precured retreading for radial casings.',
    description:
      'PCTR retreading configured for radial construction casings. Radial casings hold their shape well through multiple lives, which is what makes retreading them worth doing.',
    pattern: 'rings',
    chips: [
      { label: 'Process', value: 'PCTR', at: 'top-right' },
      { label: 'Casing', value: 'Radial', at: 'bottom-left' },
    ],
    materials: ['Precured tread rubber', 'Cushion gum'],
    specs: [
      { label: 'Process', value: 'Precured (PCTR)' },
      { label: 'Casing type', value: 'Radial' },
      { label: 'Sample sizes', value: '295R22.5' },
      BRAND,
      ORIGIN,
      MOQ_SPEC,
      PRICING,
    ],
    features: [
      'Configured for radial casing construction',
      'Multiple retread lives from a sound casing',
      'Checked against industry safety standards before despatch',
      'Pattern matched to route and load',
    ],
    applications: ['Radial truck tyres', 'Long-haul fleets'],
    leadTime: LEAD_TIME,
    moq: MOQ,
  },
  {
    id: 'retreading-pctr-nylon',
    slug: 'retreading-pctr-nylon',
    name: 'Tyre Retreading PCTR Nylon',
    category: 'retreading',
    summary: 'Precured retreading for nylon bias-ply casings.',
    description:
      'PCTR retreading configured for nylon bias-ply casings, still the mainstay on many regional and off-highway fleets.',
    pattern: 'weave',
    chips: [
      { label: 'Process', value: 'PCTR', at: 'top-right' },
      { label: 'Casing', value: 'Nylon bias-ply', at: 'bottom-left' },
    ],
    materials: ['Precured tread rubber', 'Cushion gum'],
    specs: [
      { label: 'Process', value: 'Precured (PCTR)' },
      { label: 'Casing type', value: 'Nylon bias-ply' },
      { label: 'Sample sizes', value: '1000×20, 1100×20, 1200×20' },
      BRAND,
      ORIGIN,
      MOQ_SPEC,
      PRICING,
    ],
    features: [
      'Configured for nylon bias-ply casing construction',
      'Cost-effective renewal for regional fleets',
      'Checked against industry safety standards before despatch',
      'Pattern matched to route and load',
    ],
    applications: ['Regional haulage', 'Bias-ply truck tyres'],
    leadTime: LEAD_TIME,
    moq: MOQ,
  },
  {
    id: 'retreading-pctr-off-road',
    slug: 'retreading-pctr-off-road',
    name: 'Tyre Retreading PCTR Off Road',
    category: 'retreading',
    summary: 'Precured retreading for off-road and earthmover casings.',
    description:
      'PCTR retreading for off-road duty — earthmovers, loaders and site plant, where casings are expensive and abrasion is the limiting factor.',
    pattern: 'tread',
    badge: 'Off road',
    chips: [
      { label: 'Process', value: 'PCTR', at: 'top-right' },
      { label: 'Duty', value: 'Off road', at: 'bottom-left' },
    ],
    materials: ['Precured tread rubber', 'Cushion gum'],
    specs: [
      { label: 'Process', value: 'Precured (PCTR)' },
      { label: 'Duty', value: 'Off road / earthmoving' },
      { label: 'Sample sizes', value: '17.5×25' },
      BRAND,
      ORIGIN,
      MOQ_SPEC,
      PRICING,
    ],
    features: [
      'Deep-tread patterns for abrasive off-road surfaces',
      'Renews high-value earthmover casings',
      'Checked against industry safety standards before despatch',
      'Pattern matched to site conditions',
    ],
    applications: ['Earthmovers and loaders', 'Quarry and mine plant', 'Construction sites'],
    leadTime: LEAD_TIME,
    moq: MOQ,
  },
  {
    id: 'retreading-hot',
    slug: 'retreading-hot',
    name: 'Tyre Retreading Hot',
    category: 'retreading',
    summary: 'Hot-process retreading, tread moulded and cured onto the casing.',
    description:
      'In the hot process the tread is moulded and cured directly onto the prepared casing, forming the pattern in the press rather than applying a precured strip.',
    pattern: 'grid',
    chips: [
      { label: 'Process', value: 'Hot cure', at: 'top-right' },
      { label: 'Tread', value: 'Moulded on', at: 'bottom-left' },
    ],
    materials: ['Tread rubber compound', 'Cushion gum'],
    specs: [
      { label: 'Process', value: 'Hot cure' },
      { label: 'Tread forming', value: 'Moulded and cured on the casing' },
      BRAND,
      ORIGIN,
      MOQ_SPEC,
      PRICING,
    ],
    features: [
      'Tread pattern formed in the mould, not applied precured',
      'Full sidewall-to-sidewall finish available',
      'Checked against industry safety standards before despatch',
      'Suits casings needing shoulder and sidewall repair',
    ],
    applications: ['Truck and bus casings', 'Casings requiring sidewall work'],
    leadTime: LEAD_TIME,
    moq: MOQ,
  },
];

/* ── Rubber compounds & mixing ────────────────────────────────────
   Sixteen grades. Polymer and hardness are read straight off the grade name;
   the High / Low suffix is the business's own designation and is carried
   through unexplained rather than guessed at.
------------------------------------------------------------------- */

interface CompoundSeed {
  name: string;
  polymer: string;
  hardness?: string;
  variant?: string;
  summary: string;
  description?: string;
  features?: string[];
  applications?: string[];
}

const COMPOUND_FEATURES = [
  'Mixed to grade in our own works at Rubber Park',
  'Consistent batch-to-batch dispersion',
  'Supplied in the form your process needs',
  'Minimum enquiry quantity of one',
];

const COMPOUND_APPLICATIONS = [
  'Moulded and extruded component manufacture',
  'Retreading and tyre industry feedstock',
];

const compoundSeeds: CompoundSeed[] = [
  {
    name: 'EPDM H 70 High',
    polymer: 'EPDM',
    hardness: '70',
    variant: 'High',
    summary:
      'Weather-resistant EPDM compound for UV, ozone and temperature extremes.',
    description:
      'A high-quality EPDM (Ethylene Propylene Diene Monomer) compound suitable for a wide range of applications. Known for outstanding resistance to UV radiation, weathering and temperature extremes, with excellent elasticity and ozone resistance for long-lasting performance. Specify EPDM where weatherability and sealing properties determine service life.',
    features: [
      'Outstanding resistance to UV radiation and weathering',
      'Holds up through temperature extremes',
      'Excellent elasticity and ozone resistance',
      'Superior weatherability and sealing properties',
    ],
    applications: [
      'Outdoor seals and weatherstrip',
      'Roofing and building protection',
      'Components exposed to sunlight and ozone',
    ],
  },
  {
    name: 'EPDM H 70 Low',
    polymer: 'EPDM',
    hardness: '70',
    variant: 'Low',
    summary: 'EPDM compound at 70 hardness, low grade.',
    description:
      'EPDM compound at 70 hardness in the low grade, carrying the same resistance to UV, ozone and weathering that makes EPDM the default choice for outdoor duty.',
    features: [
      'Resistance to UV radiation, ozone and weathering',
      'Holds elasticity across a wide temperature range',
      'Mixed to grade in our own works at Rubber Park',
      'Minimum enquiry quantity of one',
    ],
    applications: [
      'Outdoor seals and weatherstrip',
      'General weather-resistant mouldings',
    ],
  },
  {
    name: 'NR H 85',
    polymer: 'Natural rubber',
    hardness: '85',
    summary: 'Natural rubber compound at 85 hardness.',
  },
  {
    name: 'SBR H 85',
    polymer: 'SBR (styrene-butadiene)',
    hardness: '85',
    summary: 'Styrene-butadiene compound at 85 hardness.',
  },
  {
    name: 'NR H 80 High',
    polymer: 'Natural rubber',
    hardness: '80',
    variant: 'High',
    summary: 'Natural rubber compound at 80 hardness, high grade.',
  },
  {
    name: 'NR H 75 Low',
    polymer: 'Natural rubber',
    hardness: '75',
    variant: 'Low',
    summary: 'Natural rubber compound at 75 hardness, low grade.',
  },
  {
    name: 'NR H 65 Low',
    polymer: 'Natural rubber',
    hardness: '65',
    variant: 'Low',
    summary: 'Natural rubber compound at 65 hardness, low grade.',
  },
  {
    name: 'NR H 60 High',
    polymer: 'Natural rubber',
    hardness: '60',
    variant: 'High',
    summary: 'Natural rubber compound at 60 hardness, high grade.',
  },
  {
    name: 'NR H 60 Low',
    polymer: 'Natural rubber',
    hardness: '60',
    variant: 'Low',
    summary: 'Natural rubber compound at 60 hardness, low grade.',
  },
  {
    name: 'NR H 40 High',
    polymer: 'Natural rubber',
    hardness: '40',
    variant: 'High',
    summary: 'Natural rubber compound at 40 hardness, high grade.',
  },
  {
    name: 'NR H 40 Low',
    polymer: 'Natural rubber',
    hardness: '40',
    variant: 'Low',
    summary: 'Natural rubber compound at 40 hardness, low grade.',
  },
  {
    name: 'NR 45A',
    polymer: 'Natural rubber',
    hardness: '45 Shore A',
    summary: 'Natural rubber compound at 45 Shore A.',
  },
  {
    name: 'NR 65A',
    polymer: 'Natural rubber',
    hardness: '65 Shore A',
    summary: 'Natural rubber compound at 65 Shore A.',
  },
  {
    name: 'ISNR 45A',
    polymer: 'ISNR (Indian Standard Natural Rubber)',
    hardness: '45 Shore A',
    summary: 'Indian Standard Natural Rubber compound at 45 Shore A.',
  },
  {
    name: 'ISNR 65A',
    polymer: 'ISNR (Indian Standard Natural Rubber)',
    hardness: '65 Shore A',
    summary: 'Indian Standard Natural Rubber compound at 65 Shore A.',
  },
  {
    name: 'White',
    polymer: 'White compound',
    summary: 'White rubber compound for non-marking and light-coloured parts.',
  },
];

const compounds: CatalogueProduct[] = compoundSeeds.map((seed) => {
  const slug = `compound-${slugify(seed.name)}`;
  return {
    id: slug,
    slug,
    name: seed.name,
    category: 'compounds',
    summary: seed.summary,
    description:
      seed.description ??
      `${seed.name} is one of sixteen compound grades mixed at Manna Group's Rubber Park works. Cure data, filler loading and physical properties are issued against a specific enquiry — tell us the process and the duty and we will confirm the grade.`,
    pattern: seed.polymer.startsWith('EPDM') ? 'grid' : 'dots',
    badge: seed.hardness,
    chips: [
      // Every grade name leads with its polymer code — NR, SBR, ISNR, EPDM.
      { label: 'Polymer', value: seed.name.split(' ')[0] ?? seed.polymer, at: 'top-right' },
      ...(seed.hardness
        ? [{ label: 'Hardness', value: seed.hardness, at: 'bottom-left' } as CardChip]
        : []),
    ],
    materials: [seed.polymer],
    specs: [
      { label: 'Polymer', value: seed.polymer },
      ...(seed.hardness ? [{ label: 'Hardness', value: seed.hardness }] : []),
      ...(seed.variant ? [{ label: 'Grade', value: seed.variant }] : []),
      { label: 'ITC-HSN', value: '4002' },
      BRAND,
      ORIGIN,
      MOQ_SPEC,
      PRICING,
    ],
    features: seed.features ?? COMPOUND_FEATURES,
    applications: seed.applications ?? COMPOUND_APPLICATIONS,
    leadTime: LEAD_TIME,
    moq: MOQ,
  };
});

/* ── Reclaimed rubber ─────────────────────────────────────────────
   Five grades, descriptions as published on the legacy site.
------------------------------------------------------------------- */

const RECLAIM_FEATURES = [
  'Recycled feedstock that cuts virgin material content',
  'Blends into existing compounds to bring cost down',
  'Sustainable composition without giving up durability',
  'Minimum enquiry quantity of one',
];

const RECLAIM_APPLICATIONS = [
  'Compound extension in moulded goods',
  'Tyre and retreading industry feedstock',
  'General rubber goods manufacture',
];

const reclaimed: CatalogueProduct[] = [
  {
    id: 'reclaim-special',
    slug: 'reclaim-special',
    name: 'Reclaim Special',
    category: 'reclaimed',
    summary: 'Durable, versatile reclaim grade with a sustainable composition.',
    description:
      'A high-quality rubber product designed for durability and versatility. With its superior strength and sustainable composition, Reclaim Special suits a wide range of applications.',
    pattern: 'weave',
    chips: [
      { label: 'Type', value: 'Reclaim', at: 'top-right' },
      { label: 'Grade', value: 'Special', at: 'bottom-left' },
    ],
    materials: ['Reclaimed rubber'],
    specs: [
      { label: 'Product type', value: 'Reclaimed rubber' },
      { label: 'Grade', value: 'Special' },
      BRAND,
      ORIGIN,
      MOQ_SPEC,
      PRICING,
    ],
    features: RECLAIM_FEATURES,
    applications: RECLAIM_APPLICATIONS,
    leadTime: LEAD_TIME,
    moq: MOQ,
  },
  {
    id: 'reclaim-superfine',
    slug: 'reclaim-superfine',
    name: 'Reclaim Superfine',
    category: 'reclaimed',
    summary: 'Fine reclaim grade offering durability, flexibility and eco-credentials.',
    description:
      'A high-quality rubber material crafted by Manna Rubber Products Private Limited. It offers exceptional durability, flexibility and eco-friendliness, making it ideal for a variety of applications.',
    pattern: 'dots',
    chips: [
      { label: 'Type', value: 'Reclaim', at: 'top-right' },
      { label: 'Grade', value: 'Superfine', at: 'bottom-left' },
    ],
    materials: ['Reclaimed rubber'],
    specs: [
      { label: 'Product type', value: 'Reclaimed rubber' },
      { label: 'Grade', value: 'Superfine' },
      BRAND,
      ORIGIN,
      MOQ_SPEC,
      PRICING,
    ],
    features: RECLAIM_FEATURES,
    applications: RECLAIM_APPLICATIONS,
    leadTime: LEAD_TIME,
    moq: MOQ,
  },
  {
    id: 'reclaim-matt-superfine',
    slug: 'reclaim-matt-superfine',
    name: 'Reclaim Matt Superfine',
    category: 'reclaimed',
    summary: 'Premium fine reclaim grade built for long-lasting performance.',
    description:
      'A premium rubber product known for its craftsmanship, quality and durability. This material is made for long-lasting performance in demanding compound work.',
    pattern: 'grid',
    chips: [
      { label: 'Type', value: 'Reclaim', at: 'top-right' },
      { label: 'Grade', value: 'Matt Superfine', at: 'bottom-left' },
    ],
    materials: ['Reclaimed rubber'],
    specs: [
      { label: 'Product type', value: 'Reclaimed rubber' },
      { label: 'Grade', value: 'Matt Superfine' },
      BRAND,
      ORIGIN,
      MOQ_SPEC,
      PRICING,
    ],
    features: RECLAIM_FEATURES,
    applications: RECLAIM_APPLICATIONS,
    leadTime: LEAD_TIME,
    moq: MOQ,
  },
  {
    id: 'reclaim-course',
    slug: 'reclaim-course',
    name: 'Reclaim Course',
    category: 'reclaimed',
    summary: 'Coarse reclaim grade for cost-effective, high-volume compound work.',
    description:
      'A sustainable solution for rubber recycling with high-quality results — supports your environmental targets while keeping compound cost down.',
    pattern: 'stripe',
    chips: [
      { label: 'Type', value: 'Reclaim', at: 'top-right' },
      { label: 'Grade', value: 'Course', at: 'bottom-left' },
    ],
    materials: ['Reclaimed rubber'],
    specs: [
      { label: 'Product type', value: 'Reclaimed rubber' },
      { label: 'Grade', value: 'Course' },
      BRAND,
      ORIGIN,
      MOQ_SPEC,
      PRICING,
    ],
    features: RECLAIM_FEATURES,
    applications: RECLAIM_APPLICATIONS,
    leadTime: LEAD_TIME,
    moq: MOQ,
  },
  {
    id: 'reclaim-devulcanized-rubber-crumb',
    slug: 'reclaim-devulcanized-rubber-crumb',
    name: 'Devulcanized Rubber Crumb',
    category: 'reclaimed',
    summary: 'Devulcanized rubber crumb (DRC) for tread rubber and reclaim blends.',
    description:
      'High-quality devulcanized rubber crumb for use in tread rubber and reclaimed rubber production. DRC returns crosslinked scrap to a processable state so it can go back into compound.',
    pattern: 'dots',
    badge: 'DRC',
    chips: [
      { label: 'Type', value: 'Crumb', at: 'top-right' },
      { label: 'Grade', value: 'Devulcanized', at: 'bottom-left' },
    ],
    materials: ['Devulcanized rubber crumb'],
    specs: [
      { label: 'Product type', value: 'Devulcanized rubber crumb' },
      { label: 'Abbreviation', value: 'DRC' },
      BRAND,
      ORIGIN,
      MOQ_SPEC,
      PRICING,
    ],
    features: [
      'Returns crosslinked scrap to a processable state',
      'Goes back into tread rubber and reclaim compounds',
      'Cuts virgin material content and cost',
      'Minimum enquiry quantity of one',
    ],
    applications: [
      'Tread rubber production',
      'Reclaimed rubber blending',
      'General rubber goods manufacture',
    ],
    leadTime: LEAD_TIME,
    moq: MOQ,
  },
];

/* ── Rubber moulded goods ─────────────────────────────────────────
   Twenty-one product types. Everything is made to the customer's drawing,
   sample or worn part, so sizes and compounds are set per job.
------------------------------------------------------------------- */

interface MouldedSeed {
  name: string;
  /** Override where stripping the "Rubber " prefix would not give a clean URL. */
  slug?: string;
  summary: string;
  description: string;
  pattern: PatternName;
  applications: string[];
  /** Real photography. Without it the card falls back to `pattern`. */
  image?: TileImage;
}

const MOULDED_FEATURES = [
  'Made to your drawing, your sample, or the worn part itself',
  'Compound selected for the fluid, temperature and wear duty',
  'Sizes and tolerances set per job rather than to a fixed range',
  'Minimum enquiry quantity of one',
];

const mouldedSeeds: MouldedSeed[] = [
  {
    name: 'Rubber O Rings',
    summary: 'Moulded O-rings in the compound and size your duty calls for.',
    description:
      'Circular-section moulded seals for static and dynamic sealing. Supplied to standard or bespoke sizes, in the compound that suits the fluid and temperature the seal will see.',
    pattern: 'rings',
    applications: ['Hydraulic and pneumatic sealing', 'Pump and valve bodies', 'Flange and port seals'],
  },
  {
    name: 'Rubber Quad Rings',
    summary: 'Four-lobed sealing rings for reduced rolling and better retention.',
    description:
      'Quad rings carry a four-lobed section rather than a round one, giving two sealing surfaces per side and better resistance to spiral failure in reciprocating duty.',
    pattern: 'rings',
    applications: ['Reciprocating rod seals', 'Rotary shaft applications', 'High-cycle sealing'],
  },
  {
    name: 'Rubber Oil Seals',
    summary: 'Shaft seals that keep lubricant in and contamination out.',
    description:
      'Moulded oil seals for rotating shafts, retaining lubricant while excluding dust and moisture. Lip geometry and compound chosen against shaft speed, temperature and the oil in service.',
    pattern: 'rings',
    applications: ['Gearboxes and drive shafts', 'Pumps and motors', 'Wheel hubs and bearings'],
  },
  {
    name: 'Rubber Wire Seals',
    summary: 'Moulded seals for cable and wire entry points.',
    description:
      'Sealing components for wire and cable entries, keeping dust and moisture out of enclosures and looms where a cable passes through a panel.',
    pattern: 'dots',
    applications: ['Wiring harnesses', 'Electrical enclosures', 'Panel cable entries'],
  },
  {
    name: 'Rubber Grommets',
    summary: 'Edge protection and sealing where cable passes through panel.',
    description:
      'Moulded grommets that line a hole or panel cut-out, protecting cable from the sheet edge and closing the gap around it.',
    pattern: 'rings',
    applications: ['Panel and chassis cut-outs', 'Cable routing', 'Vibration isolation at entry points'],
  },
  {
    name: 'Rubber Rings',
    summary: 'Moulded rings to section and dimension.',
    description:
      'General-purpose moulded rings supplied to your section and dimension, in the compound the application calls for.',
    pattern: 'rings',
    applications: ['Spacers and seats', 'Sealing faces', 'General assembly'],
  },
  {
    name: 'Rubber Sleeves',
    summary: 'Protective and sealing sleeves for shafts, pipe and cable.',
    description:
      'Moulded sleeves that shield or seal a shaft, pipe or cable run, in wall thicknesses and lengths set by the job.',
    pattern: 'stripe',
    applications: ['Shaft protection', 'Pipe couplings', 'Cable shielding'],
  },
  {
    name: 'Rubber Dampers',
    summary: 'Vibration dampers sized to the load and frequency.',
    description:
      'Moulded dampers that absorb vibration and shock between mounted components, with hardness chosen against the load and the frequency being damped.',
    pattern: 'tread',
    applications: ['Machinery mounting', 'Engine and motor isolation', 'Panel and enclosure damping'],
  },
  {
    name: 'Rubber Buffers',
    summary: 'Impact buffers and end stops in moulded rubber.',
    description:
      'Moulded buffers that take repeated impact at travel limits and loading faces, absorbing energy that would otherwise go into the structure.',
    pattern: 'tread',
    applications: ['Loading bays and docks', 'Machine end stops', 'Door and gate buffers'],
  },
  {
    name: 'Rubber Pads',
    summary: 'Moulded pads for load spreading and isolation.',
    description:
      'Flat moulded pads that spread load, isolate vibration or protect a contact face, cut or moulded to the footprint you need.',
    pattern: 'grid',
    applications: ['Machine feet and bases', 'Structural bearing pads', 'Anti-slip surfaces'],
  },
  {
    name: 'Rubber Strips',
    summary: 'Moulded and cut strip to section and length.',
    description:
      'Rubber strip supplied to your section and length for sealing, edging and packing duty.',
    pattern: 'stripe',
    applications: ['Edge sealing', 'Packing and shimming', 'Door and hatch seals'],
  },
  {
    name: 'Rubber Diaphragms',
    summary: 'Flexible diaphragms for pumps, valves and actuators.',
    description:
      'Moulded diaphragms that separate two chambers while flexing through their stroke — fabric-reinforced where pressure or cycle life demands it.',
    pattern: 'rings',
    applications: ['Diaphragm pumps', 'Control valves and regulators', 'Pneumatic actuators'],
  },
  {
    name: 'Rubber Stoppers',
    summary: 'Moulded stoppers and plugs for closing ports and openings.',
    description:
      'Tapered and straight moulded stoppers for sealing openings, ports and vessel necks.',
    pattern: 'dots',
    applications: ['Vessel and tank openings', 'Port and drain plugging', 'Laboratory and process closures'],
  },
  {
    name: 'Rubber Caps',
    summary: 'Protective caps for thread, spigot and tube ends.',
    description:
      'Moulded caps that close and protect exposed ends — threads, spigots, tube and bar — through handling, storage and transit.',
    pattern: 'dots',
    applications: ['Thread and fitting protection', 'Tube and bar end capping', 'Masking during finishing'],
  },
  {
    name: 'Rubber Neck Rings',
    summary: 'Moulded neck rings for container and vessel necks.',
    description:
      'Sealing and locating rings for container and vessel necks, moulded to the profile of the neck they seat on.',
    pattern: 'rings',
    applications: ['Container necks', 'Vessel closures', 'Process equipment sealing'],
  },
  {
    name: 'Rubber Pressure Cups',
    summary: 'Cup seals for pressure and hydraulic service.',
    description:
      'Moulded cup seals that seal against a bore under pressure, with lip and wall section chosen against the pressure and stroke.',
    pattern: 'rings',
    applications: ['Hydraulic cylinders', 'Pumps and pressure vessels', 'Brake and clutch assemblies'],
  },
  {
    name: 'Rubber Belts',
    summary: 'Moulded rubber belts for drive and conveying duty.',
    description:
      'Rubber belting for drive and conveying applications, in widths, lengths and covers set by the run.',
    pattern: 'weave',
    applications: ['Drive transmission', 'Light conveying', 'Material handling lines'],
  },
  {
    name: 'Pulley Rubber Lagging',
    slug: 'pulley-lagging',
    summary: 'Lagging that restores grip between pulley and belt.',
    description:
      'Rubber lagging bonded to conveyor pulley faces to restore traction, cut belt slip and reduce wear on both the pulley and the belt.',
    pattern: 'tread',
    applications: ['Conveyor drive pulleys', 'Mining and quarry conveyors', 'Bulk material handling'],
  },
  {
    name: 'Rubber Roofing',
    summary: 'Rubber roofing membrane for weatherproofing.',
    description:
      'Rubber roofing for weatherproofing duty, standing up to UV, ozone and temperature swing where a coated membrane would perish.',
    pattern: 'grid',
    applications: ['Flat and low-pitch roofs', 'Terrace waterproofing', 'Building envelope sealing'],
  },
  {
    name: 'Building Protection Systems',
    summary: 'Rubber protection components for buildings and structures.',
    description:
      'Rubber components that protect building structures and surfaces from impact, abrasion and weather in service.',
    pattern: 'grid',
    applications: ['Car park and loading areas', 'Wall and column protection', 'Structural bearing surfaces'],
  },
  {
    name: 'Pipe Supports',
    summary: 'Rubber-lined supports that carry pipe and damp vibration.',
    description:
      'Rubber pipe supports and inserts that carry pipework while isolating vibration and preventing metal-to-metal wear at the support point.',
    pattern: 'rings',
    applications: ['Process pipework', 'Building services', 'Plant and utility runs'],
  },
];

const moulded: CatalogueProduct[] = mouldedSeeds.map((seed) => {
  const slug = `moulded-${seed.slug ?? slugify(seed.name.replace(/^Rubber /, ''))}`;
  return {
    id: slug,
    slug,
    name: seed.name,
    category: 'moulded',
    summary: seed.summary,
    description: seed.description,
    pattern: seed.pattern,
    image: seed.image,
    chips: [
      { label: 'Type', value: 'Moulded', at: 'top-right' },
      { label: 'Sizing', value: 'Per job', at: 'bottom-left' },
    ],
    materials: ['Compound selected per application'],
    specs: [
      { label: 'Product type', value: 'Moulded rubber component' },
      { label: 'Manufacture', value: 'Customised — to drawing or sample' },
      { label: 'Sizing', value: 'Per job' },
      BRAND,
      ORIGIN,
      MOQ_SPEC,
      PRICING,
    ],
    features: MOULDED_FEATURES,
    applications: seed.applications,
    leadTime: LEAD_TIME,
    moq: MOQ,
  };
});

export const catalogue: CatalogueProduct[] = [
  ...treadRubber,
  ...retreading,
  ...compounds,
  ...reclaimed,
  ...moulded,
];

/** Catalogue keyed by slug — built once, so lookups are not a linear scan. */
const bySlug = new Map(catalogue.map((product) => [product.slug, product]));
const byId = new Map(catalogue.map((product) => [product.id, product]));

export function findProductBySlug(slug: string): CatalogueProduct | undefined {
  return bySlug.get(slug);
}

/** Resolves saved wishlist ids to products, dropping any that no longer exist. */
export function findProductsByIds(ids: readonly string[]): CatalogueProduct[] {
  return ids
    .map((id) => byId.get(id))
    .filter((product): product is CatalogueProduct => product !== undefined);
}

export function findCategory(id: string) {
  return productCategories.find((category) => category.id === id);
}

export function categoryLabel(id: string): string {
  return findCategory(id)?.label ?? id;
}

/** Other products in the same category, for the detail page's related rail. */
export function relatedProducts(
  product: CatalogueProduct,
  limit = 3,
): CatalogueProduct[] {
  return catalogue
    .filter((item) => item.category === product.category && item.id !== product.id)
    .slice(0, limit);
}
