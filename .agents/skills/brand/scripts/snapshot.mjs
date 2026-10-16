#!/usr/bin/env node
// Theme → sandbox. Renders the theme's brand page offline, with the store's Theme Settings, into
// brand/sandbox/: index.html (the page), settings.css (every value the settings write, as raw CSS
// variables), and the theme's compiled CSS and scripts beside them. Run it from the project root
// after a build:
//
//   node .agents/skills/brand/scripts/snapshot.mjs                 # refuses to replace an edited sandbox
//   node .agents/skills/brand/scripts/snapshot.mjs --force         # replaces it
//   node .agents/skills/brand/scripts/snapshot.mjs --assets-only   # refreshes theme.css and scripts only
//
// --root, --theme, --env, and --settings pick the project, theme, and store settings (lib/project.mjs).

import fs from 'node:fs';
import path from 'node:path';
import {resolveProject} from './lib/project.mjs';
import {createKit} from './lib/liquid.mjs';
import {declarations, stripComments, topLevelBlocks} from './lib/css.mjs';
import {oklchToHex} from './lib/color.mjs';

const args = process.argv.slice(2);
const force = args.includes('--force');
const assetsOnly = args.includes('--assets-only');
const project = resolveProject(args);
const {root, distRoot, sandbox} = project;
const {loadRawSettings, toShopifySettings, createEngine, renderThemeFile, sectionDefaults} = createKit(project);
const relative = (file) => path.relative(root, file);

if (!fs.existsSync(path.join(distRoot, 'sections/page-brand.liquid'))) {
  console.error(`No built theme with the brand page in ${relative(distRoot)}. Run the theme build first.`);
  process.exit(1);
}
if (fs.existsSync(path.join(sandbox, 'index.html')) && !force && !assetsOnly) {
  console.error(`${relative(sandbox)} already has a page. It may hold edits that are not exported yet.`);
  console.error('Export first, pass --assets-only to refresh only the compiled CSS and scripts, or --force to replace it.');
  process.exit(1);
}

// ---------------------------------------------------------------------------------------------
// Render

const raw = loadRawSettings();
const settings = toShopifySettings(raw);
const translations = JSON.parse(fs.readFileSync(path.join(distRoot, 'locales/en.default.json'), 'utf8'));

const {shopName, store} = project;
const sectionSettings = {...sectionDefaults('page-brand'), color_scheme: settings.color_scheme_default};
const globals = {
  shop: {
    name: shopName,
    permanent_domain: store ?? '',
    url: store ? `https://${store}` : '',
    money_format: '${{amount}}',
  },
  request: {design_mode: false, visual_preview_mode: false, locale: {iso_code: 'en'}},
  routes: {
    root_url: '/',
    cart_url: '/cart',
    cart_add_url: '/cart/add',
    cart_change_url: '/cart/change',
    cart_clear_url: '/cart/clear',
    cart_update_url: '/cart/update',
    search_url: '/search',
    predictive_search_url: '/search/suggest',
    product_recommendations_url: '/recommendations/products',
  },
  localization: {country: {iso_code: 'US'}},
  cart: {currency: {iso_code: 'USD'}},
  template: {name: 'page', suffix: 'brand'},
  section: {id: 'brand', index: 1, location: 'template', settings: sectionSettings},
};

const engine = createEngine({settings, translations, globals});
const render = (kind, name, scope) => renderThemeFile(engine, kind, name, scope);

const headType = render('snippets', 'head-type');
const headColor = render('snippets', 'head-color');
const headLayout = render('snippets', 'head-layout');
const headScripts = render('snippets', 'head-scripts');
const sectionHtml = render('sections', 'page-brand');

// ---------------------------------------------------------------------------------------------
// The settings map, from the page itself

const mapMatch = /<script type="application\/json" id="brand-settings-map">([\s\S]*?)<\/script>/.exec(sectionHtml);
if (!mapMatch) throw new Error('The brand page printed no settings map');
const map = JSON.parse(mapMatch[1]);

const settingByVar = new Map();
for (const entry of map.entries) {
  for (const name of entry.vars) if (!settingByVar.has(name)) settingByVar.set(name, entry.setting);
}

