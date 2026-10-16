/** Evidence from the comparison and the theme files: groups, kinds, links between files, apps, and bug signs. */
import fs from 'node:fs';
import path from 'node:path';

import {loadThemeJson} from './themejson.mjs';

// Merchant data: page layouts, settings, and markets. Settings translation handles these, not code review.
const CONTENT = /^(templates\/.*\.json|sections\/.*\.json|config\/settings_data\.json|config\/markets\.json)$/;
const TEXT = /^locales\//;
// Shopify drops files outside the theme folders on upload
const THEME_FOLDERS = ['assets/', 'blocks/', 'config/', 'layout/', 'locales/', 'sections/', 'snippets/', 'templates/'];
// Blocks made with Shopify's AI block generator
const GENERATED = /^blocks\/ai_gen_block_/;

// Prefixes that theme files share, so they never mark an app
const THEME_WORDS = new Set(['section', 'sections', 'page', 'search', 'product', 'collection', 'cart', 'blog', 'article',
  'customer', 'index', 'main', 'header', 'footer', 'icon', 'theme', 'custom', 'image', 'video', 'team', 'live']);

// Words in changed lines that point at buying, or at being found: variants, prices, stock, cart, checkout, and SEO
const SELLING = new RegExp(
  String.raw`variant|price|money|compare_at|inventory|available|sold.?out|add.?to.?cart|/cart|cart\.|checkout` +
    String.raw`|discount|selling_plan|quantity|customer\.tags|product-form|shipping|robots|noindex|canonical` +
    String.raw`|sitemap|og:|redirect|localization|country|market`,
  'iu',
);
// Words that point at looks: styles, layout, and media
const VISUAL = /class=|style|@media|font|color|margin|padding|width|height|slideshow|gallery|image|video|icon|grid/iu;

