import { motionValue, scroll, styleEffect, transformValue } from 'motion';
import { warnMissingParentDirective } from '../utils/error';
const ENABLE_STICKY_ATTR = 'data-enable-sticky';
const ENABLE_SMART_OFFSET_ATTR = 'data-enable-smart-offset';
const FITS_VIEWPORT_ATTR = 'data-fits-in-viewport';
const STICKY_COLUMNS_ROOT_ATTR = 'data-sticky-columns-root';
const STICKY_COLUMNS_OFFSET_VAR = '--sticky-columns-offset';
const INITIAL_TOP_VAR = '--initial-top';
const STICKY_COLUMN_PADDING_VAR = '--sticky-column-padding';
const STICKY_PADDING_VAR = '--sticky-padding';
const HEADER_BOTTOM_VAR = '--header-bottom';
const HEADER_STICKY_OFFSET_VAR = '--header-sticky-offset';
const FLUSH_TOP_CLASS = 'sticky-column--flush-top';
/**
 * Coordinates sticky behaviour between sibling columns. The root measures all
 * registered items and only enables sticky positioning when the column group
 * needs it. When multiple columns overflow the viewport, shorter overflowing
 * columns can scroll independently via a CSS offset.
 *
 * The plugin writes state, not `position: sticky`. The root gets
 * `data-sticky-columns-root`; each column gets `data-enable-sticky`,
 * `data-enable-smart-offset`, and `data-fits-in-viewport` attributes plus a
 * `--sticky-columns-offset` custom property. The theme's `sticky-columns.css`
 * applies the sticky positioning, keyed off those attributes.
 *
 * Measurements run inside ResizeObserver (layout is already clean). Reads are
 * batched before any DOM writes so attribute/style updates cannot force a
 * synchronous reflow in the same pass.
 *
 * @usage
 *
 * Add `x-sticky-columns` to the shared layout root and `x-sticky-columns:column`
 * to each participating column.
 *
 * @example
 *
 * <div x-sticky-columns class="flex flex-row">
 *   <div x-sticky-columns:column>... Media ...</div>
 *   <div x-sticky-columns:column>... Details ...</div>
 * </div>
 */
