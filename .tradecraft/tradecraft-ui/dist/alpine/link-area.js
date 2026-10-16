const INTERACTIVE = 'a, button, [role="button"], input, select, textarea, label, summary, details';
const IGNORED = '[data-link-area-ignore]';
const SKIPPED = `${INTERACTIVE}, ${IGNORED}`;
/**
 * Makes a container element act as a clickable link area by delegating clicks
 * to a real `<a>` descendant. The anchor provides href/target and remains the
 * accessible target for keyboard navigation, context menus, and assistive
 * technology.
 *
 * By default, the first `a[href]` descendant is used. Add
 * `x-link-area:anchor` to designate a particular anchor instead.
 *
 * Add `data-link-area-ignore` to a region that should not delegate clicks,
 * such as the gaps around a row of small controls. Controls inside the region
 * continue to handle their own clicks normally.
 *
 * @example Default anchor
 * ```html
 * <div x-link-area>
 *   <a href="/path">Product title</a>
 *   <span>Product price</span>
 * </div>
 * ```
 *
 * @example Designated anchor and ignored region
 * ```html
 * <div x-link-area>
 *   <a x-link-area:anchor href="/path">Product title</a>
 *   <div data-link-area-ignore>
 *     <a href="/path?variant=1">Variant</a>
 *   </div>
 * </div>
 * ```
 */
export default function linkArea(Alpine) {
    Alpine.directive('link-area', ($el, { value }) => {
        if (value === 'anchor') {
            $el.dataset.linkAreaAnchor = 'true';
            return;
        }
        function findLink() {
            var _a;
            return ((_a = $el.querySelector('[data-link-area-anchor]')) !== null && _a !== void 0 ? _a : $el.querySelector('a[href]'));
        }
        // Alpine's Bindings type declares every value as `() => unknown`, but at
        // runtime event handlers receive the event. Keep the assertion at this
        // boundary so the handler bodies retain their concrete event types.
        Alpine.bind($el, {
            '@click'(_event) {
                var _a;
                const event = _event;
                if (event.target.closest(SKIPPED))
                    return;
                if ((_a = window.getSelection()) === null || _a === void 0 ? void 0 : _a.toString())
                    return;
                const link = findLink();
                if (!link)
                    return;
                const { href, target } = link;
                if (event.metaKey || event.ctrlKey || target === '_blank') {
                    window.open(href, '_blank');
                }
                else if (event.shiftKey) {
                    window.open(href);
                }
                else {
                    window.location.href = href;
                }
            },
            '@auxclick'(_event) {
                const event = _event;
                if (event.button !== 1)
                    return;
                if (event.target.closest(SKIPPED))
                    return;
                const link = findLink();
                if (!link)
                    return;
                event.preventDefault();
                window.open(link.href, '_blank');
            },
        });
    });
}
