import { isHtmlElement } from '../utils/dom';
import { isFunction } from '../utils/function';
import { isPrintableCharacter } from '../utils/keyboard';
import { warnMissingParentDirective } from '../utils/error';
/**
 * Focuses an element in a list by typing the first character of its text. Useful in
 * listboxes and menus.
 *
 * `x-focus-match` is the root and handles the keydown. `x-focus-match:list` marks
 * the element whose focusables are searched (defaults to the root). An expression on
 * the root supplies the focusable elements; without one the plugin finds them with
 * the tabbable package. The search starts after the current item and wraps around.
 */
export default function (Alpine) {
    const tabbablePromise = import('tabbable');
    Alpine.directive('focus-match', ($el, data, utilities) => {
        if (!isHtmlElement($el)) {
            throw new Error(`Expected HTMLElement but got ${$el}`);
        }
        if (data.value === 'list') {
            handleList($el, Alpine, data);
        }
        else if (data.value === null) {
            handleRoot($el, Alpine, data, utilities, tabbablePromise);
        }
        else {
            throw new Error(`Unknown directive: x-focus-match:${data.value}`);
        }
    }).before('bind');
    Alpine.magic('focusMatch', handleFocusMatchMagic(Alpine));
}
export function handleFocusMatchMagic(Alpine) {
    return function ($el) {
        const $data = Alpine.$data($el);
        return {
            setFocusByFirstCharacter(char) {
                $data.__focusMatch_setFocusByFirstCharacter(char);
            },
        };
    };
}
function handleList($el, Alpine, { modifiers }) {
    Alpine.bind($el, {
        ['x-data']() {
            return {
                init() {
                    if (!this.__focusMatch_isRoot) {
                        warnMissingParentDirective('x-focus-match:list', 'x-focus-match', this.$el);
                        return;
                    }
                    this.__focusMatch_listElement = this.$el;
                },
            };
        },
    });
}
function handleRoot($el, Alpine, { expression }, { evaluate }, tabbablePromise) {
    const focusables = expression ? () => evaluate(expression) : undefined;
    Alpine.bind($el, {
        ['x-data']() {
            return focusMatch({ focusables, tabbablePromise });
        },
        '@keydown': '__focusMatch_onKeyDown',
    });
}
/**
 * Adds the ability to focus an element in a list by typing the first character of the element. Useful in listboxes, menus, etc
 */
function focusMatch(options) {
    return {
        __focusMatch_isRoot: true,
        __focusMatch_listElement: null,
        __focusMatch_tabbableFocusable: null,
        init() {
            // By default the root element is the list element
            if (this.__focusMatch_listElement === null) {
                this.__focusMatch_listElement = this.$el;
            }
            if (options === null || options === void 0 ? void 0 : options.tabbablePromise) {
                options.tabbablePromise
                    .then((m) => {
                    this.__focusMatch_tabbableFocusable = m.focusable;
                })
                    .catch((err) => {
                    console.error('Error importing tabbable', err);
                });
            }
        },
        __focusMatch_onKeyDown(e) {
            if (isPrintableCharacter(e.key)) {
                this.__focusMatch_setFocusByFirstCharacter(e.key);
            }
        },
        __focusMatch_getFocusables() {
            if ((options === null || options === void 0 ? void 0 : options.focusables) && isFunction(options === null || options === void 0 ? void 0 : options.focusables)) {
                return Array.from(options === null || options === void 0 ? void 0 : options.focusables());
            }
            else if ((options === null || options === void 0 ? void 0 : options.focusables) && Array.isArray(options === null || options === void 0 ? void 0 : options.focusables)) {
                return Array.from(options === null || options === void 0 ? void 0 : options.focusables);
            }
            else if (this.__focusMatch_tabbableFocusable && this.__focusMatch_listElement) {
                return Array.from(this.__focusMatch_tabbableFocusable(this.__focusMatch_listElement));
            }
            return [];
        },
        __focusMatch_setFocusByFirstCharacter(char) {
            var _a, _b, _c, _d;
            let start;
            let index;
            let focusIndex = -1;
            let focusable;
            const focusables = this.__focusMatch_getFocusables();
            char = char.toLowerCase();
            if (this.__focusMatch_listElement === null) {
                throw new Error(`Expected x-focus-match to be applied to an HTMLElement but got ${this.__focusMatch_listElement}`);
            }
            // Get start index for search based on position of treeitem
            start = focusables.indexOf(this.__focusMatch_listElement) + 1;
            if (start >= focusables.length) {
                start = 0;
            }
            // Check remaining items in the tree
            for (index = start; index < focusables.length; index++) {
                focusable = focusables[index];
                if (((_a = focusable.textContent) === null || _a === void 0 ? void 0 : _a.trim()) !== '' && char === ((_b = focusable.textContent) === null || _b === void 0 ? void 0 : _b.trim()[0].toLowerCase())) {
                    focusIndex = index;
                    break;
                }
            }
            // If not found in remaining slots, check from beginning
            if (focusIndex === -1) {
                for (index = 0; index < start; index++) {
                    focusable = focusables[index];
                    if (((_c = focusable.textContent) === null || _c === void 0 ? void 0 : _c.trim()) !== '' && char === ((_d = focusable === null || focusable === void 0 ? void 0 : focusable.textContent) === null || _d === void 0 ? void 0 : _d.trim()[0].toLowerCase())) {
                        focusIndex = index;
                        break;
                    }
                }
            }
            // If match was found...
            if (focusIndex > -1) {
                const focusable = focusables[focusIndex];
                if (focusable) {
                    // Set [autofocus] attribute to work with other directives like x-trap
                    focusable.setAttribute('autofocus', '');
                    // Wait till next event loop to focus to ensure element is focusable
                    setTimeout(() => {
                        // Actually focus element
                        focusable.focus();
                    });
                }
            }
        },
    };
}
