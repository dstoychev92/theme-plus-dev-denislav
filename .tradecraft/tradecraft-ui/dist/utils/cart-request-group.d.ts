/**
 * What a section reads from a settled cart event promise: the `detail` that
 * `shopify:cart:lines-update` and `shopify:cart:note-update` resolve with.
 */
export type CartRequestDetail = {
    didError?: unknown;
    sections?: unknown;
};
export type CartRequestPromise = Promise<{
    detail?: CartRequestDetail;
}> | undefined;
export type CartRequestGroup = {
    /** Requests that have started and not settled. */
    readonly pending: number;
    /** Count one request in. Resolves when that request has settled. */
    track(promise: CartRequestPromise): Promise<void>;
};
/**
 * Groups cart requests that overlap, so a section renders once per group
 * instead of once per response.
 *
 * Two removes clicked in a row run as two requests, and the first response
 * still lists the second line. Rendering each response as it arrives shows
 * that line again until the second response lands. The group calls
 * `onSettle` once, after every request in it has settled.
 *
 * Shopify applies the requests in the order they start, whatever order their
 * responses arrive in, so the request that started last holds the newest
 * cart. `onSettle` receives that request's detail, or `null` when it failed,
 * was cancelled, or rejected, so the caller can reload from the network.
 *
 * @example
 * ```ts
 * const group = createCartRequestGroup((latest) => {
 *   if (latest) renderSections(latest.sections);
 *   else reload();
 * });
 *
 * window.addEventListener('shopify:cart:lines-update', (event) => {
 *   group.track(event.promise);
 * });
 * ```
 */
export declare function createCartRequestGroup(onSettle: (latest: CartRequestDetail | null) => void): CartRequestGroup;
