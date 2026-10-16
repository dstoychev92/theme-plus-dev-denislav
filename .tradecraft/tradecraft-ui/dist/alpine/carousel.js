import { getWritingDirection, isHtmlElement, isTemplateElement } from '../utils/dom';
import { PanGestureRecognizer } from '../utils/pan-gesture-recognizer';
import { handleScrollListMagic } from './scroll-list';
import { clamp, mergeProperties, toScrollValue } from '../utils';
import { animate } from 'motion';
import { warnMissingParentDirective } from '../utils/error';
import { readLayoutAfterPaint } from '../utils/layout-measure';
const isTouchDevice = () => window.matchMedia('(pointer: coarse)').matches;
/**
 * Mouse-drag panning with momentum for a horizontally scrollable list. Touch devices
 * keep native scrolling; on mouse devices the track follows the pointer while dragging,
 * then a spring animation lands the track on the closest CSS scroll-snap point, so the
 * track needs scroll-snap classes (e.g. `snap-x snap-mandatory`). Works in RTL.
 *
 * Builds on the scroll-list plugin: the root composes x-scroll-list, the viewport is
 * the scroll-list viewport, and the track is its scroller.
 *
 * Directives:
 *  - x-carousel: The root. Holds the pan state (role="region", aria-roledescription="carousel")
 *  - x-carousel:viewport: The visible area. Watches pan gestures and resizes; owns the $id('carousel') id
 *  - x-carousel:track: The scrollable row that holds the slides
 *  - x-carousel:track.autoregister: Also registers every child of the track as a slide,
 *    and keeps registration in sync when children are added or removed
 *  - x-carousel:item: Registers one element as a slide (role="group", aria-roledescription="slide")
 *  - x-carousel:prev / x-carousel:next: Buttons that page the list backward / forward
 *
 * Magic:
 *  - $carousel: state ('initial' | 'panning' | 'animating' | 'scrolling'), isPanning,
 *    isEnabled (true when the track is wider than the viewport), plus the scroll-list
 *    surface: items, visibleIndices, centeredIndex, isScrolling, scrollTo(index, options),
 *    next(), prev()
 *
 * @example Basic horizontal carousel
 * <div x-carousel>
 *   <div x-carousel:viewport>
 *     <div x-carousel:track.autoregister class="flex snap-x snap-mandatory">
 *       <!-- Slide items -->
 *     </div>
 *   </div>
 *   <button x-carousel:prev>Previous</button>
 *   <button x-carousel:next>Next</button>
 * </div>
 *
 * Items that contain lazy-loaded images may need `transform: translate3d(0,0,0)` to
 * prevent jank while scrolling.
 */
export default function (Alpine) {
    Alpine.directive('carousel', ($el, data, utilities) => {
        if (!isHtmlElement($el)) {
            throw new Error(`Expected HTMLElement but got ${$el}`);
        }
        if (data.value === 'viewport') {
            handleViewport($el, Alpine);
        }
        else if (data.value === 'track') {
            handleTrack($el, Alpine, data, utilities);
        }
        else if (data.value === 'item') {
            handleItem($el, Alpine);
        }
        else if (data.value === 'next') {
            handleNextButton($el, Alpine);
        }
        else if (data.value === 'prev') {
            handlePrevButton($el, Alpine);
        }
        else if (data.value === null) {
            handleRoot($el, Alpine);
        }
        else {
            throw new Error(`Unknown directive: x-carousel:${data.value}`);
        }
    }).before('bind');
    Alpine.magic('carousel', handleCarouselMagic(Alpine));
}
/**
 * Binds a track component to an HTML element with Alpine.js.
 * This component handles moving a set of elements together in a performant way in a carousel UI.
 */
