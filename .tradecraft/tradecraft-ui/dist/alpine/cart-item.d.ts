import { Alpine as AlpineType } from 'alpinejs';
import { AsyncFormMagic } from './async-form';
export type CartItemFormMagic = AsyncFormMagic & {
    quantity: number | null;
    isRemoving: boolean;
};
declare module 'alpinejs' {
    interface Magics<T> {
        $cartItem: CartItemFormMagic;
    }
}
/**
 * Changes the quantity of one cart line item through the /cart/change.js endpoint (window.theme.routes.cartChange) instead of a normal HTTP form submission.
 *
 * The directive expression is required and is the 1-based line number of the item: x-cart-item="{{ forloop.index }}".
 *
 * - Looks for sections marked with data-cart-api-section and adds them in the 'sections' form data parameter so that the theme can update the sections in response to the form submission.
 * - Built on x-async-form, so the wait-success/wait-error modifiers pass through. The '$cartItem' magic has the same API as '$asyncForm' plus 'quantity' (read/write), 'isRemoving' (true while quantity is 0), and 'remove()' (sets quantity to 0 and submits).
 * - The request body carries the line key (or the line number without one), the quantity (from formData when present, otherwise $cartItem.quantity), and the sections.
 * - After each response the plugin sets $cartItem.quantity to the quantity the cart really holds. It finds this line by its key, or by line number without one,
 *   so a removed line keeps quantity 0 when the next line moves into its position. On a 422 (stockout) it fetches the cart to find that quantity, since the change response does not include it.
 * - Before a removed item hides, the plugin moves keyboard focus to a neighboring item so focus does not drop to <body>.
 * - The element should carry data-line-key="{{ line_item.key }}". The request then targets the line by key, which stays on this line while another
 *   request removes an earlier line and shifts the line numbers. The key also identifies the changed line in the standard event; without it the
 *   request uses the line number and the event's line id is empty.
 *
 * ## Events
 * Standard storefront events (https://shopify.dev/docs/api/storefront-events-and-actions), dispatched from the form element and bubbling to window:
 * - `shopify:cart:lines-update` - Dispatched with action 'update' (or 'remove' when the quantity is 0) before the request starts. `event.promise`
 *   resolves after the request with `{cart, detail}` where `detail` carries `sections`, `items`, `itemCount`, `source: 'cart-item'`, and `didError`.
 * - `shopify:cart:error` - Dispatched when the change fails. A request the theme cancelled itself dispatches no error; its promise
 *   resolves with `didError: true` and `aborted: true`.
 *
 * @example
 *
 * ```liquid
 * {% for item in cart.items %}
 *   <li>
 *     <span>{{ item.product.title }}</span>
 *     <span>{{ item.quantity }}</span>
 *     <span>{{ item.price | money }}</span>
 *     <form x-cart-item>
 *       <input type="number" x-model.fill.number="$cartItem.quantity" name="updates[]" value="{{ item.quantity }}" @input.debounce.500ms="$cartItem.submitAsync()">
 *     </form>
 *   </li>
 * {% endfor %}
 * ```
 *
 * @example Within another form
 *
 * ```liquid
 * {% form 'cart', cart, x-cart-item: '' %}
 *   {% for item in cart.items %}
 *     <li x-cart-item>
 *       <span>{{ item.product.title }}</span>
 *       <span>{{ item.quantity }}</span>
 *       <span>{{ item.price | money }}</span>
 *       <input type="number" x-model.fill.number="$cartItem.quantity" name="updates[]" value="{{ item.quantity }}" @input.debounce.500ms="$cartItem.submitAsync()">
 *     </li>
 *   {% endfor %}
 *   <button type="submit">Check out</button>
 * {% endform %}
 * ```
 */
export default function (Alpine: AlpineType): void;
