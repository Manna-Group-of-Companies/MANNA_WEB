import { products } from "./products";

export const sectionIds = [
  "home",
  "products",
  "process",
  "benefits",
  "comparison",
  "industries",
  "reviews",
  "gallery",
  "faq",
  "contact",
] as const;

export type SectionId = (typeof sectionIds)[number];

export type PrimaryNavItem = {
  label: string;
  href: string;
  id: SectionId;
  /** Opens the products mega menu on hover. */
  mega?: boolean;
};

export const primaryNav: readonly PrimaryNavItem[] = [
  { label: "Overview", href: "#home", id: "home" },
  { label: "Products", href: "#products", id: "products", mega: true },
  { label: "Process", href: "#process", id: "process" },
  { label: "Why Retread", href: "#benefits", id: "benefits" },
  { label: "Industries", href: "#industries", id: "industries" },
  { label: "Reviews", href: "#reviews", id: "reviews" },
  { label: "Gallery", href: "#gallery", id: "gallery" },
  { label: "FAQ", href: "#faq", id: "faq" },
];

export const megaColumns = [
  {
    title: "Tyre Retreading Ranges",
    note: "Five ranges, 43 published sizes",
    links: products.map((p) => ({
      label: p.name,
      href: `#product-${p.id}`,
      desc: p.tagline,
      abbr: p.abbr,
    })),
  },
  {
    title: "Also Manufactured",
    note: "Same facility, same compounds",
    links: [
      {
        label: "Tread Rubber",
        href: "#products",
        desc: "Pre-cure and conventional tread stock",
        abbr: "TR",
      },
      {
        label: "Rubber Compounds & Mixing",
        href: "#contact",
        desc: "Custom compounding to your specification",
        abbr: "RC",
      },
      {
        label: "Reclaimed Rubber",
        href: "#contact",
        desc: "Recovered material for cost and sustainability",
        abbr: "RR",
      },
      {
        label: "Moulded Rubber Goods",
        href: "#contact",
        desc: "Customised moulded components",
        abbr: "MG",
      },
    ],
  },
] as const;

export const megaHighlights = [
  { label: "Cushion gum supplied to match", href: "#products" },
  { label: "Export packing & documentation", href: "#contact" },
  { label: "Pattern selection advice", href: "#contact" },
] as const;
