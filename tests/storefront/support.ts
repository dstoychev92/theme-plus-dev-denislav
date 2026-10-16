// Written by tradecraft check init. Edit it freely: init never replaces a spec that exists.
import {expect, type ConsoleMessage, type Page} from '@playwright/test';

const target = new URL(process.env.TRADECRAFT_TEST_URL ?? 'http://localhost');

/** A storefront address. A preview link's theme ID stays on every address, so each page shows the preview. */
export function storefront(path: string): string {
  const url = new URL(path, target.origin);
  for (const key of ['preview_theme_id', '_ab', '_fd']) {
    const value = target.searchParams.get(key);
    if (value !== null) url.searchParams.set(key, value);
  }
  return url.href;
}

/** A message from the theme's own files. Apps and Shopify's scripts log errors the theme does not own. */
function fromTheme(location: string): boolean {
  return /\/t\/\d+\/assets\//.test(location) || /\/cdn\/shop\/t\//.test(location);
}

/**
 * Open a page and collect the errors the theme's scripts raise. The page must answer `status`.
 */
export async function visit(page: Page, path: string, {status = 200}: {status?: number} = {}): Promise<string[]> {
  const errors: string[] = [];
  page.on('console', (message: ConsoleMessage) => {
    if (message.type() === 'error' && fromTheme(message.location().url)) errors.push(message.text());
  });
  page.on('pageerror', (error) => {
    if (fromTheme(error.stack ?? '')) errors.push(error.message);
  });
  const response = await page.goto(storefront(path), {waitUntil: 'load'});
  expect(response?.status(), `${path} answered ${response?.status()}`).toBe(status);
  return errors;
}

type Product = {handle: string; variants: Array<{available: boolean}>};

/** A product the store sells now, from the storefront's public product feed */
export async function availableProduct(page: Page): Promise<string> {
  const response = await page.request.get(storefront('/products.json?limit=50'));
  const {products} = (await response.json()) as {products: Product[]};
  const product = products.find((item) => item.variants.some((variant) => variant.available)) ?? products[0];
  if (!product) throw new Error('The store has no product to test with.');
  return product.handle;
}
