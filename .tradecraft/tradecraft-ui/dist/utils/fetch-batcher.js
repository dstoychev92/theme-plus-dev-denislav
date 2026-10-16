const TRANSPORT_PARAMS = new Set(['section_id', 'sections', 'sections[]']);
function abortReason(signal) {
    var _a;
    return (_a = signal.reason) !== null && _a !== void 0 ? _a : new DOMException('The request was aborted', 'AbortError');
}
/**
 * Batches Section Rendering API requests that have the same page URL and query state.
 */
export default class FetchBatcher {
    constructor(timeoutDuration = 100) {
        this.timeoutDuration = timeoutDuration;
        this.batches = new Map();
    }
    request(url, options) {
        const signal = options === null || options === void 0 ? void 0 : options.signal;
        if (signal === null || signal === void 0 ? void 0 : signal.aborted)
            return Promise.reject(abortReason(signal));
        const { baseUrl, sections } = this.parseRequestUrl(url);
        let batch = this.batches.get(baseUrl);
        if (!batch) {
            batch = {
                baseUrl,
                controller: null,
                timeoutId: setTimeout(() => this.fetchBatch(baseUrl), this.timeoutDuration),
                waiters: new Set(),
            };
            this.batches.set(baseUrl, batch);
        }
        return new Promise((resolve, reject) => {
            const waiter = { reject, resolve, sections, signal };
            if (signal) {
                waiter.onAbort = () => {
                    this.removeWaiter(batch, waiter);
                    reject(abortReason(signal));
                };
                signal.addEventListener('abort', waiter.onAbort, { once: true });
            }
            batch.waiters.add(waiter);
        });
    }
    parseRequestUrl(url) {
        const hashIndex = url.indexOf('#');
        const withoutHash = hashIndex === -1 ? url : url.slice(0, hashIndex);
        const queryIndex = withoutHash.indexOf('?');
        const path = queryIndex === -1 ? withoutHash : withoutHash.slice(0, queryIndex);
        const params = new URLSearchParams(queryIndex === -1 ? '' : withoutHash.slice(queryIndex + 1));
        const sections = new Set();
        for (const [name, value] of Array.from(params.entries())) {
            if (!TRANSPORT_PARAMS.has(name))
                continue;
            value
                .split(',')
                .filter(Boolean)
                .forEach((section) => sections.add(section));
            params.delete(name);
        }
        const query = params.toString();
        return {
            baseUrl: query ? `${path}?${query}` : path,
            sections,
        };
    }
    removeWaiter(batch, waiter) {
        if (!batch.waiters.delete(waiter))
            return;
        if (waiter.signal && waiter.onAbort) {
            waiter.signal.removeEventListener('abort', waiter.onAbort);
        }
        if (batch.waiters.size > 0)
            return;
        if (batch.controller) {
            batch.controller.abort();
        }
        else {
            clearTimeout(batch.timeoutId);
            if (this.batches.get(batch.baseUrl) === batch) {
                this.batches.delete(batch.baseUrl);
            }
        }
    }
    buildBatchUrl(baseUrl, sections) {
        const separator = baseUrl.includes('?') ? '&' : '?';
        const sectionList = Array.from(sections, encodeURIComponent).join(',');
        return `${baseUrl}${separator}sections=${sectionList}`;
    }
    settleWaiter(batch, waiter, settle) {
        if (!batch.waiters.delete(waiter))
            return;
        if (waiter.signal && waiter.onAbort) {
            waiter.signal.removeEventListener('abort', waiter.onAbort);
        }
        settle();
    }
    async fetchBatch(baseUrl) {
        const batch = this.batches.get(baseUrl);
        if (!batch || batch.waiters.size === 0)
            return;
        this.batches.delete(baseUrl);
        const sections = new Set();
        batch.waiters.forEach((waiter) => waiter.sections.forEach((section) => sections.add(section)));
        const batchUrl = this.buildBatchUrl(baseUrl, sections);
        const controller = new AbortController();
        batch.controller = controller;
        try {
            const response = await fetch(batchUrl, { signal: controller.signal });
            if (controller.signal.aborted)
                return;
            if (!response.ok)
                throw response.statusText;
            const data = (await response.json());
            if (controller.signal.aborted)
                return;
            Array.from(batch.waiters).forEach((waiter) => {
                this.settleWaiter(batch, waiter, () => waiter.resolve(data));
            });
        }
        catch (error) {
            if (controller.signal.aborted)
                return;
            Array.from(batch.waiters).forEach((waiter) => {
                this.settleWaiter(batch, waiter, () => waiter.reject(error));
            });
        }
    }
}