export default function (Alpine) {
    Alpine.directive('sticky-columns', ($el, data) => {
        if (!($el instanceof HTMLElement)) {
            throw new Error('x-sticky-columns can only be used on HTML elements.');
        }
        if (data.value === null) {
            handleRoot($el, Alpine);
        }
        else if (data.value === 'column') {
            handleItem($el, Alpine);
        }
        else {
            throw new Error(`Unknown directive: x-sticky-columns:${data.value}`);
        }
    }).before('bind');
}
function handleRoot($el, Alpine) {
    Alpine.bind($el, {
        ['x-data']() {
            return {
                __stickyColumns_isRoot: true,
                __stickyColumns_items: new Set(),
                __stickyColumns_viewportHeight: 0,
                __stickyColumns_cancelScrollListener: null,
                __stickyColumns_resizeObserver: null,
                init() {
                    this.$el.setAttribute(STICKY_COLUMNS_ROOT_ATTR, '');
                    this.__stickyColumns_resizeObserver = new ResizeObserver((entries) => {
                        this.__stickyColumns_updateMeasurements(entries);
                    });
                    this.__stickyColumns_resizeObserver.observe(this.$el);
                    this.__stickyColumns_resizeObserver.observe(document.documentElement);
                },
                destroy() {
                    var _a;
                    this.__stickyColumns_teardownScrollListener();
                    (_a = this.__stickyColumns_resizeObserver) === null || _a === void 0 ? void 0 : _a.disconnect();
                    this.__stickyColumns_resizeObserver = null;
                    this.__stickyColumns_items.clear();
                    this.$el.removeAttribute(STICKY_COLUMNS_ROOT_ATTR);
                },
                __stickyColumns_register(item) {
                    var _a;
                    this.__stickyColumns_items.add(item);
                    (_a = this.__stickyColumns_resizeObserver) === null || _a === void 0 ? void 0 : _a.observe(item.el);
                },
                __stickyColumns_unregister(item) {
                    var _a;
                    this.__stickyColumns_items.delete(item);
                    (_a = this.__stickyColumns_resizeObserver) === null || _a === void 0 ? void 0 : _a.unobserve(item.el);
                    // Remaining columns keep their cached heights; only sticky flags need recomputing.
                    this.__stickyColumns_updateMeasurements();
                },
                __stickyColumns_updateMeasurements(entries) {
                    const items = Array.from(this.__stickyColumns_items);
                    const viewportHeight = window.innerHeight;
                    const scrollY = window.scrollY;
                    const heightByEl = heightByElementFromEntries(entries);
                    // Unregister recomputes flags from cached heights; skip layout reads outside RO.
                    const shouldReadLayout = entries != null;
                    this.__stickyColumns_viewportHeight = viewportHeight;
                    // --- Read phase (no DOM writes) ---
                    for (const item of items) {
                        const observedHeight = heightByEl.get(item.el);
                        if (observedHeight != null) {
                            item.height = observedHeight;
                        }
                        else if (shouldReadLayout || !item.hasMeasured) {
                            // RO callbacks run after layout, so clientHeight is free there.
                            item.height = item.el.clientHeight;
                        }
                        item.fitsInViewport = item.height <= viewportHeight;
                        if (shouldReadLayout || !item.hasMeasured) {
                            readItemLayout(item, scrollY);
                        }
                    }
                    const overflowingItems = items.filter((item) => !item.fitsInViewport);
                    const shouldEnableSticky = overflowingItems.length > 0;
                    let tallestOverflowingHeight = 0;
                    let shortestOverflowingHeight = Number.POSITIVE_INFINITY;
                    for (const item of overflowingItems) {
                        tallestOverflowingHeight = Math.max(tallestOverflowingHeight, item.height);
                        shortestOverflowingHeight = Math.min(shortestOverflowingHeight, item.height);
                    }
                    if (overflowingItems.length === 0)
                        shortestOverflowingHeight = 0;
                    const shouldEnableSmartSticky = overflowingItems.length > 1 && tallestOverflowingHeight > shortestOverflowingHeight;
                    const previousSmartStickyByItem = new WeakMap();
                    let anySmartSticky = false;
                    for (const item of items) {
                        previousSmartStickyByItem.set(item, item.enableSmartSticky);
                        item.enableSticky = shouldEnableSticky;
                        item.enableSmartSticky =
                            shouldEnableSmartSticky && !item.fitsInViewport && item.height < tallestOverflowingHeight;
                        if (item.enableSmartSticky)
                            anySmartSticky = true;
                    }
                    // --- Write phase ---
                    for (const item of items) {
                        const previousSmartSticky = previousSmartStickyByItem.get(item);
                        updateStateAttributes(item);
                        if (!item.hasMeasured || !previousSmartSticky || !item.enableSmartSticky) {
                            item.currentTop = item.initialTop;
                        }
                        item.hasMeasured = true;
                        updateOffsetStyleEffect(item);
                    }
                    this.__stickyColumns_updateScrollPosition(scrollY);
                    if (anySmartSticky) {
                        this.__stickyColumns_setupScrollListener();
                    }
                    else {
                        this.__stickyColumns_teardownScrollListener();
                    }
                },
                __stickyColumns_updateScrollPosition(scrollY) {
                    for (const item of this.__stickyColumns_items) {
                        if (!item.enableSmartSticky) {
                            item.currentTop = item.initialTop;
                            item.lastScrollY = scrollY;
                            if (item.offsetValue.get() !== 0)
                                item.offsetValue.set(0);
                            continue;
                        }
                        updateItemPosition(item, scrollY, this.__stickyColumns_viewportHeight);
                    }
                },
                __stickyColumns_setupScrollListener() {
                    if (this.__stickyColumns_cancelScrollListener != null)
                        return;
                    this.__stickyColumns_cancelScrollListener = scroll((_progress, info) => {
                        this.__stickyColumns_updateScrollPosition(info.y.current);
                    });
                },
                __stickyColumns_teardownScrollListener() {
                    var _a;
                    (_a = this.__stickyColumns_cancelScrollListener) === null || _a === void 0 ? void 0 : _a.call(this);
                    this.__stickyColumns_cancelScrollListener = null;
                },
            };
        },
    });
}
function handleItem($el, Alpine) {
    Alpine.bind($el, {
        ['x-data']() {
            return {
                __stickyColumns_item: null,
                __stickyColumns_headerVarsEffect: null,
                init() {
                    const root = this.$data;
                    if (!root.__stickyColumns_isRoot) {
                        warnMissingParentDirective('x-sticky-columns:column', 'x-sticky-columns', this.$el);
                        return;
                    }
                    // The header offsets live in the page store, not on body. sticky-columns.css reads them
                    // from the column, so the column carries its own copy. A page without x-header-stack has
                    // no store and the CSS falls back to 0px.
                    const page = Alpine.store('page');
                    if (page) {
                        const el = this.$el;
                        this.__stickyColumns_headerVarsEffect = Alpine.effect(() => {
                            var _a, _b;
                            const bottom = `${(_a = page.headerBottom) !== null && _a !== void 0 ? _a : 0}px`;
                            const stickyOffset = `${(_b = page.headerStickyOffset) !== null && _b !== void 0 ? _b : 0}px`;
                            Alpine.mutateDom(() => {
                                el.style.setProperty(HEADER_BOTTOM_VAR, bottom);
                                el.style.setProperty(HEADER_STICKY_OFFSET_VAR, stickyOffset);
                            });
                        });
                    }
                    const item = {
                        el: this.$el,
                        offsetValue: motionValue(0),
                        cancelOffsetStyleEffect: null,
                        initialTop: 0,
                        currentTop: 0,
                        lastScrollY: 0,
                        height: 0,
                        offsetParentDocumentTop: 0,
                        fitsInViewport: false,
                        enableSticky: false,
                        enableSmartSticky: false,
                        hasMeasured: false,
                    };
                    this.__stickyColumns_item = item;
                    root.__stickyColumns_register(item);
                },
                destroy() {
                    if (this.__stickyColumns_headerVarsEffect) {
                        Alpine.release(this.__stickyColumns_headerVarsEffect);
                        this.__stickyColumns_headerVarsEffect = null;
                    }
                    const item = this.__stickyColumns_item;
                    if (!item)
                        return;
                    // motion@12.40 has a MotionValue type-identity mismatch (functions return
                    // a richer shape than the exported MotionValue type); cast at the boundary.
                    // Remove cast once motion ships consistent types.
                    this.$data.__stickyColumns_unregister(item);
                    resetItem(item);
                    this.__stickyColumns_item = null;
                },
            };
        },
    });
}
function heightByElementFromEntries(entries) {
    const heightByEl = new Map();
    if (!entries)
        return heightByEl;
    for (const entry of entries) {
        const borderBox = entry.borderBoxSize[0];
        heightByEl.set(entry.target, borderBox ? borderBox.blockSize : entry.contentRect.height);
    }
    return heightByEl;
}
/**
 * Reads sticky base top and scroll-clamp geometry. Safe during ResizeObserver
 * callbacks (layout is clean). Prefers computed `top` when sticky is already
 * applied; otherwise reconstructs the theme/test CSS calc without enabling sticky.
 */
