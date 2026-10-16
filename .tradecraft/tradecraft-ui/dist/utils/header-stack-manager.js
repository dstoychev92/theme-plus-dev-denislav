/**
 * Framework-agnostic manager for a stacked sticky header.
 * Handles row registration and scroll-driven layout.
 * Notifies via callbacks so the host can keep its own state and set body CSS vars (e.g. --header-height, --header-bottom).
 */
import { scroll } from 'motion';
import { stickyRowStates, stickyElementsHeight, headerStickyOffset, } from './header-stack';
import { onFirstScroll } from './dom';
/** Px past the header we must scroll before the "scroll" row can stick (avoids flicker near top). */
const SCROLL_MODE_THRESHOLD_EXTRA = 20;
function dispatchScrollEvent(direction, position) {
    document.dispatchEvent(new CustomEvent(`theme:scroll:${direction}`, { detail: { position } }));
}
function clearStickyStyles(el) {
    el.style.removeProperty('position');
    el.style.removeProperty('top');
}
/**
 * A row's height as reported by its ResizeObserver entry — the border box, which is
 * what offsetHeight would say, delivered for free after layout has already run.
 */
function getEntryHeight(entry) {
    const boxes = entry.borderBoxSize;
    if (boxes && boxes.length > 0)
        return boxes[0].blockSize;
    // Older engines without borderBoxSize: a direct read is still free here, because
    // ResizeObserver callbacks run right after layout inside the rendering update.
    return entry.target.offsetHeight;
}
/**
 * Manages a stacked sticky header: row registration and scroll-driven layout.
 * Uses callbacks so the host can update its store and set body CSS vars (e.g. in onHeaderResize).
 *
 * @example
 * const manager = new HeaderStackManager(rootEl, {
 *   onScrollState(s) { store.scrollY = s.scrollY; ... },
 *   onHeaderResize(m) { store.headerHeight = m.headerHeight; document.body.style.setProperty('--header-height', m.headerHeight + 'px'); ... },
 *   onStuckChange(stuck) { rootEl.toggleAttribute('data-header-stuck', stuck); },
 * });
 * // on teardown: manager.destroy();
 */
