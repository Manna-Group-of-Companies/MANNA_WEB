export const processSteps = [
  {
    n: "01",
    title: "Inspection",
    icon: "ScanSearch",
    duration: "Stage 1",
    summary: "Every casing is checked before it earns a second life.",
    detail:
      "Incoming casings are visually inspected and shearography-checked for separations, penetrations and bead damage. Anything outside tolerance is rejected here rather than later — a bad casing is the single biggest cause of a failed retread.",
    checks: ["Casing age & history", "Bead & sidewall integrity", "Hidden separation scan"],
  },
  {
    n: "02",
    title: "Buffing",
    icon: "Disc3",
    duration: "Stage 2",
    summary: "Old tread removed to a precise radius and texture.",
    detail:
      "The remaining tread is buffed away to a controlled radius matched to the casing's design profile, leaving a consistent texture for the new rubber to key into. Buffing diameter is measured, not eyeballed — it determines the final tread depth and the balance of the finished tyre.",
    checks: ["Profile radius set", "Texture graded", "Buff diameter recorded"],
  },
  {
    n: "03",
    title: "Repair",
    icon: "Wrench",
    duration: "Stage 3",
    summary: "Injuries skived out and filled before anything is built.",
    detail:
      "Nail holes, cuts and minor injuries are skived back to clean rubber and filled with repair units and gum. Each repair is logged against the casing so its history follows it — essential for fleets tracking cost per kilometre across multiple lives.",
    checks: ["Injury skiving", "Repair units fitted", "Casing history logged"],
  },
  {
    n: "04",
    title: "Building",
    icon: "Layers",
    duration: "Stage 4",
    summary: "Cushion gum and tread applied under controlled tension.",
    detail:
      "A layer of cushion gum is applied, then the pre-cured tread is laid on under measured tension and stitched down to eliminate trapped air. Tension matters: too tight and the tread creeps, too loose and the bond starves.",
    checks: ["Cushion gum applied", "Tread tension controlled", "Air stitched out"],
  },
  {
    n: "05",
    title: "Curing",
    icon: "Flame",
    duration: "Stage 5",
    summary: "Bonded in an envelope and chamber under heat and pressure.",
    detail:
      "The assembly is sealed in an envelope and cured in a chamber under controlled heat, pressure and time. Pre-cure runs cooler than a mould cure, which is exactly why the casing survives to be retreaded again.",
    checks: ["Envelope sealed", "Cycle time held", "Temperature logged"],
  },
  {
    n: "06",
    title: "Quality Inspection",
    icon: "BadgeCheck",
    duration: "Stage 6",
    summary: "Final check against release criteria — no exceptions.",
    detail:
      "Cured tyres are inspected for bond integrity, tread alignment, balance and finish, then trimmed and painted. Only tyres meeting every release criterion are passed; the rest go back or out.",
    checks: ["Bond integrity", "Alignment & balance", "Final finish"],
  },
  {
    n: "07",
    title: "Ready for Delivery",
    icon: "Truck",
    duration: "Stage 7",
    summary: "Wrapped, documented and staged for dispatch or export.",
    detail:
      "Approved tyres are wrapped, labelled and staged. For export orders we handle container loading and the documentation that goes with it — the same discipline we apply to shipments across Africa and the Middle East.",
    checks: ["Wrapped & labelled", "Export documentation", "Container loading"],
  },
] as const;

export const benefits = [
  {
    icon: "PiggyBank",
    title: "Lower Cost",
    metric: "Up to 60%",
    body: "A retread costs a fraction of a comparable new tyre, because you are buying rubber and labour — not a whole new casing.",
  },
  {
    icon: "Leaf",
    title: "Eco Friendly",
    metric: "~70% less oil",
    body: "Retreading a casing uses far less crude oil than building a new tyre from scratch, and keeps a serviceable casing out of the waste stream.",
  },
  {
    icon: "Timer",
    title: "Longer Tyre Life",
    metric: "2–3 lives",
    body: "A sound casing can carry multiple tread lives. Managed properly, that multiplies the return on the original tyre purchase.",
  },
  {
    icon: "Gauge",
    title: "High Mileage",
    metric: "Near-new",
    body: "A quality retread on a good casing delivers mileage competitive with a new tyre in the same duty cycle.",
  },
  {
    icon: "Fuel",
    title: "Fuel Savings",
    metric: "Optimised RR",
    body: "Correct tread pattern and depth for the duty cycle keeps rolling resistance in check across the fleet.",
  },
  {
    icon: "Recycle",
    title: "Sustainable Recycling",
    metric: "Closed loop",
    body: "We also produce reclaimed rubber — material recovery runs alongside retreading rather than competing with it.",
  },
] as const;

