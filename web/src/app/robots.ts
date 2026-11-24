import type { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/meta";

export default function robots(): MetadataRoute.Robots {
  return {
    // /work/ holds client redesigns made with the skill: shown on request, not meant to be found
    rules: [{ userAgent: "*", allow: "/", disallow: ["/work/"] }],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
