
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

function isSupported() {
  return typeof HTMLElement !== "undefined" && typeof HTMLElement.prototype === "object" && "popover" in HTMLElement.prototype;
}

if (!isSupported()) {
    // @ts-ignore
    import('popover-polyfill');
}
/**
 * Polyfill window.requestIdleCallback and window.cancelIdleCallback since older versions of Safari do not yet support them
 */
window.requestIdleCallback =
    window.requestIdleCallback ||
        function (cb) {
            var start = Date.now();
            return setTimeout(function () {
                cb({
                    didTimeout: false,
                    timeRemaining: function () {
                        return Math.max(0, 50 - (Date.now() - start));
                    },
                });
            }, 1);
        };
window.cancelIdleCallback =
    window.cancelIdleCallback ||
        function (id) {
            clearTimeout(id);
        };

/*
  Wraps all tables inside .prose elements in a .rte-table-wrapper class
  Watches newly added content for .prose elements and wraps its tables too.
*/
function wrapTables(container) {
    container.querySelectorAll('.prose table').forEach((table) => {
        const wrapperClass = 'rte-table-wrapper';
        const tableAlreadyWrapped = table.closest(`.${wrapperClass}`);
        if (tableAlreadyWrapped)
            return;
        const parent = table.parentNode;
        const wrapper = document.createElement('div');
        wrapper.classList.add(wrapperClass);
        if (parent) {
            parent.insertBefore(wrapper, table);
            wrapper.appendChild(table);
        }
    });
}
// Search the newly added content for .prose tables and wrap them too
let observer = new MutationObserver((mutations) => {
    for (let mutation of mutations) {
        if (mutation.target instanceof HTMLElement) {
            if (mutation.target.classList.contains('prose') && mutation.target.parentNode instanceof HTMLElement) {
                wrapTables(mutation.target.parentNode);
            }
            else {
                wrapTables(mutation.target);
            }
        }
    }
});
observer.observe(document.body, {
    childList: true,
    subtree: true,
});
document.addEventListener('DOMContentLoaded', async () => {
    // Wrap all initially rendered .prose tables
    wrapTables(document.body);
});

/**
 * Returns a promise that resolves after yielding to the main thread.
 * See: https://web.dev/articles/optimize-long-tasks#scheduler-yield
 */
function yieldToMain() {
    var _a;
    if ('scheduler' in window && typeof ((_a = window.scheduler) === null || _a === void 0 ? void 0 : _a.yield) === 'function') {
        return window.scheduler.yield();
    }
    // Fall back to yielding with setTimeout.
    return new Promise((resolve) => {
        setTimeout(resolve, 0);
    });
}

/** Data attribute used to mark elements for deferred Alpine init. */
const LAZY_ALPINE_ATTR = 'data-lazy-alpine';
const LAZY_ALPINE_SELECTOR = `[${LAZY_ALPINE_ATTR}]`;
/** After this delay, any element that still has lazy init is inited one-by-one with yield between. */
const LAZY_INIT_TIMEOUT_MS = 4500;
/**
 * Root margin for the IntersectionObserver. Expands the observed area so
 * elements start initializing before they enter the viewport (e.g. 200px
 * below the fold). Format: top right bottom left.
 */
const INTERSECTION_ROOT_MARGIN = '0px 0px 200px 0px';
/** Resolves when Alpine has finished initializing (safe to call Alpine.initTree). */
const hasAlpine = new Promise((resolve) => {
    if (window.Alpine)
        resolve();
    window.addEventListener('alpine:initialized', () => resolve(), { once: true, passive: true });
});
function getLazyAlpineElements(root) {
    const elements = Array.from(root.querySelectorAll(LAZY_ALPINE_SELECTOR));
    if (root instanceof Element && root.matches(LAZY_ALPINE_SELECTOR)) {
        elements.unshift(root);
    }
    return elements;
}
/**
 * Adds x-ignore to each element with data-lazy-alpine so Alpine skips them on init.
 * Call before Alpine processes the DOM (e.g. at DOMContentLoaded). Also run on roots
 * when new content is added (e.g. theme editor or dynamic content).
 */
