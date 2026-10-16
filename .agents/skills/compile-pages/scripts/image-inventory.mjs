#!/usr/bin/env node
import { spawn, spawnSync } from 'node:child_process';
import { createHash, randomUUID } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const USAGE = 'usage: image-inventory.mjs [-h] --site SITE [--store STORE] --out OUT [--pages [PAGES ...]] [--page-limit PAGE_LIMIT] [--products PRODUCTS] [--sheet-count SHEET_COUNT]';

const HELP = `${USAGE}

List a store's images with where the live site uses them, then draw numbered contact sheets to tag by eye.

Reads the public storefront, and the Admin API when --store is given (read_products and read_files). Writes:

  <out>/images.json    one record per image: size, shape, alt, owners, live use, score, shop_images reference
  <out>/images.md      the same as a table, best candidates first
  <out>/roles.json     a blank role sheet for the agent to fill after looking at the contact sheets
  <out>/thumbs/        small copies from Shopify's CDN, numbered like images.md
  <out>/sheet-*.png    numbered contact sheets, when ImageMagick is installed

Options:

  -h, --help            show this help and exit
  --site SITE           public storefront URL, such as https://example.com
  --store STORE         the .myshopify.com domain, to add Admin product media and Files
  --out OUT             the folder to write
  --pages [PAGES ...]   more paths to read for live use
  --page-limit N        pages linked from the homepage to read (default 15)
  --products N          most Admin products to read (default 250)
  --sheet-count N       images to put on contact sheets (default 80)

Needs curl. Admin reads use Shopify CLI, read-only.

Example:

  STOREFRONT_PASSWORD=... node .agents/skills/compile-pages/scripts/image-inventory.mjs \\
    --site https://example.com --store example.myshopify.com --out /tmp/example-images
`;

const CDN = /(?:https?:)?\/\/[^\s"'()<>,]+?\/(?:cdn\/shop|s\/files)\/[^\s"'()<>,]+?\.(?:jpe?g|png|webp|gif|avif)(?:\?[^\s"'()<>,]*)?/gi;
const SIZE = /_(?:\d+x\d*|x\d+|\{width\}x|pico|icon|thumb|small|compact|medium|large|grande|original|master)(?:_crop_[a-z]+)?(?:@\d+x)?(?=\.)/gi;
const SECTION = /id="shopify-section-([^"]+)"/g;

const PRODUCT_MEDIA = `query($cursor: String) { products(first: 50, after: $cursor, query: "status:active") {
  nodes { handle title productType media(first: 20) { nodes { ... on MediaImage { alt image { url width height } } } } }
  pageInfo { hasNextPage endCursor } } }`;
const FILES = `query($cursor: String) { files(first: 100, after: $cursor, query: "media_type:IMAGE") {
  nodes { ... on MediaImage { alt image { url width height } } }
  pageInfo { hasNextPage endCursor } } }`;
const FILES_BY_NAME = `query($q: String) { files(first: 50, query: $q) {
  nodes { ... on MediaImage { alt image { url width height } } } } }`;
const COLLECTIONS = '{ collections(first: 100) { nodes { handle title image { url width height altText } } } }';

const AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15';
const SCOPES = 'read_products,read_content,read_online_store_pages,read_markets';

