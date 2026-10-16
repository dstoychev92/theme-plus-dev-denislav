/**
 * Evidence from the live storefront. Only GET requests to public pages, except the storefront password form when
 * the store has a password and STOREFRONT_PASSWORD gives it.
 *
 * - Apps: theme app extensions that load files, app blocks that render, snippets that Shopify skipped because their
 *   app was uninstalled, app script tags, and other third-party scripts.
 * - Templates: which template each public page uses, matched by its section keys.
 * - Countries: what a product page shows for each market.
 */
import {spawn} from 'node:child_process';
import {randomUUID} from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {setTimeout as sleep} from 'node:timers/promises';

import {loadThemeJson} from './themejson.mjs';
import {decodeText, getOrAdd, readText, walk} from './triage.mjs';

const AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15';
const GENERIC = new Set(['app', 'apps', 'the', 'shopify', 'and', 'for', 'block', 'blocks', 'embed', 'widget', 'version',
  'page', 'product', 'products', 'preview', 'core', 'form', 'data', 'config', 'init', 'run', 'scripts', 'main', 'global',
  'application', 'average', 'rating', 'reviews', 'review', 'snippet', 'production', 'min']);

/** The path of an executable on PATH, or null. */
function which(name) {
  const extensions = process.platform === 'win32' ? (process.env.PATHEXT || '.EXE').split(';') : [''];
  for (const folder of (process.env.PATH || '').split(path.delimiter).filter(Boolean)) {
    for (const extension of extensions) {
      const candidate = path.join(folder, name + extension);
      try {
        fs.accessSync(candidate, fs.constants.X_OK);
        if (fs.statSync(candidate).isFile()) return candidate;
      } catch {
        // Not here
      }
    }
  }
  return null;
}

/** The cookies that responses set, for the fetch fallback. Enough for the storefront password. */
class CookieJar {
  constructor(cookies = []) {
    this.cookies = cookies;
  }

  copy() {
    return new CookieJar(this.cookies.map((cookie) => ({...cookie})));
  }

  store(url, headers) {
    const {hostname, pathname} = new URL(url);
    for (const header of headers) {
      const [pair, ...attributes] = header.split(';');
      if (!pair.includes('=')) continue;
      const cookie = {
        name: pair.slice(0, pair.indexOf('=')).trim(),
        value: pair.slice(pair.indexOf('=') + 1).trim(),
        domain: hostname,
        hostOnly: true,
        path: pathname.slice(0, pathname.lastIndexOf('/')) || '/',
        secure: false,
        expires: Infinity,
      };
      let maxAge = null;
      for (const attribute of attributes) {
        const at = attribute.indexOf('=');
        const key = (at < 0 ? attribute : attribute.slice(0, at)).trim().toLowerCase();
        const value = at < 0 ? '' : attribute.slice(at + 1).trim();
        if (key === 'domain' && value) Object.assign(cookie, {domain: value.replace(/^\./, '').toLowerCase(), hostOnly: false});
        else if (key === 'path' && value.startsWith('/')) cookie.path = value;
        else if (key === 'max-age' && /^-?\d+$/.test(value)) maxAge = Number(value);
        else if (key === 'expires' && !Number.isNaN(Date.parse(value))) cookie.expires = Date.parse(value);
        else if (key === 'secure') cookie.secure = true;
      }
      // Max-Age wins over Expires
      if (maxAge !== null) cookie.expires = Date.now() + maxAge * 1000;
      // A cookie for another domain does not count
      if (!cookie.hostOnly && !this.domainMatch(hostname, cookie)) continue;
      this.cookies = this.cookies.filter((old) => !(old.name === cookie.name && old.domain === cookie.domain && old.path === cookie.path));
      // An expired cookie only removes the old one
      if (cookie.expires > Date.now()) this.cookies.push(cookie);
    }
  }

  domainMatch(hostname, cookie) {
    return hostname === cookie.domain || (!cookie.hostOnly && hostname.endsWith(`.${cookie.domain}`));
  }

