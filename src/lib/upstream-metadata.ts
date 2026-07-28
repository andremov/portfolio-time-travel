const TIMEOUT_MS = 5000;
const REVALIDATE_SECONDS = 3600;
/** Head tags live at the top of the document; no need to parse a whole page. */
const MAX_HTML_CHARS = 200_000;

const HEAD_RE = /<head[^>]*>([\s\S]*?)<\/head>/i;
const TITLE_RE = /<title[^>]*>([\s\S]*?)<\/title>/i;
const META_RE = /<meta\s+([^>]*?)\/?>/gi;
const ATTR_RE = /([a-zA-Z0-9:_.-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/g;

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
};

export interface UpstreamMetadata {
  title?: string;
  description?: string;
  image?: string;
}

function decodeEntities(value: string): string {
  return value.replace(
    /&(#[xX][0-9a-fA-F]+|#[0-9]+|[a-zA-Z]+);/g,
    (match, entity: string) => {
      if (entity.startsWith("#")) {
        const isHex = entity[1] === "x" || entity[1] === "X";
        const code = Number.parseInt(
          isHex ? entity.slice(2) : entity.slice(1),
          isHex ? 16 : 10,
        );
        if (Number.isNaN(code) || code < 0 || code > 0x10ffff) return match;
        return String.fromCodePoint(code);
      }
      return NAMED_ENTITIES[entity.toLowerCase()] ?? match;
    },
  );
}

function clean(value: string | undefined): string | undefined {
  if (value === undefined) return undefined;
  const collapsed = decodeEntities(value).replace(/\s+/g, " ").trim();
  return collapsed.length > 0 ? collapsed : undefined;
}

function parseHead(html: string): UpstreamMetadata {
  const head = HEAD_RE.exec(html)?.[1] ?? html;

  // First occurrence of each key wins, matching how crawlers read a document.
  const metas = new Map<string, string>();
  for (const tag of head.matchAll(META_RE)) {
    const attrs = new Map<string, string>();
    for (const attr of tag[1]!.matchAll(ATTR_RE)) {
      attrs.set(attr[1]!.toLowerCase(), attr[2] ?? attr[3] ?? attr[4] ?? "");
    }
    const key = (attrs.get("property") ?? attrs.get("name"))?.toLowerCase();
    const content = attrs.get("content");
    if (key !== undefined && content !== undefined && !metas.has(key)) {
      metas.set(key, content);
    }
  }

  return {
    title: clean(
      metas.get("og:title") ??
        metas.get("twitter:title") ??
        TITLE_RE.exec(head)?.[1],
    ),
    description: clean(
      metas.get("og:description") ??
        metas.get("twitter:description") ??
        metas.get("description"),
    ),
    image: clean(metas.get("og:image") ?? metas.get("twitter:image")),
  };
}

/**
 * Read the title/description/image an embedded portfolio serves for `url`, so
 * the shell can mirror them. Crawlers never look inside the iframe, so without
 * this every shell URL unfurls with the same generic time-travel metadata.
 *
 * Returns null on any failure — callers fall back to the layout defaults.
 */
export async function fetchUpstreamMetadata(
  url: string,
): Promise<UpstreamMetadata | null> {
  try {
    const response = await fetch(url, {
      headers: { Accept: "text/html,application/xhtml+xml" },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      next: { revalidate: REVALIDATE_SECONDS },
    });

    if (!response.ok) return null;
    if (!(response.headers.get("content-type") ?? "").includes("html")) {
      return null;
    }

    const metadata = parseHead((await response.text()).slice(0, MAX_HTML_CHARS));
    if (metadata.title === undefined && metadata.description === undefined) {
      return null;
    }

    if (metadata.image !== undefined) {
      // og:image is often site-relative; unfurlers need an absolute URL.
      try {
        metadata.image = new URL(metadata.image, response.url || url).toString();
      } catch {
        metadata.image = undefined;
      }
    }

    return metadata;
  } catch {
    return null;
  }
}
