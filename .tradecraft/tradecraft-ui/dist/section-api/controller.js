function idleStatus() {
    return { state: 'idle', error: null, pendingUrl: null, abortController: null };
}
function defaultScheduleIdle(callback, timeout) {
    if (typeof globalThis.requestIdleCallback === 'function') {
        return globalThis.requestIdleCallback(callback, { timeout });
    }
    return globalThis.setTimeout(callback, 0);
}
function defaultCancelIdle(id) {
    if (typeof globalThis.cancelIdleCallback === 'function') {
        globalThis.cancelIdleCallback(id);
    }
    else {
        globalThis.clearTimeout(id);
    }
}
function defaultFormatError(error) {
    return error instanceof Error ? error.message : String(error);
}
export function isAbortError(error) {
    const seen = new Set();
    let current = error;
    while (current != null && typeof current === 'object' && !seen.has(current)) {
        if (current.name === 'AbortError')
            return true;
        seen.add(current);
        current = current.cause;
    }
    return false;
}
/**
 * Framework-independent Section Rendering API coordinator.
 *
 * It owns request cancellation and ordering, cache policy, cache writes, idle
 * scheduling, and observable status. Rendering and transport are injected so
 * callers can use it with Alpine, another UI framework, or no framework at all.
 */
export class SectionApiController {
    constructor(options) {
        this.listeners = new Set();
        this.statusValue = idleStatus();
        /** Monotonic ownership token. Only the update holding the latest ID may commit UI or status. */
        this.requestId = 0;
        /** Cache-warming requests keyed by their canonical cache URL. */
        this.pendingLoads = new Map();
        this.idleCallbackId = null;
        /** Lets a superseding update settle the promise returned by an idle-scheduled update. */
        this.idleResolve = null;
        this.destroyed = false;
        this.options = options;
        this.sectionId = options.sectionId;
        this.renderer = options.renderHtml;
    }
    get status() {
        return this.statusValue;
    }
    get state() {
        return this.statusValue.state;
    }
    get error() {
        return this.statusValue.error;
    }
    get pendingUrl() {
        return this.statusValue.pendingUrl;
    }
    get abortController() {
        return this.statusValue.abortController;
    }
    /** Build the canonical cache URL through the host application's URL rules. */
    buildUrl(options) {
        return this.options.buildUrl(options);
    }
    /** Attach or replace the UI renderer without coupling the controller to a framework. */
    setRenderer(renderer) {
        this.renderer = renderer;
    }
    /** Observe atomic status snapshots. Returns an unsubscribe function. */
    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }
    /**
     * Resolve an update according to its cache policy, optionally delaying the
     * work until idle. A newer call cancels any older idle-scheduled call so the
     * older promise cannot remain pending forever.
     */
    update(options) {
        this.assertActive();
        this.cancelScheduledUpdate();
        if (!(options === null || options === void 0 ? void 0 : options.waitForIdle))
            return this.performUpdate(options);
        return new Promise((resolve, reject) => {
            var _a;
            this.idleResolve = resolve;
            this.idleCallbackId = ((_a = this.options.scheduleIdle) !== null && _a !== void 0 ? _a : defaultScheduleIdle)(() => {
                this.idleCallbackId = null;
                this.idleResolve = null;
                void this.performUpdate(options).then(resolve, reject);
            }, 2000);
        });
    }
    /**
     * Warm the cache without rendering or changing observable request state.
     * This is intentionally separate from update() so prefetches do not make UI
     * controls look busy.
     */
    async load(options) {
        var _a, _b, _c, _d;
        this.assertActive();
        const url = (_a = options === null || options === void 0 ? void 0 : options.url) !== null && _a !== void 0 ? _a : this.buildUrl(options);
        if (!(options === null || options === void 0 ? void 0 : options.force) && this.options.cache.get(url))
            return;
        const existingLoad = !(options === null || options === void 0 ? void 0 : options.force) ? this.pendingLoads.get(url) : undefined;
        if (existingLoad) {
            await existingLoad.promise;
            return;
        }
        const abortController = new AbortController();
        const load = this.fetchAndCache({
            sectionId: this.sectionId,
            requestUrl: url,
            cacheKey: url,
            batch: options === null || options === void 0 ? void 0 : options.batch,
            signal: abortController.signal,
            fetchOptions: options === null || options === void 0 ? void 0 : options.fetchOptions,
        });
        const pendingLoad = { promise: load, abortController };
        if (!(options === null || options === void 0 ? void 0 : options.force))
            this.pendingLoads.set(url, pendingLoad);
        try {
            await load;
        }
        catch (error) {
            if (isAbortError(error))
                return;
            const formattedError = ((_b = this.options.formatError) !== null && _b !== void 0 ? _b : defaultFormatError)(error);
            (_d = (_c = this.options).onError) === null || _d === void 0 ? void 0 : _d.call(_c, error, formattedError);
            throw error;
        }
        finally {
            if (this.pendingLoads.get(url) === pendingLoad)
                this.pendingLoads.delete(url);
        }
    }
    /** Abort the active transport. Its normal AbortError is treated as a quiet cancellation. */
    abort() {
        var _a;
        (_a = this.statusValue.abortController) === null || _a === void 0 ? void 0 : _a.abort();
    }
    /**
     * Permanently stop the controller. Incrementing requestId also invalidates
     * transports (such as a batcher) that may still resolve after abort().
     */
    destroy() {
        var _a;
        if (this.destroyed)
            return;
        this.destroyed = true;
        this.requestId++;
        this.cancelScheduledUpdate();
        (_a = this.statusValue.abortController) === null || _a === void 0 ? void 0 : _a.abort();
        for (const pendingLoad of this.pendingLoads.values())
            pendingLoad.abortController.abort();
        this.pendingLoads.clear();
        this.setStatus(idleStatus());
        this.listeners.clear();
    }
    /** Choose the cache strategy and establish ownership for this update. */
    async performUpdate(options) {
        var _a, _b, _c, _d;
        const cachePolicy = (_a = options === null || options === void 0 ? void 0 : options.cachePolicy) !== null && _a !== void 0 ? _a : 'cache-and-network';
        const url = this.buildUrl(options);
        const requestUrl = (_b = options === null || options === void 0 ? void 0 : options.url) !== null && _b !== void 0 ? _b : url;
        const cachedHtml = this.options.cache.get(url);
        const requestId = ++this.requestId;
        const isCurrent = () => this.requestId === requestId;
        // Abort is best-effort. requestId is the actual guard against stale commits
        // from transports that ignore AbortSignal or have already completed.
        if ((options === null || options === void 0 ? void 0 : options.abortPending) !== false)
            (_c = this.statusValue.abortController) === null || _c === void 0 ? void 0 : _c.abort();
        const settleWithoutNetwork = () => {
            if (isCurrent())
                this.setStatus(idleStatus());
        };
        const renderCached = async () => {
            var _a, _b, _c;
            // A cache-only completion owns no pending transport, so settle before
            // rendering. The current-ID checks protect against a re-entrant update
            // triggered by the renderer or update hook.
            settleWithoutNetwork();
            if (!cachedHtml || !isCurrent())
                return;
            await ((_a = this.renderer) === null || _a === void 0 ? void 0 : _a.call(this, cachedHtml, options === null || options === void 0 ? void 0 : options.renderOptions, isCurrent));
            if (isCurrent() && this.renderer)
                (_c = (_b = this.options).onUpdate) === null || _c === void 0 ? void 0 : _c.call(_b, url, cachedHtml);
        };
        switch (cachePolicy) {
            case 'cache-only':
                await renderCached();
                return cachedHtml !== null && cachedHtml !== void 0 ? cachedHtml : undefined;
            case 'network-only':
                return this.updateFromNetwork(requestId, url, requestUrl, 'loading', options);
            case 'cache-first':
                if (cachedHtml) {
                    await renderCached();
                    return cachedHtml;
                }
                return this.updateFromNetwork(requestId, url, requestUrl, 'loading', options);
            case 'cache-and-network': {
                // Cached HTML is shown immediately, but the request remains observable
                // as "refreshing" until the network response settles.
                let renderedHtml;
                if (cachedHtml && isCurrent()) {
                    const render = (_d = this.renderer) === null || _d === void 0 ? void 0 : _d.call(this, cachedHtml, options === null || options === void 0 ? void 0 : options.renderOptions, isCurrent);
                    if (render)
                        await render;
                    renderedHtml = cachedHtml;
                }
                return this.updateFromNetwork(requestId, url, requestUrl, cachedHtml ? 'refreshing' : 'loading', options, renderedHtml);
            }
            default:
                settleWithoutNetwork();
                throw new Error(`Unknown cache policy: ${cachePolicy}`);
        }
    }
    /**
     * Own the complete lifecycle of one network-backed update. Every side effect
     * that can outlive the fetch is guarded by request ownership so an older
     * response cannot render, emit an update, or clear a successor's busy state.
     *
     * `renderedHtml` is the cached HTML this update already rendered. A response
     * equal to it skips the second render. `onUpdate` still fires once, because
     * the cached render changed the DOM and `onUpdate` listeners read the section
     * after that call.
     */
    async updateFromNetwork(requestId, cacheKey, requestUrl, loadingState, options, renderedHtml) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const isCurrent = () => this.requestId === requestId;
        if (!isCurrent())
            return;
        const pendingLoad = this.pendingLoads.get(cacheKey);
        const abortController = (_a = pendingLoad === null || pendingLoad === void 0 ? void 0 : pendingLoad.abortController) !== null && _a !== void 0 ? _a : new AbortController();
        this.setStatus({ state: loadingState, error: null, pendingUrl: requestUrl, abortController });
        try {
            const html = await ((_b = pendingLoad === null || pendingLoad === void 0 ? void 0 : pendingLoad.promise) !== null && _b !== void 0 ? _b : this.fetchAndCache({
                sectionId: this.sectionId,
                requestUrl,
                cacheKey,
                batch: options === null || options === void 0 ? void 0 : options.batch,
                signal: abortController.signal,
                fetchOptions: options === null || options === void 0 ? void 0 : options.fetchOptions,
            }));
            if (html && isCurrent()) {
                // A preload often warms the same URL, so the response equals the cached HTML
                // rendered before the fetch. Skip the morph since it would change nothing.
                if (html !== renderedHtml)
                    await ((_c = this.renderer) === null || _c === void 0 ? void 0 : _c.call(this, html, options === null || options === void 0 ? void 0 : options.renderOptions, isCurrent));
                // Rendering can synchronously start another update, so check ownership
                // again before announcing that this request updated the UI.
                if (isCurrent() && this.renderer)
                    (_e = (_d = this.options).onUpdate) === null || _e === void 0 ? void 0 : _e.call(_d, cacheKey, html);
            }
            return html;
        }
        catch (error) {
            if (isAbortError(error))
                return;
            const formattedError = ((_f = this.options.formatError) !== null && _f !== void 0 ? _f : defaultFormatError)(error);
            if (isCurrent()) {
                this.setStatus({ state: 'error', error: formattedError, pendingUrl: null, abortController: null });
            }
            (_h = (_g = this.options).onError) === null || _h === void 0 ? void 0 : _h.call(_g, error, formattedError);
            throw error;
        }
        finally {
            // A replaced request must never clear the status owned by its successor.
            if (isCurrent() && this.statusValue.state !== 'error')
                this.setStatus(idleStatus());
        }
    }
    /** Run the injected transport and centralize cache writes and lifecycle hooks. */
    async fetchAndCache(options) {
        var _a, _b, _c, _d;
        (_b = (_a = this.options).onLoad) === null || _b === void 0 ? void 0 : _b.call(_a, options.requestUrl);
        const html = await this.options.fetchHtml(options);
        if (html !== undefined)
            this.options.cache.set(options.cacheKey, html);
        (_d = (_c = this.options).onLoaded) === null || _d === void 0 ? void 0 : _d.call(_c, options.requestUrl);
        return html;
    }
    /** Publish one complete discriminated status snapshot to every subscriber. */
    setStatus(status) {
        this.statusValue = status;
        for (const listener of this.listeners)
            listener(status);
    }
    /** Cancel deferred work and resolve its public promise as a no-op. */
    cancelScheduledUpdate() {
        var _a, _b;
        if (this.idleCallbackId === null)
            return;
        ((_a = this.options.cancelIdle) !== null && _a !== void 0 ? _a : defaultCancelIdle)(this.idleCallbackId);
        this.idleCallbackId = null;
        (_b = this.idleResolve) === null || _b === void 0 ? void 0 : _b.call(this, undefined);
        this.idleResolve = null;
    }
    assertActive() {
        if (this.destroyed)
            throw new Error('SectionApiController has been destroyed');
    }
}