// Signs of unfinished or risky code in added lines
const BUG_SIGNS = [
  [/\bDEBUG\b|console\.(log|debug)\(|\bdebugger\b/, 'debug output left in'],
  [/\b(TODO|FIXME|HACK|XXX)\b/, 'unfinished-work note'],
  [/src=["']http:\/\//, 'script or image over plain http'],
  [/removeAttribute\(\s*['"]disabled['"]/, 'force-enables a disabled control, check that it does not undo stock or availability rules'],
];

// Names that every theme uses, so sharing one says nothing about a feature
const COMMON_NAMES = new Set(['product', 'variant', 'price', 'button', 'hidden', 'active', 'title', 'image', 'container', 'wrapper']);

const REPLACEMENT = Buffer.from('\ufffd');

/** UTF-8 text with invalid bytes dropped. A U+FFFD that the file itself holds stays. */
export function decodeText(bytes) {
  const parts = [];
  let start = 0;
  for (let at = bytes.indexOf(REPLACEMENT); at >= 0; at = bytes.indexOf(REPLACEMENT, start)) {
    parts.push(bytes.subarray(start, at));
    start = at + REPLACEMENT.length;
  }
  parts.push(bytes.subarray(start));
  return parts.map((part) => part.toString('utf8').replaceAll('\ufffd', '')).join('\ufffd');
}

/** A text file with invalid UTF-8 dropped and each \r\n or \r read as \n. */
export function readText(file) {
  return decodeText(fs.readFileSync(file)).replace(/\r\n?/g, '\n');
}

export function isDir(folder) {
  return fs.statSync(folder, {throwIfNoEntry: false})?.isDirectory() ?? false;
}

/**
 * Every file under `folder` in the directory's own order, each folder's files before its subfolders. The order
 * decides ties, such as two templates with the same section keys. readdirSync would sort the names.
 */
export function walk(folder) {
  let directory;
  try {
    directory = fs.opendirSync(folder);
  } catch {
    return [];
  }
  const files = [];
  const folders = [];
  for (let entry = directory.readSync(); entry; entry = directory.readSync()) {
    const full = path.join(folder, entry.name);
    if (entry.isDirectory()) folders.push(full);
    // A link to a folder is not followed
    else if (!(entry.isSymbolicLink() && isDir(full))) files.push(full);
  }
  directory.closeSync();
  return [...files, ...folders.flatMap(walk)];
}

/** The first `count` characters. It counts code points, so an emoji stays whole. */
export function head(text, count) {
  return [...text].slice(0, count).join('');
}

/** The value at `key`. A missing key gets `make()` first. */
export function getOrAdd(map, key, make) {
  if (!map.has(key)) map.set(key, make());
  return map.get(key);
}

/** splice.json, which tradecraft merge writes: the store, the theme it pulled, and the release. Empty for an older splice. */
export function spliceRecord(splice) {
  const file = path.join(splice, 'splice.json');
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {};
}

/**
 * The folders of one splice: the base-to-changes comparison, the changed theme, the base, and the target.
 * The themes come from the comparison's extracted copies, which are folders even when an input was a zip.
 * A splice made before base, changes, and target has compare/, live/ or theme/, and original/ instead.
 */
export function spliceFolders(splice) {
  const record = spliceRecord(splice);
  const compare = path.join(splice, 'compare', 'changes');
  if (fs.existsSync(path.join(compare, 'manifest.json'))) {
    const given = record.target?.path ? path.resolve(splice, record.target.path) : null;
    const copied = path.join(splice, 'compare', 'target', 'raw', 'target');
    return {
      compare,
      changes: path.join(compare, 'raw', 'changes'),
      base: path.join(compare, 'raw', 'base'),
      target: given && isDir(given) ? given : isDir(copied) ? copied : null,
    };
  }
  const pulled = record.pulled || (isDir(path.join(splice, 'live')) ? 'live' : 'theme');
  return {compare: path.join(splice, 'compare'), changes: path.join(splice, pulled), base: path.join(splice, 'original'), target: null};
}

function namePrefix(file) {
  let stem = path.basename(file);
  // An alternate template names its purpose after the dot, as in search.avada-seo.liquid
  if (file.startsWith('templates/') && stem.split('.').length > 2) stem = stem.slice(stem.indexOf('.') + 1);
  const prefix = stem.split(/[-_.]/)[0].toLowerCase();
  return THEME_WORDS.has(prefix) ? null : prefix;
}

function changedLines(compare, entry, sign = '+-') {
  const diff = entry.normalized_diff || entry.raw_diff;
  if (!diff || !fs.existsSync(path.join(compare, diff))) return [];
  const lines = readText(path.join(compare, diff)).match(/[^\n]*\n|[^\n]+$/g) ?? [];
  return lines.filter((line) => sign.includes(line[0]) && !['+++', '---'].includes(line.slice(0, 3))).map((line) => line.slice(1));
}

/** selling or visual. Selling wins a near tie, since missing it costs sales. */
function guessKind(lines) {
  const selling = lines.filter((line) => SELLING.test(line)).length;
  const visual = lines.filter((line) => VISUAL.test(line)).length;
  return selling && selling * 3 >= visual ? 'selling' : 'visual';
}

export function readTree(folder) {
  const texts = new Map();
  for (const file of walk(folder)) {
    if (/\.(liquid|js|json|css|scss)$/.test(file)) texts.set(path.relative(folder, file), readText(file));
  }
  return texts;
}

/** Names and values that a feature shares between files: string literals, globals, element IDs, data attributes, and classes. */
function identifiers(lines) {
  const found = new Set();
  for (const line of lines) {
    for (const [, match] of line.matchAll(/["']([^"'\n{}]{8,200})["']/gu)) {
      const literal = match.trim();
      // Skip markup, selector fragments, and plain sentences
      if ((literal.match(/[A-Za-z0-9]/g) ?? []).length < 4 || /[<>[\]()=;]/.test(literal) || literal.split(' ').length > 7) continue;
      found.add(`"${literal}"`);
    }
    for (const [, name] of line.matchAll(/window\.([A-Z][A-Za-z0-9_]{3,})/g)) found.add(`window.${name}`);
    for (const [, name] of line.matchAll(/\bid=["']([a-z][a-z0-9_-]{3,})["']/g)) found.add(`#${name}`);
    for (const [, name] of line.matchAll(/\b(data-[a-z0-9-]{4,})/g)) found.add(`[${name}]`);
    for (const [, classes] of line.matchAll(/class=["']([^"'{}]+)["']/g)) {
      for (const name of classes.split(/\s+/)) {
        if (name.length > 5 && !COMMON_NAMES.has(name)) found.add(`.${name}`);
      }
    }
  }
  return found;
}

/**
 * Links between changed files: each new name that two or more of them share. New means the original theme
 * never uses it. Names that join the same files form one link.
 */
function linkFiles(codeLines, originalText, maxFiles = 8) {
  const owners = new Map();
  for (const [file, lines] of codeLines) {
    for (const name of identifiers(lines)) getOrAdd(owners, name, () => new Set()).add(file);
  }
  const byFiles = new Map();
  for (const [name, files] of owners) {
    const bare = name.replace(/^["#.[\]]+|["#.[\]]+$/g, '').replaceAll('window.', '');
    if (files.size >= 2 && files.size <= maxFiles && !originalText.includes(bare)) {
      const sorted = [...files].sort();
      getOrAdd(byFiles, sorted.join('\0'), () => ({files: sorted, shared: []})).shared.push(name);
    }
  }
  return [...byFiles.values()]
    .map((link) => ({files: link.files, shared: link.shared.sort()}))
    .sort((a, b) => b.shared.length - a.shared.length || b.files.length - a.files.length);
}

/** Layouts and the theme-wide script and style files carry many features at once. */
function isHub(file) {
  return file.startsWith('layout/') || /^assets\/(theme|custom|global|base|main|app)[.-]/.test(file);
}

/** Draft features: links joined through the files they share. A hub file does not join them. */
function features(links) {
  const hubs = new Set(links.flatMap((link) => link.files).filter(isHub));
  const parent = links.map((link, index) => index);

  const root = (index) => {
    while (parent[index] !== index) {
      parent[index] = parent[parent[index]];
      index = parent[index];
    }
    return index;
  };

  links.forEach((first, i) => {
    for (let j = i + 1; j < links.length; j++) {
      if (first.files.some((file) => links[j].files.includes(file) && !hubs.has(file))) parent[root(j)] = root(i);
    }
  });
  const joined = new Map();
  links.forEach((link, index) => getOrAdd(joined, root(index), () => []).push(link));
  return [...joined.values()]
    .map((group) => {
      const files = [...new Set(group.flatMap((link) => link.files))].sort();
      return {files: files.filter((file) => !hubs.has(file)), hubs: files.filter((file) => hubs.has(file)), links: group};
    })
    .sort((a, b) => b.files.length - a.files.length);
}

/** Snippet name to the files that render it. */
function renders(texts) {
  const users = new Map();
  for (const [file, text] of texts) {
    for (const [, snippet] of text.matchAll(/\{%-?\s*(?:render|include)\s+['"]([^'"]+)/g)) {
      getOrAdd(users, snippet, () => new Set()).add(file);
    }
  }
  return users;
}

/** Apps that the theme JSON names: embeds with their state, and blocks with the files that use them. */
function themeApps(changed) {
  const apps = new Map();
  const app = (handle) => getOrAdd(apps, handle, () => ({embeds: [], blocks: new Set(), files: new Set()}));
  const settings = path.join(changed, 'config', 'settings_data.json');
  if (fs.existsSync(settings)) {
    let data;
    try {
      data = loadThemeJson(fs.readFileSync(settings));
    } catch {
      data = {};
    }
    for (const block of Object.values(data?.current?.blocks ?? {})) {
      const match = /^shopify:\/\/apps\/([^/]+)\/blocks\/([^/]+)/.exec(block?.type ?? '');
      if (match) app(match[1]).embeds.push(`${match[2]} (${block.disabled ? 'off' : 'on'})`);
    }
  }
  for (const folder of ['templates', 'sections']) {
    for (const file of walk(path.join(changed, folder))) {
      if (!file.endsWith('.json')) continue;
      for (const [, handle, block] of readText(file).matchAll(/shopify:\/\/apps\/([^/"]+)\/blocks\/([^/"]+)/g)) {
        app(handle).blocks.add(block);
        app(handle).files.add(path.relative(changed, file));
      }
    }
  }
  return apps;
}

/** Everything the audit reads from a splice folder: the comparison, the changed theme, and the base. */
export function triage(splice) {
  const {compare, changes: changed, base: original} = spliceFolders(splice);
  const manifest = JSON.parse(fs.readFileSync(path.join(compare, 'manifest.json'), 'utf8'));
  const files = manifest.files.filter((entry) => entry.status !== 'unchanged');

  // A prefix shared by two or more added files is usually one app's files
  const addedPrefixes = new Map();
  for (const entry of files) {
    if (entry.status === 'added' && !CONTENT.test(entry.path)) {
      const prefix = namePrefix(entry.path);
      addedPrefixes.set(prefix, (addedPrefixes.get(prefix) ?? 0) + 1);
    }
  }

  const rows = [];
  const codeLines = new Map();
  const bugs = [];
  for (const entry of files) {
    const {path: file, status} = entry;
    const lines = changedLines(compare, entry);
    let group;
    if (['normalization-only', 'json-equivalent'].includes(status) || !THEME_FOLDERS.some((folder) => file.startsWith(folder))) {
      group = 'noise';
    } else if (CONTENT.test(file)) {
      group = 'content';
    } else if (TEXT.test(file)) {
      group = 'text';
    } else if (GENERATED.test(file)) {
      group = 'generated';
    } else if (status === 'added' && namePrefix(file) && addedPrefixes.get(namePrefix(file)) >= 2) {
      group = `app?:${namePrefix(file)}`;
    } else {
      group = 'code';
    }
    const row = {path: file, status, group, lines: lines.length};
    if (group === 'code') {
      row.kind = guessKind(lines);
      codeLines.set(file, changedLines(compare, entry, '+'));
      for (const line of codeLines.get(file)) {
        for (const [pattern, meaning] of BUG_SIGNS) {
          if (pattern.test(line)) bugs.push({path: file, sign: meaning, line: head(line.trim(), 140)});
        }
      }
    }
    rows.push(row);
  }

  const texts = isDir(changed) ? readTree(changed) : new Map();
  const originalText = isDir(original) ? [...readTree(original).values()].join('\n') : '';
  const snippetUsers = renders(texts);
  const changedPaths = new Set(rows.map((row) => row.path));
  const snippetName = (file) => path.basename(file).slice(0, -'.liquid'.length);
  const tied = [];
  for (const row of rows) {
    if (row.group === 'code' && row.status === 'added' && row.path.startsWith('snippets/')) {
      const users = [...(snippetUsers.get(snippetName(row.path)) ?? [])].filter((user) => changedPaths.has(user)).sort();
      if (users.length) tied.push({snippet: row.path, renderedFrom: users});
    }
  }

  // Snippet links join clusters too, so add each render as a shared name
  for (const link of tied) {
    const name = snippetName(link.snippet);
    const users = link.renderedFrom.filter((user) => !user.startsWith('layout/'));
    for (const user of users) getOrAdd(codeLines, user, () => []).push(`"render-${name}"`);
    if (users.length) getOrAdd(codeLines, link.snippet, () => []).push(`"render-${name}"`);
  }
  const links = linkFiles(codeLines, originalText);

  const appFiles = new Map();
  for (const row of rows) {
    if (row.group.startsWith('app?:')) {
      row.renderedFrom = row.path.startsWith('snippets/') ? [...(snippetUsers.get(snippetName(row.path)) ?? [])].sort() : [];
      getOrAdd(appFiles, row.group.slice('app?:'.length), () => []).push(row);
    }
  }

  const apps = isDir(changed) ? themeApps(changed) : new Map();
  return {
    rows,
    links,
    features: features(links),
    tied,
    bugs,
    appFiles,
    themeApps: new Map([...apps].map(([name, info]) => [name, {...info, blocks: [...info.blocks].sort(), files: [...info.files].sort()}])),
  };
}
