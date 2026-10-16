import { Alpine as AlpineType } from 'alpinejs';
/**
 * Springs a gradient's centre point toward the pointer, as the CSS custom properties
 * `--btn-gradient-x` and `--btn-gradient-y` (percentages of the element's own size).
 *
 * Unlike {@link cursorPosition}, which reports the pointer's position exactly, this
 * eases toward it and drifts back to a resting point off the top-left corner when the
 * pointer leaves — so a gradient blob follows the pointer with some weight behind it.
 *
 * ## Touch devices
 *
 * On a device whose main pointer cannot hover (a phone or tablet) the directive does
 * nothing at all — no spring values, no style effect, no pointer listeners. Declare the
 * resting position as a CSS fallback so those devices still get the resting look:
 * `var(--btn-gradient-x, -10%)`.
 *
 * @example
 * ```html
 * <button x-gradient-follow class="btn-gradient">Hover me</button>
 * ```
 * ```css
 * .btn-gradient {
 *   background: radial-gradient(
 *     ellipse 110% 340% at var(--btn-gradient-x, -10%) var(--btn-gradient-y, -10%),
 *     var(--btn-gradient-from),
 *     var(--btn-gradient-to)
 *   );
 * }
 * ```
 */
export default function (Alpine: AlpineType): void;
