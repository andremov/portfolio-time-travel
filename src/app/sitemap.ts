import { type MetadataRoute } from "next";
import { SITE_URL } from "~/lib/site";

/**
 * The shell's own indexable pages. The portfolio's content URLs live in the
 * sitemap it publishes itself, which the proxy serves at /sitemap-index.xml,
 * and the archived versions are noindex.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/versions/`, changeFrequency: "monthly", priority: 0.8 },
  ];
}
