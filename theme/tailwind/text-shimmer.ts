import plugin from 'tailwindcss/plugin';
// @ts-ignore
import flattenColorPalette from 'tailwindcss/lib/util/flattenColorPalette';
// @ts-ignore
import toColorValue from 'tailwindcss/lib/util/toColorValue';

export default plugin(function ({addComponents, matchUtilities, addUtilities, addBase, theme}) {
  addBase({
    ':root': {
      '--text-shimmer-duration': '1.5s',
      '--text-shimmer-highlight-color': `rgba(255, 255, 255, 0.9)`,
      '--text-shimmer-highlight-size': '30%',
      '--text-shimmer-highlight-position': '50%',
    },
  });

  addComponents({
    '@keyframes textShimmer': {
      '0%': {
        'background-position': '-200% 0%',
      },
      '100%': {
        'background-position': '200% 0%',
      },
    },
  });

  addUtilities({
    '.animate-text-shimmer': {
      'background-position': '-200% 0%',
      'animation-duration': 'var(--text-shimmer-duration)',
      'animation-fill-mode': 'backwards',
      'animation-name': 'textShimmer',
    },
  });

  matchUtilities<string>(
    {
      'text-shimmer': (value) => ({
        '--text-shimmer-text-color': toColorValue(value),
        'background-color': 'var(--text-shimmer-text-color)',
        'background-image': `linear-gradient(
          to right,
          transparent 0%,
          var(--text-shimmer-highlight-color) 50%,
          transparent 100%
        )`,
        'background-position': 'var(--text-shimmer-highlight-position) 0%',
        'background-size': 'var(--text-shimmer-highlight-size) 100%',
        'background-repeat': 'no-repeat',
        'background-clip': 'text',
        color: 'transparent',
      }),
    },
    {
      values: flattenColorPalette(theme('colors')),
      type: ['color', 'any'],
    },
  );

  matchUtilities<string>(
    {
      'text-shimmer-at': (value) => ({
        '--text-shimmer-highlight-position': value,
      }),
    },
    {
      type: ['position', 'any'],
    },
  );

  matchUtilities<string>(
    {
      'text-shimmer-highlight': (value) => ({
        '--text-shimmer-highlight-color': value,
      }),
    },
    {
      values: flattenColorPalette(theme('colors')),
      type: ['color', 'any'],
    },
  );
});