function handleTrack($el, Alpine, data, _utilities) {
    const shouldAutoRegisterItems = data.modifiers.includes('autoregister');
    Alpine.bind($el, {
        'x-scroll-list:scroller': '',
        ['x-data']() {
            return {
                __carousel_mutationObserver: null,
                __carousel_itemAbortController: new AbortController(),
                __carousel_registeredItems: new Set(),
                init() {
                    if (!this.$data.__carousel_isRoot) {
                        warnMissingParentDirective('x-carousel:track', 'x-carousel', this.$el);
                        return;
                    }
                    this.$data.__carousel_trackEl = this.$el;
                    if (shouldAutoRegisterItems) {
                        this.__carousel_registerItems($el.children);
                        // Watch for new children being added to the track
                        this.__carousel_mutationObserver = new MutationObserver((mutations) => {
                            let didSlidesChange = false;
                            mutations.forEach((mutation) => {
                                if (mutation.type !== 'childList')
                                    return;
                                this.__carousel_registerItems(mutation.addedNodes);
                                for (const node of mutation.removedNodes) {
                                    if (!(node instanceof HTMLElement))
                                        continue;
                                    if (!this.__carousel_registeredItems.delete(node))
                                        continue;
                                    this.$data.__unregisterItem(node);
                                }
                                didSlidesChange = true;
                            });
                            // One measurement for the whole batch of changes, rather than one per change
                            if (didSlidesChange) {
                                this.$data.__carousel_requestBoundsUpdate();
                            }
                        });
                        this.__carousel_mutationObserver.observe($el, {
                            childList: true,
                            subtree: false,
                        });
                    }
                },
                __carousel_registerItems(children) {
                    Array.from(children).forEach((child) => {
                        if (isTemplateElement(child))
                            return;
                        if (!(child instanceof HTMLElement))
                            return;
                        if (this.__carousel_registeredItems.has(child))
                            return;
                        this.__carousel_registeredItems.add(child);
                        registerItem(child, this.$data, this.__carousel_itemAbortController.signal);
                    });
                },
                destroy() {
                    var _a;
                    (_a = this.__carousel_mutationObserver) === null || _a === void 0 ? void 0 : _a.disconnect();
                    this.__carousel_itemAbortController.abort();
                    this.__carousel_registeredItems.forEach((item) => {
                        this.$data.__unregisterItem(item);
                    });
                    this.__carousel_registeredItems.clear();
                },
            };
        },
    });
}
/**
 * Binds a viewport component to an HTML element with Alpine.js.
 * This component deals with the gestures and the viewport bounds for the carousel.
 *
 * @param {HTMLElement} $el - The element to bind the viewport component to.
 */
function handleViewport($el, Alpine) {
    Alpine.bind($el, {
        ':id': "$id('carousel')",
        'x-scroll-list:viewport': '',
        'x-resize'() {
            var _a, _b;
            (_b = (_a = this).__carousel_requestBoundsUpdate) === null || _b === void 0 ? void 0 : _b.call(_a);
        },
        'x-resize.document'() {
            var _a, _b;
            (_b = (_a = this).__carousel_requestBoundsUpdate) === null || _b === void 0 ? void 0 : _b.call(_a);
        },
        ['x-data']() {
            return {
                init() {
                    if (!this.$data.__carousel_isRoot) {
                        warnMissingParentDirective('x-carousel:viewport', 'x-carousel', this.$el);
                        return;
                    }
                    this.$data.__carousel_viewportEl = this.$el;
                    // Don't watch for pan events if on a touch device since they have native panning for scrollable elements
                    if (!isTouchDevice()) {
                        this.$data.__carousel_gestureRecognizer = new PanGestureRecognizer(this.$el);
                    }
                },
                destroy() {
                    var _a;
                    (_a = this.__carousel_gestureRecognizer) === null || _a === void 0 ? void 0 : _a.destroy();
                },
            };
        },
        '@panstart'() {
            if (!this.$data.__carousel_isEnabled)
                return;
            if (this.$data.__carousel_state === 'animating')
                return;
            this.$data.__carousel_panSession = this.$event.detail.panSession;
            this.$data.__carousel_beginPan();
            this.$data.__carousel_state = 'panning';
        },
        '@panmove'() {
            if (!this.$data.__carousel_isEnabled)
                return;
            if (this.$data.__carousel_state === 'animating')
                return;
            this.$data.__carousel_panSession = this.$event.detail.panSession;
            if (this.$data.__carousel_state === 'panning') {
                this.$data.__carousel_continuePan();
            }
            else {
                this.$data.__carousel_beginPan();
                this.$data.__carousel_state = 'panning';
            }
        },
        '@panend'() {
            if (!this.$data.__carousel_isEnabled)
                return;
            if (this.$data.__carousel_state === 'animating')
                return;
            this.$data.__carousel_panSession = this.$event.detail.panSession;
            this.$data.__carousel_endPan();
        },
    });
}
function handleItem($el, Alpine) {
    Alpine.bind($el, {
        'x-scroll-list:item': '',
        ':role': '$el.getAttribute("role") || "group"',
        'aria-roledescription': 'slide',
        // Prevent dragging images and links which interfere with the carousel pan gesture
        '@dragstart': '$event.preventDefault()',
    });
}
/**
 * Makes a track child behave as a slide, for the `.autoregister` modifier.
 *
 * This is deliberately plain DOM work plus a direct registration, rather than binding
 * `x-carousel:item` to the child. The child is somebody else's element — it may carry
 * its own directives, or be a subtree whose initialization is being deferred — and
 * Alpine skips directives on an element it has been told to leave alone. Declaring the
 * slide from out here would be silently dropped in that case, leaving a slide that the
 * carousel never counts. Nothing below needs the child to be initialized, so a slide is
 * a slide either way.
 */
