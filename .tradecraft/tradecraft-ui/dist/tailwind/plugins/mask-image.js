// Adapted from https://github.com/juhanakristian/tailwind-edge-mask-image
import plugin from 'tailwindcss/plugin';
import { withoutDefault } from '../utils/withoutDefault';
/**
 * Utility to generate mask images
 *
 * e.g. To apply a gradient mask to the left edge of a scrollable element
 *
 * <div class="edge-mask edge-mask-l overflow-auto"></div>
 */
export default plugin(function ({ addUtilities, matchUtilities, addBase, theme }) {
    /*
    Base Utility for adding an edge gradient mask
    */
    addUtilities({
        '.bg-mask': {
            '--bg-mask-transition-timing-function': theme('animationTimingFunction.DEFAULT'),
            '--bg-mask-gradient': `none`,
            /* General */
            '-webkit-mask-composite': 'source-in', // Chrome/WebKit
            maskComposite: 'intersect', // Firefox
            transition: `
          --bg-mask-start-opacity var(--bg-mask-duration, 0s) var(--bg-mask-transition-timing-function),
          --bg-mask-end-opacity var(--bg-mask-duration, 0s) var(--bg-mask-transition-timing-function),
          --bg-mask-start-distance var(--bg-mask-duration, 0s) var(--bg-mask-transition-timing-function),
          --bg-mask-end-distance var(--bg-mask-duration, 0s) var(--bg-mask-transition-timing-function),
          --bg-mask-start-opacity var(--bg-mask-duration, 0s) var(--bg-mask-transition-timing-function),
          --bg-mask-end-opacity var(--bg-mask-duration, 0s) var(--bg-mask-transition-timing-function),
          --bg-mask-start-distance var(--bg-mask-duration, 0s) var(--bg-mask-transition-timing-function),
          --bg-mask-end-distance var(--bg-mask-duration, 0s) var(--bg-mask-transition-timing-function)
        `,
            maskImage: `var(--bg-mask-gradient)`,
        },
        '.edge-mask': {
            '--edge-mask-transition-timing-function': theme('animationTimingFunction.DEFAULT'),
            '--edge-mask-top-distance': theme('gradientMaskEdgeDistance.DEFAULT'),
            '--edge-mask-right-distance': theme('gradientMaskEdgeDistance.DEFAULT'),
            '--edge-mask-left-distance': theme('gradientMaskEdgeDistance.DEFAULT'),
            '--edge-mask-bottom-distance': theme('gradientMaskEdgeDistance.DEFAULT'),
            '--edge-mask-top-gradient': `
          linear-gradient(to bottom, rgba(0, 0, 0, var(--edge-mask-top-opacity, 1.0)) 0%, rgba(0, 0, 0, var(--edge-mask-content-opacity, 1.0)) var(--edge-mask-top-distance, 10%))
        `,
            '--edge-mask-right-gradient': `
          linear-gradient(to right, rgba(0, 0, 0, var(--edge-mask-content-opacity, 1.0)) calc(100% - var(--edge-mask-right-distance, 10%)), rgba(0, 0, 0, var(--edge-mask-right-opacity, 1.0)) 100%)
        `,
            '--edge-mask-left-gradient': `
          linear-gradient(to right, rgba(0, 0, 0, var(--edge-mask-left-opacity, 1.0)) 0%, rgba(0, 0, 0, var(--edge-mask-content-opacity, 1.0)) var(--edge-mask-left-distance, 10%))
        `,
            '--edge-mask-bottom-gradient': `
          linear-gradient(to bottom, rgba(0, 0, 0, var(--edge-mask-content-opacity, 1.0)) calc(100% - var(--edge-mask-bottom-distance, 10%)), rgba(0, 0, 0, var(--edge-mask-bottom-opacity, 1.0)) 100%)
        `,
            '--edge-mask-content-opacity': '1.0',
            /* General */
            '-webkit-mask-composite': 'source-in', // Chrome/WebKit
            maskComposite: 'intersect', // Firefox
            transition: `
          --edge-mask-top-opacity var(--edge-mask-duration, 0s) var(--edge-mask-transition-timing-function),
          --edge-mask-right-opacity var(--edge-mask-duration, 0s) var(--edge-mask-transition-timing-function),
          --edge-mask-bottom-opacity var(--edge-mask-duration, 0s) var(--edge-mask-transition-timing-function),
          --edge-mask-left-opacity var(--edge-mask-duration, 0s) var(--edge-mask-transition-timing-function),
        `,
            maskImage: `
          var(--edge-mask-top-gradient),
          var(--edge-mask-right-gradient),
          var(--edge-mask-bottom-gradient),
          var(--edge-mask-left-gradient)
        `,
        },
    });
    /*
    Utilities to show a gradient mask on an edge e.g. .edge-mask-t, or for a specific percentage: .edge-mask-r-10
    */
    matchUtilities({
        'edge-mask-t': (value) => ({
            '--edge-mask-top-opacity': '0.0',
            '--edge-mask-top-distance': value,
        }),
        'edge-mask-r': (value) => ({
            '--edge-mask-right-opacity': '0.0',
            '--edge-mask-right-distance': value,
        }),
        'edge-mask-b': (value) => ({
            '--edge-mask-bottom-opacity': '0.0',
            '--edge-mask-bottom-distance': value,
        }),
        'edge-mask-l': (value) => ({
            '--edge-mask-left-opacity': '0.0',
            '--edge-mask-left-distance': value,
        }),
        'edge-mask-x': (value) => ({
            '--edge-mask-left-opacity': '0.0',
            '--edge-mask-left-distance': value,
            '--edge-mask-right-opacity': '0.0',
            '--edge-mask-right-distance': value,
        }),
        'edge-mask-y': (value) => ({
            '--edge-mask-top-opacity': '0.0',
            '--edge-mask-top-distance': value,
            '--edge-mask-bottom-opacity': '0.0',
            '--edge-mask-bottom-distance': value,
        }),
    }, { values: withoutDefault(theme('gradientMaskEdgeDistance')) });
    addUtilities({
        '.edge-mask-t': {
            '--edge-mask-top-opacity': '0.0',
        },
        '.edge-mask-r': {
            '--edge-mask-right-opacity': '0.0',
        },
        '.edge-mask-b': {
            '--edge-mask-bottom-opacity': '0.0',
        },
        '.edge-mask-l': {
            '--edge-mask-left-opacity': '0.0',
        },
        '.edge-mask-x': {
            '--edge-mask-left-opacity': '0.0',
            '--edge-mask-right-opacity': '0.0',
        },
        '.edge-mask-y': {
            '--edge-mask-top-opacity': '0.0',
            '--edge-mask-bottom-opacity': '0.0',
        },
        '.edge-mask-none': {
            '--edge-mask-top-opacity': '1.0',
            '--edge-mask-right-opacity': '1.0',
            '--edge-mask-bottom-opacity': '1.0',
            '--edge-mask-left-opacity': '1.0',
        },
    });
    /*
    Utilities to add a gradient mask to the background e.g. `mask-image bg-mask-to-top`
    */
    matchUtilities({
        'bg-mask-to-b': (value) => ({
            '--bg-mask-end-distance': value,
            '--bg-mask-gradient': `
            linear-gradient(to bottom,
              rgba(0, 0, 0, var(--bg-mask-start-opacity, 1.0)) var(--bg-mask-start-distance, 0%),
              rgba(0, 0, 0, var(--bg-mask-end-opacity, 0.0)) var(--bg-mask-end-distance, 100%)
            )
          `,
        }),
        'bg-mask-to-t': (value) => ({
            '--bg-mask-start-distance': value,
            '--bg-mask-gradient': `
            linear-gradient(to top,
              rgba(0, 0, 0, var(--bg-mask-start-opacity, 1.0)) var(--bg-mask-start-distance, 0%),
              rgba(0, 0, 0, var(--bg-mask-end-opacity, 0.0)) var(--bg-mask-end-distance, 100%)
            )
          `,
        }),
        'bg-mask-to-r': (value) => ({
            '--bg-mask-end-distance': value,
            '--bg-mask-gradient': `
            linear-gradient(to right,
              rgba(0, 0, 0, var(--bg-mask-start-opacity, 1.0)) var(--bg-mask-start-distance, 0%),
              rgba(0, 0, 0, var(--bg-mask-end-opacity, 0.0)) var(--bg-mask-end-distance, 100%)
            )
          `,
        }),
        'bg-mask-to-l': (value) => ({
            '--bg-mask-end-distance': value,
            '--bg-mask-gradient': `
            linear-gradient(to left,
              rgba(0, 0, 0, var(--bg-mask-start-opacity, 1.0)) var(--bg-mask-start-distance, 0%),
              rgba(0, 0, 0, var(--bg-mask-end-opacity, 0.0)) var(--bg-mask-end-distance, 100%)
            )
          `,
        }),
        'bg-mask-start-opacity': (value) => ({
            '--bg-mask-start-opacity': value,
        }),
        'bg-mask-end-opacity': (value) => ({
            '--bg-mask-end-opacity': value,
        }),
    }, { values: withoutDefault(theme('gradientMaskEdgeDistance')) });
    addUtilities({
        '.bg-mask-to-b': {
            '--bg-mask-gradient': `
          linear-gradient(to bottom,
            rgba(0, 0, 0, var(--bg-mask-start-opacity, 1.0)) var(--bg-mask-start-distance, 0%),
            rgba(0, 0, 0, var(--bg-mask-end-opacity, 0.0)) var(--bg-mask-end-distance, 100%)
          )
        `,
        },
        '.bg-mask-to-t': {
            '--bg-mask-gradient': `
          linear-gradient(to top,
            rgba(0, 0, 0, var(--bg-mask-start-opacity, 1.0)) var(--bg-mask-start-distance, 0%),
            rgba(0, 0, 0, var(--bg-mask-end-opacity, 0.0)) var(--bg-mask-end-distance, 100%)
          )
        `,
        },
        '.bg-mask-to-r': {
            '--bg-mask-gradient': `
          linear-gradient(to right,
            rgba(0, 0, 0, var(--bg-mask-start-opacity, 1.0)) var(--bg-mask-start-distance, 0%),
            rgba(0, 0, 0, var(--bg-mask-end-opacity, 0.0)) var(--bg-mask-end-distance, 100%)
          )
        `,
        },
        '.bg-mask-to-l': {
            '--bg-mask-gradient': `
          linear-gradient(to left,
            rgba(0, 0, 0, var(--bg-mask-start-opacity, 1.0)) var(--bg-mask-start-distance, 0%),
            rgba(0, 0, 0, var(--bg-mask-end-opacity, 0.0)) var(--bg-mask-end-distance, 100%)
          )
        `,
        },
        '.bg-mask-none': {
            '--bg-mask-gradient': 'unset',
        },
    });
    /*
    Utilities for adding gradient mask animation
    */
    // Allow adding default transition to gradient mask
    addUtilities({
        '.edge-mask-transition': {
            '--edge-mask-duration': '50ms',
        },
        '.bg-mask-transition': {
            '--bg-mask-duration': '50ms',
        },
    });
    // Allow changing transition duration
    matchUtilities({
        'edge-mask-duration': (value) => ({
            '--edge-mask-duration': value,
        }),
        'bg-mask-duration': (value) => ({
            '--bg-mask-duration': value,
        }),
    }, {
        values: Object.assign(Object.assign({}, theme('transitionDuration')), { DEFAULT: '50ms' }),
    });
    // Allow changing transition timing function
    matchUtilities({
        'edge-mask-transition-ease': (value) => ({
            '--edge-mask-transition-timing-function': value,
        }),
        'bg-mask-transition-ease': (value) => ({
            '--bg-mask-transition-timing-function': value,
        }),
    }, {
        values: theme('transitionTimingFunction'),
    });
    /*
    Setup CSS houdini properties so we can transition the gradient mask
    */
    addBase({
        '@property --edge-mask-top-opacity': {
            syntax: "'<number>'",
            inherits: 'false',
            'initial-value': '1.0',
        },
        '@property --edge-mask-right-opacity': {
            syntax: "'<number>'",
            inherits: 'false',
            'initial-value': '1.0',
        },
        '@property --edge-mask-bottom-opacity': {
            syntax: "'<number>'",
            inherits: 'false',
            'initial-value': '1.0',
        },
        '@property --edge-mask-left-opacity': {
            syntax: "'<number>'",
            inherits: 'false',
            'initial-value': '1.0',
        },
        '@property --bg-mask-start-opacity': {
            syntax: "'<number>'",
            inherits: 'false',
            'initial-value': '1.0',
        },
        '@property --bg-mask-end-opacity': {
            syntax: "'<number>'",
            inherits: 'false',
            'initial-value': '0.0',
        },
        '@property --bg-mask-start-distance': {
            syntax: "'<length-percentage>'",
            inherits: 'false',
            'initial-value': '0%',
        },
        '@property --bg-mask-end-distance': {
            syntax: "'<length-percentage>'",
            inherits: 'false',
            'initial-value': '100%',
        },
    });
}, {
    theme: {
        extend: {
            gradientMaskEdgeDistance: ({ theme }) => (Object.assign(Object.assign({}, theme('spacing')), { DEFAULT: '10%', '1/10': '10%', '1/2': '50%', '9/10': '90%', full: '100%' })),
        },
    },
});
