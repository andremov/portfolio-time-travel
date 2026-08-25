import { type Metadata } from "next";
import Link from "next/link";
import { history, DEFAULT_VERSION } from "~/data/history";

const TITLE = "Every version of my portfolio";
const DESCRIPTION =
  "Eight portfolios since 2020, all still online: Circular, Single Page, Hexagons, Rainbow, Minimalist, Astro, Remix, and Garden.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/versions" },
  openGraph: { title: TITLE, description: DESCRIPTION, type: "website", url: "/versions" },
  twitter: { card: "summary", title: TITLE, description: DESCRIPTION },
};

/**
 * The shell's own content, on its own page.
 *
 * Crawlers credit the framed portfolio to its own origin, and the time machine
 * navigates with buttons, so this is the site's only real copy and its only
 * crawlable path to the archives. It lives here rather than under the frame
 * because stacking it there gave the shell a second scrollbar.
 */
export default function VersionsPage() {
  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight">
          Every version of my portfolio
        </h1>
        <p className="mt-4 text-white/60">
          I have rebuilt this site eight times since 2020. Rather than retire
          the old ones, every version is still online, each at its own address.
          Pick any of them below.
        </p>
        <p className="mt-4 text-white/60">
          The live site also has a time machine that flies you between versions
          through a wormhole. It needs the room, so it only appears on desktop —
          on a phone or tablet, this list is the way across.
        </p>

        <ol className="mt-10 space-y-6">
          {history.map((version) => {
            const href =
              version.slug === DEFAULT_VERSION ? "/" : `/${version.slug}`;

            return (
              <li key={version.slug}>
                <h2 className="text-lg font-semibold">
                  <Link
                    href={href}
                    className="underline decoration-white/20 underline-offset-4 hover:decoration-white/80"
                  >
                    {version.name}
                  </Link>{" "}
                  <span className="font-normal text-white/40">
                    {version.date}
                  </span>
                  {version.slug === DEFAULT_VERSION && (
                    <span className="ml-2 rounded-full bg-white/10 px-2 py-0.5 align-middle text-xs font-normal text-white/60">
                      current
                    </span>
                  )}
                </h2>
                <p className="mt-1 text-sm text-white/50">{version.blurb}</p>
              </li>
            );
          })}
        </ol>

        <p className="mt-12 text-sm text-white/40">
          <Link href="/" className="underline underline-offset-4 hover:text-white/70">
            ← Back to the live portfolio
          </Link>
        </p>
      </div>
    </main>
  );
}
