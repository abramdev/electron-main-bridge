/**
 * Playwright 配置文件
 * 用于 E2E 测试 electron-main-bridge
 */

import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./",
  testMatch: "test-e2e/tests/**/*.test.ts",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [
    ["html", { outputFolder: "test-e2e/playwright-report" }],
    ["json", { outputFile: "test-e2e/test-results/results.json" }],
    ["list"],
  ],
  use: {
    headless: process.env.CI ? true : false,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "electron",
    },
  ],
  outputDir: "test-e2e/test-results",
});
