import { Alpine as AlpineType } from 'alpinejs';
import type { ObjectTarget } from 'motion';
export interface ScrollStaggerOptions extends ObjectTarget<{}> {
    /** Selector for the staggered items inside the root. Defaults to `[data-animate-stagger-item]`. */
    selector?: string;
    /** Overlap between item animations, 0-1. `0.1` starts each item when the previous one is 10% through. Defaults to `0.2`. */
    stagger?: number;
    /** Motion scroll offsets that bound the enter, visible, and leave phases. Defaults to `['25% 100%', '0% 50%', '0% 0%', '75% 0%']`. */
    scrollOffset?: string[];
    /** Element whose scroll progress drives the timeline. Defaults to the root element. */
    target?: HTMLElement;
}
/**
 * Registers `x-scroll-stagger`, `x-scroll-stagger:enter`, and
 * `x-scroll-stagger:leave` for staggered Motion timelines tied to scroll
 * progress. The timeline scrubs with scroll, so scrolling back rewinds it.
 *
 * The options object takes {@link ScrollStaggerOptions} plus any extra Motion
 * keyframes, which hold the items' style while the root is fully visible. With no
 * extra keyframes, items hold the final values of the enter keyframes.
 *
 * A root taller than the viewport plays the enter sequence across its whole scroll
 * range and skips the visible and leave phases. With prefers-reduced-motion the items
 * hold their fully visible state and nothing scrubs.
 *
 * @example
 * ```html
 * <div
 *   x-scroll-stagger="{ selector: '[data-item]', stagger: 0.1 }"
 *   x-scroll-stagger:enter="{ opacity: [0, 1] }"
 *   x-scroll-stagger:leave="{ opacity: [1, 0] }"
 * >
 *   <span data-item>First</span>
 *   <span data-item>Second</span>
 * </div>
 * ```
 */
export default function scrollStagger(Alpine: AlpineType): void;
