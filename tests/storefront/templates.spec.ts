// Written by tradecraft check init. Edit it freely: init never replaces a spec that exists.
// The alternate templates in the project, such as the pages the pages skill builds. tradecraft
// test init writes templates.json from the project's templates, and writes it again on each run.
import {expect, test} from '@playwright/test';
import {availableProduct, visit} from './support';
import targets from './templates.json';

for (const target of targets as Array<{template: string; path: string}>) {
  test(`The ${target.template} template loads with no error from the theme's scripts`, async ({page}) => {
    const path = target.path.includes('{product}') ? target.path.replace('{product}', await availableProduct(page)) : target.path;
    const errors = await visit(page, path);
    expect(errors).toEqual([]);
  });
}
