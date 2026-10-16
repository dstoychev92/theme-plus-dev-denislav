import { Alpine as AlpineType, AlpineComponent } from 'alpinejs';
import { ListboxMagic } from './listbox';
import { PopupMagic } from './popup';
export type SelectComponent = AlpineComponent<{
    __select_isRoot: boolean;
    __select_displayEl: HTMLElement | null;
    __select_buttonEl: HTMLButtonElement | null;
    __select_panelEl: HTMLElement | null;
    __select_optionsEl: HTMLElement | null;
    __select_labelEl: HTMLElement | null;
    __select_openingViaKeydown?: boolean;
    __select_handleOpenFocus(): void;
}>;
export type SelectComponentOptions = {};
export type SelectMagic = ListboxMagic & PopupMagic;
declare module 'alpinejs' {
    interface Magics<T> {
        /**
         * State of the enclosing x-select: everything on $listbox and $popup merged
         */
        $select: SelectMagic;
    }
}
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
export default function (Alpine: AlpineType): void;
