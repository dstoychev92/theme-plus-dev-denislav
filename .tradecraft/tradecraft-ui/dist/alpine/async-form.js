import { StateMachine } from '../utils/state-machine';
import { isAbort, isFormElement, isPlainObject } from '../utils';
import { getFormSubmissionInfo, submitFormData } from '../utils/dom';
import { yieldToMain } from '../utils/yield-to-main';
import { getMillisecondsModifierValue } from '../utils/modifiers';
/**
 * Creates forms that work with or without JavaScript - traditional form submission when JS is disabled,
 * enhanced async submission when JS is available. Handles form states, errors, request cancellation,
 * and prevents full page reloads for better user experience.
 *
 * Usage:
 * - x-async-form - Applied to the form element, initializing the async form functionality and adding a data context for child directives
 * - x-async-form:context - Defines the context for the async form, allowing sharing of form state with other elements.
 * - x-async-form:form - Binds to the form element to handle form submissions.
 *
 * The '$asyncForm' magic property provides a comprehensive API for managing the form state, including form data, response, parsed body, and error messages.
 *
 * ## Common Usage Scenarios
 *
 * ### Basic product form
 *
 * When JS is disabled, form will submit to the given action URL and the server will handle the success/error.
 * When JS is enabled, form will make a fetch request to the given async-action URL and the async-form plugin will handle the success/pending/error states.
 *
 * ```html
 * <form x-async-form action="/cart" async-action="/cart/add.js" method="POST">
 *   <input type="hidden" name="id" value="123456789">
 *   <select name="quantity">
 *     <option value="1">1</option>
 *     <option value="2">2</option>
 *   </select>
 *
 *   <button type="submit"
 *           :disabled="$asyncForm.state === 'pending'"
 *           :class="{ 'opacity-50': $asyncForm.state === 'pending' }">
 *     <span x-show="$asyncForm.state === 'idle'">Add to Cart</span>
 *     <span x-show="$asyncForm.state === 'pending'">Adding...</span>
 *     <span x-show="$asyncForm.state === 'success'">Added!</span>
 *   </button>
 *
 *   <div x-show="$asyncForm.state === 'error'" class="text-red-500">
 *     <p x-text="$asyncForm.errorMessage"></p>
 *   </div>
 * </form>
 * ```
 *
 * ## Customizing the form submission
 *
 * In more complex scenarios, you may want to customize the form submission. This can be done by passing a function to the x-async-form directive
 * which will be used to submit the form instead just making a fetch request which is the default behavior.
 *
 * For example, if you need to do conditional error checking on the JSON response body:
 *
 * ```html
 * <form
 *   x-data="{
 *     async save(info) {
 *        const response = await fetch('/cart/add.js', { method: 'POST', body: info.formData })
 *
 *        if (response.status === 422) {
 *          const body = await response.json()
 *          if (body.message) {
 *            throw new Error(body.message)
 *          }
 *        }
 *
 *        return response
 *     }
 *   }"
 *  x-async-form="save"
 * >
 *   <input type="text" name="name" value="John Doe">
 *   <button type="submit">Submit</button>
 * </form>
 * ```
 * ## Features
 *
 * - **Request Cancellation**: All fetch requests include an AbortSignal that automatically cancels pending requests when a new submission starts or the component is cleaned up
 * - **State Management**: Tracks form state (idle, pending, success, error) with automatic transitions
 * - **Error Handling**: Parses error responses and provides structured error messages
 * - **Timeout Support**: Configurable timeouts for success and error states
 *
 * ## Modifiers
 *
 * - `wait-success.2000ms` - How long the success state shows before the form returns to idle (default 1000ms)
 * - `wait-error.3000ms` - How long the error state shows before the form returns to idle. Without it the error state stays until the next submission or a reset()
 *
 * ## Events
 *
 * - `form:pending` - Dispatched when the form is pending
 * - `form:success` - Dispatched when the form is successful. Event detail is the parsed body of the response.
 * - `form:error` - Dispatched when the form encounters an error. Event detail is an object with the following properties:
 *   - `message` - The error message
 *   - `description` - The error description
 *
 */
