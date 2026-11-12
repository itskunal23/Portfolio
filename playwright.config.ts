import { defineConfig, devices } from "@playwright/test";

const useSystemChrome = !process.env.CI;

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://localhost:4321",
    ...(useSystemChrome ? { channel: "chrome" } : {})
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 }, ...(useSystemChrome ? { channel: "chrome" } : {}) } },
    { name: "mobile", use: { ...devices["Pixel 7"], ...(useSystemChrome ? { channel: "chrome" } : {}) } }
  ],
  webServer: {
    command: "pnpm exec astro preview --port 4321",
    url: "http://localhost:4321",
    reuseExistingServer: true,
    timeout: 60_000
  }
});
