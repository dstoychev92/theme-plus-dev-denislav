/**
 * Framework-agnostic manager for a stacked sticky header.
 * Handles row registration and scroll-driven layout.
 * Notifies via callbacks so the host can keep its own state and set body CSS vars (e.g. --header-height, --header-bottom).
 */
import { type StickyMode, type ScrollDirection } from './header-stack';
export interface HeaderStackManagerOptions {
    /** Called when scroll position or direction changes. Host can update its store here. */
    onScrollState?(state: {
        scrollY: number;
        scrollProgress: number;
        scrollDirection: ScrollDirection;
    }): void;
    /** Called when header height or bottom changes. Host can update its store and set body --header-height / --header-bottom here. */
    onHeaderResize?(metrics: {
        headerHeight: number;
        headerBottom: number;
        headerStickyOffset: number;
        headerScrollUpHeight: number;
    }): void;
    /** Called when any header row becomes stuck or unstuck. Host can set data-header-stuck on the root here. */
    onStuckChange?(stuck: boolean): void;
}
/**
 * Manages a stacked sticky header: row registration and scroll-driven layout.
 * Uses callbacks so the host can update its store and set body CSS vars (e.g. in onHeaderResize).
 *
 * @example
 * const manager = new HeaderStackManager(rootEl, {
 *   onScrollState(s) { store.scrollY = s.scrollY; ... },
 *   onHeaderResize(m) { store.headerHeight = m.headerHeight; document.body.style.setProperty('--header-height', m.headerHeight + 'px'); ... },
 *   onStuckChange(stuck) { rootEl.toggleAttribute('data-header-stuck', stuck); },
 * });
 * // on teardown: manager.destroy();
 */
export declare class HeaderStackManager {
    private readonly rootEl;
    private readonly options;
    private cancelScroll;
    private cancelWaitForScroll;
    private resizeObserver;
    private mutationObserver;
    private scrollRafId;
    private isDestroyed;
    private lastScrollY;
    /** Last progress reported by motion's scroll() — reused in rAF paths so we never
     * recompute it from scrollHeight (a forced-reflow read). */
    private lastScrollProgress;
    private lastDirection;
    private hasScrolledPastThreshold;
    /** False until the ResizeObserver's first delivery; row heights are 0 until then. */
    private hasMeasuredHeights;
    private lastAnyStuck;
    private elements;
    constructor(rootEl: HTMLElement, options?: HeaderStackManagerOptions);
    private readonly startScrollTracking;
    destroy(): void;
    private handleScroll;
    registerHeader(el: HTMLElement, mode: StickyMode): void;
    unregisterHeader(el: HTMLElement): void;
    private scheduleScrollUpdate;
    /**
     * Re-derives everything from the cached row heights and writes the results. Pure
     * compute + writes — no DOM reads, so it is safe to call from anywhere (the
     * ResizeObserver keeps the heights fresh).
     */
    private recalculate;
    private writeStickyOffset;
    private applyPositioning;
}
