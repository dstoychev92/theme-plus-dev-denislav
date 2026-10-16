import { isHtmlElement } from '../utils/dom';
/**
 * Plugin which provides various directives and magics for working with responsive design.
 *
 * ## `x-screen:*` directives
 *
 * Runs an expression when a named media query matches. Without a name, the expression
 * runs on every change with the full `$matches` record in scope.
 *
 * @example
 *
 * Setup the plugin by passing your screen sizes to the plugin fn. You can pass both pixel values and CSS variables
 *
 * ```js
 * import {screen} from '@groupthought/tradecraft-ui/alpine';
 *
 * Alpine.plugin(screen({
 *   sm: '(max-width: 1023px)',
 *   md: '(min-width: 1024px) and (max-width: 1156px)',
 *   // ...
 * }))
 * ```
 *
 * Use the directive to conditionally run code based on the current screen size
 *
 * ```html
 * <div
 *  x-screen:sm="console.log('screen sizes matches small')"
 *  x-screen:md="console.log('screen size matches medium')"
 * >
 * </div>
 * ```
 */
export default (queries) => {
    return (Alpine) => {
        Alpine.store('media', {
            queries: queries,
            matches: {},
        });
        let abortController = null;
        Alpine.effect(() => {
            if (abortController) {
                abortController.abort();
            }
            abortController = new AbortController();
            Alpine.store('media').matches = {};
            Object.entries(Alpine.store('media').queries).forEach(([key, value]) => {
                const mediaQuery = window.matchMedia(value);
                // Set the initial value for the media query
                Alpine.store('media').matches[key] = mediaQuery.matches;
                // Add event listener to update the store when the media query changes
                mediaQuery.addEventListener('change', (e) => {
                    Alpine.store('media').matches[key] = e.matches;
                }, {
                    signal: abortController === null || abortController === void 0 ? void 0 : abortController.signal,
                });
            });
        });
        Alpine.directive('screen', ($el, { value, expression }, { effect, evaluateLater }) => {
            if (!isHtmlElement($el)) {
                throw new Error(`Expected HTMLElement but got ${$el}`);
            }
            const evaluateExpression = evaluateLater(expression);
            if (value !== null) {
                if (!(value in Alpine.store('media').queries)) {
                    throw new Error(`Unknown screen size: ${value}`);
                }
                Alpine.nextTick(() => {
                    effect(() => {
                        const match = Alpine.store('media').matches[value];
                        if (match) {
                            evaluateExpression(() => { });
                        }
                    });
                });
            }
            else {
                Alpine.nextTick(() => {
                    effect(() => {
                        const matches = Alpine.store('media').matches;
                        if (matches !== null) {
                            evaluateExpression(() => { }, {
                                params: [matches],
                                scope: {
                                    $matches: matches,
                                },
                            });
                        }
                    });
                });
            }
        });
        Alpine.magic('media', () => {
            return Alpine.store('media');
        });
    };
};
