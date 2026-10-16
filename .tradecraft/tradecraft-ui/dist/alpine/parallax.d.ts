import { Alpine as AlpineType } from 'alpinejs';
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
export default function (Alpine: AlpineType): void;
