import { focusable, isFocusable } from 'tabbable';
import { getNumberModifierValue } from '../utils/modifiers';
import { isReducedMotion } from '../utils/device';
import { afterNextPaint, readLayoutAfterPaint } from '../utils/layout-measure';
import { warnMissingParentDirective } from '../utils/error';
const DEFAULT_SPEED = 60; // px/s
const DEFAULT_ATTRIBUTE_BLACKLIST = ['id'];
const VIEWPORT_RESIZE_DEBOUNCE_MS = 100;
/**
 * This plugin provides a smoothly scrolling marquee effect by translating two matching rows:
 * the original "source" row and a cloned "target" row. The target starts immediately after the
 * source, so as the source scrolls away the target takes its place and the animation can loop
 * back around without a visible jump.
 *
 * The render flow is:
 *  1. Measure the source and viewport.
 *  2. If `.fill` is enabled, append sanitized source clones until the source row is wide enough.
 *  3. Clone the finalized source row into the target row.
 *  4. Start or refresh a Web Animations API animation on both rows.
 *
 * The movement itself is a plain looping `translateX(0%) → translateX(-100%)` transform
 * animation created with `element.animate()`. The browser runs it on the compositor, so once a
 * marquee is rendered there is zero per-frame JavaScript — no animation library, no rAF loop,
 * no style writes from the main thread. Playback (pause, resume, jumping to a position) goes
 * through the Animation objects the browser hands back.
 *
 * Inspired by: https://ryanmulligan.dev/blog/css-marquee/
 *
 * Modifiers:
 *  - speed.X: Adjusts the scrolling pace (e.g., speed.60 sets 60px per second). Negative value scrolls backwards
 *  - fill: Ensures content is repeated and appended until the visual area is completely covered.
 *  - pause: Begins the marquee in a paused state, requiring a play action to begin moving.
 *
 * General usage:
 *  1. Mark the scrolled content with x-marquee:source.
 *  2. Provide an empty container with x-marquee:target, to receive the duplicated set of items.
 *  3. Attach x-marquee to a parent element with optional modifiers like speed.X, fill, or pause.
 *
 * Programmatic control is available through $marquee: isPlaying, play(), pause(), toggle(),
 * scrollTo(element) to jump the loop so an element sits at the visible left edge, isReady
 * (true after the first render), and offsetValue (the raw Motion value that drives both rows).
 *
 * Accessibility: keyboard focus inside the marquee pauses it and scrolls the focused element
 * into view; focus leaving resumes playback only if focus caused the pause. Clones are
 * aria-hidden and removed from the tab order, and ids are stripped from them. With
 * prefers-reduced-motion the rows do not animate, and the scroll modifier is also disabled
 * on low-power devices.
 *
 * @example
 *   <div x-data x-marquee.speed.60.fill>
 *     <div x-marquee:source>
 *       <span>First Item</span>
 *       <span>Second Item</span>
 *       <span>Third Item</span>
 *     </div>
 *     <div x-marquee:target aria-hidden="true"></div>
 *   </div>
 *
 */
