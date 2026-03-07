"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
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
  const versionSlug = slug[0] ?? DEFAULT_VERSION;
  const innerPath = slug.length > 1 ? "/" + slug.slice(1).join("/") : "";

  const version = useMemo(() => findVersion(versionSlug), [versionSlug]);

  // Redirect to default version if invalid or no slug
  useEffect(() => {
    if (!version) {
      router.replace(`/${DEFAULT_VERSION}`);
    }
  }, [version, router]);

  const iframeSrc = version ? `${version.link}${innerPath}` : "";

  const handleNavMessage = useCallback(
    (path: string) => {
      const cleanPath = path === "/" ? "" : path;
      const newUrl = `/${versionSlug}${cleanPath}`;
      window.history.replaceState(null, "", newUrl);
    },
    [versionSlug],
  );

  function doTimeTravel(slug: string) {
    setTimeTravelling(false);
    router.push(`/${slug}`);
    window.scrollTo({ top: 0 });
  }

  if (!version) return null;

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
