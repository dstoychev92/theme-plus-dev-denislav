import { isHtmlElement } from '../utils/dom';
const FOCUS_STATE_CONTEXT_KEY = Symbol('FOCUS_STATE_CONTEXT_KEY');
/**
 * Plugin to allow for easily binding an external x-data variable to the focus state of an element
 *
 * e.g of instead of this
 *
 * <button x-data="{ hasFocus: false }" @focus="hasFocus = true" @blur="hasFocus = false"></button></button>
 *
 * you can just do this:
 *
 * <button x-data="{ hasFocus: false }" x-focus-state="hasFocus = $hasFocus">Focus on me</button>
 *
 * The expression passed to `x-focus-state` is evaluated when it receives the `focus` (`$hasFocus` will be true), and again when it receives the
 * `blur` event (`$hasFocus` will be false).
 *
 * This plugin has the added benefit that the `blur` listener isn't bound until the `focus` element is fired, and also is destroyed when the element is destroyed or `blur` is fired
 */
export default (Alpine) => {
    Alpine.directive('focus-state', ($el, { expression }, { evaluateLater, effect, cleanup }) => {
        if (!isHtmlElement($el)) {
            throw new Error(`Expected HTMLElement but got ${$el}`);
        }
        const expressionFn = evaluateLater(expression);
        const context = Alpine.reactive({
            hasFocus: false,
            lastEvent: null,
            abortController: null,
            onFocus(e) {
                this.abortController = new AbortController();
                this.lastEvent = e;
                if (this.hasFocus == true) {
                    return;
                }
                this.hasFocus = true;
                expressionFn(() => { }, {
                    scope: {
                        $event: this.lastEvent,
                        $hasFocus: this.hasFocus,
                    },
                    params: [this.lastEvent, this.hasFocus],
                });
                $el.addEventListener('blur', this.onBlur.bind(this), {
                    signal: this.abortController.signal,
                });
            },
            onBlur(e) {
                this.hasFocus = false;
                this.lastEvent = e;
                expressionFn(() => { }, {
                    scope: {
                        $event: this.lastEvent,
                        $hasFocus: this.hasFocus,
                    },
                    params: [this.lastEvent, this.hasFocus],
                });
                this.abortController.abort();
            },
        });
        Alpine.addScopeToNode($el, {
            [FOCUS_STATE_CONTEXT_KEY]: context,
        });
        Alpine.bind($el, {
            '@focus'(e) {
                return context.onFocus(e);
            },
        } /* TODO remove this one @alpinejs/types is fixed */);
        cleanup(() => {
            var _a;
            (_a = context.abortController) === null || _a === void 0 ? void 0 : _a.abort();
        });
    }).before('bind');
    Alpine.magic('hasFocus', ($el) => {
        const context = Alpine.$data($el)[FOCUS_STATE_CONTEXT_KEY];
        if (!context)
            throw new Error('$hasFocus needs to be used on or inside an element with x-focus-state');
        return context.hasFocus;
    });
};
