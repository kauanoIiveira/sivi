import { expect, test } from "@playwright/test";

for (const role of ["buyer", "supplier", "administration"]) {
  test(`${role} dashboard renders traceable metrics`, async ({ page }) => {
    await page.goto(`/tests/fixtures/dashboard-lab.html?role=${role}`);
    await expect(page.locator("[data-dashboard-status]")).toHaveAttribute("data-dashboard-status", "ready");
    await expect(page.locator(".dashboard-page")).toHaveAttribute("data-page-state", "success");
    await expect(page.locator(".dashboard-hero__eyebrow")).not.toBeEmpty();
    const metrics = page.locator("[data-metric]");
    for (let index = 0; index < await metrics.count(); index += 1) {
      const metric = metrics.nth(index);
      await expect(metric.locator(".metric-card__label")).not.toBeEmpty();
      await expect(metric.locator(".metric-card__value")).not.toBeEmpty();
      await metric.locator("summary").click();
      await expect(metric.getByText("Fórmula", { exact: true })).toBeVisible();
      await expect(metric.getByText("Período", { exact: true })).toBeVisible();
      await expect(metric.getByText("Origem", { exact: true })).toBeVisible();
      await expect(metric.locator("dd")).toHaveCount(3);
    }
    await expect(page.locator("[data-industrial-rail]")).toHaveCount(1);
    await expect(page.locator("[data-rail-step]")).toHaveCount(9);
    await expect(page.locator("[data-dashboard-lab]")).toHaveAttribute("data-on-ready", "success");
  });
}

test("supplier browser view never receives competitor copy", async ({ page }) => {
  await page.goto("/tests/fixtures/dashboard-lab.html?role=supplier");
  await expect(page.locator("[data-dashboard-status]")).toHaveAttribute("data-dashboard-status", "ready");
  await expect(page.locator("body")).not.toContainText("Horizonte Usinagem");
  await expect(page.locator("body")).not.toContainText("R$ 144.500,00");
});

test("admin page is demonstrative and calls value negotiated, never revenue", async ({ page }) => {
  await page.goto("/tests/fixtures/dashboard-lab.html?role=administration");
  await expect(page.getByText("Valor negociado", { exact: true })).toBeVisible();
  await expect(page.locator("body")).not.toContainText(/faturamento/i);
  await expect(page.getByText(/não representa aprovação, permissão ou auditoria real/i)).toBeVisible();
});

for (const state of ["loading", "empty", "error", "forbidden", "conflict"]) {
  test(`dashboard renders ${state} deliberately`, async ({ page }) => {
    await page.goto(`/tests/fixtures/dashboard-lab.html?role=buyer&state=${state}`);
    await expect(page.locator("[data-page-state]")).toHaveAttribute("data-page-state", state);
  });
}

for (const state of ["empty", "error", "conflict"]) {
  test(`${state} action retries in place and reaches success`, async ({ page }) => {
    await page.goto(`/tests/fixtures/dashboard-lab.html?role=buyer&state=${state}`);
    const action = page.locator("[data-page-state] button");
    await expect(action).toBeVisible();
    expect((await action.boundingBox()).height).toBeGreaterThanOrEqual(44);
    await action.click();
    await expect(page.locator(".dashboard-page")).toHaveAttribute("data-page-state", "success");
    await expect(page.locator("[data-dashboard-lab]")).toHaveAttribute("data-on-ready", "success");
  });
}

test("forbidden state explains access without offering a cosmetic retry", async ({ page }) => {
  await page.goto("/tests/fixtures/dashboard-lab.html?role=buyer&state=forbidden");
  await expect(page.getByText(/menu oculto não substitui permissão real/i)).toBeVisible();
  await expect(page.locator("[data-page-state] button")).toHaveCount(0);
});

test("metric disclosure is keyboard reachable and meets the target size", async ({ page }) => {
  await page.goto("/tests/fixtures/dashboard-lab.html?role=buyer");
  const summary = page.locator("[data-metric] summary").first();
  await summary.focus();
  await expect(summary).toBeFocused();
  expect((await summary.boundingBox()).height).toBeGreaterThanOrEqual(44);
  await page.keyboard.press("Enter");
  await expect(page.locator("[data-metric]").first().getByText("Fórmula", { exact: true })).toBeVisible();
});

test("cleanup prevents a late repository result from repainting the container", async ({ page }) => {
  await page.goto("/tests/fixtures/dashboard-lab.html?role=buyer");
  const result = await page.evaluate(async () => {
    const [{ mountDashboardPage }, { createDemoRepository }] = await Promise.all([
      import("/src/pages/dashboard/dashboard-view.js"),
      import("/tests/fixtures/repositories/demo-repository.js"),
    ]);
    const container = document.createElement("div");
    document.body.append(container);
    let resolveDashboard;
    const delayedDashboard = new Promise((resolve) => { resolveDashboard = resolve; });
    const readyResult = await createDemoRepository().getDashboard("workspace-buyer-alpha");
    let readyCalls = 0;
    const cleanup = mountDashboardPage({
      container,
      workspace: { id: "workspace-buyer-alpha" },
      repository: { getDashboard: () => delayedDashboard },
      onReady: () => { readyCalls += 1; },
    });
    cleanup();
    resolveDashboard(readyResult);
    await new Promise((resolve) => setTimeout(resolve, 0));
    const snapshot = {
      childCount: container.childElementCount,
      status: container.dataset.dashboardStatus ?? null,
      readyCalls,
    };
    container.remove();
    return snapshot;
  });

  expect(result).toEqual({ childCount: 0, status: null, readyCalls: 0 });
});

