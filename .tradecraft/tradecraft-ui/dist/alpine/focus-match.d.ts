import { Alpine as AlpineType, AlpineComponent } from 'alpinejs';
export type FocusMatchMagic = {
    setFocusByFirstCharacter(char: string): void;
};
export type FocusMatchComponent = AlpineComponent<{
    __focusMatch_isRoot: boolean;
    __focusMatch_listElement: HTMLElement | null;
    __focusMatch_tabbableFocusable: ((root: HTMLElement) => HTMLElement[]) | null;
    __focusMatch_onKeyDown(e: KeyboardEvent): void;
    __focusMatch_setFocusByFirstCharacter(char: string): void;
    __focusMatch_getFocusables(): HTMLElement[];
}>;
export interface FocusMatchOptions {
    focusables?: () => (NodeListOf<HTMLElement> | HTMLElement[]) | NodeListOf<HTMLElement> | HTMLElement[];
    tabbablePromise?: Promise<{
        focusable: (root: Element) => unknown[];
    }>;
}
declare module 'alpinejs' {
    interface Magics<T> {
        /**
         * `setFocusByFirstCharacter(char)` on the enclosing x-focus-match: focuses the
         * next item whose text starts with the character.
         */
        $focusMatch: FocusMatchMagic;
    }
}
/**
 * Focuses an element in a list by typing the first character of its text. Useful in
 * listboxes and menus.
 *
 * `x-focus-match` is the root and handles the keydown. `x-focus-match:list` marks
 * the element whose focusables are searched (defaults to the root). An expression on
 * the root supplies the focusable elements; without one the plugin finds them with
 * the tabbable package. The search starts after the current item and wraps around.
 */
export default function (Alpine: AlpineType): void;
export declare function handleFocusMatchMagic(Alpine: AlpineType): ($el: HTMLElement) => FocusMatchMagic;
