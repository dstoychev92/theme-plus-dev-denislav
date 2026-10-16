/**
 * Evidence from the Admin API through Shopify CLI, for a store whose storefront has a password or to replace
 * the storefront sample with exact answers. Read-only queries only.
 *
 * Shopify CLI needs a one-time sign-in that grants a CLI app read access to the store:
 *
 *     shopify store auth --store <store>.myshopify.com --scopes read_products,read_content,read_online_store_pages,read_markets
 *
 * Run that only with approval. Then this module answers which template every product, collection, page, and article
 * uses, which countries each market holds, and whether each app is installed.
 */
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

export const SCOPES = 'read_products,read_content,read_online_store_pages,read_markets';

// Each connection, the template kind it uses, and how its storefront address reads
const CONNECTIONS = [
  ['products', 'product', 'handle templateSuffix', (node) => `/products/${node.handle}`],
  ['collections', 'collection', 'handle templateSuffix', (node) => `/collections/${node.handle}`],
  ['pages', 'page', 'handle templateSuffix', (node) => `/pages/${node.handle}`],
  ['articles', 'article', 'handle templateSuffix blog { handle }', (node) => `/blogs/${node.blog.handle}/${node.handle}`],
];

/** Shopify CLI could not run the query, for example before `shopify store auth`. */
export class AdminError extends Error {}

/**
 * The nearest installed Shopify CLI above `start` or the current folder, so the version matches the project
 * or the monorepo. Then the one on PATH.
 */
function shopifyCommand(start) {
  for (const begin of [start, process.cwd()].filter(Boolean)) {
    for (let folder = path.resolve(begin); ; folder = path.dirname(folder)) {
      const local = path.join(folder, 'node_modules', '.bin', 'shopify');
      if (fs.existsSync(local)) return local;
      if (path.dirname(folder) === folder) break;
    }
  }
  return 'shopify';
}

function execute(store, query, variables = null, start = null) {
  const command = shopifyCommand(start);
  const args = ['store', 'execute', '--store', store, '--query', query, '--json'];
  if (variables) args.push('--variables', JSON.stringify(variables));
  const result = spawnSync(command, args, {encoding: 'utf8', timeout: 120_000, maxBuffer: Infinity});
  if (result.error) {
    // spawnSync looks up shopify on PATH and reports a missing one as ENOENT
    if (command === 'shopify' && ['ENOENT', 'EACCES'].includes(result.error.code)) {
      throw new AdminError('Shopify CLI is not installed here. Run pnpm install in the project.');
    }
    throw result.error;
  }
  if (result.status !== 0) {
    const message = (result.stderr || result.stdout).trim().split(/\r\n|\r|\n/);
    throw new AdminError(
      `${message.slice(-3).join(' ')}\nSign in first, with approval: shopify store auth --store ${store} --scopes ${SCOPES}`);
  }
  const data = JSON.parse(result.stdout);
  return 'data' in data ? data.data : data;
}

/** The template a resource uses, as templates/<kind>.<suffix>.json or .liquid. */
function templateFile(kind, suffix, templates) {
  const name = suffix ? `${kind}.${suffix}` : kind;
  for (const extension of ['json', 'liquid']) {
    const candidate = `templates/${name}.${extension}`;
    if (templates.includes(candidate)) return candidate;
  }
  return `templates/${name}.json (missing from the theme)`;
}

function templatesInUse(store, templates, start = null) {
  const used = new Map();
  for (const [connection, kind, fields, address] of CONNECTIONS) {
    let after = null;
    while (true) {
      const query = `query($after: String) { ${connection}(first: 250, after: $after) { nodes { ${fields} } `
        + 'pageInfo { hasNextPage endCursor } } }';
      const page = execute(store, query, {after}, start)[connection];
      for (const node of page.nodes) {
        const template = templateFile(kind, node.templateSuffix, templates);
        if (!used.has(template)) used.set(template, []);
        used.get(template).push(address(node));
      }
      if (!page.pageInfo.hasNextPage) break;
      after = page.pageInfo.endCursor;
    }
  }
  return new Map([...used].map(([template, paths]) => [template, paths.sort()]));
}

function markets(store, start = null) {
  const query = '{ markets(first: 50) { nodes { handle status conditions { regionsCondition { regions(first: 250) '
    + '{ nodes { ... on MarketRegionCountry { code } } } } } } } }';
  const found = new Map();
  for (const node of execute(store, query, null, start).markets.nodes) {
    const regions = node.conditions?.regionsCondition?.regions || {};
    const codes = (regions.nodes ?? []).filter((region) => region.code).map((region) => region.code).sort();
    if (codes.length) found.set(node.handle, codes);
  }
  return found;
}

/** Handle to installed or not. Shopify answers null for a handle it does not know. */
function appInstalls(store, handles, start = null) {
  const installs = new Map();
  const sorted = [...handles].sort();
  for (let offset = 0; offset < sorted.length; offset += 20) {
    const batch = sorted.slice(offset, offset + 20);
    const fields = batch
      .map((handle, index) => `a${index}: appByHandle(handle: ${JSON.stringify(handle)}) { title installation { id } }`)
      .join(' ');
    const data = execute(store, `{ ${fields} }`, null, start);
    batch.forEach((handle, index) => {
      const app = data[`a${index}`];
      installs.set(handle, app == null ? null : {title: app.title, installed: app.installation != null});
    });
  }
  return installs;
}

/** Throw AdminError when Shopify CLI is not signed in to the store. */
export function admin(store, templates, appHandles, start = null) {
  const used = templatesInUse(store, templates, start);
  // Only these kinds belong to resources the queries list. Others, such as index or cart, serve fixed pages.
  const kinds = CONNECTIONS.map(([, kind]) => `templates/${kind}.`);
  return {
    templatesUsed: used,
    templatesUnseen: [...new Set(templates)]
      .filter((template) => !used.has(template) && kinds.some((kind) => template.startsWith(kind)))
      .sort(),
    markets: markets(store, start),
    appInstalls: appInstalls(store, appHandles, start),
  };
}
