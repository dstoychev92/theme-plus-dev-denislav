import plugin from 'tailwindcss/plugin';
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
export default plugin(function ({ matchUtilities }) {
    matchUtilities({
        'col-span': (value) => {
            return {
                gridColumn: `span ${value}`,
            };
        },
    });
});
