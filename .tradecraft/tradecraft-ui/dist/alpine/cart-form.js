import { CartNoteUpdateEvent } from '@shopify/events';
import { handleAsyncFormMagic } from './async-form';
import { beginCartLinesUpdate, dispatchCartError, getCartApiSections, isAbort, isFormElement, resolveCartLinesUpdate, submitFormData, } from '../utils';
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
export default function (Alpine) {
    Alpine.directive('cart-form', ($el, data, utilities) => {
        var _a, _b;
        if (data.value == 'form') {
            handleForm($el, Alpine, data, utilities);
        }
        else if (data.value == 'context') {
            handleContext($el, Alpine, data, utilities);
        }
        else {
            const xFormModifiers = data.modifiers.length ? data.modifiers.join('.') : null;
            if (!((_b = (_a = window === null || window === void 0 ? void 0 : window.theme) === null || _a === void 0 ? void 0 : _a.routes) === null || _b === void 0 ? void 0 : _b.cartUpdate)) {
                throw new Error('window.theme.routes.cartUpdate is not defined');
            }
            if (!isFormElement($el)) {
                // Handle the case of x-async-form being applied to a parent of a form element
                // In this case we look for a form element child and apply form directive to that
                Alpine.bind($el, {
                    [`x-cart-form:context${xFormModifiers ? `.${xFormModifiers}` : ``}`]: '',
                });
                const form = $el.querySelector('form');
                if (form) {
                    Alpine.bind(form, {
                        [`x-cart-form:form`]: '',
                    });
                }
            }
            else {
                Alpine.bind($el, {
                    [`x-cart-form:context${xFormModifiers ? `.${xFormModifiers}` : ``}`]: '',
                    [`x-cart-form:form`]: '',
                });
            }
        }
    }).before('bind');
    Alpine.magic('cartForm', handleAsyncFormMagic(Alpine));
}
function handleForm($el, Alpine, data, _utilities) {
    Alpine.bind($el, {
        method: 'POST',
    });
}
function handleContext($el, Alpine, data, _utilities) {
    const xFormModifiers = data.modifiers.length ? data.modifiers.join('.') : null;
    Alpine.bind($el, {
        'x-data'() {
            return {
                async __cartForm_save(data) {
                    var _a, _b, _c, _d, _e, _f;
                    // Gather up all the sections marked with data-cart-api-section and add them in the 'sections' form data parameter
                    (_a = data.formData) === null || _a === void 0 ? void 0 : _a.append('sections', getCartApiSections().join(','));
                    data.action = `${window.theme.routes.cartUpdate}.js`;
                    const formEl = (this.__asyncForm_formEl || this.$el);
                    const note = (_b = data.formData) === null || _b === void 0 ? void 0 : _b.get('note');
                    // update.js accepts updates[]=n positionally or updates[<key>]=n keyed by
                    // line key or variant id. Positional entries have no key, so their id is empty.
                    const updates = [];
                    for (const [name, value] of (_d = (_c = data.formData) === null || _c === void 0 ? void 0 : _c.entries()) !== null && _d !== void 0 ? _d : []) {
                        const match = name.match(/^updates\[(.*)\]$/);
                        if (match) {
                            updates.push({ id: match[1], quantity: Number(value) });
                        }
                    }
                    // The note, removals, and quantity changes each get their own standard
                    // event; one form can carry all of them
                    let noteDeferred = null;
                    const noteField = isFormElement(formEl) ? formEl.elements.namedItem('note') : null;
                    // defaultValue holds the server-rendered note, so an untouched note
                    // field does not announce a note update on every submit
                    if (note != null && note !== ((_e = noteField === null || noteField === void 0 ? void 0 : noteField.defaultValue) !== null && _e !== void 0 ? _e : null)) {
                        noteDeferred = CartNoteUpdateEvent.createPromise();
                        formEl.dispatchEvent(new CartNoteUpdateEvent({ context: 'cart', note: String(note), promise: noteDeferred.promise }));
                    }
                    // Quantity 0 removes the line, so zeroed lines report as a removal
                    const removals = updates.filter((line) => line.quantity === 0);
                    const changes = updates.filter((line) => line.quantity > 0);
                    let removeDeferred = null;
                    if (removals.length) {
                        removeDeferred = beginCartLinesUpdate(formEl, {
                            action: 'remove',
                            context: 'cart',
                            lines: removals,
                        });
                    }
                    let linesDeferred = null;
                    if (changes.length) {
                        linesDeferred = beginCartLinesUpdate(formEl, {
                            action: 'update',
                            context: 'cart',
                            lines: changes,
                        });
                    }
                    try {
                        const response = await submitFormData(data);
                        const responseBody = await ((_f = response === null || response === void 0 ? void 0 : response.clone()) === null || _f === void 0 ? void 0 : _f.json().catch(() => null));
                        // Status 200 exactly, to match how x-async-form classifies form:success
                        if ((response === null || response === void 0 ? void 0 : response.status) === 200) {
                            // update.js returns the full cart
                            const detail = {
                                sections: responseBody === null || responseBody === void 0 ? void 0 : responseBody.sections,
                                source: 'cart-form',
                                sourceId: formEl.getAttribute('id') || undefined,
                                didError: false,
                            };
                            // The cart summary is best-effort. A body that is not a full ajax
                            // cart must not break the save flow, so fall back to null.
                            let noteCart = null;
                            try {
                                noteCart = responseBody ? CartNoteUpdateEvent.createCartFromAjaxResponse(responseBody) : null;
                            }
                            catch (error) {
                                console.warn('[cart-form] Could not build a cart summary from the response:', error);
                            }
                            // After a save the server-rendered note is the submitted one
                            if (noteField && note != null) {
                                noteField.defaultValue = String(note);
                            }
                            noteDeferred === null || noteDeferred === void 0 ? void 0 : noteDeferred.resolve({ cart: noteCart, detail });
                            if (removeDeferred) {
                                resolveCartLinesUpdate(removeDeferred, responseBody !== null && responseBody !== void 0 ? responseBody : null, Object.assign(Object.assign({}, detail), { items: responseBody === null || responseBody === void 0 ? void 0 : responseBody.items }));
                            }
                            if (linesDeferred) {
                                resolveCartLinesUpdate(linesDeferred, responseBody !== null && responseBody !== void 0 ? responseBody : null, Object.assign(Object.assign({}, detail), { items: responseBody === null || responseBody === void 0 ? void 0 : responseBody.items }));
                            }
                        }
                        else {
                            dispatchCartError(formEl, {
                                error: (responseBody === null || responseBody === void 0 ? void 0 : responseBody.message) || (response === null || response === void 0 ? void 0 : response.statusText) || 'Cart update failed',
                                detail: { description: responseBody === null || responseBody === void 0 ? void 0 : responseBody.description, errors: responseBody === null || responseBody === void 0 ? void 0 : responseBody.errors },
                            });
                            const detail = { source: 'cart-form', sourceId: formEl.getAttribute('id') || undefined, didError: true };
                            noteDeferred === null || noteDeferred === void 0 ? void 0 : noteDeferred.resolve({ cart: null, detail });
                            if (removeDeferred) {
                                resolveCartLinesUpdate(removeDeferred, null, detail);
                            }
                            if (linesDeferred) {
                                resolveCartLinesUpdate(linesDeferred, null, detail);
                            }
                        }
                        // Return the response so x-async-form still classifies form:success / form:error
                        return response;
                    }
                    catch (error) {
                        // The promises always resolve - didError plus aborted when the theme
                        // cancelled the request itself - so listeners settle without a try/catch
                        const detail = {
                            source: 'cart-form',
                            sourceId: formEl.getAttribute('id') || undefined,
                            didError: true,
                            aborted: isAbort(error),
                        };
                        noteDeferred === null || noteDeferred === void 0 ? void 0 : noteDeferred.resolve({ cart: null, detail });
                        if (removeDeferred) {
                            resolveCartLinesUpdate(removeDeferred, null, detail);
                        }
                        if (linesDeferred) {
                            resolveCartLinesUpdate(linesDeferred, null, detail);
                        }
                        if (!isAbort(error)) {
                            dispatchCartError(formEl, {
                                error: (error === null || error === void 0 ? void 0 : error.message) || 'Cart request failed',
                                code: 'SERVICE_UNAVAILABLE',
                            });
                        }
                        throw error;
                    }
                },
            };
        },
        [`x-async-form${xFormModifiers ? `.${xFormModifiers}` : ``}`]: '__cartForm_save',
    });
}
