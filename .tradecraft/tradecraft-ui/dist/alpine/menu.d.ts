import { AlpineComponent, Alpine as AlpineType } from 'alpinejs';
import { PopupMagic } from './popup';
export type MenuComponent = AlpineComponent<{
    __menu_getEnabledOptions(): HTMLElement[];
}>;
export type MenuMagic = PopupMagic & {
    /**
     * Allow manually binding an element as the menu button. This is useful when the button is not a direct child of the x-menu element
     */
    bindButton(el: HTMLElement): void;
};
export type MenuContextComponent = AlpineComponent<{
    __menu_rootEl: HTMLElement | null;
    __menu_buttonEl: HTMLElement | null;
    __menu_popupEl: HTMLElement | null;
    __menu_menuEl: HTMLElement | null;
    __menu_openingKey: string | null;
}>;
export type MenuButtonComponent = AlpineComponent<{}>;
/**
 * Plugin for building dropdown menus that follow the ARIA menu-button pattern
 * https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/
 * Builds on x-popup for the open state and positioning, x-roving-tab for arrow-key
 * focus, and x-focus-match for type-ahead. Does not support submenus yet.
 *
 * Directives:
 * - x-menu - The root element.
 * - x-menu:button - The button that toggles the menu (aria-haspopup="menu"). ArrowDown
 *   opens the menu and focuses the first item; ArrowUp opens it and focuses the last.
 * - x-menu:popup - The floating panel around the menu. Modifiers are x-float positioning
 *   modifiers (default: bottom-start.flip.update.shift).
 * - x-menu:menu - The list itself (role="menu"). Arrow keys move focus through enabled
 *   items and wrap; typing a character focuses the next item that starts with it.
 * - x-menu:item - A menu item (role="menuitem"). Items with aria-disabled="true" are
 *   skipped in keyboard navigation.
 *
 * The $menu magic: everything on $popup, plus bindButton(el) to register a button that
 * is not a child of the x-menu element.
 *
 * @example
 *
 * <div x-menu>
 *   <button x-menu:button>Actions</button>
 *   <div x-menu:popup x-cloak>
 *     <ul x-menu:menu>
 *       <li><button x-menu:item>Duplicate</button></li>
 *       <li><button x-menu:item>Delete</button></li>
 *     </ul>
 *   </div>
 * </div>
 */
export default function (Alpine: AlpineType): void;
