// Renders the built theme's Liquid in Node, close enough to Shopify for the brand page: the
// theme's own snippets resolve, Theme Settings come from the store's settings_data.json, and
// colors, fonts, and color schemes behave like Shopify's objects. Adapted from the Playwright
// harness in method-monorepo/themes/analog/playwright/support.

import fs from 'node:fs';
import path from 'node:path';
import {formatOklch, hexToHsl, hexToOklch, parseHex} from './color.mjs';

// liquidjs and jsonc-parser load from the project's theme, so the skill ships no dependencies
export function createKit(project) {
  const {Liquid, Drop, defaultOperators} = project.require('liquidjs');
  const {parse: parseJsonc} = project.require('jsonc-parser');
  const {distRoot} = project;

  // ---------------------------------------------------------------------------------------------
  // Shopify objects

  class ColorDrop extends Drop {
    constructor(hex) {
      super();
      this.hex = String(hex).toLowerCase();
      const {red, green, blue, alpha} = parseHex(this.hex);
      const hsl = hexToHsl(this.hex);
      Object.assign(this, {red, green, blue, alpha, hue: hsl.hue, saturation: hsl.saturation, lightness: hsl.lightness});
      this.rgb = `${red} ${green} ${blue}`;
      this.oklch = formatOklch(hexToOklch(this.hex));
    }
    valueOf() {
      return this.hex;
    }
    toString() {
      return this.hex;
    }
    toJSON() {
      return this.hex;
    }
  }

  // Family names whose capitals a font handle loses
  const FAMILY_NAMES = {
    dm_sans: 'DM Sans',
    dm_serif_display: 'DM Serif Display',
    eb_garamond: 'EB Garamond',
    ibm_plex_sans: 'IBM Plex Sans',
    ibm_plex_serif: 'IBM Plex Serif',
    ibm_plex_mono: 'IBM Plex Mono',
    pt_sans: 'PT Sans',
    pt_serif: 'PT Serif',
    pt_mono: 'PT Mono',
  };

  class FontDrop extends Drop {
    constructor({family, weight, style, fallback_families = 'sans-serif', baseline_ratio = 0.15}) {
      super();
      Object.assign(this, {family, weight, style, fallback_families, baseline_ratio});
      this['system?'] = false;
    }
    static fromHandle(handle) {
      const match = /^(.+)_([ni])(\d)$/.exec(String(handle));
      if (!match) throw new Error(`Not a font handle: ${handle}`);
      const [, slug, styleCode, weightCode] = match;
      const family =
        FAMILY_NAMES[slug] ?? slug.split('_').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      return new FontDrop({family, weight: Number(weightCode) * 100, style: styleCode === 'i' ? 'italic' : 'normal'});
    }
    get handle() {
      return `${this.family.toLowerCase().replace(/\s+/g, '_')}_${this.style === 'italic' ? 'i' : 'n'}${this.weight / 100}`;
    }
    valueOf() {
      return this.handle;
    }
    toJSON() {
      return {family: this.family, weight: this.weight, style: this.style};
    }
  }

  class SchemeDrop extends Drop {
    constructor(id, settings) {
      super();
      this.id = id;
      this.settings = settings;
    }
    valueOf() {
      return this.id;
    }
    toJSON() {
      return this.id;
    }
  }

  // ---------------------------------------------------------------------------------------------
  // Settings

  function readJsonc(file) {
    return parseJsonc(fs.readFileSync(file, 'utf8'));
  }

  // Plain values: schema defaults overlaid with the store's current settings
  function loadRawSettings(dataFile = project.dataFile) {
    const schema = readJsonc(path.join(distRoot, 'config/settings_schema.json'));
    const types = {};
    const values = {};
    const schemeDefinition = {};

    for (const group of schema) {
      for (const setting of group.settings ?? []) {
        if (!setting.id) continue;
        types[setting.id] = setting.type;
        if (setting.type === 'color_scheme_group') {
          for (const field of setting.definition ?? []) schemeDefinition[field.id] = field.default;
          continue;
        }
        if ('default' in setting) values[setting.id] = setting.default;
      }
    }

    const data = readJsonc(dataFile);
    const current = typeof data.current === 'string' ? data.presets[data.current] : data.current;
    Object.assign(values, structuredClone(current));

    return {schema, types, values, schemeDefinition, dataFile, presetName: typeof data.current === 'string' ? data.current : null};
  }

  // Shopify-shaped settings: colors, fonts, and schemes become objects
  function toShopifySettings({types, values, schemeDefinition}) {
    const settings = {...values};

    const schemes = Object.entries(values.color_scheme_group ?? {}).map(([id, scheme]) => {
      const schemeSettings = {};
      for (const [key, fallback] of Object.entries(schemeDefinition)) {
        const value = scheme.settings?.[key] ?? fallback;
        schemeSettings[key] = typeof value === 'string' && value.startsWith('#') ? new ColorDrop(value) : value;
      }
      return new SchemeDrop(id, schemeSettings);
    });
    settings.color_scheme_group = schemes;

    for (const [id, type] of Object.entries(types)) {
      const value = values[id];
      // An unset color_scheme setting falls back to the first scheme in the group
      if (type === 'color_scheme' && !value) settings[id] = schemes[0];
      if (value === undefined || value === null || value === '') continue;
      if (type === 'color' && typeof value === 'string') settings[id] = new ColorDrop(value);
      if (type === 'font_picker') settings[id] = FontDrop.fromHandle(value);
      if (type === 'color_scheme') settings[id] = schemes.find((scheme) => scheme.id === value) ?? schemes[0];
    }

    return settings;
  }

  // ---------------------------------------------------------------------------------------------
  // Engine

  // Shopify Liquid treats nil == blank as true
  const isBlankish = (value) => {
    if (value === null || value === undefined || value === '' || value === false) return true;
    const name = value?.constructor?.name;
    return name === 'BlankDrop' || name === 'NullDrop' || name === 'EmptyDrop';
  };
  const isBlankKeyword = (value) => value?.constructor?.name === 'BlankDrop';
  const shopifyEquals = (lhs, rhs) => {
    if (isBlankKeyword(lhs) && isBlankish(rhs)) return true;
    if (isBlankKeyword(rhs) && isBlankish(lhs)) return true;
    // A color, font, or scheme equals another of its kind, or a string, by value
    const isShopifyObject = (value) => value instanceof ColorDrop || value instanceof FontDrop || value instanceof SchemeDrop;
    if ((isShopifyObject(lhs) || isShopifyObject(rhs)) && !isBlankish(lhs) && !isBlankish(rhs)) {
      const left = isShopifyObject(lhs) ? lhs.valueOf() : lhs;
      const right = isShopifyObject(rhs) ? rhs.valueOf() : rhs;
      return left === right;
    }
    return defaultOperators['=='](lhs, rhs);
  };

  function nullBlockTag(endTag) {
    return {
      parse(tagToken, remainTokens) {
        const stream = this.liquid.parser
          .parseStream(remainTokens)
          .on(`tag:${endTag}`, () => stream.stop())
          .on('end', () => {
            throw new Error(`'${endTag}' not found`);
          });
        stream.start();
      },
      render() {
        return '';
      },
    };
  }

  function wrappingTag(endTag, open, close) {
    return {
      parse(tagToken, remainTokens) {
        this.templates = [];
        const stream = this.liquid.parser
          .parseStream(remainTokens)
          .on(`tag:${endTag}`, () => stream.stop())
          .on('template', (template) => this.templates.push(template))
          .on('end', () => {
            throw new Error(`'${endTag}' not found`);
          });
        stream.start();
      },
      *render(context, emitter) {
        emitter.write(open);
        yield this.liquid.renderer.renderTemplates(this.templates, context, emitter);
        emitter.write(close);
      },
    };
  }

  function createEngine({settings, translations, globals = {}, onStylesheet}) {
    const readTheme = (kind, name) => fs.readFileSync(path.join(distRoot, kind, `${name}.liquid`), 'utf8');

    const engine = new Liquid({
      cache: true,
      extname: '.liquid',
      relativeReference: false,
      ownPropertyOnly: false,
      operators: {
        ...defaultOperators,
        '==': shopifyEquals,
        '!=': (lhs, rhs) => !shopifyEquals(lhs, rhs),
      },
      globals: {settings, ...globals},
      fs: {
        existsSync: (file) => fs.existsSync(path.join(distRoot, 'snippets', `${file}.liquid`)),
        readFileSync: (file) => readTheme('snippets', file),
        resolve: (_root, file) => file,
      },
    });

    // Shopify filters the brand page and its snippets use
    engine.registerFilter('t', function (key, ...args) {
      let value = key.split('.').reduce((node, part) => node?.[part], translations);
      if (value === undefined) return key;
      const vars = Object.fromEntries(args.filter(Array.isArray));
      if (typeof value === 'object') value = Number(vars.count) === 1 ? value.one : value.other;
      return engine.parseAndRenderSync(String(value), vars);
    });
    engine.registerFilter('asset_url', (name) => `./assets/${name}`);
    engine.registerFilter('file_url', (name) => `./assets/${name}`);
    engine.registerFilter('stylesheet_tag', (url) => `<link href="${url}" rel="stylesheet" type="text/css" media="all" />`);
    engine.registerFilter('image_url', () => '');
    engine.registerFilter('image_tag', () => '');
    engine.registerFilter('placeholder_svg_tag', () => '');
    engine.registerFilter('font_face', () => '');
    engine.registerFilter('font_url', () => '');
    engine.registerFilter('font_modify', (font, property, modifier) => {
      if (!(font instanceof FontDrop)) return null;
      if (property === 'style') return new FontDrop({...font.toJSON(), style: modifier === 'normal' ? 'normal' : 'italic'});
      let weight = font.weight;
      if (modifier === 'bolder') weight = font.weight + 300;
      else if (modifier === 'lighter') weight = font.weight - 300;
      else if (/^[+-]\d+$/.test(modifier)) weight = font.weight + Number(modifier);
      else if (/^\d+$/.test(modifier)) weight = Number(modifier);
      if (weight < 100 || weight > 900) return null;
      return new FontDrop({...font.toJSON(), weight});
    });
    engine.registerFilter('handle', (input) =>
      String(input ?? '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, ''),
    );
    engine.registerFilter('handleize', (input) =>
      String(input ?? '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, ''),
    );
    // Ruby's String#split(' ') splits on runs of whitespace and drops empty parts
    engine.registerFilter('split', (input, separator) => {
      const text = String(input ?? '');
      if (separator === ' ') return text.split(/\s+/).filter(Boolean);
      return text.split(separator).filter((part, index, parts) => !(part === '' && index === parts.length - 1));
    });
    engine.registerFilter('reject', (list, property, value = true) =>
      Array.isArray(list) ? list.filter((item) => item?.[property] !== value) : list,
    );

    engine.registerTag('schema', nullBlockTag('endschema'));
    engine.registerTag('doc', nullBlockTag('enddoc'));
    engine.registerTag('javascript', nullBlockTag('endjavascript'));
    engine.registerTag('style', wrappingTag('endstyle', '<style>', '</style>'));
    engine.registerTag('stylesheet', {
      parse(tagToken, remainTokens) {
        let css = '';
        const stream = this.liquid.parser
          .parseStream(remainTokens)
          .on('tag:endstylesheet', () => stream.stop())
          .on('template', (template) => {
            css += template.str ?? '';
          })
          .on('end', () => {
            throw new Error(`'endstylesheet' not found`);
          });
        stream.start();
        onStylesheet?.(css);
      },
      render() {
        return '';
      },
    });

    return engine;
  }

  function renderThemeFile(engine, kind, name, scope = {}) {
    const source = fs.readFileSync(path.join(distRoot, kind, `${name}.liquid`), 'utf8');
    return engine.parseAndRenderSync(source, scope);
  }

  function readSectionSchema(name) {
    const source = fs.readFileSync(path.join(distRoot, 'sections', `${name}.liquid`), 'utf8');
    const match = /{%-?\s*schema\s*-?%}([\s\S]*?){%-?\s*endschema\s*-?%}/.exec(source);
    return match ? parseJsonc(match[1]) : {settings: []};
  }

  function sectionDefaults(name) {
    const schema = readSectionSchema(name);
    const settings = {};
    for (const setting of schema.settings ?? []) {
      if (setting.id && 'default' in setting) settings[setting.id] = setting.default;
    }
    return settings;
  }

  return {
    ColorDrop,
    FontDrop,
    SchemeDrop,
    readJsonc,
    loadRawSettings,
    toShopifySettings,
    createEngine,
    renderThemeFile,
    readSectionSchema,
    sectionDefaults,
  };
}
