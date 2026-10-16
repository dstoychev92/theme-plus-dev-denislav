// Written by tradecraft check init. Edit it freely: init never replaces a spec that exists.
// The suite checks a live theme. TRADECRAFT_TEST_URL names it, such as a preview link.
import path from 'path';
import {defineConfig, devices} from '@playwright/test';

export default defineConfig({
  testDir: '.',
  testMatch: '*.spec.ts',
  timeout: 60_000,
  retries: process.env.CI ? 1 : 0,
  workers: 2,
  reporter: [['list']],
  globalSetup: './global-setup.ts',
  outputDir: '.results',
  use: {storageState: path.join(__dirname, '.storefront-state.json'), trace: 'retain-on-failure'},
  projects: [
    {name: 'desktop', use: {...devices['Desktop Chrome']}},
    {name: 'phone', use: {...devices['Pixel 7']}},
  ],
});
