import { isElementKeyboardAccessible, isHtmlElement, isNodeOrChild, isPrimaryPointer } from '../utils/dom';
const PRESS_CONTEXT_KEY = Symbol('PRESS_CONTEXT_KEY');
/**
 * Native button-like controls synthesize click from keyboard activation.
 * Avoid preventing default so Enter/Space continue to fire click events.
 *
 * @example
 * isNativeKeyboardClickElement(document.createElement('button'))
 * // true
 *
 * @example
 * const div = document.createElement('div');
 * div.tabIndex = 0;
 * isNativeKeyboardClickElement(div)
 * // false
 */
function isNativeKeyboardClickElement(el) {
    if (el instanceof HTMLButtonElement)
        return true;
    if (el instanceof HTMLAnchorElement)
        return true;
    if (!(el instanceof HTMLInputElement))
        return false;
    return ['button', 'submit', 'reset', 'checkbox', 'radio'].includes(el.type);
}
/**
 * Plugin for managing press state on elements. Listens to pointer down/up/cancel and keydown/keyup
 * (Enter/Space) when focused. Only the primary pointer is used (left mouse or primary touch); right-click
 * and secondary touches are ignored. Pointer up/cancel are listened for on window so release is detected
 * even outside the element. x-press:end and expression callbacks receive $success (true if released over
 * the element or a child, false on pointercancel or release outside). Non-focusable elements get tabIndex=0
 * so they can receive keyboard press. Use $isPressing in templates for reactive press state (boolean).
 *
 * @example
 * <button x-press:start="console.log('press started')">Press me</button>
 * @example
 * <button x-press:end="console.log('press ended')">Press me</button>
 * @example
 * <button x-press :class="{ 'scale-95': $isPressing }">Press me</button>
 * @example
 * <button x-press="$isPressing ? console.log('pressing') : console.log('released')">Press me</button>
 */
