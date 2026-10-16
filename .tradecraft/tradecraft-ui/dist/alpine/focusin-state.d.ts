import { Alpine as AlpineType, AlpineComponent } from 'alpinejs';
export type FocusInStateComponent = AlpineComponent<{
    hasFocusIn: boolean;
}>;
declare module 'alpinejs' {
    interface Magics<T> {
        $hasFocusIn: boolean;
    }
}
/**
 * Plugin to allow for easily binding an external x-data variable to whether an element contains focus or not
 *
 * e.g of instead of this
 *
 * <div x-data="{ hasFocusIn: false }" @focusin="hasFocusIn = true" @focusout="hasFocusIn = false">
 *   </button></button>
 * </div>
 *
 * you can just do this:
 *
 * <button x-data="{ hasFocusIn: false }" x-focusin-state="hasFocusIn = $hasFocusIn">Focus on me</button>
 *
 * The expression passed to `x-focusin-state` is evaluated when it receives the `focusin` (`$hasFocusIn` will be true), and again when it receives the
 * `focusout` event (`$hasFocusIn` will be false).
 *
 * This plugin has a few added benefits in addition to simpler code:
 * - The `focusout` listener isn't bound until the `focusin` element is fired, and also is destroyed when the element is destroyed or `focusout` is fired
 * - This plugin checks that when focusout occurs, the new focused element is actually outside of the wrapper
 */
declare const _default: (Alpine: AlpineType) => void;
export default _default;
