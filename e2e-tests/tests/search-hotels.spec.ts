import { test, expect } from "@playwright/test";

const UI_URL = "http://localhost:5173/";

test.beforeEach(async ({ page }) => {
  await page.goto(UI_URL);

  await page.getByRole("link", { name: "Sign In" }).click();

  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

  await page.locator("[name=email]").fill("sachin@example.com");
  await page.locator("[name=password]").fill("password123");

  await page.getByRole("button", { name: "Sign In" }).click();

  await expect(page.getByText("Sign in Successful")).toBeVisible();
});

test("should show hotel search results", async ({ page }) => {
  await page.goto(UI_URL);

  await page.getByPlaceholder("Where are you going?").fill("Colombo");
  await page.getByRole("button", { name: "Search" }).click();

  await expect(page.getByText("Hotels found in Colombo")).toBeVisible();
  await expect(page.getByText("Majestic Suites")).toBeVisible();
});

test("should show hotel detail", async ({ page }) => {
  await page.goto(UI_URL);

  await page.getByPlaceholder("Where are you going?").fill("Colombo");
  await page.getByRole("button", { name: "Search" }).click();

  await page.getByText("Majestic Suites").click();
  await expect(page).toHaveURL(/detail/); // /detail/ is a ReGex
  await expect(page.getByRole("button", { name: "Book now" })).toBeVisible();
});
