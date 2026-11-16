import { defineConfig } from "@playwright/test";
const applicationUrl = `http://127.0.0.1:${Number(process.env.SIVI_TEST_PORT ?? 4173)}`;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  reporter: "line",
  use: {
    baseURL: applicationUrl,
    browserName: "chromium",
    channel: process.env.SIVI_BROWSER_CHANNEL || undefined,
    trace: "retain-on-failure",
  },
  webServer: [
    {
      command: "npm run serve:test",
      url: applicationUrl,
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
