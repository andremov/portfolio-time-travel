export interface PortfolioVersion {
  name: string;
  slug: string;
  date: string;
  link: string;
}

export const history: PortfolioVersion[] = [
  {
    name: "Circular",
    slug: "v1",
    date: "Jul. 2020",
    link: "https://v1.andremov.dev",
  },
  {
    name: "Single Page",
    slug: "v2",
    date: "Feb. 2021",
    link: "https://v2.andremov.dev",
  },
  {
    name: "Hexagons",
    slug: "v3",
    date: "Apr. 2021",
    link: "https://v3.andremov.dev",
  },
  {
    name: "Rainbow",
    slug: "v4",
    date: "Dec. 2021",
    link: "https://v4.andremov.dev",
  },
  {
    name: "Minimalist",
    slug: "v5",
    date: "Sep. 2022",
    link: "https://v5.andremov.dev",
  },
  {
    name: "Astro",
    slug: "v6",
    date: "Apr. 2023",
    link: "https://v6.andremov.dev",
  },
  {
    name: "Remix",
    slug: "v7",
    date: "Dec. 2024",
    link: "https://v7.andremov.dev",
  },
  {
    name: "Garden",
    slug: "v8",
    date: "Mar. 2026",
    link: "https://v8.andremov.dev",
  },
];

export const DEFAULT_VERSION = "v8";

export function findVersion(slug: string): PortfolioVersion | undefined {
  return history.find((v) => v.slug === slug);
}
