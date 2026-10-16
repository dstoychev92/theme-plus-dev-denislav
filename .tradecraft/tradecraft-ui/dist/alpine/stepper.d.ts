import { Alpine as AlpineType, AlpineComponent } from 'alpinejs';
export type StepperComponent = AlpineComponent<{
    __stepper_isRoot: boolean;
    __stepper_inputEl: HTMLInputElement | null;
    __stepper_value: number | null;
    __stepper_decrement(): void;
    __stepper_increment(): void;
}>;
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
export default function (Alpine: AlpineType): void;
