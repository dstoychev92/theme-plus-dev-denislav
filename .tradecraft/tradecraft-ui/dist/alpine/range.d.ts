import { Alpine as AlpineType, AlpineComponent } from 'alpinejs';
export type RangeComponent = AlpineComponent<{
    __range_numberMinEl: HTMLInputElement | null;
    __range_numberMaxEl: HTMLInputElement | null;
    __range_rangeMinEl: HTMLInputElement | null;
    __range_rangeMaxEl: HTMLInputElement | null;
    __range_minLimit: number | null;
    __range_maxLimit: number | null;
    __range_minValue: number | null;
    __range_maxValue: number | null;
    __range_isRoot: boolean;
    get __range_isDormant(): boolean;
}>;
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
export default function (Alpine: AlpineType): void;
