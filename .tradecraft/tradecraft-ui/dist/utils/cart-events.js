import { CartErrorEvent, CartLinesUpdateEvent, } from '@shopify/events';
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
export function beginCartLinesUpdate(target, payload) {
    const deferred = CartLinesUpdateEvent.createPromise();
    target.dispatchEvent(new CartLinesUpdateEvent(Object.assign(Object.assign({}, payload), { promise: deferred.promise })));
    return deferred;
}
/**
 * Resolve a lines-update deferred with a cart built from a Shopify ajax cart
 * body, or with `cart: null` when no cart body is available. `detail` carries
 * the theme-facing extras (sections HTML, source, didError, ...).
 */
export function resolveCartLinesUpdate(deferred, ajaxCart, detail) {
    // The cart summary is best-effort. A body that is not a full ajax cart must
    // not break the save flow that resolves this event, so fall back to null.
    let cart = null;
    try {
        cart = ajaxCart ? CartLinesUpdateEvent.createCartFromAjaxResponse(ajaxCart) : null;
    }
    catch (error) {
        console.warn('[cart-events] Could not build a cart summary from the response:', error);
    }
    deferred.resolve({ cart, detail });
}
/**
 * Dispatch `shopify:cart:error` from `target`. Use when the server rejected
 * the request (a response arrived, but it reports a problem).
 */
export function dispatchCartError(target, payload) {
    var _a;
    target.dispatchEvent(new CartErrorEvent(Object.assign({ error: payload.error, code: (_a = payload.code) !== null && _a !== void 0 ? _a : 'INVALID' }, (payload.detail ? { detail: payload.detail } : {}))));
}
/**
 * True when a rejection came from the theme cancelling its own request.
 * async-form aborts with the string reason 'cancelled by user', so fetch
 * rejects with that raw string, not an Error with name AbortError.
 */
export function isAbort(error) {
    return error === 'cancelled by user' || (error === null || error === void 0 ? void 0 : error.name) === 'AbortError';
}
/**
 * Settle a deferred for a request that never completed. The promise always
 * resolves - with `didError: true` - so awaiting listeners settle without a
 * try/catch. A user-triggered abort is not an error: it resolves with
 * `aborted: true` and no error event. Anything else also dispatches
 * `shopify:cart:error` with code SERVICE_UNAVAILABLE.
 */
export function failCartRequest(target, deferred, error) {
    if (isAbort(error)) {
        resolveCartLinesUpdate(deferred, null, { didError: true, aborted: true });
        return;
    }
    resolveCartLinesUpdate(deferred, null, { didError: true });
    dispatchCartError(target, {
        error: (error === null || error === void 0 ? void 0 : error.message) || 'Cart request failed',
        code: 'SERVICE_UNAVAILABLE',
    });
}
