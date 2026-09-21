import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  reporter: "line",
  use: {
    baseURL: "http://127.0.0.1:4173",
    browserName: "chromium",
    channel: process.env.SIVI_BROWSER_CHANNEL || undefined,
    trace: "retain-on-failure",
  },
  webServer: [
    {
      command: "npm run serve:test",
      url: "http://127.0.0.1:4173",
      reuseExistingServer: process.env.CI !== "true",
      timeout: 120_000,
    },
    {
      command: "node scripts/start-auth-emulator.mjs",
      port: 9099,
      reuseExistingServer: process.env.CI !== "true",
      timeout: 120_000,
    },
  ],
});
