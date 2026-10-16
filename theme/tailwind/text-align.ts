import plugin from 'tailwindcss/plugin';

export default plugin(function ({addUtilities, matchUtilities, theme}) {
  addUtilities({
    '.text-start': {
      textAlign: 'start',
    },
    '.text-center': {
      textAlign: 'center',
    },
    '.text-end': {
      textAlign: 'end',
    },
    '.text-justify': {
      textAlign: 'justify',
    },

    '.text-content-align': {
      textAlign: 'var(--content-align)',
    },

    // Legacy aliases. We should always use start/end not left/right for RTE support
    '.text-left': {
      textAlign: 'start',
    },
    '.text-right': {
      textAlign: 'end',
    },
  });
});
