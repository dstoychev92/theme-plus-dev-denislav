import { isHtmlElement, isPlainObject, mergeProperties, renameProperty } from '../utils';
import { handleFloatMagic } from './float';
import { warnMissingParentDirective } from '../utils/error';
/**
 * Plugin allowing the creation of popup elements. Popups are small overlays that open on
 * demand: dropdown menus, tooltips, flyouts. A popup is a disclosure (x-disclosure holds
 * the open state) whose panel floats next to a target element (x-float positions it).
 *
 * Directives:
 * - x-popup - The root element. The expression accepts a boolean or { isOpen }; isOpen
 *   accepts a get/set pair for two-way binding. Modifiers: .noanimate skips waiting for
 *   animations on open/close, .noreturn leaves focus where it is when Escape closes the
 *   popup, .noclose disables auto-close (Escape, click outside, focus outside).
 * - x-popup:popup - The popup panel. Modifiers are x-float positioning modifiers
 *   (default: bottom.auto); the expression holds float options. The .nofloat modifier
 *   disables floating so you can position the panel manually.
 * - x-popup:target - The element the panel floats next to. Gets aria-expanded and
 *   aria-controls.
 * - x-popup:button - Toggles the popup on click. Adds x-disclosure:button, x-popup:target,
 *   and aria-haspopup.
 * - x-popup:float-reference - Optional element to float next to instead of the target.
 * - x-popup:arrow - The arrow element (x-float:arrow).
 *
 * The $popup magic: isOpen (get/set), open(), close(), targetEl, popupEl,
 * floatReferenceEl, plus everything on $float.
 *
 * @example
 *
 * <div x-popup>
 *   <button x-popup:button>Toggle Popup</button>
 *   <div x-cloak x-popup:popup>
 *     I'm a popup!
 *   </div>
 * </div>
 *
 * @example Bound to external state
 *
 * <div x-data="{isOpenExternal: true}">
 *   <div x-show="isOpenExternal">Im open!</div>
 *
 *   <div x-popup="{
 *     get isOpen() {
 *       return this.isOpenExternal
 *     },
 *     set isOpen(value) {
 *       this.isOpenExternal = value
 *     }
 *   }">
 *     <button x-popup:button>Toggle Popup</button>
 *     <div x-cloak x-popup:popup>
 *       I'm a popup!
 *     </div>
 *   </div>
 * </div>
 */
