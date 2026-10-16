import { cancelIdleCallback, isHtmlElement, requestIdleCallback } from '../utils/dom';
import { isFunction } from '../utils/function';
import { mod } from '../utils/math';
import { warnMissingParentDirective } from '../utils/error';
/**
 * Adds the roving tabindex pattern to an element's focusable descendants: one item is
 * tabbable at a time and arrow keys move focus between the items.
 *
 * https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_roving_tabindex
 *
 * `x-roving-tab` is the root and holds the options. `x-roving-tab:list` marks the
 * element whose focusable descendants form the group and receives the key, click, and
 * focus handlers — usually the same element as the root.
 *
 * Modifiers: `.vertical` moves with up/down arrows instead of left/right; `.nowrap`
 * stops at the ends instead of wrapping. Home and End always jump to the first and
 * last item.
 *
 * An expression on the root supplies the focusable elements. Without one the plugin
 * finds them in the list element with the tabbable package.
 *
 * @example
 *   <div x-roving-tab x-roving-tab:list role="toolbar">
 *     <button>Button 1</button>
 *     <button>Button 2</button>
 *     <button>Button 3</button>
 *   </div>
 * @see https://web.dev/control-focus-with-tabindex/
 */
export default function (Alpine) {
    const tabbablePromise = import('tabbable');
    Alpine.directive('roving-tab', ($el, data, utilities) => {
        if (!isHtmlElement($el)) {
            throw new Error(`Expected HTMLElement but got ${$el}`);
        }
        if (data.value === 'list') {
            handleList($el, Alpine);
        }
        else if (data.value === null) {
            handleRoot($el, Alpine, data, utilities, tabbablePromise);
        }
        else {
            throw new Error(`Unknown directive: x-roving-tab:${data.value}`);
        }
    }).before('bind');
    Alpine.magic('rovingTab', handleRovingTabMagic(Alpine));
}
export function handleRovingTabMagic(Alpine) {
    return function ($el) {
        const $data = Alpine.$data($el);
        return {
            focus(el, options) {
                $data.__rovingTab_focus(el, options);
            },
            setTabbable(el) {
                $data.__rovingTab_setTabbable(el);
            },
            focusNext(options) {
                $data.__rovingTab_focusNext(options);
            },
            focusPrev(options) {
                $data.__rovingTab_focusPrev(options);
            },
            focusFirst(options) {
                $data.__rovingTab_focusFirst(options);
            },
            focusLast(options) {
                $data.__rovingTab_focusLast(options);
            },
        };
    };
}
function handleList($el, Alpine) {
    Alpine.bind($el, {
        ['x-data']() {
            return {
                __rovingTab_listRequestIdleCallbackId: null,
                __rovingTab_listObserver: null,
                init() {
                    if (!this.__rovingTab_isRoot) {
                        warnMissingParentDirective('x-roving-tab:list', 'x-roving-tab', this.$el);
                        return;
                    }
                    this.__rovingTab_listElement = this.$el;
                    this.$nextTick(() => {
                        this.__rovingTab_listElement.tabIndex = -1;
                        this.__rovingTab_listRequestIdleCallbackId = requestIdleCallback(() => {
                            // Use Alpine.effect here to re-run the effect when the focusables change
                            Alpine.effect(() => {
                                this.__rovingTab_setInitialTabIndicies();
                            });
                            this.__rovingTab_watchTabbableLoss();
                        }, 
                        // Without a deadline a busy main thread can leave the list with no tabbable item at all.
                        { timeout: 2000 });
                    });
                },
                __rovingTab_watchTabbableLoss() {
                    const component = this;
                    const listElement = component.__rovingTab_listElement;
                    if (!listElement)
                        return;
                    // Restore one tab stop when a morph removes every tabindex attribute
                    // Ignore retained tabindex values to avoid rescanning during keyboard navigation
                    this.__rovingTab_listObserver = new MutationObserver((records) => {
                        const lostTabIndex = records.some((record) => {
                            if (record.type === 'childList')
                                return record.addedNodes.length > 0;
                            return isHtmlElement(record.target) && record.target.getAttribute('tabindex') === null;
                        });
                        if (!lostTabIndex)
                            return;
                        if (component.__rovingTab_getTabbableIndex() === -1) {
                            component.__rovingTab_setInitialTabIndicies();
                        }
                    });
                    this.__rovingTab_listObserver.observe(listElement, {
                        attributeFilter: ['tabindex'],
                        childList: true,
                        subtree: true,
                    });
                },
                destroy() {
                    var _a;
                    if (this.__rovingTab_listRequestIdleCallbackId !== null) {
                        cancelIdleCallback(this.__rovingTab_listRequestIdleCallbackId);
                        this.__rovingTab_listRequestIdleCallbackId = null;
                    }
                    (_a = this.__rovingTab_listObserver) === null || _a === void 0 ? void 0 : _a.disconnect();
                    this.__rovingTab_listObserver = null;
                },
            };
        },
        '@keydown': '__rovingTab_onKeyDown',
        '@focusin': '__rovingTab_onFocusIn',
        '@click': '__rovingTab_onClick',
    });
}
function handleRoot($el, Alpine, { expression, modifiers }, { evaluate }, tabbablePromise) {
    const focusables = expression ? () => evaluate(expression) : undefined;
    const direction = modifiers.includes('vertical') ? 'vertical' : 'horizontal';
    const wrap = !modifiers.includes('nowrap');
    Alpine.bind($el, {
        ['x-data']() {
            return rovingTab(Alpine, { focusables, direction, wrap, tabbablePromise });
        },
    });
}
function rovingTab(_Alpine, options) {
    return {
        __rovingTab_isRoot: true,
        __rovingTab_direction: (options === null || options === void 0 ? void 0 : options.direction) || 'horizontal',
        __rovingTab_wrap: options === null || options === void 0 ? void 0 : options.wrap,
        __rovingTab_listElement: null,
        __rovingTab_tabbableFocusable: null,
        __rovingTab_tabbableIsFocusable: null,
        init() {
            if (options === null || options === void 0 ? void 0 : options.tabbablePromise) {
                options.tabbablePromise
                    .then((m) => {
                    this.__rovingTab_tabbableFocusable = m.focusable;
                    this.__rovingTab_tabbableIsFocusable = m.isFocusable;
                })
                    .catch((err) => {
                    console.error('Error importing tabbable', err);
                });
            }
        },
        __rovingTab_setInitialTabIndicies() {
            const focusableElements = this.__rovingTab_getFocusables();
            // Prefer the element that already holds focus (e.g. focus restored onto a fresh list
            // after a morph) — assigning tabindex 0 elsewhere would desync arrow navigation from it
            const activeElementIndex = this.__rovingTab_getActiveIndex(focusableElements);
            const initialIndex = (options === null || options === void 0 ? void 0 : options.initialIndex) || (activeElementIndex >= 0 ? activeElementIndex : 0);
            focusableElements.forEach((el, index) => {
                if (index === initialIndex) {
                    el.tabIndex = 0;
                }
                else {
                    el.tabIndex = -1;
                }
            });
        },
        __rovingTab_setTabbable(el, focusables) {
            // Make all other elements "untabbable"
            for (const focusable of focusables !== null && focusables !== void 0 ? focusables : this.__rovingTab_getFocusables()) {
                focusable.setAttribute('tabindex', '-1');
            }
            // Make this element tabbable
            el.setAttribute('tabindex', '0');
        },
        __rovingTab_focus(el, options, focusables) {
            this.__rovingTab_setTabbable(el, focusables);
            // Wait till next event loop to focus to ensure element is focusable
            setTimeout(() => {
                el.focus(options);
            });
        },
        __rovingTab_focusNext(options) {
            const focusableElements = this.__rovingTab_getFocusables();
            let index = this.__rovingTab_getActiveIndex(focusableElements);
            if (this.__rovingTab_wrap) {
                index = mod(index + 1, focusableElements.length);
            }
            else {
                index = Math.min(index + 1, Math.max(focusableElements.length - 1, 0));
            }
            let nextElement = focusableElements[index];
            if (nextElement)
                this.__rovingTab_focus(nextElement, options, focusableElements);
        },
        __rovingTab_focusPrev(options) {
            const focusableElements = this.__rovingTab_getFocusables();
            let index = this.__rovingTab_getActiveIndex(focusableElements);
            if (this.__rovingTab_wrap) {
                index = mod(index - 1, focusableElements.length);
            }
            else {
                index = Math.max(index - 1, 0);
            }
            let prevElement = focusableElements[index];
            if (prevElement)
                this.__rovingTab_focus(prevElement, options, focusableElements);
        },
        __rovingTab_focusFirst(options) {
            const focusableElements = this.__rovingTab_getFocusables();
            if (focusableElements.length > 0) {
                this.__rovingTab_focus(focusableElements[0], options, focusableElements);
            }
        },
        __rovingTab_focusLast(options) {
            const focusableElements = this.__rovingTab_getFocusables();
            if (focusableElements.length > 0) {
                this.__rovingTab_focus(focusableElements[focusableElements.length - 1], options, focusableElements);
            }
        },
        __rovingTab_getFocusables() {
            if ((options === null || options === void 0 ? void 0 : options.focusables) && isFunction(options === null || options === void 0 ? void 0 : options.focusables)) {
                return Array.from(options === null || options === void 0 ? void 0 : options.focusables());
            }
            else if ((options === null || options === void 0 ? void 0 : options.focusables) && Array.isArray(options === null || options === void 0 ? void 0 : options.focusables)) {
                return Array.from(options === null || options === void 0 ? void 0 : options.focusables);
            }
            else if (this.__rovingTab_tabbableFocusable && this.__rovingTab_listElement) {
                return Array.from(this.__rovingTab_tabbableFocusable(this.__rovingTab_listElement, {
                    displayCheck: 'full-native',
                }));
            }
            return [];
        },
        /**
         * Whether `el` participates in this roving tab group.
         *
         * Event handlers only need a membership answer for a single element, so in the
         * default (tabbable-backed) case this asks tabbable about that one element
         * instead of scanning the whole list. `focusable()` runs a visibility check per
         * candidate, which forces a style recalculation, so scanning to answer a
         * yes/no question about one element is needlessly expensive.
         */
        __rovingTab_isFocusableMember(el) {
            var _a;
            // An explicit `focusables` source defines membership, so it has to be consulted.
            if (options === null || options === void 0 ? void 0 : options.focusables) {
                return this.__rovingTab_getFocusables().includes(el);
            }
            return Boolean(this.__rovingTab_tabbableIsFocusable &&
                ((_a = this.__rovingTab_listElement) === null || _a === void 0 ? void 0 : _a.contains(el)) &&
                this.__rovingTab_tabbableIsFocusable(el, { displayCheck: 'full-native' }));
        },
        __rovingTab_getTabbableIndex(focusables) {
            return (focusables !== null && focusables !== void 0 ? focusables : this.__rovingTab_getFocusables()).findIndex((e) => e.getAttribute('tabindex') === '0');
        },
        // Arrow navigation must move relative to the element the user is actually on. The tabindex
        // marker can lag behind focus (a re-rendered list starts with no tabindex at all), so trust
        // document.activeElement first and fall back to the tabbable marker
        __rovingTab_getActiveIndex(focusables) {
            const focusableElements = focusables !== null && focusables !== void 0 ? focusables : this.__rovingTab_getFocusables();
            const active = document.activeElement;
            if (active instanceof HTMLElement) {
                const activeIndex = focusableElements.indexOf(active);
                if (activeIndex >= 0)
                    return activeIndex;
            }
            return this.__rovingTab_getTabbableIndex(focusableElements);
        },
        __rovingTab_onKeyDown(e) {
            if (e.target && this.__rovingTab_isFocusableMember(e.target)) {
                switch (e.key) {
                    case 'ArrowRight':
                        if (this.__rovingTab_direction == 'horizontal') {
                            e.preventDefault();
                            e.stopPropagation();
                            this.__rovingTab_focusNext();
                        }
                        break;
                    case 'ArrowLeft':
                        if (this.__rovingTab_direction == 'horizontal') {
                            e.preventDefault();
                            e.stopPropagation();
                            this.__rovingTab_focusPrev();
                        }
                        break;
                    case 'ArrowDown':
                        if (this.__rovingTab_direction == 'vertical') {
                            e.preventDefault();
                            e.stopPropagation();
                            this.__rovingTab_focusNext();
                        }
                        break;
                    case 'ArrowUp':
                        if (this.__rovingTab_direction == 'vertical') {
                            e.preventDefault();
                            e.stopPropagation();
                            this.__rovingTab_focusPrev();
                        }
                        break;
                    case 'Home':
                        e.preventDefault();
                        e.stopPropagation();
                        this.__rovingTab_focusFirst();
                        break;
                    case 'End':
                        e.preventDefault();
                        e.stopPropagation();
                        this.__rovingTab_focusLast();
                        break;
                }
            }
        },
        __rovingTab_onClick(e) {
            if (e.target && this.__rovingTab_isFocusableMember(e.target)) {
                this.__rovingTab_setTabbable(e.target);
            }
        },
        __rovingTab_onFocusIn(e) {
            if (e.target && this.__rovingTab_isFocusableMember(e.target)) {
                this.__rovingTab_setTabbable(e.target);
            }
        },
    };
}
