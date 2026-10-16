import { Alpine as AlpineType } from 'alpinejs';
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
export default function (Alpine: AlpineType): void;
