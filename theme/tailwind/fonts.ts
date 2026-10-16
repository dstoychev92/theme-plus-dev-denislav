import plugin from 'tailwindcss/plugin';

export default plugin(function ({addVariant}) {
  /**
   * Add a variant that targets elements that have the `data-fonts-loading` attribute
   * This is useful for delaying animations until the fonts are loaded
   *
   * @example
   * <div class="hidden fonts:block">
   *   Fonts are loaded
   * </div>

   * <div class="prefonts:block hidden">
   *   Fonts are loading
   * </div>
   */
  addVariant('prefonts', `html[data-fonts-loading] &`);
  addVariant('fonts', `html:not([data-fonts-loading]) &`);
});