function readItemLayout(item, scrollY) {
    const styles = getComputedStyle(item.el);
    const appliedOffset = parsePixelValue(styles.getPropertyValue(STICKY_COLUMNS_OFFSET_VAR));
    item.initialTop = readInitialTop(item.el, styles, appliedOffset);
    const bounds = item.el.getBoundingClientRect();
    const offsetTop = item.el.offsetTop;
    // Undo the smart offset so the cached anchor matches the un-offset layout position.
    item.offsetParentDocumentTop = bounds.top + scrollY - appliedOffset - offsetTop;
}
function readInitialTop(el, styles, appliedOffset) {
    if (styles.top !== 'auto') {
        return parsePixelValue(styles.top) - appliedOffset;
    }
    const initialTopVar = styles.getPropertyValue(INITIAL_TOP_VAR).trim();
    if (initialTopVar)
        return parsePixelValue(initialTopVar);
    // Match themes/analog|pipeline sticky-columns.css when sticky is not yet enabled
    // (computed `top` is still `auto`). The column carries the header vars as px, set from the
    // page store in handleItem.
    const usesFlushTop = el.classList.contains(FLUSH_TOP_CLASS);
    const headerOffset = parsePixelValue(styles.getPropertyValue(usesFlushTop ? HEADER_STICKY_OFFSET_VAR : HEADER_BOTTOM_VAR));
    const padding = parsePixelValue(styles.getPropertyValue(STICKY_COLUMN_PADDING_VAR)) ||
        parsePixelValue(styles.getPropertyValue(STICKY_PADDING_VAR));
    return headerOffset + padding;
}
function updateItemPosition(item, scrollY, viewportHeight) {
    const scrollDelta = scrollY - item.lastScrollY;
    // The column can move up until its bottom reaches the viewport bottom.
    const lowestAllowedTop = -(item.height - viewportHeight);
    // While the parent layout scrolls past the sticky column, keep the column from drifting
    // below the original sticky top calculated by the browser.
    const highestAllowedTop = item.offsetParentDocumentTop + item.initialTop;
    const nextTop = item.currentTop - scrollDelta;
    item.currentTop = Math.min(clamp(nextTop, lowestAllowedTop, highestAllowedTop), item.initialTop);
    item.lastScrollY = scrollY;
    const stickyColumnsOffset = Math.round(item.currentTop - item.initialTop);
    if (item.offsetValue.get() !== stickyColumnsOffset) {
        item.offsetValue.set(stickyColumnsOffset);
    }
}
function updateStateAttributes(item) {
    const enableSticky = String(item.enableSticky);
    const enableSmartSticky = String(item.enableSmartSticky);
    const fitsInViewport = String(item.fitsInViewport);
    if (item.el.getAttribute(ENABLE_STICKY_ATTR) !== enableSticky) {
        item.el.setAttribute(ENABLE_STICKY_ATTR, enableSticky);
    }
    if (item.el.getAttribute(ENABLE_SMART_OFFSET_ATTR) !== enableSmartSticky) {
        item.el.setAttribute(ENABLE_SMART_OFFSET_ATTR, enableSmartSticky);
    }
    if (item.el.getAttribute(FITS_VIEWPORT_ATTR) !== fitsInViewport) {
        item.el.setAttribute(FITS_VIEWPORT_ATTR, fitsInViewport);
    }
}
function updateOffsetStyleEffect(item) {
    var _a;
    if (item.enableSmartSticky && item.cancelOffsetStyleEffect == null) {
        item.cancelOffsetStyleEffect = styleEffect(item.el, {
            [STICKY_COLUMNS_OFFSET_VAR]: transformValue(() => `${item.offsetValue.get()}px`),
        });
    }
    else if (!item.enableSmartSticky) {
        (_a = item.cancelOffsetStyleEffect) === null || _a === void 0 ? void 0 : _a.call(item);
        item.cancelOffsetStyleEffect = null;
        if (item.offsetValue.get() !== 0)
            item.offsetValue.set(0);
        item.el.style.removeProperty(STICKY_COLUMNS_OFFSET_VAR);
    }
}
function resetItem(item) {
    var _a;
    (_a = item.cancelOffsetStyleEffect) === null || _a === void 0 ? void 0 : _a.call(item);
    item.cancelOffsetStyleEffect = null;
    item.offsetValue.set(0);
    item.el.style.removeProperty(STICKY_COLUMNS_OFFSET_VAR);
    item.el.removeAttribute(ENABLE_STICKY_ATTR);
    item.el.removeAttribute(ENABLE_SMART_OFFSET_ATTR);
    item.el.removeAttribute(FITS_VIEWPORT_ATTR);
}
function parsePixelValue(value) {
    const parsedValue = parseInt(value, 10);
    return Number.isNaN(parsedValue) ? 0 : parsedValue;
}
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