export default (Alpine) => {
    function getPressContext(el) {
        var _a;
        return (_a = Alpine.$data(el)) === null || _a === void 0 ? void 0 : _a[PRESS_CONTEXT_KEY];
    }
    Alpine.directive('press', ($el, data, utilities) => {
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
            throw new Error(`Unknown directive: x-hover:${data.value}`);
        }
    }).before('bind');
    function ensurePressContext($el, cleanup) {
        if (getPressContext($el))
            return;
        const context = Alpine.reactive({ value: false });
        const undo = Alpine.addScopeToNode($el, {
            [PRESS_CONTEXT_KEY]: context,
        });
        cleanup(undo);
    }
    /**
     * Handles x-press or x-press="expression" — sets up $isPressing; optionally evaluates expression on press start/end.
     */
    function handleRoot($el, { expression }, { evaluateLater, cleanup }) {
        ensurePressContext($el, cleanup);
        const expressionFn = expression ? evaluateLater(expression) : null;
        function runExpression(success) {
            var _a;
            const context = getPressContext($el);
            expressionFn === null || expressionFn === void 0 ? void 0 : expressionFn(() => { }, {
                scope: { $isPressing: (_a = context === null || context === void 0 ? void 0 : context.value) !== null && _a !== void 0 ? _a : false, $success: success },
                params: [],
            });
        }
        function onPointerUp(e) {
            if (!isPrimaryPointer(e))
                return;
            const context = getPressContext($el);
            if (context)
                context.value = false;
            const success = isNodeOrChild($el, e.target);
            runExpression(success);
        }
        function onPointerCancel(e) {
            if (!isPrimaryPointer(e))
                return;
            const context = getPressContext($el);
            if (context)
                context.value = false;
            runExpression(false);
        }
        function onPointerDown(e) {
            if (!isPrimaryPointer(e))
                return;
            const context = getPressContext($el);
            if (context)
                context.value = true;
            window.addEventListener('pointerup', onPointerUp, { once: true });
            window.addEventListener('pointercancel', onPointerCancel, { once: true });
            runExpression();
        }
        function onKeyUp(e) {
            if (e.key !== 'Enter' && e.key !== ' ')
                return;
            const context = getPressContext($el);
            if (context)
                context.value = false;
            runExpression(true);
        }
        function onKeyDown(e) {
            if (e.key !== 'Enter' && e.key !== ' ')
                return;
            if (!isNativeKeyboardClickElement($el)) {
                e.preventDefault();
            }
            const context = getPressContext($el);
            if (context)
                context.value = true;
            window.addEventListener('keyup', onKeyUp, { once: true });
            runExpression();
        }
        if (!isElementKeyboardAccessible($el) && !$el.hasAttribute('tabindex')) {
            $el.tabIndex = 0;
        }
        Alpine.bind($el, {
            '@pointerdown': onPointerDown,
            '@keydown': onKeyDown,
        });
        cleanup(() => {
            window.removeEventListener('pointerup', onPointerUp);
            window.removeEventListener('pointercancel', onPointerCancel);
            window.removeEventListener('keyup', onKeyUp);
        });
    }
    /**
     * Handles the x-press:start directive
     */
    function handleStart($el, { expression }, { evaluateLater, cleanup }) {
        ensurePressContext($el, cleanup);
        const expressionFn = expression ? evaluateLater(expression) : null;
        $el._x_press_hasStartCallback = true;
        function evaluateCallbackExpression(e) {
            expressionFn === null || expressionFn === void 0 ? void 0 : expressionFn(() => { }, {
                scope: { $event: e },
                params: [e],
            });
        }
        function onPointerUp(e) {
            if (!isPrimaryPointer(e))
                return;
            const context = getPressContext($el);
            if (context)
                context.value = false;
            const el = $el;
            const success = isNodeOrChild($el, e.target);
            if (el._x_press_endCallback)
                el._x_press_endCallback(e, success);
        }
        function onPointerCancel(e) {
            if (!isPrimaryPointer(e))
                return;
            const context = getPressContext($el);
            if (context)
                context.value = false;
            const el = $el;
            if (el._x_press_endCallback)
                el._x_press_endCallback(e, false);
        }
        function onKeyUp(e) {
            if (e.key !== 'Enter' && e.key !== ' ')
                return;
            const context = getPressContext($el);
            if (context)
                context.value = false;
            const el = $el;
            if (el._x_press_endCallback)
                el._x_press_endCallback(e, true);
        }
        function onPointerDown(e) {
            if (!isPrimaryPointer(e))
                return;
            const context = getPressContext($el);
            if (context)
                context.value = true;
            window.addEventListener('pointerup', onPointerUp, { once: true });
            window.addEventListener('pointercancel', onPointerCancel, { once: true });
            evaluateCallbackExpression === null || evaluateCallbackExpression === void 0 ? void 0 : evaluateCallbackExpression(e);
        }
        function onKeyDown(e) {
            if (e.key !== 'Enter' && e.key !== ' ')
                return;
            if (!isNativeKeyboardClickElement($el)) {
                e.preventDefault();
            }
            const context = getPressContext($el);
            if (context)
                context.value = true;
            window.addEventListener('keyup', onKeyUp, { once: true });
            evaluateCallbackExpression === null || evaluateCallbackExpression === void 0 ? void 0 : evaluateCallbackExpression(e);
        }
        if (!isElementKeyboardAccessible($el) && !$el.hasAttribute('tabindex')) {
            $el.tabIndex = 0;
        }
        Alpine.bind($el, {
            '@pointerdown': onPointerDown,
            '@keydown': onKeyDown,
        });
        cleanup(() => {
            window.removeEventListener('pointerup', onPointerUp);
            window.removeEventListener('pointercancel', onPointerCancel);
            window.removeEventListener('keyup', onKeyUp);
        });
    }
    /**
     * Handles the x-press:end directive
     */
    function handleEnd($el, { expression }, { evaluateLater, cleanup }) {
        ensurePressContext($el, cleanup);
        const expressionFn = evaluateLater(expression);
        function evaluateCallbackExpression(e, success) {
            expressionFn === null || expressionFn === void 0 ? void 0 : expressionFn(() => { }, {
                scope: { $event: e, $success: success },
                params: [e, success],
            });
        }
        function onPointerUp(e, success) {
            if (!isPrimaryPointer(e))
                return;
            const context = getPressContext($el);
            if (context)
                context.value = false;
            const resolvedSuccess = success !== null && success !== void 0 ? success : isNodeOrChild($el, e.target);
            evaluateCallbackExpression(e, resolvedSuccess);
        }
        function onPointerCancel(e) {
            if (!isPrimaryPointer(e))
                return;
            const context = getPressContext($el);
            if (context)
                context.value = false;
            onPointerUp(e, false);
        }
        function onKeyUp(e) {
            if (e.key !== 'Enter' && e.key !== ' ')
                return;
            const context = getPressContext($el);
            if (context)
                context.value = false;
            evaluateCallbackExpression(e, true);
        }
        const el = $el;
        if (el._x_press_hasStartCallback) {
            el._x_press_endCallback = (e, success) => {
                if ('pointerType' in e) {
                    onPointerUp(e, success);
                }
                else {
                    onKeyUp(e);
                }
            };
        }
        else {
            function onPointerUpForEnd(up) {
                onPointerUp(up);
            }
            function onPointerDownForEnd(e) {
                if (!isPrimaryPointer(e))
                    return;
                const context = getPressContext($el);
                if (context)
                    context.value = true;
                window.addEventListener('pointerup', onPointerUpForEnd, { once: true });
                window.addEventListener('pointercancel', onPointerCancel, { once: true });
            }
            function onKeyDownForEnd(e) {
                if (e.key !== 'Enter' && e.key !== ' ')
                    return;
                if (!isNativeKeyboardClickElement($el)) {
                    e.preventDefault();
                }
                const context = getPressContext($el);
                if (context)
                    context.value = true;
                window.addEventListener('keyup', onKeyUp, { once: true });
            }
            if (!isElementKeyboardAccessible($el) && !$el.hasAttribute('tabindex')) {
                $el.tabIndex = 0;
            }
            Alpine.bind($el, {
                '@pointerdown': onPointerDownForEnd,
                '@keydown': onKeyDownForEnd,
            });
            cleanup(() => {
                window.removeEventListener('pointerup', onPointerUpForEnd);
                window.removeEventListener('pointercancel', onPointerCancel);
                window.removeEventListener('keyup', onKeyUp);
            });
        }
    }
    /**
     * Magic that returns reactive press state for the current element or nearest ancestor with x-press.
     * Use $isPressing in templates; true while the element is being pressed.
     */
    Alpine.magic('isPressing', (el) => {
        const context = getPressContext(el);
        if (context)
            return context.value;
        return false;
    });
};
