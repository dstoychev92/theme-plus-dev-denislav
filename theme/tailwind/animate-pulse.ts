/**
 * Utility to add a class for wiggling animation
 */

import plugin from 'tailwindcss/plugin';

export default plugin(function ({addUtilities, matchUtilities, theme}) {
  addUtilities({
    '.animate-pulse': {
      '--pulse-initial-scale': '1',
      '--pulse-final-scale': '4',
      animation: 'pulse var(--pulse-duration, 3.5s) linear infinite',
      animationDelay: 'var(--pulse-delay, 0s)',
      animationFillMode: 'both',
    },

    '@keyframes pulse': {
      '0%': {
        transform: 'scale(var(--pulse-initial-scale))',
        opacity: '0.05',
      },
      '20%': {
        opacity: '0.15',
      },
      '40%': {
        transform: 'scale(var(--pulse-final-scale))',
        opacity: '0',
      },
      '100%': {
        transform: 'scale(var(--pulse-final-scale))',
        opacity: '0',
      },
    },
  });

  matchUtilities(
    {
      'pulse-duration': (value) => ({
        '--pulse-duration': value,
        animationDuration: value,
      }),
    },
    {values: withoutDefault(theme('animationDuration'))},
  );

  matchUtilities(
    {
      'pulse-delay': (value) => ({
        '--pulse-delay': value,
        animationDelay: value,
      }),
    },
    {values: withoutDefault(theme('animationDuration'))},
  );
});

export function withoutDefault(values: any) {
  const {DEFAULT, ...otherValues} = values;
  return {...otherValues};
}
