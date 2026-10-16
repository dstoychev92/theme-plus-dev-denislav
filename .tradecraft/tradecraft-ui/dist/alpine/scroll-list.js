import { isHtmlElement } from '../utils/dom';
import { isPlainObject } from '../utils/object';
import { warnMissingParentDirective } from '../utils/error';
/**
 * Registers the `x-scroll-list` directive and its sub-directives (`:viewport`,
 * `:scroller`, `:item`, `:next`, `:prev`) plus the `$scrollList` magic.
 *
 * The root directive accepts an optional {@link ScrollListOptions} expression
 * and the `.vertical` modifier for column-oriented lists.
 *
 * @example
 *   <!-- Horizontal list that starts at item index 2 on mount -->
 *   <div x-scroll-list="{initialItemIndex: 2}">
 *     <div x-scroll-list:scroller class="flex overflow-x-auto">
 *       <div x-scroll-list:item>Item 0</div>
 *       <div x-scroll-list:item>Item 1</div>
 *       <div x-scroll-list:item>Item 2</div>
 *     </div>
 *     <button x-scroll-list:prev>Prev</button>
 *     <button x-scroll-list:next>Next</button>
 *   </div>
 *
 * @example
 *   <!-- Vertical variant -->
 *   <div x-scroll-list.vertical="{initialItemIndex: 1}">
 *     <div x-scroll-list:scroller class="flex flex-col overflow-y-auto">...</div>
 *   </div>
 */
