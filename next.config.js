/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/**
 * Everything the shell serves itself. Any path not listed here belongs to the
 * current portfolio and is proxied, so this list is the whole boundary between
 * the two.
 */
const SHELL_ROUTES = [
  "v[1-7](?:/|$)", // archived versions, framed by the shell
  "versions(?:/|$)",
  "robots[.]txt",
  "sitemap[.]xml",
  "_tm/", // the time machine widget's own assets
  "_next/",
  "api/",
];

/** @type {import("next").NextConfig} */
const config = {
  async redirects() {
    return [
      // The current version is the apex itself now, so /v8 is a duplicate.
      { source: "/v8", destination: "/", permanent: true },
      { source: "/v8/:path*", destination: "/:path*", permanent: true },
    ];
  },

  async rewrites() {
    return {
      // beforeFiles so the proxy wins over the shell's own public/ assets —
      // the favicon and images should come from the portfolio, not from here.
      beforeFiles: [
        {
          source: `/:path((?!${SHELL_ROUTES.join("|")}).*)`,
          destination: "/api/site/:path",
        },
      ],
    };
  },
};

export default config;
