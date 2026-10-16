import { isAnchorElement, isSavingData, isSlowConnection } from '../utils';
import { cancelIdleCallback, requestIdleCallback } from '../utils/dom';
/*
 * How long we wait for the browser to go idle before prefetching anyway. An idle callback with no
 * timeout can be put off for as long as the main thread stays busy, which is precisely when the
 * prefetch would never happen at all. So every path gets a deadline, and the more likely the visitor
 * is to click soon, the shorter we are willing to wait.
 */
/** Hover or focus: a click could follow within a few hundred milliseconds. */
const INTENT_IDLE_TIMEOUT_MS = 500;
/** `.eager` asks for the prefetch to start as soon as the browser reasonably can. */
const EAGER_IDLE_TIMEOUT_MS = 1000;
/** The link has only just scrolled into view, so there is no rush. Matches our other plugins. */
const LAZY_IDLE_TIMEOUT_MS = 2000;
/**
 * Improve page load times by prefetching links using [rel="prefetch"](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/prefetch)
 *
 * ## `x-prefetch` directive
 *
 * @example Using the x-prefetch directive will be default wait until the element is in view before prefetching the link. When the link is clicked the browser will already have the page loaded and the navigation will be instant.
 *
 * <a href="/about" x-prefetch>Go to about</a>
 *
 * @example You can also use the `eager` modifier to prefetch the link immediately before the element is in view
 *
 * <a href="/about" x-prefetch.eager>Go to about</a>
 *
 * @example You can also use the `intent` modifier to prefetch the link when the user mouses over or focuses on the element
 *
 * <a href="/about" x-prefetch.intent>Go to about</a>
 *
 * ## `$prefetch` magic method
 *
 * @example You can also use the `$prefetch` magic method to prefetch a link manually
 *
 * <button @click="$prefetch('/about')">Prefetch about page</button>
 *
 * @example You can also pass an options object to the `$prefetch` method
 *
 * <button @click="$prefetch('/about.json', {priority: 'high', as: 'json'})">Prefetch about page</button>
 */
export default function (Alpine) {
    Alpine.directive('prefetch', ($el, { modifiers, expression }, { cleanup }) => {
        let url;
        if (isAnchorElement($el)) {
            url = $el.href;
        }
        else {
            if (!expression) {
                throw new Error('You must pass a URL to x-prefetch e.g. x-prefetch="\'/about\'"');
            }
            url = expression;
        }
        let loading = 'lazy';
        let priority;
        let loadOnNavigationIntent = false;
        if (modifiers.includes('eager')) {
            loading = 'eager';
        }
        else if (modifiers.includes('manual')) {
            loading = 'manual';
        }
        if (modifiers.includes('high')) {
            priority = 'high';
        }
        else if (modifiers.includes('low')) {
            priority = 'low';
        }
        if (modifiers.includes('intent')) {
            loadOnNavigationIntent = true;
        }
        /**
         * Prefetch the URL during the browser's next idle period, waiting at most `timeoutMs` for one.
         * @param timeoutMs - How long to wait for an idle period before prefetching regardless.
         * @param defaultPriority - Fetch priority to use when no priority modifier was given.
         */
        function prefetchWhenIdle(timeoutMs, defaultPriority) {
            const idleCallbackId = requestIdleCallback(() => {
                try {
                    prefetch(url, { priority: priority || defaultPriority });
                }
                catch (e) {
                    console.warn(e);
                }
            }, { timeout: timeoutMs });
            cleanup(() => cancelIdleCallback(idleCallbackId));
        }
        if (loading == 'eager') {
            // Preload immediately
            Alpine.bind($el, {
                'x-init'() {
                    prefetchWhenIdle(EAGER_IDLE_TIMEOUT_MS, 'high');
                },
            });
        }
        else if (loading == 'lazy') {
            // Wait until the element is in view
            Alpine.bind($el, {
                'x-intersect.once'() {
                    prefetchWhenIdle(LAZY_IDLE_TIMEOUT_MS, 'low');
                },
            });
        }
        if (loadOnNavigationIntent) {
            // Load when we think the user intends to navigate by when they hover or focus on the element
            Alpine.bind($el, {
                '@mouseover.once'() {
                    prefetchWhenIdle(INTENT_IDLE_TIMEOUT_MS, 'high');
                },
                '@focusin.once'() {
                    prefetchWhenIdle(INTENT_IDLE_TIMEOUT_MS, 'high');
                },
            });
        }
    });
    Alpine.magic('prefetch', () => {
        return prefetch;
    });
}
// Cache the urls we have already prefetched
const prefetchedUrls = new Set();
function prefetch(url, options) {
    if (!url)
        return Promise.resolve();
    return new Promise((resolve, reject) => {
        if (!prefetchedUrls.has(url) && !isSlowConnection() && !isSavingData()) {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = url;
            link.fetchPriority = (options === null || options === void 0 ? void 0 : options.priority) || 'auto';
            if ((options === null || options === void 0 ? void 0 : options.as) != null) {
                link.as = (options === null || options === void 0 ? void 0 : options.as) || 'document';
            }
            link.onload = resolve;
            link.onerror = reject;
            document.head.appendChild(link);
            prefetchedUrls.add(url);
        }
    });
}
