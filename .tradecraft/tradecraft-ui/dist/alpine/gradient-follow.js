import { springValue, styleEffect, transformValue } from 'motion';
import { isTouchOnlyDevice } from '../utils/dom';
// Off the top-left corner. Styles using this directive should declare the same values as
// their own fallbacks, so the resting look is identical before the first hover and on
// devices where the directive does nothing.
const HOME_POSITION_PERCENT = -10;
// Stiffness is responsiveness (higher is snappier); damping is friction (higher overshoots less).
const SPRING_CONFIG = { stiffness: 80, damping: 25 };
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
export default function (Alpine) {
    Alpine.directive('gradient-follow', ($el, _data, { cleanup }) => {
        // Decide before building anything: there is no pointer for the gradient to follow on
        // a touch device, and the CSS fallbacks already give those devices the resting look.
        if (isTouchOnlyDevice())
            return;
        const xPercent = springValue(HOME_POSITION_PERCENT, SPRING_CONFIG);
        const yPercent = springValue(HOME_POSITION_PERCENT, SPRING_CONFIG);
        let width = 0;
        let height = 0;
        const stopStyleEffect = styleEffect($el, {
            '--btn-gradient-x': transformValue(() => `${xPercent.get()}%`),
            '--btn-gradient-y': transformValue(() => `${yPercent.get()}%`),
        });
        Alpine.bind($el, {
            '@pointerenter'() {
                // Measured on entry rather than on every move, so a move only costs arithmetic.
                const rect = $el.getBoundingClientRect();
                width = rect.width;
                height = rect.height;
                xPercent.set((this.$event.offsetX / width) * 100);
                yPercent.set((this.$event.offsetY / height) * 100);
            },
            '@pointermove'() {
                // A move can arrive before any entry on a re-rendered element, leaving nothing
                // to measure against.
                if (width === 0 || height === 0)
                    return;
                xPercent.set((this.$event.offsetX / width) * 100);
                yPercent.set((this.$event.offsetY / height) * 100);
            },
            '@pointerleave'() {
                xPercent.set(HOME_POSITION_PERCENT);
                yPercent.set(HOME_POSITION_PERCENT);
            },
        });
        cleanup(() => {
            stopStyleEffect();
            xPercent.stop();
            yPercent.stop();
        });
    }).before('bind');
}
