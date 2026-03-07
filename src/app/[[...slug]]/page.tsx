"use client";

import { useMemo, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Morph from "~/_components/morph-shape";
import SpaceBackground from "~/_components/space-background";
import SuperFrame from "~/_components/super-frame";
import TimeTravelScreen from "~/_components/time-travel-screen";
import { history, findVersion, DEFAULT_VERSION } from "~/data/history";

export default function HomePage() {
  const params = useParams<{ slug?: string[] }>();
  const router = useRouter();
  const [timeTravelling, setTimeTravelling] = useState(false);

  const slug = params.slug ?? [];

  // If first segment matches a version slug, use it; otherwise treat
  // the entire slug as an inner path under the default version.
  const matchedVersion = slug.length > 0 ? findVersion(slug[0]!) : null;

  const version = useMemo(
    () => matchedVersion ?? findVersion(DEFAULT_VERSION)!,
    [matchedVersion],
  );

  const isDefaultVersion = !matchedVersion;
  const versionSlug = isDefaultVersion ? DEFAULT_VERSION : slug[0]!;
  const innerPath = isDefaultVersion
    ? slug.length > 0
      ? "/" + slug.join("/")
      : ""
    : slug.length > 1
      ? "/" + slug.slice(1).join("/")
      : "";

  const iframeSrc = `${version.link}${innerPath}`;

  const handleNavMessage = useCallback(
    (path: string) => {
      const cleanPath = path === "/" ? "" : path;
      const newUrl = isDefaultVersion
        ? cleanPath || "/"
        : `/${versionSlug}${cleanPath}`;
      window.history.replaceState(null, "", newUrl);
    },
    [versionSlug, isDefaultVersion],
  );

  function doTimeTravel(slug: string) {
    setTimeTravelling(false);
    router.push(`/${slug}`);
    window.scrollTo({ top: 0 });
  }

  return (
    <main className="min-h-screen">
      <SuperFrame src={iframeSrc} onNavMessage={handleNavMessage} />

      <div className="hidden lg:block">
        <Morph
          duration={5}
          buttonBackground={<SpaceBackground />}
          isOpen={timeTravelling}
          setOpen={setTimeTravelling}
        >
          <TimeTravelScreen doTimeTravel={doTimeTravel} history={history} />
        </Morph>
      </div>

      <div className="fixed bottom-4 left-1/2 z-10 block -translate-x-1/2 lg:hidden">
        <p className="rounded-full bg-black/60 px-4 py-2 text-xs text-white/50 backdrop-blur-sm">
          Visit on desktop for time travel
        </p>
      </div>
    </main>
  );
}
