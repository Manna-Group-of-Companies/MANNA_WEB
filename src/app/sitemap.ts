import type { MetadataRoute } from "next";
import { site } from "@/data/site";

const ORIGIN = process.env.NEXT_PUBLIC_SITE_URL ?? site.url;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${ORIGIN}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    {
      url: `${ORIGIN}${site.pagePath}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];
}
