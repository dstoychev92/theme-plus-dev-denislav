const postcss = require('postcss');
const valueParser = require('postcss-value-parser');

const {basePostCssConfig, loadConstants} = require('@groupthought/tradecraft-build');

const constants = loadConstants();

/**
 * PostCSS plugin that:
 * - Clones (hover: none)/(pointer: coarse) styles into a mobile-width block for the theme editor mobile preview.
 * - Restricts (hover: hover)/(pointer: fine) styles to non–theme-editor with html:not([data-theme-editor]), then clones them into a desktop-width block for the theme editor desktop preview.
 */
const themeEditorTouchPlugin = () => {
  const hoverNone = '(hover: none)';
  const pointerCoarse = '(pointer: coarse)';
  const hoverHover = '(hover: hover)';
  const pointerFine = '(pointer: fine)';
  const mobileMaxWidth = constants.screen_md - 1;
  const desktopMinWidth = constants.screen_md;

  const isTouchMediaQuery = (params) => {
    const p = params.trim();
    return p.includes(hoverNone) && p.includes(pointerCoarse);
  };

  const isHoverMediaQuery = (params) => {
    const p = params.trim();
    return p.includes(hoverHover) && p.includes(pointerFine);
  };

  return {
    postcssPlugin: 'postcss-theme-editor-touch',

    Once(root) {
      const mobileWrapper = postcss.atRule({
        name: 'media',
        params: `(max-width: ${mobileMaxWidth}px)`,
      });
      const desktopWrapper = postcss.atRule({
        name: 'media',
        params: `(min-width: ${desktopMinWidth}px)`,
      });

      let hasMobileClones = false;
      let hasDesktopClones = false;

      root.walkAtRules('media', (atRule) => {
        if (isTouchMediaQuery(atRule.params)) {
          atRule.walkRules((rule) => {
            const cloned = rule.clone();
            cloned.selector = cloned.selectors.map((selector) => `html[data-theme-editor] ${selector}`).join(', ');
            mobileWrapper.append(cloned);
            hasMobileClones = true;
          });
          return;
        }
        if (isHoverMediaQuery(atRule.params)) {
          atRule.walkRules((rule) => {
            const cloned = rule.clone();
            // Restrict original to outside theme editor
            rule.selector = rule.selectors.map((selector) => `html:not([data-theme-editor]) ${selector}`).join(', ');
            // Clone applies in theme editor at desktop width
            cloned.selector = cloned.selectors.map((selector) => `html[data-theme-editor] ${selector}`).join(', ');
            desktopWrapper.append(cloned);
            hasDesktopClones = true;
          });
        }
      });

      if (hasMobileClones) {
        root.append(
          postcss.comment({
            text: 'Styles to simulate `(pointer: coarse) and (hover: none)` in the theme editor mobile preview',
          }),
          mobileWrapper,
        );
      }
      if (hasDesktopClones) {
        root.append(
          postcss.comment({
            text: 'Styles to simulate `(pointer: fine) and (hover: hover)` in the theme editor desktop preview',
          }),
          desktopWrapper,
        );
      }
    },
  };
};

themeEditorTouchPlugin.postcss = true;

/**
 * PostCSS plugin that provides (some) backwards compatibility for color-mix() functions.
 * This plugin looks for usages of the color-mix() function and replaces them with a fallback color.
 * The fallback color is the first color in the color-mix() function using the mix % as the alpha channel.
 */
