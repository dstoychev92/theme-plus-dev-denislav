/**
 * Add a `js` variant to Tailwind's `responsive` plugin to target styles when JS is enabled.
 *
 * <div class="no-js:hidden js:block">...</div>
 *
 */
declare const _default: {
    handler: import("tailwindcss/types/config").PluginCreator;
    config?: Partial<import("tailwindcss/types/config").Config> | undefined;
};
export default _default;
