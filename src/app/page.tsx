"use client";

import { useState } from "react";
import Morph from "~/_components/morph-shape";
import SpaceBackground from "~/_components/space-background";
import SuperFrame from "~/_components/super-frame";
import TimeTravelScreen from "~/_components/time-travel-screen";
import { history } from "~/data/history";

export default function HomePage() {
  const [currentURL, setCurrentURL] = useState("https://v8.andremov.dev");
  const [timeTravelling, setTimeTravelling] = useState(false);

  function doTimeTravel(newURL: string) {
    setTimeTravelling(false);
    setCurrentURL(newURL);
    window.scrollTo({ top: 0 });
  }

  return (
    <main className="min-h-screen">
      <SuperFrame src={currentURL} />

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
