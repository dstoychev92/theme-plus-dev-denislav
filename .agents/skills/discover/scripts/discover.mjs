#!/usr/bin/env node
/**
 * Read what a store answers without asking anyone: its themes, the live theme's settings and
 * templates, the Admin API's store profile, and the public site. Read-only.
 *
 *   node discover.mjs --store <domain> [--no-admin] [--no-site] [--site <url>]
 *
 * Writes facts.json in .tradecraft/cache/ (or beside the early state file), merges the facts into
 * the engagement state when it exists, and prints a summary.
 */
import {spawnSync} from 'node:child_process';
import {existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {loadThemeJson} from '../../splice/scripts/themejson.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const option = (name) => {
  const index = args.indexOf(`--${name}`);
  return index < 0 ? undefined : args[index + 1];
};
const has = (name) => args.includes(`--${name}`);

const SCOPES = 'read_products,read_content,read_online_store_pages,read_online_store_navigation,read_markets,read_locales,read_legal_policies,read_metaobject_definitions,read_themes,read_script_tags';

/** Shopify CLI from the project when it has one, else from PATH */
function shopify(cliArgs) {
  let command = 'shopify';
  for (let folder = process.cwd(); ; folder = path.dirname(folder)) {
    const local = path.join(folder, 'node_modules', '.bin', 'shopify');
    if (existsSync(local)) {
      command = local;
      break;
    }
    if (path.dirname(folder) === folder) break;
  }
  return spawnSync(command, cliArgs, {encoding: 'utf8', timeout: 180_000, maxBuffer: 256 * 1024 * 1024});
}

function parseJson(text) {
  const trimmed = text.trim();
  for (const start of [0, trimmed.indexOf('{'), trimmed.indexOf('[')]) {
    if (start < 0) continue;
    try {
      return JSON.parse(trimmed.slice(start));
    } catch {
      /* try the next start */
    }
  }
  return null;
}

/** Theme JSON allows comments and trailing commas, and keeps comment-like text inside strings */
function themeJson(file) {
  try {
    return loadThemeJson(readFileSync(file));
  } catch {
    return null;
  }
}

const nodes = (connection) => connection?.nodes ?? connection?.edges?.map((edge) => edge.node) ?? (Array.isArray(connection) ? connection : []);

// Where facts go: the project's cache, or beside the early state file
function outputFolder() {
  for (let folder = process.cwd(); ; folder = path.dirname(folder)) {
    if (existsSync(path.join(folder, 'tradecraft.json'))) return path.join(folder, '.tradecraft', 'cache');
    if (path.dirname(folder) === folder) break;
  }
  return path.join(process.cwd(), '.discover');
}

let store = option('store');
const {load} = await import(path.join(here, '..', '..', 'tradecraft', 'scripts', 'state.mjs'));
const {file: stateFile, state} = load(process.cwd());
store ??= state?.store;
if (!store) {
  console.error('Give the store: discover.mjs --store <domain>');
  process.exit(2);
}
if (!store.includes('.')) store = `${store}.myshopify.com`;

const out = outputFolder();
mkdirSync(out, {recursive: true});
const facts = {readAt: new Date().toISOString(), store, missing: []};

// Themes
const listed = shopify(['theme', 'list', '--store', store, '--json']);
const themes = listed.status === 0 ? parseJson(listed.stdout) ?? [] : [];
if (!themes.length) facts.missing.push(`theme list: ${(listed.stderr || listed.stdout).trim().split('\n').slice(-2).join(' ')}. If Shopify CLI needs a sign-in, the developer runs: shopify theme list --store ${store}`);
const connected = (name) => /^[\w.-]+\/[\w./-]+$/.test(name);
const live = themes.find((theme) => theme.role === 'live' || theme.role === 'main');
facts.themeCount = themes.filter((theme) => theme.role !== 'development').length;
facts.themes = themes.map((theme) => ({id: theme.id, name: theme.name, role: theme.role, connected: connected(theme.name)}));

