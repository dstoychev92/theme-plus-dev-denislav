import plugin from 'tailwindcss/plugin';

/**
 * Flex Layout Utilities
 *
 * Compresses common flex class chains into single utility classes.
 * These utilities are composable - you can still add additional Tailwind classes.
 */

export default plugin(function ({addUtilities}) {
  addUtilities({
    '.flex-center': {
      'align-items': 'center',
      'justify-content': 'center',
    },

    '.flex-row-center': {
      display: 'flex',
      'flex-direction': 'row',
      'align-items': 'center',
    },

    '.justify-center-safe': {'justify-content': 'safe center'},
    '.justify-end-safe': {'justify-content': 'safe flex-end'},
  });
});
