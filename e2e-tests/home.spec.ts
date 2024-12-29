import { expect, test } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("https://ytcatalog.707x.in/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/YTCatalog/);
});
