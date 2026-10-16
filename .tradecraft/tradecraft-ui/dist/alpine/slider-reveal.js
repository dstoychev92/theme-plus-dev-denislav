import { springValue, styleEffect, transform, transformValue, scroll, motionValue, animate, } from 'motion';
import { motionArg } from '../utils/motion';
import { isLowPowerDevice, isReducedMotion } from '../utils/device';
import { getPercentageModifierValue, getPixelModifierValue, getSpringModifierConfig } from '../utils/modifiers';
import { onFirstLayout } from '../utils/layout-measure';
import { warnMissingParentDirective } from '../utils/error';
const SCROLL_PROGRESS_TO_REVEAL_PROGRESS_MULTIPLIER = 30;
const DEFAULT_EDGE_BUFFER_PX = 2;
const MIN_SPRING_MASS = 0.01;
const SPRING_DEFAULT_CONFIG = {
    stiffness: 300,
    damping: 30,
    mass: 0.05,
};
/**
 * Plugin to create an animated before/after slider reveal with optional scroll control.
 *
 * ## Directives
 *
 * - `x-slider-reveal` - Root element. Creates the reactive reveal state.
 * - `x-slider-reveal:handle` - Handle element translated by the reveal progress.
 * - `x-slider-reveal:reveal` - Reveal element clipped by the reveal progress.
 *
 * ## Root modifiers
 *
 * - `.vertical` - Uses vertical instead of horizontal movement.
 * - `.progress.<n>%` - Sets the resting reveal progress.
 * - `.from.<n>%` - Sets the animation's starting progress before it settles to `.progress`.
 * - `.mass.<n>` - Spring mass scale for the reveal spring. `.mass.50` equals `0.5`.
 * - `.stiffness.<n>` - Spring stiffness. Higher values settle faster.
 * - `.damping.<n>` - Spring damping. Higher values reduce overshoot.
 * - `.edge-buffer.<n>px` - Keeps the handle this many pixels away from the root edge. Defaults to `2px`.
 *
 * ## Magic
 *
 * - `$sliderReveal.progress` - The reveal progress, 0-100. Settable; values clamp to the handle's allowed range.
 * - `$sliderReveal.progressValue` - The underlying MotionValue.
 * - `$sliderReveal.enableScroll()` / `$sliderReveal.disableScroll()` - Start and stop driving the progress
 *   from page scroll. `enableScroll` first animates from `.from` to `.progress`, and does nothing when the
 *   user prefers reduced motion or the device reports low power.
 *
 * @example
 *
 * ```html
 * <div x-slider-reveal.progress.65%.from.10%.stiffness.240.damping.35.mass.50.edge-buffer.4px>
 *   <div x-slider-reveal:reveal>After</div>
 *   <div x-slider-reveal:handle></div>
 * </div>
 * ```
 */
