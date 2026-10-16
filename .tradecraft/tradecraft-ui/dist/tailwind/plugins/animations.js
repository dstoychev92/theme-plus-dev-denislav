//
/**
 * This plugin adds a set of utilities for creating animations
 *
 * This plugin is based on the tailwindcss-animate plugin, read this for full docs: https://github.com/jamiebuilds/tailwindcss-animate
 *
 */
import plugin from 'tailwindcss/plugin';
import { withoutDefault } from '../utils/withoutDefault';
export default plugin(({ addUtilities, matchUtilities, addBase, theme }) => {
    addBase({
        ':root': {
            '--enter-opacity-animation': 'none',
            '--enter-transform-animation': 'none',
            '--enter-blur-animation': 'none',
            '--enter-draw-animation': 'none',
            '--exit-opacity-animation': 'none',
            '--exit-transform-animation': 'none',
            '--exit-blur-animation': 'none',
            '--exit-draw-animation': 'none',
        },
    });
    /* Enter / exit animations */
    addUtilities({
        '@keyframes enterOpacity': theme('keyframes.enterOpacity'),
        '@keyframes exitOpacity': theme('keyframes.exitOpacity'),
        '@keyframes enterTransform': theme('keyframes.enterTransform'),
        '@keyframes exitTransform': theme('keyframes.exitTransform'),
        '@keyframes enterBlur': theme('keyframes.enterBlur'),
        '@keyframes exitBlur': theme('keyframes.exitBlur'),
        '@keyframes enterDraw': theme('keyframes.enterDraw'),
        '@keyframes exitDraw': theme('keyframes.exitDraw'),
        // See https://github.com/jamiebuilds/tailwindcss-animate#adding-enter-animations
        '.animate-in': {
            animationName: 'var(--enter-opacity-animation), var(--enter-transform-animation), var(--enter-blur-animation), var(--enter-draw-animation)',
            animationDuration: `
          var(--animate-opacity-duration, var(--animate-duration, ${theme('animationDuration.DEFAULT')})),
          var(--animate-transform-duration, var(--animate-duration, ${theme('animationDuration.DEFAULT')})),
          var(--animate-blur-duration, var(--animate-duration, ${theme('animationDuration.DEFAULT')})),
          var(--animate-draw-duration, var(--animate-duration, ${theme('animationDuration.DEFAULT')}))
        `,
            animationTimingFunction: `var(--animate-ease, ${theme('animationTimingFunction.DEFAULT')})`,
            animationFillMode: 'var(--animate-fill-mode, both)',
            animationDirection: 'var(--animate-direction, normal)',
            // Reset all variables to initial values in case this is a nested animation
            '--enter-opacity-animation': 'none',
            '--enter-transform-animation': 'none',
            '--enter-blur-animation': 'none',
            '--enter-draw-animation': 'none',
            '--exit-opacity-animation': 'none',
            '--exit-transform-animation': 'none',
            '--exit-blur-animation': 'none',
            '--exit-draw-animation': 'none',
            '--enter-opacity': 'initial',
            '--enter-scale-x': 'initial',
            '--enter-scale-y': 'initial',
            '--enter-scale-z': 'initial',
            '--enter-rotate': 'initial',
            '--enter-translate-x': 'initial',
            '--enter-translate-y': 'initial',
            '--enter-blur': 'initial',
            '--enter-stroke-dashoffset': 'initial',
        },
        // See https://github.com/jamiebuilds/tailwindcss-animate#adding-exit-animations
        '.animate-out': {
            animationName: 'var(--exit-opacity-animation), var(--exit-transform-animation), var(--exit-blur-animation), var(--exit-draw-animation)',
            animationDuration: `
          var(--animate-opacity-duration, var(--animate-duration, ${theme('animationDuration.DEFAULT')})),
          var(--animate-transform-duration, var(--animate-duration, ${theme('animationDuration.DEFAULT')})),
          var(--animate-blur-duration, var(--animate-duration, ${theme('animationDuration.DEFAULT')})),
          var(--animate-draw-duration, var(--animate-duration, ${theme('animationDuration.DEFAULT')}))
        `,
            animationTimingFunction: `var(--animate-ease, ${theme('animationTimingFunction.DEFAULT')})`,
            animationFillMode: 'var(--animate-fill-mode, both)',
            animationDirection: 'var(--animate-direction, normal)',
            '--exit-opacity': 'initial',
            '--exit-scale-x': 'initial',
            '--exit-scale-y': 'initial',
            '--exit-scale-z': 'initial',
            '--exit-rotate': 'initial',
            '--exit-translate-x': 'initial',
            '--exit-translate-y': 'initial',
            '--exit-blur': 'initial',
            '--exit-stroke-dashoffset': 'initial',
        },
    });
    /* Basic animations */
    matchUtilities({
        'blur-in': (value) => ({
            '--enter-blur': value,
            '--enter-blur-animation': 'enterBlur',
        }),
        'blur-out': (value) => ({
            '--exit-blur': value,
            '--exit-blur-animation': 'exitBlur',
        }),
    }, { values: theme('animationBlur') });
    matchUtilities({
        'fade-in': (value) => ({
            '--enter-opacity': value,
            '--enter-opacity-animation': 'enterOpacity',
        }),
        'fade-out': (value) => ({
            '--exit-opacity': value,
            '--exit-opacity-animation': 'exitOpacity',
        }),
    }, { values: theme('animationOpacity') });
    matchUtilities({
        'scale-in': (value) => ({
            '--enter-scale-x': value,
            '--enter-scale-y': value,
            '--enter-transform-animation': 'enterTransform',
        }),
        'scale-out': (value) => ({
            '--exit-scale-x': value,
            '--exit-scale-y': value,
            '--exit-transform-animation': 'exitTransform',
        }),
        'scale-in-x': (value) => ({
            '--enter-scale-x': value,
            '--enter-transform-animation': 'enterTransform',
        }),
        'scale-in-y': (value) => ({
            '--enter-scale-y': value,
            '--enter-transform-animation': 'enterTransform',
        }),
        'scale-out-x': (value) => ({
            '--exit-scale-x': value,
            '--exit-transform-animation': 'exitTransform',
        }),
        'scale-out-y': (value) => ({
            '--exit-scale-y': value,
            '--exit-transform-animation': 'exitTransform',
        }),
    }, { values: theme('animationScale') });
    matchUtilities({
        'spin-in': (value) => ({
            '--enter-rotate': value,
            '--enter-transform-animation': 'enterTransform',
        }),
        'spin-out': (value) => ({
            '--exit-rotate': value,
            '--exit-transform-animation': 'exitTransform',
        }),
    }, { values: theme('animationRotate') });
    /* Slide in/out animations */
    matchUtilities({
        'slide-in-from-top': (value) => ({
            '--enter-translate-y': `-${value}`,
            '--enter-transform-animation': 'enterTransform',
        }),
        'slide-in-from-bottom': (value) => ({
            '--enter-translate-y': value,
            '--enter-transform-animation': 'enterTransform',
        }),
        'slide-in-from-left': (value) => ({
            '--enter-translate-x': `-${value}`,
            '--enter-transform-animation': 'enterTransform',
        }),
        'slide-in-from-right': (value) => ({
            '--enter-translate-x': value,
            '--enter-transform-animation': 'enterTransform',
        }),
        'slide-in-from-top-left': (value) => ({
            '--enter-translate-x': `-${value}`,
            '--enter-translate-y': `-${value}`,
            '--enter-transform-animation': 'enterTransform',
        }),
        'slide-in-from-top-right': (value) => ({
            '--enter-translate-x': value,
            '--enter-translate-y': `-${value}`,
            '--enter-transform-animation': 'enterTransform',
        }),
        'slide-in-from-bottom-left': (value) => ({
            '--enter-translate-x': `-${value}`,
            '--enter-translate-y': value,
            '--enter-transform-animation': 'enterTransform',
        }),
        'slide-in-from-bottom-right': (value) => ({
            '--enter-translate-x': value,
            '--enter-translate-y': value,
            '--enter-transform-animation': 'enterTransform',
        }),
        'slide-out-to-top': (value) => ({
            '--exit-translate-y': `-${value}`,
            '--exit-transform-animation': 'exitTransform',
        }),
        'slide-out-to-bottom': (value) => ({
            '--exit-translate-y': value,
            '--exit-transform-animation': 'exitTransform',
        }),
        'slide-out-to-left': (value) => ({
            '--exit-translate-x': `-${value}`,
            '--exit-transform-animation': 'exitTransform',
        }),
        'slide-out-to-right': (value) => ({
            '--exit-translate-x': value,
            '--exit-transform-animation': 'exitTransform',
        }),
        'slide-out-to-top-left': (value) => ({
            '--exit-translate-y': `-${value}`,
            '--exit-translate-x': `-${value}`,
            '--exit-transform-animation': 'exitTransform',
        }),
        'slide-out-to-top-right': (value) => ({
            '--exit-translate-y': `-${value}`,
            '--exit-translate-x': value,
            '--exit-transform-animation': 'exitTransform',
        }),
        'slide-out-to-bottom-left': (value) => ({
            '--exit-translate-y': value,
            '--exit-translate-x': `-${value}`,
            '--exit-transform-animation': 'exitTransform',
        }),
        'slide-out-to-bottom-right': (value) => ({
            '--exit-translate-y': value,
            '--exit-translate-x': value,
            '--exit-transform-animation': 'exitTransform',
        }),
    }, { values: theme('animationTranslate') });
    /* SVG stroke dasharray animations */
    matchUtilities({
        'draw-in': (value) => ({
            '--enter-stroke-dashoffset': value,
            '--enter-draw-animation': 'enterDraw',
        }),
    }, {
        values: {
            DEFAULT: '100',
            '100': '100',
            '0': '0',
            '99': '99',
            '1': '1',
        },
        type: 'number',
    });
    matchUtilities({
        'draw-out': (value) => ({
            '--exit-stroke-dashoffset': value,
            '--exit-draw-animation': 'exitDraw',
        }),
    }, {
        values: {
            DEFAULT: '0',
            '100': '100',
            '0': '0',
            '99': '99',
            '1': '1',
        },
        type: 'number',
    });
    /* Various animation properties */
    matchUtilities({
        'animate-duration': (value) => ({
            '--animate-duration': value,
            animationDuration: value,
        }),
        'animate-opacity-duration': (value) => ({
            '--animate-opacity-duration': value,
        }),
        'animate-transform-duration': (value) => ({
            '--animate-transform-duration': value,
        }),
        'animate-blur-duration': (value) => ({
            '--animate-blur-duration': value,
        }),
        'animate-draw-duration': (value) => ({
            '--animate-draw-duration': value,
        }),
    }, { values: withoutDefault(theme('animationDuration')) });
    matchUtilities({
        'animate-delay': (value) => ({
            '--animate-delay': value,
            animationDelay: value,
        }),
    }, { values: theme('animationDelay') });
    matchUtilities({
        'animate-ease': (value) => ({
            '--animate-ease': value,
            animationTimingFunction: 'var(--animate-ease)',
        }),
    }, { values: withoutDefault(theme('animationTimingFunction')) });
    addUtilities({
        '.running': { animationPlayState: 'running' },
        '.paused': { animationPlayState: 'paused' },
    });
    matchUtilities({
        'fill-mode': (value) => ({
            '--animate-fill-mode': value,
            animationFillMode: 'var(--animate-fill-mode)',
        }),
    }, { values: theme('animationFillMode') });
    matchUtilities({
        direction: (value) => ({
            '--animate-direction': value,
            animationDirection: 'var(--animate-direction)',
        }),
    }, { values: theme('animationDirection') });
    matchUtilities({ repeat: (value) => ({ animationIterationCount: value }) }, { values: theme('animationRepeat') });
}, {
    theme: {
        extend: {
            animationDelay: ({ theme }) => (Object.assign({}, theme('transitionDelay'))),
            animationDuration: ({ theme }) => (Object.assign({ 0: '0ms' }, theme('transitionDuration'))),
            animationTimingFunction: ({ theme }) => (Object.assign({}, theme('transitionTimingFunction'))),
            animationFillMode: {
                none: 'none',
                forwards: 'forwards',
                backwards: 'backwards',
                both: 'both',
            },
            animationDirection: {
                normal: 'normal',
                reverse: 'reverse',
                alternate: 'alternate',
                'alternate-reverse': 'alternate-reverse',
            },
            animationStrokeDasharray: () => ({
                DEFAULT: '100',
                '100': '100',
                '0': '0',
                '99': '99',
                '1': '1',
            }),
            animationOpacity: ({ theme }) => (Object.assign({ DEFAULT: 0 }, theme('opacity'))),
            animationBlur: ({ theme }) => (Object.assign({ DEFAULT: '0px' }, theme('blur'))),
            animationTranslate: ({ theme }) => (Object.assign({ DEFAULT: '100%' }, theme('translate'))),
            animationScale: ({ theme }) => (Object.assign({ DEFAULT: 0 }, theme('scale'))),
            animationRotate: ({ theme }) => (Object.assign({ DEFAULT: '30deg' }, theme('rotate'))),
            animationRepeat: {
                0: '0',
                1: '1',
                infinite: 'infinite',
            },
            keyframes: {
                enterOpacity: {
                    from: {
                        opacity: 'var(--enter-opacity, 1)',
                    },
                },
                exitOpacity: {
                    to: {
                        opacity: 'var(--exit-opacity, 1)',
                    },
                },
                enterTransform: {
                    from: {
                        transform: 'translate3d(var(--enter-translate-x, 0), var(--enter-translate-y, 0), 0) scale3d(var(--enter-scale-x, 1), var(--enter-scale-y, 1), var(--enter-scale-z, 1)) rotate(var(--enter-rotate, 0))',
                    },
                },
                exitTransform: {
                    to: {
                        transform: 'translate3d(var(--exit-translate-x, 0), var(--exit-translate-y, 0), 0) scale3d(var(--exit-scale-x, 1), var(--exit-scale-y, 1), var(--exit-scale-z, 1)) rotate(var(--exit-rotate, 0))',
                    },
                },
                enterBlur: {
                    from: {
                        filter: 'blur(var(--enter-blur, 0px))',
                    },
                },
                exitBlur: {
                    to: {
                        filter: 'blur(var(--exit-blur, 0px))',
                    },
                },
                enterDraw: {
                    '0%': {
                        strokeDasharray: 'var(--enter-stroke-dashoffset, 0)',
                        strokeDashoffset: 'var(--enter-stroke-dashoffset, 0)',
                    },
                    '99%': {
                        /* dasharray doesn't animate but needs to finish at 0 to allow mitre joins */
                        strokeDasharray: 'var(--enter-stroke-dashoffset, 0)',
                    },
                },
                exitDraw: {
                    '99%': {
                        /* dasharray doesn't animate but needs to finish at 0 to allow mitre joins */
                        strokeDasharray: '0',
                    },
                    '100%': {
                        strokeDasharray: 'var(--exit-stroke-dashoffset, 0)',
                        strokeDashoffset: 'var(--exit-stroke-dashoffset, 0)',
                    },
                },
            },
        },
    },
});
