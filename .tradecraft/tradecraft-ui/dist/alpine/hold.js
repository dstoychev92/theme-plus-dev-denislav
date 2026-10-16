import { isHtmlElement } from '../utils/dom';
import { isNumeric } from '../utils/math';
const DEFAULT_MAX_REPEAT_TIME_IN_MS = 1500;
/**
 * Allow repeatedly triggering an action while the mouse is held down or while element is being touched
 *
 * e.g.
 *
 * <button x-hold.250ms="console.log('clicked')">Hold me down</button>
 */
export default function (Alpine) {
    Alpine.directive('hold', ($el, { modifiers, expression }, { evaluate }) => {
        if (!isHtmlElement($el)) {
            throw new Error(`Expected HTMLElement but got ${$el}`);
        }
        let firstModifier = modifiers[0] || '';
        let time = isNumeric(firstModifier.split('ms')[0]) ? Number(firstModifier.split('ms')[0]) : 25;
        let maxModifierIndex = modifiers.indexOf('max');
        let maxValueModifier = modifiers[maxModifierIndex + 1];
        let maxTime = isNumeric(maxValueModifier === null || maxValueModifier === void 0 ? void 0 : maxValueModifier.split('ms')[0])
            ? Number(maxValueModifier.split('ms')[0])
            : DEFAULT_MAX_REPEAT_TIME_IN_MS;
        Alpine.bind($el, {
            ['x-data']() {
                return {
                    __intervalId: undefined,
                    __onPointerDown(e) {
                        var _a;
                        if (isHtmlElement(e.target)) {
                            if ((_a = e.target) === null || _a === void 0 ? void 0 : _a.hasPointerCapture(e.pointerId)) {
                                e.target.releasePointerCapture(e.pointerId);
                            }
                        }
                        let repeats = 0;
                        this.__intervalId = window.setInterval(() => {
                            evaluate(expression);
                            repeats += 1;
                            if (repeats * time >= maxTime) {
                                // Automatically stop the intervals after a certain amount of time
                                // in case somehow the pointerup event is not triggered or there is some
                                // other bug that causes the interval to not be cleared
                                window.clearInterval(this.__intervalId);
                            }
                        }, time);
                    },
                    __onPointerUp(_e) {
                        window.clearInterval(this.__intervalId);
                    },
                    __onPointerLeave(_e) {
                        window.clearInterval(this.__intervalId);
                    },
                    destroy() {
                        window.clearInterval(this.__intervalId);
                    },
                };
            },
            '@pointerdown': '__onPointerDown',
            '@pointerup.window': '__onPointerUp',
            '@pointerleave': '__onPointerLeave',
        });
    }).before('bind');
}
