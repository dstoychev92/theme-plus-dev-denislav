import { isAnchorElement, isFormElement, isHtmlElement, onDocumentReady } from '../utils/dom';
import { prettyPrintError, warnMissingParentDirective } from '../utils/error';
import { morphRegionHtml, morphSectionHtml, parseSectionRoot, replaceRegionHtml, replaceSectionHtml, sanitizeSectionHtml, selectRenderRegions, } from '../section-api/renderer';
import FetchBatcher from '../utils/fetch-batcher';
import { ThemeEditorEvent } from '../types';
import { isAbortError, SectionApiController, } from '../section-api/controller';
/**
 * Debug utility for section-api plugin.
 * Enable by setting `window.debugSectionApi = true` or `window.debugMode = true`
 */
function isDebugEnabled() {
    return typeof window !== 'undefined' && (window.debugSectionApi === true || window.debugMode === true);
}
function debugLog(message, data) {
    if (!isDebugEnabled())
        return;
    console.log(`[section-api] ${message}`, data !== undefined ? data : '');
}
function debugGroup(label) {
    if (!isDebugEnabled())
        return null;
    console.group(`[section-api] ${label}`);
    return () => console.groupEnd();
}
const fetchBatcher = new FetchBatcher();
/**
 * A controller morphs its own root in place, even when that root has a key for an enclosing
 * controller. Descendant keys keep their normal Alpine morph behavior.
 */
