import { isInputRangeElement, isInputNumberElement } from '../utils';
import { warnMissingParentDirective } from '../utils/error';
/**
 * Enables the creation of range components.
 * The 'x-range' directive provides functionality for managing dual-range input fields with synchronized min and max values.
 *
 * Usage:
 * - x-range - The root element of the range component, initializing the range functionality and adding a data context for child directives.
 * - x-range:number-min - A number input element for the minimum value. Automatically syncs with the range slider and enforces min/max constraints.
 * - x-range:number-max - A number input element for the maximum value. Automatically syncs with the range slider and enforces min/max constraints.
 * - x-range:range-min - A range input element for the minimum value. Use the 'fill' modifier (x-range:range-min.fill) to fill the value with the min limit when empty.
 * - x-range:range-max - A range input element for the maximum value. Use the 'fill' modifier (x-range:range-max.fill) to fill the value with the max limit when empty.
 *
 * Note: The 'fill' modifier is not used by default because range inputs automatically set a default value when empty, which would populate number inputs and remove their placeholder state. Use 'fill' when you only have range inputs (no number inputs) and want them to display limit values when empty.
 *
 * Note: Each side supplies only its own limit (min inputs supply minLimit, max inputs supply maxLimit). A caller can offset an input's opposite bound by one step to keep the thumbs apart without corrupting the limits.
 *
 * The $range magic provides access to:
 * - minLimit - The min attribute of the number-min and range-min inputs
 * - maxLimit - The max attribute of the number-max and range-max inputs
 * - minValue - The current minimum value
 * - maxValue - The current maximum value
 * - isDormant - Whether the range is at its default state (min at minLimit and max at maxLimit)
 *
 * @example
 *
 * <div x-range>
 *   <input type="number" min="0" max="100" x-range:number-min>
 *   <input type="range" min="0" max="100" x-range:range-min>
 *   <input type="range" min="0" max="100" x-range:range-max>
 *   <input type="number" min="0" max="100" x-range:number-max>
 * </div>
 *
 * @example
 * Range inputs only (use fill modifier):
 *
 * <div x-range>
 *   <input type="range" min="0" max="100" x-range:range-min.fill>
 *   <input type="range" min="0" max="100" x-range:range-max.fill>
 * </div>
 *
 */
export default function (Alpine) {
    Alpine.directive('range', ($el, data, utilities) => {
        if (data.value == 'number-min') {
            handleNumberMin($el, Alpine, utilities);
        }
        else if (data.value == 'number-max') {
            handleNumberMax($el, Alpine, utilities);
        }
        else if (data.value == 'range-min') {
            handleRangeMin($el, data, Alpine, utilities);
        }
        else if (data.value == 'range-max') {
            handleRangeMax($el, data, Alpine, utilities);
        }
        else if (data.value == null) {
            handleRoot($el, Alpine);
        }
        else {
            throw new Error(`Unknown directive: x-range:${data.value}`);
        }
    }).before('bind');
    Alpine.magic('range', ($el) => {
        const $data = Alpine.$data($el);
        return {
            get minLimit() {
                return $data.__range_minLimit;
            },
            get maxLimit() {
                return $data.__range_maxLimit;
            },
            get minValue() {
                return $data.__range_minValue;
            },
            get maxValue() {
                return $data.__range_maxValue;
            },
            get isDormant() {
                return $data.__range_isDormant;
            },
        };
    });
}
/**
 * Builds the x-init that publishes one input's limit into the shared range state.
 * Reads only the side that the input owns, since callers offset the opposite bound
 * by one step to keep the thumbs apart.
 */
function createLimitInit(directiveName, side, Alpine, { effect, cleanup }) {
    // Block the deferred effect setup when the element is removed first, since an effect created after cleanup never releases
    let removed = false;
    cleanup(() => {
        removed = true;
    });
    return function () {
        if (!this.$data.__range_isRoot) {
            warnMissingParentDirective(directiveName, 'x-range', this.$el);
            return;
        }
        // Use queueMicrotask to ensure Alpine's reactivity system is fully initialized
        // before setting up the element-bound effect that reads bound attributes
        queueMicrotask(() => {
            if (removed)
                return;
            effect(() => {
                const bound = Alpine.bound(this.$el, side, null);
                const boundNumber = bound !== null ? Number(bound) : null;
                // Validate that the limit is an actual number (not NaN) before storing
                const limit = boundNumber !== null && !isNaN(boundNumber) ? boundNumber : null;
                if (side === 'min') {
                    this.$data.__range_minLimit = limit;
                }
                else {
                    this.$data.__range_maxLimit = limit;
                }
            });
        });
    };
}
/**
 * Moves max one step above min when a min input meets or crosses it.
 * Uses the input's step, and <= includes equality so min === max cannot occur.
 */
function adjustMaxOnCollision() {
    if (this.$data.__range_maxValue !== null &&
        this.$data.__range_minValue !== null &&
        this.$data.__range_maxValue <= this.$data.__range_minValue) {
        const step = getStepValue(this.$el);
        this.$data.__range_maxValue = getNextStepValue(this.$data.__range_minValue, step, this.$data.__range_maxLimit);
    }
}
/**
 * Moves min one step below max when a max input meets or crosses it.
 * Uses the input's step, and <= includes equality so min === max cannot occur.
 */
