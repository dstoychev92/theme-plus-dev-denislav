import { Alpine as AlpineType, AlpineComponent } from 'alpinejs';
export type FocusStateComponent = AlpineComponent<{
    hasFocus: boolean;
}>;
declare module 'alpinejs' {
    interface Magics<T> {
        $hasFocus: boolean;
    }
}
/**
 * Plugin to allow for easily binding an external x-data variable to the focus state of an element
 *
 * e.g of instead of this
 *
 * <button x-data="{ hasFocus: false }" @focus="hasFocus = true" @blur="hasFocus = false"></button></button>
 *
 * you can just do this:
 *
 * <button x-data="{ hasFocus: false }" x-focus-state="hasFocus = $hasFocus">Focus on me</button>
 *
 * The expression passed to `x-focus-state` is evaluated when it receives the `focus` (`$hasFocus` will be true), and again when it receives the
 * `blur` event (`$hasFocus` will be false).
 *
 * This plugin has the added benefit that the `blur` listener isn't bound until the `focus` element is fired, and also is destroyed when the element is destroyed or `blur` is fired
 */
declare const _default: (Alpine: AlpineType) => void;
export default _default;
