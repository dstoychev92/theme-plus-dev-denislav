import plugin from 'tailwindcss/plugin';
import {loadConstants} from '@groupthought/tradecraft-build';

const constants = loadConstants();

const palettes = ['black', 'white', 'canvas', 'content', 'primary', 'secondary', 'muted', 'sale', 'success', 'error'];
const palettesWithContrasts = [...palettes, ...palettes.map((palette) => `${palette}-contrast`)];

const mixes = constants.mixes as number[];

export default plugin(
  function ({matchUtilities, addUtilities}) {
    // Generate classes to apply a stain
    // e.g. `vars-stain-primary` which would apply the `--primary-oklch` value to the `--stain` and `--stain-contrast` variables
    // and then allow you to use classes like `text-stain-constrast-mix-20`
    matchUtilities<string>(
      {
        'vars-stain': (name) => ({
          '--stain-oklch': `var(--${name}-oklch)`,
          '--stain-contrast-oklch': `var(--${name}-contrast-oklch)`,
          '--stain': `oklch(var(--${name}-oklch))`,
          '--stain-contrast': `oklch(var(--${name}-contrast-oklch))`,
          // oklch-fallback
          '@supports not (color: oklch(0% 0 0))': {
            '--stain': `rgb(var(--${name}-fallback))`,
            '--stain-contrast': `rgb(var(--${name}-contrast-fallback))`,
          },
        }),
      },
      {
        values: palettesWithContrasts.reduce((acc, curr) => ({...acc, [curr]: curr}), {}),
      },
    );

    addUtilities({
      '.vars-scheme-light': {
        '--canvas-oklch': 'var(--scheme-light-canvas-oklch)',
        '--canvas-contrast-oklch': 'var(--scheme-light-canvas-contrast-oklch)',

        '--content-oklch': 'var(--scheme-light-content-oklch)',
        '--content-contrast-oklch': 'var(--scheme-light-content-contrast-oklch)',
        '--shadow-oklch': 'var(--scheme-light-shadow-oklch)',

        '--muted-oklch': 'var(--scheme-light-muted-oklch)',
        '--muted-contrast-oklch': 'var(--scheme-light-muted-contrast-oklch)',
        '--muted-alpha': 'var(--scheme-light-muted-alpha)',

        '--primary-oklch': 'var(--scheme-light-primary-oklch)',
        '--primary-contrast-oklch': 'var(--scheme-light-primary-contrast-oklch)',

        '--secondary-oklch': 'var(--scheme-light-secondary-oklch)',
        '--secondary-contrast-oklch': 'var(--scheme-light-secondary-contrast-oklch)',

        '--sale-oklch': 'var(--scheme-light-sale-oklch)',
        '--sale-contrast-oklch': 'var(--scheme-light-sale-contrast-oklch)',

        '--mix-5': 'var(--scheme-light-mix-5)',
        '--mix-10': 'var(--scheme-light-mix-10)',
        '--mix-20': 'var(--scheme-light-mix-20)',
        '--mix-30': 'var(--scheme-light-mix-30)',
        '--mix-40': 'var(--scheme-light-mix-40)',
        '--mix-50': 'var(--scheme-light-mix-50)',

        '--line-alpha-subtle': 'var(--scheme-light-line-alpha-subtle)',
        '--line-alpha': 'var(--scheme-light-line-alpha)',
        '--line-alpha-bold': 'var(--scheme-light-line-alpha-bold)',

        // oklch-fallback
        '--canvas-fallback': 'var(--scheme-light-canvas-fallback)',
        '--canvas-contrast-fallback': 'var(--scheme-light-canvas-contrast-fallback)',
        '--content-fallback': 'var(--scheme-light-content-fallback)',
        '--content-contrast-fallback': 'var(--scheme-light-content-contrast-fallback)',
        '--shadow-fallback': 'var(--scheme-light-shadow-fallback)',
        '--muted-fallback': 'var(--scheme-light-muted-fallback)',
        '--muted-contrast-fallback': 'var(--scheme-light-muted-contrast-fallback)',
        '--primary-fallback': 'var(--scheme-light-primary-fallback)',
        '--primary-contrast-fallback': 'var(--scheme-light-primary-contrast-fallback)',
        '--secondary-fallback': 'var(--scheme-light-secondary-fallback)',
        '--secondary-contrast-fallback': 'var(--scheme-light-secondary-contrast-fallback)',
        '--sale-fallback': 'var(--scheme-light-sale-fallback)',
        '--sale-contrast-fallback': 'var(--scheme-light-sale-contrast-fallback)',
      },
      '.vars-scheme-dark': {
        '--canvas-oklch': 'var(--scheme-dark-canvas-oklch)',
        '--canvas-contrast-oklch': 'var(--scheme-dark-canvas-contrast-oklch)',

        '--content-oklch': 'var(--scheme-dark-content-oklch)',
        '--content-contrast-oklch': 'var(--scheme-dark-content-contrast-oklch)',
        '--shadow-oklch': 'var(--scheme-dark-shadow-oklch)',

        '--muted-oklch': 'var(--scheme-dark-muted-oklch)',
        '--muted-contrast-oklch': 'var(--scheme-dark-muted-contrast-oklch)',
        '--muted-alpha': 'var(--scheme-dark-muted-alpha)',

        '--primary-oklch': 'var(--scheme-dark-primary-oklch)',
        '--primary-contrast-oklch': 'var(--scheme-dark-primary-contrast-oklch)',

        '--secondary-oklch': 'var(--scheme-dark-secondary-oklch)',
        '--secondary-contrast-oklch': 'var(--scheme-dark-secondary-contrast-oklch)',

        '--sale-oklch': 'var(--scheme-dark-sale-oklch)',
        '--sale-contrast-oklch': 'var(--scheme-dark-sale-contrast-oklch)',

        '--mix-5': 'var(--scheme-dark-mix-5)',
        '--mix-10': 'var(--scheme-dark-mix-10)',
        '--mix-20': 'var(--scheme-dark-mix-20)',
        '--mix-30': 'var(--scheme-dark-mix-30)',
        '--mix-40': 'var(--scheme-dark-mix-40)',
        '--mix-50': 'var(--scheme-dark-mix-50)',

        '--line-alpha-subtle': 'var(--scheme-dark-line-alpha-subtle)',
        '--line-alpha': 'var(--scheme-dark-line-alpha)',
        '--line-alpha-bold': 'var(--scheme-dark-line-alpha-bold)',

        // oklch-fallback
        '--canvas-fallback': 'var(--scheme-dark-canvas-fallback)',
        '--canvas-contrast-fallback': 'var(--scheme-dark-canvas-contrast-fallback)',
        '--content-fallback': 'var(--scheme-dark-content-fallback)',
        '--content-contrast-fallback': 'var(--scheme-dark-content-contrast-fallback)',
        '--shadow-fallback': 'var(--scheme-dark-shadow-fallback)',
        '--muted-fallback': 'var(--scheme-dark-muted-fallback)',
        '--muted-contrast-fallback': 'var(--scheme-dark-muted-contrast-fallback)',
        '--primary-fallback': 'var(--scheme-dark-primary-fallback)',
        '--primary-contrast-fallback': 'var(--scheme-dark-primary-contrast-fallback)',
        '--secondary-fallback': 'var(--scheme-dark-secondary-fallback)',
        '--secondary-contrast-fallback': 'var(--scheme-dark-secondary-contrast-fallback)',
        '--sale-fallback': 'var(--scheme-dark-sale-fallback)',
        '--sale-contrast-fallback': 'var(--scheme-dark-sale-contrast-fallback)',
      },
    });
  },
  {
    theme: {
      extend: {
        borderColor: {
          DEFAULT: `oklch(var(--content-oklch) / var(--line-alpha))`,
        },
      },
      colors({colors}) {
        return {
          inherit: colors.inherit,
          current: colors.current,
          transparent: colors.transparent,

          'page-canvas': `var(--page-canvas-color)`,
          'page-content': `var(--page-content-color)`,

          // Generate actual theme color values
          ...palettesWithContrasts.reduce(
            (acc, curr) => ({
              ...acc,
              [curr]: generatePaletteColors(curr),
            }),
            {},
          ),

          muted: {
            ...generatePaletteColors('muted'),
            DEFAULT: `var(--muted)`,
            subtle: `var(--muted-subtle)`,
          },

          sale: {
            ...generatePaletteColors('sale'),
            bg: `var(--sale-color-bg)`,
          },

          stain: generatePaletteColors('stain'),
          'stain-contrast': generatePaletteColors('stain-contrast', 'stain'),

          // border colors default to mix
          'line-subtle': `oklch(var(--content-oklch) / var(--line-alpha-subtle))`,
          line: `oklch(var(--content-oklch) / var(--line-alpha))`,
          'line-bold': `oklch(var(--content-oklch) / var(--line-alpha-bold))`,

          'focus-outline': `var(--focus-outline-color)`,
        };
      },
    },
  },
);

function generatePaletteColors(name: string, optionalContrastName?: string) {
  let contrastName = optionalContrastName ?? `${name}-contrast`;

  return {
    DEFAULT: `oklch(var(--${name}-oklch) / <alpha-value>)`,
    // Lower half: N% of name mixed into contrast
    ...mixes.reduce(
      (acc, curr) => ({
        ...acc,
        [`mix-${curr}`]: `color-mix(
          in oklch,
          oklch(var(--${name}-oklch) / <alpha-value>) var(--mix-${curr}, ${curr}%),
          oklch(var(--${contrastName}-oklch) / <alpha-value>)
        )`,
      }),
      {},
    ),
    // Upper half: inverted — (100-N)% of contrast mixed into name
    ...mixes.reduce<Record<string, string>>((acc, curr) => {
      const upper = 100 - curr;
      if (upper < 50) return acc;
      return {
        ...acc,
        [`mix-${upper}`]: `color-mix(
            in oklch,
            oklch(var(--${contrastName}-oklch) / <alpha-value>) var(--mix-${curr}, ${curr}%),
            oklch(var(--${name}-oklch) / <alpha-value>)
          )`,
      };
    }, {}),
  };
}