function registerItem($el, rootData, signal) {
    if (!$el.getAttribute('role'))
        $el.setAttribute('role', 'group');
    $el.setAttribute('aria-roledescription', 'slide');
    // Prevent dragging images and links which interfere with the carousel pan gesture
    $el.addEventListener('dragstart', (event) => event.preventDefault(), { signal });
    rootData.__registerItem($el);
}
function handleNextButton($el, Alpine) {
    Alpine.bind($el, {
        'x-scroll-list:next': '',
    });
}
function handlePrevButton($el, Alpine) {
    Alpine.bind($el, {
        'x-scroll-list:prev': '',
    });
}
/**
 * Binds a root carousel component to an HTML element with Alpine.js.
 * This component controls the overall state and interactions of a carousel UI.
 *
 * @param {HTMLElement} $el - The element to bind the root component to.
 */
function handleRoot($el, Alpine) {
    Alpine.bind($el, {
        'x-scroll-list': '',
        ['x-data']() {
            return {
                __carousel_isRoot: true,
                __carousel_animation: null,
                __carousel_maxScrollLeft: 0,
                __carousel_state: 'initial',
                __carousel_scrollWidth: 0,
                __carousel_viewportWidth: 0,
                __carousel_panSession: null,
                __carousel_initialScrollLeft: null,
                __carousel_trackEl: null,
                __carousel_viewportEl: null,
                __carousel_gestureRecognizer: null,
                __carousel_isMeasurementScheduled: false,
                init() {
                    this.$watch('$scrollList.isScrolling', (isScrolling) => {
                        this.__carousel_state = isScrolling ? 'scrolling' : 'initial';
                    });
                    this.$nextTick(() => {
                        this.$watch('$carousel.visibleIndices', (visibleIndices, prevVisibleIndices) => {
                            if (this.__carousel_state !== 'initial')
                                return;
                            if ((visibleIndices === null || visibleIndices === void 0 ? void 0 : visibleIndices.length) === (prevVisibleIndices === null || prevVisibleIndices === void 0 ? void 0 : prevVisibleIndices.length))
                                return;
                        });
                    });
                },
                destroy() {
                    var _a;
                    (_a = this.__carousel_animation) === null || _a === void 0 ? void 0 : _a.cancel();
                },
                __carousel_beginPan() {
                    Alpine.stopObservingMutations();
                    this.$data.__carousel_initialScrollLeft =
                        this.__carousel_trackEl.scrollLeft;
                    const panSession = this.$data.__carousel_panSession;
                    const panDeltaXFromInitialScrollLeft = panSession.panDeltaX - this.$data.__carousel_initialScrollLeft;
                    window.requestAnimationFrame(() => {
                        this.__carousel_trackEl.style.overflow = 'visible';
                        this.__carousel_trackEl.style.transform = `translate3d(${panDeltaXFromInitialScrollLeft}px, 0px, 0)`;
                        this.__carousel_trackEl.style.willChange = 'transform';
                        this.__carousel_maxScrollLeft = this.$data.__carousel_scrollWidth - this.$data.__carousel_viewportWidth;
                    });
                },
                __carousel_continuePan() {
                    const panSession = this.$data.__carousel_panSession;
                    const panDeltaXFromInitialScrollLeft = panSession.panDeltaX - this.$data.__carousel_initialScrollLeft;
                    this.__carousel_trackEl.style.transform = `translate3d(${panDeltaXFromInitialScrollLeft}px, 0px, 0)`;
                },
                __carousel_endPan() {
                    this.__carousel_animateToScrollLeft();
                },
                async __carousel_animateToScrollLeft() {
                    this.__carousel_state = 'animating';
                    const panSession = this.$data.__carousel_panSession;
                    const calculatedFinalScrollLeft = toScrollValue(this.$data.__carousel_initialScrollLeft - panSession.panDeltaX);
                    const power = 0.6;
                    const velocity = panSession.panVelocityX;
                    // The extra distance that will be scrolled in the track due to the inertia animation
                    const amplitude = power * velocity;
                    const direction = getWritingDirection(this.$el);
                    const scrollLeftAfterAnimation = direction == 'rtl'
                        ? clamp(toScrollValue(calculatedFinalScrollLeft - amplitude), -this.__carousel_maxScrollLeft, 0)
                        : clamp(toScrollValue(calculatedFinalScrollLeft - amplitude), 0, this.__carousel_maxScrollLeft);
                    // Apply the final scroll position that would be reached with the current animation
                    // in order to figure out where the closest snap point is
                    this.__carousel_trackEl.style.overflow = 'auto';
                    this.__carousel_trackEl.scrollLeft = scrollLeftAfterAnimation;
                    this.__carousel_trackEl.style.transform = `translate3d(0px, 0px, 0)`;
                    window.requestAnimationFrame(async () => {
                        // Now, figure out where the closest snap point is
                        const snappedScrollLeft = this.__carousel_trackEl.scrollLeft;
                        this.__carousel_trackEl.style.overflow = 'visible';
                        // Apply a transform to "reset" the scroll position to where it was when the pan ended
                        this.__carousel_trackEl.style.transform = `translate3d(${-calculatedFinalScrollLeft}px, 0px, 0)`;
                        // Animate the scroll position to the closest snap point
                        this.__carousel_animation = animate(this.__carousel_trackEl, { x: [-calculatedFinalScrollLeft, -snappedScrollLeft] }, {
                            type: 'spring',
                            stiffness: 120,
                            damping: 15,
                            velocity: panSession.panVelocityX,
                        });
                        await this.__carousel_animation.finished;
                        this.__carousel_jumpToScrollLeft(snappedScrollLeft);
                    });
                },
                __carousel_jumpToScrollLeft(scrollLeft) {
                    // Finally, remove the transform and restore the scroll position
                    this.__carousel_trackEl.style.overflow = 'auto';
                    this.__carousel_trackEl.scrollLeft = scrollLeft;
                    this.__carousel_trackEl.style.transform = '';
                    this.__carousel_trackEl.style.willChange = '';
                    this.__carousel_animation = null;
                    this.__carousel_state = 'initial';
                    Alpine.startObservingMutations();
                },
                get __carousel_isScrollable() {
                    if (this.__carousel_trackEl == null)
                        return false;
                    if (this.__carousel_viewportEl == null)
                        return false;
                    return this.__carousel_scrollWidth > this.__carousel_viewportWidth;
                },
                get __carousel_isEnabled() {
                    return this.__carousel_isScrollable;
                },
                /**
                 * Measures this carousel again: how wide the track's content is, and how wide the
                 * viewport is. Both answers come from the browser's layout engine, and asking while
                 * any style change is still unapplied forces the browser to lay the whole page out
                 * again on the spot. Storing the answers is itself a style change — it re-runs every
                 * binding that depends on the values, so arrows appear and classes flip. Measuring
                 * each carousel as its own resize event arrived therefore cost one full page layout
                 * per carousel: measure, store, measure, store. On a page with several carousels
                 * that added up to hundreds of milliseconds of blocked main thread during loading.
                 *
                 * So instead of measuring immediately, this schedules the measuring through
                 * readLayoutAfterPaint, which runs every read scheduled in the same frame — from
                 * every carousel, and anything else using it — before any of the results are
                 * stored. All the reads see one clean layout, and the whole page pays for one
                 * layout pass instead of one per carousel.
                 */
                __carousel_requestBoundsUpdate() {
                    if (this.__carousel_isMeasurementScheduled)
                        return;
                    this.__carousel_isMeasurementScheduled = true;
                    readLayoutAfterPaint(() => {
                        this.__carousel_isMeasurementScheduled = false;
                        if (this.__carousel_trackEl == null)
                            return null;
                        if (this.__carousel_viewportEl == null)
                            return null;
                        // The carousel may have been removed from the page while this was pending
                        if (!this.__carousel_trackEl.isConnected)
                            return null;
                        return {
                            scrollWidth: this.__carousel_trackEl.scrollWidth,
                            // getBoundingClientRect().width comes back with decimals, so it is rounded to
                            // avoid miscalculations when comparing it to the whole-number scrollWidth
                            viewportWidth: Math.round(this.__carousel_viewportEl.getBoundingClientRect().width),
                        };
                    }).then((measurement) => {
                        if (measurement == null)
                            return;
                        this.__carousel_scrollWidth = measurement.scrollWidth;
                        this.__carousel_viewportWidth = measurement.viewportWidth;
                    });
                },
            };
        },
        'x-id': "['carousel']",
        ':role': '$el.getAttribute("role") || "region"',
        'aria-roledescription': 'carousel',
    });
}
function handleCarouselMagic(Alpine) {
    return function ($el) {
        let $data = Alpine.$data($el);
        return mergeProperties({}, {
            get state() {
                return $data.__carousel_state;
            },
            get isPanning() {
                return $data.__carousel_state == 'panning';
            },
            get isEnabled() {
                return $data.__carousel_isEnabled;
            },
        }, handleScrollListMagic(Alpine)($el));
    };
}
