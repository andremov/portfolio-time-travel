import {
  findVersion,
  DEFAULT_VERSION,
  type PortfolioVersion,
} from "~/data/history";

export interface ResolvedRoute {
  version: PortfolioVersion;
  versionSlug: string;
  isDefaultVersion: boolean;
  /** Path within the embedded portfolio, e.g. "/essays/foo" or "". */
  innerPath: string;
  /** True for a version's landing page — the shell's own indexable pages. */
  isVersionRoot: boolean;
  /** Absolute URL loaded into the iframe. */
  iframeSrc: string;
  /** Path on this shell that maps back to `iframeSrc`. */
  shellPath: string;
}

/**
 * If the first segment matches a version slug, use it; otherwise treat the
 * entire slug as an inner path under the default version.
 */
export function resolveRoute(slug: string[]): ResolvedRoute {
  const matchedVersion = slug.length > 0 ? findVersion(slug[0]!) : undefined;
  const version = matchedVersion ?? findVersion(DEFAULT_VERSION)!;
  const isDefaultVersion = !matchedVersion;
  const versionSlug = isDefaultVersion ? DEFAULT_VERSION : slug[0]!;

  const rest = isDefaultVersion ? slug : slug.slice(1);
  const innerPath = rest.length > 0 ? "/" + rest.join("/") : "";

  return {
    version,
    versionSlug,
    isDefaultVersion,
    innerPath,
    isVersionRoot: innerPath === "",
    iframeSrc: `${version.link}${innerPath}`,
    shellPath: toShellPath({ versionSlug, isDefaultVersion }, innerPath),
  };
}

/** Map a path inside the embedded portfolio onto this shell's address bar. */
export function toShellPath(
  route: Pick<ResolvedRoute, "versionSlug" | "isDefaultVersion">,
  innerPath: string,
): string {
  const cleanPath = innerPath === "/" ? "" : innerPath;
  return route.isDefaultVersion
    ? cleanPath || "/"
    : `/${route.versionSlug}${cleanPath}`;
}

export interface IndexingPolicy {
  index: boolean;
  /** Absolute or root-relative URL, or null when the page is not indexed. */
  canonical: string | null;
}

/**
 * Which copy of a given page should rank.
 *
 * Version roots are the shell's own pages: they carry prose that exists
 * nowhere else, so they self-canonicalise. Deeper paths are just a frame
 * around the live portfolio, so they hand ranking to the URL that actually
 * serves the content. Archived versions are noindex at the source, so their
 * deep paths have nothing to point at and stay out of the index entirely.
 */
export function indexingPolicy(route: ResolvedRoute): IndexingPolicy {
  const isCurrent = route.version.slug === DEFAULT_VERSION;

  if (route.isVersionRoot) {
    // "/" and "/v8" frame the same thing; "/" is the one that ranks.
    return { index: true, canonical: isCurrent ? "/" : `/${route.version.slug}` };
  }

  return isCurrent
    ? { index: true, canonical: route.iframeSrc }
    : { index: false, canonical: null };
}
