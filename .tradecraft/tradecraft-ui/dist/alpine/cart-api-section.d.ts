import { Alpine as AlpineType } from 'alpinejs';
/**
 * Keeps a section in step with the cart. Put it on the root of a section that renders cart data, or on an element inside one: the cart drawer,
 * the cart page, the header cart button.
 *
 * - Marks the section with data-cart-api-section. The cart plugins (x-cart-item, x-cart-form, x-product-form) read that marker through
 *   getCartApiSections() and send the section's id in the request's `sections` parameter, so the cart response carries the section's new HTML.
 * - Listens on window for the standard shopify:cart:lines-update and shopify:cart:note-update events and morphs the section from the sections
 *   HTML their promise resolves with. When the response has no HTML for this section, the section reloads through the Section Rendering API.
 * - Renders overlapping requests once, after the last one settles, from the request that started last. Shopify applies the requests in start
 *   order, whatever order the responses arrive in, so that response holds the newest cart. A failed or cancelled latest request reloads the
 *   section instead. See createCartRequestGroup() in utils.
 * - Reloads the section after shopify:cart:error, and when the page tab becomes visible again, so a cart changed in another tab shows up.
 *
 * The directive takes no value and no modifiers. Reloads through the Section Rendering API are debounced by 500ms and batched.
 *
 * @example
 *
 * ```liquid
 * <div x-cart-api-section>
 *   {% for item in cart.items %}
 *     <li x-cart-item="{{ forloop.index }}" data-line-key="{{ item.key }}">…</li>
 *   {% endfor %}
 * </div>
 * ```
 */
export default function (Alpine: AlpineType): void;
