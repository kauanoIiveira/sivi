import { expect, test } from "@playwright/test";

test("serves the approved access document over HTTP", async ({ request }) => {
  const response = await request.get("/");
  const html = await response.text();
  expect(response.ok()).toBe(true);
  expect(html).toContain('class="auth-shell"');
  expect(html).toContain('id="confirm-password"');
});
