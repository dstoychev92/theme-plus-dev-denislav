import { Alpine as AlpineType, AlpineComponent } from 'alpinejs';
import { PanGestureRecognizer } from '../utils/pan-gesture-recognizer';
import { ScrollListMagic } from './scroll-list';
import { PanSession } from '../utils/pan-session';
import { AnimationPlaybackControls } from 'motion';
type CarouselRootComponent = AlpineComponent<{
    __carousel_isRoot: boolean;
    __carousel_state?: 'initial' | 'panning' | 'animating' | 'scrolling';
    __carousel_requestBoundsUpdate(): void;
    __carousel_isMeasurementScheduled: boolean;
    __carousel_scrollWidth: number;
    __carousel_viewportWidth: number;
    __carousel_isEnabled: boolean;
    __carousel_panSession: PanSession | null;
    __carousel_initialScrollLeft: number | null;
    __carousel_gestureRecognizer: PanGestureRecognizer | null;
    __carousel_trackEl: HTMLElement | null;
    __carousel_viewportEl: HTMLElement | null;
    __carousel_beginPan: () => void;
    __carousel_continuePan: () => void;
    __carousel_endPan: () => void;
    __carousel_animateToScrollLeft: () => void;
    __carousel_jumpToScrollLeft: (scrollLeft: number) => void;
    __carousel_animation: AnimationPlaybackControls | null;
    __carousel_maxScrollLeft: number;
    __carousel_isScrollable: boolean;
}>;
declare module 'alpinejs' {
    interface Magics<T> {
        $carousel: CarouselMagic;
    }
}
type CarouselMagic = ScrollListMagic & {
    state: CarouselRootComponent['__carousel_state'];
    isPanning: boolean;
};
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
export default function (Alpine: AlpineType): void;
export {};
