import { expect, test } from "@playwright/test";

// M0 smoke test: the placeholder boot page loads and the Phaser canvas mounts.
// Real e2e (T09/T10 chapter runs, T17 mobile, T18 subpath/iframe) lands in
// M1–M6; this test only proves the scaffold serves and boots.
test("placeholder boot page loads and mounts a canvas", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Celestial Haven/);
  await expect(page.locator("#game canvas")).toBeVisible();
});
