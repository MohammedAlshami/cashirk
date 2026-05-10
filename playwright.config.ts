import path from "path";
import { defineConfig, devices } from "@playwright/test";
import { config as loadEnv } from "dotenv";

loadEnv({ path: path.resolve(process.cwd(), ".env.local"), quiet: true });

/** When "1", dev server omits ConvAI bearer auth (public agents). Run: `PLAYWRIGHT_FORCE_SKIP_CONVAI_AUTH=1 pnpm test:e2e` */
if (process.env.PLAYWRIGHT_FORCE_SKIP_CONVAI_AUTH === "1") {
  process.env.ELEVENLABS_CONVAI_SKIP_AUTH = "true";
}

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [["list"]],
  timeout: 120_000,
  use: {
    baseURL: "http://localhost:3000",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    launchOptions: {
      args: ["--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream"],
    },
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI && !process.env.PLAYWRIGHT_FORCE_SKIP_CONVAI_AUTH,
    cwd: path.resolve(process.cwd()),
    timeout: 180_000,
    stdout: "pipe",
    stderr: "pipe",
    env: {
      ...process.env,
      ...(process.env.PLAYWRIGHT_FORCE_SKIP_CONVAI_AUTH === "1"
        ? { ELEVENLABS_CONVAI_SKIP_AUTH: "true" }
        : {}),
    },
  },
});
