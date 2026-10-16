import { Alpine as AlpineType } from 'alpinejs';
import { AsyncFormMagic } from './async-form';
export type ProductFormMagic = AsyncFormMagic;
declare module 'alpinejs' {
    interface Magics<T> {
        $productForm: ProductFormMagic;
    }
}
/**
 * Hijacks product form submissions and serializes form data and submits to the `/cart/add.js` endpoint instead of a normal HTTP form submission.
 *
 * Notes:
 * - Looks for sections marked with data-cart-api-section and adds them in the 'sections' form data parameter so that the theme can update the sections in response to the form submission.
 * - Built on x-async-form, so the wait-success/wait-error modifiers pass through and the '$productForm' magic has the same API as '$asyncForm'.
 *
 * @example
 *
 * ```liquid
 * {% form 'product', product, x-product-form: '' %}
 *   <input type="hidden" name="id" value="123">
 *   <input type="text" name="name" value="Product Name">
 *   <button type="submit">Add to cart</button>
 * {% endform %}
 * ```
 *
 * @example Applying x-product-form to a parent of a form element. In this case the form directive will be automatically applied to the form element found inside the div.
 * ```liquid
 * <div x-product-form>
 *   {% form 'product', product, x-product-form: '' %}
 *     <input type="hidden" name="id" value="123">
 *     <input type="text" name="name" value="Product Name">
 *     <button type="submit">Add to cart</button>
 *   {% endform %}
 * </div>
 * ```
 *
 * ## Events
 * Standard storefront events (https://shopify.dev/docs/api/storefront-events-and-actions), dispatched from the form element and bubbling to window:
 * - `shopify:cart:lines-update` - Dispatched with action 'add' before the request starts. `event.promise` resolves after the request with
 *   `{cart, detail}` where `detail` carries `sections` (section-rendering HTML), `items` (full cart items), `item` (the added line, with `url`),
 *   `itemCount`, `source: 'product-form'`, `sourceId` (form element id), and `didError`.
 * - `shopify:cart:error` - Dispatched when the add fails. `event.error` is the message; `event.detail` carries `description` and `errors`.
 *   A request the theme cancelled itself dispatches no error; its promise resolves with `didError: true` and `aborted: true`.
 *
 * The internal `form:pending` / `form:success` / `form:error` events of x-async-form are unchanged.
 */
export default function (Alpine: AlpineType): void;
