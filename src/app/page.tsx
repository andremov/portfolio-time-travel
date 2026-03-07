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
    </main>
  );
}
