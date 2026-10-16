// Written by tradecraft check init. Edit it freely: init never replaces a spec that exists.
// Open the storefront once: a preview link sets the preview theme for the visit, and a storefront
// password page takes TRADECRAFT_STOREFRONT_PASSWORD. Every test then starts from that visit.
import path from 'path';
import {chromium} from '@playwright/test';

export default async function globalSetup(): Promise<void> {
  const address = process.env.TRADECRAFT_TEST_URL;
  if (!address) throw new Error('Set TRADECRAFT_TEST_URL to the storefront to test, such as a preview link.');
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(address);
  if (new URL(page.url()).pathname === '/password') {
    const password = process.env.TRADECRAFT_STOREFRONT_PASSWORD;
    if (!password) throw new Error('The storefront has a password. Set TRADECRAFT_STOREFRONT_PASSWORD.');
    await page.locator('input[type="password"]').fill(password);
    await Promise.all([page.waitForURL((url) => url.pathname !== '/password'), page.locator('input[type="password"]').press('Enter')]);
    await page.goto(address);
  }
  await page.context().storageState({path: path.join(__dirname, '.storefront-state.json')});
  await browser.close();
}
