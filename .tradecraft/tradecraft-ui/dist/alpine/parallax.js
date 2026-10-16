import { animate, inView, motionValue, scroll, styleEffect, supportsScrollTimeline, supportsViewTimeline, transform, transformValue, } from 'motion';
import { isHtmlElement } from '../utils';
import { motionArg } from '../utils/motion';
import { isLowPowerDevice, isReducedMotion } from '../utils/device';
import { getModifierValue } from '../utils/modifiers';
/** Scroll range for an element: progress 0 = element top at viewport bottom, 1 = element bottom at viewport top. */
function getElementScrollRange(el, viewportHeight = window.innerHeight) {
    const rect = el.getBoundingClientRect();
    const elementTopDoc = rect.top + window.scrollY;
    const elementHeight = rect.height;
    const scrollYStart = elementTopDoc - viewportHeight;
    const scrollYEnd = elementTopDoc + elementHeight;
    return { scrollYStart, scrollRange: scrollYEnd - scrollYStart };
}
/** Maps a page scroll position onto an element's scroll range, clamped to [0, 1]. */
function getScrollProgress(scrollY, range) {
    if (range.scrollRange <= 0)
        return 0;
    return Math.max(0, Math.min(1, (scrollY - range.scrollYStart) / range.scrollRange));
}
function translate3d(axis, distance, unit = '') {
    const value = `${distance}${unit}`;
    return axis === 'x' ? `translate3d(${value}, 0, 0)` : `translate3d(0, ${value}, 0)`;
}
/**
 * A ViewTimeline follows the subject's nearest scroll container and its rendered position. Use a
 * page ScrollTimeline instead when an overflow ancestor or sticky positioning would detach that
 * progress from page scroll. The `sticky-column` class is checked even before its responsive
 * `position: sticky` rule becomes active.
 */
function canUsePageViewTimeline(el) {
    const createsScrollContainer = (overflow) => overflow !== 'visible' && overflow !== 'clip';
    let node = el;
    while (node && node !== document.body && node !== document.documentElement) {
        const styles = getComputedStyle(node);
        if (styles.position === 'sticky' || styles.position === 'fixed' || node.classList.contains('sticky-column')) {
            return false;
        }
        if (node !== el && (createsScrollContainer(styles.overflowX) || createsScrollContainer(styles.overflowY))) {
            return false;
        }
        node = node.parentElement;
    }
    return true;
}
/**
 * Motion can create a ViewTimeline for its four preset offsets, but its scroll() options cannot
 * express the fixed inset used here or switch a target animation to a page ScrollTimeline with an
 * element-specific pixel range. Those two controls keep iOS viewport chrome, sticky roots, and
 * overflow ancestors from changing or stalling the parallax range.
 */
