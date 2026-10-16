import { AlpineComponent, Alpine as AlpineType } from 'alpinejs';
import { StateMachine } from '../utils/state-machine';
import { ArrayToUnion } from '../types/utils';
import { FormDataSubmissionInfo } from '../utils/dom';
export type AsyncFormRequestState = ['idle', 'pending', 'success', 'error'];
export type AsyncFormStateMachine = StateMachine<AsyncFormRequestState>;
export type AsyncFormSubmitCallback = (info?: FormDataSubmissionInfo) => Promise<Response | null | undefined>;
export type AsyncFormConfigCallback = (info?: FormDataSubmissionInfo) => Partial<FormDataSubmissionInfo>;
export type AsyncFormMagic = {
    formData: FormData | null;
    state: ArrayToUnion<AsyncFormRequestState>;
    response: Response | string | undefined;
    parsedBody: Record<string, any> | string | undefined;
    reset(): void;
    submitAsync: (info: FormDataSubmissionInfo) => Promise<void | Response | null>;
    errorMessage: string | null;
    errorDescription: any;
    signal: AbortSignal | null;
};
export type AsyncFormComponent = AlpineComponent<{
    __asyncForm_formEl: HTMLFormElement | null;
    /**
     * The state machine for the component
     */
    __asyncForm_stateMachine: AsyncFormStateMachine;
    /**
     * The current state of the component
     */
    __asyncForm_state: ArrayToUnion<AsyncFormRequestState>;
    /**
     * The form data of the last submission
     */
    __asyncForm_formData: FormData | null;
    /**
     * The raw response from the async callback for the last submission
     */
    __asyncForm_response: any | null;
    /**
     * Result of attempting to call .json() or .text() on the last response
     */
    __asyncForm_parsedBody: any;
    /**
     * Timeout in milliseconds to wait before transitioning back to the initial state after a successful add to cart
     */
    __asyncForm_successTimeout: number | false;
    /**
     * Timeout in milliseconds to wait before transitioning back to the initial state after a error adding to cart
     */
    __asyncForm_errorTimeout: number | false;
    /**
     * Error message from previous submission attempt. This maps to body.message when a 422 response occurs
     */
    __asyncForm_errorMessage: string | null;
    /**
     * Error description from previous submission attempt. This maps to body.description when a 422 response occurs
     */
    __asyncForm_errorDescription: any;
    __asyncForm_form: HTMLFormElement | null;
    __asyncForm_callback: ((info?: FormDataSubmissionInfo) => Promise<any> | FormDataSubmissionInfo) | null;
    __asyncForm_abortController: AbortController | null;
    __asyncForm_handleResponse(response: Response | undefined | null): Promise<Response | undefined | null>;
    __asyncForm_handleSuccess(): void;
    __asyncForm_handleError(message: string, description?: string | undefined): void;
    __asyncForm_reset(): void;
    __asyncForm_submitAsync(info?: FormDataSubmissionInfo): Promise<void | Response | null>;
}>;
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
export default function (Alpine: AlpineType): void;
export declare function handleAsyncFormMagic(Alpine: AlpineType): ($el: HTMLElement) => AsyncFormMagic;