/** Indicative comparison for decision support, not a laboratory result. */
export const comparison = [
  {
    metric: "Purchase Cost",
    icon: "IndianRupee",
    newTyre: 100,
    retread: 40,
    newLabel: "Full price",
    retreadLabel: "~40% of new",
    note: "You are buying tread rubber and labour, not a new casing.",
    lowerIsBetter: true,
  },
  {
    metric: "Mileage Delivered",
    icon: "Gauge",
    newTyre: 100,
    retread: 88,
    newLabel: "Baseline",
    retreadLabel: "~88% of new",
    note: "On a sound casing with the correct tread for the duty cycle.",
    lowerIsBetter: false,
  },
  {
    metric: "Performance & Grip",
    icon: "Activity",
    newTyre: 100,
    retread: 92,
    newLabel: "Baseline",
    retreadLabel: "Comparable",
    note: "Pattern depth and compound are specified to the application.",
    lowerIsBetter: false,
  },
  {
    metric: "Environmental Impact",
    icon: "Leaf",
    newTyre: 100,
    retread: 30,
    newLabel: "High",
    retreadLabel: "~70% lower",
    note: "Far less crude oil per tyre; the casing is reused, not scrapped.",
    lowerIsBetter: true,
  },
  {
    metric: "Total Lifespan",
    icon: "Timer",
    newTyre: 100,
    retread: 240,
    newLabel: "One life",
    retreadLabel: "2–3 lives",
    note: "Measured across the life of the casing, not a single tread.",
    lowerIsBetter: false,
  },
  {
    metric: "Return on Investment",
    icon: "TrendingUp",
    newTyre: 100,
    retread: 215,
    newLabel: "Baseline",
    retreadLabel: "2×+ baseline",
    note: "Cost per kilometre falls with each additional tread life.",
    lowerIsBetter: false,
  },
] as const;

export const industries = [
  {
    icon: "Package",
    title: "Logistics",
    body: "Line-haul and distribution fleets where cost per kilometre decides the contract.",
    fitments: ["Truck & Bus", "LCV"],
  },
  {
    icon: "Mountain",
    title: "Mining",
    body: "Quarry and pit haulage on abrasive surfaces that punish standard tread.",
    fitments: ["OTR & Earthmover"],
  },
  {
    icon: "HardHat",
    title: "Construction",
    body: "Site vehicles, tippers and plant working between road and rough ground.",
    fitments: ["OTR & Earthmover", "Truck & Bus"],
  },
  {
    icon: "Tractor",
    title: "Agriculture",
    body: "Tractors and harvest haulage needing traction without shredding the casing.",
    fitments: ["OTR & Earthmover"],
  },
  {
    icon: "Bus",
    title: "Transport",
    body: "Bus and coach operators running high daily mileage on fixed routes.",
    fitments: ["Truck & Bus"],
  },
  {
    icon: "Users",
    title: "Fleet Operators",
    body: "Multi-vehicle operators managing casing banks and retread cycles.",
    fitments: ["Truck & Bus", "LCV", "Passenger"],
  },
  {
    icon: "Forklift",
    title: "Industrial Vehicles",
    body: "Yard equipment, forklifts and in-plant movers on hard standing.",
    fitments: ["Small / 3-Wheeler", "LCV"],
  },
] as const;

/**
 * ⚠️ PLACEHOLDER TESTIMONIALS — REPLACE BEFORE GOING LIVE.
 * These are illustrative copy written to size the layout. They are attributed
 * by role and region only (no invented individuals). Swap in real, approved
 * customer quotes with permission before this page is published.
 */
