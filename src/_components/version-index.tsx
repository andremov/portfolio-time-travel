import Link from "next/link";
import { history, DEFAULT_VERSION } from "~/data/history";

interface VersionIndexProps {
  currentSlug: string;
}

/**
 * The shell's own content: a real, server-rendered index of every version.
 *
 * The framed portfolio above is credited to its own origin by crawlers, and
 * the time-travel overlay is desktop-only and JS-driven. This section is what
 * gives the shell something to rank for and the only crawlable path to the
 * archived versions — so it has to stay genuinely visible to visitors.
 */
export default function VersionIndex({ currentSlug }: VersionIndexProps) {
  return (
    <section
      id="versions"
      className="border-t border-white/10 bg-zinc-950 px-6 py-16 text-white"
    >
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight">
          Andrés Movilla — Portfolio Time Travel
        </h1>
        <p className="mt-4 text-white/60">
          Every version of my portfolio since 2020 is still online, at the
          address it always had. The one framed above is{" "}
          <strong className="font-semibold text-white/80">
            {history.find((v) => v.slug === currentSlug)?.name}
          </strong>
          . On desktop you can jump between them through the time machine; the
          list below works everywhere.
        </p>

        <ol className="mt-10 space-y-6">
          {history.map((version) => {
            const href = version.slug === DEFAULT_VERSION ? "/" : `/${version.slug}`;
            const isCurrent = version.slug === currentSlug;

            return (
              <li key={version.slug}>
                <h2 className="text-lg font-semibold">
                  <Link
                    href={href}
                    aria-current={isCurrent ? "page" : undefined}
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
      </div>
    </section>
  );
}