/** The path as the URL writes it. new URL() would percent-encode it and resolve dot segments. */
function urlPath(url) {
  let rest = url.replace(/^[A-Za-z0-9+.-]+:/, '');
  if (rest.startsWith('//')) rest = rest.slice(2).replace(/^[^/?#]*/, '');
  rest = rest.split('#')[0].split('?')[0];
  const params = rest.indexOf(';', rest.lastIndexOf('/'));
  return params < 0 ? rest : rest.slice(0, params);
}

/** Percent-decoding that keeps a malformed escape as written, where decodeURIComponent throws. */
function unquote(text) {
  return text.replace(/(?:%[0-9A-Fa-f]{2})+/g, run => new TextDecoder().decode(Buffer.from(run.replaceAll('%', ''), 'hex')));
}

/** The file name without Shopify's size suffix or query, which is the same for every size of one image. */
export function keyOf(url) {
  const name = unquote(urlPath(url.split('?')[0]).split('/').at(-1));
  return name.replace(SIZE, '').toLowerCase();
}

/** Width and height from a PNG, GIF, JPEG, or WebP header, so no image library is needed. */
export function pixelSize(file) {
  let data;
  try {
    data = fs.readFileSync(file).subarray(0, 65536);
  } catch {
    return null;
  }
  const is = (start, bytes) => data.subarray(start, start + bytes.length).equals(Buffer.from(bytes, 'latin1'));
  const int = (start, end, order = 'big') => {
    const bytes = [...data.subarray(start, end)];
    if (order === 'little') bytes.reverse();
    return bytes.reduce((value, byte) => value * 256 + byte, 0);
  };
  if (is(0, '\x89PNG\r\n\x1a\n')) return [int(16, 20), int(20, 24)];
  if (is(0, 'GIF87a') || is(0, 'GIF89a')) return [int(6, 8, 'little'), int(8, 10, 'little')];
  if (is(0, 'RIFF') && is(8, 'WEBP')) {
    if (is(12, 'VP8X')) return [1 + int(24, 27, 'little'), 1 + int(27, 30, 'little')];
    if (is(12, 'VP8 ')) return [int(26, 28, 'little') & 0x3fff, int(28, 30, 'little') & 0x3fff];
    if (is(12, 'VP8L')) {
      const bits = int(21, 25, 'little');
      return [(bits & 0x3fff) + 1, ((bits >>> 14) & 0x3fff) + 1];
    }
  }
  if (is(0, '\xff\xd8')) {
    const frames = [0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf];
    let i = 2;
    while (i + 9 < data.length) {
      if (data[i] !== 0xff) {
        i += 1;
        continue;
      }
      if (frames.includes(data[i + 1])) return [int(i + 7, i + 9), int(i + 5, i + 7)];
      i += 2 + int(i + 2, i + 4);
    }
  }
  return null;
}

/** The original image's address: `hero_180x.jpg?v=1` becomes `hero.jpg`, so a resize asks for the full file. */
export function fullSize(url) {
  const bare = url.split('?')[0];
  const cut = bare.lastIndexOf('/');
  return `${bare.slice(0, cut)}/${bare.slice(cut + 1).replace(SIZE, '')}`;
}

export function shape(width, height) {
  if (!width || !height) return 'unknown';
  const ratio = width / height;
  for (const [limit, label] of [[0.7, 'tall'], [0.95, 'portrait'], [1.05, 'square'], [1.6, 'landscape'], [2.4, 'wide']]) {
    if (ratio < limit) return label;
  }
  return 'banner';
}

const unique = items => [...new Set(items)];

/** Home, any pages asked for, then the collection, product, and content pages the homepage links to. */
export function pagesToRead(base, home, extra, limit) {
  const out = [`${base}/`];
  for (const page of extra) out.push(page.startsWith('http') ? page : `${base}/${page.replace(/^\/+/, '')}`);
  const links = unique([...home.matchAll(/href="(\/(?:collections|products|pages)\/[^"#?]+)"/g)].map(match => match[1]));
  // Story pages hold the founder and team photos, and they are often linked only from the footer
  const later = href => Number(!/about|story|team|mission|founder/.test(href));
  links.sort((a, b) => later(a) - later(b));
  for (const href of links.slice(0, limit)) out.push(base + href);
  return unique(out);
}

// HTML has 2231 named references. These are the ones that end a URL or are common in storefront copy.
// Other names stay as written.
const NAMED = {
  amp: '&', AMP: '&', lt: '<', LT: '<', gt: '>', GT: '>', quot: '"', QUOT: '"', apos: "'", lpar: '(', rpar: ')', comma: ',',
  Tab: '\t', NewLine: '\n', nbsp: '\u00a0', copy: '©', COPY: '©', reg: '®', REG: '®', trade: '™', hellip: '…', ndash: '–',
  mdash: '—', lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”', laquo: '«', raquo: '»', bull: '•', middot: '·', times: '×',
  deg: '°', euro: '€', pound: '£', cent: '¢', yen: '¥', sect: '§', para: '¶', shy: '\u00ad',
};
// HTML still reads these without the semicolon, such as `&amp` in a query string
const LEGACY = ['amp', 'AMP', 'lt', 'LT', 'gt', 'GT', 'quot', 'QUOT', 'nbsp', 'copy', 'COPY', 'reg', 'REG', 'laquo', 'raquo', 'middot',
  'times', 'deg', 'pound', 'cent', 'yen', 'sect', 'para', 'shy'];
const ENTITIES = new Map([...Object.entries(NAMED).map(([name, text]) => [`${name};`, text]), ...LEGACY.map(name => [name, NAMED[name]])]);
// Numeric references 0x80 to 0x9f mean the Windows-1252 characters
const WINDOWS_1252 = '€\x81‚ƒ„…†‡ˆ‰Š‹Œ\x8dŽ\x8f\x90‘’“”•–—˜™š›œ\x9džŸ';

function character(number) {
  if (number === 0) return '\ufffd';
  if (number === 0x0d) return '\r';
  if (number >= 0x80 && number <= 0x9f) return WINDOWS_1252[number - 0x80];
  if ((number >= 0xd800 && number <= 0xdfff) || number > 0x10ffff) return '\ufffd';
  const dropped = (number >= 0x1 && number <= 0x8) || number === 0xb || (number >= 0xe && number <= 0x1f) || number === 0x7f ||
    (number >= 0xfdd0 && number <= 0xfdef) || (number & 0xfffe) === 0xfffe;
  return dropped ? '' : String.fromCodePoint(number);
}

export function unescapeHtml(text) {
  if (!text.includes('&')) return text;
  return text.replace(/&(#[0-9]+;?|#[xX][0-9a-fA-F]+;?|[^\t\n\f <&#;]{1,32};?)/g, (match, name) => {
    if (name[0] === '#') {
      const hex = 'xX'.includes(name[1]);
      return character(parseInt(name.slice(hex ? 2 : 1).replace(/;$/, ''), hex ? 16 : 10));
    }
    if (ENTITIES.has(name)) return ENTITIES.get(name);
    for (let x = name.length - 1; x > 1; x -= 1) {
      if (ENTITIES.has(name.slice(0, x))) return ENTITIES.get(name.slice(0, x)) + name.slice(x);
    }
    return match;
  });
}

function which(name) {
  for (const folder of (process.env.PATH ?? '').split(path.delimiter)) {
    const candidate = path.join(folder, name);
    try {
      fs.accessSync(candidate, fs.constants.X_OK);
      if (fs.statSync(candidate).isFile()) return candidate;
    } catch {}
  }
  return null;
}

function run(command, args, { input = null, capture = true } = {}) {
  return new Promise((resolve, reject) => {
    const output = capture ? 'pipe' : 'inherit';
    const child = spawn(command, args, { stdio: [input === null ? 'ignore' : 'pipe', output, output] });
    const stdout = [];
    const stderr = [];
    child.stdout?.on('data', chunk => stdout.push(chunk));
    child.stderr?.on('data', chunk => stderr.push(chunk));
    child.on('error', reject);
    child.on('close', status => resolve({ status, stdout: Buffer.concat(stdout).toString(), stderr: Buffer.concat(stderr).toString() }));
    child.stdin?.end(input);
  });
}

/** Run `work` on every item, at most `size` at a time, and keep the results in item order. */
async function pool(items, size, work) {
  const results = new Array(items.length);
  let next = 0;
  const worker = async () => {
    while (next < items.length) {
      const index = next++;
      results[index] = await work(items[index]);
    }
  };
  await Promise.all(Array.from({ length: Math.min(size, items.length) }, worker));
  return results;
}

class HttpError extends Error {
  constructor(url, code, retryAfter = '') {
    super(`HTTP Error ${code} for ${url}`);
    this.code = code;
    this.retryAfter = retryAfter;
  }
}

// Shopify's bot protection refuses some HTTP clients but accepts curl. Only the password form writes the cookies.
// Page reads only send them, so parallel reads cannot corrupt the file.
let cookieFolder;
function cookies() {
  if (!cookieFolder) {
    cookieFolder = fs.mkdtempSync(path.join(os.tmpdir(), 'image-inventory-'));
    // The folder holds the storefront session
    process.on('exit', () => fs.rmSync(cookieFolder, { recursive: true, force: true }));
  }
  return path.join(cookieFolder, 'cookies.txt');
}

/** The final URL and the body. Throw HttpError for a status of 400 or more. */
async function request(url, form = null) {
  const heads = path.join(path.dirname(cookies()), `${randomUUID()}.headers`);
  const args = ['-sSL', '--max-time', '30', '-A', AGENT, '-b', cookies(), '-D', heads, '-w', '\n%{url_effective}\n%{http_code}'];
  // The form goes in on standard input, so a password never shows in the process list
  if (form) args.push('-c', cookies(), '--data-binary', '@-');
  const result = await run('curl', [...args, url], { input: form ? new URLSearchParams(form).toString() : null });
  let headers = '';
  try {
    headers = fs.readFileSync(heads, 'utf8');
    fs.rmSync(heads);
  } catch {}
  const retry = [...headers.matchAll(/^retry-after:\s*(\S+)/gim)].map(match => match[1]);
  if (result.status !== 0) throw new HttpError(url, `curl exit ${result.status}: ${result.stderr.trim()}`);
  const lines = result.stdout.split('\n');
  const code = Number(lines.pop());
  const final = lines.pop();
  if (code >= 400) throw new HttpError(url, code, retry.at(-1) ?? '');
  return [final, lines.join('\n')];
}

/** Shopify answers 429 when a client reads too fast, so wait as it asks and try again. */
async function fetchPage(url, tries = 5) {
  for (let attempt = 0; ; attempt += 1) {
    try {
      return await request(url);
    } catch (error) {
      if (!(error instanceof HttpError) || error.code !== 429 || attempt === tries - 1) throw error;
      const wait = error.retryAfter;
      const seconds = /^(\d+\.?\d*|\.\d+)$/.test(wait) ? Number(wait) : 2 ** attempt;
      await new Promise(resolve => setTimeout(resolve, seconds * 1000));
    }
  }
}

const isPassword = url => urlPath(url).replace(/\/+$/, '').endsWith('/password');

async function isLocked(base) {
  const [final] = await fetchPage(`${base}/`);
  return isPassword(final);
}

/** Submit the storefront password form, as a browser does. Throw when the store still refuses. */
async function unlock(base, password) {
  await request(`${base}/password`, { form_type: 'storefront_password', utf8: '✓', password });
  if (await isLocked(base)) throw new Error('the storefront refused the password');
}

function fetchMany(urls) {
  return pool(urls, 4, async url => {
    let final, page;
    try {
      [final, page] = await fetchPage(url);
    } catch (error) {
      return [url, null, `ERROR ${error.message}`];
    }
    // A lost or refused unlock sends a page to the password screen, which holds no evidence
    if (isPassword(final)) return [url, null, 'ERROR the store redirected to its password page'];
    return [url, final, page];
  });
}

async function liveUse(base, extra, limit) {
  const [, home] = await fetchPage(`${base}/`);
  const urls = pagesToRead(base, home, extra, limit);
  const found = new Map();
  for (const [url, final, page] of await fetchMany(urls)) {
    if (final === null) {
      console.error(`skip ${url}: ${page}`);
      continue;
    }
    const pagePath = urlPath(url) || '/';
    // Section and image offsets must come from the same text
    const text = unescapeHtml(page);
    const sections = [...text.matchAll(SECTION)].map(match => [match.index, match[1]]);
    let rank = 0;
    for (const match of text.matchAll(CDN)) {
      const image = match[0];
      const key = keyOf(image);
      if (!found.has(key)) found.set(key, { pages: new Set(), count: 0, home_rank: null, sections: new Set(), url: '' });
      const record = found.get(key);
      record.count += 1;
      record.pages.add(pagePath);
      record.url ||= fullSize(image.startsWith('//') ? `https:${image}` : image);
      const owner = sections.filter(([start]) => start < match.index);
      if (owner.length) record.sections.add(`${pagePath} ${owner.at(-1)[1].split('__').at(-1)}`);
      if (pagePath === '/' && record.home_rank === null) {
        rank += 1;
        record.home_rank = rank;
      }
    }
  }
  return [found, urls];
}

/** Shopify CLI could not run the query, for example before `shopify store auth`. */
class AdminError extends Error {}

/** The nearest installed Shopify CLI above the current folder, so the version matches the project or the monorepo. Then the one on PATH. */
function shopifyCommand() {
  let folder = process.cwd();
  while (true) {
    const local = path.join(folder, 'node_modules', '.bin', 'shopify');
    if (fs.existsSync(local)) return local;
    if (path.dirname(folder) === folder) break;
    folder = path.dirname(folder);
  }
  if (which('shopify')) return 'shopify';
  throw new AdminError('Shopify CLI is not installed here. Run pnpm install in the project.');
}

function execute(store, query, variables = null) {
  const args = ['store', 'execute', '--store', store, '--query', query, '--json'];
  if (variables) args.push('--variables', JSON.stringify(variables));
  const result = spawnSync(shopifyCommand(), args, { encoding: 'utf8', timeout: 120_000, maxBuffer: 2 ** 28 });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    const message = (result.stderr || result.stdout).trim().split(/\r?\n/);
    throw new AdminError(`${message.slice(-3).join(' ')}\nSign in first, with approval: shopify store auth --store ${store} --scopes ${SCOPES}`);
  }
  const data = JSON.parse(result.stdout);
  return Object.hasOwn(data, 'data') ? data.data : data;
}

function paged(store, query, field, cap) {
  const out = [];
  let cursor = null;
  while (out.length < cap) {
    const data = execute(store, query, cursor ? { cursor } : null);
    out.push(...data[field].nodes);
    const info = data[field].pageInfo;
    if (!info.hasNextPage) break;
    cursor = info.endCursor;
  }
  return out;
}

function adminMedia(store, cap, liveNames) {
  const found = new Map();
  const add = (image, alt, owner = null, inFiles = false) => {
    if (!image?.url) return;
    const key = keyOf(image.url);
    if (!found.has(key)) found.set(key, { owners: new Set(), in_files: false });
    const record = found.get(key);
    Object.assign(record, { url: image.url, width: image.width ?? null, height: image.height ?? null });
    record.alt = record.alt || alt || '';
    record.in_files = record.in_files || inFiles;
    if (owner) record.owners.add(owner);
  };

  for (const product of paged(store, PRODUCT_MEDIA, 'products', cap)) {
    for (const media of product.media.nodes) add(media.image, media.alt, `product:${product.handle}`);
  }
  for (const file of paged(store, FILES, 'files', cap)) add(file.image, file.alt, null, true);
  // A store can hold thousands of files, so look up each image the live site shows by its file name
  const missing = [...liveNames].filter(name => !found.get(name)?.in_files).sort();
  for (let index = 0; index < missing.length; index += 20) {
    const names = missing.slice(index, index + 20);
    const query = names.map(name => `filename:${name.includes('.') ? name.slice(0, name.lastIndexOf('.')) : name}`).join(' OR ');
    for (const file of execute(store, FILES_BY_NAME, { q: query }).files.nodes) {
      if (file.image && names.includes(keyOf(file.image.url))) add(file.image, file.alt, null, true);
    }
  }
  for (const collection of execute(store, COLLECTIONS).collections.nodes) {
    add(collection.image, collection.image?.altText, `collection:${collection.handle}`);
  }
  return found;
}

/** Live use first: an image the merchant shows on the homepage is one they chose. Then size, then catalog use. */
export function score(record) {
  const live = record.live;
  let value = 0;
  if (live.home_rank) value += 40 + Math.max(0, 20 - live.home_rank);
  value += 6 * Math.min(live.pages.length, 5) + Math.min(live.count, 10);
  const width = record.width || record.thumb_width || 0;
  // A thumbnail narrower than the 400px asked for means the original is that small: an icon or a logo
  if (!record.width && (record.thumb_width ?? 400) < 400) value -= 100;
  value += width >= 2000 ? 15 : width >= 1200 ? 8 : width >= 600 ? 0 : -10;
  value += 3 * Math.min(record.owners.length, 3);
  return value;
}

/** Give each record its shape and score, then put the best candidates first. */
export function rank(records) {
  for (const record of records) {
    record.shape = shape(record.width || record.thumb_width, record.height || record.thumb_height);
    record.score = score(record);
  }
  return records.sort((a, b) => b.score - a.score);
}

/** Fetch a 400px copy of each image and record its size, which gives the shape when the Admin API did not. */
async function thumbnails(records, folder) {
  fs.mkdirSync(folder, { recursive: true });
  await pool(records, 8, async record => {
    const url = `${fullSize(record.url)}?width=400`;
    const file = path.join(folder, `${createHash('sha1').update(record.key).digest('hex').slice(0, 16)}.img`);
    await run('curl', ['-sSL', '--max-time', '30', '-A', AGENT, '-o', file, url], { capture: false });
    record.thumb = file;
    const size = pixelSize(file);
    if (size) [record.thumb_width, record.thumb_height] = size;
  });
}

function sheets(files, out) {
  const magick = which('magick');
  if (!magick) return [];
  const fonts = ['/System/Library/Fonts/Supplemental/Arial.ttf', '/System/Library/Fonts/Helvetica.ttc',
    '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 'C:/Windows/Fonts/arial.ttf'].filter(font => fs.existsSync(font));
  const made = [];
  for (let index = 0; index < files.length; index += 20) {
    const chunk = files.slice(index, index + 20).filter(file => fs.statSync(file).size > 0);
    const sheet = path.join(out, `sheet-${index / 20 + 1}.png`);
    const command = ['montage', ...(fonts.length ? ['-font', fonts[0]] : []), '-label', '%t', '-pointsize', '22', '-geometry', '300x300+6+6', '-tile', '5x',
      '-background', '#eeeeee', ...chunk, sheet];
    if (spawnSync(magick, command, { stdio: 'ignore' }).status === 0) made.push(sheet);
  }
  return made;
}

/** The role sheet. Keep tags from an earlier run: numbers change between runs, image keys do not. */
export function roleSheet(records, earlier, sheetCount) {
  const kept = new Map(Object.values(earlier).filter(entry => entry.key && entry.role).map(entry => [entry.key, entry]));
  const blank = { role: '', subject: '', text_safe_area: '', burned_in_text: null, notes: '' };
  return Object.fromEntries(records.filter(r => r.n <= sheetCount || kept.has(r.key)).map(r => [String(r.n), { ...blank, ...kept.get(r.key), key: r.key }]));
}

function parseOptions(argv) {
  const kinds = { site: 'text', store: 'text', out: 'text', pages: 'list', 'page-limit': 'int', products: 'int', 'sheet-count': 'int' };
  const args = { site: null, store: null, out: null, pages: [], 'page-limit': 15, products: 250, 'sheet-count': 80 };
  const fail = message => {
    console.error(`${USAGE}\nimage-inventory.mjs: error: ${message}`);
    process.exit(2);
  };
  // A negative number such as -1 is a value
  const isOption = arg => arg.startsWith('-') && !/^-\d+$|^-\d*\.\d+$/.test(arg);
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '-h' || arg === '--help') {
      console.log(HELP);
      process.exit(0);
    }
    if (!arg.startsWith('--')) fail(`unrecognized arguments: ${arg}`);
    const equals = arg.indexOf('=');
    const given = equals < 0 ? arg.slice(2) : arg.slice(2, equals);
    const inline = equals < 0 ? null : arg.slice(equals + 1);
    // An unambiguous prefix works, such as --sheet for --sheet-count
    const matches = Object.hasOwn(kinds, given) ? [given] : Object.keys(kinds).filter(name => name.startsWith(given));
    if (matches.length > 1) fail(`ambiguous option: --${given} could match ${matches.map(name => `--${name}`).join(', ')}`);
    if (!matches.length) fail(`unrecognized arguments: ${arg}`);
    const name = matches[0];
    if (kinds[name] === 'list') {
      args[name] = inline === null ? [] : [inline];
      while (inline === null && i + 1 < argv.length && !isOption(argv[i + 1])) args[name].push(argv[++i]);
      continue;
    }
    const value = inline ?? (i + 1 < argv.length && !isOption(argv[i + 1]) ? argv[++i] : null);
    if (value === null) fail(`argument --${name}: expected one argument`);
    if (kinds[name] === 'int' && !/^\s*[+-]?\d+\s*$/.test(value)) fail(`argument --${name}: invalid int value: '${value}'`);
    args[name] = kinds[name] === 'int' ? Number(value) : value;
  }
  const missing = ['site', 'out'].filter(name => args[name] === null);
  if (missing.length) fail(`the following arguments are required: ${missing.map(name => `--${name}`).join(', ')}`);
  return args;
}

async function main(argv) {
  const args = parseOptions(argv);
  if (!which('curl')) {
    console.error('Install curl, which reads the storefront and its images.');
    return 1;
  }
  const base = args.site.replace(/\/+$/, '');
  const password = process.env.STOREFRONT_PASSWORD;
  if (await isLocked(base)) {
    if (!password) {
      console.error('The storefront is locked. Set STOREFRONT_PASSWORD.');
      return 1;
    }
    await unlock(base, password);
  }

  const [live, read] = await liveUse(base, args.pages, args['page-limit']);
  let stock = new Map();
  if (args.store) {
    try {
      stock = adminMedia(args.store, args.products, new Set(live.keys()));
    } catch (error) {
      if (!(error instanceof AdminError)) throw error;
      console.error(`Admin media skipped: ${error.message}`);
    }
  }

  const records = [];
  for (const key of new Set([...live.keys(), ...stock.keys()])) {
    const a = stock.get(key) ?? {};
    const l = live.get(key);
    records.push({
      key, url: a.url || l?.url || '',
      width: a.width ?? null, height: a.height ?? null, alt: a.alt ?? '',
      owners: [...(a.owners ?? [])].sort(),
      // A Files upload works in an image setting on any theme of the same store
      reference: a.in_files ? `shopify://shop_images/${key}` : null,
      live: { pages: l ? [...l.pages].sort() : [], count: l ? l.count : 0,
        home_rank: l ? l.home_rank : null, sections: l ? [...l.sections].sort() : [] },
    });
  }
  fs.mkdirSync(args.out, { recursive: true });
  const folder = path.join(args.out, 'thumbs');
  fs.rmSync(folder, { recursive: true, force: true });
  await thumbnails(records, folder);
  rank(records);
  records.forEach((record, index) => {
    record.n = index + 1;
    const thumb = record.thumb;
    delete record.thumb;
    if (thumb && fs.existsSync(thumb)) {
      const numbered = path.join(folder, `${String(record.n).padStart(3, '0')}${path.extname(record.url.split('?')[0]) || '.jpg'}`);
      fs.renameSync(thumb, numbered);
      record.thumb = numbered;
    }
  });
  for (const old of fs.readdirSync(args.out)) {
    if (old.startsWith('sheet-')) fs.unlinkSync(path.join(args.out, old));
  }
  const top = records.slice(0, args['sheet-count']);
  const made = sheets(top.filter(r => r.thumb).map(r => r.thumb), args.out);
  fs.writeFileSync(path.join(args.out, 'images.json'), JSON.stringify({ site: base, store: args.store, pages_read: read, images: records }, null, 2));
  const rolesPath = path.join(args.out, 'roles.json');
  const earlier = fs.existsSync(rolesPath) ? JSON.parse(fs.readFileSync(rolesPath, 'utf8')) : {};
  fs.writeFileSync(rolesPath, JSON.stringify(roleSheet(records, earlier, args['sheet-count']), null, 2));
  const rows = ['| # | Shape | Size | Home rank | Live pages | Owners | Alt | Reference |', '|---|---|---|---|---|---|---|---|'];
  for (const r of records) {
    const size = r.width ? `${r.width}×${r.height}` : (r.thumb_width ?? 400) < 400 ? `≤${r.thumb_width}w` : '?';
    const owners = r.owners.slice(0, 3).join(', ') + (r.owners.length > 3 ? '…' : '');
    rows.push(`| ${r.n} | ${r.shape} | ${size} | ${r.live.home_rank || ''} | ${r.live.pages.length} | ` +
      `${owners} | ${[...r.alt].slice(0, 50).join('')} | ${r.reference || ''} |`);
  }
  fs.writeFileSync(path.join(args.out, 'images.md'), `# Images for ${base}\n\nPages read: ${read.length}. Images: ${records.length}. Contact sheets: ${made.length}.\n\n` +
    rows.join('\n') + '\n');
  console.log(`${records.length} images, ${made.length} contact sheets in ${args.out}`);
  return 0;
}

// Compare real paths, since the skill folder is often a symlink
if (process.argv[1] && fs.realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = await main(process.argv.slice(2));
}