export const testimonials = [
  {
    quote:
      "We moved our whole trailer fleet onto pre-cure and the cost per kilometre dropped in the first quarter. The size range meant one supplier instead of three.",
    role: "Fleet Manager",
    org: "Regional haulage operator",
    market: "Kerala, India",
    rating: 5,
    placeholder: true,
  },
  {
    quote:
      "Casing survival is what matters to us. Two lives out of the same casing is now normal rather than lucky, and the paperwork for export has never held up a container.",
    role: "Procurement Head",
    org: "Container logistics group",
    market: "United Arab Emirates",
    rating: 5,
    placeholder: true,
  },
  {
    quote:
      "Our quarry loaders were eating tread. The hot-process range holds up in the pit far better than what we ran before, and the shoulder rebuild is the difference.",
    role: "Site Operations Lead",
    org: "Aggregates and quarrying",
    market: "East Africa",
    rating: 5,
    placeholder: true,
  },
  {
    quote:
      "Consistent gauge, roll after roll. As a retreading plant that is the thing you actually buy — we can hold our cycle times because the stock does not vary.",
    role: "Plant Manager",
    org: "Independent retreading plant",
    market: "Tamil Nadu, India",
    rating: 5,
    placeholder: true,
  },
  {
    quote:
      "They will talk you through pattern selection rather than just quoting. For a mixed machine fleet that advice saved us specifying the wrong thing twice over.",
    role: "Managing Director",
    org: "Construction plant hire",
    market: "Oman",
    rating: 5,
    placeholder: true,
  },
] as const;

export const gallery = [
  { src: "/images/gallery/factory-01.svg", alt: "Manufacturing floor at Rubber Park facility", category: "Factory", span: "tall" },
  { src: "/images/gallery/manufacturing-01.svg", alt: "Rubber compound mixing line", category: "Manufacturing", span: "wide" },
  { src: "/images/gallery/products-01.svg", alt: "Pre-cured tread rubber rolls ready for dispatch", category: "Products", span: "square" },
  { src: "/images/gallery/quality-01.svg", alt: "Quality inspection of cured tread", category: "Quality Inspection", span: "square" },
  { src: "/images/gallery/export-01.svg", alt: "Export container loading for Africa and Middle East shipments", category: "Export", span: "wide" },
  { src: "/images/gallery/factory-02.svg", alt: "Curing chamber bank in operation", category: "Factory", span: "square" },
  { src: "/images/gallery/products-02.svg", alt: "Hot process tread sections for earthmover fitments", category: "Products", span: "tall" },
  { src: "/images/gallery/quality-02.svg", alt: "Laboratory batch testing of rubber compound", category: "Quality Inspection", span: "square" },
  { src: "/images/gallery/manufacturing-02.svg", alt: "Tread extrusion and cooling line", category: "Manufacturing", span: "wide" },
  { src: "/images/gallery/factory-03.svg", alt: "Mill room and batch-off line", category: "Factory", span: "square" },
  { src: "/images/gallery/manufacturing-03.svg", alt: "Calendering and liner winding station", category: "Manufacturing", span: "wide" },
  { src: "/images/gallery/products-03.svg", alt: "Cushion gum reels matched to the tread stock", category: "Products", span: "square" },
  { src: "/images/gallery/quality-03.svg", alt: "Shearography check on an incoming casing", category: "Quality Inspection", span: "tall" },
  { src: "/images/gallery/export-02.svg", alt: "Export-standard packing bay", category: "Export", span: "square" },
  { src: "/images/gallery/export-03.svg", alt: "Dispatch bay and shipping documentation", category: "Export", span: "wide" },
  { src: "/images/gallery/factory-04.svg", alt: "Gantry and bay lighting over the curing line", category: "Factory", span: "tall" },
  { src: "/images/gallery/manufacturing-04.svg", alt: "Cooling festoon and take-off section", category: "Manufacturing", span: "square" },
  { src: "/images/gallery/products-04.svg", alt: "Reclaimed rubber bales ready for compounding", category: "Products", span: "wide" },
  { src: "/images/gallery/quality-04.svg", alt: "Dimensional gauge station for tread thickness", category: "Quality Inspection", span: "square" },
  { src: "/images/gallery/export-04.svg", alt: "Container seal-off before dispatch", category: "Export", span: "tall" },
  { src: "/images/gallery/retreading-01.svg", alt: "Buffing station preparing a casing crown for new tread", category: "Retreading", span: "wide" },
  { src: "/images/gallery/machinery-01.svg", alt: "Curing press with the mould platens closed", category: "Machinery", span: "square" },
  { src: "/images/gallery/warehouse-01.svg", alt: "Finished goods racking at the dispatch warehouse", category: "Warehouse", span: "wide" },
  { src: "/images/gallery/retreading-02.svg", alt: "Tread application onto a buffed truck casing", category: "Retreading", span: "tall" },
  { src: "/images/gallery/machinery-02.svg", alt: "Drive gear train on the mixing mill", category: "Machinery", span: "tall" },
  { src: "/images/gallery/warehouse-02.svg", alt: "Palletised tread rolls staged for loading", category: "Warehouse", span: "square" },
  { src: "/images/gallery/retreading-03.svg", alt: "Building drum with cushion gum laid over the casing", category: "Retreading", span: "square" },
  { src: "/images/gallery/machinery-03.svg", alt: "Extruder head and operator console", category: "Machinery", span: "wide" },
  { src: "/images/gallery/warehouse-03.svg", alt: "Rack bay holding graded tread stock", category: "Warehouse", span: "tall" },
  { src: "/images/gallery/retreading-04.svg", alt: "Cured retread leaving the chamber for final trim", category: "Retreading", span: "wide" },
  { src: "/images/gallery/machinery-04.svg", alt: "Hydraulic press bank and steam pipework", category: "Machinery", span: "square" },
  { src: "/images/gallery/warehouse-04.svg", alt: "Forklift moving stock through to the loading bay", category: "Warehouse", span: "wide" },
] as const;

