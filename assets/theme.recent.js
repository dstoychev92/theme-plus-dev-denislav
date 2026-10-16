
/*
* @license
* PIPELINE Theme (c) Groupthought Themes
*
* This file is included for advanced development by
* Shopify Agencies. Modified versions of the theme
* code are not supported by Shopify or Groupthought.
*
* Add any minor JS changes in assets/custom.js, this
* will make it easier to update the theme in the future.
*
*/
                  
(function() {
    const env = {"NODE_ENV":"production"};
    try {
        if (process) {
            process.env = Object.assign({}, process.env);
            Object.assign(process.env, env);
            return;
        }
    } catch (e) {} // avoid ReferenceError: process is not defined
    globalThis.process = { env:env };
})();

/**
 * Recently viewed products – store-scoped localStorage (product IDs).
 * Exports recordProductView and getRecentlyViewedProducts for import via @theme/recent.
 */
const STORAGE_KEY_PREFIX = 'recentlyViewed';
const MAX_IDS = 10;
function getStorageKey() {
    const store = window.theme?.shop?.permanentDomain;
    return [STORAGE_KEY_PREFIX, store].filter(Boolean).join('_');
}
/**
 * Append a product view by id (most recent first). Scoped to current store.
 */
function recordProductView(id) {
    if (id == null || id === '')
        return;
    const idStr = String(id);
    try {
        if (typeof localStorage === 'undefined')
            return;
        const key = getStorageKey();
        const ids = getRecentlyViewedProducts();
        const updated = [idStr, ...ids.filter((x) => x !== idStr)].slice(0, MAX_IDS);
        localStorage.setItem(key, JSON.stringify(updated));
    }
    catch {
        // ignore
    }
}
/**
 * Get recently viewed product IDs for the current store.
 */
function getRecentlyViewedProducts() {
    try {
        if (typeof localStorage === 'undefined')
            return [];
        const raw = localStorage.getItem(getStorageKey());
        const list = raw ? JSON.parse(raw) : [];
        return Array.isArray(list) ? list : [];
    }
    catch {
        return [];
    }
}

export { getRecentlyViewedProducts, recordProductView };