function markLazyAlpineWithIgnore(root = document) {
    const elements = getLazyAlpineElements(root);
    elements.forEach((el) => {
        el.setAttribute('x-ignore', '');
    });
    if (elements.length)
        debug('markLazyAlpineWithIgnore', { root: root === document ? 'document' : root, count: elements.length });
}
/**
 * Inits a single element with data-lazy-alpine: removes the attribute and x-ignore,
 * then runs Alpine.initTree on that element. No-op if the element no longer has
 * data-lazy-alpine. Waits for Alpine to be ready, then yields to idle before initing.
 */
function initLazyAlpineElement(el, source) {
    if (!el.hasAttribute(LAZY_ALPINE_ATTR))
        return;
    debug('initLazyAlpineElement', source, el);
    el.removeAttribute(LAZY_ALPINE_ATTR);
    el.removeAttribute('x-ignore');
    hasAlpine.then(() => {
        requestIdleCallback(() => {
            if (window.Alpine) {
                window.Alpine.initTree(el);
            }
        });
    });
}
function debug(...args) {
    if (window.debug) {
        console.log('[lazy-alpine]', ...args);
    }
}
let intersectionObserver = null;
function getObserver() {
    if (!intersectionObserver) {
        intersectionObserver = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                if (!entry.isIntersecting)
                    continue;
                const el = entry.target;
                if (!(el instanceof HTMLElement))
                    continue;
                intersectionObserver.unobserve(el);
                initLazyAlpineElement(el, 'intersect');
            }
        }, { rootMargin: INTERSECTION_ROOT_MARGIN });
    }
    return intersectionObserver;
}
/**
 * Observes all elements with data-lazy-alpine under the given root so they
 * are inited when they intersect the viewport (subject to root margin).
 */
function observeLazyAlpineElements(root = document) {
    const observer = getObserver();
    const elements = getLazyAlpineElements(root);
    elements.forEach((el) => observer.observe(el));
    if (elements.length)
        debug('observeLazyAlpineElements', { root: root === document ? 'document' : root, count: elements.length });
}
/** Events that count as "user interact" for init-on-interact. */
const INTERACT_EVENTS = ['touchstart', 'wheel', 'mouseover', 'keydown'];
function handleInteract(event) {
    const el = event.target.closest?.(LAZY_ALPINE_SELECTOR);
    if (el instanceof HTMLElement) {
        if (intersectionObserver)
            intersectionObserver.unobserve(el);
        initLazyAlpineElement(el, 'interact');
    }
}
/**
 * Inits elements that still have data-lazy-alpine one by one,
 * yielding to the main thread between each so we don't block.
 */
async function initRemainingLazyAlpineElements() {
    const elements = Array.from(document.querySelectorAll(LAZY_ALPINE_SELECTOR));
    if (elements.length)
        debug('initRemainingLazyAlpineElements', { count: elements.length });
    for (const el of elements) {
        if (intersectionObserver)
            intersectionObserver.unobserve(el);
        requestIdleCallback(() => initLazyAlpineElement(el, 'deferred'));
        await yieldToMain();
    }
}
document.addEventListener('DOMContentLoaded', () => {
    debug('DOMContentLoaded');
    markLazyAlpineWithIgnore();
    observeLazyAlpineElements();
});
document.addEventListener('alpine:init', () => {
    debug('alpine:init — setting up MutationObserver, interact listeners, deferred timeout');
    // When new DOM contains [data-lazy-alpine], add x-ignore and observe so Alpine won't init it until in view
    const mutationObserver = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            mutation.addedNodes.forEach((node) => {
                if (node instanceof Element) {
                    markLazyAlpineWithIgnore(node);
                    observeLazyAlpineElements(node);
                }
            });
        }
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });
    INTERACT_EVENTS.forEach((type) => {
        document.addEventListener(type, handleInteract, { passive: true, capture: true });
    });
    setTimeout(initRemainingLazyAlpineElements, LAZY_INIT_TIMEOUT_MS);
});
