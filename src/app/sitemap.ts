import { type MetadataRoute } from "next";
import { history, DEFAULT_VERSION } from "~/data/history";
import { SITE_URL } from "~/lib/site";

/**
 * Only the shell's own indexable pages. Deeper paths canonicalise to the live
 * portfolio, which publishes its own sitemap, and "/v8" canonicalises to "/".
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/versions`, changeFrequency: "monthly", priority: 0.8 },
    ...history
      .filter((version) => version.slug !== DEFAULT_VERSION)
      .map((version) => ({
        url: `${SITE_URL}/${version.slug}`,
        changeFrequency: "yearly" as const,
        priority: 0.5,
      })),
  ];
}
