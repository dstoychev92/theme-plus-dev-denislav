import { AlpineComponent, Alpine as AlpineType } from 'alpinejs';
import type { DataSourceArray, PhotoSwipeOptions } from 'photoswipe';
import type PhotoSwipeLightbox from 'photoswipe/lightbox';
declare module 'alpinejs' {
    interface Magics<T> {
        /**
         * Open the lightbox at the slide with the given id — the same ids `x-photoswipe:button` takes.
         * For controls whose target is only known at click time (e.g. one zoom button serving
         * whichever gallery slide is currently shown). When no slide matches, warns and opens the
         * first slide. Resolves to false when the lightbox is unavailable.
         */
        $photoswipeOpen: (id: string | number) => Promise<boolean>;
    }
}
export type PhotoSwipeComponent = AlpineComponent<{
    __photoswipe_root: HTMLElement;
    __photoswipe_lightbox: PhotoSwipeLightbox | null;
    __photoswipe_initPromise: Promise<void>;
    __photoswipe_resolveInit: (() => void) | null;
    __photoswipe_idleId: number | null;
    __photoswipe_destroyed: boolean;
    __photoswipe_loadAndOpen: (id: string, _dataSource?: DataSourceArray, initialPoint?: {
        x: number;
        y: number;
    }) => Promise<boolean>;
    __photoswipe_buttonHeight: number;
    __photoswipe_counterHeight: number;
    __photoswipe_counterEl: HTMLElement | null;
}>;
/**
 * Photoswipe plugin for Alpine.js
 *
 * Adds PhotoSwipe lightbox functionality to Alpine.js applications.
 *
 * **Directives:**
 * - `x-photoswipe`: Root directive that initializes PhotoSwipe (optionally with a config expression)
 * - `x-photoswipe:button="id"`: Creates a button that opens the lightbox at the slide with that id
 * - `x-photoswipe:counter`: Template for the slide counter
 *
 * **Magics:**
 * - `$photoswipe`: The lightbox instance (null until initialized)
 * - `$photoswipeOpen(id)`: Open the lightbox at a slide id resolved at call time
 *
 * **Slide data (lazy):** When the lightbox opens, the plugin collects every
 * `[data-photoswipe-media]` and `[data-photoswipe-json]` node inside the root, in DOM order,
 * and uses that as the dataSource. This avoids duplicate slides after re-renders and defers
 * the work until open. Each node contributes one slide:
 * - `<img data-photoswipe-media="id">` — image slide built from the img's src, srcset,
 *   width/height attributes, and alt
 * - `<video data-photoswipe-media="id">` — video slide; the `<source>` gives the video URL
 *   and the poster `<img>` inside gives size and thumbnail
 * - any other element with `data-photoswipe-media="id"` — reads the first `<video>` or
 *   `<img>` inside it
 * - `<script type="application/json" data-photoswipe-json>{"id":"...","src":"...",...}</script>`
 *   — a raw PhotoSwipe SlideData object in the script body
 *
 * **Default configuration (root directive):**
 * When you use the root directive without an expression (`x-photoswipe` with no value), the plugin
 * uses `window.theme.photoswipe` as the config if it exists (e.g. in themes that set it in
 * the theme head). If `window.theme.photoswipe` is not defined, it falls back to an empty object.
 * So `x-photoswipe` is equivalent to `x-photoswipe="window.theme.photoswipe"` when the theme
 * provides that object. You can still pass any config expression to override, e.g.
 * `x-photoswipe="{ maxZoomLevel: 2 }"` or `x-photoswipe="myCustomConfig"`.
 *
 * @example Root with default theme config (bare directive)
 * ```html
 * <div x-photoswipe>
 *   <script type="application/json" data-photoswipe-json>{"src":"image.jpg","width":600,"height":400,"alt":"My Image"}</script>
 *   <button x-photoswipe:button="0">Open Lightbox</button>
 *   <template x-photoswipe:counter>
 *     <div><span x-text="currentIndex + 1"></span> of <span x-text="totalSlides"></span></div>
 *   </template>
 * </div>
 * ```
 *
 * @example Root with explicit or custom config
 * ```html
 * <div x-photoswipe="window.theme.photoswipe">
 * <div x-photoswipe="{ maxZoomLevel: 2, zoom: true }">
 * ```
 */
export default function photoSwipe(defaultConfig?: PhotoSwipeOptions): (Alpine: AlpineType) => void;
