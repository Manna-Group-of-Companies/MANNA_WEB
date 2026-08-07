/**
 * Single source of truth for company facts.
 * Values verified against mannarubber.com — update here, propagates everywhere.
 */

export const site = {
  name: "Manna Rubber Products Pvt. Ltd.",
  shortName: "Manna Rubber",
  legalName: "Manna Rubber Products Private Limited",
  tagline: "Premium Tyre Retreading Solutions",
  description:
    "High-performance retreading for commercial, industrial, and off-road vehicles. Three decades of tread rubber manufacturing from Rubber Park, Kerala — exporting across Africa and the Middle East.",
  url: "https://www.mannarubber.com",
  pagePath: "/our-products/tyre-retreading",

  founded: 1994,
  yearsExperience: 30,

  address: {
    line1: "Plot No. 67, 68, Site A, Rubber Park",
    line2: "Valayanchirangara, Perumbavoor",
    city: "Ernakulam",
    state: "Kerala",
    postalCode: "683556",
    country: "India",
    countryCode: "IN",
  },

  phone: "+919037025722",
  phoneDisplay: "+91 90370 25722",
  whatsapp: "919037025722",
  email: "mail@hi-techtreads.com",

  /** Google Maps embed for Rubber Park, Valayanchirangara */
  mapEmbed:
    "https://www.google.com/maps?q=Rubber+Park+Valayanchirangara+Perumbavoor+Kerala+683556&output=embed",
  mapLink:
    "https://www.google.com/maps/search/?api=1&query=Rubber+Park+Valayanchirangara+Perumbavoor+Kerala+683556",

  hours: "Mon – Sat · 9:00 AM – 6:00 PM IST",

  markets: ["India", "Africa", "Middle East"],

  certifications: [
    { label: "FIEO Registered", note: "Federation of Indian Export Organisations" },
    { label: "Rubber Park Unit", note: "Govt. of Kerala industrial park" },
    { label: "Export Compliant", note: "Documentation & container loading" },
    { label: "In-house QC Lab", note: "Batch-tested compounds" },
  ],

  social: [
    { label: "LinkedIn", href: "https://www.linkedin.com/", icon: "linkedin" },
    { label: "Facebook", href: "https://www.facebook.com/", icon: "facebook" },
    { label: "Instagram", href: "https://www.instagram.com/", icon: "instagram" },
    { label: "YouTube", href: "https://www.youtube.com/", icon: "youtube" },
  ],
} as const;

export const stats = [
  { value: 30, suffix: "+", label: "Years Experience", hint: "Since the early 1990s" },
  { value: 5000, suffix: "+", label: "Happy Customers", hint: "Fleets, dealers & retreaders" },
  { value: 100, suffix: "+", label: "Product Variants", hint: "Sizes across five ranges" },
  { value: 20, suffix: "+", label: "Countries Served", hint: "Africa, Middle East & India" },
] as const;

export const heroStats = [
  { value: "30+", label: "Years Experience" },
  { value: "Africa & Middle East", label: "Export Markets" },
  { value: "100+", label: "Product Variants" },
  { value: "Fleet Trusted", label: "Operators Worldwide" },
] as const;

export type NavChild = { label: string; href: string; desc?: string };
export type NavItem = {
  label: string;
  href: string;
  mega?: boolean;
  children?: NavChild[];
};