function createNativeTimeline(rootEl, initialViewportHeight, range) {
    const timelineWindow = window;
    if (supportsViewTimeline() && canUsePageViewTimeline(rootEl)) {
        try {
            return {
                // Pin the visibility range's bottom edge to the initial viewport height. Without this,
                // Safari's collapsing URL bar changes ViewTimeline progress even when page scrollY does not.
                timeline: new timelineWindow.ViewTimeline({
                    subject: rootEl,
                    axis: 'block',
                    inset: `0px calc(100% - ${initialViewportHeight}px)`,
                }),
                rangeStart: 'cover 0%',
                rangeEnd: 'cover 100%',
            };
        }
        catch (_a) {
            // A browser can expose ViewTimeline before supporting the inset syntax used above.
        }
    }
    const scrollSource = document.scrollingElement;
    if (supportsScrollTimeline() && scrollSource) {
        try {
            return {
                // Absolute pixel ranges preserve the page-scroll behavior for sticky/overflow roots and
                // partial ViewTimeline implementations without returning to per-frame JavaScript.
                timeline: new timelineWindow.ScrollTimeline({ source: scrollSource, axis: 'block' }),
                rangeStart: `${range.scrollYStart}px`,
                rangeEnd: `${range.scrollYStart + range.scrollRange}px`,
            };
        }
        catch (_b) {
            // Fall through to the JavaScript path on partial implementations.
        }
    }
    return null;
}
/**
 * Adds a parallax effect on an element based on the scroll position of its root.
 *
 * ## Directives
 *
 * - `x-parallax` - Root element whose viewport traversal defines the timeline.
 * - `x-parallax:element` - Element translated by the root's timeline progress.
 *
 * ## Element modifiers
 *
 * - `.distance.<n>px` / `.distance.<n>%` / `.distance.<n>vh` - Travel distance (default `10px`). `%` is a CSS translate percentage, relative to the element's own size.
 * - `.reverse` - Moves the element against the scroll direction.
 * - `.horizontal` - Translates on the x axis instead of the y axis.
 *
 * Root progress runs from 0, when the root's top edge meets the bottom of the viewport, to 1, when
 * its bottom edge meets the top of the viewport. Each element's offset counts from the root's
 * progress when parallax first starts, so an element that is already on screen does not jump.
 *
 * Native ViewTimeline/ScrollTimeline animations run without per-frame JavaScript. An element
 * attaches its effect once when its root first enters the viewport and keeps the same anchor across
 * re-entry. Browsers without either API share one JavaScript listener per visible active root; that
 * listener stops off screen and is synchronously seeded on re-entry. Roots with no parallax element
 * or `$parallax` consumer never install scroll tracking.
 *
 * Does nothing when the user prefers reduced motion or the device reports low power.
 * Parallax elements should have `will-change: transform` to improve performance.
 *
 * `x-parallax:element` with no parent `x-parallax` does nothing, so a snippet can carry the
 * directive and still be used outside a parallax root.
 *
 * @example
 *
 * <div
 *   class="relative flex justify-center items-center overflow-hidden h-[200px]"
 *   x-parallax
 * >
 *   <div
 *     class="absolute will-change-transform flex justify-center items-center min-h-full w-full h-[180%] text-white"
 *     x-parallax:element.distance.200px
 *   >
 *     Parallax child
 *   </div>
 * </div>
 */
