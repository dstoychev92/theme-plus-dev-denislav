var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { isReducedMotion } from '../utils/device';
import { animate as motionAnimate, scroll as motionScroll } from 'motion';
import { warnMissingParentDirective } from '../utils/error';
/**
 * Registers `x-scroll-stagger`, `x-scroll-stagger:enter`, and
 * `x-scroll-stagger:leave` for staggered Motion timelines tied to scroll
 * progress. The timeline scrubs with scroll, so scrolling back rewinds it.
 *
 * The options object takes {@link ScrollStaggerOptions} plus any extra Motion
 * keyframes, which hold the items' style while the root is fully visible. With no
 * extra keyframes, items hold the final values of the enter keyframes.
 *
 * A root taller than the viewport plays the enter sequence across its whole scroll
 * range and skips the visible and leave phases. With prefers-reduced-motion the items
 * hold their fully visible state and nothing scrubs.
 *
 * @example
 * ```html
 * <div
 *   x-scroll-stagger="{ selector: '[data-item]', stagger: 0.1 }"
 *   x-scroll-stagger:enter="{ opacity: [0, 1] }"
 *   x-scroll-stagger:leave="{ opacity: [1, 0] }"
 * >
 *   <span data-item>First</span>
 *   <span data-item>Second</span>
 * </div>
 * ```
 */
