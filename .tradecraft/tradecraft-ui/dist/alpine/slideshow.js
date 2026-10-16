import { copyProperty, isHtmlElement, isPlainObject, mod, trackProperty } from '../utils';
import { getMillisecondsModifierValue } from '../utils/modifiers';
import { warnMissingParentDirective } from '../utils/error';
const DEFAULT_SLIDE_DURATION = 1000;
/**
 * Slideshow plugin. The root directive holds the play state and the current slide index.
 * Value directives mark the parts: :viewport wraps the slides, :slide registers each slide,
 * and :prev/:next/:play/:pause/:toggle bind controls. :prev and :next pause the show before
 * they move since a user who navigates by hand does not want the timer to fight them.
 *
 * Root modifiers: `autoplay` starts the show playing, `duration.5000ms` sets how long each
 * slide shows (default 1000ms). The expression is an options object. `initialSlideIndex`
 * picks the opening slide. `state` and `currentSlideIndex` accept get/set pairs so a
 * wrapping x-data can drive the slideshow reactively.
 *
 * $slideshow reads and controls the state from anywhere inside the root: currentSlideIndex,
 * totalSlides, next(), prev(), play(), pause(), toggle(), state, and slideDuration.
 * Smooth progress UI should use CSS animations with the root's --slideshow-duration
 * and --slideshow-play-state properties.
 * $slide works inside x-slideshow:slide: slideIndex,
 * isCurrentSlide, and wasLastSlide — wasLastSlide marks the slide that was current before
 * the latest change, for exit transitions.
 *
 * The viewport pauses the show when focus enters it or any of its descendants, steps on
 * left/right arrow keys, and announces slide changes only while paused (aria-live flips
 * to "off" during autoplay).
 *
 * @example
 * <div x-slideshow.autoplay.duration.5000ms>
 *   <div x-slideshow:viewport>
 *     <div x-slideshow:slide x-show="$slide.isCurrentSlide">First</div>
 *     <div x-slideshow:slide x-show="$slide.isCurrentSlide">Second</div>
 *   </div>
 *   <button x-slideshow:prev>Previous</button>
 *   <button x-slideshow:next>Next</button>
 *   <button x-slideshow:toggle>Play / pause</button>
 * </div>
 *
 * @example <caption>Progress driven without per-frame JavaScript updates</caption>
 * <div x-slideshow.autoplay.duration.5000ms>
 *   <template x-for="index in Array.from({length: $slideshow.totalSlides}, (_, index) => index)">
 *     <span
 *       class="slideshow-progress"
 *       :data-current="index === $slideshow.currentSlideIndex ? 'true' : 'false'"
 *     ></span>
 *   </template>
 * </div>
 * <style>
 *   @keyframes slideshow-progress {
 *     from { transform: scaleX(0); }
 *     to { transform: scaleX(1); }
 *   }
 *
 *   .slideshow-progress {
 *     transform-origin: left;
 *     transform: scaleX(0);
 *   }
 *
 *   .slideshow-progress[data-current='true'] {
 *     animation: slideshow-progress var(--slideshow-duration, 1s) linear both;
 *     animation-play-state: var(--slideshow-play-state, paused);
 *   }
 * </style>
 */