// ---------------------------------------------------------------------------------------------
// settings.css

const css = (text) => text.replace(/<\/?style>/g, '').replace(/<!--[\s\S]*?-->/g, '');
const tidy = (text) =>
  text
    .split('\n')
    .map((line) => line.replace(/\s+$/, ''))
    .filter((line, index, lines) => line !== '' || (lines[index - 1] ?? '') !== '')
    .join('\n')
    .trim();

const annotate = (text) =>
  text.replace(/^(\s*)(--[\w-]+)(\s*:\s*[^;]+;)(\s*)$/gm, (line, indent, name, rest) => {
    const setting = settingByVar.get(name);
    return setting ? `${indent}${name}${rest} /* ${setting} */` : line;
  });

// Color: the head prints scheme values once per scheme and again for each role, and each contrast
// partner as a copy. The sandbox writes each value once and points the copies at it.
const colorBlocks = topLevelBlocks(stripComments(css(headColor)));
const colorRoot = new Map();
for (const block of colorBlocks.filter((block) => block.prelude === ':root')) {
  for (const [name, value] of declarations(block.body)) if (!name.endsWith('-fallback')) colorRoot.set(name, value);
}
const schemeIds = settings.color_scheme_group.map((scheme) => scheme.id);
const schemeColors = ['canvas', 'content', 'muted', 'primary', 'primary-contrast', 'secondary', 'sale'];
const contrastPartner = {canvas: 'content', content: 'canvas', secondary: 'canvas', muted: 'canvas', sale: 'canvas'};
const emitted = new Set();
const lines = [];
const emit = (name, value, comment) => {
  emitted.add(name);
  lines.push(`  ${name}: ${value};${comment ? ` /* ${comment} */` : ''}`);
};

for (const id of schemeIds) {
  lines.push('', `  /* Scheme ${id}: color_scheme_group.${id} */`);
  for (const color of schemeColors) {
    const name = `--${id}-${color}-oklch`;
    const value = colorRoot.get(name);
    if (value === undefined) continue;
    emit(name, value, `${oklchToHex(value).hex} color_${color.replace('-', '_')}`);
  }
  lines.push(`  /* ${id}: contrast partners and tuning. The theme derives these. */`);
  for (const [color, partner] of Object.entries(contrastPartner)) {
    emit(`--${id}-${color}-contrast-oklch`, `var(--${id}-${partner}-oklch)`);
  }
  const shadow = colorRoot.get(`--${id}-shadow-oklch`);
  emit(
    `--${id}-shadow-oklch`,
    shadow === colorRoot.get(`--${id}-content-oklch`) ? `var(--${id}-content-oklch)` : shadow,
    'content, or black in a dark scheme',
  );
  for (const [name, value] of colorRoot) {
    if (name.startsWith(`--${id}-`) && !emitted.has(name)) emit(name, value);
  }
}

lines.push('', '  /* Scheme roles: color_scheme_light, _dark, _success, _error point at one scheme each */');
for (const [name, value] of colorRoot) {
  const role = /^--scheme-(light|dark|success|error)-(.+)$/.exec(name);
  if (!role || emitted.has(name)) continue;
  // The scheme the role setting names, never one that only shares a color with it
  const target = settings[`color_scheme_${role[1]}`]?.id;
  emit(name, target && colorRoot.has(`--${target}-${role[2]}`) ? `var(--${target}-${role[2]})` : value);
}

lines.push('', '  /* Fixed colors and tokens built on the roles */');
for (const [name, value] of colorRoot) {
  if (!emitted.has(name)) emit(name, value);
}

const colorCss = `:root {${annotate(lines.join('\n'))}\n}`;

// Scheme classes: the mechanics that switch a subtree to a scheme. Generated, not values.
const schemeClassesCss = tidy(
  colorBlocks
    .filter((block) => block.prelude !== ':root')
    .map(({prelude, body}) => `${prelude.replace(/\s+/g, ' ')} {${body}}`)
    .join('\n\n'),
);

