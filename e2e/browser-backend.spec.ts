import { test, expect } from "@playwright/test";

test.describe("dev:browser mode", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("renders the home page", async ({ page }) => {
    await expect(page.locator('[data-testid="main-page"]')).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Share. Build. Innovate." }),
    ).toBeVisible();
  });

  test("header and search bar are visible", async ({ page }) => {
    await expect(page.locator('[data-testid="search-bar"]')).toBeVisible();
  });

  test("service worker is registered", async ({ page }) => {
    const swRegistered = await page.evaluate(async () => {
      if (!("serviceWorker" in navigator)) return false;
      const reg = await navigator.serviceWorker.getRegistration();
      return reg != null;
    });
    expect(swRegistered).toBe(true);
  });

  test("loads project cards from the in-browser SQLite backend", async ({
    page,
  }) => {
    // The service worker intercepts API calls and serves projects from SQLite.
    // Wait for at least one AppCard to appear.
    await expect(page.locator('[data-testid="AppCard"]').first()).toBeVisible({
      timeout: 30_000,
    });

    const cardCount = await page.locator('[data-testid="AppCard"]').count();
    expect(cardCount).toBeGreaterThan(0);
  });

  test("search bar filters projects", async ({ page }) => {
    // Wait for cards to load first
    await expect(page.locator('[data-testid="AppCard"]').first()).toBeVisible({
      timeout: 30_000,
    });

    const totalCards = await page.locator('[data-testid="AppCard"]').count();

    // Type a very specific search term unlikely to match everything
    await page.locator('[data-testid="search-bar"]').fill("zzznomatch999");

    // Either no cards, or fewer cards than before
    const filtered = page.locator('[data-testid="AppCard"]');
    await expect(async () => {
      const count = await filtered.count();
      expect(count).toBeLessThan(totalCards);
    }).toPass({ timeout: 5_000 });
  });

  test("Explore Projects button scrolls to apps-grid section", async ({
    page,
  }) => {
    await expect(page.locator('[data-testid="AppCard"]').first()).toBeVisible({
      timeout: 30_000,
    });
    await page.getByRole("link", { name: "Explore Projects" }).click();
    // After clicking, the apps-grid section should be visible and the URL
    // must NOT have changed to a different route (HashRouter conflict fixed)
    await expect(page.locator("#apps-grid")).toBeVisible();
    // URL must NOT have changed to /#apps-grid (which would break HashRouter routing)
    await expect(page).not.toHaveURL(/#apps-grid/);
  });
});
