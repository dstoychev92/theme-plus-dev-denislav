import plugin from 'tailwindcss/plugin';
import {maskBorder} from './mask-border';
// @ts-ignore
import flattenColorPalette from 'tailwindcss/lib/util/flattenColorPalette';

function borderGradient(value: string) {
  return {
    position: 'relative',
    '&::before': {
      ...maskBorder(value),
      content: '""',
      pointerEvents: 'none',
      position: 'absolute',
      inset: '0',
      backgroundImage: `conic-gradient(
          from var(--border-gradient-angle, 0deg) at 50% 50%,
          var(--border-gradient-from, transparent),
          var(--border-gradient-spread, 45deg),
          var(--border-gradient-to, transparent)
        )`,
    },
  };
}

export default plugin(function ({matchUtilities, addUtilities, theme}) {
  matchUtilities<string>({
    'border-gradient': borderGradient,
  });

  matchUtilities<string>(
    {
      'border-gradient-from': (value) => {
        return {
          '--border-gradient-from': value,
        };
      },
      'border-gradient-to': (value) => {
        return {
          '--border-gradient-to': value,
        };
      },
    },
    {
      values: flattenColorPalette(theme('colors')),
      type: ['color', 'any'],
    },
  );

  matchUtilities<string>(
    {
      'border-gradient-angle': (value) => {
        return {
          '--border-gradient-angle': value,
        };
      },
    },
    {
      values: Object.assign(theme('borderGradientAngle', {}), {
        10: '10deg',
        15: '15deg',
        20: '20deg',
        25: '25deg',
        30: '30deg',
        45: '45deg',
        60: '60deg',
        90: '90deg',
        120: '120deg',
        135: '135deg',
        180: '180deg',
      }),
    },
  );

  addUtilities({
    '.border-gradient': borderGradient('1px'),
  });
});
