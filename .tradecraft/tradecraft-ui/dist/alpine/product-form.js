import { handleAsyncFormMagic } from './async-form';
import { beginCartLinesUpdate, dispatchCartError, failCartRequest, getCartApiSections, isFormElement, resolveCartLinesUpdate, submitFormData, } from '../utils';
import * as cartApi from '../api/cart';
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
export default function (Alpine) {
    Alpine.directive('product-form', ($el, data, utilities) => {
        if (data.value == 'form') {
            handleForm($el, Alpine, data, utilities);
        }
        else if (data.value == 'context') {
            handleContext($el, Alpine, data, utilities);
        }
        else if (data.value == null) {
            handleRoot($el, Alpine, data, utilities);
        }
        else {
            throw new Error(`Unknown directive: x-product-form:${data.value}`);
        }
    }).before('bind');
    Alpine.magic('productForm', handleAsyncFormMagic(Alpine));
}
function handleForm($el, Alpine, data, utilities) {
    Alpine.bind($el, {
        method: 'POST',
    });
}
function handleContext($el, Alpine, data, _utilities) {
    const xFormModifiers = data.modifiers.length ? data.modifiers.join('.') : null;
    Alpine.bind($el, {
        'x-data'() {
            return {
                quantity: 1,
                variantId: null,
                async __productForm_save(data) {
                    var _a, _b, _c, _d, _e;
                    // Gather up all the sections marked with data-cart-api-section and add them in the 'sections' form data parameter
                    (_a = data.formData) === null || _a === void 0 ? void 0 : _a.append('sections', getCartApiSections().join(','));
                    data.action = `${window.theme.routes.cartAdd}.js`;
                    const formEl = (this.__asyncForm_formEl || this.$el);
                    const itemCount = Number((_b = data.formData) === null || _b === void 0 ? void 0 : _b.get('quantity')) || 1;
                    const deferred = beginCartLinesUpdate(formEl, {
                        action: 'add',
                        context: 'product',
                        lines: [{ merchandiseId: String((_d = (_c = data.formData) === null || _c === void 0 ? void 0 : _c.get('id')) !== null && _d !== void 0 ? _d : ''), quantity: itemCount }],
                    });
                    try {
                        const response = await submitFormData(data);
                        const responseBody = await ((_e = response === null || response === void 0 ? void 0 : response.clone()) === null || _e === void 0 ? void 0 : _e.json().catch(() => null));
                        // Status 200 exactly, to match how x-async-form classifies form:success
                        if ((response === null || response === void 0 ? void 0 : response.status) === 200) {
                            const detail = {
                                sections: responseBody === null || responseBody === void 0 ? void 0 : responseBody.sections,
                                item: responseBody,
                                itemCount,
                                source: 'product-form',
                                sourceId: formEl.getAttribute('id') || undefined,
                                didError: false,
                            };
                            // add.js returns only the added line, not the cart. Fetch the cart in the
                            // background so the event resolves with real totals. The add itself
                            // succeeded, so a failed refresh still resolves — just without a cart.
                            Promise.resolve()
                                .then(() => cartApi.get({ signal: this.$asyncForm.signal }))
                                .then((cartResponse) => cartResponse === null || cartResponse === void 0 ? void 0 : cartResponse.json())
                                .then((ajaxCart) => resolveCartLinesUpdate(deferred, ajaxCart !== null && ajaxCart !== void 0 ? ajaxCart : null, Object.assign(Object.assign({}, detail), { items: ajaxCart === null || ajaxCart === void 0 ? void 0 : ajaxCart.items })))
                                .catch(() => resolveCartLinesUpdate(deferred, null, detail));
                        }
                        else {
                            dispatchCartError(formEl, {
                                error: (responseBody === null || responseBody === void 0 ? void 0 : responseBody.message) || (response === null || response === void 0 ? void 0 : response.statusText) || 'Add to cart failed',
                                detail: { description: responseBody === null || responseBody === void 0 ? void 0 : responseBody.description, errors: responseBody === null || responseBody === void 0 ? void 0 : responseBody.errors },
                            });
                            resolveCartLinesUpdate(deferred, null, {
                                itemCount,
                                source: 'product-form',
                                sourceId: formEl.getAttribute('id') || undefined,
                                didError: true,
                            });
                        }
                        // Return the response so x-async-form still classifies form:success / form:error
                        return response;
                    }
                    catch (error) {
                        failCartRequest(formEl, deferred, error);
                        throw error;
                    }
                },
            };
        },
        [`x-async-form${xFormModifiers ? `.${xFormModifiers}` : ``}`]: '__productForm_save',
    });
}
function handleRoot($el, Alpine, data, _utilities) {
    var _a, _b;
    const xFormModifiers = data.modifiers.length ? data.modifiers.join('.') : null;
    if (!((_b = (_a = window === null || window === void 0 ? void 0 : window.theme) === null || _a === void 0 ? void 0 : _a.routes) === null || _b === void 0 ? void 0 : _b.cartAdd)) {
        throw new Error('window.theme.routes.cartAdd is not defined');
    }
    if (isFormElement($el)) {
        // If $el is a form element, apply the context and form directives to it directly
        Alpine.bind($el, {
            [`x-product-form:context${xFormModifiers ? `.${xFormModifiers}` : ``}`]: '',
            [`x-product-form:form`]: '',
        });
    }
    else {
        // If $el is not a form element, apply the context directive to it and look for a form element child to apply the form directive to
        Alpine.bind($el, {
            [`x-product-form:context${xFormModifiers ? `.${xFormModifiers}` : ``}`]: '',
        });
        const form = $el.querySelector('form');
        if (form) {
            Alpine.bind(form, {
                [`x-product-form:form`]: '',
            });
        }
    }
}
