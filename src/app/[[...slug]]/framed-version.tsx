"use client";

import { useCallback } from "react";
import SuperFrame from "~/_components/super-frame";
import { toShellPath } from "~/lib/resolve-route";

interface FramedVersionProps {
  versionSlug: string;
  iframeSrc: string;
}

export default function FramedVersion({ versionSlug, iframeSrc }: FramedVersionProps) {
  const handleNavMessage = useCallback(
    (path: string) => {
      window.history.replaceState(null, "", toShellPath(versionSlug, path));
    },
    [versionSlug],
  );

  return (
    <main className="relative">
      <SuperFrame src={iframeSrc} onNavMessage={handleNavMessage} />
    </main>
  );
}
