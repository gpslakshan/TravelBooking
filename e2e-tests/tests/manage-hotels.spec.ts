import { test, expect } from "@playwright/test";
import path from "path";

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

test("should allow user to add a hotel", async ({ page }) => {
  await page.goto(`${UI_URL}add-hotel`);

  await page.locator('[name="name"]').fill("Test Hotel");
  await page.locator('[name="city"]').fill("Test City");
  await page.locator('[name="country"]').fill("Test Country");
  await page
    .locator('[name="description"]')
    .fill("This is a test description for the test hotel.");
  await page.locator('[name="pricePerNight"]').fill("100");
  await page.selectOption('select[name="starRating"]', "3");

  await page.getByText("Budget").click();

  await page.getByLabel("Family Rooms").check();
  await page.getByLabel("Parking").check();

  await page.locator('[name="adultCount"]').fill("10");
  await page.locator('[name="childCount"]').fill("20");

  await page.setInputFiles('[name="imageFiles"]', [
    path.join(__dirname, "files", "pexels-jimmy-chan-1458457.jpg"),
    path.join(__dirname, "files", "pexels-pixabay-261101.jpg"),
  ]);

  await page.getByRole("button", { name: "Save" }).click();

  await expect(page.getByText("Hotel Saved!")).toBeVisible();
});

test("should display hotels", async ({ page }) => {
  await page.goto(`${UI_URL}my-hotels`);

  await expect(page.getByText("Majestic Suites")).toBeVisible();
  await expect(
    page.getByText("Lorem ipsum dolor sit amet, consectetur adipiscing elit.")
  ).toBeVisible();
  await expect(page.getByText("Colombo, Sri Lanka")).toBeVisible();
  await expect(page.getByText("Luxury")).toBeVisible();
  await expect(page.getByText("$500 per night")).toBeVisible();
  await expect(page.getByText("400 adults, 596 children")).toBeVisible();
  await expect(page.getByText("5 Star Rating")).toBeVisible();

  await expect(
    page.getByRole("link", { name: "View Details" }).first()
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Add Hotel" })).toBeVisible();
});

test("should edit hotel", async ({ page }) => {
  await page.goto(`${UI_URL}my-hotels`);

  await page.getByRole("link", { name: "View Details" }).first().click();

  await page.waitForSelector('[name="name"]', { state: "attached" });
  await expect(page.locator('[name="name"]')).toHaveValue("Majestic Suites");
  await page.locator('[name="name"]').fill("Majestic Suites UPDATED");
  await page.getByRole("button", { name: "Save" }).click();

  await expect(page.getByText("Hotel Saved!")).toBeVisible();

  await page.reload();
  await expect(page.locator('[name="name"]')).toHaveValue(
    "Majestic Suites UPDATED"
  );

  await page.locator('[name="name"]').fill("Majestic Suites");
  await page.getByRole("button", { name: "Save" }).click();
});
