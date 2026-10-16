// Written by tradecraft check init. Edit it freely: init never replaces a spec that exists.
import {expect, test} from '@playwright/test';
import {availableProduct, visit} from './support';

const PAGES = [
  {name: 'home', path: '/'},
  {name: 'collection', path: '/collections/all'},
  {name: 'product', path: '/products/{product}'},
  {name: 'search', path: '/search?q=a'},
  {name: 'cart', path: '/cart'},
];

for (const entry of PAGES) {
  test(`The ${entry.name} page loads with no error from the theme's scripts`, async ({page}) => {
    const path = entry.path.replace('{product}', entry.path.includes('{product}') ? await availableProduct(page) : '');
    const errors = await visit(page, path);
    expect(errors).toEqual([]);
  });

  test(`The ${entry.name} page has one main landmark, a language, and alt text on each image`, async ({page}) => {
    const path = entry.path.replace('{product}', entry.path.includes('{product}') ? await availableProduct(page) : '');
    await visit(page, path);
    await expect(page.locator('main')).toHaveCount(1);
    expect(await page.locator('html').getAttribute('lang')).toBeTruthy();
    const missing = await page.locator('main img:not([alt])').count();
    expect(missing, 'images in main with no alt attribute').toBe(0);
  });

  test(`The ${entry.name} page fits the screen with no sideways scroll`, async ({page}) => {
    const path = entry.path.replace('{product}', entry.path.includes('{product}') ? await availableProduct(page) : '');
    await visit(page, path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
}

test('A missing page answers 404 inside the theme layout', async ({page}) => {
  await visit(page, '/pages/tradecraft-missing-page', {status: 404});
  await expect(page.locator('main')).toHaveCount(1);
});
