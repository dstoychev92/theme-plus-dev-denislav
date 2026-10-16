import { Alpine as AlpineType, AlpineComponent } from 'alpinejs';
export type PredictiveSearchComponent = AlpineComponent<{
    __predictiveSearch_isRoot: boolean;
    __predictiveSearch_formEl: HTMLFormElement | null;
    __predictiveSearch_inputEl: HTMLInputElement | null;
    __predictiveSearch_resultsEl: HTMLElement | null;
    __predictiveSearch_optionsEl: HTMLElement | null;
    __predictiveSearch_resultSectionId: string;
    __predictiveSearch_query: string;
    __predictiveSearch_resultHtml: string | null;
    __predictiveSearch_state: 'idle' | 'loading' | 'error' | 'success';
    __predictiveSearch_error: string | null;
    __predictiveSearch_abortController: AbortController | null;
    __predictiveSearch_search(): Promise<string | null>;
    __predictiveSearch_reset(): void;
    __predictiveSearch_abort(): void;
    __predictiveSearch_handleRequestError(e: Error): void;
}>;
export type PredictiveSearchMagic = {
    readonly state: 'idle' | 'loading' | 'error' | 'success';
    readonly error: string | null;
    query: string;
    readonly resultHtml: string | null;
    search(): Promise<string | null>;
    reset(): void;
};
declare module 'alpinejs' {
    interface Magics<T> {
        /**
         * Magic property for interacting with the enclosing x-predictive-search directive.
         *
         * Provides reactive access to the predictive search state and methods to drive it:
         * - `state` - 'idle' | 'loading' | 'error' | 'success'
         * - `error` - the last error message, or null
         * - `query` - the current search query (readable and writable)
         * - `resultHtml` - the raw HTML returned by the search endpoint, or null
         * - `search()` - trigger a search for the current query
         * - `reset()` - clear the query, results and any in-flight request
         *
         * @example
         * ```html
         * <input x-predictive-search:input x-model="$predictiveSearch.query" />
         * <div x-show="$predictiveSearch.state == 'success'" x-predictive-search:results></div>
         * ```
         */
        $predictiveSearch: PredictiveSearchMagic;
    }
}
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
export default function (Alpine: AlpineType): void;