// Type and layout print readable :root blocks already. Drop the font faces: fonts.css loads them.
const typeCss = tidy(annotate(css(headType).replace(/@font-face\s*{[^}]*}/g, '').replace(/<link[\s\S]*?>/g, '')));
const layoutCss = tidy(annotate(css(headLayout)));

// Settings no variable carries. Recorded here so a decision made in the sandbox reaches export.
const liquidOnly = map.entries.filter((entry) => entry.vars.length === 0 && entry.read === 'liquid');
const liquidOnlyCss = [
  ':root {',
  ...liquidOnly.map((entry) => `  --setting-${entry.setting}: ${entry.value === null ? 'none' : entry.value};`),
  '}',
].join('\n');

const banner = (title, text) => `/* ${'='.repeat(94)}\n   ${title}\n${text.map((line) => `   ${line}`).join('\n')}\n   ${'='.repeat(94)} */`;

const settingsCss = [
  banner('SETTINGS', [
    'Every value the Theme Settings write, as the raw CSS variables the theme reads. Edit values here.',
    'A comment names the Theme Setting a variable comes from. The brand skill\'s export.mjs reads this',
    'file back into Theme Settings. Values without a comment are derived or fixed in the theme: change',
    'them only to explore, and expect export to report them as theme changes, not settings.',
    `Rendered from ${relative(raw.dataFile)}${raw.presetName ? ` (preset ${raw.presetName})` : ''}.`,
  ]),
  '',
  banner('COLOR', [
    'oklch triplets: lightness%, chroma, hue. The comment shows the hex the setting stores.',
    'A scheme with a canvas lightness under 50 is dark: the theme then uses the dark mix steps and a',
    'black shadow. Those derived values do not follow an edit here, so recheck them after one.',
  ]),
  colorCss,
  '',
  banner('TYPE', [
    'Four font roles, then thirteen presets. A preset points at a role and a step of the scale.',
    'To change a family, change --root-font-stack-{role} and add the family to fonts.css.',
    'The scale is --font-r1 to --font-r15 at mobile, 640px, and 1024px. The theme offers three scales.',
  ]),
  typeCss,
  '',
  banner('LAYOUT, SHAPE, AND BUTTONS', ['Spacing sizes, page width, rhythm, the three radii, and the role radii.']),
  layoutCss,
  '',
  banner('LIQUID-ONLY SETTINGS', [
    'These settings pick markup in a snippet, so changing them here does not change this page.',
    'Record a decision here, change the markup to match, and export carries it to Theme Settings.',
  ]),
  liquidOnlyCss,
  '',
].join('\n');

// ---------------------------------------------------------------------------------------------
// fonts.css: the families the roles use, from Google Fonts

