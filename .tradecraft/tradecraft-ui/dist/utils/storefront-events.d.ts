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
export declare function dispatchCollectionUpdate(target: EventTarget, payload: {
    collectionId?: string;
    handle: string;
    productsCount: number;
}): void;
/**
 * Dispatch `shopify:search:update` from `target`.
 *
 * @example
 * ```
 * dispatchSearchUpdate($el, {query: 'red shoes', totalCount: 12})
 * ```
 */
export declare function dispatchSearchUpdate(target: EventTarget, payload: {
    query: string;
    totalCount: number;
}): void;
