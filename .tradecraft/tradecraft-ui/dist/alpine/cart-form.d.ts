import { Alpine as AlpineType } from 'alpinejs';
import { AsyncFormMagic } from './async-form';
export type CartFormMagic = AsyncFormMagic;
declare module 'alpinejs' {
    interface Magics<T> {
        $cartForm: CartFormMagic;
    }
}
/**
 * Hijacks cart form submissions and serializes form data and submits to the /cart/update.js endpoint (window.theme.routes.cartUpdate) instead of a normal HTTP form submission.
 *
 * - Looks for sections marked with data-cart-api-section and adds them in the 'sections' form data parameter so that the theme can update the sections in response to the form submission.
 * - Built on x-async-form, so the wait-success/wait-error modifiers pass through and the '$cartForm' magic has the same API as '$asyncForm'.
 *
 * ## Events
 * Standard storefront events (https://shopify.dev/docs/api/storefront-events-and-actions), dispatched from the form element and bubbling to window:
 * - `shopify:cart:note-update` - Dispatched before the request when the form's `note` field changed from its server-rendered value.
 *   `event.promise` resolves after the request with `{cart, detail}` where `detail` carries `sections`, `source: 'cart-form'`, `sourceId`, and `didError`.
 * - `shopify:cart:lines-update` - Dispatched before the request for the form's `updates[...]` quantity fields: action 'remove' for lines set
 *   to 0 and action 'update' for the rest, as separate events when one submission carries both. Keyed fields (`updates[<line key>]`) put their
 *   key in the line id; positional `updates[]` fields have no key, so their line id is empty.
 * - `shopify:cart:error` - Dispatched when the update fails. A request the theme cancelled itself dispatches no error; its promises resolve
 *   with `didError: true` and `aborted: true`.
 */
export default function (Alpine: AlpineType): void;
