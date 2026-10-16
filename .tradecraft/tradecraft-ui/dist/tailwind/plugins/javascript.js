import plugin from 'tailwindcss/plugin';
/**
 * Add a `js` variant to Tailwind's `responsive` plugin to target styles when JS is enabled.
 *
 * <div class="no-js:hidden js:block">...</div>
 *
 */
export default plugin(function ({ addVariant }) {
    addVariant('js', `@media (scripting: enabled)`);
    addVariant('nojs', `@media (scripting: none)`);
});
