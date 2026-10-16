/**
 * Alpine plugin: page scroll, viewport/layout state, and stacked sticky headers.
 *
 * Manages scroll position, scroll progress (0–1), scroll direction, visual viewport height,
 * and (when a header stack is present) header height, header bottom, and the header sticky offset.
 *
 * ## Store: Alpine.store('page')
 *
 * - **scrollY** — Current scroll position in px.
 * - **scrollProgress** — Scroll progress 0–1 (0 = top, 1 = bottom).
 * - **scrollDirection** — `'up'` | `'down'` | null.
 * - **visualViewportHeight** — window.visualViewport.height (e.g. for modals/drawers).
 * - **headerHeight** — Total height of registered header rows (0 if no stack).
 * - **headerBottom** — Distance from viewport top to bottom of header (min 0).
 * - **headerStickyOffset** — Height of currently stuck rows (0 at top of page or when no rows are active).
 * - **headerScrollUpHeight** — Height of every row that sticks while the page scrolls up: the `always` and
 *   `scroll` rows. It changes on a resize, not on scroll. Subtract it from a scroll target so a smooth
 *   scroll up lands below the header, since the scroll itself reveals the `scroll` rows.
 * - **isScrolled** — scrollY > 0.
 *
 * Visual viewport height is correct from the moment the plugin is registered. Scroll
 * tracking starts on the page's first scroll — until then the defaults (top of page, no
 * direction) are already right, and the first scroll catches the store up immediately.
 *
 * ## Directives
 *
 * - **x-header-stack** — Stack root; also drives scroll state and viewport height when present.
 * - **x-header-stack:header** [.always | .scroll] — Register a header row (see below).
 *
 * ## Magics
 *
 * - **$scrollIntoView(el = $el, {behavior = 'smooth'})** — Scrolls the page so `el` sits in view below the
 *   header rows that stick on a scroll up. Use it in place of `el.scrollIntoView()` for a page scroll.
 *   The top aligns to the header line when it is hidden, when the element is too tall to fit below the
 *   header, or when the element spans the viewport. The bottom aligns to the viewport edge when the
 *   element sits below. An element already in view does not move.
 *
 * ```html
 * <div @theme:section:navigate.window="$scrollIntoView($refs.results)">
 * ```
 *
 * ## Header stack (x-header-stack)
 *
 * One element is the **stack root**. Its direct children are **rows** with sticky modes:
 * - **always** — Row is always sticky at its stacked offset.
 * - **scroll** — Sticky only when scrolling up past a threshold; hides when scrolling down.
 * - **never** (default) — Normal flow.
 *
 * ## CSS vars
 * - `--header-height` — Sum of all of the header rows, written on `body`. It changes on a resize, not on
 *   scroll. Useful for matching elements to the header height like predictive search flyout
 * - `--header-bottom` — Current distance from viewport top to bottom of the header. Useful for offsetting
 *   elements so they don't overlap the header e.g. sticky product details columns, notifications, etc
 * - `--header-sticky-offset` — Same as `--header-bottom` except it is 0px when at the top of the page or when
 *   no rows are sticky. Useful for offsetting product media column so that it doesn't overlap the header
 *   when sticky, but does hit the top of the page when not sticky and user is scrolled all the way up
 *
 * `--header-bottom` and `--header-sticky-offset` change during a scroll, so nothing writes them on
 * `body`. A custom property on `body` inherits, and changing one makes the browser recompute the
 * style of every element on the page: 25 to 55 ms on a desktop and 390 ms at 4x CPU throttling on a
 * page with 18,000 elements, once or twice per flick. An element that needs one of these values
 * binds it from the store on itself:
 *
 * ```html
 * <div :style="{'--header-bottom': $store.page.headerBottom + 'px'}" class="sticky top-[--header-bottom]">
 * ```
 *
 * `x-sticky-columns:column` sets both on its column.
 *
 * @example
 * ```html
 * <header x-data x-header-stack>
 *   <div x-header-stack:header.always>Main nav</div>
 *   <div x-header-stack:header.scroll>Search bar</div>
 * </header>
 * ```
 */
