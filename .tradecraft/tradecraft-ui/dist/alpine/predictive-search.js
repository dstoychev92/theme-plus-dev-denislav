import { predictiveSearch } from '../api/predictive-search';
import { prettyPrintError, warnMissingParentDirective } from '../utils/error';
import { dispatchSearchUpdate } from '../utils/storefront-events';
import { yieldToMain } from '../utils/yield-to-main';
const CANCEL_REQUEST_REASON = 'Cancel request';
/**
 * Plugin to add integration with Shopify's predictive search API (GET /{locale}/search/suggest).
 *
 * Usage:
 *
 * - x-predictive-search='your-result-section' - Applied to the root element of the predictive search, initializing the predictive search functionality and adding a data context for child directives. Pass the id of the search results section as the expression.
 * - x-predictive-search:form - Specifies the form element that contains the search input. The data from this form element will be sent to the predictive search API using FormData
 * - x-predictive-search:input - Specifies the input element that will be used to search. When input value changes, the predictive search will be triggered.
 * - x-predictive-search:results - Specifies the element that will contain the search results. The inner HTML of this element will be replaced with the search results
 * - x-predictive-search:options - Specifies the element that will contain the search options
 * - x-predictive-search:option - Specifies the element that will be used to render a search option
 *
 * Accessibility is baked in: the input becomes a combobox (role="combobox",
 * aria-autocomplete="list", aria-controls / aria-owns wired to the results and options
 * elements), the options element becomes a listbox with roving tabindex, and each option
 * gets role="option". Arrow down on the input focuses the first option and arrow up the
 * last. Input is debounced 350ms before it searches, and clearing the query resets the
 * results.
 *
 * ## Events
 * - `shopify:search:update` - Standard storefront event, dispatched from the root element after results render.
 *   Carries the query; the result count is the number of rendered product options (option elements linking to a product),
 *   so it is capped by how many results the dropdown requests.
 *
 * @example
 *
 * ## Your search form:
 *
 * ```html
 * <div x-data x-predictive-search="some-search-results-section">
 *   <form action="{{ routes.search_url }}" x-predictive-search:form>
 *     <input type="hidden" name="resources[type]" value="product" />
 *     <input type="hidden" name="resources[options][unavailable_products]" value="hide" />
 *     <input x-predictive-search:input type="search" placeholder="Search" />
 *     <button type="submit">Search</button>
 *   </form>
 *   <div x-show="$predictiveSearch.state == 'success'" x-predictive-search:results>
 *   </div>
 * </div>
 * ```
 *
 * ## Your search results section (some-search-results-section):
 *
 * <ul x-predictive-search:options>
 *   {% assign product_results = predictive_search.resources.products %}
 *   {% for result in product_results %}
 *     <li role="presentation">
 *       <a x-predictive-search:option href="{{ result.url }}">{{ result.title }}</a>
 *     </li>
 *   {% endfor %}
 * </ul>
 *
 */
