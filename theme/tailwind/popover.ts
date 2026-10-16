/**
 * Utility to add a classes for popovers
 */

import plugin from 'tailwindcss/plugin';

export default plugin(function ({addVariant}) {
  addVariant('popover-open', '&:popover-open');
  addVariant('not-popover-open', '&:not(:popover-open)');
});
