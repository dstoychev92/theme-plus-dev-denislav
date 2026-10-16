import plugin from 'tailwindcss/plugin';
// @ts-ignore
import flattenColorPalette from 'tailwindcss/lib/util/flattenColorPalette';

// Inspired by https://github.com/designbycode/tailwindcss-text-stroke
export default plugin(
  function ({addComponents, matchUtilities, theme}) {
    addComponents({
      '.text-stroke': {
        '-webkit-text-fill-color': 'var(--text-stroke-fill-color, transparent)',
        '-webkit-text-stroke-width': `var(--text-stroke-width, 1px)`,
        '-webkit-text-stroke-color': 'var(--text-stroke-color, black)',
      },
    });

    matchUtilities(
      {
        'text-stroke': (value) => {
          return {
            '-webkit-text-fill-color': 'var(--text-stroke-fill-color, transparent)',
            '-webkit-text-stroke-width': `var(--text-stroke-width, ${value})`,
            '-webkit-text-stroke-color': 'var(--text-stroke-color, black)',
          };
        },
      },
      {
        values: theme('textStrokeWidth'),
      },
    );

    matchUtilities(
      {
        'text-stroke': (value) => ({
          '--text-stroke-color': value,
        }),
      },
      {
        values: flattenColorPalette(theme('colors')),
        type: 'color',
      },
    );
    matchUtilities(
      {
        'text-stroke-fill': (value) => ({
          '--text-stroke-fill-color': value,
        }),
      },
      {
        values: flattenColorPalette(theme('colors')),
        type: 'color',
      },
    );
  },
  {
    theme: {
      textStrokeWidth: {
        none: 'unset',
        0: '0',
        1: '1px',
        2: '2px',
        3: '3px',
      },
    },
  },
);
