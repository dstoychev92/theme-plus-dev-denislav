import { cancelIdleCallback, requestIdleCallback } from '../utils/dom';
import { createCartRequestGroup } from '../utils/cart-request-group';
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
export default function (Alpine) {
    Alpine.directive('cart-api-section', ($el, _data, { cleanup }) => {
        const component = () => Alpine.$data($el);
        // Overlapping requests render once, from the request that started last
        const group = createCartRequestGroup((latest) => {
            if (latest) {
                component().__cartApiSection_applySections(latest.sections);
            }
            else {
                component().__cartApiSection_refresh();
            }
        });
        let idleCallbackId = null;
        Alpine.bind($el, {
            'x-data'() {
                return {
                    __cartApiSection_refresh: Alpine.debounce(() => {
                        this.$sectionApi.update({ batch: true, cachePolicy: 'network-only' });
                    }, 500),
                    // Morph this section from the cart response's sections HTML, or fall
                    // back to a Section Rendering API request when it is missing
                    __cartApiSection_applySections(sections) {
                        const updatedSectionHtml = this.$sectionId ? sections === null || sections === void 0 ? void 0 : sections[this.$sectionId] : undefined;
                        if (typeof updatedSectionHtml === 'string') {
                            this.$sectionApi.setHtml(updatedSectionHtml, { mode: 'morph' });
                        }
                        else {
                            this.__cartApiSection_refresh();
                        }
                    },
                };
            },
            // The cart plugins read this marker and send the section id in the
            // request's sections parameter
            'data-cart-api-section': 'true',
            // The standard cart events fire before their request starts; the sections
            // HTML arrives when the event's promise resolves
            // https://shopify.dev/docs/api/storefront-events-and-actions
            '@shopify:cart:lines-update.window'() {
                return group.track(this.$event.promise);
            },
            '@shopify:cart:note-update.window'() {
                return group.track(this.$event.promise);
            },
            '@shopify:cart:error.window'() {
                this.__cartApiSection_refresh();
            },
            // A cart changed in another tab shows up once this tab is active again
            '@visibilitychange.window'() {
                if (idleCallbackId !== null)
                    cancelIdleCallback(idleCallbackId);
                idleCallbackId = requestIdleCallback(() => {
                    idleCallbackId = null;
                    if (document.hidden)
                        return;
                    this.__cartApiSection_refresh();
                }, { timeout: 5000 });
            },
        });
        cleanup(() => {
            if (idleCallbackId !== null)
                cancelIdleCallback(idleCallbackId);
            idleCallbackId = null;
        });
    }).before('bind');
}
