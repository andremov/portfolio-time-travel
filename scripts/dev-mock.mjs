/*
 * `npm run dev:mock`: the shell against placeholder versions.
 *
 * Starts a tiny server where every version is a blank page saying which one
 * it is, then runs `next dev` with MOCK_VERSIONS_ORIGIN pointing at it, so
 * the proxy, the frames and the time machine can be worked on without the
 * real deployments.
 */
import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";

const PORT = 4100;
const ORIGIN = `http://localhost:${PORT}`;

function page(version, path) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Version ${version}</title>
<style>
  body { margin: 0; font-family: system-ui, sans-serif; background: #fafafa; color: #18181b; }
  /* Tall enough to scroll, so the time machine's scroll behaviour can be tried. */
  main { min-height: 250vh; display: flex; flex-direction: column; align-items: center; padding-top: 30vh; }
  h1 { margin: 0; font-size: 64px; }
  p { color: #71717a; }
</style>
</head>
<body>
<main>
  <h1>Version ${version}</h1>
  <p>${path}</p>
</main>
</body>
</html>`;
}

createServer((req, res) => {
  const url = new URL(req.url ?? "/", ORIGIN);
  const match = /^\/v(\d+)(\/.*)?$/.exec(url.pathname);

  if (!match) {
    res.writeHead(404, { "content-type": "text/plain" }).end("Not found");
    return;
  }

  res
    .writeHead(200, { "content-type": "text/html; charset=utf-8" })
    .end(req.method === "HEAD" ? undefined : page(match[1], match[2] ?? "/"));
}).listen(PORT, () => {
  console.log(`mock versions on ${ORIGIN}/v1 .. /v8`);
});

const nextBin = fileURLToPath(
  new URL("../node_modules/next/dist/bin/next", import.meta.url),
);

const next = spawn(process.execPath, [nextBin, "dev", ...process.argv.slice(2)], {
  stdio: "inherit",
  env: { ...process.env, MOCK_VERSIONS_ORIGIN: ORIGIN },
});

next.on("exit", (code) => process.exit(code ?? 0));
