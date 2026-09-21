import { createReadStream } from "node:fs";
import { realpath, stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, isAbsolute, relative, resolve } from "node:path";

const root = resolve(process.cwd());
const rootReal = await realpath(root);
const port = Number(process.env.SIVI_TEST_PORT ?? 4173);
const mimeTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".webp", "image/webp"],
]);

createServer(async (request, response) => {
  if (!new Set(["GET", "HEAD"]).has(request.method ?? "")) {
    response.writeHead(405, { Allow: "GET, HEAD" }).end("Method not allowed");
    return;
  }

  const url = new URL(request.url ?? "/", `http://${request.headers.host}`);
  const pathname = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
  const filePath = resolve(root, `.${pathname}`);

  try {
    const fileReal = await realpath(filePath);
    const relativePath = relative(rootReal, fileReal);
    if (relativePath.startsWith("..") || isAbsolute(relativePath)) {
      response.writeHead(403).end("Forbidden");
      return;
    }

    const file = await stat(fileReal);
    if (!file.isFile()) throw new Error("Not a file");
    response.writeHead(200, {
      "Cache-Control": "no-store",
      "Content-Type": mimeTypes.get(extname(fileReal)) ?? "application/octet-stream",
    });
    if (request.method === "HEAD") response.end();
    else createReadStream(fileReal).pipe(response);
  } catch {
    response.writeHead(404).end("Not found");
  }
}).listen(port, "127.0.0.1", () => {
  process.stdout.write(`SIVI test server: http://127.0.0.1:${port}\n`);
});