export default function (Alpine) {
    Alpine.directive('scroll-list', ($el, data, utilities) => {
        if (!isHtmlElement($el)) {
            throw new Error(`Expected HTMLElement but got ${$el}`);
        }
        if (data.value === 'viewport') {
            handleViewport($el, Alpine);
        }
        else if (data.value === 'scroller') {
            handleScroller($el, Alpine);
        }
        else if (data.value === 'item') {
            handleItem($el, Alpine);
        }
        else if (data.value === 'next') {
            handleNextButton($el, Alpine);
        }
        else if (data.value === 'prev') {
            handlePrevButton($el, Alpine);
        }
        else if (data.value === null) {
            handleRoot($el, Alpine, data, utilities);
        }
        else {
            throw new Error(`Unknown directive: x-scroll-list:${data.value}`);
        }
    }).before('bind');
    Alpine.magic('scrollList', handleScrollListMagic(Alpine));
}
function handleViewport($el, Alpine) {
    Alpine.bind($el, {
        ':id': '__scrollListViewport_id',
        ['x-data']() {
            return {
                // The root composes x-scroll-list:viewport onto itself, so when a descendant
                // also declares :viewport both elements get this binding and would share one
                // id. The root keeps it: external consumers snapshot the root's id (e.g.
                // x-tabs reads its panel's id for aria-controls), so it must never move.
                get __scrollListViewport_id() {
                    const magics = this;
                    const rootElement = magics.$data.__scrollList_rootElement;
                    if (rootElement && rootElement !== magics.$el)
                        return null;
                    return magics.$id('scrollList');
                },
                init() {
                    if (!this.$data.__scrollList_isRoot) {
                        warnMissingParentDirective('x-scroll-list:viewport', 'x-scroll-list', this.$el);
                        return;
                    }
                    this.$data.__viewportElement = this.$el;
                },
            };
        },
    });
}
function handleScroller($el, Alpine) {
    Alpine.bind($el, {
        ['x-data']() {
            return {
                init() {
                    if (!this.$data.__scrollList_isRoot) {
                        warnMissingParentDirective('x-scroll-list:scroller', 'x-scroll-list', this.$el);
                        return;
                    }
                    this.$data.__scrollContainerElement = this.$el;
                },
            };
        },
    });
}
function handleItem($el, Alpine) {
    Alpine.bind($el, {
        'x-data'() {
            return {
                init() {
                    if (!this.$data.__scrollList_isRoot) {
                        warnMissingParentDirective('x-scroll-list:item', 'x-scroll-list', this.$el);
                        return;
                    }
                    this.$data.__registerItem(this.$el);
                },
                destroy() {
                    if (!this.$data.__scrollList_isRoot)
                        return;
                    this.$data.__unregisterItem(this.$el);
                },
            };
        },
    });
}
function handleNextButton($el, Alpine) {
    Alpine.bind($el, {
        ['x-data']() {
            return {
                init() {
                    if (!this.$data.__scrollList_isRoot) {
                        warnMissingParentDirective('x-scroll-list:next', 'x-scroll-list', this.$el);
                    }
                },
            };
        },
        '@click': '$scrollList.next()',
    });
}
function handlePrevButton($el, Alpine) {
    Alpine.bind($el, {
        ['x-data']() {
            return {
                init() {
                    if (!this.$data.__scrollList_isRoot) {
                        warnMissingParentDirective('x-scroll-list:prev', 'x-scroll-list', this.$el);
                    }
                },
            };
        },
        '@click': '$scrollList.prev()',
    });
}
/** Returns __items in DOM order (order they appear as children of the scroll container). */
function getItemsInDomOrder(container, items) {
    if (!container)
        return [];
    return Array.from(container.children).filter((el) => items.has(el));
}
function handleRoot($el, Alpine, directiveData, { evaluate }) {
    let isVertical = directiveData.modifiers.includes('vertical');
    const optionsExpression = directiveData.expression === '' ? '{}' : directiveData.expression;
    const options = evaluate(optionsExpression);
    if (options !== null && options !== undefined && !isPlainObject(options)) {
        throw new Error(`options must be an object, but got ${options}`);
    }
    Alpine.bind($el, {
        ['x-data']() {
            const data = {
                __scrollList_isRoot: true,
                __scrollList_rootElement: $el,
                __viewportElement: null,
                __scrollContainerElement: null,
                __isScrolling: false,
                __centeredIndex: 0,
                __items: new Set(),
                __visibleItems: null,
                __visibleItemsIntersectionObserver: null,
                __centeredItemIntersectionObserver: null,
                __abortController: new AbortController(),
                init() {
                    this.$nextTick(() => {
                        // Watch for items becoming fully intersecting the viewport or not
                        this.__visibleItemsIntersectionObserver = new IntersectionObserver(this.__onIntersect.bind(this), {
                            root: this.__viewportElement,
                            threshold: 0.5,
                        });
                        // Watch for the item that is currently centered in the viewport. Useful in "single item" type carousels
                        this.__centeredItemIntersectionObserver = new IntersectionObserver(this.__onIntersectCenter.bind(this), {
                            root: this.__viewportElement,
                            // places the detection area in the center from top to bottom (or left to right when vertical) of the container so that it can detect images with all kind of heights(or widths when vertical)
                            rootMargin: isVertical ? '-50% 0% -50% 99%' : '0% -50% 99% -50%',
                            threshold: 0.0,
                        });
                        this.__setupScrollListener();
                        if ((options === null || options === void 0 ? void 0 : options.initialItemIndex) !== undefined) {
                            this.__scrollToItem(options.initialItemIndex, { behavior: 'instant' });
                        }
                    });
                },
                destroy() {
                    var _a, _b;
                    (_a = this.__visibleItemsIntersectionObserver) === null || _a === void 0 ? void 0 : _a.disconnect();
                    (_b = this.__centeredItemIntersectionObserver) === null || _b === void 0 ? void 0 : _b.disconnect();
                    this.__abortController.abort();
                },
                __registerItem(item) {
                    if (this.__items.has(item))
                        return;
                    this.__items.add(item);
                    // The observers are created in this component's own $nextTick, which is queued
                    // before any item's, so they exist by the time this runs.
                    this.$nextTick(() => {
                        var _a, _b;
                        (_a = this.__visibleItemsIntersectionObserver) === null || _a === void 0 ? void 0 : _a.observe(item);
                        (_b = this.__centeredItemIntersectionObserver) === null || _b === void 0 ? void 0 : _b.observe(item);
                    });
                },
                __unregisterItem(item) {
                    var _a, _b, _c;
                    if (!this.__items.delete(item))
                        return;
                    // unobserve fires no callback, so drop it here or the set keeps the
                    // detached element alive for as long as the list lives
                    (_a = this.__visibleItems) === null || _a === void 0 ? void 0 : _a.delete(item);
                    (_b = this.__visibleItemsIntersectionObserver) === null || _b === void 0 ? void 0 : _b.unobserve(item);
                    (_c = this.__centeredItemIntersectionObserver) === null || _c === void 0 ? void 0 : _c.unobserve(item);
                },
                __sortedVisibleIndices() {
                    if (!this.__visibleItems)
                        return [];
                    const ordered = getItemsInDomOrder(this.__scrollContainerElement, this.__items);
                    return Array.from(this.__visibleItems)
                        .map((item) => ordered.indexOf(item))
                        .filter((index) => index !== -1)
                        .sort((a, b) => a - b);
                },
                __indexOf(item) {
                    const ordered = getItemsInDomOrder(this.__scrollContainerElement, this.__items);
                    return ordered.indexOf(item);
                },
                __scrollToItem(index, options = { behavior: 'smooth' }) {
                    var _a, _b;
                    const ordered = getItemsInDomOrder(this.__scrollContainerElement, this.__items);
                    const item = ordered[index];
                    if (item) {
                        if (isVertical) {
                            (_a = this.__scrollContainerElement) === null || _a === void 0 ? void 0 : _a.scrollTo({
                                left: 0,
                                top: getTargetScrollTop(item, this.__scrollContainerElement, (options === null || options === void 0 ? void 0 : options.align) || 'start'),
                                behavior: (options === null || options === void 0 ? void 0 : options.behavior) || 'smooth',
                            });
                        }
                        else {
                            (_b = this.__scrollContainerElement) === null || _b === void 0 ? void 0 : _b.scrollTo({
                                left: getTargetScrollLeft(item, this.__scrollContainerElement, (options === null || options === void 0 ? void 0 : options.align) || 'start'),
                                top: 0,
                                behavior: (options === null || options === void 0 ? void 0 : options.behavior) || 'smooth',
                            });
                        }
                    }
                },
                __scrollToNextItem() {
                    const sortedVisibleIndices = this.__sortedVisibleIndices();
                    const lastVisibleIndex = sortedVisibleIndices[sortedVisibleIndices.length - 1];
                    if (lastVisibleIndex === undefined) {
                        return;
                    }
                    const firstNonVisibleIndex = Math.min(lastVisibleIndex + 1, this.__totalItems - 1);
                    if (firstNonVisibleIndex === lastVisibleIndex) {
                        // The last item already counts as visible (>= 50% intersection) but the
                        // scroller may still have untraversed pixels — happens when the per-viewport
                        // item count has a fractional part >= 0.5. Nudge to the actual end
                        const scroller = this.__scrollContainerElement;
                        if (!scroller)
                            return;
                        const remaining = isVertical
                            ? scroller.scrollHeight - scroller.clientHeight - scroller.scrollTop
                            : scroller.scrollWidth - scroller.clientWidth - scroller.scrollLeft;
                        if (remaining > 1) {
                            this.__scrollToItem(lastVisibleIndex, { align: 'end' });
                        }
                        return;
                    }
                    this.__scrollToItem(firstNonVisibleIndex, { align: 'start' });
                },
                __scrollToPrevItem() {
                    const sortedVisibleIndices = this.__sortedVisibleIndices();
                    const firstVisibleIndex = sortedVisibleIndices[0];
                    if (firstVisibleIndex === undefined) {
                        return;
                    }
                    const lastNonVisibleIndex = Math.max(firstVisibleIndex - 1, 0);
                    if (lastNonVisibleIndex === firstVisibleIndex) {
                        // Symmetric to __scrollToNextItem: first item counts as visible but the
                        // scroller may not be at its start yet
                        const scroller = this.__scrollContainerElement;
                        if (!scroller)
                            return;
                        const remaining = isVertical ? scroller.scrollTop : scroller.scrollLeft;
                        if (remaining > 1) {
                            this.__scrollToItem(firstVisibleIndex, { align: 'start' });
                        }
                        return;
                    }
                    this.__scrollToItem(lastNonVisibleIndex, { align: 'end' });
                },
                __onIntersect(entries) {
                    if (this.__visibleItems === null)
                        this.__visibleItems = new Set();
                    // The elements, not their positions: x-for reorders the list in place
                    // and only the items whose intersection changed report back, so a set
                    // of positions keeps the ones nothing told it about. Positions are
                    // read off the DOM when someone asks for them.
                    entries.forEach((entry) => {
                        var _a, _b;
                        const item = entry.target;
                        if (entry.isIntersecting) {
                            (_a = this.__visibleItems) === null || _a === void 0 ? void 0 : _a.add(item);
                        }
                        else {
                            (_b = this.__visibleItems) === null || _b === void 0 ? void 0 : _b.delete(item);
                        }
                    });
                },
                __onIntersectCenter(entries) {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            const intersectingIndex = this.__indexOf(entry.target);
                            this.__centeredIndex = intersectingIndex;
                        }
                    });
                },
                __setupScrollListener() {
                    var _a;
                    (_a = this.__scrollContainerElement) === null || _a === void 0 ? void 0 : _a.addEventListener('scroll', () => {
                        if (!this.__isScrolling) {
                            this.__isScrolling = true;
                            this.__setupScrollEndListener();
                        }
                    }, { once: true, passive: true, signal: this.__abortController.signal });
                },
                __setupScrollEndListener() {
                    var _a;
                    (_a = this.__scrollContainerElement) === null || _a === void 0 ? void 0 : _a.addEventListener('scrollend', () => {
                        this.__isScrolling = false;
                        this.__setupScrollListener();
                    }, { once: true, signal: this.__abortController.signal });
                },
                get __totalItems() {
                    return this.__items.size;
                },
            };
            return data;
        },
        'x-id': "['scrollList']",
        'x-scroll-list:viewport': '',
        'x-scroll-list:scroller': '',
    });
}
export function handleScrollListMagic(Alpine) {
    return function ($el) {
        let $data = Alpine.$data($el);
        return {
            get isScrolling() {
                return $data.__isScrolling;
            },
            get items() {
                if (!$data.__items)
                    return null;
                return Array.from($data.__items);
            },
            get visibleIndices() {
                if (!$data.__visibleItems)
                    return null;
                return $data.__sortedVisibleIndices();
            },
            get centeredIndex() {
                return $data.__centeredIndex;
            },
            set centeredIndex(value) {
                $data.__centeredIndex = value;
                $data.__scrollToItem(value);
            },
            scrollTo(index, options) {
                $data.__scrollToItem(index, options);
            },
            next() {
                $data.__scrollToNextItem();
            },
            prev() {
                $data.__scrollToPrevItem();
            },
        };
    };
}
function getTargetScrollTop(item, container, align) {
    switch (align) {
        case 'start':
            return item.offsetTop;
        case 'center':
            return item.offsetTop + item.offsetHeight / 2 - container.offsetHeight / 2;
        case 'end':
            return item.offsetTop + item.offsetHeight - container.offsetHeight;
    }
}
function getTargetScrollLeft(item, container, align) {
    switch (align) {
        case 'start':
            return item.offsetLeft;
        case 'center':
            return item.offsetLeft + item.offsetWidth / 2 - container.offsetWidth / 2;
        case 'end':
            return item.offsetLeft + item.offsetWidth - container.offsetWidth;
    }
}
