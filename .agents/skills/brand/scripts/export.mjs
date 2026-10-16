#!/usr/bin/env node
// Sandbox → brand. Reads brand/sandbox/settings.css back into Theme Settings with the read rules in
// the settings map, and writes brand/visual/:
//   tokens.css            the sandbox's settings.css, the values the brand is built on
//   theme-settings.json   every mapped setting with its value, and what changed since the snapshot
//   settings-map.json     the map the values were read with
//
//   node .agents/skills/brand/scripts/export.mjs            # writes brand/visual and prints the changes
//   node .agents/skills/brand/scripts/export.mjs --apply    # also writes the changes into the store settings
//
// --root, --theme, --env, and --settings pick the project, theme, and store settings (lib/project.mjs).

import fs from 'node:fs';
import path from 'node:path';
import {resolveProject} from './lib/project.mjs';
import {readRootVariables, reference, resolve} from './lib/css.mjs';
import {oklchToHex} from './lib/color.mjs';

const args = process.argv.slice(2);
const apply = args.includes('--apply');
const project = resolveProject(args);
const {root, themeRoot, sandbox, visual} = project;
const {parse: parseJsonc} = project.require('jsonc-parser');

const settingsCss = fs.readFileSync(path.join(sandbox, 'settings.css'), 'utf8');
const baselineCss = fs.readFileSync(path.join(sandbox, '.snapshot/settings.css'), 'utf8');
const map = JSON.parse(fs.readFileSync(path.join(sandbox, 'settings-map.json'), 'utf8'));
const indexHtml = fs.readFileSync(path.join(sandbox, 'index.html'), 'utf8');

const variables = readRootVariables(settingsCss);
const baseline = readRootVariables(baselineCss);
const current = Object.fromEntries(map.entries.map((entry) => [entry.setting, entry.value]));

// The built-in preset table and the three type scales, as the theme defines them
const PRESETS = {
  p: ['body', 4, false], h6: ['heading', 4, false], h5: ['heading', 5, false], h4: ['heading', 6, false],
  h3: ['heading', 7, false], h2: ['heading', 8, false], h1: ['heading', 10, false], button: ['heading', 4, false],
  accordion: ['subheading', 4, false], tab: ['heading', 4, false], section: ['heading', 7, false],
  kicker: ['accent', 4, true], micro: ['body', 2, true],
};
const ROLES = ['heading', 'subheading', 'accent', 'body'];
const constants = fs.readFileSync(path.join(themeRoot, 'constants.yml'), 'utf8');
const scale = (name) => JSON.parse(new RegExp(`^${name}:\\s*(\\[.*\\])`, 'm').exec(constants)[1]);
const SCALES = Object.fromEntries(
  [['sm', 'small'], ['md', 'medium'], ['lg', 'large']].map(([key, word]) => [
    key,
    {0: scale(`font_system_${word}_mobile`), 640: scale(`font_system_${word}_tablet`), 1024: scale(`font_system_${word}_desktop`)},
  ]),
);

const warnings = [];
const at = (name, width = 0) => resolve(variables, name, width);
const raw = (name) => variables.base.get(name);
const number = (value) => parseFloat(value);

