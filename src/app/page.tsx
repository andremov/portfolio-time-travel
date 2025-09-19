"use client";

import { useState } from "react";
import Morph from "~/_components/morph-shape";
import SpaceBackground from "~/_components/space-background";
import SuperFrame from "~/_components/super-frame";
import TimeTravelScreen from "~/_components/time-travel-screen";

const history = [
  {
    name: "Circular",
    date: "Jul. 2020",
    link: "https://v1.andremov.dev",
  },
  {
    name: "Single Page",
    date: "Feb. 2021",
    link: "https://v2.andremov.dev",
  },
  {
    name: "Hexagons",
    date: "Apr. 2021",
    link: "https://v3.andremov.dev",
  },
  {
    name: "Rainbow",
    date: "Dec. 2021",
    link: "https://v4.andremov.dev",
  },
  {
    name: "Minimalist",
    date: "Sep. 2022",
    link: "https://v5.andremov.dev",
  },
  {
    name: "Astro",
    date: "Apr. 2023",
    link: "https://v6.andremov.dev",
  },
  {
    name: "Remix",
    date: "Dec. 2024",
    link: "https://v7.andremov.dev",
  },
];

export default function HomePage() {
  const [currentURL, setCurrentURL] = useState("https://v7.andremov.dev");
  const [timeTravelling, setTimeTravelling] = useState(false);

  function doTimeTravel(newURL: string) {
    setTimeTravelling(false);
    setCurrentURL(newURL);
    window.scrollTo({ top: 0 });
  }

  return (
    <main className="min-h-screen">
      <SuperFrame src={currentURL} />

      <div className="hidden md:block">
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
