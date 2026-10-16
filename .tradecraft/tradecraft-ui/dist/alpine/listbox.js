import { isHtmlElement, isString } from '../utils';
import { warnMissingParentDirective } from '../utils/error';
const selectors = {
    listbox: '[role="listbox"]',
    listboxOption: '[role="option"]',
    enabledListboxOption: '[role="option"]:not([aria-disabled=true])',
};
// TODO consider folding this into select plugin
/**
 * Enables the creation and management of accessible listbox components, following ARIA practices.
 * The 'listbox' directive and '$listbox' magic property provide functionality for managing listbox
 * options, selection state, and keyboard interactions.
 *
 * See https://www.w3.org/WAI/ARIA/apg/patterns/listbox/ for more information about listboxes
 *
 * Note:
 * - Requires tradecraft-ui 'roving-tab' plugin
 *
 * Usage:
 * - x-listbox (on <ul>, <ol>, or <div>) - Transforms the element into an Alpine.js-managed listbox.
 * - x-listbox:display - Binds to an element to display the selected value of the listbox.
 * - x-listbox:hidden-input   - Binds to an input element to store the selected value of the listbox.
 * - x-listbox:options - Defines the container for the listbox options.
 * - x-listbox:option  - Marker that assigns role="option". Selection and ARIA updates are handled
 *   by the options container (delegated events) and the listbox root (selected-value effect).
 *
 * The '$listbox' magic property provides an API for managing the listbox state, including methods
 * like 'select', 'deselect', and properties like 'selectedValue'
 *
 * @example
 *
 * <div x-listbox>
 *   <input type="hidden" name="my-input" x-listbox:hidden-input>
 *   <span x-listbox:display></span>
 *   <ul x-listbox:options>
 *     <li x-listbox:option="1">Option 1</li>
 *     <li x-listbox:option="2">Option 2</li>
 *     <li x-listbox:option="3">Option 3</li>
 *   </ul>
 * </div>
 */
export default function (Alpine) {
    Alpine.directive('listbox', ($el, data) => {
        if (!isHtmlElement($el)) {
            throw new Error(`Expected HTMLElement but got ${$el}`);
        }
        if (data.value === 'display') {
            handleDisplay($el, Alpine);
        }
        else if (data.value === 'hidden-input') {
            handleHiddenInput($el, Alpine);
        }
        else if (data.value === 'options') {
            handleOptions($el, Alpine);
        }
        else if (data.value === 'option') {
            handleOption($el, Alpine);
        }
        else if (data.value === null) {
            handleRoot($el, Alpine);
        }
        else {
            throw new Error(`Unknown directive: x-listbox:${data.value}`);
        }
    }).before('bind');
    Alpine.magic('listbox', handleListboxMagic(Alpine));
    Alpine.magic('listboxOption', handleListboxOptionMagic(Alpine));
}
export function handleListboxMagic(Alpine) {
    return function ($el) {
        const $data = Alpine.$data($el);
        // TODO figure out a way to not have to manually bind these methods to the component like this
        return {
            isSelected(value) {
                return $data.__listbox_isSelected(value);
            },
            select(value, dispatch) {
                return $data.__listbox_select(value, dispatch);
            },
            deselect() {
                return $data.__listbox_deselect();
            },
            get selectedValue() {
                return $data.__listbox_selectedValue;
            },
            get options() {
                return $data.__listbox_options;
            },
            get enabledOptions() {
                return $data.__listbox_enabledOptions;
            },
        };
    };
}
export function handleListboxOptionMagic(Alpine) {
    // Options no longer have their own x-data, so injectMagics would bind `$el` to the listbox
    // root. Callers pass the option element: `$listboxOption($el)` or `$listboxOption(optionEl)`.
    return function (_$el) {
        return function listboxOptionFor(optionEl) {
            const $data = Alpine.$data(optionEl);
            return {
                get isSelected() {
                    if (!$data.__listbox_isRoot)
                        return null;
                    return $data.__listbox_isSelected(optionEl.getAttribute('value'));
                },
                get isDisabled() {
                    return isOptionDisabled(optionEl);
                },
                select(options) {
                    selectOptionElement($data, optionEl, options);
                },
            };
        };
    };
}
/**
 * Marker only — no x-data, effects, or listeners per option. That work lives on
 * the options container (clicks/keys) and the root (aria-selected / tabbable).
 */
