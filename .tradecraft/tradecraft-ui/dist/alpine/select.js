import { isHtmlElement, mergeProperties } from '../utils';
import { warnMissingParentDirective } from '../utils/error';
import { handleListboxMagic, handleOption as handleListboxOption } from './listbox';
import { handlePopupMagic } from './popup';
import { isPrintableCharacter } from '../utils/keyboard';
/**
 * IMPORTANT: once custom-styled HTML selects have broad support we'll likely burn this in fire and just use that.
 *
 * Enable the creation and management of accessible select-only selects which provide an interface for selecting an
 * item from a list. A select is a listbox (x-listbox holds the selection) inside a popover
 * (x-popover holds the open state and positions the panel).

 * See https://www.w3.org/WAI/ARIA/apg/patterns/select/examples/select-select-only/ for more information about selects:
 * Partly inspired by https://react-spectrum.adobe.com/react-aria/Select.html
 *
 * Notes:
 * - Requires tradecraft-ui 'listbox' plugin
 * - Requires tradecraft-ui 'popover' plugin
 * - Requires tradecraft-ui 'focus-match' and 'scroll-lock' plugins
 *
 * Directives:
 * - x-select - The root element. Modifiers and expression pass to x-popover. Locks page
 *   scroll while open. When an option is selected, the panel closes and focus returns to
 *   the button.
 * - x-select:button - The button that opens the select (aria-haspopup="listbox").
 *   ArrowDown opens the panel; typing a printable character opens it and focuses the
 *   first option that starts with that character.
 * - x-select:panel - The floating panel around the options. Modifiers are x-float
 *   positioning modifiers (default: bottom-start.flip.match.update.shift.fit-y.pad.5px).
 * - x-select:options - The container for the options (role="listbox"). On open, focus
 *   moves to the selected option.
 * - x-select:option - One option (role="option"). Reads its `value` attribute; the
 *   option's children render as the selected value in x-select:display.
 * - x-select:display - Shows the selected option's content inside the button.
 * - x-select:hidden-input - A hidden <input> that carries the selected value for forms.
 * - x-select:label - The label element for the select.
 *
 * The '$select' magic property merges the functionalities of '$listbox' and '$popup', providing
 * a comprehensive API for managing the select state, including selection, popup visibility, and
 * keyboard interactions.
 *
 * Usage with <label> elements:
 * x-select may be used in conjunction with HTML <label> elements using the `for` attribute.
 *
 * @example
 *
 * <label for="my-select">My Select</label>
 * <div x-select>
 *   <button x-select:button id="my-select">My Select</button>
 *   ...
 * </div>
 *
 * This will cause x-select to find the <label> element with the matching `for` attribute, add an id attribute
 * to the label element (if it does not already have one), and then add that to the generated aria-labelledby
 * attribute on the button
 * */
