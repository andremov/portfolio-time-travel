import { type Metadata } from "next";
import { notFound } from "next/navigation";
import TimeTravel from "./time-travel";
import { resolveRoute } from "~/lib/resolve-route";
import { fetchUpstream } from "~/lib/upstream-metadata";

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

/**
 * Archived versions only — the current portfolio is served from the apex by
 * the proxy and never reaches this route.
 *
 * These pages are noindex: the versions they frame are hidden, and /versions
 * is where the archive is described for search. They still describe
 * themselves properly for a browser tab or a shared link.
 */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const route = resolveRoute(slug ?? []);
  if (!route) return { robots: { index: false, follow: true } };

  const { name, date, blurb } = route.version;
  const title = `${name} (${date})`;

  return {
    title,
    description: blurb,
    robots: { index: false, follow: true },
    openGraph: { title, description: blurb, type: "website" },
    twitter: { card: "summary", title, description: blurb },
  };
}

export default async function ArchivedVersionPage({ params }: PageProps) {
  const { slug } = await params;
  const route = resolveRoute(slug ?? []);
  if (!route) notFound();

  // A version root always exists. Anything deeper is an unverified guess at a
  // path inside that portfolio, so confirm it before framing it.
  if (!route.isVersionRoot) {
    const { status } = await fetchUpstream(route.iframeSrc);
    // A null status means upstream was unreachable, not that the page is gone.
    if (status !== null && status >= 400) notFound();
  }

  return <TimeTravel versionSlug={route.version.slug} iframeSrc={route.iframeSrc} />;
}
