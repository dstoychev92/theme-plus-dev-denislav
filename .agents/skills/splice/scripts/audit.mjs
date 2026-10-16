#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

import {admin as adminEvidence, AdminError} from './admin.mjs';
import {Locked, matchingExtensions, storefront} from './storefront.mjs';
import {markdown, target} from './target.mjs';
import {getOrAdd, head, isDir, readTree, spliceFolders, spliceRecord, triage} from './triage.mjs';

const DESCRIPTION = `Gather the splice evidence and write the first draft of the to-do list.

Usage: audit.mjs splice/<store> [--site https://<domain>] [--target themes/<theme>] [--pages /pages/a ...]
                 [--product <handle>] [--no-site] [--admin]

Writes into splice/<store>/:
- triage.md: every piece of evidence, for the agent to read.
- target.md: what the target theme can do.
- todo.md: the draft list, or todo.draft.md when todo.md already exists, so a rerun never overwrites decisions.

The site check sends only GET requests to public pages. Without --site it reads https://<store>.myshopify.com.
A storefront with a password needs STOREFRONT_PASSWORD in the environment, never on the command line.

--admin asks the Admin API through Shopify CLI instead: exact templates in use, markets, and installed apps, even
when the storefront has a password. It needs a one-time \`shopify store auth\`, which only runs with approval.
`;

const KEY = `Key
- S selling: what a shopper can buy, for how much, and whether they find the store. First by default.
- A app: an app's blocks, embeds, and theme code, with what it does, why the store has it, and whether it is still installed.
- V visual: layout, styles, and media. The new theme can usually do these with its own settings.
- C content: page layouts and settings, moved by settings translation.
- T text: translation changes.
- Status: found, then understood (we know what it is for), rebuilt, and verified. Drop an item only after someone confirms the store does not need it.`;

const USAGE = `usage: audit.mjs [-h] [--site SITE] [--target TARGET] [--pages [PAGES ...]]
                 [--product PRODUCT] [--no-site] [--admin]
                 splice
`;

const HELP = `${USAGE}
${DESCRIPTION}
positional arguments:
  splice

optional arguments:
  -h, --help           show this help message and exit
  --site SITE
  --target TARGET
  --pages [PAGES ...]
  --product PRODUCT
  --no-site
  --admin
`;

const OPTIONS = {'--help': 'help', '--site': 'value', '--target': 'value', '--pages': 'list', '--product': 'value',
  '--no-site': 'flag', '--admin': 'flag'};

/** The command line: long options or their unique prefixes, --name=value, and any number of --pages values. */
function parseArgs(argv) {
  const args = {splice: null, site: null, target: null, pages: [], product: null, 'no-site': false, admin: false};
  const fail = (message) => {
    process.stderr.write(`${USAGE}audit.mjs: error: ${message}\n`);
    process.exit(2);
  };
  const extras = [];
  const positional = (arg) => {
    if (args.splice === null) args.splice = arg;
    else extras.push(arg);
  };
  const isOption = (arg) => arg.startsWith('-') && arg !== '-';
  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index];
    if (arg === '--') {
      argv.slice(index + 1).forEach(positional);
      break;
    }
    if (!isOption(arg)) {
      positional(arg);
      continue;
    }
    const at = arg.indexOf('=');
    const given = at < 0 ? arg : arg.slice(0, at);
    const explicit = at < 0 ? null : arg.slice(at + 1);
    const option = given === '-h' ? '--help' : given;
    const matches = option in OPTIONS ? [option] : Object.keys(OPTIONS).filter((name) => option.startsWith('--') && name.startsWith(option));
    if (matches.length > 1) fail(`ambiguous option: ${given} could match ${matches.join(', ')}`);
    if (!matches.length) {
      extras.push(arg);
      continue;
    }
    const name = matches[0];
    const kind = OPTIONS[name];
    if (kind === 'help') {
      process.stdout.write(HELP);
      process.exit(0);
    }
    if (kind === 'flag') {
      if (explicit !== null) fail(`argument ${name}: ignored explicit argument '${explicit}'`);
      args[name.slice(2)] = true;
    } else if (kind === 'value') {
      if (explicit !== null) args[name.slice(2)] = explicit;
      else if (index + 1 < argv.length && !isOption(argv[index + 1])) args[name.slice(2)] = argv[++index];
      else fail(`argument ${name}: expected one argument`);
    } else if (explicit !== null) {
      args.pages = [explicit];
    } else {
      args.pages = [];
      while (index + 1 < argv.length && !isOption(argv[index + 1])) args.pages.push(argv[++index]);
    }
  }
  if (args.splice === null) fail('the following arguments are required: splice');
  if (extras.length) fail(`unrecognized arguments: ${extras.join(' ')}`);
  return args;
}

