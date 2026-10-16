/**
 * Utility to add a class for loader animation
 */

import plugin from 'tailwindcss/plugin';

export default plugin(function ({addComponents}) {
  addComponents({
    '.animate-loader-stroke': {
      animation: 'loaderStroke 1s linear infinite',
    },
    '@keyframes loaderStroke': {
      '0%': {'stroke-dashoffset': '88'},
      '100%': {'stroke-dashoffset': '0'},
    },
  });
});
