import type { Alpine as AlpineType } from 'alpinejs';
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
export default function linkArea(Alpine: AlpineType): void;
