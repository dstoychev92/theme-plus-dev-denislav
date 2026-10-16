import { motionValue, styleEffect, transformValue } from 'motion';
import { isTouchOnlyDevice } from '../utils/dom';
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
export default function (Alpine) {
    Alpine.directive('cursor-position', ($el) => {
        // Decide before building anything: on a touch device every element carrying this
        // directive would otherwise pay for two motion values, a style effect with two
        // transforms and three pointer listeners, to drive properties nothing can see.
        if (isTouchOnlyDevice())
            return;
        Alpine.bind($el, {
            ['x-data']() {
                return {
                    __cursorPosition_x: motionValue(0),
                    __cursorPosition_y: motionValue(0),
                    __cursorPosition_stopStyleEffect: null,
                    __cursorPosition_width: 0,
                    __cursorPosition_height: 0,
                    init() {
                        this.__cursorPosition_stopStyleEffect = styleEffect($el, {
                            '--cursor-x': transformValue(() => `${this.__cursorPosition_x.get()}%`),
                            '--cursor-y': transformValue(() => `${this.__cursorPosition_y.get()}%`),
                        });
                    },
                    destroy() {
                        var _a;
                        (_a = this.__cursorPosition_stopStyleEffect) === null || _a === void 0 ? void 0 : _a.call(this);
                        this.__cursorPosition_stopStyleEffect = null;
                        Alpine.raw(this.__cursorPosition_x).stop();
                        Alpine.raw(this.__cursorPosition_y).stop();
                    },
                };
            },
            '@pointerenter'() {
                // The element is measured on entry rather than on every move, so a move only
                // costs arithmetic. Re-measuring here keeps a resized element correct.
                const { width, height } = $el.getBoundingClientRect();
                this.__cursorPosition_width = width;
                this.__cursorPosition_height = height;
                // jump() rather than set() so the effect starts under the pointer instead of
                // travelling there from wherever it was left.
                Alpine.raw(this.__cursorPosition_x).jump((this.$event.offsetX / width) * 100);
                Alpine.raw(this.__cursorPosition_y).jump((this.$event.offsetY / height) * 100);
            },
            '@pointermove'() {
                // A move can arrive before any entry on a re-rendered element, leaving nothing
                // to measure against.
                if (this.__cursorPosition_width === 0 || this.__cursorPosition_height === 0)
                    return;
                Alpine.raw(this.__cursorPosition_x).set((this.$event.offsetX / this.__cursorPosition_width) * 100);
                Alpine.raw(this.__cursorPosition_y).set((this.$event.offsetY / this.__cursorPosition_height) * 100);
            },
            '@pointerleave'() {
                // Leave the values at the edge the pointer left through, so a style that fades
                // out on leave fades from the right place.
                Alpine.raw(this.__cursorPosition_x).set((this.$event.offsetX / this.__cursorPosition_width) * 100);
                Alpine.raw(this.__cursorPosition_y).set((this.$event.offsetY / this.__cursorPosition_height) * 100);
            },
        });
    }).before('bind');
}
