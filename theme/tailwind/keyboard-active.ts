import plugin from 'tailwindcss/plugin';

/**
 * Add a `keyboard-focus:` to target styles when user is navigating with the keyboard
 *
 * <div class="keyboard-focus:border-red">...</div>
 *
 */
export default plugin(function ({addVariant}) {
  addVariant('keyboard-active', `:is([data-keyboard-active] &)`);
  addVariant('keyboard-focus', `:is([data-keyboard-active] &:focus)`);
  addVariant('keyboard-focus-within', `:is([data-keyboard-active] &:focus-within)`);
});
