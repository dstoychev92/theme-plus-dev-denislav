// Written by tradecraft check init. Edit it freely: init never replaces a spec that exists.
import {expect, test} from '@playwright/test';
import {availableProduct, storefront, visit} from './support';

test('A shopper adds a product to the cart from its page', async ({page}) => {
  await visit(page, `/products/${await availableProduct(page)}`);
  const form = page.locator('form[action*="/cart/add"]').filter({has: page.locator('[type="submit"]')}).first();
  await form.locator('[type="submit"]').first().click();
  await expect
    .poll(async () => ((await (await page.request.get(storefront('/cart.js'))).json()) as {item_count: number}).item_count, {timeout: 15_000})
    .toBeGreaterThan(0);
});