export default function scrollStagger(Alpine) {
    Alpine.directive('scroll-stagger', ($el, { expression, value }, { evaluate }) => {
        if (value == 'enter') {
            const keyframes = evaluate(expression);
            Alpine.bind($el, {
                'x-init'() {
                    if (!this.$data.__scrollStagger_isRoot) {
                        warnMissingParentDirective('x-scroll-stagger:enter', 'x-scroll-stagger', this.$el);
                        return;
                    }
                    this.$data.__scrollStagger_enterKeyframes = keyframes;
                },
            });
        }
        else if (value == 'leave') {
            const keyframes = evaluate(expression);
            Alpine.bind($el, {
                'x-init'() {
                    if (!this.$data.__scrollStagger_isRoot) {
                        warnMissingParentDirective('x-scroll-stagger:leave', 'x-scroll-stagger', this.$el);
                        return;
                    }
                    this.$data.__scrollStagger_leaveKeyframes = keyframes;
                },
            });
        }
        else {
            const _a = expression ? evaluate(expression) : {}, { selector: optionalSelector, stagger: optionalStagger, scrollOffset: optionalScrollOffset, target: optionalTarget } = _a, visibleKeyframes = __rest(_a, ["selector", "stagger", "scrollOffset", "target"]);
            const selector = optionalSelector || '[data-animate-stagger-item]';
            const stagger = optionalStagger || 0.2;
            const scrollOffset = optionalScrollOffset || ['25% 100%', '0% 50%', '0% 0%', '75% 0%'];
            const target = optionalTarget || $el;
            Alpine.bind($el, {
                'x-data'() {
                    return {
                        __scrollStagger_isRoot: true,
                        __scrollStagger_cancelScroll: null,
                        __scrollStagger_fitsInViewport: null,
                        __scrollStagger_wasFullyVisible: null,
                        __scrollStagger_isFullyVisible: null,
                        __scrollStagger_wasPartiallyVisible: null,
                        __scrollStagger_isPartiallyVisible: null,
                        __scrollStagger_enterKeyframes: {},
                        __scrollStagger_visibleKeyframes: visibleKeyframes,
                        __scrollStagger_leaveKeyframes: {},
                        get __scrollStagger_items() {
                            return Array.from($el.querySelectorAll(selector));
                        },
                        init() {
                            this.$watch('__scrollStagger_wasFullyVisible', (isFullyVisible) => {
                                this.__scrollStagger_wasFullyVisible = isFullyVisible;
                            });
                            this.$watch('__scrollStagger_wasPartiallyVisible', (isPartiallyVisible) => {
                                this.__scrollStagger_wasPartiallyVisible = isPartiallyVisible;
                            });
                        },
                        destroy() {
                            this.__scrollStagger_cancelScrollAnimation();
                        },
                        __scrollStagger_startScrollAnimation() {
                            if (this.__scrollStagger_cancelScroll !== null)
                                return;
                            const staggerItemDuration = 1.0;
                            const staggerItemOffset = stagger || 0.2;
                            const at = `-${staggerItemDuration * (1 - staggerItemOffset)}`;
                            const entrySequence = this.__scrollStagger_items.map((staggerElement) => [
                                staggerElement,
                                this.__scrollStagger_enterKeyframes,
                                { ease: 'easeOut', duration: staggerItemDuration, at },
                            ]);
                            const staticVisibleKeyframes = this.__scrollStagger_visibleKeyframes !== null &&
                                Object.keys(this.__scrollStagger_visibleKeyframes).length > 0
                                ? this.__scrollStagger_visibleKeyframes
                                : buildStaticKeyframes(this.__scrollStagger_enterKeyframes);
                            const visibleSequence = this.__scrollStagger_items.map((staggerElement) => [
                                staggerElement,
                                staticVisibleKeyframes,
                                { duration: staggerItemDuration, at, ease: 'easeOut' },
                            ]);
                            // Reduced-motion visitors get every item in its fully visible state, with no scroll scrubbing
                            if (isReducedMotion()) {
                                for (const staggerElement of this.__scrollStagger_items) {
                                    motionAnimate(staggerElement, staticVisibleKeyframes, { duration: 0 });
                                }
                                this.__scrollStagger_cancelScroll = () => { };
                                return;
                            }
                            const exitSequence = this.__scrollStagger_items.map((staggerElement) => [
                                staggerElement,
                                this.__scrollStagger_leaveKeyframes,
                                { ease: 'easeOut', duration: staggerItemDuration, at },
                            ]);
                            if (this.__scrollStagger_fitsInViewport == false) {
                                this.__scrollStagger_cancelScroll = motionScroll(motionAnimate(entrySequence), {
                                    target,
                                    offset: ['0% 100%', '100% 0%'],
                                });
                            }
                            else {
                                this.__scrollStagger_cancelScroll = motionScroll(motionAnimate([...entrySequence, ...visibleSequence, ...exitSequence]), { target, offset: scrollOffset });
                            }
                        },
                        __scrollStagger_cancelScrollAnimation() {
                            var _a;
                            (_a = this.__scrollStagger_cancelScroll) === null || _a === void 0 ? void 0 : _a.call(this);
                            this.__scrollStagger_cancelScroll = null;
                        },
                    };
                },
                'x-intersect:enter.threshold.0': '__scrollStagger_isPartiallyVisible = true',
                'x-intersect:leave.threshold.0': '__scrollStagger_isPartiallyVisible = false',
                'x-intersect:enter.full': '__scrollStagger_isFullyVisible = true',
                'x-intersect:leave.full': '__scrollStagger_isFullyVisible = false',
                async 'x-effect'() {
                    if (this.__scrollStagger_wasFullyVisible == null && this.__scrollStagger_isFullyVisible) {
                        this.__scrollStagger_startScrollAnimation();
                    }
                    else if (this.__scrollStagger_isFullyVisible == false) {
                        if (this.__scrollStagger_isPartiallyVisible == true) {
                            this.__scrollStagger_startScrollAnimation();
                        }
                        else if (this.__scrollStagger_wasPartiallyVisible == true &&
                            this.__scrollStagger_isPartiallyVisible == false) {
                            this.__scrollStagger_cancelScrollAnimation();
                        }
                    }
                },
                'x-resize'() {
                    this.__scrollStagger_fitsInViewport = this.$height <= window.innerHeight;
                },
            });
        }
    });
}
/**
 * Builds a "hold" frame for each animated property using the final enter-state
 * value so visible keyframes can be omitted from the directive config.
 *
 * @param enterKeyframes Motion keyframes from `x-scroll-stagger:enter`.
 * @returns Static keyframes that hold each property at its fully-entered value.
 *
 * @example
 * ```ts
 * buildStaticKeyframes({opacity: [0, 1]});
 * // => { opacity: [1, 1] }
 * ```
 */
function buildStaticKeyframes(enterKeyframes) {
    return Object.entries(enterKeyframes).reduce((keyframes, [key, value]) => {
        return Object.assign(Object.assign({}, keyframes), { [key]: Array.isArray(value) ? (value.length > 1 ? [value[1], value[1]] : value[0]) : [value, value] });
    }, {});
}