/** The Admin API's exact answers replace the storefront's sample. The storefront's own checks stay. */
function mergeAdmin(site, found) {
  site = site || {rendered: new Map(), extensions: new Map(), uninstalled: [], scriptTags: [], hosts: new Map(), failed: [],
    pagesRead: 0, product: null, countries: []};
  return {...site, ...found, templatesSource: 'the Admin API'};
}

/** The target that splice compared, or else the project's theme folder from tradecraft.json above the splice folder. */
function projectTarget(splice) {
  const {target: compared} = spliceFolders(splice);
  if (compared) return compared;
  for (let folder = path.resolve(splice); folder !== path.dirname(folder); folder = path.dirname(folder)) {
    const manifest = path.join(folder, 'tradecraft.json');
    if (fs.existsSync(manifest)) {
      const data = JSON.parse(fs.readFileSync(manifest, 'utf8'));
      return path.resolve(folder, data.packages[data.theme].path);
    }
  }
  return null;
}

function short(name, limit = 48) {
  return [...name].length <= limit ? name : `${head(name, limit - 3)}...`;
}

const byKey = ([a], [b]) => (a < b ? -1 : a > b ? 1 : 0);
const sortedEntries = (map) => [...map].sort(byKey);

/** Block and embed names, which often carry the app's older name, as bss-pl-config-data does. */
function blockNames(info) {
  const embedName = (embed) => (embed.includes(' (') ? embed.slice(0, embed.lastIndexOf(' (')) : embed);
  return [...(info.blocks ?? []), ...(info.embeds ?? []).map(embedName)];
}

/** Installed, uninstalled, or unclear, with the reasons. */
function appEvidence(handle, info, site) {
  if (!site) return ['unclear', ['neither the storefront nor the Admin API was read']];
  const known = site.appInstalls?.get(handle);
  if (known) {
    return known.installed ? ['installed', ['the Admin API reports it installed']]
      : ['uninstalled', ['the Admin API reports it not installed']];
  }
  if (!site.pagesRead) return ['unclear', ['the storefront was not read']];
  const extensions = matchingExtensions(handle, site.extensions, blockNames(info));
  const pages = site.rendered.get(handle) ?? [];
  const reasons = [];
  if (extensions.length) reasons.push(`its extension loads files (${extensions.join(', ')})`);
  if (pages.length) reasons.push(`its embed renders on ${pages.length} page(s), such as ${pages[0]}`);
  if (reasons.length) return ['installed', reasons];
  const embeds = info.embeds ?? [];
  if (embeds.length && embeds.every((embed) => embed.endsWith('(off)'))) return ['off', ['its embed is turned off']];
  return ['unclear', [`nothing of it loads on the ${site.pagesRead} pages read`]];
}

/** For theme files that share a name prefix, without an app handle. */
function prefixEvidence(prefix, rows, site) {
  if (!site || !site.pagesRead) return ['unclear', ['the storefront was not read']];
  const gone = site.uninstalled.filter((snippet) => path.basename(snippet).toLowerCase().includes(prefix));
  if (gone.length) return ['uninstalled', [`Shopify reports ${gone[0]} as belonging to an uninstalled app`]];
  const hosts = [...site.hosts.keys()].filter((host) => host.toLowerCase().includes(prefix));
  if (hosts.length) return ['installed', [`its scripts load from ${hosts.join(', ')}`]];
  return ['unclear', ['no script of it loads on the site, so its theme code may be left over']];
}

function today() {
  const now = new Date();
  return [now.getFullYear(), now.getMonth() + 1, now.getDate()].map((part) => String(part).padStart(2, '0')).join('-');
}

