import { Alpine as AlpineType, AlpineComponent } from 'alpinejs';
import { type MotionValue } from 'motion';
export type CursorPositionComponent = AlpineComponent<{
    __cursorPosition_x: MotionValue<number>;
    __cursorPosition_y: MotionValue<number>;
    __cursorPosition_stopStyleEffect: VoidFunction | null;
    __cursorPosition_width: number;
    __cursorPosition_height: number;
}>;
/**
 * Publishes where the pointer sits inside an element as two CSS custom properties,
 * `--cursor-x` and `--cursor-y`, each a percentage of the element's own width and
 * height. Styles can then follow the cursor without any JavaScript of their own —
 * a glow that tracks the pointer across a button, for example.
 *
 * The values are driven by motion values rather than written straight to the element,
 * so a rapid burst of pointer moves settles into one style write per frame.
 *
 * ## Touch devices
 *
 * On a device whose main pointer cannot hover (a phone or tablet) the directive does
 * nothing at all — no motion values, no style effect, no pointer listeners. There is
 * no cursor to follow there, so anything reading these properties should carry its own
 * fallback, e.g. `var(--cursor-x, 50%)`, or sit inside `@media (pointer: fine)`.
 *
 * @example
 * ```html
 * <button x-cursor-position class="relative overflow-hidden">
 *   Hover me
 * </button>
 * ```
 * ```css
 * button::after {
 *   background: radial-gradient(
 *     circle at var(--cursor-x, 50%) var(--cursor-y, 50%),
 *     white,
 *     transparent
 *   );
 * }
 * ```
 */
export default function (Alpine: AlpineType): void;