export default function (Alpine) {
    Alpine.directive('slider-reveal', ($el, data) => {
        if (data.value == 'handle') {
            handleHandle($el, Alpine, data);
        }
        else if (data.value == 'reveal') {
            handleReveal($el, Alpine, data);
        }
        else if (data.value == null) {
            handleRoot($el, Alpine, data);
        }
        else {
            throw new Error(`Unknown directive: x-slider-reveal:${data.value}`);
        }
    }).before('bind');
    Alpine.magic('sliderReveal', handleSliderRevealMagic(Alpine));
}
function handleHandle($el, Alpine, _data) {
    Alpine.bind($el, {
        'x-init'() {
            if (!this.__sliderReveal_isRoot) {
                warnMissingParentDirective('x-slider-reveal:handle', 'x-slider-reveal', this.$el);
                return;
            }
            this.__sliderReveal_handle = this.$el;
        },
    });
}
function handleReveal($el, Alpine, _data) {
    Alpine.bind($el, {
        'x-init'() {
            if (!this.__sliderReveal_isRoot) {
                warnMissingParentDirective('x-slider-reveal:reveal', 'x-slider-reveal', this.$el);
                return;
            }
            this.__sliderReveal_reveal = this.$el;
        },
    });
}
function handleRoot($el, Alpine, data) {
    var _a, _b;
    const orientation = data.modifiers.includes('vertical') ? 'vertical' : 'horizontal';
    const edgeBufferPx = (_a = getPixelModifierValue(data.modifiers, 'edge-buffer')) !== null && _a !== void 0 ? _a : DEFAULT_EDGE_BUFFER_PX;
    const startProgress = (_b = getPercentageModifierValue(data.modifiers, 'progress')) !== null && _b !== void 0 ? _b : 0;
    const fromProgress = getPercentageModifierValue(data.modifiers, 'from');
    const springConfig = getSpringModifierConfig(data.modifiers, SPRING_DEFAULT_CONFIG, MIN_SPRING_MASS);
    let initialProgress = startProgress;
    if (fromProgress !== null) {
        initialProgress = Number(fromProgress);
    }
    Alpine.bind($el, {
        'x-data'() {
            return {
                __sliderReveal_isRoot: true,
                __sliderReveal_rootEl: $el,
                __sliderReveal_progressValue: reactiveMotionValue(Alpine, initialProgress),
                __sliderReveal_progressSpringValue: null,
                __sliderReveal_startProgress: startProgress,
                __sliderReveal_handle: null,
                __sliderReveal_reveal: null,
                __sliderReveal_cancelFirstLayout: null,
                __sliderReveal_scrollAnimationFn: null,
                __sliderReveal_startAnimationFn: null,
                __sliderReveal_stopHandleStyleEffect: null,
                __sliderReveal_stopRevealStyleEffect: null,
                init() {
                    // onFirstLayout fires post-layout, pre-paint: the measurements below are free
                    // and the styleEffects still apply in the same frame's paint.
                    this.__sliderReveal_cancelFirstLayout = onFirstLayout(this.$el, () => {
                        this.__sliderReveal_cancelFirstLayout = null;
                        // Normalize the configured start values once layout exists so handle overflow clamps
                        // can be applied before either the spring or reveal effect starts rendering.
                        const effectiveInitialProgress = this.__sliderReveal_getEffectiveProgress(initialProgress);
                        this.__sliderReveal_startProgress = this.__sliderReveal_getEffectiveProgress(startProgress);
                        this.__sliderReveal_progressValue.set(effectiveInitialProgress);
                        this.__sliderReveal_progressSpringValue = springValue(motionArg(this.__sliderReveal_progressValue), springConfig);
                        if (this.__sliderReveal_handle) {
                            this.__sliderReveal_stopHandleStyleEffect = styleEffect(this.__sliderReveal_handle, {
                                transform: transformValue(() => getHandleTransform(this.__sliderReveal_progressSpringValue.get(), orientation, this.$el, this.__sliderReveal_handle, edgeBufferPx)),
                            });
                        }
                        if (this.__sliderReveal_reveal) {
                            this.__sliderReveal_stopRevealStyleEffect = styleEffect(this.__sliderReveal_reveal, {
                                // Use the same clamped progress as the handle so spring overshoot never lets
                                // the reveal drift past the stopped handle position at the root edge.
                                clipPath: transformValue(() => getRevealClipPath(this.__sliderReveal_getEffectiveProgress(this.__sliderReveal_progressSpringValue.get()), orientation)),
                            });
                        }
                    });
                },
                destroy() {
                    var _a, _b, _c, _d, _e, _f;
                    (_a = this.__sliderReveal_cancelFirstLayout) === null || _a === void 0 ? void 0 : _a.call(this);
                    this.__sliderReveal_cancelFirstLayout = null;
                    this.__sliderReveal_disableScroll();
                    (_b = this.__sliderReveal_stopHandleStyleEffect) === null || _b === void 0 ? void 0 : _b.call(this);
                    (_c = this.__sliderReveal_stopRevealStyleEffect) === null || _c === void 0 ? void 0 : _c.call(this);
                    (_e = (_d = this.__sliderReveal_progressSpringValue) === null || _d === void 0 ? void 0 : _d.stop) === null || _e === void 0 ? void 0 : _e.call(_d);
                    (_f = this.__sliderReveal_startAnimationFn) === null || _f === void 0 ? void 0 : _f.stop();
                    this.__sliderReveal_startAnimationFn = null;
                },
                __sliderReveal_getEffectiveProgress(progress) {
                    return getEffectiveProgress(progress, orientation, this.__sliderReveal_rootEl, this.__sliderReveal_handle, edgeBufferPx);
                },
                async __sliderReveal_enableScroll() {
                    if (this.__sliderReveal_scrollAnimationFn)
                        return;
                    if (isLowPowerDevice() || isReducedMotion())
                        return;
                    if (this.__sliderReveal_startAnimationFn == null) {
                        await this.__sliderReveal_animateToStartProgress();
                    }
                    else if (this.__sliderReveal_startAnimationFn.state == 'running') {
                        return;
                    }
                    let lastScrollProgress = null;
                    this.__sliderReveal_scrollAnimationFn = scroll((scrollProgress) => {
                        if (lastScrollProgress == null) {
                            lastScrollProgress = scrollProgress;
                            return;
                        }
                        const progressDelta = scrollProgress - lastScrollProgress;
                        lastScrollProgress = scrollProgress;
                        this.__sliderReveal_progressValue.set(
                        // Clamp the model value itself so the bound range input, handle, and reveal
                        // all agree once the handle reaches its visible edge.
                        this.__sliderReveal_getEffectiveProgress(this.__sliderReveal_progressValue.get() +
                            progressDelta * SCROLL_PROGRESS_TO_REVEAL_PROGRESS_MULTIPLIER));
                    }, {
                        target: $el,
                        offset: ['end start', 'start end'],
                    });
                },
                __sliderReveal_disableScroll() {
                    var _a;
                    (_a = this.__sliderReveal_scrollAnimationFn) === null || _a === void 0 ? void 0 : _a.call(this);
                    this.__sliderReveal_scrollAnimationFn = null;
                },
                async __sliderReveal_animateToStartProgress() {
                    if (this.__sliderReveal_startAnimationFn)
                        return;
                    const effectiveFromProgress = fromProgress == null
                        ? this.__sliderReveal_progressValue.get()
                        : this.__sliderReveal_getEffectiveProgress(fromProgress);
                    this.__sliderReveal_startAnimationFn = animate(motionArg(this.__sliderReveal_progressValue), [effectiveFromProgress, this.__sliderReveal_startProgress], {
                        duration: 0.3,
                        ease: 'easeInOut',
                    });
                    return this.__sliderReveal_startAnimationFn.finished;
                },
            };
        },
    });
}
function clampProgress(progress) {
    return Math.max(0, Math.min(100, progress));
}
function getEffectiveProgress(progress, orientation, rootEl, handleEl, edgeBufferPx) {
    const boundedProgress = clampProgress(progress);
    if (rootEl == null || handleEl == null)
        return boundedProgress;
    // Clamp in handle-space first, then convert back to progress so every consumer
    // can share one "effective" progress value.
    const translateAmount = getClampedHandleTranslateAmount(boundedProgress, orientation, rootEl, handleEl, edgeBufferPx);
    return getProgressFromHandleTranslateAmount(translateAmount, orientation, rootEl);
}
function getProgressFromHandleTranslateAmount(translateAmount, orientation, rootEl) {
    const rootRect = rootEl.getBoundingClientRect();
    const rootSize = orientation === 'vertical' ? rootRect.height : rootRect.width;
    const directionMultiplier = document.dir === 'rtl' ? -1 : 1;
    if (rootSize === 0)
        return 0;
    return clampProgress((translateAmount / (directionMultiplier * rootSize)) * 100);
}
function getHandleTransform(progress, orientation, rootEl, handleEl, edgeBufferPx) {
    const translateAmount = getClampedHandleTranslateAmount(progress, orientation, rootEl, handleEl, edgeBufferPx);
    if (orientation === 'vertical') {
        return `translateY(${translateAmount}px)`;
    }
    return `translateX(${translateAmount}px)`;
}
function getClampedHandleTranslateAmount(progress, orientation, rootEl, handleEl, edgeBufferPx) {
    const rootRect = rootEl.getBoundingClientRect();
    const rootSize = orientation === 'vertical' ? rootRect.height : rootRect.width;
    const directionMultiplier = document.dir === 'rtl' ? -1 : 1;
    // Clamp in LTR-equivalent space (0…rootSize). RTL applies a sign after clamping; otherwise
    // negative desired values always hit Math.max(min, …) when min/max are positive edge bounds.
    const progressBasedTranslate = (progress / 100) * rootSize;
    const handleContentBounds = getHandleContentBounds(handleEl, orientation);
    if (handleContentBounds == null)
        return directionMultiplier * progressBasedTranslate;
    const handleRect = handleEl.getBoundingClientRect();
    const handleStart = orientation === 'vertical' ? handleRect.top : handleRect.left;
    const contentStartOffset = handleContentBounds.start - handleStart;
    const contentEndOffset = handleContentBounds.end - handleStart;
    const minTranslateAmount = edgeBufferPx - contentStartOffset;
    const maxTranslateAmount = rootSize - edgeBufferPx - contentEndOffset;
    const clampedProgressBasedTranslate = Math.max(minTranslateAmount, Math.min(maxTranslateAmount, progressBasedTranslate));
    return directionMultiplier * clampedProgressBasedTranslate;
}
function getHandleContentBounds(handleEl, orientation) {
    const descendantEls = Array.from(handleEl.querySelectorAll('*'));
    if (descendantEls.length === 0)
        return null;
    let start = Number.POSITIVE_INFINITY;
    let end = Number.NEGATIVE_INFINITY;
    for (const descendantEl of descendantEls) {
        const descendantRect = descendantEl.getBoundingClientRect();
        if (orientation === 'vertical') {
            start = Math.min(start, descendantRect.top);
            end = Math.max(end, descendantRect.bottom);
        }
        else {
            start = Math.min(start, descendantRect.left);
            end = Math.max(end, descendantRect.right);
        }
    }
    return { start, end };
}
function getRevealClipPath(progress, orientation) {
    const progressToPercent = transform([0, 100], ['0%', '100%']);
    const percentProgress = progressToPercent(progress);
    if (orientation === 'vertical') {
        return document.dir === 'rtl' ? `inset(0% 0% ${percentProgress} 0%)` : `inset(${percentProgress} 0% 0% 0%)`;
    }
    return document.dir === 'rtl' ? `inset(0% ${percentProgress} 0% 0%)` : `inset(0% 0% 0% ${percentProgress})`;
}
function handleSliderRevealMagic(Alpine) {
    return function ($el) {
        const $data = Alpine.$data($el);
        return {
            get progressValue() {
                return $data.__sliderReveal_progressValue;
            },
            get progress() {
                var _a, _b;
                return (_b = (_a = $data.__sliderReveal_progressValue) === null || _a === void 0 ? void 0 : _a.get) === null || _b === void 0 ? void 0 : _b.call(_a);
            },
            set progress(value) {
                var _a, _b;
                (_b = (_a = $data.__sliderReveal_progressValue) === null || _a === void 0 ? void 0 : _a.set) === null || _b === void 0 ? void 0 : _b.call(_a, $data.__sliderReveal_getEffectiveProgress(value));
            },
            enableScroll() {
                $data.__sliderReveal_enableScroll();
            },
            disableScroll() {
                $data.__sliderReveal_disableScroll();
            },
        };
    };
}
/**
 * Creates a reactive motion value that updates Alpine state when the motion value changes.
 * Used by slider-reveal for before-after progress.
 */
export function reactiveMotionValue(_Alpine, initialMotionValue) {
    const value = motionValue(initialMotionValue);
    const reactiveValue = _Alpine.reactive({ value: value.get() });
    value.on('change', (newValue) => {
        reactiveValue.value = newValue;
    });
    return new Proxy(value, {
        get(target, prop, receiver) {
            if (prop === 'get') {
                reactiveValue.value;
            }
            return Reflect.get(target, prop, receiver);
        },
    });
}
