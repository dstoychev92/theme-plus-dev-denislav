import { AlpineComponent, Alpine as AlpineType } from 'alpinejs';
import { DisclosureComponent } from './disclosure';
import { FloatMagic } from './float';
export type PopupRootComponent = DisclosureComponent & AlpineComponent<{
    __popup_isRoot: boolean;
    __popup_rootEl: HTMLElement | null;
    __popup_targetEl: HTMLElement | null;
    __popup_floatReferenceEl: HTMLElement | null;
    __popup_popupEl: HTMLElement | null;
    __popup_autoclose: boolean;
}>;
export type PopupPopupComponent = AlpineComponent<{
    __popup_enableAutoUpdating(): void;
    __popup_disableAutoUpdating(): void;
}>;
export type PopupOptions = {
    isOpen?: boolean;
    isInitiallyOpen?: boolean;
};
export type PopupMagic = FloatMagic & {
    open(): void;
    close(): void;
    get isOpen(): boolean;
    set isOpen(value: boolean);
    get targetEl(): HTMLElement | null;
    get floatReferenceEl(): HTMLElement | null;
    get popupEl(): HTMLElement | null;
};
declare module 'alpinejs' {
    interface Magics<T> {
        /**
         * State of the enclosing x-popup: isOpen (get/set), open(), close(), targetEl,
         * popupEl, floatReferenceEl, plus everything on $float
         */
        $popup: PopupMagic;
    }
}
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
export default function (Alpine: AlpineType): void;
export declare function handlePopupMagic(Alpine: AlpineType): ($el: HTMLElement) => PopupMagic;
