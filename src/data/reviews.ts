export type Review = {
  id: string;
  /** Display name of the reviewer. */
  name: string;
  role?: string;
  org?: string;
  location?: string;
  /** Which range the review is about — matches `quoteProducts` entries. */
  product?: string;
  rating: number;
  title: string;
  body: string;
  /** ISO date (YYYY-MM-DD) — formatted for display in UTC. */
  date: string;
  /** Purchase confirmed against an order. */
  verified?: boolean;
  helpful?: number;
  /** Published response from Manna Rubber. */
  reply?: { body: string; date: string };
  /** Illustrative copy, not a real customer. */
  placeholder?: boolean;
  /** Submitted from this browser, awaiting moderation — never persisted here. */
  pending?: boolean;
};

/**
 * ⚠️ PLACEHOLDER REVIEWS — REPLACE BEFORE GOING LIVE.
 * Written to size the layout, attributed by role and region only (no invented
 * individuals). Swap in real, approved reviews with permission before this page
 * is published — and note that the aggregate rating shown in the UI is computed
 * from whatever is in this file, so publishing it as-is would misrepresent it.
 */
export const reviews: readonly Review[] = [
  {
    id: "r-001",
    name: "Fleet Manager",
    role: "Fleet Manager",
    org: "Regional haulage operator",
    location: "Kerala, India",
    product: "PCTR Radial",
    rating: 5,
    title: "Cost per kilometre dropped in the first quarter",
    body: "We moved 140 trailers onto pre-cure and tracked cost per kilometre against the previous year. The drop showed up inside a quarter. Just as useful was consolidating three suppliers into one — the size range covers everything we run.",
    date: "2026-05-18",
    verified: true,
    helpful: 24,
    placeholder: true,
  },
  {
    id: "r-002",
    name: "Procurement Head",
    role: "Procurement Head",
    org: "Container logistics group",
    location: "United Arab Emirates",
    product: "PCTR Radial",
    rating: 5,
    title: "Casing survival is what we buy, and it holds",
    body: "Two lives out of the same casing is now normal for us rather than lucky. Export paperwork has never once held up a container, which for a business our size matters as much as the rubber does.",
    date: "2026-04-02",
    verified: true,
    helpful: 18,
    reply: {
      body: "Thank you — export documentation is handled in-house precisely so it never becomes your problem at the port.",
      date: "2026-04-04",
    },
    placeholder: true,
  },
  {
    id: "r-003",
    name: "Site Operations Lead",
    role: "Site Operations Lead",
    org: "Aggregates and quarrying",
    location: "East Africa",
    product: "PCTR Off Road",
    rating: 5,
    title: "Holds up in the pit where the last stock did not",
    body: "Our quarry loaders were eating tread every few months. The hot-process range lasts noticeably longer on the same haul roads, and the shoulder rebuild is the difference — that is where we were losing tyres before.",
    date: "2026-03-11",
    verified: true,
    helpful: 31,
    placeholder: true,
  },
  {
    id: "r-004",
    name: "Plant Manager",
    role: "Plant Manager",
    org: "Independent retreading plant",
    location: "Tamil Nadu, India",
    product: "PCTR — Pre-Cure Tread Rubber",
    rating: 4,
    title: "Consistent gauge, roll after roll",
    body: "As a retreading plant the gauge consistency is the thing you actually buy, and it does not vary between rolls, so our cycle times hold. Lead times stretched a little during peak season — planning around it is easy enough once you know.",
    date: "2026-02-24",
    verified: true,
    helpful: 12,
    placeholder: true,
  },
  {
    id: "r-005",
    name: "Managing Director",
    role: "Managing Director",
    org: "Construction plant hire",
    location: "Oman",
    product: "Not sure — please advise",
    rating: 5,
    title: "They talk you through pattern selection",
    body: "We came in with a mixed machine fleet and no clear idea what to specify. Rather than just quoting, they went through the fitment list with us. That advice saved us ordering the wrong thing twice over.",
    date: "2026-01-30",
    helpful: 9,
    placeholder: true,
  },
  {
    id: "r-006",
    name: "Workshop Supervisor",
    role: "Workshop Supervisor",
    org: "Bus and coach operator",
    location: "Karnataka, India",
    product: "PCTR Nylon",
    rating: 4,
    title: "Good mileage on fixed routes",
    body: "Running the same routes daily makes wear easy to compare. Mileage is close enough to new that the price difference decides it. We would like a wider choice of patterns for the front axle.",
    date: "2026-01-08",
    verified: true,
    helpful: 7,
    placeholder: true,
  },
];

export type RatingSummary = {
  count: number;
  average: number;
  /** Number of reviews at each star level, indexed 1–5. */
  distribution: Record<number, number>;
  recommendPct: number;
};

export function summarise(list: readonly Review[]): RatingSummary {
  const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let total = 0;

  for (const r of list) {
    const star = Math.round(Math.max(1, Math.min(5, r.rating)));
    distribution[star] += 1;
    total += r.rating;
  }

  const count = list.length;
  const positive = distribution[4] + distribution[5];

  return {
    count,
    average: count ? total / count : 0,
    distribution,
    recommendPct: count ? Math.round((positive / count) * 100) : 0,
  };
}

/** Stable, timezone-independent date label. */
export function formatReviewDate(iso: string) {
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(d);
}

export const reviewSorts = [
  { id: "recent", label: "Most recent" },
  { id: "helpful", label: "Most helpful" },
  { id: "highest", label: "Highest rated" },
  { id: "lowest", label: "Lowest rated" },
] as const;

export type ReviewSort = (typeof reviewSorts)[number]["id"];