function sectionApiMorphConfig(config, rootEl) {
    const rootSectionId = rootEl.getAttribute('x-section-api');
    return Object.assign(Object.assign({}, config), { key(el) {
            var _a;
            if (rootSectionId && el.getAttribute('x-section-api') === rootSectionId)
                return '';
            return ((_a = config.key) === null || _a === void 0 ? void 0 : _a.call(config, el)) || el.getAttribute('key') || '';
        } });
}
const DEFAULT_MORPH_CONFIG = {
    updating(el, _toEl, _childrenOnly, skip) {
        // Skip any built-in shopify elements
        if (el.hasAttribute && el.hasAttribute('data-shopify')) {
            skip();
        }
    },
    removing(el, skip) {
        // Skip any built-in shopify elements
        if (el.hasAttribute && el.hasAttribute('data-shopify')) {
            skip();
        }
    },
};
export default (options) => {
    var _a;
    let morphConfig = (options === null || options === void 0 ? void 0 : options.morphConfig) || DEFAULT_MORPH_CONFIG;
    const delayedLoadingThreshold = (_a = options === null || options === void 0 ? void 0 : options.delayedLoadingThreshold) !== null && _a !== void 0 ? _a : 750;
    if (!Number.isFinite(delayedLoadingThreshold) || delayedLoadingThreshold < 0) {
        throw new Error('section-api delayedLoadingThreshold must be a non-negative number');
    }
    return function (Alpine) {
        if (isDebugEnabled()) {
            console.log('%c[section-api] Debug mode enabled', 'color: #10b981; font-weight: bold; font-size: 12px;', 'Set window.debugSectionApi = false or window.debugMode = false to disable');
        }
        if ('morph' in Alpine === false) {
            throw new Error('The x-section-api directive requires the @alpinejs/morph plugin');
        }
        if (!Alpine.store('cache')) {
            throw new Error('The x-section-api directive requires the tradecraft-ui cache plugin');
        }
        if (!Alpine.store('cache').resources.sectionHtml) {
            Alpine.store('cache').addResource('sectionHtml');
        }
        // Initialize router history management once
        if (!window._x_router_initialized) {
            // Add initial state to the history object so that popstate event is fired when the user navigates back/forward
            window.history.replaceState({
                fromRouter: true,
                url: document.location.href,
            }, '', document.location.href);
            // Reload the page when the user navigates back/forward since our usage of pushState/replaceState would cause the browser not to trigger a page reload
            window.addEventListener('popstate', (event) => {
                var _a;
                if ((_a = event.state) === null || _a === void 0 ? void 0 : _a.fromRouter) {
                    // NOTE this is a quick fix in order to get back/forward buttons working as expected with the router,
                    // however a better solution for things like the collection view would probably be to call the callback function
                    // with the correct href and then update the view accordingly without a page reload i.e. when using $sectionApi.
                    // We'll revisit that when we have time
                    window.location.reload();
                }
            });
            window._x_router_initialized = true;
        }
        Alpine.directive('section-api', ($el, data, utilities) => {
            if (!isHtmlElement($el)) {
                throw new Error(`Expected HTMLElement but got ${$el}`);
            }
            if (data.value === 'form') {
                handleForm($el, data, utilities, Alpine);
            }
            else if (data.value === 'link') {
                handleLink($el, data, utilities, Alpine);
            }
            else if (data.value === null) {
                handleRoot($el, data, utilities, Alpine, morphConfig, delayedLoadingThreshold);
            }
            else {
                throw new Error(`Unknown directive: x-section-api:${data.value}`);
            }
        }).before('bind');
        Alpine.magic('sectionApi', handleSectionMagic(Alpine));
        bindAllThemeSections(Alpine, (el) => {
            // Add x-section-api directive to all sections making it possible to reload them via section rendering API with $sectionApi.load(...)
            // Skip when already bound since a second setAttribute makes Alpine clean up and
            // re-init the directive through the attribute observer
            if (el.hasAttribute('x-section-api'))
                return;
            const sectionIdForSectionRenderingApi = el.id.split('shopify-section-')[1]; // e.g. section-featured-product from shopify-section-section-featured-product
            el.setAttribute('x-section-api', sectionIdForSectionRenderingApi);
        });
    };
};
function handleSectionMagic(Alpine) {
    return function ($el) {
        const data = Alpine.$data($el);
        if (!(data === null || data === void 0 ? void 0 : data.__sectionApi_morphConfig)) {
            return {};
        }
        return {
            get morphConfig() {
                return data.__sectionApi_morphConfig;
            },
            set morphConfig(value) {
                data.__sectionApi_morphConfig = value;
            },
            get sectionId() {
                return data.__sectionApi_sectionId;
            },
            get state() {
                return data.__sectionApi_status.state;
            },
            get isDelayedLoading() {
                return data.__sectionApi_isDelayedLoading;
            },
            get error() {
                return data.__sectionApi_status.error;
            },
            get pendingUrl() {
                return data.__sectionApi_status.pendingUrl;
            },
            get abortController() {
                return data.__sectionApi_status.abortController;
            },
            get controller() {
                return data.__sectionApi_controller;
            },
            update(options) {
                return data.__sectionApi_update(options);
            },
            load(options) {
                return data.__sectionApi_load(options);
            },
            navigate(url, historyMode) {
                return data.__sectionApi_navigate(url, historyMode);
            },
            setHtml(html, options) {
                return data.__sectionApi_setHtml(html, options);
            },
        };
    };
}
function handleForm($el, data, _utilities, Alpine) {
    if (!isFormElement($el)) {
        throw new Error('x-section-api:form directive can only be used on form elements');
    }
    if ($el.method.toLowerCase() == 'post') {
        throw new Error('x-section-api:form directive does not support POST requests');
    }
    const historyMode = getHistoryModeModifier(data.modifiers);
    Alpine.bind($el, {
        'x-init'() {
            var _a;
            if (((_a = Alpine.$data($el)) === null || _a === void 0 ? void 0 : _a.__sectionApi_navigate) == undefined) {
                warnMissingParentDirective('x-section-api:form', 'x-section-api', $el);
            }
        },
        [`x-async-form`]: async (info = {}) => {
            const url = getNavigationUrl(info).toString();
            const sectionData = Alpine.$data($el);
            return sectionData === null || sectionData === void 0 ? void 0 : sectionData.__sectionApi_navigate(url, historyMode);
        },
    });
}
function handleLink($el, data, _utilities, Alpine) {
    if (!isAnchorElement($el)) {
        throw new Error('x-section-api:link directive can only be used on anchor elements');
    }
    const historyMode = getHistoryModeModifier(data.modifiers);
    const shouldFallback = !data.modifiers.includes('nofallback');
    Alpine.bind($el, {
        'x-init'() {
            var _a;
            if (((_a = Alpine.$data($el)) === null || _a === void 0 ? void 0 : _a.__sectionApi_navigate) == undefined) {
                warnMissingParentDirective('x-section-api:link', 'x-section-api', $el);
            }
        },
        [`x-async-link`]: async (href = $el.href) => {
            const url = getNavigationUrl({ action: href }).toString();
            const sectionData = Alpine.$data($el);
            if ((sectionData === null || sectionData === void 0 ? void 0 : sectionData.__sectionApi_navigate) == undefined) {
                warnMissingParentDirective('x-section-api:link', 'x-section-api', $el);
                if (shouldFallback)
                    window.location.assign(url);
                return;
            }
            const renderRevision = sectionData.__sectionApi_renderRevision;
            try {
                return await sectionData.__sectionApi_navigate(url, historyMode);
            }
            catch (error) {
                if (isAbortError(error) || !shouldFallback || sectionData.__sectionApi_renderRevision !== renderRevision) {
                    return;
                }
                window.location.assign(url);
            }
        },
    });
}
function handleRoot($el, data, _utilities, Alpine, morphConfig, delayedLoadingThreshold = 750) {
    // Grab section id from directive expression
    const sectionId = data.expression;
    if (!sectionId) {
        throw new Error(`x-section-api directive requires a section id to be passed`);
    }
    const options = { morphConfig };
    const fetchSectionHtml = async (options) => {
        var _a;
        if (options.batch) {
            const result = await fetchBatcher.request(options.requestUrl);
            return result[options.sectionId];
        }
        const result = await fetch(options.requestUrl, Object.assign({ signal: options.signal }, ((_a = options.fetchOptions) !== null && _a !== void 0 ? _a : {})));
        // TODO figure out what to do in error cases, right now we just throw an error...
        if (!result.ok) {
            debugLog('✗ Fetch failed', { status: result.status, statusText: result.statusText, url: options.requestUrl });
            throw new Error(result.statusText);
        }
        return result.text();
    };
    Alpine.bind($el, {
        'x-data'() {
            var _a;
            const controller = new SectionApiController({
                sectionId,
                buildUrl: (buildUrlOptions) => { var _a; return buildSectionUrl((_a = buildUrlOptions === null || buildUrlOptions === void 0 ? void 0 : buildUrlOptions.sectionId) !== null && _a !== void 0 ? _a : sectionId, buildUrlOptions); },
                cache: Alpine.store('cache').resources.sectionHtml,
                fetchHtml: fetchSectionHtml,
                formatError: prettyPrintError,
                onLoad: (url) => {
                    window.dispatchEvent(new CustomEvent('theme:section:load', { detail: { sectionId, url } }));
                },
                onLoaded: (url) => {
                    window.dispatchEvent(new CustomEvent('theme:section:loaded', { detail: { sectionId, url } }));
                },
                onUpdate: (url, html) => {
                    window.dispatchEvent(new CustomEvent('theme:section:update', { detail: { sectionId, url, html } }));
                },
            });
            return {
                __sectionApi_rootEl: (options === null || options === void 0 ? void 0 : options.rootEl) || $el,
                __sectionApi_sectionId: sectionId,
                __sectionApi_controller: controller,
                __sectionApi_status: controller.status,
                __sectionApi_isDelayedLoading: false,
                __sectionApi_delayedLoadingTimer: null,
                __sectionApi_unsubscribe: null,
                __sectionApi_morphConfig: (_a = options === null || options === void 0 ? void 0 : options.morphConfig) !== null && _a !== void 0 ? _a : DEFAULT_MORPH_CONFIG,
                __sectionApi_renderRevision: 0,
                init() {
                    this.__sectionApi_unsubscribe = controller.subscribe((status) => {
                        if (this.__sectionApi_delayedLoadingTimer !== null) {
                            window.clearTimeout(this.__sectionApi_delayedLoadingTimer);
                            this.__sectionApi_delayedLoadingTimer = null;
                        }
                        this.__sectionApi_status = status;
                        this.__sectionApi_isDelayedLoading = false;
                        if (status.state === 'loading') {
                            if (delayedLoadingThreshold === 0) {
                                this.__sectionApi_isDelayedLoading = true;
                            }
                            else {
                                const pendingUrl = status.pendingUrl;
                                this.__sectionApi_delayedLoadingTimer = window.setTimeout(() => {
                                    this.__sectionApi_delayedLoadingTimer = null;
                                    const currentStatus = this.__sectionApi_status;
                                    if (currentStatus.state === 'loading' && currentStatus.pendingUrl === pendingUrl) {
                                        this.__sectionApi_isDelayedLoading = true;
                                    }
                                }, delayedLoadingThreshold);
                            }
                        }
                    });
                    controller.setRenderer((html, renderOptions, shouldRender) => this.__sectionApi_setHtml(html, renderOptions, shouldRender));
                },
                __sectionApi_buildUrl(buildUrlOptions) {
                    return controller.buildUrl(buildUrlOptions);
                },
                /**
                 * Update the section either from the cache or the network depending on the cache policy
                 */
                __sectionApi_update: async function (options) {
                    var _a, _b;
                    const endGroup = debugGroup(`update() - ${this.__sectionApi_sectionId}`);
                    const cachePolicy = (_a = options === null || options === void 0 ? void 0 : options.cachePolicy) !== null && _a !== void 0 ? _a : 'cache-and-network';
                    const requestUrl = (_b = options === null || options === void 0 ? void 0 : options.url) !== null && _b !== void 0 ? _b : controller.buildUrl(options);
                    debugLog('update()', {
                        sectionId: this.__sectionApi_sectionId,
                        cachePolicy,
                        url: requestUrl,
                        htmlMode: options === null || options === void 0 ? void 0 : options.htmlMode,
                    });
                    try {
                        return await controller.update(Object.assign(Object.assign({}, options), { renderOptions: {
                                mode: options === null || options === void 0 ? void 0 : options.htmlMode,
                                morphConfig: options === null || options === void 0 ? void 0 : options.morphConfig,
                                regions: options === null || options === void 0 ? void 0 : options.regions,
                                onlyRoots: options === null || options === void 0 ? void 0 : options.onlyRoots,
                            } }));
                    }
                    catch (error) {
                        debugLog('✗ Fetch error', { error: prettyPrintError(error) });
                        throw error;
                    }
                    finally {
                        endGroup === null || endGroup === void 0 ? void 0 : endGroup();
                    }
                },
                /**
                 * Load data for the section from the network and populate the cache.
                 * Does not update the DOM or return any value.
                 * By default, only fetches if there's no cache entry. Use `force: true` to always fetch.
                 */
                __sectionApi_load: async function (options) {
                    var _a, _b;
                    const endGroup = debugGroup(`load() - ${this.__sectionApi_sectionId}`);
                    const url = (_a = options === null || options === void 0 ? void 0 : options.url) !== null && _a !== void 0 ? _a : controller.buildUrl(options);
                    debugLog('load()', { sectionId: this.__sectionApi_sectionId, url, force: (_b = options === null || options === void 0 ? void 0 : options.force) !== null && _b !== void 0 ? _b : false });
                    try {
                        await controller.load(options);
                    }
                    catch (error) {
                        debugLog('✗ Load error', { error: prettyPrintError(error) });
                        throw error;
                    }
                    finally {
                        endGroup === null || endGroup === void 0 ? void 0 : endGroup();
                    }
                },
                /**
                 * Navigates to a new URL by updating the browser history and then updating the section content.
                 *
                 * @param url - The URL to navigate to
                 * @param historyMode - How to update the browser history: 'push', 'replace', or 'none'. Omitting it also leaves the history alone
                 * @returns A promise that resolves with the updated HTML content (or undefined)
                 */
                __sectionApi_navigate: async function (url, historyMode) {
                    const urlObj = new URL(url, window.location.href);
                    const baseUrl = `${urlObj.pathname}${urlObj.search}`;
                    if (historyMode == 'replace') {
                        window.history.replaceState({ fromRouter: true, url: urlObj.toString() }, '', urlObj.toString());
                    }
                    else if (historyMode == 'push') {
                        window.history.pushState({ fromRouter: true, url: urlObj.toString() }, '', urlObj.toString());
                    }
                    const result = await this.__sectionApi_update({ baseUrl });
                    window.dispatchEvent(new CustomEvent('theme:section:navigate', {
                        detail: {
                            sectionId,
                            url: baseUrl,
                        },
                    }));
                    return result;
                },
                async __sectionApi_setHtml(html, options, shouldRender = () => true) {
                    var _a, _b;
                    const endGroup = debugGroup(`setHtml() - ${this.__sectionApi_sectionId}`);
                    const morphConfig = sectionApiMorphConfig((_a = options === null || options === void 0 ? void 0 : options.morphConfig) !== null && _a !== void 0 ? _a : this.__sectionApi_morphConfig, this.__sectionApi_rootEl);
                    try {
                        const sanitizedHtml = sanitizeSectionHtml(html);
                        const requestedRegions = (_b = options === null || options === void 0 ? void 0 : options.regions) !== null && _b !== void 0 ? _b : options === null || options === void 0 ? void 0 : options.onlyRoots;
                        const regionSelection = selectRenderRegions(this.__sectionApi_rootEl, parseSectionRoot(sanitizedHtml), {
                            regions: requestedRegions,
                            defaultMode: options === null || options === void 0 ? void 0 : options.mode,
                        });
                        if (regionSelection.strategy === 'render-regions') {
                            for (const region of regionSelection.regions) {
                                if (region.mode === 'replace') {
                                    if (!shouldRender())
                                        return;
                                    replaceRegionHtml(Alpine, region.current, region.replacement);
                                }
                                else {
                                    const didUpdate = await morphRegionHtml(region.current, region.replacement, morphConfig, shouldRender);
                                    if (!didUpdate)
                                        return;
                                }
                            }
                            this.__sectionApi_renderRevision += 1;
                            debugLog('setHtml() - render-regions', {
                                htmlLength: html.length,
                                regions: regionSelection.regions.map(({ name, mode }) => ({ name, mode })),
                            });
                            return;
                        }
                        if (regionSelection.strategy === 'skip') {
                            debugLog(`setHtml() - ${regionSelection.reason}`, {
                                htmlLength: html.length,
                                regionNames: regionSelection.regionNames,
                            });
                            return;
                        }
                        if ((options === null || options === void 0 ? void 0 : options.mode) === 'replace') {
                            if (!shouldRender())
                                return;
                            replaceSectionHtml(Alpine, this.__sectionApi_rootEl, sanitizedHtml);
                            debugLog('setHtml() - replace', { htmlLength: html.length });
                        }
                        else {
                            await morphSectionHtml(this.__sectionApi_rootEl, sanitizedHtml, morphConfig, shouldRender);
                            debugLog('setHtml() - morph', { htmlLength: html.length });
                        }
                        this.__sectionApi_renderRevision += 1;
                    }
                    finally {
                        endGroup === null || endGroup === void 0 ? void 0 : endGroup();
                    }
                },
                destroy() {
                    var _a;
                    if (this.__sectionApi_delayedLoadingTimer !== null) {
                        window.clearTimeout(this.__sectionApi_delayedLoadingTimer);
                    }
                    this.__sectionApi_delayedLoadingTimer = null;
                    this.__sectionApi_isDelayedLoading = false;
                    (_a = this.__sectionApi_unsubscribe) === null || _a === void 0 ? void 0 : _a.call(this);
                    this.__sectionApi_unsubscribe = null;
                    controller.destroy();
                },
            };
        },
        'aria-atomic': 'true',
    });
}
function buildSectionUrl(sectionId, options) {
    var _a, _b, _c, _d;
    const fullUrl = new URL((_d = (_a = options === null || options === void 0 ? void 0 : options.baseUrl) !== null && _a !== void 0 ? _a : (_c = (_b = window.theme) === null || _b === void 0 ? void 0 : _b.routes) === null || _c === void 0 ? void 0 : _c.root) !== null && _d !== void 0 ? _d : '/', window.location.href);
    let sanitizedSectionId;
    // Handle case of section ID from section DOM element being passed in (i.e. prepended with 'shopify-section-')
    if (sectionId.startsWith('shopify-section-')) {
        sanitizedSectionId = sectionId.split('shopify-section-')[1];
    }
    else {
        sanitizedSectionId = sectionId;
    }
    fullUrl.searchParams.append('section_id', sanitizedSectionId);
    return fullUrl.toString();
}
function getHistoryModeModifier(modifiers, defaultMode = 'push') {
    if (modifiers.includes('replace')) {
        return 'replace';
    }
    else if (modifiers.includes('push')) {
        return 'push';
    }
    else if (modifiers.includes('nopush')) {
        return 'none';
    }
    else {
        return defaultMode;
    }
}
function getNavigationUrl(navigationInfo) {
    let url = new URL(navigationInfo.action);
    if ((navigationInfo === null || navigationInfo === void 0 ? void 0 : navigationInfo.formData) && (navigationInfo === null || navigationInfo === void 0 ? void 0 : navigationInfo.method) === 'GET') {
        let formData = navigationInfo.formData;
        let searchParams = new URLSearchParams(formData);
        url.search = searchParams.toString();
    }
    return url;
}
export function bindAllThemeSections(Alpine, cb) {
    // Bind during Alpine's walk since server markup never carries the binding — the CLI
    // hot reload and the theme editor replace the whole section element with fresh markup,
    // and children like x-section-api:form init in that same walk and need a live root.
    Alpine.interceptInit((el) => {
        if (!isHtmlElement(el) || !el.classList.contains('shopify-section'))
            return;
        // mutateDom since the walk itself initializes the attribute cb sets here; a mutation
        // record would initialize the directive a second time
        Alpine.mutateDom(() => cb(el));
    });
    onDocumentReady(() => {
        const sections = document.getElementsByClassName('shopify-section');
        for (const el of sections) {
            if (isHtmlElement(el)) {
                cb(el);
            }
        }
        // Re-bind sections when they are re-loaded by the theme editor
        window.addEventListener(ThemeEditorEvent.SECTION_LOAD, (e) => {
            var _a;
            if ((_a = window.Shopify) === null || _a === void 0 ? void 0 : _a.designMode) {
                const loadedEvent = e;
                const section = document.getElementById(`shopify-section-${loadedEvent.detail.sectionId}`);
                if (section) {
                    Alpine.deferMutations();
                    cb(section);
                    Alpine.flushAndStopDeferringMutations();
                }
            }
        });
    });
}
