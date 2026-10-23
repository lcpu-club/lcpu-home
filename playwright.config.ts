import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: true,
  workers: 2,
  use: { baseURL: 'http://127.0.0.1:4178', viewport: { width: 1440, height: 900 } },
  webServer: {
    command: 'node tests/serve.mjs',
    url: 'http://127.0.0.1:4178',
    reuseExistingServer: false,
  },
})
