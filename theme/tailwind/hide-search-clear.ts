import plugin from 'tailwindcss/plugin';

export default plugin(function ({addUtilities}) {
  addUtilities({
    '.hide-search-clear::-webkit-search-cancel-button': {
      '-webkit-appearance': 'none',
      display: 'none',
    },
    '.hide-search-clear::-ms-clear': {
      display: 'none',
    },
    '.hide-search-clear::-moz-clear': {
      display: 'none',
    },
  });
});
