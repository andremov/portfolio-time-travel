"use client";

import { useState } from "react";
import SuperFrame from "~/_components/super-frame";

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

  function doTimeTravel(newURL: string) {
    setCurrentURL(newURL);
    window.scrollTo({ top: 0 });
  }

  return (
    <main className="min-h-screen">
      <SuperFrame src={currentURL} />
      <div className="waves-bkg top-waves black-waves bg-[#27272a]" />
      <div className="star-bkg flex min-h-screen flex-col items-center justify-between px-4 py-20 xl:px-32">
        <div className="stars1"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
        <div className="space-title">
          <span>Time Travel</span>
        </div>
        <div className="flex w-full flex-wrap items-center justify-center px-10">
          {history.map((entry) => (
            <button
              key={entry.name}
              className="group m-12 flex flex-col items-center"
              onClick={() => doTimeTravel(entry.link)}
            >
              <div className="wormhole-container">
                <div className="wormhole1"></div>
                <div className="wormhole2"></div>
                <div className="wormhole3"></div>
                <div className="wormhole4"></div>
              </div>
              <span className="font-[Lato] text-3xl font-bold text-white/30 transition group-hover:text-white/80">
                {entry.name}
              </span>
              <span className="text-base font-medium text-white/10 transition group-hover:text-white/50">
                {entry.date}
              </span>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