export default function (Alpine) {
    Alpine.directive('select', ($el, data) => {
        if (!isHtmlElement($el)) {
            throw new Error(`Expected HTMLElement but got ${$el}`);
        }
        if (data.value === 'label') {
            handleLabel($el, Alpine);
        }
        else if (data.value === 'button') {
            handleButton($el, Alpine);
        }
        else if (data.value === 'hidden-input') {
            handleHiddenInput($el, Alpine);
        }
        else if (data.value === 'display') {
            handleDisplay($el, Alpine);
        }
        else if (data.value === 'options') {
            handleOptions($el, Alpine);
        }
        else if (data.value === 'option') {
            handleOption($el, Alpine, data);
        }
        else if (data.value === 'panel') {
            handlePanel($el, Alpine, data);
        }
        else if (data.value === null) {
            handleRoot($el, Alpine, data);
        }
        else {
            throw new Error(`Unknown directive: x-select:${data.value}`);
        }
    }).before('bind');
    Alpine.magic('select', handleSelectMagic(Alpine));
}
function handleSelectMagic(Alpine) {
    return function ($el) {
        return mergeProperties({}, handleListboxMagic(Alpine)($el), handlePopupMagic(Alpine)($el));
    };
}
function handleButton($el, Alpine) {
    Alpine.bind($el, {
        ['x-data']() {
            return {
                __select_onKeyDown(e) {
                    if (isPrintableCharacter(e.key)) {
                        // Mark that we're opening via keydown so autofocus logic can skip
                        this.$data.__select_openingViaKeydown = true;
                        this.$select.open();
                        this.$nextTick(() => {
                            requestAnimationFrame(() => {
                                this.$focusMatch.setFocusByFirstCharacter(e.key);
                                // Clear the flag after focus-match has had a chance to run
                                setTimeout(() => {
                                    this.$data.__select_openingViaKeydown = false;
                                }, 150);
                            });
                        });
                    }
                },
            };
        },
        'x-init'() {
            if (!this.__select_isRoot) {
                warnMissingParentDirective('x-select:button', 'x-select', this.$el);
                return;
            }
            this.__select_buttonEl = this.$el;
        },
        'x-popover:button': '',
        ':tabindex': '0',
        ':id': "$el.id || $id('select-button')",
        ':aria-labelledby'() {
            var _a, _b;
            return [((_a = this.__select_displayEl) === null || _a === void 0 ? void 0 : _a.id) || this.$el.id, (_b = this.__select_labelEl) === null || _b === void 0 ? void 0 : _b.id].filter(Boolean).join(' ');
        },
        ':aria-controls'() {
            var _a;
            return (_a = this.__listbox_optionsEl) === null || _a === void 0 ? void 0 : _a.id;
        },
        'aria-haspopup': 'listbox',
        '@keydown.down.stop.prevent': '$popup.open()',
        '@keydown': '__select_onKeyDown',
    });
}
function handleHiddenInput($el, Alpine) {
    Alpine.bind($el, {
        'x-listbox:hidden-input': '',
    });
}
function handleDisplay($el, Alpine) {
    Alpine.bind($el, {
        'x-init'() {
            if (!this.__select_isRoot) {
                warnMissingParentDirective('x-select:display', 'x-select', this.$el);
                return;
            }
            this.__select_displayEl = this.$el;
        },
        'x-listbox:display': '',
    });
}
function handleLabel($el, Alpine) {
    Alpine.bind($el, {
        'x-init'() {
            if (!this.__select_isRoot) {
                warnMissingParentDirective('x-select:label', 'x-select', this.$el);
                return;
            }
            this.__select_labelEl = this.$el;
        },
        ':id': "$el.id || $id('select-label')",
    });
}
function handlePanel($el, Alpine, data) {
    Alpine.bind($el, Object.assign(Object.assign({}, (data.modifiers.length
        ? {
            [`x-popover:panel.notrap.${data.modifiers.join('.')}`]: '',
        }
        : {
            [`x-popover:panel.bottom-start.flip.match.update.shift.fit-y.pad.5px.notrap`]: '',
        })), { 'x-trap.noreturn.noautofocus': '$popup.isOpen', 
        // Unset aria-labelledby as we want the listbox to be the thing that is labelled
        ':aria-labelledby': 'null', 'x-init'() {
            if (!this.__select_isRoot) {
                warnMissingParentDirective('x-select:panel', 'x-select', this.$el);
                return;
            }
            this.__select_panelEl = this.$el;
        } }));
}
function handleOptions($el, Alpine) {
    Alpine.bind($el, {
        'x-init'() {
            if (!this.__select_isRoot) {
                warnMissingParentDirective('x-select:options', 'x-select', this.$el);
                return;
            }
            this.__select_optionsEl = this.$el;
        },
        'x-listbox:options': '',
        'x-focus-match:list': ``,
        ':aria-labelledby'() {
            var _a, _b;
            return ((_a = this.__select_labelEl) === null || _a === void 0 ? void 0 : _a.id) || ((_b = this.__select_buttonEl) === null || _b === void 0 ? void 0 : _b.id);
        },
        tabindex: '-1',
        ['x-data']() {
            return {
                init() {
                    this.$watch('$popup.isOpen', (open) => {
                        if (!open)
                            return;
                        // Skip autofocus if we're opening via keydown (focus-match will handle it)
                        if (this.$data.__select_openingViaKeydown) {
                            return;
                        }
                        // Use the unified focus handler from root component
                        if (this.$data.__select_handleOpenFocus) {
                            this.$data.__select_handleOpenFocus();
                        }
                    });
                },
            };
        },
    });
}
function handleOption($el, Alpine, _data) {
    // Call the listbox marker directly — avoid a second Alpine.bind pass per option.
    handleListboxOption($el, Alpine);
}
function handleRoot($el, Alpine, { modifiers, expression }) {
    Alpine.bind($el, {
        [`x-popover.${modifiers.join('.')}`]: expression || '',
        'x-listbox': '',
        'x-focus-match': `$listbox.enabledOptions`,
        ':aria-labelledby': 'null',
        'x-id': "['select-button', 'select-label']",
        'x-scroll-lock': '$popup.isOpen',
        // Close popup when option is selected and return focus to button
        '@change': `
      if ($popup.isOpen) {
        $popup.close()
        await $disclosure.waitForAnimations()
        __select_buttonEl.focus()
      }
    `,
        ['x-data']() {
            return {
                __select_isRoot: true,
                __select_displayEl: null,
                __select_buttonEl: null,
                __select_panelEl: null,
                __select_optionsEl: null,
                __select_labelEl: null,
                __select_openingViaKeydown: false,
                __select_handleOpenFocus() {
                    const allOptions = Array.from(this.$listbox.options || []);
                    const ariaSelectedOption = allOptions.find((option) => option.getAttribute('aria-selected') === 'true');
                    const firstOption = allOptions[0];
                    const initiallySelectedOption = ariaSelectedOption || firstOption;
                    if (initiallySelectedOption) {
                        setTimeout(() => {
                            initiallySelectedOption.focus();
                        }, 100);
                    }
                },
                init() {
                    this.$nextTick(() => {
                        var _a, _b;
                        // Wait until next animation frame to prevent interfering with initial focus
                        window.requestAnimationFrame(() => {
                            const allOptions = Array.from(this.$listbox.options || []);
                            const ariaSelectedOption = allOptions.find((option) => option.getAttribute('aria-selected') === 'true');
                            const firstOption = allOptions[0];
                            const initiallySelectedOption = ariaSelectedOption || firstOption;
                            if (initiallySelectedOption) {
                                // Allow selecting a disabled placeholder; options are markers now (no per-option x-data).
                                this.$listbox.select(initiallySelectedOption.getAttribute('value'), false);
                            }
                        });
                        // If no explicit label is provided with `x-select:label`, try to find an label related to the button with for="button-id"
                        // then assign a unique id to that label el
                        if (!this.__select_labelEl && this.__select_buttonEl) {
                            this.__select_labelEl = document.querySelector(`[for="${(_a = this.__select_buttonEl) === null || _a === void 0 ? void 0 : _a.id}"]`);
                            if (this.__select_labelEl && !((_b = this.__select_labelEl) === null || _b === void 0 ? void 0 : _b.id)) {
                                this.__select_labelEl.id = this.$id('select-label');
                            }
                        }
                    });
                },
            };
        },
    });
}
