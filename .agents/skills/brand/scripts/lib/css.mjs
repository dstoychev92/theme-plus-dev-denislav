// A small reader for the CSS the theme's head snippets print and the sandbox's settings.css:
// top-level blocks, custom property declarations, nested @media blocks, and var() resolution.

export function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/<!--[\s\S]*?-->/g, '');
}

// Splits CSS into top-level {prelude, body} blocks by brace matching
export function topLevelBlocks(css) {
  const blocks = [];
  let depth = 0;
  let start = 0;
  let preludeStart = 0;
  for (let index = 0; index < css.length; index++) {
    const character = css[index];
    if (character === '{') {
      if (depth === 0) start = index;
      depth++;
    } else if (character === '}') {
      depth--;
      if (depth === 0) {
        // Declarations can precede a nested block, so the prelude starts after the last one
        const prelude = css.slice(preludeStart, start).split(';').pop().trim();
        blocks.push({prelude, body: css.slice(start + 1, index)});
        preludeStart = index + 1;
      }
    }
  }
  return blocks;
}

// Declarations directly inside a block body, skipping nested blocks
export function declarations(body) {
  const flat = [];
  let depth = 0;
  let buffer = '';
  for (const character of body) {
    if (character === '{') depth++;
    if (depth === 0 && character !== '}') buffer += character;
    if (character === '}') {
      depth--;
      if (depth === 0) buffer += ';';
    }
  }
  const result = new Map();
  for (const part of buffer.split(';')) {
    const match = /^\s*(--[\w-]+)\s*:\s*([\s\S]*?)\s*$/.exec(part);
    if (match) result.set(match[1], match[2].replace(/\s+/g, ' ').trim());
  }
  return result;
}

const MEDIA_WIDTH = /min-width:\s*(\d+)px/;

// Reads every :root custom property. Values inside @media (min-width) blocks, nested or not,
// are kept per breakpoint: {base: Map, breakpoints: [{minWidth, values: Map}]}
export function readRootVariables(css) {
  const base = new Map();
  const breakpoints = new Map();
  const addBreakpoint = (minWidth, values) => {
    if (!breakpoints.has(minWidth)) breakpoints.set(minWidth, new Map());
    for (const [name, value] of values) breakpoints.get(minWidth).set(name, value);
  };

  // insideRoot: a nested @media inside :root holds declarations directly
  const visit = (blocks, minWidth, insideRoot) => {
    for (const {prelude, body} of blocks) {
      if (prelude.startsWith('@media')) {
        const width = Number(MEDIA_WIDTH.exec(prelude)?.[1] ?? 0);
        if (insideRoot) addBreakpoint(width, declarations(body));
        visit(topLevelBlocks(body), width, false);
      } else if (prelude === ':root') {
        const values = declarations(body);
        if (minWidth) addBreakpoint(minWidth, values);
        else for (const [name, value] of values) base.set(name, value);
        visit(topLevelBlocks(body), minWidth, true);
      }
    }
  };
  visit(topLevelBlocks(stripComments(css)), 0, false);

  return {
    base,
    breakpoints: [...breakpoints.entries()].sort(([a], [b]) => a - b).map(([minWidth, values]) => ({minWidth, values})),
  };
}

// The value of a variable at a viewport width, following var() references
export function resolve(variables, name, width = 0, seen = new Set()) {
  if (seen.has(name)) return undefined;
  seen.add(name);
  let value = variables.base.get(name);
  for (const {minWidth, values} of variables.breakpoints) {
    if (width >= minWidth && values.has(name)) value = values.get(name);
  }
  if (value === undefined) return undefined;
  return value.replace(/var\(\s*(--[\w-]+)\s*(?:,\s*([^()]*))?\)/g, (match, reference, fallback) => {
    const resolved = resolve(variables, reference, width, new Set(seen));
    return resolved ?? fallback ?? match;
  });
}

// The variable a value points at, when it is exactly var(--name)
export function reference(value) {
  return /^var\(\s*(--[\w-]+)\s*\)$/.exec(String(value ?? '').trim())?.[1];
}