function draft(splice, evidence, site, targetFolder, error = '') {
  const rows = new Map(evidence.rows.map((row) => [row.path, row]));
  const record = spliceRecord(splice);
  const folders = spliceFolders(splice);
  const rel = (folder) => path.relative(splice, folder) || '.';
  // A splice made before base, changes, and target names its theme in record.theme
  const changes = record.changes ?? {source: record.theme, name: record.name, version: record.version};
  const theme = [changes.name, changes.version].filter(Boolean).join(' ');
  let store = (record.store || path.basename(path.resolve(splice))).replaceAll('.myshopify.com', '');
  // A splice of zips or folders has no store, so its title is the changed theme
  if (record.changes && !record.store) store = theme ? `${changes.source} (${theme})` : changes.source;
  else if (changes.source && changes.source !== 'live') {
    store += `, ${/^\d+$/.test(changes.source) ? `theme ${changes.source}` : changes.source} (${theme})`;
  }
  const sections = new Map();
  const counters = new Map();

  const add = (section, kind, text) => {
    const letter = kind[0].toUpperCase();
    counters.set(letter, (counters.get(letter) ?? 0) + 1);
    getOrAdd(sections, section, () => []).push(`- [ ] ${letter}${counters.get(letter)} ${kind}: ${text} Status: found`);
  };

  const covered = new Set();
  for (const feature of evidence.features) {
    if (!feature.files.length) continue;
    feature.files.forEach((file) => covered.add(file));
    const kind = feature.files.some((file) => rows.get(file)?.kind === 'selling') ? 'selling' : 'visual';
    const linked = feature.links.slice(0, 6).map((link) => link.shared.slice(0, 3).map((name) => short(name)).join(', ')).join('; ');
    const hubs = feature.hubs.length ? ` Also touches: ${feature.hubs.join(', ')}.` : '';
    add(kind === 'selling' ? 'Must' : 'Later', kind,
      `NAME THIS FEATURE. WHY: ?. Files: ${feature.files.join(', ')}.${hubs} Linked by: ${linked}.`);
  }

  const small = [];
  for (const [file, row] of [...rows].sort((a, b) => b[1].lines - a[1].lines)) {
    if (row.group !== 'code' || covered.has(file)) continue;
    if (row.kind === 'selling') {
      add('Should', 'selling', `NAME THIS FEATURE. WHY: ?. Files: ${file} (${row.lines} changed lines).`);
    } else if (row.lines >= 100) {
      add('Later', 'visual', `NAME THIS FEATURE. WHY: ?. Files: ${file} (${row.lines} changed lines).`);
    } else {
      small.push(`${file} (${row.lines})`);
    }
  }
  if (small.length) add('Later', 'visual', `Small edits, which may be core drift. Files: ${small.join(', ')}.`);
  const generated = evidence.rows.filter((row) => row.group === 'generated').map((row) => row.path);
  if (generated.length) add('Later', 'visual', `Blocks made with Shopify's AI block generator. WHY: ?. Files: ${generated.join(', ')}.`);

  // Apps: attach each file-prefix group to the app whose extension files or handle carry the prefix
  const prefixGroups = new Map(evidence.appFiles);
  for (const [handle, info] of sortedEntries(evidence.themeApps)) {
    const [state, reasons] = appEvidence(handle, info, site);
    const extensions = site ? matchingExtensions(handle, site.extensions, blockNames(info)) : [];
    const assets = site ? extensions.flatMap((folder) => site.extensions.get(folder)).join(' ').toLowerCase() : '';
    const owned = [...prefixGroups.keys()].filter((prefix) => handle.includes(prefix) || assets.includes(`${prefix}-`));
    const files = owned.flatMap((prefix) => {
      const group = prefixGroups.get(prefix);
      prefixGroups.delete(prefix);
      return group.map((row) => row.path);
    });
    const uses = info.files.length ? ` Blocks in ${info.files.length} theme file(s).` : '';
    const embeds = info.embeds.length ? ` Embeds: ${info.embeds.join(', ')}.` : '';
    const code = files.length ? ` Theme code: ${files.length} file(s), such as ${files.slice(0, 3).join(', ')}.` : '';
    const text = `${handle}. WHAT IT DOES: ?. WHY: ?.${embeds}${uses}${code} Installed: ${state}, because ${reasons.join('; ')}.`;
    if (state === 'installed') add('Should', 'app', text);
    else if (state === 'off' || state === 'uninstalled') add('Dropped (suggested, confirm before removing)', 'app', text);
    else add('Open questions', 'app', `Is ${handle} still installed? ${text}`);
  }
  for (const [prefix, group] of sortedEntries(prefixGroups)) {
    const [state, reasons] = prefixEvidence(prefix, group, site);
    const files = group.slice(0, 4).map((row) => row.path).join(', ') + (group.length > 4 ? ' ...' : '');
    const text = `${prefix} theme code, ${group.length} file(s): ${files}. WHAT IT DOES: ?. Installed: ${state}, because ${reasons.join('; ')}.`;
    if (state === 'installed') add('Should', 'app', text);
    else if (state === 'uninstalled') add('Dropped (suggested, confirm before removing)', 'app', text);
    else add('Open questions', 'app', `Is the app behind the ${prefix} files still installed? ${text}`);
  }

  const content = evidence.rows.filter((row) => row.group === 'content');
  if (content.length) {
    const used = site && site.templatesSource === 'the Admin API' ? ` The store uses ${site.templatesUsed.size} of them; see triage.md.`
      : site ? ` The site uses ${site.templatesUsed.size} of them on the ${site.pagesRead} pages read; see triage.md.` : '';
    add('Later', 'content', `${content.length} templates and settings files for settings translation.${used}`);
  }
  const textRows = evidence.rows.filter((row) => row.group === 'text').map((row) => row.path);
  if (textRows.length) add('Later', 'text', `Translation changes in ${textRows.join(', ')}.`);

  const bugs = evidence.bugs.map((bug) => `- ${bug.path}: ${bug.sign}: \`${head(bug.line, 90)}\``);
  for (const warning of marketWarnings(site)) bugs.push(`- ${warning}`);

  const order = ['Must', 'Should', 'Later', 'Open questions', 'Dropped (suggested, confirm before removing)', 'Done'];
  const lines = [`# Splice to-do: ${store}`, '', KEY, '',
    `Draft written by audit.mjs on ${today()}. Name each feature, fill in WHAT IT DOES and WHY, merge or split`,
    'items, and rerank. Then delete this note.', '',
    `- Changes: \`${rel(folders.changes)}/\`. Base: \`${rel(folders.base)}/\`. Comparison: \`${rel(folders.compare)}/\`.`,
    `- Target: \`${targetFolder ? path.relative(process.cwd(), targetFolder) || '.' : '?'}\`. What it can do: \`target.md\`.`,
    '- Evidence: `triage.md`.'];
  if (error) lines.push(...error.split('\n').map((line) => `- Not gathered: ${line}`));
  lines.push('');
  for (const section of order) lines.push(`## ${section}`, '', ...(sections.get(section) ?? []), '');
  lines.push('## Bugs to check', '', 'Found while reading. They are not items until someone decides to fix them.', '');
  lines.push(...(bugs.length ? bugs : ['- None found yet.']));
  return `${lines.join('\n')}\n`;
}

