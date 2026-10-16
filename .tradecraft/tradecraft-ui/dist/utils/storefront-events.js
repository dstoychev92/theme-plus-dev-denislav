import { CollectionUpdateEvent, SearchUpdateEvent } from '@shopify/events';
/**
 * Helpers for the standard `shopify:collection:update` and
 * `shopify:search:update` storefront events
 * (https://shopify.dev/docs/api/storefront-events-and-actions).
 *
 * Themes call these from their existing `theme:section:navigate` handlers,
 * which fire after the section HTML has been replaced. The result is already
 * final at dispatch time, so the deferred resolves immediately — consumers see
 * one settled event slightly later instead of a pending phase. Filters and
 * sort key are read from the current URL by the standard-events module.
 */
/**
 * Dispatch `shopify:collection:update` from `target`.
 *
 * @example
 * ```
 * @theme:section:navigate.window="dispatchCollectionUpdate($el, {
 *   collectionId: '12345',
 *   handle: 'shoes',
 *   productsCount: Number($el.dataset.resultsCount),
 * })"
 * ```
 */
export function dispatchCollectionUpdate(target, payload) {
    const deferred = CollectionUpdateEvent.createPromise();
    const productFilters = CollectionUpdateEvent.parseProductFilters();
    target.dispatchEvent(new CollectionUpdateEvent(Object.assign(Object.assign({ collection: {
            // Non-numeric handles like 'all' (the automatic all-products collection)
            // fail GID validation, so send null for those
            id: payload.collectionId && /^\d+$/.test(payload.collectionId) ? payload.collectionId : null,
            handle: payload.handle,
            productsCount: payload.productsCount,
        } }, (productFilters ? { productFilters } : {})), { sortKey: CollectionUpdateEvent.getSortKey(), promise: deferred.promise })));
    deferred.resolve({ productsCount: payload.productsCount });
}
/**
 * Dispatch `shopify:search:update` from `target`.
 *
 * @example
 * ```
 * dispatchSearchUpdate($el, {query: 'red shoes', totalCount: 12})
 * ```
 */
export function dispatchSearchUpdate(target, payload) {
    const deferred = SearchUpdateEvent.createPromise();
    const productFilters = SearchUpdateEvent.parseProductFilters();
    target.dispatchEvent(new SearchUpdateEvent({
        search: Object.assign(Object.assign({ query: payload.query }, (productFilters ? { productFilters } : {})), { sortKey: SearchUpdateEvent.getSortKey() }),
        promise: deferred.promise,
    }));
    deferred.resolve({ totalCount: payload.totalCount });
}
