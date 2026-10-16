import { AlpineComponent, Alpine as AlpineType } from 'alpinejs';
import { StateMachine } from '../utils/state-machine';
import { ArrayToUnion } from '../types/utils';
declare module 'alpinejs' {
    interface Magics<T> {
        $slideshow: SlideshowMagic;
    }
}
type SlideshowMagic = SlideshowState;
export type SlideshowPlayState = ['paused', 'playing'];
export type SlideshowStateMachine = StateMachine<any, any, any>;
export type SlideshowState = {
    state: ArrayToUnion<SlideshowPlayState>;
    /**
     * The current slide index
     */
    currentSlideIndex: number;
    /**
     * The last slide index
     */
    lastSlideIndex: number | null;
    /**
     * The current slide index
     */
    nextSlideIndex: number;
    /**
     * The prev slide index
     */
    prevSlideIndex: number;
    /**
     * The total slides in the slideshow
     */
    totalSlides: number;
    /**
     * The autoplay slideDuration in milliseconds
     */
    slideDuration: number;
    /**
     * The number of slides in the slideshow
     */
    slides: Set<HTMLElement>;
    /**
     * Register a slide with the slideshow
     */
    register(el: HTMLElement): void;
    /**
     * Unregister a slide from the slideshow
     */
    unregister(el: HTMLElement): void;
    /**
     * Move to the next slide
     */
    next: () => void;
    /**
     * Move to the previous slide
     */
    prev: () => void;
    /**
     * Play the slideshow
     */
    play: () => void;
    /**
     * Pause the slideshow
     */
    pause: () => void;
    /**
     * Play or pause the slideshow
     */
    toggle: () => void;
};
export type SlideshowComponent = AlpineComponent<{
    __slideshow_isRoot: boolean;
    __slideshow_state: SlideshowState;
    __slideshow_autoplayTimeoutId: number | undefined;
}>;
export type SlideshowSlideComponent = AlpineComponent<{
    __slideshowSlide_slideIndex: number | null;
    get __slideshowSlide_isCurrentSlide(): boolean;
    get __slideshowSlide_wasLastSlide(): boolean;
}>;
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
export default function (Alpine: AlpineType): void;
export {};
