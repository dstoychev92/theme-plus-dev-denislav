/**
 * Pure math/state helpers for header-stack sticky logic.
 * No DOM, no store – safe to unit test and use from any environment.
 */
export type StickyMode = 'always' | 'scroll' | 'never';
export type ScrollDirection = 'up' | 'down' | null;
/** Minimal element shape needed for sticky calculations (no DOM ref). */
export interface HeaderStackElement {
    height: number;
    stickyMode: StickyMode;
}
/**
 * Whether a row with the given mode should be sticky given current scroll state.
 * - always: always sticky
 * - scroll: sticky only when scrolling up and user has scrolled (isScrolled)
 * - never: never sticky
 */
export declare function isStickyActive(mode: StickyMode, scrollDirection: ScrollDirection, isScrolled: boolean): boolean;
/** Sum of heights of elements that are currently sticky. */
export declare function stickyElementsHeight(elements: HeaderStackElement[], scrollDirection: ScrollDirection, isScrolled: boolean): number;
/** Top offset for the sticky element at index (sum of heights of sticky elements before it). */
export declare function stickyTopForIndex(elements: HeaderStackElement[], index: number, scrollDirection: ScrollDirection, isScrolled: boolean): number;
/** Top offset (px as number) when sticky for each row index. Same length as elements. */
export declare function stickyTopsForAllIndices(elements: HeaderStackElement[], scrollDirection: ScrollDirection, isScrolled: boolean): number[];
/** Per-row state for applying sticky positioning: active and the CSS top value to apply. */
export interface StickyRowState {
    active: boolean;
    topPx: string;
}
/** For each row: whether it is currently sticky and the top value (stacked offset or negative height when hidden). */
export declare function stickyRowStates(elements: HeaderStackElement[], scrollDirection: ScrollDirection, isScrolled: boolean): StickyRowState[];
/**
 * Header sticky offset: the height of currently sticky rows, but only when the
 * header is actually stuck (scrollY > 0). Returns 0 at the top of the page
 * (header is in its natural position) and 0 when no rows are active (e.g.
 * scroll-mode-only header while scrolling down).
 */
export declare function headerStickyOffset({ stickyHeight, scrollY }: {
    stickyHeight: number;
    scrollY: number;
}): number;
/**
 * Sticky offset: distance from viewport top to the effective bottom of the header.
 * When no rows are currently sticky, returns 0. Otherwise returns the max of
 * (visible portion of full header) and (height of currently sticky rows).
 */
export declare function stickyOffset({ headerHeight, stickyHeight, scrollY, }: {
    headerHeight: number;
    stickyHeight: number;
    scrollY: number;
}): number;