export function handleOption($el, Alpine) {
    $el.setAttribute('role', 'option');
    // Match the old reactive binding: bare `aria-disabled` becomes "true" so
    // `:not([aria-disabled=true])` and theme CSS keep treating the option as disabled.
    if ($el.hasAttribute('aria-disabled') && $el.getAttribute('aria-disabled') !== 'false') {
        $el.setAttribute('aria-disabled', 'true');
    }
    // Defer so the parent root's x-data is on the stack when this option mounts under x-select.
    queueMicrotask(() => {
        const data = Alpine.$data($el);
        if (!(data === null || data === void 0 ? void 0 : data.__listbox_isRoot)) {
            warnMissingParentDirective('x-listbox:option', 'x-listbox', $el);
        }
    });
}
function handleOptions($el, Alpine) {
    Alpine.bind($el, {
        'x-init'() {
            if (!this.__listbox_isRoot) {
                warnMissingParentDirective('x-listbox:options', 'x-listbox', $el);
                return;
            }
            this.__listbox_optionsEl = $el;
        },
        'x-roving-tab:list': ``,
        ':id': `$el.id || $id('listbox-options')`,
        role: 'listbox',
        ':tabindex': '-1',
        // Ensure a missing parent directive yields undefined instead of a ReferenceError
        ':aria-labelledby'() {
            var _a;
            return (_a = this.__listbox_displayValue) === null || _a === void 0 ? void 0 : _a.id;
        },
        // One listener for every option — avoid N click/keydown bindings.
        '@click'() {
            handleDelegatedOptionActivation(this, this.$event);
        },
        '@keydown.enter'() {
            handleDelegatedOptionActivation(this, this.$event);
        },
        '@keydown.space'() {
            handleDelegatedOptionActivation(this, this.$event);
        },
    });
}
function handleDelegatedOptionActivation(listbox, event) {
    var _a;
    // Some browsers (notably older mobile ones) report the text node inside the option as
    // the event target. Walk up so a tap on the label still selects.
    const rawTarget = event.target;
    const target = rawTarget instanceof Element ? rawTarget : rawTarget instanceof Node ? rawTarget.parentElement : null;
    if (!target)
        return;
    const option = target.closest(selectors.listboxOption);
    if (!option || !((_a = listbox.__listbox_optionsEl) === null || _a === void 0 ? void 0 : _a.contains(option)))
        return;
    // Preserve "no value → do nothing" so nested links can still receive the click.
    if (option.getAttribute('value') == null)
        return;
    event.stopPropagation();
    event.preventDefault();
    selectOptionElement(listbox, option);
}
function selectOptionElement(listbox, option, options) {
    if (!listbox.__listbox_isRoot)
        return;
    // `disabled: true` means "allow selecting a disabled option" (placeholder bootstrap).
    if ((options === null || options === void 0 ? void 0 : options.disabled) !== true && isOptionDisabled(option))
        return;
    // Pass the option through so change/input fire on it — product variant options put
    // `@change` on each `<li>`, and those handlers never see a bubbled event from the list.
    listbox.__listbox_select(option.getAttribute('value'), options === null || options === void 0 ? void 0 : options.dispatch, option);
}
function isOptionDisabled(option) {
    const ariaDisabled = option.getAttribute('aria-disabled');
    return ariaDisabled === '' || ariaDisabled === 'true';
}
function handleHiddenInput($el, Alpine) {
    Alpine.bind($el, {
        'x-init'() {
            if (!this.__listbox_isRoot) {
                warnMissingParentDirective('x-listbox:hidden-input', 'x-listbox', this.$el);
                return;
            }
            this.__listbox_hiddenInputEl = this.$el;
        },
        '@morph:sync'() {
            const event = this.$event;
            this.__listbox_select(event.detail.value, false);
            this.$nextTick(() => {
                syncOptionSelectionUi(this, this.__listbox_selectedValue, undefined);
                syncDisplay(this, Alpine);
            });
        },
        'x-model.fill': '$data.__listbox_selectedValue',
        'x-modelable': '$data.__listbox_selectedValue',
    });
}
function handleDisplay($el, Alpine) {
    Alpine.bind($el, {
        'x-init'() {
            if (!this.__listbox_isRoot) {
                warnMissingParentDirective('x-listbox:display', 'x-listbox', this.$el);
                return;
            }
            this.__listbox_displayValue = $el;
        },
        'x-effect'() {
            // Bail out (rather than throw on __listbox_options.length) when used without a parent x-listbox.
            if (!this.__listbox_isRoot)
                return;
            syncDisplay(this, Alpine);
        },
        ':id': `$el.id || $id('listbox-display')`,
    });
}
function syncDisplay(listbox, Alpine) {
    const displayEl = listbox.__listbox_displayValue;
    if (!displayEl || listbox.__listbox_options.length === 0)
        return;
    const selectedOption = listbox.__listbox_selectedOption;
    Alpine.mutateDom(() => {
        if (selectedOption) {
            const clonedSelectedOption = selectedOption.cloneNode(true);
            displayEl.replaceChildren(...clonedSelectedOption.childNodes);
        }
        else {
            displayEl.replaceChildren();
        }
    });
}
function handleRoot($el, Alpine) {
    Alpine.bind($el, {
        'x-id': "['listbox', 'listbox-options', 'listbox-display']",
        'x-roving-tab.vertical.nowrap': `__listbox_enabledOptions`,
        ':id': `$el.id || $id('listbox')`,
        ['x-data']() {
            return listbox();
        },
    });
}
function listbox() {
    return {
        __listbox_isRoot: true,
        __listbox_displayValue: null,
        __listbox_optionsEl: null,
        __listbox_hiddenInputEl: null,
        __listbox_selectedValue: null,
        get __listbox_selectedOption() {
            var _a;
            return (((_a = this.__listbox_optionsEl) === null || _a === void 0 ? void 0 : _a.querySelector(`[value="${escapeValue(this.__listbox_selectedValue) || ''}"]`)) || null);
        },
        __listbox_select(value, dispatch = true, eventTarget) {
            this.__listbox_selectedValue = value;
            if (dispatch) {
                // Wait a tick so the hidden input's x-model has written the new value before
                // anyone listening (forms, product variant navigation) reads it.
                this.$nextTick(() => {
                    var _a;
                    // Fire from the chosen option when we have one. Alpine's `$dispatch` always
                    // uses `this.$el`, and with nested `x-data` on the options list that is the
                    // `<ul>` — so `@change` handlers on each option (product variants) never ran,
                    // the popup still closed via the root handler, and the page looked like it
                    // "closed without selecting". Bubbling still reaches root `@change` listeners.
                    const target = (_a = eventTarget !== null && eventTarget !== void 0 ? eventTarget : this.__listbox_selectedOption) !== null && _a !== void 0 ? _a : this.$el;
                    target.dispatchEvent(new CustomEvent('change', { detail: value, bubbles: true, composed: true, cancelable: true }));
                    target.dispatchEvent(new CustomEvent('input', { detail: value, bubbles: true, composed: true, cancelable: true }));
                });
            }
        },
        __listbox_deselect() {
            this.__listbox_selectedValue = null;
        },
        __listbox_isSelected(value) {
            return this.__listbox_selectedValue === value;
        },
        get __listbox_options() {
            var _a;
            return (((_a = this.__listbox_optionsEl) === null || _a === void 0 ? void 0 : _a.querySelectorAll(selectors.listboxOption)) ||
                []);
        },
        get __listbox_enabledOptions() {
            var _a;
            return (((_a = this.__listbox_optionsEl) === null || _a === void 0 ? void 0 : _a.querySelectorAll(selectors.enabledListboxOption)) || []);
        },
        init() {
            // Imperative ARIA/tabindex instead of per-option :aria-selected effects.
            this.$watch('__listbox_selectedValue', (value, oldValue) => {
                if (!this.__listbox_optionsEl)
                    return;
                syncOptionSelectionUi(this, value, oldValue);
            });
            // Options container and x-model.fill finish during this tick; sync once they exist.
            this.$nextTick(() => {
                syncOptionSelectionUi(this, this.__listbox_selectedValue, undefined);
            });
        },
    };
}
/**
 * Keep aria-selected and the roving tabindex in sync with `__listbox_selectedValue`.
 * Prefer touching only options whose value changed after the first full sync.
 * Use querySelectorAll — lists may repeat the same value (e.g. popular countries).
 */
