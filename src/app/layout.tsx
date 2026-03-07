import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Andrés Movilla — Portfolio Time Travel",
  description:
    "Explore every version of Andrés Movilla's portfolio, from 2020 to present, through an interactive time-travel interface.",
  metadataBase: new URL("https://andremov.dev"),
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  openGraph: {
    title: "Andrés Movilla — Portfolio Time Travel",
    description:
      "Explore every version of Andrés Movilla's portfolio, from 2020 to present.",
    type: "website",
    url: "https://andremov.dev",
  },
  twitter: {
    card: "summary_large_image",
    title: "Andrés Movilla — Portfolio Time Travel",
    description:
      "Explore every version of Andrés Movilla's portfolio, from 2020 to present.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
