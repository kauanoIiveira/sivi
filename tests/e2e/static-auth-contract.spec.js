import { expect, test } from "@playwright/test";

test("serves the public entry and portable React assets over HTTP", async ({ request }) => {
  const response = await request.get("/");
  const html = await response.text();
  expect(response.ok()).toBe(true);
  expect(html).toContain('data-auth-surface');
  expect(html).toContain('./src/generated/public/style.css');
  expect((await request.get('/src/generated/public/entry.js')).ok()).toBe(true);
  expect((await request.get('/src/generated/public/style.css')).ok()).toBe(true);
});
