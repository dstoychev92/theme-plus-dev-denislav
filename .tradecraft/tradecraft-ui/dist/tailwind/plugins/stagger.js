import plugin from 'tailwindcss/plugin';
/**
 * Tailwind Plugin for Advanced Staggered Animations and Transitions
 *
 * This plugin extends Tailwind CSS to provide utilities for creating staggered animations and transitions.
 * It supports both automatic and manual staggering of elements based on their order.
 *
 * ## Features:
 * - Automatic stagger for the first N child elements (configurable via `staggerChildrenCount`).
 * - Manual staggering by specifying the order.
 * - Customizable delay durations via theming.
 *
 * ## How to Use:
 *
 * ### Automatic Staggering (requires tailwind-children plugin)
 * - Use `.*:auto-stagger-animations` or `.*:auto-stagger-transitions` to automatically stagger child elements.
 *
 * ### Manual Staggering:
 * - Use `.stagger-animation` or `.stagger-transition` and set the `--stagger-order` or `--stagger-order` variable.
 *
 * ### Customizing Durations:
 * - Utilize Tailwind's `animationDuration` and `transitionDuration` in your theme configuration.
 *
 * ## Examples:
 *
 * ```html
 * <!-- Automatic Staggering -->
 * <div class="*:auto-stagger-animations *:animate-fade-in">
 *   <div>1</div>
 *   <div>2</div>
 *   <!-- ... -->
 * </div>
 * ```
 *
 * ```html
 * <!-- Manual Staggering -->
 * <div style="--stagger-order: 2;" class="stagger-animation">1</div>
 * <div style="--stagger-order: 1;" class="stagger-animation">2</div>
 * ```
 *
 * ## Customization:
 *
 * - `staggerChildrenCount`: Controls the maximum number of elements to stagger automatically. Change based on your performance needs.
 * - Theme's `animationDuration` and `transitionDuration`: Used for setting animation and transition durations.
 *
 */
export default plugin(({ matchUtilities, addUtilities, theme }) => {
    // Arbitrary number, change as needed although probably don't want to animate too many els to avoid generating too many classes
    const staggerChildrenCount = 10;
    const staggerDelay = 'calc(var(--stagger-start, 0ms) + var(--stagger-offset, 0ms) * var(--stagger-order))';
    /*
    Animation specific stagger utilities
    */
    addUtilities({
        // Manually setup stagger animation delay for an element
        '.stagger-animation': {
            '--stagger-start': 'var(--animate-delay, 0ms)',
            '--stagger-delay': staggerDelay,
            animationDelay: 'var(--stagger-delay)',
        },
    });
    matchUtilities({
        // Manually setup stagger animation delay for an element
        'stagger-animation': (value) => ({
            '--stagger-start': 'var(--animate-delay, 0ms)',
            '--stagger-offset': value,
            '--stagger-delay': staggerDelay,
            animationDelay: 'var(--stagger-delay)',
        }),
        // Automatically stagger transition on first n children (controlled by staggerChildrenCount)
        'auto-stagger-animations': (value) => [...Array(staggerChildrenCount).keys()].reduce((m, i) => (Object.assign(Object.assign({}, m), { [`&:nth-child(${i + 1})`]: {
                '--stagger-start': 'var(--animate-delay, 0ms)',
                '--stagger-offset': value,
                '--stagger-delay': staggerDelay,
                '--stagger-order': `${i}`, // Need to use a string so tailwind doesn't auto convert to a pixel value
                animationDelay: 'var(--stagger-delay)',
            } })), {}),
    }, { values: theme('staggerOffset', { DEFAULT: '25ms' }) });
    /*
    Transition specific stagger utilities
    */
    addUtilities({
        // Manually setup stagger transition delay for an element
        '.stagger-transition': {
            '--stagger-start': 'var(--tw-transition-delay, 0ms)',
            '--stagger-delay': staggerDelay,
            transitionDelay: 'var(--stagger-delay)',
        },
    });
    matchUtilities({
        // Manually setup stagger transition delay for an element
        'stagger-transition': (value) => ({
            '--stagger-start': 'var(--tw-transition-delay, 0ms)',
            '--stagger-offset': value,
            '--stagger-delay': staggerDelay,
            transitionDelay: 'var(--stagger-delay)',
        }),
        // Automatically stagger transition on first n children (controlled by staggerChildrenCount)
        'auto-stagger-transitions': (value) => [...Array(staggerChildrenCount).keys()].reduce((m, i) => (Object.assign(Object.assign({}, m), { [`&:nth-child(${i + 1})`]: {
                // TODO make --tw-transition-delay configurable
                '--stagger-start': 'var(--tw-transition-delay, 0ms)',
                '--stagger-offset': value,
                '--stagger-delay': staggerDelay,
                '--stagger-order': `${i}`, // Need to use a string so tailwind doesn't auto convert to a pixel value
                transitionDelay: 'var(--stagger-delay)',
            } })), {}),
    }, { values: theme('staggerOffset', { DEFAULT: '25ms' }) });
    /*
    Various staggering utilities
    */
    matchUtilities({
        // Manually set --stagger-offset variable for an element
        stagger: (value) => ({
            '--stagger-offset': `${value}`,
        }),
    }, { values: theme('staggerOffset', { DEFAULT: '25ms' }) });
    addUtilities({
        // Automatically set and increment --stagger-order variable on first n children (controlled by staggerChildrenCount)
        '.auto-set-stagger-order': [...Array(staggerChildrenCount).keys()].reduce((m, i) => (Object.assign(Object.assign({}, m), { [`&:nth-child(${i + 1})`]: {
                '--stagger-order': `${i}`, // Need to use a string so tailwind doesn't auto convert to a pixel value
            } })), {}),
    });
}, {
    theme: {
        extend: {
            staggerOffset: ({ theme }) => (Object.assign({}, theme('transitionDelay'))),
        },
    },
});
