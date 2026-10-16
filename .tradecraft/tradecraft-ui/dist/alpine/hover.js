import { isHoverSupported, isHtmlElement, isTouchEvent } from '../utils/dom';
const HOVER_CONTEXT_KEY = Symbol('HOVER_CONTEXT_KEY');
/**
 * Plugin for managing hover states on elements. Automatically adds/removes event listeners, ignores touch events,
 * and optionally adds a delay before evaluating the expression for cases like tooltips.
 * Use $isHovering in templates for reactive hover state (boolean).
 *
 * @example
 * <div x-hover:start="console.log('hover started')"></div>
 * <div x-hover:end="console.log('hover ended')"></div>
 * <div x-hover:start.delay.300ms="console.log('hover started with delay')"></div>
 * @example
 * <div x-hover :class="{ 'bg-primary': $isHovering }">Hover me</div>
 * @example
 * <div x-hover="$isHovering ? console.log('hover') : console.log('unhover')">Hover me</div>
 */
export default (Alpine) => {
    function getHoverContext(el) {
        var _a;
        return (_a = Alpine.$data(el)) === null || _a === void 0 ? void 0 : _a[HOVER_CONTEXT_KEY];
    }
    // Define the x-hover directive
    Alpine.directive('hover', ($el, data, utilities) => {
        if (!isHtmlElement($el)) {
            throw new Error(`Expected HTMLElement but got ${$el}`);
        }
        if (data.value == 'start') {
            handleStart($el, data, utilities);
        }
        else if (data.value == 'end') {
            handleEnd($el, data, utilities);
        }
        else if (data.value == null) {
            handleRoot($el, data, utilities);
        }
        else {
            throw new Error(`Unknown directive: x-press:${data.value}`);
        }
    }).before('bind');
    function ensureHoverContext($el, cleanup) {
        if (getHoverContext($el))
            return;
        const context = Alpine.reactive({ value: false });
        const undo = Alpine.addScopeToNode($el, {
            [HOVER_CONTEXT_KEY]: context,
        });
        cleanup(undo);
    }
    /**
     * Handles x-hover or x-hover="expression" — sets up $isHovering; optionally evaluates expression on enter/leave.
     */
    function handleRoot($el, { expression }, { evaluateLater, cleanup }) {
        ensureHoverContext($el, cleanup);
        const expressionFn = expression ? evaluateLater(expression) : null;
        function runExpression() {
            var _a;
            const context = getHoverContext($el);
            expressionFn === null || expressionFn === void 0 ? void 0 : expressionFn(() => { }, {
                scope: { $isHovering: (_a = context === null || context === void 0 ? void 0 : context.value) !== null && _a !== void 0 ? _a : false },
                params: [],
            });
        }
        function onPointerLeave(e) {
            if (!isHoverSupported())
                return;
            if (isTouchEvent(e))
                return;
            const context = getHoverContext($el);
            if (context)
                context.value = false;
            runExpression();
        }
        function onPointerEnter(e) {
            if (!isHoverSupported())
                return;
            if (isTouchEvent(e))
                return;
            const context = getHoverContext($el);
            if (context)
                context.value = true;
            $el.addEventListener('pointerleave', onPointerLeave, { once: true });
            runExpression();
        }
        Alpine.bind($el, {
            '@pointerenter': onPointerEnter,
        });
        cleanup(() => $el.removeEventListener('pointerleave', onPointerLeave));
    }
    /**
     * Handles the x-hover:start directive
     */
    function handleStart($el, { expression, modifiers }, { evaluateLater, cleanup }) {
        ensureHoverContext($el, cleanup);
        const expressionFn = expression ? evaluateLater(expression) : null;
        // Determine modifiers
        const shouldDelay = modifiers.includes('delay');
        let delayTimeoutId = null;
        $el._x_hover_hasEnterCallback = true;
        let delay = 0;
        if (shouldDelay) {
            delay = getDelayModifier(modifiers);
        }
        /**
         * Evaluates the callback expression provided in the directive
         */
        function evaluateCallbackExpression(e) {
            expressionFn === null || expressionFn === void 0 ? void 0 : expressionFn(() => { }, {
                scope: {
                    $event: e,
                },
                params: [e],
            });
        }
        /**
         * Handles pointer/mouse leave events
         */
        function onPointerLeave(e) {
            var _a;
            if (!isHoverSupported())
                return;
            if (isTouchEvent(e))
                return;
            const context = getHoverContext($el);
            if (context)
                context.value = false;
            if ($el._x_hover_leaveCallback) {
                // If x-hover:end is used on the same element, call the leave callback
                (_a = $el._x_hover_leaveCallback) === null || _a === void 0 ? void 0 : _a.call($el, e);
            }
            // Clear any timeouts
            if (delayTimeoutId !== null) {
                clearTimeout(delayTimeoutId);
                delayTimeoutId = null;
            }
        }
        /**
         * Handles pointer/mouse enter events
         */
        function onPointerEnter(e) {
            if (!isHoverSupported())
                return;
            if (isTouchEvent(e))
                return;
            const context = getHoverContext($el);
            if (context)
                context.value = true;
            $el.addEventListener('pointerleave', onPointerLeave, {
                once: true,
            });
            if (shouldDelay) {
                // Handle delay before triggering the callback
                delayTimeoutId = setTimeout(() => {
                    evaluateCallbackExpression === null || evaluateCallbackExpression === void 0 ? void 0 : evaluateCallbackExpression(e);
                }, delay);
            }
            else {
                // No delay, trigger callback immediately
                evaluateCallbackExpression === null || evaluateCallbackExpression === void 0 ? void 0 : evaluateCallbackExpression(e);
            }
        }
        // Bind the appropriate enter event
        Alpine.bind($el, {
            '@pointerenter': onPointerEnter,
        } /* Remove 'any' when @alpinejs/types is fixed */);
        // Clean up any timeouts and event listeners on cleanup
        cleanup(() => {
            if (delayTimeoutId !== null) {
                clearTimeout(delayTimeoutId);
            }
            $el.removeEventListener('pointerleave', onPointerLeave);
        });
    }
    /**
     * Handles the x-hover:end directive
     */
    function handleEnd($el, { expression, modifiers }, { evaluateLater, cleanup }) {
        ensureHoverContext($el, cleanup);
        const expressionFn = evaluateLater(expression);
        let onPointerReenter = () => { };
        const shouldDelay = modifiers.includes('delay');
        let delayTimeoutId = null;
        let delay = 0;
        if (shouldDelay) {
            delay = getDelayModifier(modifiers);
        }
        /**
         * Evaluates the callback expression provided in the directive
         */
        function evaluateCallbackExpression(e) {
            expressionFn === null || expressionFn === void 0 ? void 0 : expressionFn(() => { }, {
                scope: {
                    $event: e,
                },
                params: [e],
            });
        }
        /**
         * Handles pointer/mouse leave events
         */
        function onPointerLeave(e) {
            if (!isHoverSupported())
                return;
            if (isTouchEvent(e))
                return;
            const context = getHoverContext($el);
            if (context)
                context.value = false;
            if (shouldDelay) {
                onPointerReenter = () => {
                    if (delayTimeoutId !== null) {
                        clearTimeout(delayTimeoutId);
                        delayTimeoutId = null;
                    }
                };
                // Start a timer to execute the expression after the delay
                delayTimeoutId = setTimeout(() => {
                    $el.removeEventListener('pointerenter', onPointerReenter);
                    evaluateCallbackExpression(e);
                }, delay);
                // If pointer re-enters before delay is over, clear the timeout
                $el.addEventListener('pointerenter', onPointerReenter, { once: true });
            }
            else {
                evaluateCallbackExpression(e);
            }
        }
        if ($el._x_hover_hasEnterCallback) {
            // If x-hover:start is already also used on this element, store the leave callback
            $el._x_hover_leaveCallback = onPointerLeave;
        }
        else {
            // If x-hover:end is used alone, add the leave event listener directly
            Alpine.bind($el, {
                '@pointerleave': onPointerLeave,
            } /* Remove 'any' when @alpinejs/types is fixed */);
        }
        cleanup(() => {
            if (delayTimeoutId !== null) {
                clearTimeout(delayTimeoutId);
            }
            $el.removeEventListener('pointerenter', onPointerReenter);
        });
    }
    /**
     * Retrieves the delay value from the modifiers
     */
    function getDelayModifier(modifiers) {
        const delayIndex = modifiers.indexOf('delay');
        const timeModifier = modifiers[delayIndex + 1];
        if (timeModifier) {
            const parsedTime = Number(timeModifier.replace('ms', ''));
            if (!isNaN(parsedTime)) {
                return parsedTime;
            }
        }
        // Default delay value if not specified
        return 0;
    }
    /**
     * Magic that returns reactive hover state for the current element or nearest ancestor with x-hover.
     * Use $isHovering in templates; true while the pointer is over the element.
     */
    Alpine.magic('isHovering', (el) => {
        const context = getHoverContext(el);
        if (context)
            return context.value;
        return false;
    });
};
