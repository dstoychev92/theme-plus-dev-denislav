import { Alpine as AlpineType } from 'alpinejs';
declare module 'alpinejs' {
    interface Magics<T> {
        /** True after Tab moves focus and until the next mousedown. */
        $isKeyboardActive: boolean;
        /** True when keyboard navigation is active and this element owns focus. */
        $hasKeyboardFocus: boolean;
    }
}
/** Return keyboard-navigation state. False before plugin init. */
export declare function isKeyboardActive(): boolean;
/**
 * Tracks whether the user is navigating with the keyboard: a Tab press that moves
 * focus turns it on, a mousedown turns it off. Exposed everywhere as
 * `$isKeyboardActive`; `$hasKeyboardFocus` is true when keyboard navigation is
 * active and the element is document.activeElement. Bind a body attribute to it
 * (e.g. `:data-keyboard-active="$isKeyboardActive"`) to gate focus rings in CSS.
 */
export default function (Alpine: AlpineType): void;
