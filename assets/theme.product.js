
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
                  
import Alpine from 'alpinejs';

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

const PENDING_BY_EL = new WeakMap();
const SIBLING_UPDATE_EVENT = 'theme:sibling-section:should-update';
/** Root margin so sections start updating before they enter the viewport. */
const INTERSECTION_ROOT_MARGIN = '300px 0px 300px 0px';
/** After this delay from the first pending mark, any section still pending is updated one-by-one with yield between. */
const DEFERRED_UPDATE_TIMEOUT_MS = 2000;
let deferredTimeoutId = null;
/** Events that count as "user interact" for update-on-interact. */
const INTERACT_EVENTS = ['touchstart', 'wheel', 'mouseover', 'keydown'];
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
                runUpdate(el);
            }
        }, { rootMargin: INTERSECTION_ROOT_MARGIN });
    }
    return intersectionObserver;
}
function markPending(el, detail) {
    if (!detail?.url)
        return;
    PENDING_BY_EL.set(el, { ...detail });
    getObserver().observe(el);
    scheduleDeferredRun();
}
function runUpdate(el) {
    const detail = PENDING_BY_EL.get(el);
    if (detail === undefined)
        return;
    PENDING_BY_EL.delete(el);
    intersectionObserver?.unobserve(el);
    el.dispatchEvent(new CustomEvent(SIBLING_UPDATE_EVENT, {
        detail: { ...detail },
        bubbles: true,
    }));
}
function isPending(el) {
    return PENDING_BY_EL.has(el);
}
function handleInteract(event) {
    const section = event.target.closest?.('[data-section-sibling-update]');
    if (section instanceof HTMLElement && isPending(section)) {
        runUpdate(section);
    }
}
async function runRemainingPending() {
    const elements = Array.from(document.querySelectorAll('[data-section-sibling-update]')).filter(isPending);
    for (const el of elements) {
        runUpdate(el);
        await yieldToMain();
    }
}
function scheduleDeferredRun() {
    if (deferredTimeoutId != null)
        clearTimeout(deferredTimeoutId);
    deferredTimeoutId = setTimeout(() => {
        deferredTimeoutId = null;
        runRemainingPending();
    }, DEFERRED_UPDATE_TIMEOUT_MS);
}
function setupGlobalListeners() {
    INTERACT_EVENTS.forEach((type) => {
        document.addEventListener(type, handleInteract, { passive: true, capture: true });
    });
}
function sectionSiblingUpdatePlugin() {
    Alpine.directive('section-sibling-update', (el) => {
        el.setAttribute('data-section-sibling-update', '');
        Alpine.bind(el, {
            '@theme:sibling:change.window'() {
                if (!this.$sectionApi)
                    return;
                // Only update if the "main" product form is the source of the event, this prevents updating the section when a sibling is changed from a quickview product form, featured product section, etc
                if (!document.querySelector('.shopify-section.main-product')?.contains(this.$event.target)) {
                    return;
                }
                const detail = this.$event.detail;
                if (!detail || typeof detail !== 'object')
                    return;
                markPending(el, detail);
            },
            [`@${SIBLING_UPDATE_EVENT}`]() {
                if (!this.$sectionApi)
                    return;
                if (el.classList.contains('no-sibling-autoupdate'))
                    return;
                const baseUrl = this.$event.detail?.url;
                if (!baseUrl)
                    return;
                this.$sectionApi.update({
                    waitForIdle: true,
                    baseUrl,
                });
            },
        });
    });
    setupGlobalListeners();
}

document.addEventListener('alpine:init', () => {
    Alpine.plugin(sectionSiblingUpdatePlugin);
    document.querySelectorAll('main > .shopify-section:not(.main-product)').forEach(($el) => {
        Alpine.bind($el, { 'x-section-sibling-update': '' });
    });
});
