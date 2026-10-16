import { isHtmlElement } from '../utils/dom';
import { isKeyboardActive } from './keyboard-active';
/**
 * Parks keyboard focus on the element when a focused descendant control becomes
 * disabled. The browser drops focus to `<body>` when it disables the focused
 * control, so the next Tab press restarts from the top of the document. Parking
 * keeps the tab position and the `:focus-within` state local while the control
 * is unavailable.
 *
 * An optional expression gates the park. It is evaluated in the element's scope
 * when focus drops.
 *
 * The element needs a markup `tabindex="-1"`, because a section morph strips a
 * runtime-added attribute. Without one the directive warns and stays inactive.
 *
 * Requires the keyboard-active plugin.
 *
 * @example
 * <div tabindex="-1" x-focus-park="$productForm?.state === 'pending'">
 *   <button :disabled="$productForm.state === 'pending'">Add to cart</button>
 * </div>
 */
export default function (Alpine) {
    Alpine.directive('focus-park', ($el, { value, modifiers, expression }, { evaluate, cleanup }) => {
        if (!isHtmlElement($el)) {
            throw new Error(`Expected HTMLElement but got ${$el}`);
        }
        if (value !== null) {
            throw new Error(`Unknown directive: x-focus-park:${value}`);
        }
        if (modifiers.length) {
            throw new Error(`Unknown modifier: x-focus-park.${modifiers.join('.')}`);
        }
        if (!$el.hasAttribute('tabindex')) {
            console.warn('x-focus-park needs a markup tabindex="-1" so the element can take focus.', $el);
            return;
        }
        const onFocusOut = (event) => {
            const target = event.target;
            if (event.relatedTarget !== null || !isKeyboardActive())
                return;
            if (!(target instanceof HTMLElement) || !target.matches(':disabled'))
                return;
            if (expression && !evaluate(expression))
                return;
            // Wait one microtask since focus-within trackers ignore a focusin fired during this focusout
            queueMicrotask(() => $el.focus({ preventScroll: true }));
        };
        $el.addEventListener('focusout', onFocusOut);
        cleanup(() => $el.removeEventListener('focusout', onFocusOut));
    });
}
