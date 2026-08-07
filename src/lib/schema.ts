import { faqs } from "@/data/content";
import { products } from "@/data/products";
import { site } from "@/data/site";

const ORIGIN = process.env.NEXT_PUBLIC_SITE_URL ?? site.url;
const PAGE_URL = `${ORIGIN}${site.pagePath}`;

const organization = {
  "@type": "Organization",
  "@id": `${ORIGIN}/#organization`,
  name: site.name,
  legalName: site.legalName,
  url: ORIGIN,
  logo: `${ORIGIN}/logo.svg`,
  foundingDate: String(site.founded),
  description: site.description,
  address: {
    "@type": "PostalAddress",
    streetAddress: `${site.address.line1}, ${site.address.line2}`,
    addressLocality: site.address.city,
    addressRegion: site.address.state,
    postalCode: site.address.postalCode,
    addressCountry: site.address.countryCode,
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: site.phone,
      email: site.email,
      contactType: "sales",
      areaServed: ["IN", "AE", "SA", "OM", "QA", "KE", "TZ", "NG", "ZA", "EG"],
      availableLanguage: ["en"],
    },
  ],
  sameAs: site.social.map((s) => s.href),
};

const itemList = {
  "@type": "ItemList",
  "@id": `${PAGE_URL}#products`,
  name: "Tyre retreading product ranges",
  numberOfItems: products.length,
  itemListElement: products.map((p, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "Product",
      "@id": `${PAGE_URL}#product-${p.id}`,
      name: p.name,
      alternateName: p.abbr,
      description: p.summary,
      category: `Tyre Retreading / ${p.category}`,
      image: `${ORIGIN}${p.image}`,
      brand: { "@type": "Brand", name: site.shortName },
      manufacturer: { "@id": `${ORIGIN}/#organization` },
      ...(p.sizes.length
        ? {
            hasMeasurement: p.sizes.map((s) => ({
              "@type": "QuantitativeValue",
              name: "Available size",
              value: s.code,
            })),
          }
        : {}),
      offers: {
        "@type": "Offer",
        availability: "https://schema.org/InStock",
        priceSpecification: {
          "@type": "PriceSpecification",
          description: "Price on request",
        },
        seller: { "@id": `${ORIGIN}/#organization` },
        url: PAGE_URL,
      },
    },
  })),
};

const faqPage = {
  "@type": "FAQPage",
  "@id": `${PAGE_URL}#faq`,
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const breadcrumb = {
  "@type": "BreadcrumbList",
  "@id": `${PAGE_URL}#breadcrumb`,
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${ORIGIN}/` },
    { "@type": "ListItem", position: 2, name: "Our Products", item: `${ORIGIN}/our-products` },
    { "@type": "ListItem", position: 3, name: "Tyre Retreading", item: PAGE_URL },
  ],
};

const webPage = {
  "@type": "WebPage",
  "@id": PAGE_URL,
  url: PAGE_URL,
  name: `Tyre Retreading — ${site.name}`,
  description: site.description,
  isPartOf: { "@type": "WebSite", "@id": `${ORIGIN}/#website`, url: ORIGIN, name: site.name },
  about: { "@id": `${ORIGIN}/#organization` },
  breadcrumb: { "@id": `${PAGE_URL}#breadcrumb` },
  inLanguage: "en",
};

export const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [organization, webPage, breadcrumb, itemList, faqPage],
};
