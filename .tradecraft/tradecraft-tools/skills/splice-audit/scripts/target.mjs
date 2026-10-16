/**
 * What the target theme can do: its sections and blocks with their settings, and its theme settings.
 *
 * Reads schema text with patterns, so it works on source with build directives and on compiled themes alike.
 */
import fs from 'node:fs';
import path from 'node:path';

import {isDir, readText} from './triage.mjs';

/** A source theme keeps its Shopify folders in src/. */
function sourceRoot(theme) {
  return isDir(path.join(theme, 'src', 'sections')) ? path.join(theme, 'src') : theme;
}

function schemaOf(file) {
  const found = /\{%-?\s*schema\s*-?%\}(.*?)\{%-?\s*endschema\s*-?%\}/s.exec(readText(file));
  return found ? found[1] : '';
}

const all = (text, pattern) => [...text.matchAll(pattern)].map((match) => match[1]);

function describe(schema) {
  const name = /"name"\s*:\s*"([^"]+)"/.exec(schema);
  const blocks = schema.includes('"blocks"')
    ? all(schema.split('"settings"')[0], /"type"\s*:\s*"(@theme|@app|_?[a-z0-9-]+)"\s*[,}]/g)
    : [];
  return {
    name: name ? name[1] : '',
    labels: [...new Set(all(schema, /"label"\s*:\s*"([^"]+)"/g))],
    fragments: all(schema, /\[%\s*json\s+'([^']+)'/g).map((fragment) => path.basename(fragment).split('.')[0]),
    blocks: [...new Set(blocks)],
  };
}

export function target(theme) {
  const root = sourceRoot(theme);
  const result = {sections: [], blocks: [], settings: []};
  for (const kind of ['sections', 'blocks']) {
    const folder = path.join(root, kind);
    for (const name of isDir(folder) ? fs.readdirSync(folder).sort() : []) {
      if (name.endsWith('.liquid')) {
        const info = describe(schemaOf(path.join(folder, name)));
        // Files without a schema, such as rendering-only sections, offer nothing to set
        if (info.name || info.labels.length) result[kind].push({file: `${kind}/${name}`, ...info});
      }
    }
  }
  const config = path.join(root, 'config', 'settings_schema.json');
  if (fs.existsSync(config)) {
    // Each group opens with "name"; its settings follow until the next group
    for (const group of readText(config).split(/\{\s*"name"\s*:/).slice(1)) {
      const name = /^\s*"([^"]+)"/.exec(group);
      const labels = all(group, /"label"\s*:\s*"([^"]+)"/g);
      if (name && name[1] !== 'theme_info') result.settings.push({group: name[1], labels: [...new Set(labels)]});
    }
  }
  return result;
}

export function markdown(theme, info, labelLimit = 14) {
  const shown = (labels) => labels.slice(0, labelLimit).join(', ') + (labels.length > labelLimit ? ' ...' : '');
  const lines = [`# What ${path.basename(path.resolve(theme))} can do`, '',
    'Use this to answer "what does the target theme already have" for each to-do item. Labels come from the',
    'schemas. A shared settings file, such as a padding or width group, appears as a fragment name.', ''];
  lines.push('## Theme settings', '');
  for (const group of info.settings) lines.push(`- **${group.group}**: ${shown(group.labels)}`);
  for (const kind of ['sections', 'blocks']) {
    lines.push('', `## ${kind[0].toUpperCase()}${kind.slice(1)}`, '', '| File | Name | Settings | Shared settings | Blocks |', '| --- | --- | --- | --- | --- |');
    for (const item of info[kind]) {
      lines.push(`| ${item.file} | ${item.name} | ${shown(item.labels)} | ${item.fragments.join(', ')} | ${item.blocks.join(', ')} |`);
    }
  }
  return `${lines.join('\n')}\n`;
}
