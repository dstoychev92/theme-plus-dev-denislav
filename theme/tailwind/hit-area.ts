import plugin from 'tailwindcss/plugin';

const hitAreaPseudoElement = {
  content: '""',
  position: 'absolute',
  inset:
    'calc(var(--hit-area-top, 0px) * -1) calc(var(--hit-area-right, 0px) * -1) calc(var(--hit-area-bottom, 0px) * -1) calc(var(--hit-area-left, 0px) * -1)',
  cursor: `inherit`,
  zIndex: '0',
};

export default plugin(function ({matchUtilities, addUtilities, theme}) {
  matchUtilities(
    {
      'hit-area-y': (value: string) => ({
        '&::before': {
          ...hitAreaPseudoElement,
          '--hit-area-top': value,
          '--hit-area-bottom': value,
        },
      }),
      'hit-area-y-before': (value: string) => ({
        '&::before': {
          ...hitAreaPseudoElement,
          '--hit-area-top': value,
          '--hit-area-bottom': value,
        },
      }),
      'hit-area-y-after': (value: string) => ({
        '&::after': {
          ...hitAreaPseudoElement,
          '--hit-area-top': value,
          '--hit-area-bottom': value,
        },
      }),

      'hit-area-x': (value: string) => ({
        '&::before': {
          ...hitAreaPseudoElement,
          '--hit-area-right': value,
          '--hit-area-left': value,
        },
      }),
      'hit-area-x-before': (value: string) => ({
        '&::before': {
          ...hitAreaPseudoElement,
          '--hit-area-right': value,
          '--hit-area-left': value,
        },
      }),
      'hit-area-x-after': (value: string) => ({
        '&::after': {
          ...hitAreaPseudoElement,
          '--hit-area-right': value,
          '--hit-area-left': value,
        },
      }),

      'hit-area-t': (value: string) => ({
        '&::before': {
          ...hitAreaPseudoElement,
          '--hit-area-top': value,
        },
      }),
      'hit-area-t-before': (value: string) => ({
        '&::before': {
          ...hitAreaPseudoElement,
          '--hit-area-top': value,
        },
      }),
      'hit-area-t-after': (value: string) => ({
        '&::after': {
          ...hitAreaPseudoElement,
          '--hit-area-top': value,
        },
      }),

      'hit-area-b': (value: string) => ({
        '&::before': {
          ...hitAreaPseudoElement,
          '--hit-area-bottom': value,
        },
      }),
      'hit-area-b-before': (value: string) => ({
        '&::before': {
          ...hitAreaPseudoElement,
          '--hit-area-bottom': value,
        },
      }),
      'hit-area-b-after': (value: string) => ({
        '&::after': {
          ...hitAreaPseudoElement,
          '--hit-area-bottom': value,
        },
      }),

      'hit-area-l': (value: string) => ({
        '&::before': {
          ...hitAreaPseudoElement,
          '--hit-area-left': value,
        },
      }),
      'hit-area-l-before': (value: string) => ({
        '&::before': {
          ...hitAreaPseudoElement,
          '--hit-area-left': value,
        },
      }),
      'hit-area-l-after': (value: string) => ({
        '&::after': {
          ...hitAreaPseudoElement,
          '--hit-area-left': value,
        },
      }),

      'hit-area-r': (value: string) => ({
        '&::before': {
          ...hitAreaPseudoElement,
          '--hit-area-right': value,
        },
      }),
      'hit-area-r-before': (value: string) => ({
        '&::before': {
          ...hitAreaPseudoElement,
          '--hit-area-right': value,
        },
      }),
      'hit-area-r-after': (value: string) => ({
        '&::after': {
          ...hitAreaPseudoElement,
          '--hit-area-right': value,
        },
      }),

      'hit-area-s': (value: string) => ({
        '[dir="ltr"] &': {
          '&::before': {
            ...hitAreaPseudoElement,
            '--hit-area-left': value,
          },
        },
        '[dir="rtl"] &': {
          '&::before': {
            ...hitAreaPseudoElement,
            '--hit-area-right': value,
          },
        },
      }),
      'hit-area-s-before': (value: string) => ({
        '[dir="ltr"] &': {
          '&::before': {
            ...hitAreaPseudoElement,
            '--hit-area-left': value,
          },
        },
        '[dir="rtl"] &': {
          '&::before': {
            ...hitAreaPseudoElement,
            '--hit-area-right': value,
          },
        },
      }),
      'hit-area-s-after': (value: string) => ({
        '[dir="ltr"] &': {
          '&::after': {
            ...hitAreaPseudoElement,
            '--hit-area-left': value,
          },
        },
        '[dir="rtl"] &': {
          '&::after': {
            ...hitAreaPseudoElement,
            '--hit-area-right': value,
          },
        },
      }),

      'hit-area-e': (value: string) => ({
        '[dir="ltr"] &': {
          '&::before': {
            ...hitAreaPseudoElement,
            '--hit-area-right': value,
          },
        },
        '[dir="rtl"] &': {
          '&::before': {
            ...hitAreaPseudoElement,
            '--hit-area-left': value,
          },
        },
      }),
      'hit-area-e-before': (value: string) => ({
        '[dir="ltr"] &': {
          '&::before': {
            ...hitAreaPseudoElement,
            '--hit-area-right': value,
          },
        },
        '[dir="rtl"] &': {
          '&::before': {
            ...hitAreaPseudoElement,
            '--hit-area-left': value,
          },
        },
      }),
      'hit-area-e-after': (value: string) => ({
        '[dir="ltr"] &': {
          '&::after': {
            ...hitAreaPseudoElement,
            '--hit-area-right': value,
          },
        },
        '[dir="rtl"] &': {
          '&::after': {
            ...hitAreaPseudoElement,
            '--hit-area-left': value,
          },
        },
      }),
    },
    {
      values: {
        ...theme('space'),
        DEFAULT: '1px',
      },
    },
  );

  matchUtilities(
    {
      'hit-area': (value: string) => ({
        '&::before': {
          ...hitAreaPseudoElement,
          '--hit-area-top': value,
          '--hit-area-right': value,
          '--hit-area-bottom': value,
          '--hit-area-left': value,
        },
      }),
      'hit-area-before': (value: string) => ({
        '&::before': {
          ...hitAreaPseudoElement,
          '--hit-area-top': value,
          '--hit-area-right': value,
          '--hit-area-bottom': value,
          '--hit-area-left': value,
        },
      }),
      'hit-area-after': (value: string) => ({
        '&::after': {
          ...hitAreaPseudoElement,
          '--hit-area-top': value,
          '--hit-area-right': value,
          '--hit-area-bottom': value,
          '--hit-area-left': value,
        },
      }),
    },
    {
      values: {
        ...theme('space'),
      },
    },
  );

  addUtilities({
    '.hit-area': {
      '&::before': hitAreaPseudoElement,
    },
    '.hit-area-before': {
      '&::before': hitAreaPseudoElement,
    },
    '.hit-area-after': {
      '&::after': hitAreaPseudoElement,
    },
  });
});
