import "~/styles/globals.css";

import { Analytics } from "@vercel/analytics/next";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { SITE_URL } from "~/lib/site";
import { TM_STYLESHEET } from "~/lib/time-machine";

export const metadata: Metadata = {
  title: "Andrés Movilla — Portfolio Time Travel",
  description:
    "Explore every version of Andrés Movilla's portfolio, from 2020 to present, through an interactive time-travel interface.",
  metadataBase: new URL(SITE_URL),
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  openGraph: {
    title: "Andrés Movilla — Portfolio Time Travel",
    description:
      "Explore every version of Andrés Movilla's portfolio, from 2020 to present.",
    type: "website",
    url: SITE_URL,
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
      <head>
        {/*
          The time machine's head half, for the archived versions this layout
          frames. The body half is rendered by the archive route.
        */}
        <link rel="stylesheet" href={TM_STYLESHEET} />
      </head>
      <body>
        {children}
        {/*
          Only the shell's own pages reach this layout. The portfolio the proxy
          serves at the apex carries its own copy of the script.
        */}
        <Analytics />
      </body>
    </html>
  );
}
