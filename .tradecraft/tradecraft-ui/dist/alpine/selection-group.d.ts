import type { Alpine as AlpineType } from 'alpinejs';
/**
 * Coordinates one optimistic selection group through data attributes.
 *
 * `data-selected-id` is the server-confirmed selection. A bubbling
 * `link:pending` event immediately selects the originating
 * `data-selection-id`; `link:error` or `link:aborted` restores the confirmed
 * selection when that request still owns the optimistic state. A successful
 * request re-reads `data-selected-id` after the morph to resynchronize the group.
 *
 * Add `data-selection-target` inside an item to mirror its selected state.
 * After a link in the group becomes pending, the selected target receives
 * `data-pending="true"` while the root carries `data-selection-loading`.
 * Loading elsewhere on the page does not mark this group pending.
 *
 * @example
 * ```html
 * <div x-selection-group data-selected-id="red" :data-selection-loading="isDelayedLoading">
 *   <a data-selection-id="red"><span data-selection-target></span></a>
 *   <a data-selection-id="blue"><span data-selection-target></span></a>
 * </div>
 * ```
 */
export default function selectionGroup(Alpine: AlpineType): void;
