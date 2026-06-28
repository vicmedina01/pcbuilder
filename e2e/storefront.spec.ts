import { expect, test } from "@playwright/test"

test("home page exposes the main guided flows", async ({ page }) => {
  await page.goto("/")

  await expect(page.getByRole("heading", { name: "Build the PC your games and work actually need." })).toBeVisible()
  await expect(page.getByRole("link", { name: "Start guided build" })).toHaveAttribute("href", "/builder")
  await expect(page.getByRole("link", { name: "Browse components" })).toHaveAttribute("href", "/products")
})

test("catalog state is reflected in the URL and supports pagination", async ({ page }) => {
  await page.goto("/products")

  await page.getByRole("button", { name: "GPU", exact: true }).click()
  await expect(page).toHaveURL(/category=GPU/)

  await page.getByPlaceholder("Search CPU, GPU, brand...").fill("RTX")
  await expect(page).toHaveURL(/q=RTX/)

  await page.getByPlaceholder("Search CPU, GPU, brand...").fill("")
  await page.getByRole("button", { name: "All", exact: true }).click()
  await page.getByRole("navigation", { name: "Catalog pagination" }).getByRole("button", { name: "Next" }).click()
  await expect(page).toHaveURL(/page=2/)
})

test("guided builder can apply a complete recommendation and add it to the cart", async ({ page }) => {
  await page.goto("/builder")

  await page.getByRole("button", { name: "Apply build" }).click()
  await expect(page.getByText("8/8", { exact: true })).toBeVisible()

  const addBuild = page.getByRole("button", { name: "Add build to cart" })
  await expect(addBuild).toBeEnabled()
  await addBuild.click()
  await expect(page.getByRole("link", { name: /Cart \(8\)/ })).toBeVisible()
})

test("admin route is unavailable to anonymous visitors", async ({ page }) => {
  await page.goto("/admin")
  await expect(page).toHaveURL("/")
})

test("pages do not overflow the viewport", async ({ page }) => {
  for (const path of ["/", "/products", "/builder", "/cart"]) {
    await page.goto(path)
    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      content: document.documentElement.scrollWidth,
    }))
    expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport + 1)
  }
})
