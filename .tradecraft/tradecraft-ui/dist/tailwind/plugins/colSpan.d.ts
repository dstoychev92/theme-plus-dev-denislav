/**
 * Utility to allow for aribtrary values in column spans
 *
 * e.g.
 *
 * <div style="
 *   --col-span: 2;
 *   --col-span-tablet: 3;
 *   --col-span-desktop: 4;
 * ">
 *  <div class="col-span-[--col-span] md:col-span-[--col-span-tablet] lg:col-span-[--col-span-desktop]"></div>
 * </div>
 */
declare const _default: {
    handler: import("tailwindcss/types/config").PluginCreator;
    config?: Partial<import("tailwindcss/types/config").Config> | undefined;
};
export default _default;
