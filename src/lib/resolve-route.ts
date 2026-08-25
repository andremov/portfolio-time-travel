import { findVersion, DEFAULT_VERSION, type PortfolioVersion } from "~/data/history";

export interface ResolvedRoute {
  version: PortfolioVersion;
  /** Path within the embedded portfolio, e.g. "/essays/foo" or "". */
  innerPath: string;
  /** True for the version's landing page. */
  isVersionRoot: boolean;
  /** Absolute URL loaded into the iframe. */
  iframeSrc: string;
  /** Path on this shell that maps back to `iframeSrc`. */
  shellPath: string;
}

/**
 * Resolve an archived-version path.
 *
 * Only /v1../v7 reach this route now — everything else is proxied to the
 * current portfolio — so an unrecognised first segment is a dead URL rather
 * than a path to interpret. Returns null so the caller can 404 it.
 */
export function resolveRoute(slug: string[]): ResolvedRoute | null {
  const version = slug.length > 0 ? findVersion(slug[0]!) : undefined;
  if (!version || version.slug === DEFAULT_VERSION) return null;

  const rest = slug.slice(1);
  const innerPath = rest.length > 0 ? "/" + rest.join("/") : "";

  return {
    version,
    innerPath,
    isVersionRoot: innerPath === "",
    iframeSrc: `${version.link}${innerPath}`,
    shellPath: toShellPath(version.slug, innerPath),
  };
}

/** Map a path inside the embedded portfolio onto this shell's address bar. */
export function toShellPath(versionSlug: string, innerPath: string): string {
  const cleanPath = innerPath === "/" ? "" : innerPath;
  return `/${versionSlug}${cleanPath}`;
}

/** Where a version is browsed: the apex for the current one, a frame for the rest. */
export function versionHref(versionSlug: string): string {
  return versionSlug === DEFAULT_VERSION ? "/" : `/${versionSlug}/`;
}
