import type { MetadataRoute } from "next";
import { getLibrary } from "@/lib/library";
import { BASE_URL } from "@/lib/meta";

// The landing, the library and one entry per screen, dated by its capture.
export default function sitemap(): MetadataRoute.Sitemap {
  const items = getLibrary();
  const latest = items.map((x) => x.captured).filter(Boolean).sort().pop();
  return [
    { url: `${BASE_URL}/`, lastModified: latest, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/library`, lastModified: latest, changeFrequency: "weekly", priority: 0.9 },
    ...items.map((it) => ({ url: `${BASE_URL}/library/${it.id}`, lastModified: it.captured || undefined, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