import { scroll } from 'motion';
import { HeaderStackManager } from '../utils/header-stack-manager';
import { scrollDeltaBelowHeader } from '../utils/scroll-into-view';
import { onFirstScroll } from '../utils/dom';
import { warnMissingParentDirective } from '../utils/error';
const VISUAL_VIEWPORT_DEBOUNCE_MS = 500;
function dispatchScrollEvent(direction, position) {
    document.dispatchEvent(new CustomEvent(`theme:scroll:${direction}`, { detail: { position } }));
}
function updatePageStoreFromScroll(page, progress, info) {
    const prev = page.scrollProgress;
    const position = info.y.current;
    page.scrollProgress = progress;
    page.scrollY = position;
    // Only set direction when we've actually scrolled (avoids 'down' from noise when at top).
    if (position > 0 && progress > prev) {
        page.scrollDirection = 'down';
        dispatchScrollEvent('down', position);
    }
    else if (position > 0 && progress < prev) {
        page.scrollDirection = 'up';
        dispatchScrollEvent('up', position);
    }
}
export default function pageLayout(Alpine) {
    var _a, _b, _c;
    Alpine.store('page', {
        scrollY: 0,
        scrollProgress: 0,
        scrollDirection: null,
        // Seeded with the real height right away, not 0-then-corrected-later. Reading it is
        // free (the browser tracks it; no layout runs), and it means no store write happens
        // during page load: a load-time write was the page's first store change, so it also
        // picked up the tab for flushing every queued binding — hundreds of milliseconds
        // billed to this plugin while the page was busiest.
        visualViewportHeight: (_b = (_a = window.visualViewport) === null || _a === void 0 ? void 0 : _a.height) !== null && _b !== void 0 ? _b : 0,
        headerHeight: 0,
        headerBottom: 0,
        headerStickyOffset: 0,
        headerScrollUpHeight: 0,
        get isScrolled() {
            return this.scrollY > 0;
        },
    });
    Alpine.magic('scrollIntoView', ($el) => {
        return function (el = $el, options) {
            var _a;
            const page = Alpine.store('page');
            const rect = el.getBoundingClientRect();
            const delta = scrollDeltaBelowHeader({
                top: rect.top,
                bottom: rect.bottom,
                viewportHeight: document.documentElement.clientHeight,
                headerOffset: page.headerScrollUpHeight,
            });
            // A sub-pixel delta only flips the scroll direction, which reveals a scroll-up header for nothing
            if (Math.abs(delta) < 1)
                return;
            window.scrollBy({ top: delta, behavior: (_a = options === null || options === void 0 ? void 0 : options.behavior) !== null && _a !== void 0 ? _a : 'smooth' });
        };
    });
    // Attaching a listener is cheap, so this happens right away — a resize while the page
    // is still loading must not be missed. The store only changes when a resize actually
    // happens, which keeps page load free of store writes from this plugin.
    (_c = window.visualViewport) === null || _c === void 0 ? void 0 : _c.addEventListener('resize', Alpine.debounce(() => {
        if (window.visualViewport) {
            Alpine.store('page').visualViewportHeight = window.visualViewport.height;
        }
    }, VISUAL_VIEWPORT_DEBOUNCE_MS), { passive: true });
    // Scroll tracking waits until the page has actually scrolled — see onFirstScroll.
    // Subscribing makes the motion library start measuring the page's scroll geometry, and
    // measuring during load forces the browser to lay the whole page out again while
    // everything is still settling. Nothing is lost by waiting: until the page scrolls, the
    // store's defaults (top of page, no direction) already say the right thing, and
    // subscribing invokes the callback immediately, so the store catches up in the same
    // moment that stops being true.
    onFirstScroll(() => {
        const page = Alpine.store('page');
        scroll((progress, info) => {
            updatePageStoreFromScroll(page, progress, info);
        });
    });
    // x-header-stack (root) vs x-header-stack:header[.always|.scroll] (row).
    Alpine.directive('header-stack', ($el, data, _utilities) => {
        var _a;
        if (data.value === 'header') {
            const modifiers = (_a = data.modifiers) !== null && _a !== void 0 ? _a : [];
            const mode = modifiers.includes('always')
                ? 'always'
                : modifiers.includes('scroll')
                    ? 'scroll'
                    : 'never';
            Alpine.bind($el, {
                'x-data'() {
                    return {
                        stack: null,
                        rowEl: null,
                        init() {
                            this.$nextTick(() => {
                                let parent = this.$el.parentElement;
                                while (parent) {
                                    const parentData = Alpine.$data(parent);
                                    if (parentData === null || parentData === void 0 ? void 0 : parentData.registerHeader) {
                                        this.stack = parentData;
                                        break;
                                    }
                                    parent = parent.parentElement;
                                }
                                if (!this.stack) {
                                    warnMissingParentDirective('x-header-stack:header', 'x-header-stack', this.$el);
                                    return;
                                }
                                const root = this.stack.rootEl;
                                // Walk up to the direct child of the stack root (the row we register).
                                let row = this.$el;
                                while (row.parentElement && row.parentElement !== root)
                                    row = row.parentElement;
                                // Not under this stack (e.g. nested in a different stack).
                                if (row.parentElement !== root)
                                    return;
                                this.rowEl = row;
                                this.stack.registerHeader(this.rowEl, mode);
                            });
                        },
                        destroy() {
                            if (this.stack && this.rowEl)
                                this.stack.unregisterHeader(this.rowEl);
                        },
                    };
                },
            });
            return;
        }
        if (data.value == null) {
            Alpine.bind($el, {
                'x-data'() {
                    const rootEl = $el;
                    let manager = null;
                    const store = Alpine.store('page');
                    return {
                        rootEl,
                        manager: null,
                        registerHeader(el, mode) {
                            manager === null || manager === void 0 ? void 0 : manager.registerHeader(el, mode);
                        },
                        unregisterHeader(el) {
                            manager === null || manager === void 0 ? void 0 : manager.unregisterHeader(el);
                        },
                        init() {
                            manager = new HeaderStackManager(rootEl, {
                                onScrollState(state) {
                                    store.scrollY = state.scrollY;
                                    store.scrollProgress = state.scrollProgress;
                                    store.scrollDirection = state.scrollDirection;
                                },
                                onHeaderResize(metrics) {
                                    store.headerHeight = metrics.headerHeight;
                                    store.headerBottom = metrics.headerBottom;
                                    store.headerStickyOffset = metrics.headerStickyOffset;
                                    store.headerScrollUpHeight = metrics.headerScrollUpHeight;
                                    // Only the height goes on body. The other two change while the page scrolls, and
                                    // a custom property write on body recomputes the style of every element.
                                    const heightPx = `${metrics.headerHeight}px`;
                                    if (document.body.style.getPropertyValue('--header-height') !== heightPx)
                                        document.body.style.setProperty('--header-height', heightPx);
                                },
                                onStuckChange(stuck) {
                                    if (stuck)
                                        rootEl.setAttribute('data-header-stuck', '');
                                    else
                                        rootEl.removeAttribute('data-header-stuck');
                                },
                            });
                            this.manager = manager;
                        },
                        destroy() {
                            manager === null || manager === void 0 ? void 0 : manager.destroy();
                            manager = null;
                        },
                    };
                },
            });
            return;
        }
        throw new Error(`Unknown directive: x-header-stack:${data.value}`);
    }).before('bind');
}
