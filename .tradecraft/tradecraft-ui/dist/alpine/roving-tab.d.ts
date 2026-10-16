import { Alpine as AlpineType } from 'alpinejs';
import type { focusable, isFocusable } from 'tabbable';
export type RovingTabMagic = {
    focus(el: HTMLElement, options?: FocusOptions): void;
    setTabbable(el: HTMLElement): void;
    focusNext(options?: FocusOptions): void;
    focusPrev(options?: FocusOptions): void;
    focusFirst(options?: FocusOptions): void;
    focusLast(options?: FocusOptions): void;
};
declare module 'alpinejs' {
    interface Magics<T> {
        /**
         * Focus control for the enclosing x-roving-tab: `focus(el)`, `setTabbable(el)`,
         * `focusNext()`, `focusPrev()`, `focusFirst()`, `focusLast()`.
         */
        $rovingTab: RovingTabMagic;
    }
}
/**
 * The subset of the `tabbable` module this plugin lazy-loads.
 */
export type RovingTabTabbableModule = {
    focusable: typeof focusable;
    isFocusable: typeof isFocusable;
};
export interface RovingTabOptions {
    initialIndex?: number | null;
    direction?: 'vertical' | 'horizontal';
    wrap?: boolean;
    focusables?: () => (NodeListOf<HTMLElement> | HTMLElement[]) | NodeListOf<HTMLElement> | HTMLElement[];
    tabbablePromise?: Promise<RovingTabTabbableModule>;
}
export interface RovingTabComponent {
    __rovingTab_isRoot: boolean;
    __rovingTab_direction?: 'vertical' | 'horizontal';
    __rovingTab_wrap?: boolean;
    __rovingTab_tabbableFocusable?: typeof focusable | null;
    __rovingTab_tabbableIsFocusable?: typeof isFocusable | null;
    __rovingTab_setInitialTabIndicies(): void;
    __rovingTab_setTabbable(el: HTMLElement, focusables?: HTMLElement[]): void;
    __rovingTab_focus(el: HTMLElement, options?: FocusOptions, focusables?: HTMLElement[]): void;
    __rovingTab_focusNext(options?: FocusOptions): void;
    __rovingTab_focusPrev(options?: FocusOptions): void;
    __rovingTab_focusFirst(options?: FocusOptions): void;
    __rovingTab_focusLast(options?: FocusOptions): void;
    __rovingTab_getFocusables(): HTMLElement[];
    __rovingTab_isFocusableMember(el: HTMLElement): boolean;
    __rovingTab_getTabbableIndex(focusables?: HTMLElement[]): number;
    __rovingTab_getActiveIndex(focusables?: HTMLElement[]): number;
    __rovingTab_listElement: HTMLElement | null;
    __rovingTab_onKeyDown(e: KeyboardEvent): void;
    __rovingTab_onClick(e: MouseEvent): void;
    __rovingTab_onFocusIn(e: FocusEvent): void;
}
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
export default function (Alpine: AlpineType): void;
export declare function handleRovingTabMagic(Alpine: AlpineType): ($el: HTMLElement) => RovingTabMagic;
