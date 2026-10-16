/**
 * Alpine plugin: page scroll, viewport/layout state, and stacked sticky headers.
 *
 * Manages scroll position, scroll progress (0–1), scroll direction, visual viewport height,
 * and (when a header stack is present) header height, header bottom, and the header sticky offset.
 *
 * ## Store: Alpine.store('page')
 *
 * - **scrollY** — Current scroll position in px.
 * - **scrollProgress** — Scroll progress 0–1 (0 = top, 1 = bottom).
 * - **scrollDirection** — `'up'` | `'down'` | null.
 * - **visualViewportHeight** — window.visualViewport.height (e.g. for modals/drawers).
 * - **headerHeight** — Total height of registered header rows (0 if no stack).
 * - **headerBottom** — Distance from viewport top to bottom of header (min 0).
 * - **headerStickyOffset** — Height of currently stuck rows (0 at top of page or when no rows are active).
 * - **headerScrollUpHeight** — Height of every row that sticks while the page scrolls up: the `always` and
 *   `scroll` rows. It changes on a resize, not on scroll. Subtract it from a scroll target so a smooth
 *   scroll up lands below the header, since the scroll itself reveals the `scroll` rows.
 * - **isScrolled** — scrollY > 0.
 *
 * Visual viewport height is correct from the moment the plugin is registered. Scroll
 * tracking starts on the page's first scroll — until then the defaults (top of page, no
 * direction) are already right, and the first scroll catches the store up immediately.
 *
 * ## Directives
 *
 * - **x-header-stack** — Stack root; also drives scroll state and viewport height when present.
 * - **x-header-stack:header** [.always | .scroll] — Register a header row (see below).
 *
 * ## Magics
 *
 * - **$scrollIntoView(el = $el, {behavior = 'smooth'})** — Scrolls the page so `el` sits in view below the
 *   header rows that stick on a scroll up. Use it in place of `el.scrollIntoView()` for a page scroll.
 *   The top aligns to the header line when it is hidden, when the element is too tall to fit below the
 *   header, or when the element spans the viewport. The bottom aligns to the viewport edge when the
 *   element sits below. An element already in view does not move.
 *
 * ```html
 * <div @theme:section:navigate.window="$scrollIntoView($refs.results)">
 * ```
 *
 * ## Header stack (x-header-stack)
 *
 * One element is the **stack root**. Its direct children are **rows** with sticky modes:
 * - **always** — Row is always sticky at its stacked offset.
 * - **scroll** — Sticky only when scrolling up past a threshold; hides when scrolling down.
 * - **never** (default) — Normal flow.
 *
 * ## CSS vars
 * - `--header-height` — Sum of all of the header rows, written on `body`. It changes on a resize, not on
 *   scroll. Useful for matching elements to the header height like predictive search flyout
 * - `--header-bottom` — Current distance from viewport top to bottom of the header. Useful for offsetting
 *   elements so they don't overlap the header e.g. sticky product details columns, notifications, etc
 * - `--header-sticky-offset` — Same as `--header-bottom` except it is 0px when at the top of the page or when
 *   no rows are sticky. Useful for offsetting product media column so that it doesn't overlap the header
 *   when sticky, but does hit the top of the page when not sticky and user is scrolled all the way up
 *
 * `--header-bottom` and `--header-sticky-offset` change during a scroll, so nothing writes them on
 * `body`. A custom property on `body` inherits, and changing one makes the browser recompute the
 * style of every element on the page: 25 to 55 ms on a desktop and 390 ms at 4x CPU throttling on a
 * page with 18,000 elements, once or twice per flick. An element that needs one of these values
 * binds it from the store on itself:
 *
 * ```html
 * <div :style="{'--header-bottom': $store.page.headerBottom + 'px'}" class="sticky top-[--header-bottom]">
 * ```
 *
 * `x-sticky-columns:column` sets both on its column.
 *
 * @example
 * ```html
 * <header x-data x-header-stack>
 *   <div x-header-stack:header.always>Main nav</div>
 *   <div x-header-stack:header.scroll>Search bar</div>
 * </header>
 * ```
 */
import { Alpine as AlpineType } from 'alpinejs';
export type PageLayoutScrollDirection = 'up' | 'down' | null;
export interface ScrollIntoViewMagicOptions {
    /** Defaults to 'smooth' */
    behavior?: ScrollBehavior;
}
/** Scrolls the page so the element sits in view below the header rows that stick on a scroll up. */
export type ScrollIntoViewMagic = (el?: Element, options?: ScrollIntoViewMagicOptions) => void;
export interface PageLayoutStore {
    scrollY: number;
    scrollProgress: number;
    scrollDirection: PageLayoutScrollDirection;
    visualViewportHeight: number;
    headerHeight: number;
    headerBottom: number;
    headerStickyOffset: number;
    headerScrollUpHeight: number;
    get isScrolled(): boolean;
}
declare module 'alpinejs' {
    interface Stores {
        page: PageLayoutStore;
    }
    interface Magics<T> {
        /**
         * Scrolls the page so the element (default `$el`) sits in view below the header rows that stick on
         * a scroll up. An element already in view does not move.
         */
        $scrollIntoView: ScrollIntoViewMagic;
    }
}
export default function pageLayout(Alpine: AlpineType): void;