// The live theme's settings, templates, and section groups
if (live) {
  const folder = path.join(out, 'live');
  rmSync(folder, {recursive: true, force: true});
  mkdirSync(folder, {recursive: true});
  const pulled = shopify(['theme', 'pull', '--store', store, `--theme=${live.id}`, `--path=${folder}`, '--only=config/settings_data.json', '--only=config/settings_schema.json', '--only=templates/*.json', '--only=templates/*.liquid', '--only=sections/*.json']);
  if (pulled.status !== 0) facts.missing.push(`live theme files: ${(pulled.stderr || pulled.stdout).trim().split('\n').slice(-1)[0]}`);
  // Where each Liquid template's forms post: an outside service, such as a CRM, must keep working
  const templatesFolder = path.join(folder, 'templates');
  facts.forms = (existsSync(templatesFolder) ? readdirSync(templatesFolder).filter((name) => name.endsWith('.liquid')).sort() : []).flatMap((name) => {
    const liquid = readFileSync(path.join(templatesFolder, name), 'utf8');
    const files = /type=["']file["']|multipart\/form-data/.test(liquid);
    const outside = [...liquid.matchAll(/<form[^>]*action=["'](?:https?:)?\/\/([^/"']+)/g)].map((match) => match[1]);
    const shopify = /\{%-?\s*form\s+["']contact["']/.test(liquid) ? ['Shopify contact form'] : [];
    return [...new Set([...outside, ...shopify])].map((posts) => ({template: `templates/${name}`, posts, files}));
  });
  const schema = existsSync(path.join(folder, 'config', 'settings_schema.json')) ? themeJson(path.join(folder, 'config', 'settings_schema.json')) : null;
  const info = Array.isArray(schema) ? schema.find((entry) => entry.name === 'theme_info') ?? {} : {};
  facts.liveTheme = {id: live.id, name: live.name, theme: info.theme_name ?? null, version: info.theme_version ?? null, connected: connected(live.name)};

  // Apps that touch the storefront, from app blocks and embeds in the theme JSON
  const apps = new Map();
  const visit = (value, where, disabled) => {
    if (Array.isArray(value)) return value.forEach((item) => visit(item, where, disabled));
    if (!value || typeof value !== 'object') return;
    if (typeof value.type === 'string') {
      const match = /^shopify:\/\/apps\/([^/]+)\/blocks\/([^/]+)/.exec(value.type);
      if (match) {
        const entry = apps.get(match[1]) ?? {handle: match[1], blocks: new Set(), where: new Set(), enabled: false};
        entry.blocks.add(match[2]);
        entry.where.add(where);
        if (!(disabled || value.disabled)) entry.enabled = true;
        apps.set(match[1], entry);
      }
    }
    for (const child of Object.values(value)) visit(child, where, disabled || value.disabled === true);
  };
  const files = [];
  const walk = (relative) => {
    const full = path.join(folder, relative);
    if (!existsSync(full)) return;
    for (const name of readdirSync(full)) {
      const child = path.join(relative, name);
      if (name.endsWith('.json')) files.push(child);
      else if (!name.includes('.')) walk(child);
    }
  };
  walk('templates');
  walk('sections');
  walk('config');
  for (const file of files) {
    const value = themeJson(path.join(folder, file));
    if (value) visit(value, file, false);
  }
  facts.apps = [...apps.values()].map((entry) => ({handle: entry.handle, enabled: entry.enabled, blocks: [...entry.blocks], where: [...entry.where].slice(0, 6)}));
  facts.templates = files.filter((file) => file.startsWith('templates/')).map((file) => file.slice('templates/'.length));
  const index = existsSync(path.join(folder, 'templates', 'index.json')) ? themeJson(path.join(folder, 'templates', 'index.json')) : null;
  facts.homepage = index ? (index.order ?? Object.keys(index.sections ?? {})).map((key) => ({id: key, type: index.sections?.[key]?.type, disabled: Boolean(index.sections?.[key]?.disabled)})) : [];
  const data = existsSync(path.join(folder, 'config', 'settings_data.json')) ? themeJson(path.join(folder, 'config', 'settings_data.json')) : null;
  const current = typeof data?.current === 'object' ? data.current : {};
  facts.design = Object.fromEntries(Object.entries(current).filter(([key]) => /logo|font|type_|color_scheme|social|cart_type|favicon/i.test(key) && typeof current[key] !== 'object').slice(0, 40));
}

// Admin API, through Shopify CLI's own sign-in
if (!has('no-admin')) {
  const query = `query TradecraftDiscover {
  shop { name myshopifyDomain primaryDomain { host url } plan { publicDisplayName shopifyPlus partnerDevelopment } currencyCode ianaTimezone
    customerAccountsV2 { customerAccountsVersion } shopPolicies { type title } }
  shopLocales { locale primary published }
  onlineStore { passwordProtection { enabled } }
  markets(first: 50) { nodes { name handle } }
  productsCount(limit: null) { count }
  collectionsCount(limit: null) { count }
  pagesCount { count }
  urlRedirectsCount { count }
  menus(first: 25) { nodes { handle title } }
  products(first: 50, sortKey: UPDATED_AT, reverse: true) { nodes { handle title templateSuffix options { name values } } }
  pages(first: 100) { nodes { handle title templateSuffix } }
  metafieldDefinitions(ownerType: PRODUCT, first: 100) { nodes { namespace key type { name } metafieldsCount } }
  metaobjectDefinitions(first: 50) { nodes { type name metaobjectsCount } }
}`;
  const result = shopify(['store', 'execute', '--store', store, '--query', query, '--json']);
  const body = result.status === 0 ? parseJson(result.stdout) : null;
  const data = body?.data ?? body;
  if (!data || typeof data !== 'object') {
    facts.missing.push(`Admin API: ${(result.stderr || result.stdout).trim().split('\n').slice(-2).join(' ')}. With the developer's approval, sign in read-only: shopify store auth --store ${store} --scopes ${SCOPES}`);
  } else {
    facts.shop = data.shop ?? null;
    facts.locales = (data.shopLocales ?? []).map((entry) => `${entry.locale}${entry.primary ? ' (primary)' : ''}${entry.published ? '' : ' (unpublished)'}`);
    facts.passwordProtected = data.onlineStore?.passwordProtection?.enabled ?? null;
    facts.markets = nodes(data.markets).map((market) => market.handle ?? market.name);
    facts.counts = {products: data.productsCount?.count ?? null, collections: data.collectionsCount?.count ?? null, pages: data.pagesCount?.count ?? null, redirects: data.urlRedirectsCount?.count ?? null};
    facts.menus = nodes(data.menus).map((menu) => menu.handle);
    const products = nodes(data.products);
    facts.productOptions = [...new Set(products.flatMap((product) => (product.options ?? []).map((option) => option.name)))];
    facts.templateSuffixes = [...new Set([...products, ...nodes(data.pages)].map((entry) => entry.templateSuffix).filter(Boolean))];
    facts.metafields = nodes(data.metafieldDefinitions).map((entry) => `${entry.namespace}.${entry.key} (${entry.type?.name ?? '?'}, ${entry.metafieldsCount ?? '?'} values)`);
    facts.metaobjects = nodes(data.metaobjectDefinitions).map((entry) => `${entry.type} (${entry.metaobjectsCount ?? '?'})`);
    facts.pages = nodes(data.pages).map((page) => page.handle);
  }
  // Apps that load through the ScriptTag API show no app block, so read them on their own.
  // A sign-in without read_script_tags loses only this read.
  const tags = shopify(['store', 'execute', '--store', store, '--query', 'query { scriptTags(first: 100) { nodes { src } } }', '--json']);
  const tagBody = tags.status === 0 ? parseJson(tags.stdout) : null;
  const tagData = tagBody?.data ?? tagBody;
  if (tagData?.scriptTags) {
    const hosts = nodes(tagData.scriptTags).map((tag) => /^(?:https?:)?\/\/([^/]+)/.exec(tag.src ?? '')?.[1]).filter((host) => host && !/shopify|cdn\.shop/.test(host));
    facts.scriptTagHosts = [...new Set(hosts)];
  } else {
    facts.missing.push(`script tags: ${(tags.stderr || tags.stdout).trim().split('\n').slice(-1)[0]}. Apps that load through script tags stay unknown until the sign-in has read_script_tags.`);
  }
}

// The public site. Redirects are followed by hand, because a store with markets sends / to a
// locale path, and only a redirect to /password means the store is locked. Shopify's bot
// protection turns away Node's own user agent.
const AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15';
if (!has('no-site')) {
  const host = facts.shop?.primaryDomain?.host ?? store;
  try {
    let address = option('site') ?? `https://${host}/`;
    let response;
    for (let hops = 0; ; hops++) {
      response = await fetch(address, {redirect: 'manual', headers: {'User-Agent': AGENT}, signal: AbortSignal.timeout(20_000)});
      const location = response.headers.get('location');
      if (!location || response.status < 300 || response.status >= 400) break;
      await response.body?.cancel();
      address = new URL(location, address).href;
      if (new URL(address).pathname.replace(/\/+$/, '').endsWith('/password') || hops >= 5) break;
    }
    if (new URL(address).pathname.replace(/\/+$/, '').endsWith('/password')) facts.passwordProtected = true;
    else if (!response.ok) facts.missing.push(`site: ${address} answered HTTP ${response.status}`);
    else {
      const html = await response.text();
      facts.scriptHosts = [...new Set([...html.matchAll(/<script[^>]+src="(?:https?:)?\/\/([^/"]+)/g)].map((match) => match[1]).filter((value) => !/shopify|cdn\.shop/.test(value)))];
      const theme = /Shopify\.theme\s*=\s*(\{[^;]+\})/.exec(html)?.[1];
      if (theme) facts.siteTheme = parseJson(theme);
    }
  } catch (error) {
    facts.missing.push(`site: ${error.message}`);
  }
}

writeFileSync(path.join(out, 'facts.json'), `${JSON.stringify(facts, null, 2)}\n`);
if (state && stateFile) {
  const {readFileSync: read} = await import('node:fs');
  const current = JSON.parse(read(stateFile, 'utf8'));
  current.facts = {...current.facts, ...facts};
  writeFileSync(stateFile, `${JSON.stringify(current, null, 2)}\n`);
}

const lines = [
  `Store: ${store}${facts.shop?.plan ? ` (${facts.shop.plan.publicDisplayName})` : ''}`,
  facts.liveTheme ? `Live theme: #${facts.liveTheme.id} "${facts.liveTheme.name}", ${facts.liveTheme.theme ?? '?'} ${facts.liveTheme.version ?? '?'}${facts.liveTheme.connected ? ', connected to a GitHub branch' : ''}` : 'Live theme: unknown',
  `Themes: ${facts.themeCount ?? '?'} of 20. Others: ${(facts.themes ?? []).filter((theme) => theme.role !== 'live' && theme.role !== 'main').map((theme) => `#${theme.id} ${theme.name}`).slice(0, 8).join('; ') || 'none'}`,
  facts.markets ? `Markets: ${facts.markets.join(', ')}. Languages: ${(facts.locales ?? []).join(', ')}` : null,
  facts.counts ? `Catalog: ${facts.counts.products} products, ${facts.counts.collections} collections, ${facts.counts.pages} pages, ${facts.counts.redirects} redirects` : null,
  facts.productOptions?.length ? `Product options: ${facts.productOptions.join(' | ')}` : null,
  facts.metafields?.length ? `Product metafields: ${facts.metafields.join('; ')}` : null,
  facts.metaobjects?.length ? `Metaobjects: ${facts.metaobjects.join('; ')}` : null,
  facts.apps ? `Apps in the theme: ${facts.apps.map((app) => `${app.handle}${app.enabled ? '' : ' (disabled)'}`).join(', ') || 'none'}` : null,
  facts.scriptHosts?.length ? `Scripts on the homepage: ${facts.scriptHosts.join(', ')}` : null,
  facts.scriptTagHosts?.length ? `Script tags: ${facts.scriptTagHosts.join(', ')}` : null,
  facts.forms?.length ? `Forms: ${facts.forms.map((form) => `${form.template} posts to ${form.posts}${form.files ? ' (file upload)' : ''}`).join('; ')}` : null,
  facts.homepage?.length ? `Homepage sections: ${facts.homepage.map((section) => `${section.type}${section.disabled ? ' (hidden)' : ''}`).join(', ')}` : null,
  facts.passwordProtected ? 'The storefront has a password.' : null,
  ...facts.missing.map((entry) => `Missing: ${entry}`),
  `Facts: ${path.join(out, 'facts.json')}`,
];
console.log(lines.filter(Boolean).join('\n'));