export default function (Alpine) {
    Alpine.directive('async-form', ($el, data, utilities) => {
        if (data.value == 'form') {
            handleForm($el, Alpine, data, utilities);
        }
        else if (data.value == 'context') {
            handleContext($el, Alpine, data, utilities);
        }
        else if (data.value == null) {
            if (!isFormElement($el)) {
                // Handle the case of x-async-form being applied to a parent of a form element
                // In this case we look for a form element child and apply form directive to that
                const form = $el.querySelector('form');
                Alpine.bind($el, {
                    [`x-async-form:context.${data.modifiers.join('.')}`]: data.expression || '',
                });
                if (form) {
                    Alpine.bind(form, {
                        [`x-async-form:form.${data.modifiers.join('.')}`]: '',
                    });
                }
            }
            else {
                Alpine.bind($el, {
                    [`x-async-form:context.${data.modifiers.join('.')}`]: data.expression || '',
                    [`x-async-form:form.${data.modifiers.join('.')}`]: '',
                });
            }
        }
        else {
            throw new Error(`Unknown directive: x-async-form:${data.value}`);
        }
    }).before('bind');
    Alpine.magic('asyncForm', handleAsyncFormMagic(Alpine));
}
export function handleAsyncFormMagic(Alpine) {
    return function ($el) {
        const $data = Alpine.$data($el);
        return {
            get formData() {
                return $data.__asyncForm_formData;
            },
            get state() {
                return $data.__asyncForm_state;
            },
            get response() {
                return $data.__asyncForm_response;
            },
            get parsedBody() {
                return $data.__asyncForm_parsedBody;
            },
            reset() {
                return $data.__asyncForm_reset();
            },
            submitAsync(info) {
                return $data.__asyncForm_submitAsync(info);
            },
            get errorMessage() {
                return $data.__asyncForm_errorMessage;
            },
            get errorDescription() {
                return $data.__asyncForm_errorDescription;
            },
            get signal() {
                var _a;
                return ((_a = $data.__asyncForm_abortController) === null || _a === void 0 ? void 0 : _a.signal) || null;
            },
        };
    };
}
function handleContext($el, Alpine, { expression, modifiers }, { evaluateLater }) {
    let getCallbackFn = expression ? evaluateLater(expression) : null;
    const errorTimeout = getErrorTimeoutModifier(modifiers) || false;
    const successTimeout = getSuccessTimeoutModifier(modifiers) || 1000;
    Alpine.bind($el, {
        'x-data'() {
            return {
                __asyncForm_formEl: null,
                __asyncForm_stateMachine: new StateMachine('idle', ['idle', 'pending', 'success', 'error'], {
                    idle: ['pending'],
                    pending: ['success', 'error', 'pending'],
                    success: ['idle', 'pending'],
                    error: ['idle', 'pending'],
                }),
                __asyncForm_callback: null,
                __asyncForm_abortController: null,
                __asyncForm_formData: null,
                __asyncForm_response: null,
                __asyncForm_parsedBody: null,
                __asyncForm_errorMessage: null,
                __asyncForm_errorDescription: null,
                __asyncForm_successTimeout: successTimeout || false,
                __asyncForm_errorTimeout: errorTimeout || false,
                init() {
                    this.$watch('__asyncForm_state', (state, prevState) => {
                        if ((prevState == 'success' || prevState == 'error') && state == 'idle') {
                            // Wipe form data after a successful or failed submission
                            this.__asyncForm_formData = null;
                        }
                        if (prevState == 'success' && state == 'idle') {
                            // Clear error message after a successful submission
                            this.__asyncForm_errorMessage = null;
                            this.__asyncForm_errorDescription = null;
                        }
                    });
                    Alpine.effect(() => {
                        // Create a function which wraps the passed in callback function / expression and allows us to call it when the user clicks the link
                        this.__asyncForm_callback = (callbackInfo) => {
                            var _a, _b;
                            // If no expression provided, use default fetch behavior
                            if (!getCallbackFn) {
                                const submissionInfo = Object.assign(Object.assign({}, callbackInfo), { action: this.$el.getAttribute('async-action') || (callbackInfo === null || callbackInfo === void 0 ? void 0 : callbackInfo.action) });
                                return submitFormData(submissionInfo, { signal: (_a = this.__asyncForm_abortController) === null || _a === void 0 ? void 0 : _a.signal });
                            }
                            let result;
                            Alpine.dontAutoEvaluateFunctions(() => {
                                getCallbackFn((callbackResult) => {
                                    result = callbackResult;
                                });
                            });
                            if (typeof result === 'function') {
                                const formSubmissionInfoOrPromise = result.bind(this)(callbackInfo);
                                if (formSubmissionInfoOrPromise instanceof Promise) {
                                    return formSubmissionInfoOrPromise;
                                }
                                else if (typeof formSubmissionInfoOrPromise === 'object' && formSubmissionInfoOrPromise !== null) {
                                    const mergedInfo = Object.assign(Object.assign({}, callbackInfo), formSubmissionInfoOrPromise);
                                    return submitFormData(mergedInfo, { signal: (_b = this.__asyncForm_abortController) === null || _b === void 0 ? void 0 : _b.signal });
                                }
                            }
                            else {
                                throw new Error('x-async-form callback must return a Promise, or FormDataSubmissionInfo');
                            }
                            throw new Error('x-async-form callback must return a Promise, partial FormDataSubmissionInfo object, or a function that returns a Promise');
                        };
                    });
                },
                get __asyncForm_state() {
                    return this.__asyncForm_stateMachine.state;
                },
                set __asyncForm_state(state) {
                    this.__asyncForm_stateMachine.state = state;
                },
                get __asyncForm_form() {
                    var _a;
                    let form = null;
                    if (this.$el.tagName === 'FORM') {
                        form = this.$el;
                    }
                    if (this.__asyncForm_formEl && ((_a = this.__asyncForm_formEl) === null || _a === void 0 ? void 0 : _a.tagName) === 'FORM') {
                        form = this.__asyncForm_formEl;
                    }
                    return form;
                },
                async __asyncForm_submitAsync(info) {
                    if (info === null || info === void 0 ? void 0 : info.formData) {
                        this.__asyncForm_formData = info.formData;
                    }
                    this.__asyncForm_state = 'pending';
                    (this.__asyncForm_formEl || this.$el).dispatchEvent(new CustomEvent('form:pending', {
                        bubbles: true,
                        // Allows events to pass the shadow DOM barrier.
                        composed: true,
                        cancelable: true,
                        detail: this.__asyncForm_formData,
                    }));
                    // Yield to main thread to prevent long task
                    await yieldToMain();
                    // Cancel any pending request
                    if (this.__asyncForm_abortController) {
                        this.__asyncForm_abortController.abort('cancelled by user');
                    }
                    // Create new AbortController for this request
                    this.__asyncForm_abortController = new AbortController();
                    try {
                        // Run provided callback function
                        const response = await this.__asyncForm_callback.bind(this)(info);
                        return await this.__asyncForm_handleResponse(response);
                    }
                    catch (e) {
                        if (isAbort(e)) {
                            return null;
                        }
                        else {
                            this.__asyncForm_handleError(String((e === null || e === void 0 ? void 0 : e.message) || e));
                            console.error(e);
                            return Promise.resolve();
                        }
                    }
                },
                async __asyncForm_handleResponse(response) {
                    this.__asyncForm_response = response;
                    this.__asyncForm_parsedBody = await parseResponseBody(response);
                    if (!response || (response === null || response === void 0 ? void 0 : response.status) == undefined) {
                        // Handle the response object not being a fetch request
                        this.__asyncForm_handleSuccess();
                        return response;
                    }
                    else if (response.status === 200) {
                        this.__asyncForm_handleSuccess();
                        return response;
                    }
                    else {
                        let message = getErrorMessage(response, this.__asyncForm_parsedBody);
                        let description = getErrorDescription(this.__asyncForm_parsedBody);
                        this.__asyncForm_handleError(message, description);
                        return response;
                    }
                },
                async __asyncForm_handleSuccess() {
                    (this.__asyncForm_formEl || this.$el).dispatchEvent(new CustomEvent('form:success', {
                        bubbles: true,
                        // Allows events to pass the shadow DOM barrier.
                        composed: true,
                        cancelable: true,
                        detail: this.__asyncForm_parsedBody,
                    }));
                    if (successTimeout) {
                        // Transition to success state then back to initial state after a timeout
                        this.__asyncForm_stateMachine.setTransientState('success', 'idle', successTimeout);
                    }
                    else {
                        this.__asyncForm_state = 'success';
                    }
                },
                async __asyncForm_handleError(message, description) {
                    (this.__asyncForm_formEl || this.$el).dispatchEvent(new CustomEvent('form:error', {
                        bubbles: true,
                        // Allows events to pass the shadow DOM barrier.
                        composed: true,
                        cancelable: true,
                        detail: {
                            message: message,
                            description: description,
                        },
                    }));
                    if (errorTimeout) {
                        // Transition to error state then back to initial state after a timeout
                        this.__asyncForm_stateMachine.setTransientState('error', 'idle', errorTimeout);
                    }
                    else {
                        this.__asyncForm_state = 'error';
                    }
                    this.__asyncForm_errorMessage = message;
                    this.__asyncForm_errorDescription = description;
                },
                __asyncForm_reset() {
                    // Cancel any pending request
                    if (this.__asyncForm_abortController) {
                        this.__asyncForm_abortController.abort('cancelled by user');
                        this.__asyncForm_abortController = null;
                    }
                    this.__asyncForm_state = 'idle';
                    this.__asyncForm_response = null;
                    this.__asyncForm_parsedBody = null;
                    this.__asyncForm_errorMessage = null;
                    this.__asyncForm_errorDescription = null;
                },
            };
        },
    });
}
function handleForm($el, Alpine, { expression }, {}) {
    if (!isFormElement($el)) {
        throw new Error('x-async-form:form directive can only be used on form elements');
    }
    Alpine.bind($el, {
        'x-data'() {
            return {
                __asyncForm_form_onSubmit(e) {
                    // Prevent default form submission behaviour so we dont get a full page reload
                    e.preventDefault();
                    this.__asyncForm_submitAsync(getFormSubmissionInfo($el, e.submitter));
                },
                init() {
                    if (this.__asyncForm_submitAsync == undefined) {
                        throw new Error('x-async-form:form directive must be used within an x-async-form:context directive');
                    }
                },
            };
        },
        'x-init'() {
            if (this.__asyncForm_submitAsync == undefined)
                return;
            this.__asyncForm_formEl = this.$el;
        },
        '@submit': '__asyncForm_form_onSubmit',
    });
}
function getErrorTimeoutModifier(modifiers) {
    return getMillisecondsModifierValue(modifiers, 'wait-error') || false;
}
function getSuccessTimeoutModifier(modifiers) {
    return getMillisecondsModifierValue(modifiers, 'wait-success') || false;
}
async function parseResponseBody(response) {
    var _a;
    if (!response)
        return null;
    // Bail out if the response is not similar to a standard fetch Response object
    if (!isPlainObject(response) || !('json' in response)) {
        return null;
    }
    // Note: we clone the response here in case the body has already been read
    if ((_a = response.headers.get('Content-Type')) === null || _a === void 0 ? void 0 : _a.includes('text/html')) {
        return await response.clone().text();
    }
    else {
        // Try to parse the body as json, if it fails, return the original response
        try {
            return await response.clone().json();
        }
        catch (e) {
            return await response.clone().text();
        }
    }
}
function getErrorMessage(response, parsedBody) {
    if (isPlainObject(parsedBody) && parsedBody.message) {
        return parsedBody.message;
    }
    return response.statusText;
}
function getErrorDescription(parsedBody) {
    if (isPlainObject(parsedBody)) {
        if (parsedBody.description) {
            if (isPlainObject(parsedBody.description)) {
                return flattenFieldMessages(parsedBody.description);
            }
            return parsedBody.description;
        }
        if (parsedBody.error) {
            return parsedBody.error.toString();
        }
        if (parsedBody.errors) {
            if (isPlainObject(parsedBody.errors)) {
                return flattenFieldMessages(parsedBody.errors);
            }
            // Shopify also returns errors as a string or an array of strings
            return [parsedBody.errors].flat().join(', ');
        }
    }
    return null;
}
// Keep field keys so {email: ["is invalid"]} flattens to "Email is invalid" —
// but never the raw snake_case key, and never doubled when Shopify's message
// already leads with the field name ({send_on: ["Send on must be within 90
// days from now"]} must not become "send_on Send on must be...").
function flattenFieldMessages(fields) {
    return Object.entries(fields)
        .filter(([, messages]) => messages !== undefined && messages !== null)
        .map(([field, messages]) => {
        const message = [messages].flat().join(', ');
        const label = humanizeFieldKey(field);
        if (message.toLowerCase().startsWith(label.toLowerCase()))
            return message;
        return `${label} ${message}`;
    })
        .join(', ');
}
function humanizeFieldKey(field) {
    const label = field.replace(/_/g, ' ');
    return label.charAt(0).toUpperCase() + label.slice(1);
}