  header(url) {
    const {protocol, hostname, pathname} = new URL(url);
    const now = Date.now();
    return this.cookies
      .filter((cookie) => cookie.expires > now && this.domainMatch(hostname, cookie) && (!cookie.secure || protocol === 'https:'))
      .filter((cookie) => pathname === cookie.path || pathname.startsWith(cookie.path.endsWith('/') ? cookie.path : `${cookie.path}/`))
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join('; ');
  }
}

// Shopify's bot protection accepts curl and can refuse other HTTP clients, so curl makes the requests when it is
// installed. Only the password form writes the cookies. Page reads only send them, so parallel reads cannot corrupt
// the file, and one page's country cookie cannot change another page.
const CURL = which('curl');
const FOLDER = fs.mkdtempSync(path.join(os.tmpdir(), 'splice-'));
const COOKIES = path.join(FOLDER, 'cookies.txt');
const JAR = new CookieJar();

/** The storefront asks for its password. */
export class Locked extends Error {}

export class HttpError extends Error {
  constructor(url, code, retryAfter = '') {
    super(`HTTP Error ${code} for ${url}`);
    this.code = code;
    this.retryAfter = retryAfter;
  }
}

/** Run a command to its end, with `input` on standard input. */
function run(command, args, input) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args);
    const stdout = [];
    const stderr = [];
    child.stdout.on('data', (chunk) => stdout.push(chunk));
    child.stderr.on('data', (chunk) => stderr.push(chunk));
    child.on('error', reject);
    child.on('close', (status) => resolve({status, stdout: Buffer.concat(stdout), stderr: Buffer.concat(stderr)}));
    // curl can exit before it reads the form, for example when it cannot connect
    child.stdin.on('error', () => {});
    child.stdin.end(input ?? undefined);
  });
}

const text = (bytes) => decodeText(bytes).replace(/\r\n?/g, '\n');

async function curlRequest(url, form) {
  const heads = path.join(FOLDER, `${randomUUID()}.headers`);
  fs.writeFileSync(heads, '');
  const command = ['-sSL', '--max-time', '30', '-A', AGENT, '-b', COOKIES, '-D', heads, '-w', '\n%{url_effective}\n%{http_code}'];
  // The form goes in on standard input, so a password never shows in the process list
  if (form) command.push('-c', COOKIES, '--data-binary', '@-');
  let result;
  let retry;
  try {
    result = await run(CURL, [...command, url], form ? new URLSearchParams(form).toString() : null);
    retry = [...readText(heads).matchAll(/^retry-after:\s*(\S+)/gim)].map((match) => match[1]);
  } finally {
    fs.rmSync(heads, {force: true});
  }
  if (result.status !== 0) throw new HttpError(url, `curl exit ${result.status}: ${text(result.stderr).trim()}`);
  const [, body, final, code] = /^([^]*)\n([^\n]*)\n([^\n]*)$/.exec(text(result.stdout));
  if (Number(code) >= 400) throw new HttpError(url, Number(code), retry.at(-1) ?? '');
  return [final, body];
}

/** A page read gets a copy of the jar, so only the password form keeps the cookies it gets. */
async function fetchRequest(url, form) {
  const jar = form ? JAR : JAR.copy();
  let address = url;
  let body = form ? new URLSearchParams(form) : null;
  for (let redirects = 0; ; redirects++) {
    const cookie = jar.header(address);
    const response = await fetch(address, {
      method: body ? 'POST' : 'GET',
      body,
      headers: {'User-Agent': AGENT, ...(cookie && {Cookie: cookie})},
      redirect: 'manual',
      signal: AbortSignal.timeout(30_000),
    }).catch((error) => {
      // fetch says only "fetch failed" and keeps the reason in its cause
      throw new Error(error.cause?.message ?? error.message);
    });
    jar.store(address, response.headers.getSetCookie());
    const location = response.headers.get('location');
    if (response.status >= 200 && response.status < 300) return [address, decodeText(Buffer.from(await response.arrayBuffer()))];
    // An unread body holds its connection open
    await response.body?.cancel();
    if ([301, 302, 303, 307, 308].includes(response.status) && location && redirects < 10) {
      // A form that gets a 307 or 308 stops there, since it would post the password again
      if (body && response.status >= 307) throw new HttpError(url, response.status);
      address = new URL(location, address).href;
      body = null;
      continue;
    }
    throw new HttpError(url, response.status, response.headers.get('retry-after') ?? '');
  }
}

