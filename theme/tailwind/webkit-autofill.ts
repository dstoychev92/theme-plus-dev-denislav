import plugin from 'tailwindcss/plugin';
// @ts-ignore
import flattenColorPalette from 'tailwindcss/lib/util/flattenColorPalette';
// @ts-ignore
import toColorValue from 'tailwindcss/lib/util/toColorValue';

export default plugin(function ({addUtilities, matchUtilities, theme}) {
  addUtilities({
    '.reset-webkit-autofill': {
      '&:autofill': {
        transition: 'background-color 5000s ease-in-out 0s',
      },
    },
  });

  matchUtilities(
    {
      'webkit-autofill-bg': (value) => ({
        '&:autofill': {
          '--autofill-background-color': toColorValue(value),
          transition: 'background-color 5000s ease-in-out 0s',
          boxShadow: '0 0 0 1000px var(--autofill-background-color) inset',
        },
      }),
      'webkit-autofill-text': (value) => ({
        '&:autofill': {
          '-webkit-text-fill-color': toColorValue(value),
        },
      }),
    },
    {
      values: flattenColorPalette(theme('colors')),
      type: ['color', 'any'],
    },
  );
});