const typeRoot = new Map();
for (const block of topLevelBlocks(stripComments(typeCss)).filter((block) => block.prelude === ':root')) {
  for (const [name, value] of declarations(block.body)) typeRoot.set(name, value);
}
const families = new Map();
for (const role of ['heading', 'subheading', 'accent', 'body']) {
  const family = typeRoot.get(`--root-font-stack-${role}`)?.split(',')[0].trim().replace(/^["']|["']$/g, '');
  if (!family) continue;
  const weights = families.get(family) ?? new Set();
  for (const key of ['normal', 'bold']) weights.add(Number(typeRoot.get(`--root-font-weight-${key}-${role}`)));
  families.set(family, weights);
}
const fontFamilies = [...families.entries()].map(([family, weights]) => {
  const sorted = [...weights].filter(Boolean).sort((a, b) => a - b);
  const axis = [...sorted.map((weight) => `0,${weight}`), ...sorted.map((weight) => `1,${weight}`)].join(';');
  return `family=${family.replace(/ /g, '+')}:ital,wght@${axis}`;
});
const fontsCss = [
  '/* The font families the type roles use. The store serves them from Shopify\'s font library;',
  '   the sandbox loads the same families from Google Fonts. Add a family here when you change a',
  '   --root-font-stack-{role} in settings.css. */',
  `@import url('https://fonts.googleapis.com/css2?${fontFamilies.join('&')}&display=swap');`,
  '',
].join('\n');

// ---------------------------------------------------------------------------------------------
// index.html

const defaultScheme = settings.color_scheme_default?.id ?? schemeIds[0];
const indexHtml = `<!doctype html>
<!--
  Brand sandbox, rendered from the theme's brand page (sections/page-brand.liquid) by the brand
  skill's snapshot.mjs. Edit freely: this page is where the brand gets decided. Use only classes
  theme.css already has, and put values in settings.css. See README.md.
-->
<html lang="en" dir="ltr" class="vars-${defaultScheme} relative bg-canvas" data-fonts-loading="true" data-alpine-loading="true">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
    <title>${shopName} brand sandbox</title>
    <link rel="stylesheet" href="fonts.css">
    <link rel="stylesheet" href="settings.css" id="brand-settings">
    <script>
      // ?settings=directions/name.css shows another settings file, to compare directions side by side
      const settingsFile = new URLSearchParams(location.search).get('settings');
      if (settingsFile && /^[\\w./-]+\\.css$/.test(settingsFile)) document.getElementById('brand-settings').href = settingsFile;
    </script>
    <link rel="stylesheet" href="scheme-classes.css">
${tidy(headScripts)
  .split('\n')
  .map((line) => `    ${line}`)
  .join('\n')}
    <link rel="stylesheet" href="theme.css">
  </head>
  <body class="group/body relative bg-canvas text-content font-family-body" x-data :data-keyboard-active="$isKeyboardActive">
    <main id="MainContent">
      <div class="shopify-section section-page-brand" data-has-intersected="true">
${tidy(sectionHtml)}
      </div>
    </main>
  </body>
</html>
`;

// ---------------------------------------------------------------------------------------------
// Write

fs.mkdirSync(path.join(sandbox, 'assets'), {recursive: true});
if (!assetsOnly) {
  fs.writeFileSync(path.join(sandbox, 'index.html'), indexHtml);
  fs.writeFileSync(path.join(sandbox, 'settings.css'), settingsCss);
  // What the theme printed, so export can tell an edit from the starting value
  fs.mkdirSync(path.join(sandbox, '.snapshot'), {recursive: true});
  fs.writeFileSync(path.join(sandbox, '.snapshot/settings.css'), settingsCss);
  fs.writeFileSync(path.join(sandbox, '.snapshot/README.md'), 'The settings.css the last snapshot wrote. export.mjs diffs against it. Do not edit.\n');
  fs.writeFileSync(
    path.join(sandbox, 'scheme-classes.css'),
    `/* Generated by the brand skill's snapshot.mjs from snippets/head-color.liquid. Do not edit.\n   Switches a subtree to a scheme: .vars-{scheme id} points the token variables at that scheme. */\n\n${schemeClassesCss}\n`,
  );
  fs.writeFileSync(path.join(sandbox, 'fonts.css'), fontsCss);
  fs.writeFileSync(path.join(sandbox, 'settings-map.json'), `${JSON.stringify(map, null, 2)}\n`);
}
fs.copyFileSync(path.join(distRoot, 'assets/theme.css'), path.join(sandbox, 'theme.css'));

// The scripts the head loads, and every module they import
const queue = [...headScripts.matchAll(/\.\/assets\/([\w.-]+\.js)/g)].map((match) => match[1]);
const copied = new Set();
while (queue.length) {
  const file = queue.shift();
  if (copied.has(file) || !fs.existsSync(path.join(distRoot, 'assets', file))) continue;
  copied.add(file);
  const source = fs.readFileSync(path.join(distRoot, 'assets', file), 'utf8');
  fs.writeFileSync(path.join(sandbox, 'assets', file), source);
  for (const match of source.matchAll(/(?:from|import)\s*\(?\s*["']\.\/([\w.-]+\.js)["']/g)) queue.push(match[1]);
}

if (assetsOnly) {
  console.log(`Refreshed theme.css and ${copied.size} scripts in ${relative(sandbox)}.`);
} else {
  console.log(`Wrote ${relative(sandbox)}: index.html, settings.css, scheme-classes.css, fonts.css, settings-map.json,`);
  console.log(`theme.css, and ${copied.size} scripts. ${map.entries.length} settings in the map.`);
}
console.log('Serve it with serve.mjs; the theme\'s scripts do not load from file://.');
