import { Alpine as AlpineType, AlpineComponent } from 'alpinejs';
export type ListboxComponent = AlpineComponent<{
    __listbox_isRoot: boolean;
    __listbox_hiddenInputEl: HTMLInputElement | null;
    __listbox_displayValue: HTMLElement | null;
    __listbox_optionsEl: HTMLElement | null;
    __listbox_selectedValue: string | null;
    get __listbox_selectedOption(): HTMLElement | null;
    __listbox_isSelected(value: string | null): boolean;
    __listbox_select(value: string | null, dispatch?: boolean, eventTarget?: HTMLElement): void;
    __listbox_deselect(): void;
    get __listbox_options(): NodeListOf<HTMLElement>;
    get __listbox_enabledOptions(): NodeListOf<HTMLElement>;
    init(): void;
}>;
/**
 * Option helpers used by `$listboxOption`. Options are not Alpine components —
 * selection and ARIA live on the listbox root so N options cost O(1) to init.
 */
export type ListboxOptionMagic = {
    isDisabled: boolean;
    select(options?: {
        dispatch?: boolean;
        disabled?: boolean;
    }): void;
    isSelected: boolean | null;
};
/** `$listboxOption(optionEl)` — options are markers, so the magic needs the option element explicitly. */
export type ListboxOptionMagicFactory = (optionEl: HTMLElement) => ListboxOptionMagic;
export type ListboxMagic = {
    isSelected: ListboxComponent['__listbox_isSelected'];
    select: ListboxComponent['__listbox_select'];
    deselect: ListboxComponent['__listbox_deselect'];
    selectedValue: ListboxComponent['__listbox_selectedValue'];
    options: ListboxComponent['__listbox_options'];
    enabledOptions: ListboxComponent['__listbox_enabledOptions'];
};
declare module 'alpinejs' {
    interface Magics<T> {
        /**
         * State of the enclosing x-listbox: selectedValue, select(value), deselect(),
         * isSelected(value), options, enabledOptions
         */
        $listbox: ListboxMagic;
    }
}
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
export default function (Alpine: AlpineType): void;
export declare function handleListboxMagic(Alpine: AlpineType): ($el: HTMLElement) => ListboxMagic;
export declare function handleListboxOptionMagic(Alpine: AlpineType): (_$el: HTMLElement) => ListboxOptionMagicFactory;
/**
 * Marker only — no x-data, effects, or listeners per option. That work lives on
 * the options container (clicks/keys) and the root (aria-selected / tabbable).
 */
export declare function handleOption($el: HTMLElement, Alpine: AlpineType): void;
