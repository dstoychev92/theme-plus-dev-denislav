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
export function createCartRequestGroup(onSettle) {
    let pending = 0;
    let requestCount = 0;
    let latestRequest = 0;
    let latestDetail = null;
    return {
        get pending() {
            return pending;
        },
        async track(promise) {
            var _a;
            const request = ++requestCount;
            latestRequest = request;
            pending += 1;
            let detail = null;
            try {
                const result = (_a = (await promise)) === null || _a === void 0 ? void 0 : _a.detail;
                if (!(result === null || result === void 0 ? void 0 : result.didError)) {
                    detail = result !== null && result !== void 0 ? result : {};
                }
            }
            catch (_b) {
                detail = null;
            }
            finally {
                pending -= 1;
            }
            // Only the request that started last decides what the group renders
            if (request === latestRequest) {
                latestDetail = detail;
            }
            if (pending > 0)
                return;
            const latest = latestDetail;
            latestDetail = null;
            onSettle(latest);
        },
    };
}
