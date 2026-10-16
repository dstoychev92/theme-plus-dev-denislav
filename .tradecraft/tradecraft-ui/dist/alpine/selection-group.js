const ITEM_SELECTOR = '[data-selection-id]';
const TARGET_SELECTOR = '[data-selection-target]';
function normalizeId(id) {
    return id === undefined || id === '' ? null : id;
}
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
export default function selectionGroup(Alpine) {
    Alpine.directive('selection-group', ($el, { value }, { cleanup }) => {
        if (value !== null) {
            throw new Error(`Unknown directive: x-selection-group:${value}`);
        }
        const root = $el;
        let selectedId = normalizeId(root.dataset.selectedId);
        let pendingId = null;
        const ownsItem = (item) => item.closest('[x-selection-group]') === root;
        const applyState = () => {
            const isLoading = root.hasAttribute('data-selection-loading');
            for (const item of root.querySelectorAll(ITEM_SELECTOR)) {
                if (!ownsItem(item))
                    continue;
                const isSelected = normalizeId(item.dataset.selectionId) === selectedId;
                item.dataset.selected = String(isSelected);
                if (isSelected) {
                    item.setAttribute('aria-current', 'true');
                }
                else {
                    item.removeAttribute('aria-current');
                }
                const targets = item.matches(TARGET_SELECTOR)
                    ? [item, ...item.querySelectorAll(TARGET_SELECTOR)]
                    : item.querySelectorAll(TARGET_SELECTOR);
                for (const target of targets) {
                    if (target.closest(ITEM_SELECTOR) !== item)
                        continue;
                    target.dataset.selected = String(isSelected);
                    if (isSelected && isLoading && pendingId === selectedId) {
                        target.dataset.pending = 'true';
                    }
                    else {
                        target.removeAttribute('data-pending');
                    }
                }
            }
        };
        const selectionIdFromEvent = (event) => {
            if (!(event.target instanceof Element))
                return null;
            const item = event.target.closest(ITEM_SELECTOR);
            if (!item || !ownsItem(item))
                return null;
            return normalizeId(item.dataset.selectionId);
        };
        const handlePending = (event) => {
            const eventPendingId = selectionIdFromEvent(event);
            if (eventPendingId === null)
                return;
            selectedId = eventPendingId;
            pendingId = eventPendingId;
            applyState();
        };
        const handleError = (event) => {
            const failedId = selectionIdFromEvent(event);
            if (failedId === null || selectedId !== failedId)
                return;
            pendingId = null;
            selectedId = normalizeId(root.dataset.selectedId);
            applyState();
        };
        const handleLoaded = (event) => {
            const loadedId = selectionIdFromEvent(event);
            if (loadedId === null || pendingId !== loadedId)
                return;
            pendingId = null;
            selectedId = normalizeId(root.dataset.selectedId);
            applyState();
        };
        const handleAborted = (event) => {
            const abortedId = selectionIdFromEvent(event);
            if (abortedId === null || pendingId !== abortedId)
                return;
            pendingId = null;
            selectedId = normalizeId(root.dataset.selectedId);
            applyState();
        };
        const observer = new MutationObserver((mutations) => {
            if (mutations.some((mutation) => mutation.target === root && mutation.attributeName === 'data-selected-id')) {
                selectedId = normalizeId(root.dataset.selectedId);
            }
            applyState();
        });
        root.addEventListener('link:pending', handlePending);
        root.addEventListener('link:loaded', handleLoaded);
        root.addEventListener('link:error', handleError);
        root.addEventListener('link:aborted', handleAborted);
        observer.observe(root, {
            attributes: true,
            attributeFilter: ['data-selected-id', 'data-selection-id', 'data-selection-loading', 'data-selection-target'],
            childList: true,
            subtree: true,
        });
        applyState();
        cleanup(() => {
            observer.disconnect();
            root.removeEventListener('link:pending', handlePending);
            root.removeEventListener('link:loaded', handleLoaded);
            root.removeEventListener('link:error', handleError);
            root.removeEventListener('link:aborted', handleAborted);
        });
    }).before('bind');
}
