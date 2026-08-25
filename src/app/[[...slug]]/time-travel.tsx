"use client";

import { useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Morph from "~/_components/morph-shape";
import SpaceBackground from "~/_components/space-background";
import SuperFrame from "~/_components/super-frame";
import TimeTravelScreen from "~/_components/time-travel-screen";
import { history } from "~/data/history";
import { resolveRoute, toShellPath } from "~/lib/resolve-route";

interface TimeTravelProps {
  slug: string[];
}

export default function TimeTravel({ slug }: TimeTravelProps) {
  const router = useRouter();
  const [timeTravelling, setTimeTravelling] = useState(false);

  const slugKey = slug.join("/");
  // eslint-disable-next-line react-hooks/exhaustive-deps -- slugKey encodes slug
  const route = useMemo(() => resolveRoute(slug), [slugKey]);

  const handleNavMessage = useCallback(
    (path: string) => {
      window.history.replaceState(null, "", toShellPath(route, path));
    },
    [route],
  );

  function doTimeTravel(slug: string) {
    setTimeTravelling(false);
    router.push(`/${slug}`);
    window.scrollTo({ top: 0 });
  }

  return (
    <main className="relative">
      <SuperFrame src={route.iframeSrc} onNavMessage={handleNavMessage} />

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

      <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 lg:left-auto lg:right-4 lg:translate-x-0">
        <Link
          href="/versions"
          className="rounded-full bg-black/70 px-4 py-2 text-xs text-white/85 backdrop-blur-sm transition hover:bg-black/85 hover:text-white"
        >
          All versions →
        </Link>
      </div>
    </main>
  );
}