export default function (Alpine) {
    Alpine.directive('marquee', ($el, { value, modifiers }) => {
        var _a;
        if (value == 'source') {
            // Child directives register the two moving rows on the parent x-data instance.
            Alpine.bind($el, {
                'x-init'() {
                    if (!this.__marquee_isRoot) {
                        warnMissingParentDirective('x-marquee:source', 'x-marquee', this.$el);
                        return;
                    }
                    this.__marquee_sourceEl = this.$el;
                },
            });
        }
        else if (value == 'target') {
            Alpine.bind($el, {
                'x-init'() {
                    if (!this.__marquee_isRoot) {
                        warnMissingParentDirective('x-marquee:target', 'x-marquee', this.$el);
                        return;
                    }
                    this.__marquee_targetEl = this.$el;
                },
            });
        }
        else if (value == null) {
            const speed = (_a = getNumberModifierValue(modifiers, 'speed')) !== null && _a !== void 0 ? _a : DEFAULT_SPEED;
            let fill = modifiers.includes('fill');
            let autoplay = !modifiers.includes('pause');
            Alpine.bind($el, {
                'x-data'() {
                    return {
                        __marquee_isRoot: true,
                        __marquee_state: buildMarqueeState({ isPlaying: autoplay }),
                        __marquee_isInitialized: false,
                        __marquee_isActive: false,
                        __marquee_isRendering: false,
                        __marquee_wasPlayingBeforeKeyboardFocus: false,
                        __marquee_sourceEl: null,
                        __marquee_targetEl: null,
                        __marquee_originalContentFragment: document.createDocumentFragment(),
                        __marquee_originalContentWidth: 0,
                        __marquee_sourceElWidth: 0,
                        __marquee_viewportWidth: 0,
                        __marquee_animations: [],
                        __marquee_contentHasAlpineDirectives: false,
                        __marquee_cancelAfterNextPaint: null,
                        __marquee_afterNextPaintResolve: null,
                        __marquee_renderFrameId: null,
                        __marquee_isResizeMeasurementScheduled: false,
                        __marquee_isDestroyed: false,
                        __marquee_resetRenderingFrameId: null,
                        __marquee_sentinel: null,
                        __marquee_cancelInView: null,
                        __marquee_measureWidths() {
                            // Reads are deferred until after paint so mutations from init/render have settled.
                            return readLayoutAfterPaint(() => {
                                this.__marquee_originalContentWidth = this.__marquee_sourceEl.clientWidth;
                                this.__marquee_sourceElWidth = this.__marquee_originalContentWidth;
                                this.__marquee_viewportWidth = this.$el.clientWidth;
                            });
                        },
                        get __marquee_animationDuration() {
                            return this.__marquee_sourceElWidth / Math.abs(speed);
                        },
                        /**
                         * Extends the source row itself for short content. The sentinel separates original
                         * content from fill clones so later renders can delete only generated nodes.
                         */
                        __marquee_fillSource() {
                            return (async () => {
                                if (this.__marquee_originalContentWidth === 0) {
                                    await readLayoutAfterPaint(() => {
                                        this.__marquee_originalContentWidth = this.__marquee_sourceEl.clientWidth;
                                        this.__marquee_sourceElWidth = this.__marquee_originalContentWidth;
                                    });
                                }
                                let needsWidthAfterDomChange = false;
                                Alpine.mutateDom(() => {
                                    if (!this.__marquee_sentinel) {
                                        // Everything after this marker is generated and can be replaced on resize.
                                        this.__marquee_sentinel = document.createComment('marquee-sentinel');
                                        this.__marquee_sourceEl.appendChild(this.__marquee_sentinel);
                                    }
                                    else {
                                        let next = this.__marquee_sentinel.nextSibling;
                                        while (next) {
                                            const toRemove = next;
                                            next = next.nextSibling;
                                            this.__marquee_sourceEl.removeChild(toRemove);
                                        }
                                        needsWidthAfterDomChange = true;
                                    }
                                });
                                if (needsWidthAfterDomChange) {
                                    await readLayoutAfterPaint(() => {
                                        this.__marquee_originalContentWidth = this.__marquee_sourceEl.clientWidth;
                                        this.__marquee_sourceElWidth = this.__marquee_originalContentWidth;
                                    });
                                }
                                const spaceToFill = Math.max(0, this.__marquee_viewportWidth - this.__marquee_originalContentWidth);
                                if (spaceToFill === 0)
                                    return;
                                // Zero (or not-yet-laid-out) content width makes timesToClone Infinity and freezes
                                // the main thread in the clone loop — Cypress then can't even fire command timeouts.
                                if (!Number.isFinite(this.__marquee_originalContentWidth) || this.__marquee_originalContentWidth <= 0) {
                                    return;
                                }
                                const timesToClone = Math.ceil(spaceToFill / this.__marquee_originalContentWidth);
                                if (!Number.isFinite(timesToClone) || timesToClone <= 0)
                                    return;
                                const fragment = document.createDocumentFragment();
                                for (let i = 0; i < timesToClone; i++) {
                                    const clone = this.__marquee_originalContentFragment.cloneNode(true);
                                    // Prepare detached clones once instead of re-scanning rendered nodes every render.
                                    Array.from(clone.children).forEach((child) => prepareClonedSourceElement(child));
                                    fragment.appendChild(clone);
                                }
                                await new Promise((resolve) => {
                                    Alpine.mutateDom(() => {
                                        this.__marquee_sentinel.after(fragment);
                                        if (this.__marquee_contentHasAlpineDirectives) {
                                            Alpine.skipDuringClone(() => Alpine.initTree(this.__marquee_sourceEl))();
                                        }
                                        this.__marquee_afterNextPaintResolve = resolve;
                                        this.__marquee_cancelAfterNextPaint = afterNextPaint(() => {
                                            this.__marquee_cancelAfterNextPaint = null;
                                            this.__marquee_afterNextPaintResolve = null;
                                            this.__marquee_sourceElWidth = this.__marquee_sourceEl.clientWidth;
                                            resolve();
                                        });
                                    });
                                });
                            })();
                        },
                        __marquee_cloneSourceToTarget() {
                            return new Promise((resolve) => {
                                // Without enough content to loop, the target would only repeat static content.
                                // Equal width is not enough — content must be strictly wider than the viewport.
                                if (this.__marquee_sourceElWidth <= this.__marquee_viewportWidth) {
                                    return resolve();
                                }
                                Alpine.mutateDom(() => {
                                    // Target is rebuilt from the finalized source so fill clones are included.
                                    const clone = this.__marquee_sourceEl.cloneNode(true);
                                    Array.from(clone.children).forEach((child) => prepareClonedTargetElement(child));
                                    this.__marquee_targetEl.replaceChildren(...clone.children);
                                    // Re-initialize alpine on cloned nodes
                                    if (this.__marquee_contentHasAlpineDirectives) {
                                        Alpine.skipDuringClone(() => Alpine.initTree(this.__marquee_targetEl))();
                                    }
                                    resolve();
                                });
                            });
                        },
                        __marquee_setupAnimations() {
                            var _a;
                            const durationMs = this.__marquee_animationDuration * 1000;
                            if (!isFinite(durationMs) || durationMs <= 0)
                                return;
                            const shouldPlay = this.__marquee_state.isPlaying && this.__marquee_sourceElWidth > this.__marquee_viewportWidth;
                            // Carry the loop position across rebuilds (resize, scrolling back into
                            // view) so the content doesn't visibly jump back to the start.
                            let loopProgress = 0;
                            const previousAnimation = this.__marquee_animations[0];
                            if (previousAnimation) {
                                const previousTime = previousAnimation.currentTime;
                                const previousDuration = (_a = previousAnimation.effect) === null || _a === void 0 ? void 0 : _a.getTiming().duration;
                                if (typeof previousTime === 'number' && typeof previousDuration === 'number' && previousDuration > 0) {
                                    loopProgress = (((previousTime / previousDuration) % 1) + 1) % 1;
                                }
                            }
                            this.__marquee_cancelAnimations();
                            // One iteration moves a row exactly its own width to the left; the target
                            // row sliding in behind makes the wrap-around invisible. `direction:
                            // reverse` plays the same keyframes backwards for negative speeds.
                            const keyframes = [{ transform: 'translateX(0%)' }, { transform: 'translateX(-100%)' }];
                            const options = {
                                duration: durationMs,
                                iterations: Infinity,
                                easing: 'linear',
                                direction: speed < 0 ? 'reverse' : 'normal',
                            };
                            // Both rows get their own Animation with identical timing. The shared
                            // document timeline keeps them locked together; the explicit currentTime
                            // below starts them at the same point.
                            this.__marquee_animations = [this.__marquee_sourceEl, this.__marquee_targetEl].map((rowEl) => {
                                const animation = rowEl.animate(keyframes, options);
                                animation.currentTime = loopProgress * durationMs;
                                if (!shouldPlay) {
                                    // Keep the animation ready even when there is not enough content to
                                    // animate, so play() and scrollTo() still have something to drive.
                                    animation.pause();
                                }
                                return animation;
                            });
                        },
                        __marquee_cancelAnimations() {
                            for (const animation of this.__marquee_animations) {
                                animation.cancel();
                            }
                            this.__marquee_animations = [];
                        },
                        __marquee_scrollTo(element) {
                            const durationMs = this.__marquee_animationDuration * 1000;
                            if (!isFinite(durationMs) || durationMs <= 0)
                                return;
                            // Jump the animation timeline so keyboard focus lands near the visible left edge.
                            let offset = element.offsetLeft;
                            let leftSpacingBuffer = 24; // (px) To allow for the focus outline to be fully visible when tabbed through
                            // When the animation is reversed
                            if (speed < 0) {
                                offset = this.__marquee_sourceElWidth - offset;
                                leftSpacingBuffer = leftSpacingBuffer * -1;
                            }
                            const elementPositionPercentage = (offset - leftSpacingBuffer) / this.__marquee_sourceElWidth;
                            const elementPositionTime = elementPositionPercentage * durationMs;
                            if (!isFinite(elementPositionTime))
                                return;
                            // Wrapped into one loop so a position just before the row start doesn't
                            // land in the animation's before-phase, where no transform applies.
                            const wrappedTime = ((elementPositionTime % durationMs) + durationMs) % durationMs;
                            for (const animation of this.__marquee_animations) {
                                animation.currentTime = wrappedTime;
                            }
                        },
                        async __marquee_render() {
                            if (!this.__marquee_isActive)
                                return;
                            if (this.__marquee_isRendering)
                                return;
                            try {
                                this.__marquee_isRendering = true;
                                // Render is the only path that mutates generated marquee content.
                                await this.__marquee_measureWidths();
                                if (fill) {
                                    await this.__marquee_fillSource();
                                }
                                await this.__marquee_cloneSourceToTarget();
                                // Don't animate if in reduced motion mode
                                if (!isReducedMotion()) {
                                    // Setup animations after the content has been cloned in order to measure the width of the content element without causing reflow
                                    this.__marquee_setupAnimations();
                                }
                                this.__marquee_isInitialized = true;
                                this.__marquee_resetRenderingFrameId = window.requestAnimationFrame(() => {
                                    this.__marquee_resetRenderingFrameId = null;
                                    this.__marquee_isRendering = false;
                                });
                            }
                            finally {
                                this.__marquee_isRendering = false;
                            }
                        },
                        __marquee_updateViewportWidth() {
                            if (this.__marquee_isResizeMeasurementScheduled)
                                return;
                            this.__marquee_isResizeMeasurementScheduled = true;
                            // The read is deferred to readLayoutAfterPaint so it lands in the shared
                            // read batch — measured alongside every other component asking that frame,
                            // before any of them store a result. Reading here (or in a rAF) would force
                            // a reflow whenever something else had already written styles.
                            readLayoutAfterPaint(() => {
                                this.__marquee_isResizeMeasurementScheduled = false;
                                if (this.__marquee_isDestroyed)
                                    return null;
                                return this.$el.clientWidth;
                            }).then((viewportWidth) => {
                                if (viewportWidth == null || this.__marquee_isDestroyed)
                                    return;
                                // The document resizes constantly while the page loads — every image and
                                // section arriving makes it taller — and x-resize.document reports all of
                                // it. The marquee only cares about its width. Re-rendering is the full
                                // rebuild (delete clones, re-clone, re-initialize), so it must not run
                                // when the width is the same as last time.
                                if (this.__marquee_isInitialized && viewportWidth === this.__marquee_viewportWidth)
                                    return;
                                this.__marquee_viewportWidth = viewportWidth;
                                this.__marquee_render();
                            });
                        },
                        __marquee_pauseForKeyboardFocus(target) {
                            if (!(target instanceof HTMLElement))
                                return;
                            // Preserve manual paused state: focusout should only resume if focus paused playback.
                            this.__marquee_wasPlayingBeforeKeyboardFocus = this.__marquee_state.isPlaying;
                            this.__marquee_state.pause();
                            this.__marquee_scrollTo(target);
                        },
                        __marquee_resumeAfterKeyboardFocus() {
                            if (!this.__marquee_wasPlayingBeforeKeyboardFocus)
                                return;
                            this.__marquee_wasPlayingBeforeKeyboardFocus = false;
                            this.__marquee_state.play();
                        },
                        __marquee_teardown() {
                            this.__marquee_cancelAnimations();
                            this.__marquee_isInitialized = false;
                        },
                        init() {
                            this.$nextTick(() => {
                                if (this.__marquee_sourceEl == null) {
                                    throw new Error('Source element not found, x-marquee:source must be applied to a child element of the x-marquee directive');
                                }
                                if (this.__marquee_targetEl == null) {
                                    throw new Error('Target element not found, x-marquee:target must be applied to a child element of the x-marquee directive');
                                }
                                this.__marquee_targetEl.setAttribute('aria-hidden', 'true');
                                // Keep a clean copy of the author-provided content; fill clones are generated from this.
                                Array.from(this.__marquee_sourceEl.children).forEach((element) => {
                                    const clone = element.cloneNode(true);
                                    removeBlacklistedAttributes(clone);
                                    this.__marquee_originalContentFragment.append(clone);
                                });
                                // Decided once here so every render can skip initializing Alpine on
                                // clones of content that has nothing for Alpine to initialize.
                                this.__marquee_contentHasAlpineDirectives = hasAlpineDirectives(this.__marquee_originalContentFragment);
                                // Rendering is lazy: do the expensive clone/measure work only while the marquee is visible.
                                const observer = new IntersectionObserver((entries) => {
                                    for (const entry of entries) {
                                        if (entry.isIntersecting) {
                                            if (this.__marquee_isActive)
                                                continue;
                                            this.__marquee_isActive = true;
                                            if (this.__marquee_renderFrameId !== null) {
                                                cancelAnimationFrame(this.__marquee_renderFrameId);
                                            }
                                            this.__marquee_renderFrameId = window.requestAnimationFrame(() => {
                                                this.__marquee_renderFrameId = null;
                                                if (!this.__marquee_isActive)
                                                    return;
                                                this.__marquee_render();
                                            });
                                        }
                                        else if (this.__marquee_isActive) {
                                            if (this.__marquee_renderFrameId !== null) {
                                                cancelAnimationFrame(this.__marquee_renderFrameId);
                                                this.__marquee_renderFrameId = null;
                                            }
                                            this.__marquee_isActive = false;
                                            this.__marquee_teardown();
                                        }
                                    }
                                });
                                observer.observe(this.$el);
                                this.__marquee_cancelInView = () => observer.disconnect();
                            });
                            this.$watch('__marquee_state.isPlaying', (playing) => {
                                for (const animation of this.__marquee_animations) {
                                    if (playing) {
                                        animation.play();
                                    }
                                    else {
                                        animation.pause();
                                    }
                                }
                            });
                        },
                        destroy() {
                            var _a, _b, _c, _d, _e;
                            this.__marquee_isDestroyed = true;
                            (_a = this.__marquee_cancelInView) === null || _a === void 0 ? void 0 : _a.call(this);
                            (_b = this.__marquee_cancelAfterNextPaint) === null || _b === void 0 ? void 0 : _b.call(this);
                            this.__marquee_cancelAfterNextPaint = null;
                            (_c = this.__marquee_afterNextPaintResolve) === null || _c === void 0 ? void 0 : _c.call(this);
                            this.__marquee_afterNextPaintResolve = null;
                            if (this.__marquee_renderFrameId !== null) {
                                cancelAnimationFrame(this.__marquee_renderFrameId);
                                this.__marquee_renderFrameId = null;
                            }
                            if (this.__marquee_resetRenderingFrameId !== null) {
                                cancelAnimationFrame(this.__marquee_resetRenderingFrameId);
                                this.__marquee_resetRenderingFrameId = null;
                            }
                            this.__marquee_cancelAnimations();
                            (_d = this.__marquee_sourceEl) === null || _d === void 0 ? void 0 : _d.replaceChildren(this.__marquee_originalContentFragment);
                            this.__marquee_originalContentFragment = document.createDocumentFragment();
                            (_e = this.__marquee_sentinel) === null || _e === void 0 ? void 0 : _e.remove();
                        },
                    };
                },
                '@focusin': '__marquee_pauseForKeyboardFocus($event.target)',
                '@focusout': '__marquee_resumeAfterKeyboardFocus()',
                'x-resize.document': Alpine.debounce(function () {
                    this.__marquee_updateViewportWidth();
                }, VIEWPORT_RESIZE_DEBOUNCE_MS),
            });
        }
        else {
            throw new Error(`Unknown directive: x-marquee:${value}`);
        }
    }).before('bind');
    Alpine.magic('marquee', ($el) => {
        const $data = Alpine.$data($el);
        return {
            get isPlaying() {
                var _a;
                return (_a = $data.__marquee_state) === null || _a === void 0 ? void 0 : _a.isPlaying;
            },
            play() {
                var _a;
                (_a = $data.__marquee_state) === null || _a === void 0 ? void 0 : _a.play();
            },
            pause() {
                var _a;
                (_a = $data.__marquee_state) === null || _a === void 0 ? void 0 : _a.pause();
            },
            toggle() {
                var _a;
                (_a = $data.__marquee_state) === null || _a === void 0 ? void 0 : _a.toggle();
            },
            scrollTo(element) {
                var _a;
                (_a = $data.__marquee_scrollTo) === null || _a === void 0 ? void 0 : _a.call($data, element);
            },
            get isReady() {
                return $data.__marquee_isInitialized;
            },
        };
    });
}
function buildMarqueeState(options) {
    var _a;
    return {
        isPlaying: (_a = options === null || options === void 0 ? void 0 : options.isPlaying) !== null && _a !== void 0 ? _a : false,
        play() {
            this.isPlaying = true;
        },
        pause() {
            this.isPlaying = false;
        },
        toggle() {
            this.isPlaying = !this.isPlaying;
        },
    };
}
/**
 * True when any element in the content carries something Alpine would need to
 * initialize: an `x-` directive, a `:`/`@` shorthand binding, or a lazy-Alpine marker.
 *
 * Most marquee content is plain markup — logos, text, links — and initializing Alpine on
 * every clone of it is the most expensive part of a render, for nothing. Checked once on
 * the authored content, so each render can skip that work outright.
 */
