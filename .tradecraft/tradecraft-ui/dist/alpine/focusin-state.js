import { isHtmlElement } from '../utils/dom';
const FOCUS_IN_STATE_CONTEXT_KEY = Symbol('FOCUS_IN_STATE_CONTEXT_KEY');
/**
 * Plugin to allow for easily binding an external x-data variable to whether an element contains focus or not
 *
 * e.g of instead of this
 *
 * <div x-data="{ hasFocusIn: false }" @focusin="hasFocusIn = true" @focusout="hasFocusIn = false">
 *   </button></button>
 * </div>
 *
 * you can just do this:
 *
 * <button x-data="{ hasFocusIn: false }" x-focusin-state="hasFocusIn = $hasFocusIn">Focus on me</button>
 *
 * The expression passed to `x-focusin-state` is evaluated when it receives the `focusin` (`$hasFocusIn` will be true), and again when it receives the
 * `focusout` event (`$hasFocusIn` will be false).
 *
 * This plugin has a few added benefits in addition to simpler code:
 * - The `focusout` listener isn't bound until the `focusin` element is fired, and also is destroyed when the element is destroyed or `focusout` is fired
 * - This plugin checks that when focusout occurs, the new focused element is actually outside of the wrapper
 */
export default (Alpine) => {
    Alpine.directive('focusin-state', ($el, { expression }, { evaluateLater, cleanup }) => {
        if (!isHtmlElement($el)) {
            throw new Error(`Expected HTMLElement but got ${$el}`);
        }
        const expressionFn = evaluateLater(expression);
        const context = Alpine.reactive({
            hasFocusIn: false,
            lastEvent: null,
            abortController: null,
            onFocusIn(e) {
                this.abortController = new AbortController();
                this.lastEvent = e;
                if (this.hasFocusIn == true) {
                    return;
                }
                this.hasFocusIn = true;
                expressionFn(() => { }, {
                    scope: {
                        $event: this.lastEvent,
                        $hasFocusIn: this.hasFocusIn,
                    },
                    params: [this.lastEvent, this.hasFocusIn],
                });
                $el.addEventListener('focusout', this.onFocusOut.bind(this), {
                    signal: this.abortController.signal,
                });
            },
            onFocusOut(e) {
                if ($el.isSameNode(e.relatedTarget) || $el.contains(e.relatedTarget)) {
                    return;
                }
                this.lastEvent = e;
                this.hasFocusIn = false;
                expressionFn(() => { }, {
                    scope: {
                        $event: this.lastEvent,
                        $hasFocusIn: this.hasFocusIn,
                    },
                    params: [this.lastEvent, this.hasFocusIn],
                });
                this.abortController.abort();
            },
        });
        Alpine.addScopeToNode($el, {
            [FOCUS_IN_STATE_CONTEXT_KEY]: context,
        });
        Alpine.bind($el, {
            '@focusin'(e) {
                return context.onFocusIn(e);
            },
        } /* TODO remove this one @alpinejs/types is fixed */);
        cleanup(() => {
            var _a;
            (_a = context.abortController) === null || _a === void 0 ? void 0 : _a.abort();
        });
    }).before('bind');
    Alpine.magic('hasFocusIn', ($el) => {
        const context = Alpine.$data($el)[FOCUS_IN_STATE_CONTEXT_KEY];
        if (!context)
            throw new Error('$hasFocusIn needs to be used on or inside an element with x-focusin-state');
        return context.hasFocusIn;
    });
};