const fallbackColorMixPlugin = (opts = {}) => {
  const fallbackWord = typeof opts.fallback === 'string' ? opts.fallback : 'inherit';
  const supportsParams = typeof opts.supports === 'string' ? opts.supports : '(color: color-mix(in hsl, black, white))';

  function isInsideOurSupports(node) {
    // Skip any rule already under a supports that mentions color-mix
    let p = node.parent;
    while (p) {
      if (p.type === 'atrule' && p.name === 'supports' && String(p.params).includes('color-mix')) {
        return true;
      }
      p = p.parent;
    }
    return false;
  }

  function extractFirstColorFromColorMix(fnNode) {
    // Determine if a color space is defined before the first comma (i.e., starts with `in <space>,`)
    let hasColorSpace = false;
    for (const n of fnNode.nodes) {
      if (n.type === 'word' && n.value.toLowerCase() === 'in') hasColorSpace = true;
      if (n.type === 'div' && n.value === ',') break;
    }

    let started = !hasColorSpace;
    for (const n of fnNode.nodes) {
      if (!started) {
        if (n.type === 'div' && n.value === ',') {
          started = true;
        }
        continue;
      }
      if (n.type === 'space') continue;
      if (n.type === 'function') return valueParser.stringify(n);
      if (n.type === 'word') return n.value;
      if (n.type === 'string') return n.value;
    }
    return null;
  }

  function parseColorMixMeta(fnNode) {
    const result = {space: null, firstColor: null, firstPercent: null};
    const nodes = fnNode.nodes || [];
    let i = 0;
    while (i < nodes.length && nodes[i].type === 'space') i++;
    if (i < nodes.length && nodes[i].type === 'word' && nodes[i].value.toLowerCase() === 'in') {
      i++;
      while (i < nodes.length && nodes[i].type === 'space') i++;
      if (i < nodes.length && nodes[i].type === 'word') {
        result.space = String(nodes[i].value).toLowerCase();
      }
      while (i < nodes.length && !(nodes[i].type === 'div' && nodes[i].value === ',')) i++;
      if (i < nodes.length && nodes[i].type === 'div' && nodes[i].value === ',') i++;
    }

    while (i < nodes.length && nodes[i].type === 'space') i++;
    if (i < nodes.length) {
      const n = nodes[i];
      if (n.type === 'function') result.firstColor = valueParser.stringify(n);
      else if (n.type === 'word' || n.type === 'string') result.firstColor = n.value;
    }
    for (let j = i + 1; j < nodes.length; j++) {
      const n = nodes[j];
      if (n.type === 'div' && n.value === ',') break;
      if (n.type === 'word' && /%$/i.test(n.value)) {
        result.firstPercent = n.value;
        break;
      }
      if (n.type === 'function' && n.value.toLowerCase() === 'var') {
        // Check if the var() function contains a percentage value
        const varContent = valueParser.stringify(n);
        result.firstPercent = varContent;
      }
    }
    return result;
  }

  function stringifyNodes(nodes) {
    return nodes.map((n) => valueParser.stringify(n)).join('');
  }

  function stripAlphaFromHsl(fnNode) {
    // Handles modern hsl(h s l / a) and legacy hsla(h,s,l,a)
    const name = fnNode.value.toLowerCase();
    if (name === 'hsl') {
      const kept = [];
      for (const n of fnNode.nodes) {
        if (n.type === 'div' && n.value === '/') break;
        kept.push(n);
      }
      return {space: 'hsl', args: stringifyNodes(kept).trim()};
    }
    if (name === 'hsla') {
      const kept = [];
      let commaCount = 0;
      for (const n of fnNode.nodes) {
        if (n.type === 'div' && n.value === ',') {
          commaCount += 1;
          if (commaCount >= 3) break;
        }
        kept.push(n);
      }
      return {
        space: 'hsl',
        args: stringifyNodes(kept)
          .replace(/,+\s*$/, '')
          .trim(),
      };
    }
    return null;
  }

  function stripAlphaFromRgb(fnNode) {
    // Handles modern rgb(r g b / a) and legacy rgba(r,g,b,a)
    const name = fnNode.value.toLowerCase();
    if (name === 'rgb') {
      const kept = [];
      for (const n of fnNode.nodes) {
        if (n.type === 'div' && n.value === '/') break;
        kept.push(n);
      }
      return {space: 'rgb', args: stringifyNodes(kept).trim()};
    }
    if (name === 'rgba') {
      const kept = [];
      let commaCount = 0;
      for (const n of fnNode.nodes) {
        if (n.type === 'div' && n.value === ',') {
          commaCount += 1;
          if (commaCount >= 3) break;
        }
        kept.push(n);
      }
      return {
        space: 'rgb',
        args: stringifyNodes(kept)
          .replace(/,+\s*$/, '')
          .trim(),
      };
    }
    return null;
  }

  function hexToRgbArgs(hex) {
    const h = hex.replace('#', '').trim();
    if (![3, 4, 6, 8].includes(h.length)) return null;
    let r, g, b;
    if (h.length === 3 || h.length === 4) {
      r = parseInt(h[0] + h[0], 16);
      g = parseInt(h[1] + h[1], 16);
      b = parseInt(h[2] + h[2], 16);
      // ignore alpha if present
    } else {
      r = parseInt(h.slice(0, 2), 16);
      g = parseInt(h.slice(2, 4), 16);
      b = parseInt(h.slice(4, 6), 16);
      // ignore alpha if present
    }
    return `${r} ${g} ${b}`;
  }

  function normalizeColorRemoveAlpha(colorString) {
    if (!colorString) return null;
    const parsed = valueParser(colorString);
    const nodes = parsed.nodes || [];
    if (nodes.length === 1 && nodes[0].type === 'function') {
      const fn = nodes[0];
      const name = fn.value.toLowerCase();
      if (name === 'hsl' || name === 'hsla') return stripAlphaFromHsl(fn);
      if (name === 'rgb' || name === 'rgba') return stripAlphaFromRgb(fn);
      if (name === 'oklch') {
        // oklch(L C H / A) — strip the / A part
        const kept = [];
        for (const n of fn.nodes) {
          if (n.type === 'div' && n.value === '/') break;
          kept.push(n);
        }
        return {space: 'oklch', args: stringifyNodes(kept).trim()};
      }
      return null;
    }
    if (/^\s*#/i.test(colorString)) {
      const args = hexToRgbArgs(colorString);
      if (args) return {space: 'rgb', args};
    }
    return null;
  }

  return {
    postcssPlugin: 'postcss-color-mix-vars-fallback',
    Once(root) {
      root.walkRules((rule) => {
        if (isInsideOurSupports(rule)) return;

        const colorMixDeclClones = [];

        rule.walkDecls((decl) => {
          if (!/color-mix\(/i.test(decl.value)) return;

          colorMixDeclClones.push(decl.clone());

          const parsed = valueParser(decl.value);
          let touched = false;
          parsed.walk((node) => {
            if (node.type === 'function' && node.value.toLowerCase() === 'color-mix') {
              const meta = parseColorMixMeta(node);
              const normalized = normalizeColorRemoveAlpha(meta.firstColor);
              const percent = meta.firstPercent || '100%';
              if (normalized) {
                const fnName = normalized.space === 'oklch' ? 'oklch' : normalized.space === 'hsl' ? 'hsl' : 'rgb';
                const fallback = `${fnName}(${normalized.args} / ${percent})`;
                node.type = 'word';
                node.value = fallback;
                delete node.nodes;
                touched = true;
              } else if (meta.space === 'hsl') {
                // Could not parse; still try to avoid double hsl() by using raw firstColor
                const firstColor = meta.firstColor || fallbackWord;
                const fallback = `hsl(${firstColor} / ${percent})`;
                node.type = 'word';
                node.value = fallback;
                delete node.nodes;
                touched = true;
              } else if (meta.space === 'rgb' || meta.space === 'srgb') {
                const firstColor = meta.firstColor || fallbackWord;
                const fallback = `rgb(${firstColor} / ${percent})`;
                node.type = 'word';
                node.value = fallback;
                delete node.nodes;
                touched = true;
              } else {
                const firstColor = extractFirstColorFromColorMix(node) || fallbackWord;
                node.type = 'word';
                node.value = firstColor;
                delete node.nodes;
                touched = true;
              }
            }
          });
          if (touched) {
            decl.value = parsed.toString();
          }
        });

        if (colorMixDeclClones.length > 0) {
          const at = postcss.atRule({name: 'supports', params: supportsParams});
          const cloneRule = postcss.rule({selector: rule.selector});
          colorMixDeclClones.forEach((d) => cloneRule.append(d));
          at.append(cloneRule);
          rule.after(at);
        }
      });
    },
  };
};

fallbackColorMixPlugin.postcss = true;

/**
 * oklch-fallback
 * PostCSS plugin that provides backwards compatibility for oklch() color functions.
 * Replaces oklch(var(--X-oklch) / alpha) with rgb(var(--X-fallback) / alpha) in the base
 * declaration, then clones the original oklch declaration into a @supports block.
 * Runs after fallbackColorMixPlugin so it also catches the oklch fallbacks that plugin generates.
 */
const fallbackOklchPlugin = () => {
  function isInsideSupports(node) {
    let p = node.parent;
    while (p) {
      if (p.type === 'atrule' && p.name === 'supports') return true;
      p = p.parent;
    }
    return false;
  }

  return {
    postcssPlugin: 'postcss-oklch-fallback',
    Once(root) {
      root.walkRules((rule) => {
        if (isInsideSupports(rule)) return;

        const oklchDeclClones = [];

        rule.walkDecls((decl) => {
          // Skip custom properties (stain/scheme vars handle their own fallbacks)
          if (decl.prop.startsWith('--')) return;
          if (!/oklch\(/i.test(decl.value)) return;

          oklchDeclClones.push(decl.clone());

          const parsed = valueParser(decl.value);
          let touched = false;

          parsed.walk((node) => {
            if (node.type !== 'function' || node.value.toLowerCase() !== 'oklch') return;

            // Find var(--X-oklch) as first non-space child
            let varName = null;
            for (const child of node.nodes) {
              if (child.type === 'space') continue;
              if (child.type === 'function' && child.value === 'var') {
                const nameNode = child.nodes.find((n) => n.type === 'word' && n.value.startsWith('--'));
                if (nameNode && nameNode.value.endsWith('-oklch')) {
                  varName = nameNode.value;
                }
              }
              break;
            }

            if (!varName) return;

            const fallbackVarName = varName.replace(/-oklch$/, '-fallback');

            // Extract alpha (everything after /)
            const alphaParts = [];
            let foundSlash = false;
            for (const child of node.nodes) {
              if (!foundSlash) {
                if (child.type === 'div' && child.value === '/') foundSlash = true;
                continue;
              }
              alphaParts.push(valueParser.stringify(child));
            }
            const alpha = alphaParts.join('').trim();

            const fallback = alpha ? `rgb(var(${fallbackVarName}) / ${alpha})` : `rgb(var(${fallbackVarName}))`;

            node.type = 'word';
            node.value = fallback;
            delete node.nodes;
            touched = true;
            return false;
          });

          if (touched) {
            decl.value = parsed.toString();
          }
        });

        if (oklchDeclClones.length > 0) {
          const at = postcss.atRule({name: 'supports', params: '(color: oklch(0% 0 0))'});
          const cloneRule = postcss.rule({selector: rule.selector});
          oklchDeclClones.forEach((d) => cloneRule.append(d));
          at.append(cloneRule);
          rule.after(at);
        }
      });
    },
  };
};

fallbackOklchPlugin.postcss = true;

/**
 * Remove Tailwind preflight's [hidden] rule so only our override (with !important) remains.
 * Matches the rule Tailwind emits: [hidden]:where(:not([hidden=until-found])) { display: none; }
 * (selector may appear inside @layer or with different quoting)
 */
const removePreflightHiddenPlugin = () => ({
  postcssPlugin: 'postcss-remove-preflight-hidden',
  Once(root) {
    // Match Tailwind's preflight [hidden] selector (with or without quotes around until-found)
    const isPreflightHiddenSelector = (selector) =>
      /\[hidden\]:where\s*\(\s*:not\s*\(\s*\[hidden=[^)\]]+\]\s*\)\s*\)/.test(selector.trim());

    root.walkRules((rule) => {
      if (!isPreflightHiddenSelector(rule.selector)) return;

      const [decl] = rule.nodes || [];

      if (
        rule.nodes?.length === 1 &&
        decl?.type === 'decl' &&
        decl.prop === 'display' &&
        String(decl.value).trim() === 'none' &&
        !decl.important
      ) {
        rule.remove();
      }
    });
  },
});
removePreflightHiddenPlugin.postcss = true;

basePostCssConfig.basePlugins.push(fallbackColorMixPlugin);
basePostCssConfig.basePlugins.push(fallbackOklchPlugin);
basePostCssConfig.basePlugins.push(themeEditorTouchPlugin);
basePostCssConfig.basePlugins.push(removePreflightHiddenPlugin);
module.exports = basePostCssConfig.default;
