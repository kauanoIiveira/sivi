import { readdir } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const directory = dirname(fileURLToPath(import.meta.url));
const entries = await readdir(directory, { withFileTypes: true });
const testFiles = entries
  .filter((entry) => entry.isFile() && entry.name.endsWith(".test.js") && entry.name !== "all.test.js")
  .map((entry) => entry.name)
  .sort();

globalThis.__SIVI_UNIT_SUITE__ = true;
for (const testFile of testFiles) {
  await import(pathToFileURL(join(directory, testFile)));
}
