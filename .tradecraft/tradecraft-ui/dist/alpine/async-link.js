import { StateMachine } from '../utils/state-machine';
import { isAnchorElement } from '../utils';
import { shouldProcessLinkClick } from '../utils/dom';
import { yieldToMain } from '../utils/yield-to-main';
/**
 * A plugin that makes it easy to progressively enhance links so that they can be
 * call endpoints via the fetch API and display pending states
 * while the request is in progress
 *
 * The x-async-link expects a either a promise or a function that returns a promise.
 *
 * @example
 *
 * <a
 *   href="/some-page"
 *   x-async-link="fetchSomeData"
 *   :class="{ 'opacity-50': $asyncLink.state == 'pending' }"
 * >Click Me</a>
 *
 * @example
 *
 * <div x-async-link:context="fetch(`${$url}.js`)">
 *   <div x-show="$asyncLink.state == 'pending'">Loading!</div>
 *   <a href="/some-page" x-async-link:link >Click Me</a>
 * </div>
 *
 * Dispatches `link:pending` when a request starts and `link:loaded` when it succeeds,
 * each with the pending href as the event detail. Dispatches `link:error` with the
 * href, message, and description when a request fails. Dispatches `link:aborted`
 * with the pending href when a request is aborted.
 */
export default function (Alpine) {
    Alpine.directive('async-link', ($el, data, { evaluateLater }) => {
        if (data.value == 'link') {
            if (!isAnchorElement($el)) {
                throw new Error('x-async-link:link directive can only be used on anchor elements');
            }
            Alpine.bind($el, {
                'x-data'() {
                    return {
                        async __asyncLink_onClick(e) {
                            if (!shouldProcessLinkClick(e, $el.target))
                                return;
                            // If some other function has already prevented the default action, do nothing
                            if (e.defaultPrevented)
                                return;
                            // If the link is not an anchor tag, do nothing
                            if (!this.$el.href)
                                return;
                            e.preventDefault();
                            this.__asyncLink_load(this.$el.href);
                        },
                        init() {
                            if (this.__asyncLink_state == undefined) {
                                throw new Error('x-async-link:link directive must be used within an x-async-link:context directive');
                            }
                        },
                    };
                },
                '@click': '__asyncLink_onClick',
            });
        }
        else if (data.value == 'context') {
            if (!data.expression) {
                throw new Error('x-async-link:context directive requires a an async callback function');
            }
            let getCallbackFn = evaluateLater(data.expression);
            Alpine.bind($el, {
                'x-data'() {
                    return {
                        __asyncLink_pendingHref: null,
                        __asyncLink_stateMachine: new StateMachine('idle', ['idle', 'pending'], {
                            idle: ['pending'],
                            pending: ['pending', 'idle'],
                        }),
                        __asyncLink_callback: null,
                        __asyncLink_errorMessage: null,
                        __asyncLink_errorDescription: null,
                        init() {
                            Alpine.effect(() => {
                                // Create a function which wraps the passed in callback function / expression and allows us to call it when the user clicks the link
                                this.__asyncLink_callback = async (href) => {
                                    let callback;
                                    Alpine.dontAutoEvaluateFunctions(() => {
                                        getCallbackFn((result) => {
                                            callback = result;
                                        }, {
                                            params: [href],
                                            scope: { $href: href },
                                        });
                                    });
                                    if (typeof callback !== 'function') {
                                        throw new Error(`x-async-link expects an async function as its expression`);
                                    }
                                    return callback.call(this, href);
                                };
                            });
                        },
                        get __asyncLink_state() {
                            return this.__asyncLink_stateMachine.state;
                        },
                        get __asyncLink_prevState() {
                            return this.__asyncLink_stateMachine.prevState;
                        },
                        set __asyncLink_state(state) {
                            this.__asyncLink_stateMachine.state = state;
                        },
                        async __asyncLink_load(href) {
                            this.__asyncLink_state = 'pending';
                            this.__asyncLink_pendingHref = href;
                            this.$dispatch('link:pending', this.__asyncLink_pendingHref);
                            // Yield to main thread to prevent long task
                            await yieldToMain();
                            try {
                                // Run provided callback function
                                const response = await this.__asyncLink_callback.bind(this)(href);
                                if (!response || (response === null || response === void 0 ? void 0 : response.status) == undefined) {
                                    // Handle the response object not being a fetch request
                                    this.__asyncLink_handleSuccess();
                                    return response;
                                }
                                else if (response.status === 200) {
                                    this.__asyncLink_handleSuccess();
                                    return response;
                                }
                                else if (response.status === 422) {
                                    const body = await response.json();
                                    this.__asyncLink_handleError(body.message, body.description);
                                    return response;
                                }
                                else {
                                    this.__asyncLink_handleError(response.statusText);
                                    return response;
                                }
                            }
                            catch (e) {
                                if (e.name == 'AbortError') {
                                    this.$dispatch('link:aborted', href);
                                    this.__asyncLink_pendingHref = null;
                                    this.__asyncLink_state = 'idle';
                                    return false;
                                }
                                else {
                                    this.__asyncLink_handleError(String((e === null || e === void 0 ? void 0 : e.message) || e));
                                    throw e;
                                }
                            }
                        },
                        async __asyncLink_handleSuccess() {
                            this.$dispatch('link:loaded', this.__asyncLink_pendingHref);
                            this.__asyncLink_state = 'idle';
                            this.__asyncLink_pendingHref = null;
                        },
                        async __asyncLink_handleError(message, description) {
                            this.__asyncLink_state = 'idle';
                            this.__asyncLink_errorMessage = message;
                            this.__asyncLink_errorDescription = description;
                            this.$dispatch('link:error', {
                                href: this.__asyncLink_pendingHref,
                                message,
                                description,
                            });
                            this.__asyncLink_pendingHref = null;
                        },
                        __asyncLink_reset() {
                            this.__asyncLink_state = 'idle';
                            this.__asyncLink_errorMessage = null;
                            this.__asyncLink_errorDescription = null;
                            this.__asyncLink_pendingHref = null;
                        },
                    };
                },
            });
        }
        else {
            if (!data.expression) {
                throw new Error('x-async-link directive requires a an async callback function');
            }
            if (!isAnchorElement($el)) {
                throw new Error('x-async-link directive can only be used on anchor elements');
            }
            Alpine.bind($el, {
                'x-async-link:context': data.expression,
                [`x-async-link:link.${data.modifiers.join('.')}`]: '',
            });
        }
    }).before('bind');
    Alpine.magic('asyncLink', ($el) => {
        const $data = Alpine.$data($el);
        return {
            get pendingHref() {
                return $data.__asyncLink_pendingHref;
            },
            get state() {
                return $data.__asyncLink_state;
            },
            get reset() {
                return $data.__asyncLink_reset();
            },
            get errorMessage() {
                return $data.__asyncLink_errorMessage;
            },
            get errorDescription() {
                return $data.__asyncLink_errorDescription;
            },
        };
    });
}