export default function (Alpine) {
    Alpine.directive('popup', ($el, data, utilities) => {
        if (!isHtmlElement($el)) {
            throw new Error(`Expected HTMLElement but got ${$el}`);
        }
        if (data.value === 'popup') {
            handlePopup($el, Alpine, data, utilities);
        }
        else if (data.value === 'target') {
            handleTarget($el, Alpine);
        }
        else if (data.value === 'float-reference') {
            handleFloatReference($el, Alpine);
        }
        else if (data.value == 'arrow') {
            handleArrow($el, Alpine);
        }
        else if (data.value === 'button') {
            handleButton($el, Alpine);
        }
        else if (data.value === null) {
            handleRoot($el, Alpine, data, utilities);
        }
        else {
            throw new Error(`Unknown directive: x-popup:${data.value}`);
        }
    }).before('bind');
    Alpine.magic('popup', handlePopupMagic(Alpine));
}
export function handlePopupMagic(Alpine) {
    return function ($el) {
        const $data = Alpine.$data($el);
        return mergeProperties({}, {
            get isOpen() {
                var _a;
                return (_a = $data.__disclosure_state) === null || _a === void 0 ? void 0 : _a.isExpanded;
            },
            set isOpen(value) {
                if (!$data.__disclosure_state)
                    return;
                $data.__disclosure_state.isExpanded = value;
            },
            open() {
                var _a;
                (_a = $data.__disclosure_state) === null || _a === void 0 ? void 0 : _a.expand();
            },
            close() {
                var _a;
                (_a = $data.__disclosure_state) === null || _a === void 0 ? void 0 : _a.collapse();
            },
            get targetEl() {
                return $data.__popup_targetEl;
            },
            get popupEl() {
                return $data.__popup_popupEl;
            },
            get floatReferenceEl() {
                return $data.__popup_floatReferenceEl;
            },
            set floatReferenceEl(el) {
                $data.__popup_floatReferenceEl = el;
            },
        }, handleFloatMagic(Alpine)($el));
    };
}
function handleButton($el, Alpine) {
    Alpine.bind($el, {
        'x-disclosure:button': '',
        'x-popup:target': '',
        'aria-haspopup': 'true',
    });
}
function handleFloatReference($el, Alpine) {
    Alpine.bind($el, {
        'x-init'() {
            // Prevent throwing an error when x-popup:float-reference is commonly composed onto the same element as the root.
            // This gives it a "tick" of time to load the root before loading the ":float-reference"
            this.$nextTick(() => {
                const scope = Alpine.$data($el);
                if (!scope.__popup_isRoot) {
                    warnMissingParentDirective('x-popup:float-reference', 'x-popup', $el);
                    return;
                }
                scope.__popup_floatReferenceEl = $el;
            });
        },
    });
}
function handleTarget($el, Alpine) {
    Alpine.bind($el, {
        ':id': `$el.id || $id('popup-target')`,
        'x-init'() {
            if (!this.__popup_isRoot) {
                warnMissingParentDirective('x-popup:target', 'x-popup', this.$el);
                return;
            }
            this.__popup_targetEl = $el;
        },
        ':aria-expanded': '$popup.isOpen',
        ':aria-controls'() {
            var _a;
            return (_a = this.__popup_popupEl) === null || _a === void 0 ? void 0 : _a.id;
        },
        // Escape on the target, since the panel's own listener only hears keys from inside the panel.
        // The guards run before stop and prevent, so a closed popup passes Escape to an enclosing dialog
        '@keydown.escape': `
      if (!$popup.isOpen) return
      if (!__popup_autoclose) return

      $event.stopPropagation()
      $event.preventDefault()
      $popup.close()
    `,
    });
}
function handlePopup($el, Alpine, { modifiers, expression }, { evaluate }) {
    // Allow disabling x-float
    let shouldFloat = modifiers.includes('nofloat') ? false : true;
    let floatModifiers = modifiers.join('.') || 'bottom.auto';
    const floatOptions = expression ? evaluate(expression) : {};
    const shouldAutoClose = Alpine.$data($el).__popup_autoclose;
    Alpine.bind($el, Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ ':id': `$el.id || $id('popup')`, 'x-init'() {
            if (!this.__popup_isRoot)
                return;
            this.__disclosure_contentEl = $el;
        } }, (shouldFloat
        ? {
            'x-show': '$disclosure.isExpanded && $float.isPositioned',
        }
        : {
            'x-show': '$disclosure.isExpanded',
        })), { ':aria-labelledby'() {
            var _a;
            return (_a = this.__disclosure_buttonEl) === null || _a === void 0 ? void 0 : _a.id;
        }, 'data-morph-update': 'children', 'x-data'() {
            return {
                init() {
                    if (!this.$data.__popup_isRoot) {
                        warnMissingParentDirective('x-popup:popup', 'x-popup', this.$el);
                        return;
                    }
                    this.$data.__popup_popupEl = $el;
                    if (shouldFloat) {
                        // TODO investigate hooking into Alpine's el._x_doShow / el._x_doHide hooks to enable / disable floating
                        if (this.$popup.isOpen) {
                            this.__popup_enableAutoUpdating();
                        }
                        this.$watch('$popup.isOpen', (isOpen) => {
                            if (isOpen) {
                                this.__popup_enableAutoUpdating();
                            }
                            else {
                                this.__popup_disableAutoUpdating();
                            }
                        });
                    }
                },
                __popup_enableAutoUpdating() {
                    // Wait until next tick to enable auto update to ensure that the float reference el exists and any other dom updates have been made
                    this.$nextTick(() => {
                        this.$float.referenceEl =
                            this.$data.__popup_floatReferenceEl ||
                                this.$data.__popup_targetEl;
                        this.$float.enableAutoUpdate();
                    });
                },
                __popup_disableAutoUpdating() {
                    this.$nextTick(() => {
                        var _a, _b;
                        this.$float.disableAutoUpdate();
                        (_b = (_a = this.$float).reset) === null || _b === void 0 ? void 0 : _b.call(_a);
                    });
                },
            };
        } }), (shouldFloat
        ? {
            [`x-float.${floatModifiers}`]() {
                return Object.assign(Object.assign({}, floatOptions), { autoUpdate: false, initialUpdate: false });
            },
        }
        : {})), { ':tabindex': '-1' }), (shouldAutoClose
        ? {
            '@keydown.escape.stop.prevent': `
            if (!$popup.isOpen) return

            $popup.close()

            if (__popup_returnFocusAfterClose) {
              await $disclosure.waitForAnimations()
              __popup_targetEl?.focus()
            }
          `,
            '@mousedown.outside': `
            if (!$popup.isOpen) return
            if (!__popup_autoclose) return
            if (__popup_popupEl?.contains($event.target)) return
            if (__popup_targetEl?.contains($event.target)) return
            $popup.close()
          `,
            '@focusin.window': `
            if (!$popup.isOpen) return
            if (!__popup_autoclose) return
            if (__popup_popupEl?.contains($event.target)) return
            if (__popup_targetEl?.contains($event.target)) return
            $popup.close()
          `,
        }
        : {})));
}
function handleArrow($el, Alpine) {
    Alpine.bind($el, {
        'x-float:arrow': '',
    });
}
function handleRoot($el, Alpine, { modifiers, expression }, { evaluate }) {
    let options = evaluate(expression === '' ? '{}' : expression);
    const disclosureModifiers = modifiers.filter((modifier) => ['open', 'noanimate'].includes(modifier));
    // Prevent popup from returning focus to the target element after closing
    const returnFocusAfterClose = !modifiers.includes('noreturn');
    // Prevent automatically closing the popup when clicking outside of it
    const autoclose = !modifiers.includes('noclose');
    Alpine.bind($el, {
        [`x-disclosure.${disclosureModifiers.join('.')}`]() {
            if (isPlainObject(options)) {
                // Rename isOpen property to isExpanded which is what the disclosure expects
                if ('isOpen' in options) {
                    renameProperty(options, 'isOpen', 'isExpanded');
                }
                if ('isInitiallyOpen' in options) {
                    renameProperty(options, 'isInitiallyOpen', 'isInitiallyExpanded');
                }
            }
            return options;
        },
        'x-data'() {
            return {
                __popup_isRoot: true,
                __popup_returnFocusAfterClose: returnFocusAfterClose,
                __popup_autoclose: autoclose,
                __popup_targetEl: null,
                __popup_floatReferenceEl: null,
                __popup_popupEl: null,
                __popup_rootEl: $el,
            };
        },
    });
}
