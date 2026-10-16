/**
 * Theme JSON. Shopify accepts comments and trailing commas, so the audit does too.
 *
 * The same parser is in packages/tradecraft-cli/src/compare.ts. Keep the two in step.
 */

/**
 * Theme JSON as plain JSON. Shopify accepts comments, such as the header the theme editor writes, and
 * trailing commas before } and ]. Both go. Text inside strings stays as it is.
 */
export function strictJson(text) {
  let out = '';
  let index = 0;
  while (index < text.length) {
    const char = text[index];
    if (char === '"') {
      let end = index + 1;
      while (end < text.length && text[end] !== '"') end += text[end] === '\\' ? 2 : 1;
      out += text.slice(index, end + 1);
      index = end + 1;
    } else if (text.startsWith('/*', index)) {
      const end = text.indexOf('*/', index + 2);
      index = end < 0 ? text.length : end + 2;
    } else if (text.startsWith('//', index)) {
      const end = text.indexOf('\n', index);
      index = end < 0 ? text.length : end;
    } else if (char === ',') {
      let rest = index + 1;
      while (rest < text.length && ' \t\r\n'.includes(text[rest])) rest++;
      if (rest < text.length && !'}]'.includes(text[rest])) out += char;
      index++;
    } else {
      out += char;
      index++;
    }
  }
  return out;
}

export function loadThemeJson(data) {
  const text = typeof data === 'string' ? data : new TextDecoder('utf-8', {fatal: true}).decode(data);
  return JSON.parse(strictJson(text));
}