export const galleryCategories = [
  "All",
  "Factory",
  "Manufacturing",
  "Retreading",
  "Products",
  "Quality Inspection",
  "Machinery",
  "Warehouse",
  "Export",
] as const;

export const faqs = [
  {
    q: "How many times can a tyre casing be retreaded?",
    a: "It depends entirely on casing condition, not on a fixed number. A well-maintained truck casing that has not been run flat or overloaded will commonly take two to three tread lives. Casings are inspected and shearography-checked before every retread — if one does not pass, it does not go through, regardless of how many lives it has had.",
  },
  {
    q: "What is the difference between pre-cure and hot retreading?",
    a: "Pre-cure tread is vulcanised into its final pattern before it reaches you, then bonded to the casing at low temperature in a chamber. Hot retreading cures the tread in a mould, forming the pattern in place under heat and pressure. Pre-cure is gentler on the casing and better for repeat retreading; hot process suits large off-highway sections and lets you rebuild shoulder profile.",
  },
  {
    q: "Which range should I specify for radial tubeless truck tyres?",
    a: "PCTR Radial. It is compounded for the heat build-up and flex pattern of radial casings and covers the 295R22.5 tubeless fitment along with 1000×20, 1100×20 and 825×20. Using bias-ply stock on a radial casing is a false economy.",
  },
  {
    q: "Do you supply sizes that are not on the published list?",
    a: "Yes for the PCTR Off Road range, which is made to order against your fitment list. For the other ranges, send us the sizes you need — if we do not hold them we will tell you honestly rather than substitute something that will not fit.",
  },
  {
    q: "Do you export, and how are shipments handled?",
    a: "We export across Africa and the Middle East and are a registered FIEO member. We handle export-standard packing, container loading and the accompanying documentation. Freight terms are confirmed at quotation.",
  },
  {
    q: "What are your minimum order quantities and lead times?",
    a: "Both depend on the range and the sizes involved, so we confirm them at quotation rather than publishing a figure that would be wrong for half of enquiries. Send your size list and required quantity through the enquiry form and you will get specifics.",
  },
  {
    q: "How is pricing determined?",
    a: "All products are quoted on request. Price depends on range, size mix, order volume and destination. There is no published price list — send the enquiry form and we will quote against your actual requirement.",
  },
  {
    q: "Do you supply cushion gum and bonding materials as well?",
    a: "Yes. Cushion gum is supplied to match the tread stock so the bonding system is consistent. We also produce rubber compounds and reclaimed rubber at the same facility.",
  },
] as const;

export const marqueeItems = [
  "Pre-Cure Tread Rubber",
  "PCTR Radial",
  "PCTR Nylon",
  "Hot Retreading",
  "PCTR Off Road",
  "Cushion Gum",
  "Rubber Compounds",
  "Reclaimed Rubber",
  "Moulded Rubber Goods",
] as const;

export const quoteProducts = [
  "PCTR — Pre-Cure Tread Rubber",
  "PCTR Radial",
  "PCTR Nylon",
  "HOT — Hot Retreading",
  "PCTR Off Road",
  "Cushion gum / bonding materials",
  "Not sure — please advise",
] as const;
