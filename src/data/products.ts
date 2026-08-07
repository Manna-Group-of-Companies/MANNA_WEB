/**
 * Tyre retreading catalogue.
 *
 * Category names and every size code below are taken verbatim from
 * mannarubber.com/our-products/tyre-retreading.
 *
 * `fitment` groups each size into a vehicle class so the catalogue can be
 * filtered/sorted — it is a presentation aid derived from the size code, not a
 * separate manufacturer claim. `performance` values are indicative profiles for
 * comparison between ranges, surfaced in the UI with that caveat.
 */

export const FITMENTS = [
  "Truck & Bus",
  "LCV",
  "Passenger",
  "OTR & Earthmover",
  "Small / 3-Wheeler",
] as const;

export type Fitment = (typeof FITMENTS)[number];

export type Size = {
  code: string;
  fitment: Fitment;
  /** Heavy-duty variant flagged on the source page */
  hd?: boolean;
};

export type PerformanceKey =
  | "mileage"
  | "costSaving"
  | "cutChipResistance"
  | "heatResistance"
  | "retreadability";

export type Product = {
  id: string;
  name: string;
  abbr: string;
  category: string;
  badge: string;
  tagline: string;
  summary: string;
  /** Longer copy for the Quick View / detail tab */
  description: string;
  image: string;
  accent: "orange" | "amber" | "slate";
  construction: string;
  curing: "Pre-cure" | "Hot / Conventional";
  applications: string[];
  features: string[];
  recommendedFor: string[];
  specs: { label: string; value: string }[];
  performance: Record<PerformanceKey, number>;
  sizes: Size[];
  featured?: boolean;
};

export const PERFORMANCE_LABELS: Record<PerformanceKey, string> = {
  mileage: "Mileage potential",
  costSaving: "Cost saving vs. new",
  cutChipResistance: "Cut & chip resistance",
  heatResistance: "Heat resistance",
  retreadability: "Multi-retread capability",
};

