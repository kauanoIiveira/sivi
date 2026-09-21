import { expect } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const checks = [];

// Optional visual evidence from the authenticated app using local Firebase emulators.
export async function captureUi(page, name, { widths = [360, 390, 768, 1440] } = {}) {
  if (!process.env.SIVI_CAPTURE_UI) return;
  const output = resolve(process.env.SIVI_CAPTURE_UI);
  await mkdir(output, { recursive: true });
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const theme of ["light", "dark"]) {
    if (await page.locator("html").getAttribute("data-theme") !== theme) {
      await page.locator("[data-theme-toggle]:visible").first().click();
    }
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    for (const width of widths) {
      await page.setViewportSize({ width, height: 960 });
      // Wait for responsive styles and the auth panel's resize handler to settle.
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), {
        message: `${name} ${theme} ${width}px responsive layout`,
      }).toBe(true);
      const layout = await page.evaluate(() => ({
        viewport: innerWidth,
        document: document.documentElement.scrollWidth,
        horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
      }));
      checks.push({ name, theme, width, ...layout });
      expect(layout.horizontalOverflow, `${name} ${theme} ${width}px`).toBe(false);
      if ([390, 1440, 1920].includes(width)) {
        await page.screenshot({ path: resolve(output, `${name}-${theme}-${width}.png`), fullPage: true, animations: "disabled" });
      }
    }
  }
  await writeFile(resolve(output, "ui-checks.json"), JSON.stringify(checks, null, 2));
  await page.setViewportSize({ width: 1440, height: 960 });
  if (await page.locator("html").getAttribute("data-theme") !== "light") {
    await page.locator("[data-theme-toggle]:visible").first().click();
  }
}
