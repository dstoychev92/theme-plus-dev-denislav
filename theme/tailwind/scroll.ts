import plugin from 'tailwindcss/plugin';

/**
 * Scroll Utilities
 *
 * Compresses common overflow class chains into single utility classes.
 */

export default plugin(function ({addUtilities}) {
  addUtilities({
    '.scroll-area-y': {
      'overflow-y': 'auto',
      'overflow-x': 'hidden',
      'overscroll-behavior-y': 'contain',
      /* Scrollbar hiding */
      '-ms-overflow-style': 'none',
      'scrollbar-width': 'none',
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    },
    '.scroll-area-x': {
      'overflow-x': 'auto',
      'overflow-y': 'hidden',
      'overscroll-behavior-x': 'contain',
      /* Scrollbar hiding */
      '-ms-overflow-style': 'none',
      'scrollbar-width': 'none',
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    },
  });
});