// Each read rule turns the variables an entry lists back into its setting value
const readers = {
  oklch: (entry) => {
    const value = at(entry.vars[0]);
    const {hex, clipped} = oklchToHex(value);
    if (clipped) warnings.push(`${entry.setting}: ${value} is outside sRGB. Theme Settings store ${hex}.`);
    return hex;
  },
  color: (entry) => at(entry.vars[0]),
  px: (entry) => number(at(entry.vars[0])),
  percent: (entry) => number(at(entry.vars[0])),
  number: (entry) => number(at(entry.vars[0])),
  font: (entry) => {
    const role = entry.vars[0].replace('--root-font-stack-', '');
    const family = at(entry.vars[0]).split(',')[0].trim().replace(/^["']|["']$/g, '');
    const weight = number(at(`--root-font-weight-normal-${role}`));
    const style = at(`--root-font-style-${role}`) === 'italic' ? 'italic' : 'normal';
    return {family, weight, style};
  },
  'ratio-100': (entry) => Math.round(number(at(entry.vars[0])) * 100),
  'em-1000': (entry) => Math.round(number(at(entry.vars[0])) * 1000),
  'any-not-1': (entry) => entry.vars.some((name) => number(at(name)) !== 1),
  'any-not-0.125em': (entry) => entry.vars.some((name) => at(name) !== '0.125em'),
  'type-scale': () => {
    const read = (width) => Array.from({length: 15}, (_, index) => number(at(`--font-r${index + 1}`, width)));
    const match = Object.entries(SCALES).find(([, widths]) =>
      Object.entries(widths).every(([width, values]) => read(Number(width)).every((value, index) => value === values[index])),
    );
    if (match) return match[0];
    warnings.push('font_scaling_system: the --font-r values match no theme scale. Pick sm, md, or lg, or change constants.yml in the theme.');
    return current.font_scaling_system;
  },
  'type-preset': (entry) => {
    const preset = entry.setting.replace('type_preset_', '');
    const stack = reference(raw(`--root-font-stack-${preset}`))?.replace('--root-font-stack-', '');
    if (!stack) return entry.value;
    if (!ROLES.includes(stack)) return {...entry.value, preset: stack};
    const size = Number(reference(raw(`--root-font-size-${preset}-md`))?.replace('--font-r', ''));
    const uppercase = raw(`--root-caps-transform-${preset}`) === 'uppercase';
    const [font, defaultSize, defaultUppercase] = PRESETS[preset];
    if (stack === font && size === defaultSize && uppercase === defaultUppercase) return {...entry.value, preset: 'preset'};
    return {preset: 'custom', font: stack, size, uppercase};
  },
  'space-size': (entry) => {
    const value = at(entry.vars[0]);
    const size = ['sm', 'md', 'lg'].find((name) => at(`--raw-space-${name}`) === value);
    if (!size) warnings.push(`${entry.setting}: ${value} is none of the three spacing sizes.`);
    return size ?? entry.value;
  },
  'space-size-or-custom': (entry) => ['sm', 'md', 'lg'].find((name) => at(`--raw-space-${name}`) === at(entry.vars[0])) ?? 'custom',
  'px-if-custom': (entry) => number(at(entry.vars[0])),
  'radius-ref': (entry) => reference(raw(entry.vars[0]))?.replace('--radius-', '') ?? entry.value,
  'radius-ref-or-element': (entry) => {
    const name = reference(raw(entry.vars[0]))?.replace('--radius-', '');
    return !name || name === 'element-default' ? entry.value : name;
  },
  'not-0': (entry) => number(at(entry.vars[0])) !== 0,
  'not-element-ref': (entry) => reference(raw(entry.vars[0])) !== '--radius-element-default',
  'is-98': (entry) => at(entry.vars[0]) === '98%',
  'scheme-ref': (entry) => {
    const target = reference(raw(entry.vars[0]));
    const match = target && /^--(.+)-canvas-oklch$/.exec(target);
    return match ? match[1] : entry.value;
  },
  'html-class': (entry) => /<html[^>]*class="[^"]*\bvars-([\w-]+)/.exec(indexHtml)?.[1] ?? entry.value,
  liquid: (entry) => {
    const value = raw(`--setting-${entry.setting}`);
    if (value === undefined) return entry.value;
    if (value === 'true' || value === 'false') return value === 'true';
    if (value === 'none') return null;
    return /^-?\d+(\.\d+)?$/.test(value) ? Number(value) : value;
  },
};

const values = {};
for (const entry of map.entries) {
  const reader = readers[entry.read];
  if (!reader) throw new Error(`No reader for ${entry.read} (${entry.setting})`);
  values[entry.setting] = reader(entry);
}

// A setting another setting switches off keeps its stored value: the variables cannot say it
const gates = {
  btn_stroke_bg_opacity: () => values.btn_stroke_show_background,
  btn_soft_border_thickness: () => values.btn_soft_show_border,
  btn_soft_border_opacity: () => values.btn_soft_show_border,
  grid_spacing_card_custom: () => values.grid_spacing_card === 'custom',
  card_badge_rounding: () => values.set_card_badge_rounding,
};
for (const role of ROLES) {
  gates[`font_adjust_${role}`] = () => values.font_rebalance;
  gates[`font_caps_tracking_${role}`] = () => values.font_caps_tracking;
}
for (const [setting, isOn] of Object.entries(gates)) {
  if (setting in values && !isOn()) values[setting] = current[setting];
}

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const changed = map.entries
  .filter((entry) => !same(values[entry.setting], entry.value))
  .map((entry) => ({setting: entry.setting, from: entry.value, to: values[entry.setting]}));

// Variables that changed but carry no setting: theme changes, not settings
const mappedVars = new Set(map.entries.flatMap((entry) => entry.vars));
const themeChanges = [];
const allNames = new Set([...variables.base.keys(), ...baseline.base.keys()]);
for (const name of allNames) {
  if (mappedVars.has(name) || name.startsWith('--setting-')) continue;
  for (const width of [0, 640, 1024]) {
    const before = resolve(baseline, name, width);
    const after = resolve(variables, name, width);
    if (before !== after) {
      themeChanges.push({variable: name, width, from: before ?? null, to: after ?? null});
      break;
    }
  }
}

// ---------------------------------------------------------------------------------------------
// Write brand/visual

fs.mkdirSync(visual, {recursive: true});
fs.writeFileSync(
  path.join(visual, 'tokens.css'),
  `/* Exported from brand/sandbox/settings.css by the brand skill's export.mjs. Do not edit here: edit\n   the sandbox and export again, so the two never disagree. */\n\n${settingsCss}`,
);
fs.writeFileSync(path.join(visual, 'settings-map.json'), `${JSON.stringify(map, null, 2)}\n`);

const handle = (font) => `${font.family.toLowerCase().replace(/\s+/g, '_')}_${font.style === 'italic' ? 'i' : 'n'}${font.weight / 100}`;
const themeSettings = {
  about:
    'The Theme Setting values the brand sandbox describes, read from brand/visual/tokens.css with the read rules in settings-map.json. changed lists what differs from the store when the sandbox was made. theme_changes lists edited variables no setting controls: those need a theme change or a decision to drop them.',
  source: 'brand/sandbox/settings.css',
  settings: Object.fromEntries(
    map.entries.map((entry) => {
      const value = values[entry.setting];
      return [entry.setting, entry.read === 'font' ? {...value, handle: handle(value)} : value];
    }),
  ),
  changed,
  theme_changes: themeChanges,
  warnings,
};
fs.writeFileSync(path.join(visual, 'theme-settings.json'), `${JSON.stringify(themeSettings, null, 2)}\n`);

// ---------------------------------------------------------------------------------------------
// Apply to the store's settings_data.json

if (apply && changed.length) {
  const dataFile = project.dataFile;
  const data = parseJsonc(fs.readFileSync(dataFile, 'utf8'));
  if (typeof data.current === 'string') data.current = structuredClone(data.presets[data.current]);

  for (const {setting, to} of changed) {
    if (setting.startsWith('color_scheme_group.')) {
      const [, scheme, key] = setting.split('.');
      data.current.color_scheme_group[scheme].settings[key] = to;
    } else if (setting.startsWith('type_preset_')) {
      const preset = setting.replace('type_preset_', '');
      data.current[setting] = to.preset;
      if (to.preset === 'custom') {
        data.current[`type_font_${preset}`] = to.font;
        data.current[`type_size_${preset}`] = to.size;
        data.current[`type_uppercase_${preset}`] = to.uppercase;
      }
    } else if (setting.startsWith('font_family_')) {
      data.current[setting] = handle(to);
    } else {
      data.current[setting] = to;
    }
  }
  const target = project.writeFile ?? dataFile;
  fs.mkdirSync(path.dirname(target), {recursive: true});
  fs.writeFileSync(target, `${JSON.stringify(data, null, 2)}\n`);
  console.log(`Applied ${changed.length} changes to ${path.relative(root, target)}. Review the diff before you deploy.`);
}

// ---------------------------------------------------------------------------------------------
// Report

console.log(`Exported ${map.entries.length} settings to ${path.relative(root, visual)}.`);
if (changed.length) {
  console.log(`\n${changed.length} settings changed:`);
  for (const {setting, from, to} of changed) console.log(`  ${setting}: ${JSON.stringify(from)} → ${JSON.stringify(to)}`);
} else {
  console.log('No setting changed since the snapshot.');
}
if (themeChanges.length) {
  console.log(`\n${themeChanges.length} variables changed that no setting controls:`);
  for (const {variable, from, to} of themeChanges) console.log(`  ${variable}: ${from} → ${to}`);
}
if (warnings.length) {
  console.log('\nWarnings:');
  for (const warning of warnings) console.log(`  ${warning}`);
}
if (changed.length && !apply) console.log('\nRun with --apply to write the changes into the store settings.');
