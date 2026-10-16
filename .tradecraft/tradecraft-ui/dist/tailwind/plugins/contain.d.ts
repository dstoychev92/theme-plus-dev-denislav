/**
 * Utility to allow usage of CSS contain property (see https://developer.mozilla.org/en-US/docs/Web/CSS/contain)
 *
 * e.g.
 *
 * <div class="contain-paint">
 *    ...
 * </div>
 */
declare const _default: {
    handler: import("tailwindcss/types/config").PluginCreator;
    config?: Partial<import("tailwindcss/types/config").Config> | undefined;
};
export default _default;
