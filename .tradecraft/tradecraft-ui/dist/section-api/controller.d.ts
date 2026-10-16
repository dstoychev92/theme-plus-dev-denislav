/**
 * Framework-independent request, cache, and state management for Shopify's
 * Section Rendering API.
 *
 * Usage notes:
 * - `update()` applies a cache policy, renders through the injected renderer,
 *   and publishes `loading`, `refreshing`, `error`, and `idle` status.
 * - `cache-and-network` renders the cached HTML first. It skips the network
 *   render when the response equals that cached HTML. `onUpdate` still fires once.
 * - `onUpdate` receives the URL and the HTML that the update rendered.
 * - `load()` only warms the cache. It does not render or publish busy state.
 * - Updates are latest-wins. Older requests may finish, but cannot render or
 *   overwrite the status owned by a newer update.
 * - `abort()` cancels the active transport when possible. `destroy()` is
 *   terminal: it also invalidates unabortable work and rejects future loads or updates.
 * - Transport, cache, URL construction, and rendering are injected so this
 *   controller can be used directly or behind the Alpine plugin.
 *
 * @example Standalone controller
 * ```ts
 * const cache = new Map<string, string>();
 * const controller = new SectionApiController({
 *   sectionId: 'cart-drawer',
 *   buildUrl(options) {
 *     const url = new URL(options?.baseUrl ?? '/', window.location.href);
 *     url.searchParams.set('section_id', options?.sectionId ?? 'cart-drawer');
 *     return url.toString();
 *   },
 *   cache,
 *   async fetchHtml({requestUrl, signal, fetchOptions}) {
 *     const response = await fetch(requestUrl, {...fetchOptions, signal});
 *     if (!response.ok) throw new Error(`Section request failed: ${response.status}`);
 *     return response.text();
 *   },
 *   renderHtml(html) {
 *     const root = document.querySelector<HTMLElement>('[data-cart-drawer]')!;
 *     const responseRoot = new DOMParser().parseFromString(html, 'text/html').body.firstElementChild;
 *     root.innerHTML = responseRoot?.innerHTML ?? html;
 *   },
 * });
 *
 * const unsubscribe = controller.subscribe((status) => {
 *   console.log(status.state, status.pendingUrl);
 * });
 * await controller.update({cachePolicy: 'cache-and-network'});
 * unsubscribe();
 * controller.destroy();
 * ```
 *
 * @example Alpine escape hatch
 * ```ts
 * const controller = $sectionApi.controller;
 * controller.abort();
 * await controller.update({baseUrl: '/cart', cachePolicy: 'network-only'});
 * ```
 */
