/**
 * Utility to add a class for bouncing animation
 */

import plugin from 'tailwindcss/plugin';

export default plugin(function ({addUtilities, matchUtilities, theme}) {
  addUtilities({
    '.animate-bounce': {
      animation: 'var(--bounce-animation-name, bounce-y) var(--bounce-duration, 1.8s) infinite',
      animationDelay: 'var(--bounce-delay, 0s)',
      animationFillMode: 'both',
      transformOrigin: 'center bottom',
      '--bounce-animation-name': 'bounce-y',
      '--bounce-distance-scale': '1.0',
    },

    '@keyframes bounce-y': {
      '0%, 20%, 30%, 40%, 50%, 60%, 100%': {
        transform: 'translateZ(0)',
      },
      '15%': {
        animationTimingFunction: 'ease-out',
        transform: 'translate3d(0, calc(-12px * var(--bounce-multiplier, 0.5)), 0)',
      },
      '25%': {
        animationTimingFunction: 'ease-out',
        transform: 'translate3d(0, calc(6px * var(--bounce-multiplier, 0.5)), 0)',
      },
      '35%': {
        animationTimingFunction: 'ease-out',
        transform: 'translate3d(0, calc(-3px * var(--bounce-multiplier, 0.5)), 0)',
      },
      '45%': {
        animationTimingFunction: 'ease-in',
        transform: 'translate3d(0, calc(2px * var(--bounce-multiplier, 0.5)), 0)',
      },
    },

    '@keyframes bounce-x': {
      '0%, 20%, 30%, 40%, 50%, 60%, 100%': {
        transform: 'translateZ(0)',
      },
      '15%': {
        animationTimingFunction: 'ease-out',
        transform: 'translate3d(calc(-12px * var(--bounce-multiplier, 0.5)), 0, 0)',
      },
      '25%': {
        animationTimingFunction: 'ease-out',
        transform: 'translate3d(calc(6px * var(--bounce-multiplier, 0.5)), 0, 0)',
      },
      '35%': {
        animationTimingFunction: 'ease-out',
        transform: 'translate3d(calc(-3px * var(--bounce-multiplier, 0.5)), 0, 0)',
      },
      '45%': {
        animationTimingFunction: 'ease-in',
        transform: 'translate3d(calc(2px * var(--bounce-multiplier, 0.5)), 0, 0)',
      },
    },
  });

  matchUtilities(
    {
      'bounce-duration': (value) => ({
        '--bounce-duration': value,
        animationDuration: value,
      }),
      'bounce-delay': (value) => ({
        '--bounce-delay': value,
        animationDelay: value,
      }),
    },
    {values: withoutDefault(theme('animationDuration'))},
  );

  addUtilities({
    '.bounce-x': {
      '--bounce-animation-name': 'bounce-x',
    },
    '.bounce-y': {
      '--bounce-animation-name': 'bounce-y',
    },
  });
});

export function withoutDefault(values: any) {
  const {DEFAULT, ...otherValues} = values;
  return {...otherValues};
}
