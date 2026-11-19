import { readFile, writeFile } from "node:fs/promises";
import { expect, test, type Page } from "@playwright/test";

const sceneCanvas = "main canvas.r3f-canvas";
const inspector = ".three-inspector";
const overviewOffset = 2.5 / (2 * 15 * Math.tan((25 * Math.PI) / 180));

test.afterEach(async ({ page }) => {
  expect(await page.pageErrors()).toEqual([]);
});

async function activateMesh(page: Page, horizontalOffset = 0) {
  const canvas = page.locator(sceneCanvas);
  await expect(canvas).toBeVisible();
  const icons = page.locator("main [aria-hidden=true] .lucide");
  await icons.first().waitFor({ state: "attached" });
  const bounds = await canvas.boundingBox();
  if (!bounds) throw new Error("The scene canvas has no bounds");

  const x = bounds.x + bounds.width / 2 + bounds.height * horizontalOffset;
  const y = bounds.y + bounds.height / 2;
  await expect.poll(async () => {
    await page.mouse.move(x, y);
    return canvas.evaluate((element) => (element as HTMLCanvasElement).style.cursor);
  }).toBe("pointer");
  await expect(icons.filter({ visible: true }).first()).toBeVisible();
  await page.mouse.click(x, y);
}

async function sceneSample(page: Page) {
  const bounds = await page.locator(sceneCanvas).boundingBox();
  if (!bounds) throw new Error("The scene canvas has no bounds");

  return page.screenshot({
    clip: {
      x: Math.round(bounds.x + bounds.width / 2),
      y: Math.round(bounds.y + bounds.height / 2),
      width: 8,
      height: 8,
    },
  });
}

async function openInspector(page: Page) {
  await page.locator(`${inspector} .profiler-toggle .toggle-text`).click();
  await expect(page.locator(`${inspector} .profiler-panel.visible`)).toBeVisible();
  await page.locator(`${inspector} .profiler-toggle .toggle-text`).click();
}

test("scene links are keyboard accessible and announce the current page", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  await page.evaluate(() => document.documentElement.setAttribute("data-navigation-probe", "original"));
  const nav = page.getByRole("navigation", { name: "Scenes" });
  const home = nav.getByRole("link", { name: "Home" });
  const tsl = nav.getByRole("link", { name: "TSL scene" });

  await expect(home).toHaveAttribute("aria-current", "page");
  await home.focus();
  await page.keyboard.press("Tab");
  await expect(tsl).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/tsl$/);
  await expect(page.locator("html")).toHaveAttribute("data-navigation-probe", "original");
  await expect(tsl).toHaveAttribute("aria-current", "page");
  await expect(home).not.toHaveAttribute("aria-current", "page");
});

test("hover icons and mesh links work with reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.evaluate(() => document.documentElement.setAttribute("data-navigation-probe", "original"));

  // Project the overview's two mesh centers using its camera distance and FOV.
  await activateMesh(page, overviewOffset);
  await expect(page).toHaveURL(/\/cube$/);
  await expect(page.locator("html")).toHaveAttribute("data-navigation-probe", "original");
  await activateMesh(page);
  await expect(page).toHaveURL(/\/$/);
  await activateMesh(page, -overviewOffset);
  await expect(page).toHaveURL(/\/tsl$/);
  await activateMesh(page);
  await expect(page).toHaveURL(/\/$/);
});

test("both Inspector controls update the rendered material", async ({ page }) => {
  for (const { route, type, initial, edited } of [
    { route: "/cube", type: "color", initial: "#679cf4", edited: "#f53121" },
    { route: "/tsl", type: "range", initial: "0.35", edited: "0.95" },
  ]) {
    await page.goto(route);
    await openInspector(page);
    const input = page.locator(`${inspector} .profiler-mini-panel.visible input[type="${type}"]`);
    if (!(await input.isVisible())) {
      await page.getByTitle("Parameters", { exact: true }).click();
    }
    await expect(input).toHaveValue(initial);
    const before = await sceneSample(page);
    await input.evaluate((element, value) => {
      (element as HTMLInputElement).value = value;
      element.dispatchEvent(new Event("input", { bubbles: true }));
    }, edited);
    await expect.poll(async () => (await sceneSample(page)).equals(before)).toBe(false);
  }
});

test("Fast Refresh updates the Inspector on a directly loaded route", async ({ page }) => {
  await page.goto("/cube");
  const input = page.locator(`${inspector} input[type="color"]`);
  await expect(input).toHaveValue("#679cf4");
  await page.locator(sceneCanvas).evaluate((element) => element.setAttribute("data-refresh-probe", "original"));

  const path = "src/features/scenes/cube/CubeView.tsx";
  const original = await readFile(path, "utf8");
  const edited = original.replace("0x679cf4", "0xf53121");
  expect(edited).not.toBe(original);

  try {
    await writeFile(path, edited);
    await expect(input).toHaveValue("#f53121", { timeout: 15_000 });
    await expect(page.locator(sceneCanvas)).toHaveAttribute("data-refresh-probe", "original");
    await expect(page.locator(inspector)).toHaveCount(1);
  } finally {
    if ((await readFile(path, "utf8")) === edited) await writeFile(path, original);
  }
});
