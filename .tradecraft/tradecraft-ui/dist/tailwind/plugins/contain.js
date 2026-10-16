// Adapted from
import plugin from 'tailwindcss/plugin';
/**
 * Utility to allow usage of CSS contain property (see https://developer.mozilla.org/en-US/docs/Web/CSS/contain)
 *
 * e.g.
 *
 * <div class="contain-paint">
 *    ...
 * </div>
 */
export default plugin(function ({ addUtilities }) {
    addUtilities({
        '.contain-layout': {
            contain: 'layout',
        },
        '.contain-paint': {
            contain: 'paint',
        },
        '.contain-size': {
            contain: 'size',
        },
        '.contain-style': {
            contain: 'style',
        },
        '.contain-content': {
            contain: 'content',
        },
        '.contain-none': {
            contain: 'none',
        },
        '.contain-strict': {
            contain: 'strict',
        },
    });
});
