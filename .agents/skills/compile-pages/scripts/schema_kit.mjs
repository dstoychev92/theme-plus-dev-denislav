/**
 * Build target-theme template JSON from the target theme's own preset sections.
 *
 * Schema generation means a page made only of the target theme's sections, blocks, and settings, filled with
 * the store's content. Copying a preset section that the theme ships keeps every setting valid. These helpers
 * handle the parts Shopify rejects on upload:
 *
 * - Every block needs an ID that is unique in its section. `fresh` gives a copied tree new IDs.
 * - A static block, one the parent renders by a fixed ID such as `header`, keeps that ID and stays out of
 *   `block_order`. Shopify refuses a static block listed in `block_order`.
 * - A preset carries demo copy in fields the store does not fill. `blank` clears them.
 *
 * Example, from a generator such as `generate/home.mjs`, run from the project root with `node generate/home.mjs`.
 * An import path resolves from the script's folder. A theme path resolves from the working folder.
 *
 *     import { Presets, page } from '../.agents/skills/compile-pages/scripts/schema_kit.mjs';
 *     const presets = new Presets('themes/analog/src');   // every section in the theme's JSON templates
 *     const banner = presets.section('section-banner');    // first banner preset, with fresh IDs
 *     Object.assign(banner.settings, { image: 'shopify://shop_images/hero.jpg' });
 *     ...
 *     page({ hero: banner.data }, 'themes/analog/environments/production/templates/index.json');
 */
import fs from 'node:fs';
import path from 'node:path';

let ids = 0;

export function newId(kind) {
  return `${kind.replace(/^_+|_+$/g, '').replaceAll('-', '_')}_gen${++ids}`;
}

/** A deep copy with new IDs for every block except static ones. */
export function fresh(block) {
  const b = structuredClone(block);
  if (b.blocks && Object.keys(b.blocks).length) {
    const mapping = Object.fromEntries(Object.entries(b.blocks).map(([old, child]) => [old, child.static ? old : newId(child.type)]));
    b.blocks = Object.fromEntries(Object.entries(b.blocks).map(([old, child]) => [mapping[old], fresh(child)]));
    b.block_order = (b.block_order ?? []).map(old => mapping[old]).filter(key => !b.blocks[key].static);
  }
  return b;
}

/** The first block of a type anywhere in a tree. */
export function find(blocks, kind) {
  for (const b of Object.values(blocks ?? {})) {
    if (b.type === kind) return b;
    const hit = find(b.blocks, kind);
    if (hit) return hit;
  }
  return null;
}

/** Replace a section's or block's children, given as `[child, staticId]` pairs. Static children keep their ID and stay out of block_order. */
export function setChildren(parent, children) {
  parent.blocks = {};
  parent.block_order = [];
  for (const [child, staticId] of children) {
    if (staticId) {
      parent.blocks[staticId] = { ...child, static: true };
    } else {
      const copy = { ...child };
      delete copy.static;
      const key = newId(copy.type);
      parent.blocks[key] = copy;
      parent.block_order.push(key);
    }
  }
  return parent;
}

/** Clear preset demo copy, such as a callout body, in fields the store does not fill. */
export function blank(block, ...fields) {
  for (const field of fields) {
    if (block.settings && Object.hasOwn(block.settings, field)) block.settings[field] = '';
  }
  return block;
}

export class Node {
  constructor(data) {
    this.data = data;
  }

  get settings() {
    if (!Object.hasOwn(this.data, 'settings')) this.data.settings = {};
    return this.data.settings;
  }

  find(kind) {
    const hit = find(this.data.blocks, kind);
    return hit ? new Node(fresh(hit)) : null;
  }
}