/** The final URL and the body. Throw HttpError for a status of 400 or more. */
function request(url, form = null) {
  return CURL ? curlRequest(url, form) : fetchRequest(url, form);
}

/** Seconds the whole audit may spend waiting on 429s, so a rate-limited store never hangs it */
export const WAIT = {left: Number(process.env.STOREFRONT_WAIT_SECONDS ?? 120) * 1000};

/** Shopify answers 429 when a client reads too fast, so wait as it asks, at most 30 s, and try again. */
export async function fetchPage(url, tries = 5) {
  for (let attempt = 0; ; attempt++) {
    try {
      return await request(url);
    } catch (error) {
      if (!(error instanceof HttpError) || error.code !== 429 || attempt === tries - 1) throw error;
      const wait = error.retryAfter;
      const ms = 1000 * (/^\d+$/.test(wait.replace('.', '')) ? Number(wait) : 2 ** attempt);
      // A wait longer than 30 s or the budget left means the page stays unread
      if (ms > 30_000 || ms > WAIT.left) throw error;
      WAIT.left -= ms;
      await sleep(ms);
    }
  }
}

/** The netloc and path of a URL as written, since new URL would percent-encode the path. */
function urlParts(url) {
  const [, netloc = '', address = ''] = /^(?:[A-Za-z][A-Za-z0-9+.-]*:)?(?:\/\/([^/?#]*))?([^?#]*)/.exec(url);
  return {netloc, path: address};
}

const isPasswordPage = (url) => urlParts(url).path.replace(/\/+$/, '').endsWith('/password');

async function isLocked(base) {
  const [final] = await fetchPage(`${base}/`);
  return isPasswordPage(final);
}

/** Submit the storefront password form, as a browser does. Throw Locked when the store still refuses. */
async function unlock(base, password) {
  await request(`${base}/password`, {form_type: 'storefront_password', utf8: '✓', password});
  if (await isLocked(base)) throw new Locked('the storefront refused the password');
}

async function fetchMany(urls) {
  const one = async (url) => {
    let final;
    let page;
    try {
      [final, page] = await fetchPage(url);
    } catch (error) {
      return [url, null, `ERROR ${error.message}`];
    }
    // A lost or refused unlock sends a page to the password screen, which holds no evidence
    if (isPasswordPage(final)) return [url, null, 'ERROR the store redirected to its password page'];
    return [url, final, page];
  };
  // Four reads at a time, with the results in the order of the URLs
  const results = [];
  let next = 0;
  const worker = async () => {
    while (next < urls.length) {
      const index = next++;
      results[index] = await one(urls[index]);
    }
  };
  await Promise.all([1, 2, 3, 4].map(worker));
  return results;
}

function words(name) {
  const found = name.toLowerCase().split(/[-_. ]+/).filter((word) => word.length > 2 && !/^[0-9a-f]+$/.test(word));
  return new Set(found.filter((word) => !GENERIC.has(word)));
}

/** Extension folders whose name shares a word with the handle. Then folders whose files share a word with a block name. */
export function matchingExtensions(handle, extensions, blocks) {
  const compact = handle.toLowerCase().replace(/[^a-z]/g, '');
  const handleWords = words(handle);
  let found = [...extensions.keys()].filter((folder) => [...words(folder)].some((word) => handleWords.has(word) || compact.includes(word)));
  if (!found.length) {
    const blockWords = new Set(blocks.flatMap((block) => [...words(block)]));
    found = [...extensions]
      .filter(([, assets]) => assets.some((asset) => [...words(asset)].some((word) => blockWords.has(word))))
      .map(([folder]) => folder);
  }
  return found.sort();
}

/** Public page URLs from sitemap.xml, spread across products, pages, collections, and blogs. */
async function sitemapUrls(base, limit) {
  const locations = (xml) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  const [, index] = await fetchPage(`${base}/sitemap.xml`);
  const perChild = new Map();
  for (const child of locations(index)) {
    let xml;
    try {
      [, xml] = await fetchPage(child.replaceAll('&amp;', '&'));
    } catch {
      continue;
    }
    const kind = child.slice(child.lastIndexOf('/') + 1).replace(/sitemap_|_\d+|\.xml.*/g, '');
    getOrAdd(perChild, kind, () => []).push(...locations(xml).filter((url) => !url.includes('/cdn/')));
  }
  const urls = [`${base}/`];
  while (urls.length < limit && [...perChild.values()].some((list) => list.length)) {
    for (const list of perChild.values()) {
      if (list.length) urls.push(list.shift());
    }
  }
  return urls.slice(0, limit);
}

/** Each JSON template's section keys, which a rendered page repeats in its section IDs. */
function templateKeys(changed) {
  const keys = new Map();
  for (const file of walk(path.join(changed, 'templates'))) {
    if (!file.endsWith('.json')) continue;
    let data;
    try {
      data = loadThemeJson(fs.readFileSync(file));
    } catch {
      continue;
    }
    if (typeof data !== 'object' || data === null || Array.isArray(data)) continue;
    keys.set(path.relative(changed, file), new Set(Object.keys(data.sections ?? {})));
  }
  return keys;
}

/** The template whose section keys best explain the page. Shared keys such as main count for little. */
function matchTemplate(pageKeys, keys) {
  let best = null;
  let bestScore = 0;
  for (const [template, templateSet] of keys) {
    if (!templateSet.size) continue;
    let score = 0;
    for (const key of pageKeys) {
      if (templateSet.has(key)) score += key.length > 12 ? 1 : 0.2;
    }
    score /= templateSet.size;
    if (score > bestScore) [best, bestScore] = [template, score];
  }
  return bestScore >= 0.3 ? best : null;
}

function readPages(base, pathsOrUrls) {
  return fetchMany(pathsOrUrls.map((item) => (item.startsWith('http') ? item : base + item)));
}

const sortedValues = (map) => new Map([...map].map(([key, values]) => [key, [...values].sort()]));

function appsAndTemplates(base, changed, pages) {
  const rendered = new Map();
  const extensions = new Map();
  const uninstalled = new Set();
  const scriptTags = new Set();
  const hosts = new Map();
  const used = new Map();
  const keys = changed ? templateKeys(changed) : new Map();
  const failed = [];
  const {netloc} = urlParts(base);
  for (const [url, final, page] of pages) {
    if (final === null) {
      failed.push(`${url}: ${page}`);
      continue;
    }
    const address = urlParts(url).path || '/';
    for (const [, app] of page.matchAll(/BEGIN app block: shopify:\/\/apps\/([^/]+)\/blocks\//g)) {
      getOrAdd(rendered, app, () => new Set()).add(address);
    }
    for (const [, folder, asset] of page.matchAll(/cdn\.shopify\.com\/extensions\/[0-9a-f-]+\/([^/"']+)\/assets\/([^"'?]+)/g)) {
      getOrAdd(extensions, folder, () => new Set()).add(asset);
    }
    for (const [, snippet] of page.matchAll(/"([^"]+)" was not rendered, the associated app was uninstalled/g)) uninstalled.add(snippet);
    const found = /var urls = (\[.*?\]);/.exec(page);
    if (found) JSON.parse(found[1].replaceAll('\\/', '/')).forEach((tag) => scriptTags.add(tag));
    for (const [, host] of page.matchAll(/<script[^>]+src="https?:\/\/([^/"]+)/g)) {
      if (!host.includes('cdn.shopify.com') && !host.includes(netloc)) getOrAdd(hosts, host, () => new Set()).add(address);
    }
    const pageKeys = new Set([...page.matchAll(/id="shopify-section-template--\d+__([^"]+)"/g)].map((match) => match[1]));
    const template = pageKeys.size ? matchTemplate(pageKeys, keys) : null;
    if (template) getOrAdd(used, template, () => []).push(address);
  }
  return {
    rendered: sortedValues(rendered),
    extensions: sortedValues(extensions),
    uninstalled: [...uninstalled].sort(),
    scriptTags: [...scriptTags].sort(),
    hosts: sortedValues(hosts),
    templatesUsed: sortedValues(used),
    templatesUnseen: [...keys.keys()].filter((template) => !used.has(template)).sort(),
    failed,
  };
}

/** Each market's address with its countries, from the home page's hreflang links. */
function markets(home) {
  const found = new Map();
  for (const [, country, href] of home.matchAll(/hreflang="[a-z]{2}-([A-Z]{2})" href="([^"]+)"/g)) {
    // fr-ca and en-ca are one market
    const market = href.replace(/\/+$/, '').replace(/\/[a-z]{2}-/g, '/xx-');
    getOrAdd(found, market, () => new Set()).add(country);
  }
  return sortedValues(found);
}

/** What the product page shows in each market. Only server-rendered output: scripts can change it after load. */
async function countriesView(base, handle, countries) {
  let variants;
  try {
    const [, product] = await fetchPage(`${base}/products/${handle}.js`);
    variants = new Map(JSON.parse(product).variants.map((variant) => [String(variant.id), variant]));
  } catch {
    variants = new Map();
  }
  // An empty country reads the store's default market
  const pages = await fetchMany(countries.map((country) => `${base}/products/${handle}${country ? `?country=${country}` : ''}`));
  return pages.map(([, final, page], index) => {
    const country = countries[index];
    if (final === null) return {country, error: page};
    const seen = /Shopify\.country = "([A-Z]+)"/.exec(page);
    const currency = /Shopify\.currency = \{"active":"([A-Z]+)"/.exec(page);
    const chosen = /name="id"[^>]*value="(\d+)"|value="(\d+)"[^>]*name="id"/.exec(page);
    const variantId = chosen ? (chosen[1] ?? chosen[2]) : null;
    const variant = variants.get(variantId || '') ?? {};
    return {
      country: country || 'default',
      shownAs: seen ? seen[1] : '?',
      currency: currency ? currency[1] : '?',
      url: final,
      variant: 'title' in variant ? variant.title : variantId || '?',
      available: variant.available,
    };
  });
}

/**
 * A product with more than one variant from the pages read, so the market check has variants to tell apart.
 * products.json is avoided, since Shopify rate-limits it hard.
 */
async function firstProductWithOptions(base, paths) {
  const marker = '/products/';
  const handles = paths.filter((page) => page.includes(marker)).map((page) => page.slice(page.indexOf(marker) + marker.length).split('/')[0]);
  for (const handle of [...new Set(handles)].slice(0, 10)) {
    const [, product] = await fetchPage(`${base}/products/${handle}.js`);
    if ((JSON.parse(product).variants ?? []).length > 1) return handle;
  }
  return handles.length ? handles[0] : null;
}

/** Throw Locked when the storefront has a password and none was given, or the given one fails. */
export async function storefront(base, changed, extraPaths = [], {pageLimit = 60, product = null, countries = null, password = null} = {}) {
  base = base.replace(/\/+$/, '');
  if (await isLocked(base)) {
    if (!password) throw new Locked('the storefront has a password');
    await unlock(base, password);
  }
  const urls = await sitemapUrls(base, pageLimit);
  urls.push(...extraPaths.filter((extra) => !urls.includes(base + extra)).map((extra) => base + extra));
  urls.push(`${base}/cart`);
  const pages = await readPages(base, urls);
  const evidence = appsAndTemplates(base, changed, pages);
  const home = pages.find(([url, final]) => final && ['', '/'].includes(urlParts(url).path))?.[2] ?? '';
  try {
    const read = pages.filter(([, final]) => final).map(([url]) => urlParts(url).path);
    product = product || (await firstProductWithOptions(base, read));
  } catch (error) {
    product = null;
    evidence.failed.push(`Finding a product failed: ${error.message}, so the market check did not run. Pass --product <handle>.`);
  }
  const found = markets(home);
  countries = countries?.length ? countries : ['', ...[...new Set([...found.values()].flat())].sort().slice(0, 120)];
  evidence.pagesRead = pages.length;
  evidence.product = product;
  evidence.markets = found;
  evidence.countries = product ? await countriesView(base, product, countries) : [];
  return evidence;
}