function syncOptionSelectionUi(listbox, selectedValue, previousSelectedValue) {
    const optionsEl = listbox.__listbox_optionsEl;
    if (!optionsEl)
        return;
    const findOptionsByValue = (value) => {
        if (value === null)
            return [];
        return Array.from(optionsEl.querySelectorAll(`[value="${escapeValue(value) || ''}"]`));
    };
    if (previousSelectedValue === undefined) {
        for (const option of Array.from(listbox.__listbox_options)) {
            const selected = listbox.__listbox_isSelected(option.getAttribute('value'));
            option.setAttribute('aria-selected', selected ? 'true' : 'false');
            if (isOptionDisabled(option)) {
                option.setAttribute('tabindex', '-1');
            }
        }
    }
    else if (previousSelectedValue !== selectedValue) {
        // Clear leftover server-rendered aria-selected when moving off an empty selection.
        if (previousSelectedValue === null) {
            optionsEl.querySelectorAll(`${selectors.listboxOption}[aria-selected="true"]`).forEach((option) => {
                option.setAttribute('aria-selected', 'false');
            });
        }
        else {
            for (const previousOption of findOptionsByValue(previousSelectedValue)) {
                previousOption.setAttribute('aria-selected', 'false');
            }
        }
        for (const nextOption of findOptionsByValue(selectedValue)) {
            nextOption.setAttribute('aria-selected', 'true');
        }
    }
    const selectedOptions = findOptionsByValue(selectedValue);
    const tabbableOption = selectedOptions.find((option) => !isOptionDisabled(option));
    if (tabbableOption) {
        listbox.$rovingTab.setTabbable(tabbableOption);
    }
    else {
        for (const option of Array.from(listbox.__listbox_options)) {
            if (isOptionDisabled(option)) {
                option.setAttribute('tabindex', '-1');
            }
        }
    }
}
function escapeValue(value) {
    if (!isString(value))
        return null;
    return value === null || value === void 0 ? void 0 : value.replace(/[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g, '\\$&');
}
