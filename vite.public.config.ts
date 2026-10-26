import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";
export default defineConfig({
  plugins: [tailwindcss()],
  define: { "process.env.NODE_ENV": JSON.stringify("production") },
  oxc: { jsx: { runtime: "automatic" } },
  resolve: { alias: { "@": resolve(import.meta.dirname, "src") } },
  build: {
    outDir: "src/generated/public",
    emptyOutDir: true,
    target: "es2022",
    cssCodeSplit: false,
    minify: true,
    lib: {
      entry: resolve(import.meta.dirname, "src/public/entry.tsx"),
      formats: ["es"],
      fileName: () => "entry.js",
      cssFileName: "style",
    },
    rolldownOptions: {
      output: { codeSplitting: false },
      onwarn(warning, handler) {
        if (
          warning.code === "MODULE_LEVEL_DIRECTIVE" &&
          warning.message.includes("use client")
        )
          return;
        handler(warning);
      },
    },
  },
});
