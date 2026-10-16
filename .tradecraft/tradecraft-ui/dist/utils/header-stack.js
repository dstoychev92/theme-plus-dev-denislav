/**
 * Pure math/state helpers for header-stack sticky logic.
 * No DOM, no store – safe to unit test and use from any environment.
 */
/**
 * Whether a row with the given mode should be sticky given current scroll state.
 * - always: always sticky
 * - scroll: sticky only when scrolling up and user has scrolled (isScrolled)
 * - never: never sticky
 */
export function isStickyActive(mode, scrollDirection, isScrolled) {
    if (mode === 'always')
        return true;
    if (mode === 'scroll')
        return scrollDirection === 'up' && isScrolled;
    return false;
}
/** Sum of heights of elements that are currently sticky. */
export function stickyElementsHeight(elements, scrollDirection, isScrolled) {
    let h = 0;
    for (const item of elements) {
        if (isStickyActive(item.stickyMode, scrollDirection, isScrolled))
            h += item.height;
    }
    return h;
}
/** Top offset for the sticky element at index (sum of heights of sticky elements before it). */
export function stickyTopForIndex(elements, index, scrollDirection, isScrolled) {
    let top = 0;
    for (let i = 0; i < index; i++) {
        if (isStickyActive(elements[i].stickyMode, scrollDirection, isScrolled)) {
            top += elements[i].height;
        }
    }
    return top;
}
/** Top offset (px as number) when sticky for each row index. Same length as elements. */
export function stickyTopsForAllIndices(elements, scrollDirection, isScrolled) {
    return elements.map((_, i) => stickyTopForIndex(elements, i, scrollDirection, isScrolled));
}
/** For each row: whether it is currently sticky and the top value (stacked offset or negative height when hidden). */
export function stickyRowStates(elements, scrollDirection, isScrolled) {
    const tops = stickyTopsForAllIndices(elements, scrollDirection, isScrolled);
    return elements.map((el, i) => {
        const active = isStickyActive(el.stickyMode, scrollDirection, isScrolled);
        const topPx = active ? `${tops[i]}px` : `${-el.height}px`;
        return { active, topPx };
    });
}
/**
 * Header sticky offset: the height of currently sticky rows, but only when the
 * header is actually stuck (scrollY > 0). Returns 0 at the top of the page
 * (header is in its natural position) and 0 when no rows are active (e.g.
 * scroll-mode-only header while scrolling down).
 */
export function headerStickyOffset({ stickyHeight, scrollY }) {
    if (scrollY === 0)
        return 0;
    return stickyHeight;
}
/**
 * Sticky offset: distance from viewport top to the effective bottom of the header.
 * When no rows are currently sticky, returns 0. Otherwise returns the max of
 * (visible portion of full header) and (height of currently sticky rows).
 */
export function stickyOffset({ headerHeight, stickyHeight, scrollY, }) {
    if (stickyHeight === 0)
        return 0;
    const visibleBottom = Math.max(0, headerHeight - scrollY);
    return Math.max(visibleBottom, stickyHeight);
}
