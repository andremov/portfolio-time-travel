export interface PortfolioVersion {
  name: string;
  slug: string;
  date: string;
  link: string;
  /** Unique prose for this version's shell page — the only indexable copy it has. */
  blurb: string;
}

export const history: PortfolioVersion[] = [
  {
    name: "Circular",
    slug: "v1",
    date: "Jul. 2020",
    link: "https://v1.andremov.dev",
    blurb:
      "The first one. A radial menu that fanned links out around a central avatar, built in React while I was still learning what a component was.",
  },
  {
    name: "Single Page",
    slug: "v2",
    date: "Feb. 2021",
    link: "https://v2.andremov.dev",
    blurb:
      "A reaction to the first: everything collapsed onto one scrolling page, no navigation to get lost in.",
  },
  {
    name: "Hexagons",
    slug: "v3",
    date: "Apr. 2021",
    link: "https://v3.andremov.dev",
    blurb:
      "A hexagonal tiling experiment. Projects lived in a honeycomb grid, and the CV finally got a download button.",
  },
  {
    name: "Rainbow",
    slug: "v4",
    date: "Dec. 2021",
    link: "https://v4.andremov.dev",
    blurb:
      "Saturated gradients and heavy colour transitions — the most maximalist version, and the last of the plain Vite SPAs.",
  },
  {
    name: "Minimalist",
    slug: "v5",
    date: "Sep. 2022",
    link: "https://v5.andremov.dev",
    blurb:
      "The correction. Type, whitespace, and almost nothing else, after two years of adding things.",
  },
  {
    name: "Astro",
    slug: "v6",
    date: "Apr. 2023",
    link: "https://v6.andremov.dev",
    blurb:
      "Rebuilt on Astro for static output and near-zero client JavaScript, with glitch-text effects and case-study sections.",
  },
  {
    name: "Remix",
    slug: "v7",
    date: "Dec. 2024",
    link: "https://v7.andremov.dev",
    blurb:
      "A paper-and-rubber-stamp theme on Remix — approval seals, pins, and printed textures over a server-rendered core.",
  },
  {
    name: "Garden",
    slug: "v8",
    date: "Mar. 2026",
    link: "https://v8.andremov.dev",
    blurb:
      "The current portfolio: a digital garden of projects and writing that grows in place instead of being replaced.",
  },
];

export const DEFAULT_VERSION = "v8";

export function findVersion(slug: string): PortfolioVersion | undefined {
  return history.find((v) => v.slug === slug);
}