test("retry ignores duplicate activations while its reset is still in flight", async ({ page }) => {
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.goto("/tests/fixtures/dashboard-lab.html?role=buyer");

  const result = await page.evaluate(async () => {
    const [{ mountDashboardPage }, { createDemoRepository }] = await Promise.all([
      import("/src/pages/dashboard/dashboard-view.js"),
      import("/tests/fixtures/repositories/demo-repository.js"),
    ]);
    const realRepository = createDemoRepository();
    const readyResult = await realRepository.getDashboard("workspace-buyer-alpha");
    const journeyResult = await realRepository.getIndustrialJourney("workspace-buyer-alpha");
    const container = document.createElement("div");
    document.body.append(container);
    let dashboardCalls = 0;
    let resetCalls = 0;
    let releaseReset;
    const resetBarrier = new Promise((resolve) => { releaseReset = resolve; });
    const cleanup = mountDashboardPage({
      container,
      workspace: { id: "workspace-buyer-alpha" },
      repository: {
        async getDashboard() {
          dashboardCalls += 1;
          return dashboardCalls === 1 ? { status: "error" } : readyResult;
        },
        async getIndustrialJourney() {
          return journeyResult;
        },
        async reset() {
          resetCalls += 1;
          await resetBarrier;
        },
      },
    });
    await new Promise((resolve) => setTimeout(resolve, 0));
    const retry = container.querySelector("[data-page-state=error] button");
    retry.click();
    retry.click();
    const duringReset = { dashboardCalls, resetCalls, status: container.dataset.dashboardStatus };
    releaseReset();
    await new Promise((resolve) => setTimeout(resolve, 0));
    await new Promise((resolve) => setTimeout(resolve, 0));
    const afterReset = { dashboardCalls, resetCalls, status: container.dataset.dashboardStatus };
    cleanup();
    container.remove();
    return { duringReset, afterReset };
  });

  expect(result).toEqual({
    duringReset: { dashboardCalls: 1, resetCalls: 1, status: "loading" },
    afterReset: { dashboardCalls: 2, resetCalls: 1, status: "ready" },
  });
  expect(pageErrors).toEqual([]);
});

test("a rejected retry reset stays recoverable without an unhandled browser rejection", async ({ page }) => {
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.goto("/tests/fixtures/dashboard-lab.html?role=buyer");

  const result = await page.evaluate(async () => {
    const [{ mountDashboardPage }, { createDemoRepository }] = await Promise.all([
      import("/src/pages/dashboard/dashboard-view.js"),
      import("/tests/fixtures/repositories/demo-repository.js"),
    ]);
    const realRepository = createDemoRepository();
    const readyResult = await realRepository.getDashboard("workspace-buyer-alpha");
    const journeyResult = await realRepository.getIndustrialJourney("workspace-buyer-alpha");
    const container = document.createElement("div");
    document.body.append(container);
    let dashboardCalls = 0;
    let resetCalls = 0;
    const cleanup = mountDashboardPage({
      container,
      workspace: { id: "workspace-buyer-alpha" },
      repository: {
        async getDashboard() {
          dashboardCalls += 1;
          return dashboardCalls === 1 ? { status: "error" } : readyResult;
        },
        async getIndustrialJourney() {
          return journeyResult;
        },
        async reset() {
          resetCalls += 1;
          if (resetCalls === 1) throw new Error("reset recusado para o teste");
        },
      },
    });
    await new Promise((resolve) => setTimeout(resolve, 0));
    container.querySelector("[data-page-state=error] button").click();
    await new Promise((resolve) => setTimeout(resolve, 0));
    const afterRejectedReset = {
      resetCalls,
      state: container.querySelector("[data-page-state]")?.dataset.pageState,
    };
    container.querySelector("[data-page-state=error] button").click();
    await new Promise((resolve) => setTimeout(resolve, 0));
    await new Promise((resolve) => setTimeout(resolve, 0));
    const afterRecovery = { dashboardCalls, resetCalls, status: container.dataset.dashboardStatus };
    cleanup();
    container.remove();
    return { afterRejectedReset, afterRecovery };
  });

  expect(result).toEqual({
    afterRejectedReset: { resetCalls: 1, state: "error" },
    afterRecovery: { dashboardCalls: 2, resetCalls: 2, status: "ready" },
  });
  expect(pageErrors).toEqual([]);
});
