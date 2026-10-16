import { isInputNumberElement, isButtonElement } from '../utils';
import { warnMissingParentDirective } from '../utils/error';
/**
 * Plus and minus buttons for a number input.
 *
 * - x-stepper - The root. Adds the data context for the child directives. A click on the root's own background focuses the input.
 * - x-stepper:input - The input. Must be an <input type="number">. Its min, max, and step attributes set the limits.
 * - x-stepper:minus - The minus button. Must be a <button>. Calls stepDown() on the input.
 * - x-stepper:plus - The plus button. Must be a <button>. Calls stepUp() on the input.
 *
 * The '$stepper' magic exposes 'value' (the input value as a number), 'increment()', and 'decrement()'.
 *
 * Browsers do not dispatch input/change events for stepUp/stepDown, so the plugin dispatches
 * them manually and x-model on the input keeps working.
 *
 * ## Events
 * - 'increment' / 'decrement' - Dispatched after a step. Event detail is the new input value.
 *
 * @example
 *
  <div x-stepper>
    <button type="button" x-stepper:minus>−</button>
    <input type="number" name="stepper" min="1" max="10" value="1" x-stepper:input>
    <button type="button" x-stepper:plus>+</button>
  </div>
 */
export default function (Alpine) {
    Alpine.directive('stepper', ($el, data) => {
        if (data.value == 'input') {
            handleInput($el, Alpine);
        }
        else if (data.value == 'minus') {
            handleButtonMinus($el, Alpine);
        }
        else if (data.value == 'plus') {
            handleButtonPlus($el, Alpine);
        }
        else if (data.value == null) {
            handleRoot($el, Alpine);
        }
        else {
            throw new Error(`Unknown directive: x-stepper:${data.value}`);
        }
    }).before('bind');
    Alpine.magic('stepper', ($el) => {
        const $data = Alpine.$data($el);
        return {
            get value() {
                return $data.__stepper_value;
            },
            increment() {
                var _a;
                (_a = $data.__stepper_increment) === null || _a === void 0 ? void 0 : _a.call($data);
            },
            decrement() {
                var _a;
                (_a = $data.__stepper_decrement) === null || _a === void 0 ? void 0 : _a.call($data);
            },
        };
    });
}
function handleInput($el, Alpine) {
    if (isInputNumberElement($el)) {
        Alpine.bind($el, {
            'x-init'() {
                if (!this.__stepper_isRoot) {
                    warnMissingParentDirective('x-stepper:input', 'x-stepper', $el);
                    return;
                }
                this.__stepper_inputEl = $el;
            },
        });
    }
    else {
        throw new Error(`Expected <input type="number"> tag for x-stepper:input but got ${$el}`);
    }
}
function handleButtonMinus($el, Alpine) {
    if (isButtonElement($el)) {
        Alpine.bind($el, {
            ['x-data']() {
                return {
                    init() {
                        if (!this.__stepper_isRoot) {
                            warnMissingParentDirective('x-stepper:minus', 'x-stepper', this.$el);
                        }
                    },
                };
            },
            '@click.prevent': '$stepper.decrement',
        });
    }
    else {
        throw new Error(`Expected <button> tag for x-stepper:minus but got ${$el}`);
    }
}
function handleButtonPlus($el, Alpine) {
    if (isButtonElement($el)) {
        Alpine.bind($el, {
            ['x-data']() {
                return {
                    init() {
                        if (!this.__stepper_isRoot) {
                            warnMissingParentDirective('x-stepper:plus', 'x-stepper', this.$el);
                        }
                    },
                };
            },
            '@click.prevent': '$stepper.increment',
        });
    }
    else {
        throw new Error(`Expected <button> tag for x-stepper:plus but got ${$el}`);
    }
}
function handleRoot($el, Alpine) {
    Alpine.bind($el, {
        ['x-data']() {
            return {
                __stepper_isRoot: true,
                __stepper_inputEl: null,
                __stepper_value: null,
                init() {
                    queueMicrotask(() => {
                        Alpine.effect(() => {
                            if (this.__stepper_inputEl) {
                                const value = Alpine.bound(this.__stepper_inputEl, 'value', null);
                                this.__stepper_value = value !== null && value !== undefined ? Number(value) : null;
                            }
                        });
                    });
                },
                __stepper_decrement() {
                    var _a, _b, _c, _d;
                    (_a = this.__stepper_inputEl) === null || _a === void 0 ? void 0 : _a.stepDown();
                    // Browsers don't dispatch input/change events when the value is decremented/incremented so we do that
                    // manually so that things like Alpine x-model still work
                    (_b = this.__stepper_inputEl) === null || _b === void 0 ? void 0 : _b.dispatchEvent(new Event('input', { bubbles: true }));
                    (_c = this.__stepper_inputEl) === null || _c === void 0 ? void 0 : _c.dispatchEvent(new Event('change', { bubbles: true }));
                    this.$dispatch('decrement', (_d = this.__stepper_inputEl) === null || _d === void 0 ? void 0 : _d.value);
                },
                __stepper_increment() {
                    var _a, _b, _c, _d;
                    (_a = this.__stepper_inputEl) === null || _a === void 0 ? void 0 : _a.stepUp();
                    (_b = this.__stepper_inputEl) === null || _b === void 0 ? void 0 : _b.dispatchEvent(new Event('input', { bubbles: true }));
                    (_c = this.__stepper_inputEl) === null || _c === void 0 ? void 0 : _c.dispatchEvent(new Event('change', { bubbles: true }));
                    this.$dispatch('increment', (_d = this.__stepper_inputEl) === null || _d === void 0 ? void 0 : _d.value);
                },
            };
        },
        '@click.self'() {
            var _a;
            (_a = this.__stepper_inputEl) === null || _a === void 0 ? void 0 : _a.focus();
        },
    });
}
