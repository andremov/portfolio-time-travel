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
