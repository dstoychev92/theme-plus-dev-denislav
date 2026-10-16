import plugin from 'tailwindcss/plugin';

/**
 * Layout Gap, Padding & Margin Utilities
 *
 * X and Y have different scaling systems. This plugin makes is easier to not think about it.
 * - Buffer for space outside the content (padding)
 * - Gutter for space between content (gap)
 *
 * We don't call it padding and gap because the css will sometimes map very oddly to these values
 *
 * Generated utilities:
 * - foo-layout: will use separate x/y values
 */

export default plugin(function ({addUtilities}) {
  addUtilities({
    // Gap utilities
    '.gap-layout': {
      'row-gap': 'var(--layout-gutter-y)',
      'column-gap': 'var(--layout-gutter-x)',
    },
    '.gap-x-layout': {
      'column-gap': 'var(--layout-gutter-x)',
    },
    '.gap-y-layout': {
      'row-gap': 'var(--layout-gutter-y)',
    },
    '.gap-sm': {
      'row-gap': 'var(--raw-space-sm)',
      'column-gap': 'var(--root-space-sm)',
    },
    '.gap-md': {
      'row-gap': 'var(--raw-space-md)',
      'column-gap': 'var(--root-space-md)',
    },
    '.gap-lg': {
      'row-gap': 'var(--raw-space-lg)',
      'column-gap': 'var(--root-space-lg)',
    },

    // Padding utilities
    '.p-layout': {
      'padding-block-start': 'var(--layout-buffer-y)',
      'padding-block-end': 'var(--layout-buffer-y)',
      'padding-inline-start': 'var(--layout-buffer-x)',
      'padding-inline-end': 'var(--layout-buffer-x)',
    },
    '.p-gutter': {
      'padding-block-start': 'var(--layout-gutter-y)',
      'padding-block-end': 'var(--layout-gutter-y)',
      'padding-inline-start': 'var(--layout-gutter-x)',
      'padding-inline-end': 'var(--layout-gutter-x)',
    },

    // Padding-x utilities
    '.px-layout': {
      'padding-inline-start': 'var(--layout-buffer-x)',
      'padding-inline-end': 'var(--layout-buffer-x)',
    },
    '.pl-layout': {
      'padding-left': 'var(--layout-buffer-x)',
    },
    '.pr-layout': {
      'padding-right': 'var(--layout-buffer-x)',
    },
    '.ps-layout': {
      'padding-inline-start': 'var(--layout-buffer-x)',
    },
    '.pe-layout': {
      'padding-inline-end': 'var(--layout-buffer-x)',
    },

    '.px-gutter': {
      'padding-inline-start': 'var(--layout-gutter-x)',
      'padding-inline-end': 'var(--layout-gutter-x)',
    },
    '.pl-gutter': {
      'padding-left': 'var(--layout-gutter-x)',
    },
    '.pr-gutter': {
      'padding-right': 'var(--layout-gutter-x)',
    },
    '.ps-gutter': {
      'padding-inline-start': 'var(--layout-gutter-x)',
    },
    '.pe-gutter': {
      'padding-inline-end': 'var(--layout-gutter-x)',
    },

    // Padding-y utilities
    '.py-layout': {
      'padding-block-start': 'var(--layout-buffer-y)',
      'padding-block-end': 'var(--layout-buffer-y)',
    },
    '.pt-layout': {
      'padding-block-start': 'var(--layout-buffer-y)',
    },
    '.pb-layout': {
      'padding-block-end': 'var(--layout-buffer-y)',
    },

    '.py-gutter': {
      'padding-block-start': 'var(--layout-gutter-y)',
      'padding-block-end': 'var(--layout-gutter-y)',
    },
    '.pt-gutter': {
      'padding-block-start': 'var(--layout-gutter-y)',
    },
    '.pb-gutter': {
      'padding-block-end': 'var(--layout-gutter-y)',
    },

    // Margin utilities
    '.m-layout': {
      'margin-block-start': 'var(--layout-buffer-y)',
      'margin-block-end': 'var(--layout-buffer-y)',
      'margin-inline-start': 'var(--layout-buffer-x)',
      'margin-inline-end': 'var(--layout-buffer-x)',
    },
    '.m-gutter': {
      'margin-block-start': 'var(--layout-gutter-y)',
      'margin-block-end': 'var(--layout-gutter-y)',
      'margin-inline-start': 'var(--layout-gutter-x)',
      'margin-inline-end': 'var(--layout-gutter-x)',
    },

    // Margin-x utilities
    '.mx-layout': {
      'margin-inline-start': 'var(--layout-buffer-x)',
      'margin-inline-end': 'var(--layout-buffer-x)',
    },
    '.ml-layout': {
      'margin-left': 'var(--layout-buffer-x)',
    },
    '.mr-layout': {
      'margin-right': 'var(--layout-buffer-x)',
    },
    '.ms-layout': {
      'margin-inline-start': 'var(--layout-buffer-x)',
    },
    '.me-layout': {
      'margin-inline-end': 'var(--layout-buffer-x)',
    },

    '.mx-gutter': {
      'margin-inline-start': 'var(--layout-gutter-x)',
      'margin-inline-end': 'var(--layout-gutter-x)',
    },
    '.ml-gutter': {
      'margin-left': 'var(--layout-gutter-x)',
    },
    '.mr-gutter': {
      'margin-right': 'var(--layout-gutter-x)',
    },
    '.ms-gutter': {
      'margin-inline-start': 'var(--layout-gutter-x)',
    },
    '.me-gutter': {
      'margin-inline-end': 'var(--layout-gutter-x)',
    },

    // Margin-y utilities
    '.my-layout': {
      'margin-block-start': 'var(--layout-buffer-y)',
      'margin-block-end': 'var(--layout-buffer-y)',
    },
    '.mt-layout': {
      'margin-block-start': 'var(--layout-buffer-y)',
    },
    '.mb-layout': {
      'margin-block-end': 'var(--layout-buffer-y)',
    },

    '.my-gutter': {
      'margin-block-start': 'var(--layout-gutter-y)',
      'margin-block-end': 'var(--layout-gutter-y)',
    },
    '.mt-gutter': {
      'margin-block-start': 'var(--layout-gutter-y)',
    },
    '.mb-gutter': {
      'margin-block-end': 'var(--layout-gutter-y)',
    },
  });
});
