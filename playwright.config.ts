import { defineConfig, devices } from '@playwright/test';

const playwrightPort = Number(process.env.PLAYWRIGHT_PORT ?? '4173');
const playwrightHost = process.env.PLAYWRIGHT_HOST ?? '127.0.0.1';
const playwrightBaseUrl =
  process.env.PLAYWRIGHT_BASE_URL ??
  `http://${playwrightHost}:${playwrightPort.toString()}`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'github' : 'html',
  use: {
    baseURL: playwrightBaseUrl,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile-chromium',
      use: { ...devices['Pixel 7'] },
    },
  ],
  webServer: {
    command: `npm run dev -- --host ${playwrightHost} --port ${playwrightPort.toString()}`,
    url: playwrightBaseUrl,
    reuseExistingServer: !process.env.CI,
  },
});
