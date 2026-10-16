import plugin from 'tailwindcss/plugin';
import {loadConstants} from '@groupthought/tradecraft-build';

const constants = loadConstants();

const spacing: Record<string, string[]> = {
  default: constants.spacing_sizes_mobile.map((size: number) => `${size}px`),
  md: constants.spacing_sizes_tablet.map((size: number) => `${size}px`),
  lg: constants.spacing_sizes_desktop.map((size: number) => `${size}px`),
};

const defaultSpacing = spacing['default'];

/**
 * Generate responsive spacing
 */
export default plugin(
  function ({theme, addBase}) {
    addBase({
      ':root': {
        // Generate default font size variables
        ...defaultSpacing.reduce((spacing, fontSize, index) => {
          return {
            ...spacing,
            [`--r${index + 1}`]: fontSize,
          };
        }, {}),
      },
    });

    // Retrieve screens from theme
    const screens: Record<string, string> = theme('screens', {});

    // Generate font size variables for each breakpoint
    Object.entries(screens).forEach(([screen]) => {
      if (spacing[screen]) {
        const screenSpacing: string[] = spacing[screen];
        const screenSize = screens[screen];

        addBase({
          [`@media (min-width: ${screenSize})`]: {
            ':root': screenSpacing.reduce((memo, size, index) => {
              return {
                ...memo,
                [`--r${index + 1}`]: size,
              };
            }, {}),
          },
        });
      }
    });
  },
  {
    theme: {
      spacing: {
        r1: 'var(--r1)',
        r2: 'var(--r2)',
        r3: 'var(--r3)',
        r4: 'var(--r4)',
        r5: 'var(--r5)',
        r6: 'var(--r6)',
        r7: 'var(--r7)',
        r8: 'var(--r8)',
        r9: 'var(--r9)',
        r10: 'var(--r10)',
        r11: 'var(--r11)',
        r12: 'var(--r12)',
        r13: 'var(--r13)',
        r14: 'var(--r14)',
        r15: 'var(--r15)',
      },
    },
  },
);
