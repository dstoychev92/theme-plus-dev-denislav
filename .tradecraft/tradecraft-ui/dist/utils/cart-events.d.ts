import { CartAjaxResponse, CartErrorPayload, CartLinesUpdateEvent, CartLinesUpdatePayload, CartLinesUpdateResultDetail, WithGidInput } from '@shopify/events';
/**
 * Helpers for the standard `shopify:cart:*` storefront events
 * (https://shopify.dev/docs/api/storefront-events-and-actions).
 *
 * The contract these helpers implement: dispatch `shopify:cart:lines-update`
 * synchronously before the network request starts, carrying a promise that
 * settles when the request does. Listeners (cart drawer, cart icon, analytics)
 * can react to the intent immediately and await the promise for the result.
 */
export type CartLinesUpdateDeferred = ReturnType<typeof CartLinesUpdateEvent.createPromise>;
type DistributiveOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never;
export type CartLinesUpdateInput = WithGidInput<DistributiveOmit<CartLinesUpdatePayload, 'promise'>>;
/**
 * Dispatch `shopify:cart:lines-update` from `target` and return the deferred
 * that settles the event's promise. Call before starting the cart request.
 *
 * @example
 * ```ts
 * const deferred = beginCartLinesUpdate(formEl, {
 *   action: 'add',
 *   context: 'product',
 *   lines: [{merchandiseId: variantId, quantity: 1}],
 * });
 * ```
 */
export declare function beginCartLinesUpdate(target: EventTarget, payload: CartLinesUpdateInput): CartLinesUpdateDeferred;
/**
 * Resolve a lines-update deferred with a cart built from a Shopify ajax cart
 * body, or with `cart: null` when no cart body is available. `detail` carries
 * the theme-facing extras (sections HTML, source, didError, ...).
 */
export declare function resolveCartLinesUpdate(deferred: CartLinesUpdateDeferred, ajaxCart: CartAjaxResponse | null, detail: CartLinesUpdateResultDetail): void;
/**
 * Dispatch `shopify:cart:error` from `target`. Use when the server rejected
 * the request (a response arrived, but it reports a problem).
 */
export declare function dispatchCartError(target: EventTarget, payload: {
    error: string;
    code?: CartErrorPayload['code'];
    detail?: CartErrorPayload['detail'];
}): void;
/**
 * True when a rejection came from the theme cancelling its own request.
 * async-form aborts with the string reason 'cancelled by user', so fetch
 * rejects with that raw string, not an Error with name AbortError.
 */
export declare function isAbort(error: unknown): boolean;
/**
 * Settle a deferred for a request that never completed. The promise always
 * resolves - with `didError: true` - so awaiting listeners settle without a
 * try/catch. A user-triggered abort is not an error: it resolves with
 * `aborted: true` and no error event. Anything else also dispatches
 * `shopify:cart:error` with code SERVICE_UNAVAILABLE.
 */
export declare function failCartRequest(target: EventTarget, deferred: CartLinesUpdateDeferred, error: unknown): void;
export {};
