import { isDialogApiSupported, isDialogElement, isPopoverApiSupported } from '../utils';
import { warnMissingParentDirective } from '../utils/error';
const DEFAULT_OFFSET = 5;
/**
 * A popup whose panel renders in the browser's top layer while open (the native Popover
 * API), so it escapes every clipped ancestor and stacking context. Builds on x-popup for
 * the open state and float positioning, and traps focus in the panel while it is open.
 *
 * Directives:
 * - x-popover - The root element. Passes its modifiers and expression to x-popup.
 * - x-popover:button - The button that toggles the panel.
 * - x-popover:panel - The floating panel. Modifiers are x-float positioning modifiers
 *   (default: absolute.bottom.offset.5px.flip.update.shift.fit-x.pad.5px) and pass to
 *   x-popup:popup, so .nofloat also works here. The .notrap modifier disables the focus
 *   trap. The expression holds float options.
 * - x-popover:arrow - The arrow element. Put it inside the panel.
 *
 * The $popover magic: isOpen (get/set), open(), close().
 *
 * @example
 *
 * <div x-popover>
 *   <button x-popover:button>Toggle</button>
 *   <div x-popover:panel.bottom.offset.16px x-cloak>
 *     <div x-popover:arrow></div>
 *     <span>lorem ipsum</span>
 *   </div>
 * </div>
 */
export default function (Alpine) {
    Alpine.directive('popover', ($el, data, utilities) => {
        if (data.value == 'button') {
            handleButton($el, Alpine);
        }
        else if (data.value == 'panel') {
            handlePanel($el, Alpine, data, utilities);
        }
        else if (data.value == 'arrow') {
            handleArrow($el, Alpine);
        }
        else if (data.value == null) {
            handleRoot($el, Alpine, data);
        }
        else {
            throw new Error(`Unknown directive: x-popover:${data.value}`);
        }
    }).before('bind');
    Alpine.magic('popover', handlePopoverMagic(Alpine));
}
export function handlePopoverMagic(Alpine) {
    return function ($el) {
        const $data = Alpine.$data($el);
        return {
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
        };
    };
}
function handleButton($el, Alpine) {
    Alpine.bind($el, {
        'x-init'() {
            if (!this.__popover_isRoot) {
                warnMissingParentDirective('x-popover:button', 'x-popover', this.$el);
            }
        },
        'x-popup:button': '',
    });
}
function handlePanel($el, Alpine, { modifiers, expression }, {}) {
    const shouldTrap = !modifiers.includes('notrap');
    Alpine.bind($el, Object.assign(Object.assign(Object.assign({}, (modifiers.length
        ? {
            [`x-popup:popup.${modifiers.join('.')}`]: expression || '',
        }
        : {
            [`x-popup:popup.absolute.bottom.offset.${DEFAULT_OFFSET}px.flip.update.shift.fit-x.pad.5px`]: expression || '',
        })), { role: 'popover', 'x-data'() {
            return {
                init() {
                    if (!this.$data.__popover_isRoot) {
                        warnMissingParentDirective('x-popover:panel', 'x-popover', $el);
                        return;
                    }
                    this.$data.__popover_popoverEl = $el;
                    // TODO investigate hooking into Alpine's el._x_doShow / el._x_doHide hooks to show / hide popover
                    if (isPopoverApiSupported()) {
                        if (this.$popup.isOpen) {
                            this.$nextTick(() => {
                                // Wait until next tick to ensure that the popover is rendered and positioned
                                this.__popover_showPopover();
                            });
                        }
                        this.$watch('$popup.isOpen', async (isOpen) => {
                            if (isOpen) {
                                this.__popover_showPopover();
                            }
                            else {
                                this.__popover_hidePopover();
                            }
                        });
                    }
                },
                __popover_showPopover() {
                    // Adding 'popover' attribute only when opening popover forces _this_ popover to be at the top of the top layer
                    $el.popover = 'manual';
                    if (isDialogApiSupported() && isDialogElement($el)) {
                        $el.showModal();
                    }
                    else {
                        $el.showPopover();
                    }
                },
                async __popover_hidePopover() {
                    // Wait until animations have completed before hiding the popover to avoid
                    // layout shifting when popover / top-layer styles are removed
                    await this.$disclosure.waitForAnimations();
                    // Ensure popover hasn't been reopened
                    if (this.$popup.isOpen)
                        return;
                    if ($el.popover == 'manual') {
                        if (isDialogApiSupported() && isDialogElement($el)) {
                            if ($el.open) {
                                $el.close();
                            }
                        }
                        else {
                            $el.hidePopover();
                        }
                    }
                    $el.popover = null;
                },
            };
        } }), (shouldTrap
        ? {
            'x-trap.noreturn': '$popup.isOpen && await $disclosure.waitForAnimations()',
        }
        : {})));
}
function handleArrow($el, Alpine) {
    Alpine.bind($el, {
        'x-init'() {
            if (!this.__popover_isRoot) {
                warnMissingParentDirective('x-popover:arrow', 'x-popover', this.$el);
            }
        },
        'x-float:arrow': '',
    });
}
function handleRoot($el, Alpine, { modifiers, expression }) {
    Alpine.bind($el, {
        [`x-popup.${modifiers.join('.')}`]: expression || '',
        'x-data'() {
            return {
                __popover_isRoot: true,
                __popover_popoverEl: null,
            };
        },
    });
}