/** A market whose countries get different variants usually means a country list in the theme is out of date. */
function marketWarnings(site) {
  if (!site || !site.countries?.length) return [];
  const byCountry = new Map(site.countries.filter((row) => !('error' in row)).map((row) => [row.country, row]));
  const warnings = [];
  for (const [market, countries] of site.markets ?? new Map()) {
    const variants = new Map();
    for (const country of countries) {
      if (byCountry.has(country)) getOrAdd(variants, byCountry.get(country).variant, () => []).push(country);
    }
    if (variants.size > 1) {
      const parts = [...variants]
        .sort((a, b) => b[1].length - a[1].length)
        .map(([variant, found]) => `${variant}: ${found.slice(0, 8).join(', ')}${found.length > 8 ? ' ...' : ''}`)
        .join('; ');
      warnings.push(`Market ${market.slice(market.lastIndexOf('/') + 1).replaceAll('xx-', '')}: its countries get different variants of `
        + `${site.product}, which a country list in the theme usually causes. ${parts}`);
    }
  }
  return warnings;
}

function report(splice, evidence, site, error) {
  const out = ['# Splice evidence', ''];
  const groups = new Map();
  for (const row of evidence.rows) getOrAdd(groups, row.group, () => []).push(row);
  const total = (rows) => rows.reduce((sum, row) => sum + row.lines, 0);
  out.push('| Group | Files | Changed lines |', '| --- | ---: | ---: |');
  for (const [group, rows] of [...groups].sort((a, b) => total(b[1]) - total(a[1]))) out.push(`| ${group} | ${rows.length} | ${total(rows)} |`);

  out.push('', '## Code files', '', '| File | Kind | Status | Changed lines |', '| --- | --- | --- | ---: |');
  const code = [...(groups.get('code') ?? [])].sort((a, b) => (a.kind !== 'selling') - (b.kind !== 'selling') || b.lines - a.lines);
  out.push(...code.map((row) => `| ${row.path} | ${row.kind} | ${row.status} | ${row.lines} |`));

  out.push('', '## Links between changed files', '',
    'Each link is a name that two or more changed files share and the original theme never uses.', '');
  for (const link of evidence.links) {
    out.push(`- ${link.files.join(', ')}: ${link.shared.slice(0, 6).map((name) => short(name, 70)).join(', ')}`);
  }

  out.push('', '## Apps that the theme JSON names', '', '| App | Embeds | Blocks | Used in | Extension files load | Embed renders on |',
    '| --- | --- | --- | --- | --- | --- |');
  for (const [handle, info] of sortedEntries(evidence.themeApps)) {
    const loads = site ? matchingExtensions(handle, site.extensions, blockNames(info)).join(', ') : '?';
    const pages = site ? site.rendered.get(handle) ?? [] : [];
    const seen = pages.length ? pages.slice(0, 2).join(', ') + (pages.length > 2 ? ' ...' : '') : 'not seen';
    out.push(`| ${handle} | ${info.embeds.join(', ') || '-'} | ${info.blocks.join(', ')} | ${info.files.length} file(s) | `
      + `${loads || '-'} | ${seen} |`);
  }

  out.push('', '## Theme files that share an app-like prefix', '');
  for (const [prefix, rows] of sortedEntries(evidence.appFiles)) {
    const rendered = [...new Set(rows.flatMap((row) => row.renderedFrom ?? []))].sort();
    out.push(`- ${prefix}: ${rows.map((row) => row.path).join(', ')}` + (rendered.length ? `. Rendered from ${rendered.join(', ')}` : ''));
  }

  if (site && site.pagesRead) {
    out.push('', `## The live site (${site.pagesRead} pages read)`, '');
    out.push('Theme app extensions that load files:', '', ...sortedEntries(site.extensions).map(([folder, assets]) => `- ${folder}: ${assets.slice(0, 3).join(', ')}`));
    if (site.uninstalled.length) {
      out.push('', 'Snippets that Shopify skips because their app was uninstalled:', '', ...site.uninstalled.map((snippet) => `- ${snippet}`));
    }
    out.push('', 'App script tags (they can outlive their app):', '', ...site.scriptTags.map((url) => `- ${url}`));
    out.push('', 'Other third-party scripts:', '', ...[...site.hosts.keys()].sort().map((host) => `- ${host}`));
    if (site.failed.length) out.push('', 'Requests that failed:', '', ...site.failed.map((line) => `- ${line}`));
  }
  if (site) {
    if (site.templatesSource === 'the Admin API') {
      out.push('', '## Templates in use', '', 'From the Admin API: every product, collection, page, and article.', '');
    } else {
      out.push('', '## Templates in use', '', 'Matched by the section keys each page renders. A template not seen here may',
        'still serve pages that the sitemap sample missed, or hidden pages.', '');
    }
    out.push(...sortedEntries(site.templatesUsed).map(([template, paths]) => `- ${template}: ${paths.slice(0, 3).join(', ')}${paths.length > 3 ? ' ...' : ''}`));
    out.push('', `Not used (${site.templatesUnseen.length}): ${site.templatesUnseen.join(', ')}`);
    if (site.appInstalls?.size) {
      out.push('', '## Apps from the Admin API', '');
      for (const [handle, app] of sortedEntries(site.appInstalls)) {
        out.push(`- ${handle}: ${app === null ? 'not a known app handle' : `${app.title}, ${app.installed ? 'installed' : 'not installed'}`}`);
      }
    }
    if (site.markets?.size) out.push('', '## Markets', '', ...sortedEntries(site.markets).map(([market, countries]) => `- ${market}: ${countries.join(', ')}`));
  }
  if (site && site.countries.length) {
    out.push('', `## ${site.product} in each market`, '',
      'Only what the server renders. A script can change the variant after the page loads.', '',
      '| Variant shown | Currency | Countries |', '| --- | --- | --- |');
    const grouped = new Map();
    for (const row of site.countries) {
      const key = JSON.stringify(['variant' in row ? row.variant : 'error', row.currency ?? '?']);
      getOrAdd(grouped, key, () => []).push(row.country);
    }
    const table = [...grouped].map(([key, countries]) => [...JSON.parse(key), countries]);
    table.sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0));
    for (const [variant, currency, countries] of table) out.push(`| ${variant} | ${currency} | ${countries.join(', ')} |`);
  }
  if (error) {
    out.push('', '## Evidence not gathered', '', error, 'Say which parts are missing in the to-do list, and carry on with the code evidence.');
  }

  out.push('', '## Bug signs', '', ...(evidence.bugs.length ? evidence.bugs.map((bug) => `- ${bug.path}: ${bug.sign}: \`${bug.line}\``) : ['- None.']));
  out.push(...marketWarnings(site).map((warning) => `- ${warning}`));
  return `${out.join('\n')}\n`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  const splice = args.splice.replace(/\/+$/, '');
  const evidence = triage(splice);
  const record = spliceRecord(splice);
  const {changes: pulled} = spliceFolders(splice);
  const store = record.store || `${path.basename(path.resolve(splice))}.myshopify.com`;
  let site = null;
  const problems = [];
  if (!args['no-site']) {
    const base = args.site || `https://${store}`;
    try {
      site = await storefront(base, pulled, args.pages,
        {product: args.product, password: process.env.STOREFRONT_PASSWORD});
    } catch (failure) {
      if (failure instanceof Locked) {
        problems.push(`The storefront was not read: ${failure.message}. Set STOREFRONT_PASSWORD to read it, or run with --admin.`);
      } else {
        const hint = failure.message.includes('429') ? ' Shopify limits how fast one address can read a store. Wait a few minutes, then run this again.' : '';
        problems.push(`The storefront was not read: ${base}: ${failure.message}.${hint}`);
      }
    }
  }
  if (args.admin) {
    const templates = [...readTree(path.join(pulled, 'templates')).keys()]
      .filter((file) => file.endsWith('.json') || file.endsWith('.liquid'))
      .map((file) => `templates/${file}`)
      .sort();
    try {
      const found = adminEvidence(store, templates, [...evidence.themeApps.keys()], splice);
      site = mergeAdmin(site, found);
    } catch (failure) {
      if (!(failure instanceof AdminError)) throw failure;
      problems.push(`The Admin API was not read: ${failure.message}`);
    }
  }
  const error = problems.join('\n');
  const targetFolder = args.target || projectTarget(splice);

  fs.writeFileSync(path.join(splice, 'triage.md'), report(splice, evidence, site, error));
  if (targetFolder && isDir(targetFolder)) {
    fs.writeFileSync(path.join(splice, 'target.md'), markdown(targetFolder, target(targetFolder)));
  }
  const todo = path.join(splice, 'todo.md');
  const destination = fs.existsSync(todo) ? path.join(splice, 'todo.draft.md') : todo;
  fs.writeFileSync(destination, draft(splice, evidence, site, targetFolder, error));

  console.log(`Wrote ${path.join(splice, 'triage.md')}`);
  if (targetFolder && isDir(targetFolder)) console.log(`Wrote ${path.join(splice, 'target.md')}`);
  console.log(`Wrote ${destination}${destination !== todo ? ' (todo.md exists, so merge this draft into it)' : ''}`);
  if (error) console.log(error);
}

// A run through a symlink, such as packages/tradecraft-tools/skills, still counts as the main module
if (process.argv[1] && import.meta.filename === fs.realpathSync(process.argv[1])) await main();
