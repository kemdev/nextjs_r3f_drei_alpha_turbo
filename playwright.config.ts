import { defineConfig } from "@playwright/test";

const port = process.env.CI ? 3100 : 3000;
const baseURL = `http://localhost:${port}`;

export default defineConfig({
  testDir: "./tests/e2e",
  workers: 1,
  use: {
    baseURL,
    viewport: { width: 1200, height: 900 },
    trace: "retain-on-failure",
    launchOptions: {
      args: ["--disable-webgpu", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
    },
  },
  webServer: {
    command: `bun run dev --port ${port}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
