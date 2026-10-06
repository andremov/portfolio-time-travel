import { type NextRequest } from "next/server";
import { DEFAULT_VERSION, findVersion } from "~/data/history";
import {
  TM_ARRIVAL_SCRIPT,
  TM_LINK_TEXT,
  TM_SCRIPT,
  TM_STYLESHEET,
  timeMachineData,
} from "~/lib/time-machine";

/**
 * Serve the current portfolio as the apex's own response.
 *
 * The apex used to frame this content, which meant crawlers credited it to
 * the version's subdomain and the apex ranked for nothing. Fetching it here
 * and returning it as our own body puts the content on this origin, so the
 * subdomain can be hidden without the content disappearing with it.
 *
 * Shipping a new version is a one-line change to DEFAULT_VERSION.
 */
const UPSTREAM = findVersion(DEFAULT_VERSION)!.link;
const UPSTREAM_ORIGIN = new URL(UPSTREAM).origin;

/**
 * The time machine, injected into every page the portfolio serves. The
 * stylesheet and the arrival script go in <head> so an arrival by time travel
 * is covered before first paint; the rest goes at the end of <body>.
 *
 * The link out is a real anchor rather than something the script builds, so
 * the archive stays reachable — by a crawler, or by anyone whose JavaScript
 * never runs — without depending on the widget booting.
 */
const WIDGET_HEAD =
  `<link rel="stylesheet" href="${TM_STYLESHEET}">` +
  `<script>${TM_ARRIVAL_SCRIPT}</script>`;

const WIDGET_BODY =
  `<script type="application/json" id="tm-versions">${timeMachineData(DEFAULT_VERSION)}</script>` +
  `<a class="tm-link" href="/versions/">${TM_LINK_TEXT}</a>` +
  `<script src="${TM_SCRIPT}" defer></script>`;

/**
 * Connection-level headers describe the upstream hop, not our response, and
 * fetch has already decoded the body — forwarding these would describe it
 * wrongly.
 */
const HOP_BY_HOP = new Set([
  "connection",
  "keep-alive",
  "transfer-encoding",
  "upgrade",
  "content-encoding",
  "content-length",
]);

/** HTML is small and changes on deploy; let the CDN absorb the extra hop. */
const HTML_CACHE = "public, s-maxage=300, stale-while-revalidate=86400";

function upstreamUrlFor(request: NextRequest): string {
  const { pathname, search } = request.nextUrl;
  // The rewrite prefixes our own route; everything after it is the real path.
  const path = pathname.replace(/^\/api\/site/, "");
  return `${UPSTREAM}${path}${search}`;
}

function forwardedHeaders(upstream: Response): Headers {
  const headers = new Headers();

  for (const [key, value] of upstream.headers) {
    const name = key.toLowerCase();
    if (HOP_BY_HOP.has(name)) continue;
    // The version's own deployment is marked noindex. That instruction is
    // about the subdomain, not about this origin, and carrying it across
    // would hide the site we are trying to get indexed.
    if (name === "x-robots-tag") continue;
    headers.set(key, value);
  }

  // Point redirects at ourselves so visitors never land on the subdomain.
  const location = upstream.headers.get("location");
  if (location) {
    headers.set("location", location.replace(UPSTREAM_ORIGIN, ""));
  }

  return headers;
}

async function proxy(request: NextRequest, method: "GET" | "HEAD") {
  let upstream: Response;
  try {
    upstream = await fetch(upstreamUrlFor(request), {
      method,
      redirect: "manual",
      headers: {
        accept: request.headers.get("accept") ?? "*/*",
        "accept-language": request.headers.get("accept-language") ?? "en",
      },
    });
  } catch {
    return new Response("The portfolio is unreachable right now.", {
      status: 502,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  const headers = forwardedHeaders(upstream);
  const isHtml = (upstream.headers.get("content-type") ?? "").includes("html");

  if (method === "HEAD" || !upstream.body) {
    return new Response(null, { status: upstream.status, headers });
  }

  // Anything that isn't a page - styles, scripts, images, the CV - streams
  // through untouched, keeping whatever caching upstream asked for.
  if (!isHtml) {
    return new Response(upstream.body, { status: upstream.status, headers });
  }

  let body = await upstream.text();
  body = body.includes("</head>")
    ? body.replace("</head>", `${WIDGET_HEAD}</head>`)
    : WIDGET_HEAD + body;
  body = body.includes("</body>")
    ? body.replace("</body>", `${WIDGET_BODY}</body>`)
    : body + WIDGET_BODY;

  headers.set("cache-control", HTML_CACHE);

  return new Response(body, { status: upstream.status, headers });
}

export function GET(request: NextRequest) {
  return proxy(request, "GET");
}

export function HEAD(request: NextRequest) {
  return proxy(request, "HEAD");
}