/** Every section in a theme's JSON templates, including listing presets, by section type. */
export class Presets {
  constructor(...roots) {
    // A Map keeps file order, since an object lists a numeric type such as 404 first
    this.sections = new Map();
    for (const root of roots) {
      for (const file of templateFiles(root)) {
        const bytes = fs.readFileSync(file);
        let data;
        try {
          data = loadThemeJson(bytes);
        } catch {
          continue;
        }
        for (const section of Object.values(data.sections ?? {})) {
          if (!this.sections.has(section.type)) this.sections.set(section.type, []);
          this.sections.get(section.type).push(section);
        }
      }
    }
  }

  /** An instance of a section type, with fresh IDs. `having` picks the first one that contains that block type. */
  section(kind, { index = 0, having = null } = {}) {
    if (!this.sections.has(kind)) throw new Error(`No ${kind} section in the presets`);
    const found = this.sections.get(kind).filter(s => !having || find(s.blocks, having));
    if (!found.length) throw new Error(`No ${kind} section with a ${having} block in the presets`);
    if (found.at(index) === undefined) throw new Error(`No ${kind} section at index ${index}`);
    return new Node(fresh(found.at(index)));
  }

  /** The first block of a type in any section. */
  block(kind) {
    for (const sections of this.sections.values()) {
      for (const section of sections) {
        const hit = find(section.blocks, kind);
        if (hit) return new Node(fresh(hit));
      }
    }
    throw new Error(`No ${kind} block in the presets`);
  }
}

/** A fresh copy of one configured section, such as `src/templates/index.json#<section key>`. */
export function example(pointer, root = 'themes/analog') {
  const parts = pointer.split('#');
  if (parts.length !== 2) throw new Error(`Give the pointer as <file>#<section key>, not ${pointer}`);
  const [file, key] = parts;
  const data = loadThemeJson(fs.readFileSync(path.resolve(root, file)));
  if (!Object.hasOwn(data.sections ?? {}, key)) throw new Error(`No section ${key} in ${file}`);
  return new Node(fresh(data.sections[key]));
}

/** Write a template. `sections` maps a section ID to its data, in page order. */
export function page(sections, file) {
  const out = { sections, order: Object.keys(sections) };
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(out, null, 2) + '\n');
  return file;
}

/** Theme JSON as plain JSON. Shopify accepts comments, such as the header the theme editor writes, and
 * trailing commas before } and ]. Both go. Text inside strings stays as it is. */
export function strictJson(text) {
  let out = '';
  let i = 0;
  const size = text.length;
  while (i < size) {
    const char = text[i];
    if (char === '"') {
      let end = i + 1;
      while (end < size && text[end] !== '"') end += text[end] === '\\' ? 2 : 1;
      out += text.slice(i, end + 1);
      i = end + 1;
    } else if (text.startsWith('/*', i)) {
      const end = text.indexOf('*/', i + 2);
      i = end < 0 ? size : end + 2;
    } else if (text.startsWith('//', i)) {
      const end = text.indexOf('\n', i);
      i = end < 0 ? size : end;
    } else if (char === ',') {
      let rest = i + 1;
      while (rest < size && ' \t\r\n'.includes(text[rest])) rest += 1;
      if (rest >= size || !'}]'.includes(text[rest])) out += char;
      i += 1;
    } else {
      out += char;
      i += 1;
    }
  }
  return out;
}

export function loadThemeJson(data) {
  const text = typeof data === 'string' ? data : new TextDecoder('utf-8', { fatal: true }).decode(data);
  return JSON.parse(strictJson(text));
}

/** The JSON files under any `templates` folder below the root, without hidden files and folders, sorted. */
function templateFiles(root) {
  const found = [];
  const walk = (folder, inTemplates) => {
    for (const name of fs.readdirSync(folder)) {
      if (name.startsWith('.')) continue;
      const full = path.join(folder, name);
      if (fs.statSync(full, { throwIfNoEntry: false })?.isDirectory()) walk(full, inTemplates || name === 'templates');
      else if (inTemplates && name.endsWith('.json')) found.push(full);
    }
  };
  walk(root, false);
  return found.sort();
}