export class HeaderStackManager {
    constructor(rootEl, options = {}) {
        this.cancelScroll = null;
        this.cancelWaitForScroll = null;
        this.resizeObserver = null;
        this.mutationObserver = null;
        this.scrollRafId = null;
        this.isDestroyed = false;
        this.lastScrollY = 0;
        /** Last progress reported by motion's scroll() — reused in rAF paths so we never
         * recompute it from scrollHeight (a forced-reflow read). */
        this.lastScrollProgress = 0;
        this.lastDirection = null;
        this.hasScrolledPastThreshold = false;
        /** False until the ResizeObserver's first delivery; row heights are 0 until then. */
        this.hasMeasuredHeights = false;
        this.lastAnyStuck = false;
        this.elements = [];
        this.startScrollTracking = () => {
            if (this.isDestroyed || this.cancelScroll !== null)
                return;
            this.cancelScroll = scroll((progress, info) => {
                this.handleScroll(progress, info);
            });
        };
        this.rootEl = rootEl;
        this.options = options;
        // The manager never reads row heights from the DOM. The ResizeObserver delivers
        // them — the initial delivery right after a row is observed, then again on every
        // real size change — and its callback runs after layout inside the rendering
        // update, so the heights are free. Reading offsetHeight ourselves (in a rAF, a
        // post-paint task, or registration) kept showing up in traces as a forced reflow,
        // because during page load some other task has always dirtied style by the time
        // any scheduled read runs.
        this.resizeObserver = new ResizeObserver((entries) => {
            if (this.isDestroyed)
                return;
            let heightsChanged = false;
            for (const entry of entries) {
                const item = this.elements.find((e) => e.el === entry.target);
                if (!item)
                    continue;
                const height = getEntryHeight(entry);
                if (item.height !== height) {
                    item.height = height;
                    heightsChanged = true;
                }
            }
            // Rows without a box (display: none) never deliver, and correctly keep height 0.
            this.hasMeasuredHeights = true;
            // Recomputing here keeps the initial delivery in the same frame's paint: the
            // style writes land before this rendering update paints.
            if (heightsChanged)
                this.recalculate();
        });
        this.mutationObserver = new MutationObserver((mutations) => {
            var _a;
            for (const mutation of mutations) {
                if (mutation.type === 'childList' && mutation.removedNodes.length > 0) {
                    for (const node of mutation.removedNodes) {
                        if (node instanceof HTMLElement) {
                            (_a = this.resizeObserver) === null || _a === void 0 ? void 0 : _a.unobserve(node);
                            const index = this.elements.findIndex((e) => e.el === node);
                            if (index >= 0)
                                this.elements.splice(index, 1);
                        }
                    }
                    this.recalculate();
                    break;
                }
            }
        });
        this.mutationObserver.observe(this.rootEl, { childList: true, subtree: false });
        // Scroll tracking waits until the page has actually scrolled — see onFirstScroll —
        // rather than starting here, in the middle of page load. Subscribing makes the motion
        // library start measuring the page's scroll geometry, and measuring during load forces
        // the browser to lay the whole page out again while everything is still settling.
        // Until the page scrolls, the header needs no scroll handling: the idle recalculate
        // above covers its layout at the top of the page. Subscribing invokes the callback
        // immediately, so the manager catches up in the same moment that changes.
        this.cancelWaitForScroll = onFirstScroll(this.startScrollTracking);
    }
    destroy() {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        this.isDestroyed = true;
        (_a = this.cancelWaitForScroll) === null || _a === void 0 ? void 0 : _a.call(this);
        this.cancelWaitForScroll = null;
        (_b = this.cancelScroll) === null || _b === void 0 ? void 0 : _b.call(this);
        this.cancelScroll = null;
        if (this.scrollRafId !== null)
            cancelAnimationFrame(this.scrollRafId);
        (_c = this.resizeObserver) === null || _c === void 0 ? void 0 : _c.disconnect();
        (_d = this.mutationObserver) === null || _d === void 0 ? void 0 : _d.disconnect();
        (_f = (_e = this.options).onStuckChange) === null || _f === void 0 ? void 0 : _f.call(_e, false);
        (_h = (_g = this.options).onHeaderResize) === null || _h === void 0 ? void 0 : _h.call(_g, { headerHeight: 0, headerBottom: 0, headerStickyOffset: 0, headerScrollUpHeight: 0 });
    }
    handleScroll(progress, info) {
        var _a, _b;
        const scrollY = info.y.current;
        this.lastScrollProgress = progress;
        const velocity = info.y.velocity;
        let direction = null;
        if (velocity != null && velocity !== 0) {
            direction = velocity > 0 ? 'down' : 'up';
        }
        else if (this.lastScrollY !== scrollY) {
            direction = scrollY > this.lastScrollY ? 'down' : 'up';
        }
        const headerHeight = this.elements.length > 0 ? this.elements.reduce((sum, item) => sum + item.height, 0) : 0;
        const min = headerHeight + SCROLL_MODE_THRESHOLD_EXTRA;
        const wasNotAtTop = this.lastScrollY > 0;
        this.lastScrollY = scrollY;
        if (direction != null)
            this.lastDirection = direction;
        (_b = (_a = this.options).onScrollState) === null || _b === void 0 ? void 0 : _b.call(_a, {
            scrollY,
            scrollProgress: progress,
            scrollDirection: this.lastDirection,
        });
        if (direction != null) {
            dispatchScrollEvent(direction, scrollY);
        }
        // Threshold decisions need real row heights; before the first measurement pass
        // `min` would be just the extra padding and could latch the threshold too early.
        if (scrollY === 0)
            this.hasScrolledPastThreshold = false;
        else if (this.hasMeasuredHeights && scrollY >= min)
            this.hasScrolledPastThreshold = true;
        if (this.elements.length === 0) {
            this.recalculate(scrollY);
            return;
        }
        const justArrivedAtTop = scrollY === 0 && wasNotAtTop;
        if (justArrivedAtTop) {
            this.recalculate(0);
        }
        else {
            this.scheduleScrollUpdate();
        }
    }
    registerHeader(el, mode) {
        var _a;
        const idx = this.elements.findIndex((e) => e.el === el);
        if (idx >= 0) {
            this.elements[idx].stickyMode = mode;
        }
        else {
            const registered = new Set(this.elements.map((e) => e.el));
            let insertIndex = 0;
            for (const child of this.rootEl.children) {
                if (child === el)
                    break;
                if (registered.has(child))
                    insertIndex++;
            }
            // No measuring here: observing the row makes the ResizeObserver deliver its
            // height (still within this frame's rendering update), and that delivery runs
            // the recompute. Until it arrives, handleScroll skips threshold decisions
            // (hasMeasuredHeights).
            this.elements.splice(insertIndex, 0, {
                el,
                height: 0,
                stickyMode: mode,
                lastAppliedTop: null,
            });
            (_a = this.resizeObserver) === null || _a === void 0 ? void 0 : _a.observe(el);
        }
    }
    unregisterHeader(el) {
        var _a;
        (_a = this.resizeObserver) === null || _a === void 0 ? void 0 : _a.unobserve(el);
        const index = this.elements.findIndex((e) => e.el === el);
        if (index >= 0)
            this.elements.splice(index, 1);
    }
    scheduleScrollUpdate() {
        if (this.scrollRafId !== null)
            return;
        this.scrollRafId = requestAnimationFrame(() => {
            this.scrollRafId = null;
            this.writeStickyOffset(this.lastScrollY);
            this.applyPositioning(this.lastDirection);
        });
    }
    /**
     * Re-derives everything from the cached row heights and writes the results. Pure
     * compute + writes — no DOM reads, so it is safe to call from anywhere (the
     * ResizeObserver keeps the heights fresh).
     */
    recalculate(scrollY) {
        if (this.isDestroyed)
            return;
        const scrollYToUse = scrollY !== null && scrollY !== void 0 ? scrollY : this.lastScrollY;
        const headerHeight = this.elements.reduce((sum, item) => sum + item.height, 0);
        const min = headerHeight + SCROLL_MODE_THRESHOLD_EXTRA;
        if (scrollYToUse === 0)
            this.hasScrolledPastThreshold = false;
        else if (this.hasMeasuredHeights && scrollYToUse >= min)
            this.hasScrolledPastThreshold = true;
        this.writeStickyOffset(scrollYToUse);
        this.applyPositioning(this.lastDirection);
    }
    writeStickyOffset(scrollY) {
        var _a, _b, _c, _d;
        const headerHeight = this.elements.reduce((sum, item) => sum + item.height, 0);
        (_b = (_a = this.options).onScrollState) === null || _b === void 0 ? void 0 : _b.call(_a, {
            scrollY,
            scrollProgress: this.lastScrollProgress,
            scrollDirection: this.lastDirection,
        });
        let bottom;
        if (scrollY === 0) {
            bottom = headerHeight;
        }
        else {
            const minScrollForScrollMode = headerHeight + SCROLL_MODE_THRESHOLD_EXTRA;
            const isScrolledEnough = scrollY >= minScrollForScrollMode || (scrollY > 0 && this.hasScrolledPastThreshold);
            const states = stickyRowStates(this.elements, this.lastDirection, isScrolledEnough);
            bottom = 0;
            for (let i = 0; i < this.elements.length; i++) {
                if (states[i].active)
                    bottom += this.elements[i].height;
            }
        }
        const headerBottom = Math.max(0, bottom);
        const stickyHeight = scrollY === 0 ? 0 : bottom;
        (_d = (_c = this.options).onHeaderResize) === null || _d === void 0 ? void 0 : _d.call(_c, {
            headerHeight,
            headerBottom,
            headerStickyOffset: headerStickyOffset({ stickyHeight, scrollY }),
            headerScrollUpHeight: stickyElementsHeight(this.elements, 'up', true),
        });
    }
    applyPositioning(direction) {
        var _a, _b;
        const headerHeight = this.elements.reduce((sum, item) => sum + item.height, 0);
        const scrollY = this.lastScrollY;
        const minScrollForScrollMode = headerHeight + SCROLL_MODE_THRESHOLD_EXTRA;
        const isScrolledEnough = scrollY >= minScrollForScrollMode || (scrollY > 0 && this.hasScrolledPastThreshold);
        const states = stickyRowStates(this.elements, direction, isScrolledEnough);
        let anyStuck = false;
        let cumulativeTop = 0;
        for (let i = 0; i < this.elements.length; i++) {
            const item = this.elements[i];
            const { active, topPx: newTop } = states[i];
            if (item.stickyMode === 'never') {
                if (item.lastAppliedTop !== null) {
                    clearStickyStyles(item.el);
                    item.lastAppliedTop = null;
                }
                cumulativeTop += item.height;
                continue;
            }
            const isStuck = active && scrollY > cumulativeTop;
            if (isStuck)
                anyStuck = true;
            if (item.lastAppliedTop !== newTop) {
                item.el.style.position = 'sticky';
                item.el.style.top = newTop;
                item.lastAppliedTop = newTop;
            }
            cumulativeTop += item.height;
        }
        if (anyStuck !== this.lastAnyStuck) {
            this.lastAnyStuck = anyStuck;
            (_b = (_a = this.options).onStuckChange) === null || _b === void 0 ? void 0 : _b.call(_a, anyStuck);
        }
    }
}
