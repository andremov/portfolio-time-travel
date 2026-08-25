import { type MetadataRoute } from "next";
import { SITE_URL } from "~/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    // Two sitemaps: the shell's own pages, and the portfolio's, which the
    // proxy serves from this origin.
    sitemap: [`${SITE_URL}/sitemap.xml`, `${SITE_URL}/sitemap-index.xml`],
    host: SITE_URL,
  };
}
