import { handleAsyncFormMagic } from './async-form';
import { beginCartLinesUpdate, dispatchCartError, failCartRequest, getCartApiSections, isFormElement, mergeProperties, resolveCartLinesUpdate, submitFormData, } from '../utils';
import { relocateFocusFrom } from '../utils/preserve-focus';
import * as cartApi from '../api/cart';
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
export default function (Alpine) {
    Alpine.directive('cart-item', ($el, data) => {
        var _a, _b;
        if (data.value == 'form') {
            handleForm($el, Alpine);
        }
        else if (data.value == 'context') {
            handleContext($el, Alpine, data);
        }
        else {
            const xFormModifiers = data.modifiers.length ? data.modifiers.join('.') : null;
            if (!((_b = (_a = window === null || window === void 0 ? void 0 : window.theme) === null || _a === void 0 ? void 0 : _a.routes) === null || _b === void 0 ? void 0 : _b.cartChange)) {
                throw new Error('window.theme.routes.cartChange is not defined');
            }
            if (!isFormElement($el)) {
                // Handle the case of x-async-form being applied to a parent of a form element
                // In this case we look for a form element child and apply form directive to that
                Alpine.bind($el, {
                    [`x-cart-item:context${xFormModifiers ? `.${xFormModifiers}` : ``}`]: data.expression,
                });
                const form = $el.querySelector('form');
                if (form) {
                    Alpine.bind(form, {
                        [`x-cart-item:form`]: '',
                    });
                }
            }
            else {
                Alpine.bind($el, {
                    [`x-cart-item:context${xFormModifiers ? `.${xFormModifiers}` : ``}`]: data.expression,
                    [`x-cart-item:form`]: '',
                });
            }
        }
    }).before('bind');
    Alpine.magic('cartItem', ($el) => {
        const $data = Alpine.$data($el);
        return mergeProperties({}, {
            get quantity() {
                return $data.__cartItem_quantity;
            },
            set quantity(quantity) {
                $data.__cartItem_quantity = quantity;
            },
            get isRemoving() {
                return $data.__cartItem_isRemoving;
            },
            remove: $data.__cartItem_remove.bind($data),
        }, handleAsyncFormMagic(Alpine)($el));
    });
}
function handleForm($el, Alpine) {
    Alpine.bind($el, {
        method: 'POST',
    });
}
function handleContext($el, Alpine, data) {
    const xFormModifiers = data.modifiers.length ? data.modifiers.join('.') : null;
    const line = parseInt(data.expression, 10);
    if (isNaN(line)) {
        throw new Error('x-cart-item requires a line number');
    }
    Alpine.bind($el, {
        'x-data'() {
            return {
                __cartItem_quantity: null,
                get __cartItem_isRemoving() {
                    return this.__cartItem_quantity === 0;
                },
                init() {
                    // Themes typically hide the line item as soon as it starts being removed (x-show on
                    // isRemoving), which silently drops keyboard focus to <body>. Move focus to a
                    // neighboring item (or the closest focusable outside) before that happens.
                    this.$watch('__cartItem_isRemoving', (isRemoving) => {
                        if (isRemoving) {
                            relocateFocusFrom($el);
                        }
                    });
                },
                async __cartItem_remove() {
                    this.__cartItem_quantity = 0;
                    return await this.__asyncForm_submitAsync();
                },
                async __cartItem_save(info) {
                    var _a, _b, _c;
                    const formData = (info === null || info === void 0 ? void 0 : info.formData) || new FormData();
                    const lineKey = $el.dataset.lineKey;
                    // change.js takes the line key or the 1-based line number. Shopify runs
                    // overlapping requests one after another, so once an earlier line is
                    // removed the number points at the line that moved into its place.
                    // https://shopify.dev/docs/api/ajax/reference/cart#identify-the-line-item-to-change
                    if (lineKey) {
                        formData.append('id', lineKey);
                    }
                    else {
                        formData.append('line', line.toString());
                    }
                    // Gather up all the sections marked with data-cart-api-section and add them in the 'sections' form data parameter
                    formData.append('sections', getCartApiSections().join(','));
                    if (!formData.has('quantity')) {
                        formData.append('quantity', this.__cartItem_quantity);
                    }
                    const quantity = parseFloat(formData.get('quantity'));
                    if (isNaN(quantity)) {
                        throw new Error('Quantity must be a number and cannot be empty');
                    }
                    const formEl = (this.__asyncForm_formEl || this.$el);
                    const deferred = beginCartLinesUpdate(formEl, {
                        action: quantity > 0 ? 'update' : 'remove',
                        context: 'cart',
                        // Empty id when the markup carries no data-line-key. The event still
                        // fires; only the line identification is lost.
                        lines: [{ id: lineKey !== null && lineKey !== void 0 ? lineKey : '', quantity }],
                    });
                    try {
                        const changeRequest = submitFormData({
                            action: `${window.theme.routes.cartChange}`,
                            method: 'POST',
                            enctype: 'application/json',
                            formData,
                        });
                        const changeResponse = await changeRequest;
                        // If the change request is a 422, we need to get the current cart and update the quantity input to the quantity of the item in the cart
                        // so that the quantity input has the max quantity available for the item
                        if ((changeResponse === null || changeResponse === void 0 ? void 0 : changeResponse.status) == 422) {
                            const changeResponseBody = await ((_a = changeResponse === null || changeResponse === void 0 ? void 0 : changeResponse.clone()) === null || _a === void 0 ? void 0 : _a.json().catch(() => null));
                            // The server rejected the change, so announce it now. The fetch below
                            // is cancelled whenever the shopper types again, and this error must
                            // not be lost with it.
                            dispatchCartError(formEl, {
                                error: (changeResponseBody === null || changeResponseBody === void 0 ? void 0 : changeResponseBody.message) || 'Cart change failed',
                                detail: { description: changeResponseBody === null || changeResponseBody === void 0 ? void 0 : changeResponseBody.description, errors: changeResponseBody === null || changeResponseBody === void 0 ? void 0 : changeResponseBody.errors },
                            });
                            // Make a new request to find the actual quantity of the item in the cart since the last request errored presumably due to a stockout. Would be nice if the change request returned the quantity of the item in the cart but it does not.
                            // Note: we re-use the same abort controller to get the current cart so that if the user starts changing the quantity input again, the request will be cancelled
                            const cartRequestResponse = await cartApi.get({ signal: this.$asyncForm.signal });
                            const cartRequestResponseBody = await (cartRequestResponse === null || cartRequestResponse === void 0 ? void 0 : cartRequestResponse.json());
                            const cartItem = findLine(cartRequestResponseBody === null || cartRequestResponseBody === void 0 ? void 0 : cartRequestResponseBody.items, lineKey, line);
                            if (cartItem) {
                                this.__cartItem_quantity = cartItem.quantity;
                            }
                            resolveCartLinesUpdate(deferred, cartRequestResponseBody !== null && cartRequestResponseBody !== void 0 ? cartRequestResponseBody : null, {
                                items: cartRequestResponseBody === null || cartRequestResponseBody === void 0 ? void 0 : cartRequestResponseBody.items,
                                itemCount: cartItem === null || cartItem === void 0 ? void 0 : cartItem.quantity,
                                source: 'cart-item',
                                sourceId: formEl.getAttribute('id') || undefined,
                                didError: true,
                            });
                        }
                        else if ((changeResponse === null || changeResponse === void 0 ? void 0 : changeResponse.status) === 200) {
                            // Find the item in the cart change response and update the quantity input to the quantity of the item in the cart
                            const changeResponseBody = await ((_b = changeResponse === null || changeResponse === void 0 ? void 0 : changeResponse.clone()) === null || _b === void 0 ? void 0 : _b.json().catch(() => null));
                            const cartItem = findLine(changeResponseBody === null || changeResponseBody === void 0 ? void 0 : changeResponseBody.items, lineKey, line);
                            if (cartItem) {
                                this.__cartItem_quantity = cartItem.quantity;
                            }
                            // change.js returns the full cart, so the event resolves without another request
                            resolveCartLinesUpdate(deferred, changeResponseBody !== null && changeResponseBody !== void 0 ? changeResponseBody : null, {
                                sections: changeResponseBody === null || changeResponseBody === void 0 ? void 0 : changeResponseBody.sections,
                                items: changeResponseBody === null || changeResponseBody === void 0 ? void 0 : changeResponseBody.items,
                                itemCount: quantity,
                                source: 'cart-item',
                                sourceId: formEl.getAttribute('id') || undefined,
                                didError: false,
                            });
                        }
                        else {
                            const changeResponseBody = await ((_c = changeResponse === null || changeResponse === void 0 ? void 0 : changeResponse.clone()) === null || _c === void 0 ? void 0 : _c.json().catch(() => null));
                            dispatchCartError(formEl, {
                                error: (changeResponseBody === null || changeResponseBody === void 0 ? void 0 : changeResponseBody.message) || (changeResponse === null || changeResponse === void 0 ? void 0 : changeResponse.statusText) || 'Cart change failed',
                                detail: { description: changeResponseBody === null || changeResponseBody === void 0 ? void 0 : changeResponseBody.description, errors: changeResponseBody === null || changeResponseBody === void 0 ? void 0 : changeResponseBody.errors },
                            });
                            resolveCartLinesUpdate(deferred, null, {
                                itemCount: quantity,
                                source: 'cart-item',
                                sourceId: formEl.getAttribute('id') || undefined,
                                didError: true,
                            });
                        }
                        return changeRequest;
                    }
                    catch (error) {
                        failCartRequest(formEl, deferred, error);
                        throw error;
                    }
                },
            };
        },
        [`x-async-form${xFormModifiers ? `.${xFormModifiers}` : ``}`]: '__cartItem_save',
    });
}
// The response lists the whole cart. The key finds this line wherever it now
// sits, and a removed line is absent. Without a key the line number is the
// only handle, and after a removal it points at the next line.
function findLine(items, lineKey, line) {
    if (!items)
        return undefined;
    if (lineKey)
        return items.find((item) => item.key === lineKey);
    return items[line - 1];
}
