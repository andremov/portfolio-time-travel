import { type Metadata } from "next";
import TimeTravel from "./time-travel";
import { resolveRoute } from "~/lib/resolve-route";
import { fetchUpstreamMetadata } from "~/lib/upstream-metadata";

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

/**
 * Mirror the embedded portfolio's metadata onto the shell URL. Crawlers and
 * link unfurlers don't run JS or read into iframes, so without this every
 * shell URL shares the generic title from the root layout.
 */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const route = resolveRoute(slug ?? []);
  const upstream = await fetchUpstreamMetadata(route.iframeSrc);

  // Nothing usable upstream — inherit the layout defaults untouched.
  if (!upstream) return {};

  const { title, description, image } = upstream;
  const images = image !== undefined ? [image] : undefined;

  return {
    ...(title !== undefined && { title }),
    ...(description !== undefined && { description }),
    alternates: { canonical: route.shellPath },
    openGraph: {
      title,
      description,
      images,
      type: "website",
      url: route.shellPath,
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

  return <TimeTravel slug={slug ?? []} />;
}