function hasAlpineDirectives(content) {
    for (const element of content.querySelectorAll('*')) {
        if (element.hasAttribute('data-lazy-alpine'))
            return true;
        for (const attribute of element.attributes) {
            const name = attribute.name;
            if (name.startsWith('x-') || name.startsWith(':') || name.startsWith('@'))
                return true;
        }
    }
    return false;
}
function prepareClonedSourceElement(element) {
    // Source fill clones remain in the visible row, but should not be announced or tabbed to.
    element.setAttribute('aria-hidden', 'true');
    removeClonedElementFromTabOrder(element);
}
function prepareClonedTargetElement(element) {
    // Target clones duplicate live source nodes, so blacklisted attributes (ids) must be
    // stripped here — unlike fill clones, which come from the already-sanitized fragment.
    removeBlacklistedAttributes(element);
    removeClonedElementFromTabOrder(element);
}
function removeBlacklistedAttributes(element) {
    for (const blacklistedAttribute of DEFAULT_ATTRIBUTE_BLACKLIST) {
        element.removeAttribute(blacklistedAttribute);
        element.querySelectorAll(`[${blacklistedAttribute}]`).forEach((descendant) => {
            descendant.removeAttribute(blacklistedAttribute);
        });
    }
}
function removeClonedElementFromTabOrder(element) {
    // Clones are detached when prepared, so tabbable cannot rely on layout visibility checks.
    if (isFocusable(element, { displayCheck: 'none' })) {
        element.setAttribute('tabindex', '-1');
    }
    focusable(element, { displayCheck: 'none' }).forEach((focusableElement) => {
        focusableElement.setAttribute('tabindex', '-1');
    });
}