function adjustMinOnCollision() {
    if (this.$data.__range_maxValue !== null &&
        this.$data.__range_minValue !== null &&
        this.$data.__range_maxValue <= this.$data.__range_minValue) {
        const step = getStepValue(this.$el);
        this.$data.__range_minValue = getPreviousStepValue(this.$data.__range_maxValue, step, this.$data.__range_minLimit);
    }
}
function handleNumberMin($el, Alpine, utilities) {
    if (isInputNumberElement($el)) {
        Alpine.bind($el, {
            'x-init': createLimitInit('x-range:number-min', 'min', Alpine, utilities),
            'x-model.number.fill': '$data.__range_minValue',
            '@input': adjustMaxOnCollision,
            '@morph:sync-control'() {
                this.$data.__range_minValue = getNumberInputValue(this.$el);
            },
        });
    }
    else {
        throw new Error(`Expected <input type="number"> tag for x-range:number-min but got ${$el}`);
    }
}
function handleNumberMax($el, Alpine, utilities) {
    if (isInputNumberElement($el)) {
        Alpine.bind($el, {
            'x-init': createLimitInit('x-range:number-max', 'max', Alpine, utilities),
            'x-model.number.fill': '$data.__range_maxValue',
            '@input': adjustMinOnCollision,
            '@morph:sync-control'() {
                this.$data.__range_maxValue = getNumberInputValue(this.$el);
            },
        });
    }
    else {
        throw new Error(`Expected <input type="number"> tag for x-range:number-max but got ${$el}`);
    }
}
function handleRangeMin($el, data, Alpine, utilities) {
    const fill = data.modifiers.includes('fill');
    if (isInputRangeElement($el)) {
        Alpine.bind($el, {
            'x-init': createLimitInit('x-range:range-min', 'min', Alpine, utilities),
            // Custom getter/setter for range inputs: when value is null/undefined, fallback to minLimit
            // This allows range inputs to display the limit value when empty (with fill modifier)
            // while keeping number inputs empty to preserve their placeholder state
            [`x-model.number${fill ? '.fill' : ''}`]() {
                const $data = Alpine.$data($el);
                return {
                    get() {
                        var _a;
                        return (_a = $data.__range_minValue) !== null && _a !== void 0 ? _a : $data.__range_minLimit;
                    },
                    set(value) {
                        $data.__range_minValue = value;
                    },
                };
            },
            '@input': adjustMaxOnCollision,
        });
    }
    else {
        throw new Error(`Expected <input type="range"> tag for x-range:range-min but got ${$el}`);
    }
}
function handleRangeMax($el, data, Alpine, utilities) {
    const fill = data.modifiers.includes('fill');
    if (isInputRangeElement($el)) {
        Alpine.bind($el, {
            'x-init': createLimitInit('x-range:range-max', 'max', Alpine, utilities),
            // Custom getter/setter for range inputs: when value is null/undefined, fallback to maxLimit
            // This allows range inputs to display the limit value when empty (with fill modifier)
            // while keeping number inputs empty to preserve their placeholder state
            [`x-model.number${fill ? '.fill' : ''}`]() {
                const $data = Alpine.$data($el);
                return {
                    get() {
                        var _a;
                        return (_a = $data.__range_maxValue) !== null && _a !== void 0 ? _a : $data.__range_maxLimit;
                    },
                    set(value) {
                        $data.__range_maxValue = value;
                    },
                };
            },
            '@input': adjustMinOnCollision,
        });
    }
    else {
        throw new Error(`Expected <input type="range"> tag for x-range:range-max but got ${$el}`);
    }
}
function handleRoot($el, Alpine) {
    Alpine.bind($el, {
        ['x-data']() {
            return {
                __range_isRoot: true,
                __range_numberMinEl: null,
                __range_numberMaxEl: null,
                __range_rangeMinEl: null,
                __range_rangeMaxEl: null,
                __range_minLimit: null,
                __range_maxLimit: null,
                __range_minValue: null,
                __range_maxValue: null,
                // Range is "dormant" when both values are at their default limits (or null)
                // Uses == null to check for both null and undefined
                get __range_isDormant() {
                    return ((this.__range_minValue == null || this.__range_minValue === this.__range_minLimit) &&
                        (this.__range_maxValue == null || this.__range_maxValue === this.__range_maxLimit));
                },
            };
        },
    });
}
/**
 * Extracts and validates step value from input element.
 * Defaults to 1 for invalid values (empty, 'any', NaN, or <= 0) to ensure
 * collision adjustments always have a valid step increment.
 */
function getStepValue($el) {
    const step = $el.step;
    if (step === '' || step === 'any') {
        return 1;
    }
    const stepNum = Number(step);
    return isNaN(stepNum) || stepNum <= 0 ? 1 : stepNum;
}
/** Read a server-synchronized number input back into the surviving range component. */
function getNumberInputValue($el) {
    return Number.isNaN($el.valueAsNumber) ? null : $el.valueAsNumber;
}
/**
 * Calculates next valid step value when adjusting max after collision.
 * Clamps to maxLimit if the step increment would exceed it.
 */
function getNextStepValue(value, step, maxLimit) {
    const next = value + step;
    return maxLimit !== null ? Math.min(next, maxLimit) : next;
}
/**
 * Calculates previous valid step value when adjusting min after collision.
 * Clamps to minLimit if the step decrement would fall below it.
 */
function getPreviousStepValue(value, step, minLimit) {
    const previous = value - step;
    return minLimit !== null ? Math.max(previous, minLimit) : previous;
}