export default function (Alpine) {
    Alpine.directive('slideshow', ($el, data, utilities) => {
        if (!isHtmlElement($el)) {
            throw new Error(`Expected HTMLElement but got ${$el}`);
        }
        if (data.value === 'slide') {
            handleSlide($el, Alpine);
        }
        else if (data.value === 'control') {
            handleControl($el, Alpine);
        }
        else if (data.value === 'play') {
            handlePlayButton($el, Alpine);
        }
        else if (data.value === 'pause') {
            handlePauseButton($el, Alpine);
        }
        else if (data.value === 'next') {
            handleNextButton($el, Alpine);
        }
        else if (data.value === 'prev') {
            handlePrevButton($el, Alpine);
        }
        else if (data.value === 'toggle') {
            handleToggleButton($el, Alpine);
        }
        else if (data.value === 'viewport') {
            handleViewport($el, Alpine);
        }
        else if (data.value === null) {
            handleRoot($el, Alpine, data, utilities);
        }
        else {
            throw new Error(`Unknown directive: x-slideshow:${data.value}`);
        }
    }).before('bind');
    Alpine.magic('slideshow', function ($el) {
        const $data = Alpine.$data($el);
        // Could probably just rename __slideshow_state to $slideshow and get rid of this magic
        // but I want to think through the implications of that before establishing a precedent
        return $data.__slideshow_state || {};
    });
    Alpine.magic('slide', function ($el) {
        const $data = Alpine.$data($el);
        return {
            get slideIndex() {
                return $data.__slideshowSlide_slideIndex;
            },
            get isCurrentSlide() {
                return $data.__slideshowSlide_isCurrentSlide;
            },
            get wasLastSlide() {
                return $data.__slideshowSlide_wasLastSlide;
            },
        };
    });
}
function handleControl($el, Alpine) {
    Alpine.bind($el, {
        ':aria-controls': '$id("slideshow")',
    });
}
function handlePlayButton($el, Alpine) {
    Alpine.bind($el, {
        ['x-data']() {
            return {
                init() {
                    if (!this.__slideshow_isRoot) {
                        warnMissingParentDirective('x-slideshow:play', 'x-slideshow', this.$el);
                    }
                },
            };
        },
        '@click': '$slideshow.play()',
        'x-slideshow:control': '',
    });
}
function handlePauseButton($el, Alpine) {
    Alpine.bind($el, {
        ['x-data']() {
            return {
                init() {
                    if (!this.__slideshow_isRoot) {
                        warnMissingParentDirective('x-slideshow:pause', 'x-slideshow', this.$el);
                    }
                },
            };
        },
        '@click': '$slideshow.pause()',
        'x-slideshow:control': '',
    });
}
function handleNextButton($el, Alpine) {
    Alpine.bind($el, {
        ['x-data']() {
            return {
                init() {
                    if (!this.__slideshow_isRoot) {
                        warnMissingParentDirective('x-slideshow:next', 'x-slideshow', this.$el);
                    }
                },
            };
        },
        '@click': '$slideshow.pause(); $slideshow.next()',
        'x-slideshow:control': '',
    });
}
function handlePrevButton($el, Alpine) {
    Alpine.bind($el, {
        ['x-data']() {
            return {
                init() {
                    if (!this.__slideshow_isRoot) {
                        warnMissingParentDirective('x-slideshow:prev', 'x-slideshow', this.$el);
                    }
                },
            };
        },
        '@click': '$slideshow.pause(); $slideshow.prev()',
        'x-slideshow:control': '',
    });
}
function handleToggleButton($el, Alpine) {
    Alpine.bind($el, {
        ['x-data']() {
            return {
                init() {
                    if (!this.__slideshow_isRoot) {
                        warnMissingParentDirective('x-slideshow:toggle', 'x-slideshow', this.$el);
                    }
                },
            };
        },
        '@click': '$slideshow.toggle()',
        'x-slideshow:control': '',
    });
}
function handleSlide($el, Alpine) {
    Alpine.bind($el, {
        ['x-data']() {
            return {
                init() {
                    // Prevent throwing an error when parent directive x-slideshow is missing
                    if (!this.__slideshow_isRoot) {
                        warnMissingParentDirective('x-slideshow:slide', 'x-slideshow', this.$el);
                        return;
                    }
                    this.__slideshow_state.register(this.$el);
                },
                destroy() {
                    if (!this.__slideshow_isRoot)
                        return;
                    this.__slideshow_state.unregister(this.$el);
                },
                get __slideshowSlide_slideIndex() {
                    if (!this.__slideshow_isRoot)
                        return null;
                    return Array.from(this.__slideshow_state.slides).indexOf(this.$el);
                },
                get __slideshowSlide_isCurrentSlide() {
                    if (!this.__slideshow_isRoot)
                        return false;
                    return (this.__slideshow_state.currentSlideIndex ===
                        this.__slideshowSlide_slideIndex);
                },
                get __slideshowSlide_wasLastSlide() {
                    if (!this.__slideshow_isRoot)
                        return false;
                    return (this.__slideshow_state.lastSlideIndex ===
                        this.__slideshowSlide_slideIndex);
                },
            };
        },
        role: 'group',
        'aria-roledescription': 'slide',
    });
}
function handleViewport($el, Alpine) {
    Alpine.bind($el, {
        ['x-data']() {
            return {
                init() {
                    // Prevent throwing an error when x-slideshow:viewport is commonly composed onto the same element as the root.
                    // This gives it a "tick" of time to load the root before loading the ":viewport"
                    this.$nextTick(() => {
                        const scope = Alpine.$data($el);
                        if (!scope.__slideshow_isRoot) {
                            warnMissingParentDirective('x-slideshow:viewport', 'x-slideshow', $el);
                        }
                    });
                },
            };
        },
        ':id': `$id('slideshow')`,
        role: 'region',
        'aria-roledescription': 'carousel',
        ':aria-live': '$slideshow.state == "playing" ? "off" : "polite"',
        '@keydown.left.stop.prevent': '$slideshow.prev()',
        '@keydown.right.stop.prevent': '$slideshow.next()',
        // focusin since focus does not bubble and the viewport itself is rarely focusable.
        // Keyboard and screen-reader users need the rotation to stop while they are inside.
        '@focusin': '$slideshow.pause()',
    });
}
function handleRoot($el, Alpine, data, { evaluate }) {
    var _a;
    const autoplay = data.modifiers.includes('autoplay');
    const slideDuration = (_a = getMillisecondsModifierValue(data.modifiers, 'duration')) !== null && _a !== void 0 ? _a : DEFAULT_SLIDE_DURATION;
    let expression = data.expression === '' ? '{}' : data.expression;
    let options = evaluate(expression);
    options.slideDuration = slideDuration;
    options.autoplay = autoplay;
    if (options !== undefined && options !== null && !isPlainObject(options)) {
        throw new Error(`options must be an object, but got ${options}`);
    }
    const state = buildSlideshowState(options);
    const slideTimer = createSlideTimer(() => state.slideDuration);
    Alpine.bind($el, {
        ['x-data']() {
            return {
                __slideshow_isRoot: true,
                __slideshow_autoplayTimeoutId: undefined,
                __slideshow_state: state,
                init() {
                    $el.style.setProperty('--slideshow-duration', `${this.__slideshow_state.slideDuration}ms`);
                    const syncAnimationPlayState = () => {
                        const playState = this.__slideshow_state.state === 'playing' ? 'running' : 'paused';
                        if ($el.style.getPropertyValue('--slideshow-play-state') !== playState) {
                            $el.style.setProperty('--slideshow-play-state', playState);
                        }
                    };
                    const scheduleNextSlide = () => {
                        syncAnimationPlayState();
                        // Clear any existing timeout
                        if (this.__slideshow_autoplayTimeoutId !== undefined) {
                            clearTimeout(this.__slideshow_autoplayTimeoutId);
                            this.__slideshow_autoplayTimeoutId = undefined;
                        }
                        if (this.__slideshow_state.state === 'playing') {
                            slideTimer.play();
                            // Schedule the next slide
                            this.__slideshow_autoplayTimeoutId = window.setTimeout(() => {
                                // Move to the next slide
                                this.__slideshow_state.next();
                                slideTimer.reset();
                                // Schedule next slide
                                scheduleNextSlide();
                            }, slideTimer.remainingTime);
                        }
                        else {
                            slideTimer.pause();
                        }
                    };
                    // Watch for changes in play state
                    this.$watch('__slideshow_state.state', () => {
                        scheduleNextSlide();
                    });
                    // Watch for slide changes (e.g., manual navigation)
                    this.$watch('__slideshow_state.currentSlideIndex', () => {
                        slideTimer.reset();
                        scheduleNextSlide();
                    });
                    // Initial scheduling
                    scheduleNextSlide();
                },
                destroy() {
                    if (this.__slideshow_autoplayTimeoutId !== undefined) {
                        clearTimeout(this.__slideshow_autoplayTimeoutId);
                    }
                    slideTimer.pause();
                    $el.style.setProperty('--slideshow-play-state', 'paused');
                },
            };
        },
        // No :id here — x-slideshow:viewport owns the id ($id('slideshow')), and the
        // controls' aria-controls point at it. Binding it on the root too duplicates
        // the id whenever the viewport is a separate element.
        'x-id': "['slideshow']",
    });
}
function createSlideTimer(getDuration) {
    let elapsedTime = 0;
    let startedAt = null;
    const readElapsedTime = () => {
        const runningTime = startedAt === null ? 0 : performance.now() - startedAt;
        return Math.min(getDuration(), Math.round(elapsedTime + runningTime));
    };
    return {
        get remainingTime() {
            return Math.max(0, getDuration() - readElapsedTime());
        },
        pause() {
            if (startedAt === null)
                return;
            elapsedTime = readElapsedTime();
            startedAt = null;
        },
        play() {
            if (startedAt !== null)
                return;
            startedAt = performance.now();
        },
        reset() {
            elapsedTime = 0;
            if (startedAt !== null)
                startedAt = performance.now();
        },
    };
}
function buildSlideshowState(options = {}) {
    let state = {
        state: options.autoplay ? 'playing' : 'paused',
        slideDuration: options.slideDuration || 1000,
        currentSlideIndex: options.initialSlideIndex || 0,
        slides: new Set(),
        lastSlideIndex: null,
        get totalSlides() {
            return this.slides.size;
        },
        get nextSlideIndex() {
            return mod(this.currentSlideIndex + 1, this.totalSlides);
        },
        get prevSlideIndex() {
            return mod(this.currentSlideIndex - 1, this.totalSlides);
        },
        register(el) {
            this.slides.add(el);
        },
        unregister(el) {
            this.slides.delete(el);
        },
        next() {
            this.currentSlideIndex = this.nextSlideIndex;
        },
        prev() {
            this.currentSlideIndex = this.prevSlideIndex;
        },
        play() {
            if (this.state === 'playing')
                return;
            this.state = 'playing';
        },
        pause() {
            if (this.state === 'paused')
                return;
            this.state = 'paused';
        },
        toggle() {
            if (this.state === 'playing') {
                this.pause();
            }
            else {
                this.play();
            }
        },
    };
    state = trackProperty(state, 'currentSlideIndex', 'lastSlideIndex');
    if ((options === null || options === void 0 ? void 0 : options.state) !== undefined) {
        copyProperty(options, state, 'state');
    }
    if ((options === null || options === void 0 ? void 0 : options.currentSlideIndex) !== undefined) {
        copyProperty(options, state, 'currentSlideIndex');
    }
    return state;
}