export default function (Alpine) {
    Alpine.directive('parallax', ($el, data, { cleanup, effect, evaluate }) => {
        if (!isHtmlElement($el)) {
            throw new Error(`Expected HTMLElement but got ${$el}`);
        }
        if (data.value === 'element') {
            handleElement($el, Alpine, data);
        }
        else if (data.value === null) {
            handleRoot($el, Alpine);
        }
        else {
            throw new Error(`Unknown directive: x-parallax:${data.value}`);
        }
    }).before('bind');
    /**
     * Magic providing access to the nearest parallax root's scroll state.
     * Use within a parallax root (or any descendant) to read the shared scroll progress. Reading it
     * enables the lazy JavaScript tracker because native element animations do not update this value.
     *
     * @example
     * <div x-parallax>
     *   <div x-effect="$parallax.scrollValue?.get() && ...">...</div>
     * </div>
     */
    Alpine.magic('parallax', ($el) => {
        var _a;
        const scopedData = Alpine.$data($el);
        const rootData = scopedData.__rootEl ? Alpine.$data(scopedData.__rootEl) : scopedData;
        (_a = rootData.__parallaxRoot_requestScrollTracking) === null || _a === void 0 ? void 0 : _a.call(rootData);
        return {
            get scrollValue() {
                return Alpine.raw(rootData.__parallaxElement_scrollValue);
            },
        };
    });
}
function handleElement($el, Alpine, data) {
    let parallaxDistance = 10;
    let parallaxUnit = 'px';
    const reverse = data.modifiers.includes('reverse');
    const horizontal = data.modifiers.includes('horizontal');
    const rawDistanceValue = getModifierValue(data.modifiers, 'distance');
    if (rawDistanceValue != null) {
        // Support x-parallax:element.200px which will move the element up or down by 200px
        const pxMatch = rawDistanceValue.match(/(-?[0-9]+)px/);
        if (pxMatch) {
            parallaxDistance = Number(pxMatch[1]);
            parallaxUnit = 'px';
        }
        const percentageMatch = rawDistanceValue.match(/(-?[0-9]+)%/);
        if (percentageMatch) {
            parallaxDistance = Number(percentageMatch[1]);
            parallaxUnit = '%';
        }
        const vhMatch = rawDistanceValue.match(/(-?[0-9]+)vh/);
        if (vhMatch) {
            parallaxDistance = Number(vhMatch[1]);
            parallaxUnit = 'vh';
        }
    }
    Alpine.bind($el, {
        ['x-data']() {
            return {
                __parallaxElement_styleEffect: null,
                __parallaxElement_cancelInView: null,
                init() {
                    // No parent x-parallax means no scroll value to follow, so do nothing. Markup that
                    // shares a snippet between parallax and non-parallax placements relies on this.
                    if (!this.__rootEl)
                        return;
                    if (isReducedMotion() || isLowPowerDevice())
                        return;
                    const rootEl = this.__rootEl;
                    this.$nextTick(() => {
                        // Attach once when the root first comes on screen. The root is the subject, not the
                        // element: the element's transform or x-show state must not control its lifecycle.
                        this.__parallaxElement_cancelInView = inView(rootEl, () => {
                            this.__parallaxElement_setupScroll();
                        });
                    });
                },
                __parallaxElement_setupScroll() {
                    if (this.__parallaxElement_styleEffect)
                        return;
                    const rootEl = this.__rootEl;
                    if (!rootEl)
                        return;
                    // Alpine child data inherits the root scope. Resolve the root's own data object so root
                    // methods cannot accidentally bind `this` to the child component.
                    const root = Alpine.$data(rootEl);
                    const { anchorProgress } = root.__parallaxRoot_ensureAnchor();
                    const parallaxBounds = [
                        `${parallaxDistance}${parallaxUnit}`,
                        `0${parallaxUnit}`,
                        `${-1 * parallaxDistance}${parallaxUnit}`,
                    ];
                    const axis = horizontal ? 'x' : 'y';
                    Alpine.mutateDom(() => {
                        const nativeTimeline = root.__parallaxRoot_getNativeTimeline();
                        if (nativeTimeline) {
                            const direction = reverse ? 1 : -1;
                            const start = -direction * anchorProgress * parallaxDistance;
                            const end = direction * (1 - anchorProgress) * parallaxDistance;
                            const originalInlineTransform = $el.style.transform;
                            const animation = animate($el, { transform: [translate3d(axis, start, parallaxUnit), translate3d(axis, end, parallaxUnit)] }, { duration: 1, ease: 'linear' });
                            const cancelTimeline = animation.attachTimeline(Object.assign(Object.assign({}, nativeTimeline), { 
                                // A native timeline is supplied on this path, so Motion never calls the observer.
                                // The controls API still requires it as the non-native fallback contract.
                                observe: () => () => { } }));
                            this.__parallaxElement_styleEffect = () => {
                                cancelTimeline();
                                animation.cancel();
                                if (originalInlineTransform) {
                                    $el.style.transform = originalInlineTransform;
                                }
                                else {
                                    $el.style.removeProperty('transform');
                                }
                            };
                        }
                        else {
                            root.__parallaxRoot_requestScrollTracking();
                            const scrollValue = root.__parallaxElement_scrollValue;
                            const scrollTransform = transform(reverse ? [1, 0, -1] : [-1, 0, 1], parallaxBounds);
                            this.__parallaxElement_styleEffect = styleEffect($el, {
                                transform: transformValue(() => translate3d(axis, scrollTransform(scrollValue.get()))),
                            });
                        }
                        $el.setAttribute('data-parallax-active', 'true');
                    });
                },
                destroy() {
                    var _a, _b;
                    (_a = this.__parallaxElement_cancelInView) === null || _a === void 0 ? void 0 : _a.call(this);
                    this.__parallaxElement_cancelInView = null;
                    (_b = this.__parallaxElement_styleEffect) === null || _b === void 0 ? void 0 : _b.call(this);
                    this.__parallaxElement_styleEffect = null;
                    $el.removeAttribute('data-parallax-active');
                },
            };
        },
    });
}
function handleRoot($el, Alpine) {
    Alpine.bind($el, {
        ['x-data']() {
            return {
                __rootEl: $el,
                __parallaxElement_cancelInView: null,
                __parallaxElement_motionCancelFn: null,
                __parallaxElement_scrollValue: motionValue(0),
                __parallaxElement_anchorProgress: null,
                __parallaxRoot_initialViewportHeight: null,
                __parallaxRoot_scrollRange: null,
                __parallaxRoot_nativeTimelineConfig: null,
                __parallaxRoot_hasResolvedNativeTimeline: false,
                __parallaxRoot_isInView: false,
                __parallaxRoot_needsScrollTracking: false,
                init() {
                    if (isReducedMotion() || isLowPowerDevice())
                        return;
                    this.$nextTick(() => {
                        // Element effects attach once; only the shared JS fallback starts and stops as the root
                        // enters and leaves the viewport.
                        this.__parallaxElement_cancelInView = inView($el, () => {
                            this.__parallaxRoot_isInView = true;
                            if (this.__parallaxRoot_needsScrollTracking)
                                this.__parallaxElement_setupScroll();
                            $el.setAttribute('data-parallax-active', 'true');
                            return () => {
                                this.__parallaxRoot_isInView = false;
                                this.__parallaxElement_teardownScroll();
                                $el.removeAttribute('data-parallax-active');
                            };
                        });
                    });
                },
                __parallaxRoot_ensureAnchor() {
                    if (this.__parallaxRoot_initialViewportHeight === null) {
                        this.__parallaxRoot_initialViewportHeight = window.innerHeight;
                    }
                    if (!this.__parallaxRoot_scrollRange) {
                        this.__parallaxRoot_scrollRange = getElementScrollRange($el, this.__parallaxRoot_initialViewportHeight);
                    }
                    if (this.__parallaxElement_anchorProgress === null) {
                        this.__parallaxElement_anchorProgress = getScrollProgress(window.scrollY, this.__parallaxRoot_scrollRange);
                    }
                    return { range: this.__parallaxRoot_scrollRange, anchorProgress: this.__parallaxElement_anchorProgress };
                },
                __parallaxRoot_getNativeTimeline() {
                    if (!this.__parallaxRoot_hasResolvedNativeTimeline) {
                        const { range } = this.__parallaxRoot_ensureAnchor();
                        this.__parallaxRoot_nativeTimelineConfig = createNativeTimeline($el, this.__parallaxRoot_initialViewportHeight, range);
                        this.__parallaxRoot_hasResolvedNativeTimeline = true;
                    }
                    return this.__parallaxRoot_nativeTimelineConfig;
                },
                __parallaxRoot_requestScrollTracking() {
                    this.__parallaxRoot_needsScrollTracking = true;
                    if (this.__parallaxRoot_isInView)
                        this.__parallaxElement_setupScroll();
                },
                __parallaxElement_setupScroll() {
                    if (this.__parallaxElement_motionCancelFn)
                        return;
                    const { anchorProgress } = this.__parallaxRoot_ensureAnchor();
                    // Refresh page geometry whenever the fallback restarts, while keeping the original
                    // viewport height and anchor that prevent visual jumps.
                    const range = getElementScrollRange($el, this.__parallaxRoot_initialViewportHeight);
                    this.__parallaxRoot_scrollRange = range;
                    const scrollValue = motionArg(this.__parallaxElement_scrollValue);
                    // Motion delivers its first reading a frame after subscribing. Seed synchronously on
                    // re-entry so the retained element effect cannot paint one frame at the stale offset.
                    scrollValue.set(getScrollProgress(window.scrollY, range) - anchorProgress);
                    this.__parallaxElement_motionCancelFn = scroll((_progress, info) => {
                        scrollValue.set(getScrollProgress(info.y.current, range) - anchorProgress);
                    });
                },
                __parallaxElement_teardownScroll() {
                    var _a;
                    (_a = this.__parallaxElement_motionCancelFn) === null || _a === void 0 ? void 0 : _a.call(this);
                    this.__parallaxElement_motionCancelFn = null;
                },
                destroy() {
                    var _a;
                    (_a = this.__parallaxElement_cancelInView) === null || _a === void 0 ? void 0 : _a.call(this);
                    this.__parallaxElement_cancelInView = null;
                    this.__parallaxElement_teardownScroll();
                    this.__parallaxRoot_nativeTimelineConfig = null;
                    $el.removeAttribute('data-parallax-active');
                },
            };
        },
    });
}
