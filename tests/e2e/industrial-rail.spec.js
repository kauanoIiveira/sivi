import { expect, test } from "@playwright/test";

test("renders nine accessible, evidence-bearing industrial stages", async ({ page }) => {
  await page.goto("/tests/fixtures/dashboard-lab.html?role=buyer");
  await expect(page.locator("[data-dashboard-status]")).toHaveAttribute("data-dashboard-status", "ready");

  const rail = page.locator("[data-industrial-rail]");
  const svg = rail.locator("svg[role='group']");
  await expect(svg.locator("title")).toHaveText("Trilho industrial da jornada");
  await expect(svg).toHaveAttribute("aria-labelledby", /industrial-rail-\d+-title industrial-rail-\d+-description/);
  await expect(rail.locator("svg[role='img']")).toHaveCount(0);
  await expect(svg.locator("[role='button']")).toHaveCount(9);
  await expect(rail.locator("[data-rail-step]")).toHaveCount(9);
  await expect(rail.locator("[data-rail-legend] li")).toHaveCount(6);
  await expect(rail.locator("[data-rail-table] tbody tr")).toHaveCount(9);
  await expect(rail.locator("figcaption")).toContainText(/Período.*agosto de 2026.*Origem.*Fixture local SIVI/);

  const proposals = rail.locator("[data-rail-step='proposals']");
  await proposals.focus();
  await expect(proposals).toBeFocused();
  await expect(proposals).toHaveAttribute("aria-label", /Propostas.*Concluída/i);
  await page.keyboard.press("Enter");
  await expect(proposals).toHaveAttribute("aria-pressed", "true");
  await expect(rail.locator("[data-rail-detail-title]")).toHaveText("Propostas");
  await expect(rail.locator("[data-rail-evidence]")).toContainText("comparison-demo");
});

test("evidence requests contain only the permitted evidence and step identifiers", async ({ page }) => {
  await page.goto("/tests/fixtures/dashboard-lab.html?role=buyer");
  await expect(page.locator("[data-dashboard-status]")).toHaveAttribute("data-dashboard-status", "ready");
  await page.locator("[data-rail-step='proposals']").click();

  const detail = await page.evaluate(() => new Promise((resolve) => {
    const rail = document.querySelector("[data-industrial-rail]");
    rail.addEventListener("sivi:evidence-request", (event) => resolve(event.detail), { once: true });
    rail.querySelector("[data-rail-evidence] button").click();
  }));

  expect(detail).toEqual({ evidenceId: "comparison-demo", stepId: "proposals" });
});

test("supplier rail contains no competitor evidence", async ({ page }) => {
  await page.goto("/tests/fixtures/dashboard-lab.html?role=supplier");
  await expect(page.locator("[data-dashboard-status]")).toHaveAttribute("data-dashboard-status", "ready");
  await page.locator("[data-rail-step='proposals']").click();
  await expect(page.locator("[data-industrial-rail]")).not.toContainText(/Horizonte|org-horizonte/);
  await expect(page.locator("[data-rail-evidence]")).toContainText("proposal-vetor-v2");
});

test("reduced motion removes the active rail pulse", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/tests/fixtures/dashboard-lab.html?role=buyer");
  await expect(page.locator("[data-dashboard-status]")).toHaveAttribute("data-dashboard-status", "ready");
  const animationName = await page.locator(".industrial-rail__node--active .industrial-rail__halo")
    .evaluate((node) => getComputedStyle(node).animationName);
  expect(animationName).toBe("none");
});

test("multiple rails use distinct SVG labels and cleanup is idempotent", async ({ page }) => {
  await page.goto("/tests/fixtures/dashboard-lab.html?role=buyer");
  await expect(page.locator("[data-dashboard-status]")).toHaveAttribute("data-dashboard-status", "ready");

  const result = await page.evaluate(async () => {
    const [{ mountIndustrialRail }, { createDemoRepository }] = await Promise.all([
      import("/src/visualizations/industrial-rail/industrial-rail.js"),
      import("/tests/fixtures/repositories/demo-repository.js"),
    ]);
    const projection = await createDemoRepository().getIndustrialJourney("workspace-buyer-alpha");
    const first = document.createElement("div");
    const second = document.createElement("div");
    document.body.append(first, second);
    const cleanupFirst = mountIndustrialRail(first, projection.data, projection.meta);
    const cleanupSecond = mountIndustrialRail(second, projection.data, projection.meta);
    const labelledBy = [...document.querySelectorAll("[data-industrial-rail] svg")]
      .map((svg) => svg.getAttribute("aria-labelledby"));
    cleanupFirst();
    cleanupFirst();
    const afterFirstCleanup = { first: first.childElementCount, second: second.childElementCount };
    cleanupSecond();
    first.remove();
    second.remove();
    return { labelledBy, afterFirstCleanup };
  });

  expect(new Set(result.labelledBy).size).toBe(result.labelledBy.length);
  expect(result.afterFirstCleanup).toEqual({ first: 0, second: 1 });
});