export type SectionApiState = 'idle' | 'loading' | 'refreshing' | 'error';
export type SectionApiStatus = {
    state: 'idle';
    error: null;
    pendingUrl: null;
    abortController: null;
} | {
    state: 'loading' | 'refreshing';
    error: null;
    pendingUrl: string;
    abortController: AbortController;
} | {
    state: 'error';
    error: string;
    pendingUrl: null;
    abortController: null;
};
export type SectionApiLoadOptions = {
    /** Combine compatible Section API requests when the injected transport supports batching. */
    batch?: boolean;
    /** Base URL used to build the Section Rendering API URL. */
    baseUrl?: string;
    /** Override the configured section ID when building the URL. */
    sectionId?: string;
    /** Full request URL override. */
    url?: string;
    /** Defer an update until the browser is idle. */
    waitForIdle?: boolean;
    /** Abort the previous request when starting this one. Defaults to true. */
    abortPending?: boolean;
    /** Ignore a cached value when preloading through load(). */
    force?: boolean;
    /** Additional fetch options; the controller owns the AbortSignal. */
    fetchOptions?: Omit<RequestInit, 'signal'>;
};
export type SectionApiUpdateOptions<RenderOptions = unknown> = SectionApiLoadOptions & {
    /** Cache behavior. Defaults to cache-and-network. */
    cachePolicy?: 'cache-first' | 'cache-only' | 'network-only' | 'cache-and-network';
    /** Opaque options forwarded to the injected renderer. */
    renderOptions?: RenderOptions;
};
export type SectionApiCache = {
    get(key: string): string | null | undefined;
    set(key: string, html: string): void;
};
export type SectionApiFetchOptions = {
    sectionId: string;
    requestUrl: string;
    batch?: boolean;
    signal?: AbortSignal;
    fetchOptions?: Omit<RequestInit, 'signal'>;
};
export type SectionApiControllerOptions<RenderOptions> = {
    sectionId: string;
    buildUrl(options?: Pick<SectionApiLoadOptions, 'baseUrl' | 'sectionId'>): string;
    cache: SectionApiCache;
    fetchHtml(options: SectionApiFetchOptions): Promise<string | undefined>;
    renderHtml?: (html: string, options: RenderOptions | undefined, shouldRender: () => boolean) => void | Promise<void>;
    formatError?: (error: unknown) => string;
    onLoad?: (url: string) => void;
    onLoaded?: (url: string) => void;
    onUpdate?: (url: string, html: string) => void;
    onError?: (error: unknown, formattedError: string) => void;
    scheduleIdle?: (callback: () => void, timeout: number) => number;
    cancelIdle?: (id: number) => void;
};
export declare function isAbortError(error: unknown): boolean;
/**
 * Framework-independent Section Rendering API coordinator.
 *
 * It owns request cancellation and ordering, cache policy, cache writes, idle
 * scheduling, and observable status. Rendering and transport are injected so
 * callers can use it with Alpine, another UI framework, or no framework at all.
 */
export declare class SectionApiController<RenderOptions = unknown> {
    readonly sectionId: string;
    private readonly options;
    private readonly listeners;
    private statusValue;
    /** Monotonic ownership token. Only the update holding the latest ID may commit UI or status. */
    private requestId;
    /** Cache-warming requests keyed by their canonical cache URL. */
    private readonly pendingLoads;
    private idleCallbackId;
    /** Lets a superseding update settle the promise returned by an idle-scheduled update. */
    private idleResolve;
    private destroyed;
    private renderer?;
    constructor(options: SectionApiControllerOptions<RenderOptions>);
    get status(): SectionApiStatus;
    get state(): SectionApiState;
    get error(): string | null;
    get pendingUrl(): string | null;
    get abortController(): AbortController | null;
    /** Build the canonical cache URL through the host application's URL rules. */
    buildUrl(options?: Pick<SectionApiLoadOptions, 'baseUrl' | 'sectionId'>): string;
    /** Attach or replace the UI renderer without coupling the controller to a framework. */
    setRenderer(renderer: (html: string, options: RenderOptions | undefined, shouldRender: () => boolean) => void | Promise<void>): void;
    /** Observe atomic status snapshots. Returns an unsubscribe function. */
    subscribe(listener: (status: SectionApiStatus) => void): () => void;
    /**
     * Resolve an update according to its cache policy, optionally delaying the
     * work until idle. A newer call cancels any older idle-scheduled call so the
     * older promise cannot remain pending forever.
     */
    update(options?: SectionApiUpdateOptions<RenderOptions>): Promise<string | undefined>;
    /**
     * Warm the cache without rendering or changing observable request state.
     * This is intentionally separate from update() so prefetches do not make UI
     * controls look busy.
     */
    load(options?: SectionApiLoadOptions): Promise<void>;
    /** Abort the active transport. Its normal AbortError is treated as a quiet cancellation. */
    abort(): void;
    /**
     * Permanently stop the controller. Incrementing requestId also invalidates
     * transports (such as a batcher) that may still resolve after abort().
     */
    destroy(): void;
    /** Choose the cache strategy and establish ownership for this update. */
    private performUpdate;
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
    private updateFromNetwork;
    /** Run the injected transport and centralize cache writes and lifecycle hooks. */
    private fetchAndCache;
    /** Publish one complete discriminated status snapshot to every subscriber. */
    private setStatus;
    /** Cancel deferred work and resolve its public promise as a no-op. */
    private cancelScheduledUpdate;
    private assertActive;
}