export const products: Product[] = [
  {
    id: "pctr",
    name: "Pre-Cure Tread Rubber",
    abbr: "PCTR",
    category: "Pre-Cure",
    badge: "Core Range",
    tagline: "The workhorse range — 23 sizes, every vehicle class",
    summary:
      "Our widest pre-cured tread range, covering everything from 400×08 three-wheeler stock to 1200×20 HD truck sections.",
    description:
      "Pre-Cure Tread Rubber is vulcanised to its final pattern before it reaches the retreader, so bonding happens at low temperature in an envelope and chamber. That keeps casing stress low and makes the process repeatable across a fleet. Our PCTR range is compounded in-house at Rubber Park and spans 23 published sizes — the broadest single range we make, and the reason most of our fleet and dealer customers start here.",
    image: "/images/products/pctr.svg",
    accent: "orange",
    construction: "Bias & radial casings",
    curing: "Pre-cure",
    featured: true,
    applications: [
      "Long-haul freight",
      "Intercity bus fleets",
      "Light commercial delivery",
      "Passenger cars & taxis",
      "Three-wheelers & small haulage",
    ],
    features: [
      "In-house compounded, batch-tested tread stock",
      "Low-temperature chamber cure — gentler on the casing",
      "Consistent gauge and pattern depth across the roll",
      "Wide size ladder from 400×08 up to 1200×20 HD",
      "High cut-and-chip resistance for mixed road surfaces",
      "Price on request with export-ready packing",
    ],
    recommendedFor: [
      "Fleet operators standardising on one tread supplier",
      "Retreading plants running pre-cure envelopes",
      "Distributors needing broad size coverage in one order",
    ],
    specs: [
      { label: "Cure method", value: "Pre-cure (cold bonding)" },
      { label: "Casing types", value: "Bias-ply and radial" },
      { label: "Published sizes", value: "23" },
      { label: "Bonding gum", value: "Cushion gum supplied to match" },
      { label: "Packing", value: "Rolls, export-wrapped" },
      { label: "MOQ", value: "On request" },
      { label: "Lead time", value: "Indicative — confirm at quotation" },
      { label: "Pricing", value: "Price on request" },
    ],
    performance: {
      mileage: 88,
      costSaving: 82,
      cutChipResistance: 84,
      heatResistance: 78,
      retreadability: 85,
    },
    sizes: [
      { code: "12.5×80×18", fitment: "Truck & Bus" },
      { code: "12.5×70×18", fitment: "Truck & Bus" },
      { code: "405×70×20", fitment: "Truck & Bus" },
      { code: "12×24 HD", fitment: "Truck & Bus", hd: true },
      { code: "1200×20 HD", fitment: "Truck & Bus", hd: true },
      { code: "900×20", fitment: "Truck & Bus" },
      { code: "825×20", fitment: "Truck & Bus" },
      { code: "900×16", fitment: "LCV" },
      { code: "825×16", fitment: "LCV" },
      { code: "750×16", fitment: "LCV" },
      { code: "700×16", fitment: "LCV" },
      { code: "700×15", fitment: "LCV" },
      { code: "600×16", fitment: "LCV" },
      { code: "235×75×17.5", fitment: "LCV" },
      { code: "78×15 / 215×14 / 195×15", fitment: "Passenger" },
      { code: "185×14", fitment: "Passenger" },
      { code: "165×14", fitment: "Passenger" },
      { code: "165×13", fitment: "Passenger" },
      { code: "165×12", fitment: "Passenger" },
      { code: "155×12", fitment: "Passenger" },
      { code: "500×10", fitment: "Small / 3-Wheeler" },
      { code: "450×10", fitment: "Small / 3-Wheeler" },
      { code: "400×08", fitment: "Small / 3-Wheeler" },
    ],
  },

  {
    id: "pctr-radial",
    name: "PCTR Radial",
    abbr: "PCTR-R",
    category: "Pre-Cure",
    badge: "Radial Casings",
    tagline: "Compounded specifically for radial truck casings",
    summary:
      "Pre-cured tread engineered for the flex pattern and heat build-up of radial truck and bus casings, including 295R22.5.",
    description:
      "Radial casings flex differently from bias-ply — the belt package is stiff while the sidewall works hard, which changes how heat moves through the crown. This range is compounded for that duty cycle: cooler running under sustained highway load, and a bonding profile matched to modern radial buffing radii. It is the range to specify for tubeless 22.5″ fitments.",
    image: "/images/products/pctr-radial.svg",
    accent: "amber",
    construction: "Radial casings",
    curing: "Pre-cure",
    featured: true,
    applications: [
      "Radial truck long-haul",
      "Tubeless 22.5″ fitments",
      "Highway coach operations",
      "Container and trailer haulage",
    ],
    features: [
      "Compound tuned for radial heat build-up",
      "Matched to modern radial buffing radii",
      "Covers 295R22.5 tubeless fitment",
      "Stable footprint under sustained highway load",
      "Even shoulder wear on drive and trailer positions",
      "Price on request",
    ],
    recommendedFor: [
      "Highway fleets that have moved to radial tubeless",
      "Container haulage running long duty cycles",
      "Retreaders serving 22.5″ radial customers",
    ],
    specs: [
      { label: "Cure method", value: "Pre-cure (cold bonding)" },
      { label: "Casing types", value: "Radial" },
      { label: "Published sizes", value: "4" },
      { label: "Tubeless fitment", value: "295R22.5" },
      { label: "Position", value: "Drive & trailer" },
      { label: "Packing", value: "Rolls, export-wrapped" },
      { label: "Pricing", value: "Price on request" },
    ],
    performance: {
      mileage: 93,
      costSaving: 80,
      cutChipResistance: 80,
      heatResistance: 90,
      retreadability: 88,
    },
    sizes: [
      { code: "1000×20", fitment: "Truck & Bus" },
      { code: "1100×20", fitment: "Truck & Bus" },
      { code: "295R22.5", fitment: "Truck & Bus" },
      { code: "825×20", fitment: "Truck & Bus" },
    ],
  },

  {
    id: "pctr-nylon",
    name: "PCTR Nylon",
    abbr: "PCTR-N",
    category: "Pre-Cure",
    badge: "Bias-Ply",
    tagline: "For nylon bias-ply casings still doing the hard miles",
    summary:
      "Pre-cured tread for nylon bias-ply truck casings in 1000×20 and 1100×20 — the backbone of mixed-road commercial fleets.",
    description:
      "Nylon bias-ply casings remain the dominant fitment across much of India, Africa and the Middle East, and they are not going away — they tolerate overload and bad roads in a way radials do not. This range keeps that advantage intact: a resilient compound with high cut resistance, sized for the two fitments that carry most of that traffic.",
    image: "/images/products/pctr-nylon.svg",
    accent: "slate",
    construction: "Nylon bias-ply casings",
    curing: "Pre-cure",
    applications: [
      "Mixed on/off road haulage",
      "Regional freight on unmade roads",
      "Tipper and construction supply",
      "Rural bus operations",
    ],
    features: [
      "Resilient compound for overload tolerance",
      "High cut resistance on unmade road surfaces",
      "Sized for the two highest-volume nylon fitments",
      "Forgiving of variable casing condition",
      "Strong choice for export markets with rough roads",
      "Price on request",
    ],
    recommendedFor: [
      "Operators on unmade or badly maintained roads",
      "Markets where nylon bias-ply remains standard",
      "Tipper and site-supply fleets",
    ],
    specs: [
      { label: "Cure method", value: "Pre-cure (cold bonding)" },
      { label: "Casing types", value: "Nylon bias-ply" },
      { label: "Published sizes", value: "2" },
      { label: "Strength", value: "Overload & cut tolerance" },
      { label: "Packing", value: "Rolls, export-wrapped" },
      { label: "Pricing", value: "Price on request" },
    ],
    performance: {
      mileage: 80,
      costSaving: 88,
      cutChipResistance: 90,
      heatResistance: 72,
      retreadability: 78,
    },
    sizes: [
      { code: "1000×20", fitment: "Truck & Bus" },
      { code: "1100×20", fitment: "Truck & Bus" },
    ],
  },

  {
    id: "hot",
    name: "Hot Retreading Compound",
    abbr: "HOT",
    category: "Hot Retreading",
    badge: "14 Sizes",
    tagline: "Mould-cured tread for earthmover and heavy plant",
    summary:
      "Conventional hot-process retreading stock, from 450×10 up to 17.5×25 earthmover sections — where pre-cure cannot reach.",
    description:
      "Hot retreading cures the tread in a mould under heat and pressure, forming the pattern in place. It is the process of choice for large off-highway sections, deep-lug patterns and heavily worked casings, because it puts new rubber into the shoulders and lets you rebuild profile rather than just replace the crown. Our HOT range spans 14 published sizes, weighted towards earthmover and heavy-plant fitments.",
    image: "/images/products/hot.svg",
    accent: "orange",
    construction: "Bias-ply, OTR & heavy plant",
    curing: "Hot / Conventional",
    featured: true,
    applications: [
      "Earthmovers & wheel loaders",
      "Backhoe and grader fitments",
      "Quarry and mining haulage",
      "Agricultural tractors",
      "Heavy plant on site",
    ],
    features: [
      "Mould-cured — pattern formed under heat and pressure",
      "Rebuilds shoulder profile, not just the crown",
      "Deep-lug capable for traction-critical duty",
      "Covers large 25″ and 28″ earthmover sections",
      "Suited to heavily worked and repaired casings",
      "Price on request",
    ],
    recommendedFor: [
      "Mining and quarry fleets",
      "Construction plant operators",
      "Agricultural contractors",
      "Retreaders running mould presses",
    ],
    specs: [
      { label: "Cure method", value: "Hot / conventional mould cure" },
      { label: "Casing types", value: "Bias-ply, OTR, agricultural" },
      { label: "Published sizes", value: "14" },
      { label: "Largest section", value: "17.5×25" },
      { label: "Pattern", value: "Formed in mould" },
      { label: "Pricing", value: "Price on request" },
    ],
    performance: {
      mileage: 76,
      costSaving: 92,
      cutChipResistance: 95,
      heatResistance: 82,
      retreadability: 70,
    },
    sizes: [
      { code: "17.5×25", fitment: "OTR & Earthmover" },
      { code: "16×09×28", fitment: "OTR & Earthmover" },
      { code: "15.5×25", fitment: "OTR & Earthmover" },
      { code: "14×25", fitment: "OTR & Earthmover" },
      { code: "14×24", fitment: "OTR & Earthmover" },
      { code: "13×24", fitment: "OTR & Earthmover" },
      { code: "13×6×28", fitment: "OTR & Earthmover" },
      { code: "12×4×28", fitment: "OTR & Earthmover" },
      { code: "1000×20", fitment: "Truck & Bus" },
      { code: "900×20", fitment: "Truck & Bus" },
      { code: "825×16", fitment: "LCV" },
      { code: "750×16", fitment: "LCV" },
      { code: "700×16", fitment: "LCV" },
      { code: "450×10", fitment: "Small / 3-Wheeler" },
    ],
  },

  {
    id: "pctr-off-road",
    name: "PCTR Off Road",
    abbr: "PCTR-OR",
    category: "Pre-Cure",
    badge: "Made to Order",
    tagline: "Aggressive pre-cure tread for off-highway duty",
    summary:
      "Off-road pre-cured tread built to order for site, quarry and agricultural vehicles. Sizes and pattern confirmed at enquiry.",
    description:
      "Off-highway work destroys tread in a completely different way to the highway: it is cutting, chipping and stone retention rather than abrasion. This range uses a deeper, more open pattern and a tougher compound aimed at those failure modes. Because off-road fitments vary widely by machine, sizes for this range are confirmed against your requirement at the enquiry stage rather than held as a fixed published list.",
    image: "/images/products/pctr-off-road.svg",
    accent: "amber",
    construction: "Off-highway casings",
    curing: "Pre-cure",
    applications: [
      "Quarry and aggregate sites",
      "Construction site vehicles",
      "Agricultural haulage",
      "Forestry and plantation",
      "Mixed-service fleets",
    ],
    features: [
      "Deep, open pattern for self-cleaning",
      "Tough compound targeting cut and chip failure",
      "Reduced stone retention between lugs",
      "Made to order against your fitment list",
      "Pairs with our HOT range for full site coverage",
      "Price on request",
    ],
    recommendedFor: [
      "Sites running mixed machine fleets",
      "Operators with non-standard fitments",
      "Buyers needing pattern selection advice",
    ],
    specs: [
      { label: "Cure method", value: "Pre-cure (cold bonding)" },
      { label: "Casing types", value: "Off-highway" },
      { label: "Published sizes", value: "Confirmed at enquiry" },
      { label: "Pattern", value: "Deep lug, open shoulder" },
      { label: "Availability", value: "Made to order" },
      { label: "Pricing", value: "Price on request" },
    ],
    performance: {
      mileage: 72,
      costSaving: 86,
      cutChipResistance: 97,
      heatResistance: 80,
      retreadability: 74,
    },
    sizes: [],
  },
];

/* ── Derived helpers ─────────────────────────────────────────── */

export const allSizes = products.flatMap((p) =>
  p.sizes.map((s) => ({ ...s, productId: p.id, productName: p.name, abbr: p.abbr })),
);

export const totalSizeCount = allSizes.length;

export const categories = Array.from(new Set(products.map((p) => p.category)));

export const applications = Array.from(
  new Set(products.flatMap((p) => p.applications)),
).sort();

export const fitmentsInUse = FITMENTS.filter((f) =>
  allSizes.some((s) => s.fitment === f),
);

export function getProduct(id: string) {
  return products.find((p) => p.id === id);
}