// TODO refactor this to use x-async-form
export default function (Alpine) {
    Alpine.directive('predictive-search', ($el, data) => {
        if (data.value === 'form') {
            handleForm($el, Alpine);
        }
        else if (data.value === 'input') {
            handleInput($el, Alpine);
        }
        else if (data.value === 'results') {
            handleResults($el, Alpine);
        }
        else if (data.value === 'options') {
            handleOptions($el, Alpine);
        }
        else if (data.value === 'option') {
            handleOption($el, Alpine);
        }
        else if (data.value === null) {
            handleRoot($el, Alpine, data);
        }
        else {
            throw new Error(`Unknown directive: x-predictive-search:${data.value}`);
        }
    }).before('bind');
    Alpine.magic('predictiveSearch', ($el) => {
        const $data = Alpine.$data($el);
        return {
            get state() {
                return $data === null || $data === void 0 ? void 0 : $data.__predictiveSearch_state;
            },
            get error() {
                return $data === null || $data === void 0 ? void 0 : $data.__predictiveSearch_error;
            },
            set query(query) {
                if (!$data)
                    return;
                $data.__predictiveSearch_query = query;
            },
            get query() {
                return $data === null || $data === void 0 ? void 0 : $data.__predictiveSearch_query;
            },
            get resultHtml() {
                return $data === null || $data === void 0 ? void 0 : $data.__predictiveSearch_resultHtml;
            },
            search() {
                if (!$data)
                    return Promise.resolve(null);
                return $data.__predictiveSearch_search();
            },
            reset() {
                if (!$data)
                    return;
                return $data.__predictiveSearch_reset();
            },
        };
    });
}
function handleForm($el, Alpine) {
    Alpine.bind($el, {
        'x-init'() {
            if (!this.__predictiveSearch_isRoot) {
                warnMissingParentDirective('x-predictive-search:form', 'x-predictive-search', $el);
                return;
            }
            this.__predictiveSearch_formEl = $el;
        },
        '@submit'() {
            var _a, _b;
            // Cancel any pending requests when form is submitted since they wont be shown
            (_b = (_a = this).__predictiveSearch_abort) === null || _b === void 0 ? void 0 : _b.call(_a);
        },
    });
}
function handleInput($el, Alpine) {
    Alpine.bind($el, {
        ':id': '$id("predictive-search-input")',
        'x-init'() {
            if (!this.__predictiveSearch_isRoot) {
                warnMissingParentDirective('x-predictive-search:input', 'x-predictive-search', $el);
                return;
            }
            this.__predictiveSearch_inputEl = $el;
        },
        ':aria-controls': '$id("predictive-search-results")',
        ':aria-owns': '$id("predictive-search-options")',
        'aria-autocomplete': 'list',
        'x-model.fill': '__predictiveSearch_query',
        '@input.debounce.350ms': '__predictiveSearch_search()',
        autocomplete: 'off',
        role: 'combobox',
        '@keydown.down.prevent.stop': '$rovingTab.focusFirst()',
        '@keydown.up.prevent.stop': '$rovingTab.focusLast()',
    });
}
function handleResults($el, Alpine) {
    Alpine.bind($el, {
        ':id': '$id("predictive-search-results")',
        'x-html': '__predictiveSearch_resultHtml',
        'x-init'() {
            if (!this.__predictiveSearch_isRoot) {
                warnMissingParentDirective('x-predictive-search:results', 'x-predictive-search', $el);
            }
            this.__predictiveSearch_resultsEl = $el;
        },
    });
}
function handleOptions($el, Alpine) {
    Alpine.bind($el, {
        ':id': '$id("predictive-search-options")',
        'x-roving-tab:list': '',
        role: 'listbox',
        'x-init'() {
            if (!this.__predictiveSearch_isRoot) {
                warnMissingParentDirective('x-predictive-search:options', 'x-predictive-search', $el);
                return;
            }
            this.__predictiveSearch_optionsEl = $el;
        },
    });
}
function handleOption($el, Alpine) {
    Alpine.bind($el, {
        role: 'option',
    });
}
function handleRoot($el, Alpine, data) {
    const resultSectionId = data.expression;
    if (!resultSectionId) {
        throw new Error('predictive search results section id must be passed to x-predictive-search');
    }
    Alpine.bind($el, {
        'x-id': '["predictive-search-results", "predictive-search-options", "predictive-search-input"]',
        'x-roving-tab.vertical.nowrap': '',
        // Wipe search results when the query is cleared
        'x-effect'() {
            if (this.__predictiveSearch_query === '') {
                this.__predictiveSearch_reset();
            }
        },
        ['x-data']() {
            return {
                __predictiveSearch_isRoot: true,
                __predictiveSearch_formEl: null,
                __predictiveSearch_inputEl: null,
                __predictiveSearch_resultsEl: null,
                __predictiveSearch_optionsEl: null,
                __predictiveSearch_resultSectionId: resultSectionId,
                __predictiveSearch_query: '',
                __predictiveSearch_resultHtml: null,
                __predictiveSearch_state: 'idle',
                __predictiveSearch_error: null,
                __predictiveSearch_abortController: null,
                __predictiveSearch_abort() {
                    var _a;
                    // Abort any existing requests
                    (_a = this.__predictiveSearch_abortController) === null || _a === void 0 ? void 0 : _a.abort(CANCEL_REQUEST_REASON);
                },
                __predictiveSearch_reset() {
                    this.__predictiveSearch_query = '';
                    this.__predictiveSearch_state = 'idle';
                    this.__predictiveSearch_resultHtml = null;
                    this.__predictiveSearch_abort();
                },
                async __predictiveSearch_search() {
                    if (this.__predictiveSearch_query.trim().length == 0) {
                        return null;
                    }
                    if (!this.__predictiveSearch_formEl) {
                        throw new Error('Could find a form element. x-predictive-search:form directive must be used on a form element');
                    }
                    this.__predictiveSearch_state = 'loading';
                    // If there's already an abort controller in use, abort it to cancel any pending requests
                    if (this.__predictiveSearch_abortController != null) {
                        this.__predictiveSearch_abort();
                        this.__predictiveSearch_abortController = null;
                    }
                    this.__predictiveSearch_abortController = new AbortController();
                    try {
                        const response = await predictiveSearch(this.__predictiveSearch_query, this.__predictiveSearch_resultSectionId, new FormData(this.__predictiveSearch_formEl), {
                            signal: this.__predictiveSearch_abortController.signal,
                        });
                        if (response.status === 200) {
                            const resultHtml = await response.text();
                            this.__predictiveSearch_resultHtml = resultHtml;
                            // Wait results have (presumably) been rendered before setting state to success
                            // so that you can do stuff like x-collapse without any jankiness
                            this.$nextTick(async () => {
                                var _a, _b;
                                this.__predictiveSearch_state = 'success';
                                // Standard storefront event (https://shopify.dev/docs/api/storefront-events-and-actions).
                                // Rendered options carry the x-predictive-search:option attribute, so count those.
                                const resultsEl = (_a = this.__predictiveSearch_resultsEl) !== null && _a !== void 0 ? _a : this.$root;
                                // Count product results only - suggestion and collection options also
                                // carry the option attribute but are not what totalCount means
                                const query = this.__predictiveSearch_query;
                                const totalCount = (_b = resultsEl === null || resultsEl === void 0 ? void 0 : resultsEl.querySelectorAll('[x-predictive-search\\:option][href*="/products/"]').length) !== null && _b !== void 0 ? _b : 0;
                                await yieldToMain();
                                dispatchSearchUpdate(this.$root, {
                                    query,
                                    totalCount,
                                });
                            });
                            return resultHtml;
                        }
                        else {
                            const resultText = await response.text();
                            this.__predictiveSearch_handleRequestError(new Error(`Request failed with status ${response.status}: ${resultText}`));
                            return null;
                        }
                    }
                    catch (e) {
                        if (e == CANCEL_REQUEST_REASON) {
                            // Do nothing, this happens when we abort an existing request to start a new one
                        }
                        else {
                            this.__predictiveSearch_handleRequestError(e);
                        }
                        return null;
                    }
                },
                __predictiveSearch_handleRequestError(e) {
                    this.__predictiveSearch_state = 'error';
                    this.__predictiveSearch_error = prettyPrintError(e);
                    throw e;
                },
                destroy() {
                    if (this.__predictiveSearch_abortController != null) {
                        this.__predictiveSearch_abortController.abort();
                    }
                },
            };
        },
    });
}
