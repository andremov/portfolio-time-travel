import { type Metadata } from "next";
import { notFound } from "next/navigation";
import TimeTravel from "./time-travel";
import VersionIndex from "~/_components/version-index";
import { indexingPolicy, resolveRoute } from "~/lib/resolve-route";
import { fetchUpstream } from "~/lib/upstream-metadata";

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

/**
 * Version roots are the shell's own pages and describe themselves. Deeper
 * paths are a frame around the live portfolio, so they mirror its metadata —
 * crawlers and link unfurlers don't run JS or read into iframes, and without
 * this every shell URL would share the generic title from the root layout.
 */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const route = resolveRoute(slug ?? []);
  const policy = indexingPolicy(route);

  const robots = policy.index ? undefined : { index: false, follow: true };
  const alternates = policy.canonical
    ? { canonical: policy.canonical }
    : undefined;

  if (route.isVersionRoot) {
    const { name, date, blurb } = route.version;
    const title = `${name} (${date}) — Andrés Movilla's portfolio`;

    return {
      title,
      description: blurb,
      robots,
      alternates,
      openGraph: {
        title,
        description: blurb,
        type: "website",
        url: policy.canonical ?? route.shellPath,
      },
      twitter: { card: "summary", title, description: blurb },
    };
  }

  const { metadata: upstream } = await fetchUpstream(route.iframeSrc);

  // Nothing usable upstream — inherit the layout defaults, but keep the
  // indexing directives, which don't depend on the fetch succeeding.
  if (!upstream) return { robots, alternates };

  const { title, description, image } = upstream;
  const images = image !== undefined ? [image] : undefined;

  return {
    ...(title !== undefined && { title }),
    ...(description !== undefined && { description }),
    robots,
    alternates,
    openGraph: {
      title,
      description,
      images,
      type: "website",
      url: policy.canonical ?? route.shellPath,
    },
    twitter: {
      card: images ? "summary_large_image" : "summary",
      title,
      description,
      images,
    },
  };
}

export default async function HomePage({ params }: PageProps) {
  const { slug } = await params;
  const route = resolveRoute(slug ?? []);

  // A version root always exists. Anything deeper is an unverified guess at a
  // path inside the portfolio, so confirm it before framing it — otherwise the
  // catch-all answers 200 for every URL anyone invents.
  if (!route.isVersionRoot) {
    const { status } = await fetchUpstream(route.iframeSrc);
    // A null status means upstream was unreachable, not that the page is gone.
    if (status !== null && status >= 400) notFound();
  }

  return (
    <>
      <TimeTravel slug={slug ?? []} />
      <VersionIndex currentSlug={route.version.slug} />
    </>
  );
}
