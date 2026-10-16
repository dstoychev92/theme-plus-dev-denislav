/**
 * Pure math for a page scroll that stops below the sticky header.
 * No DOM, no store. The page-layout plugin's `$scrollIntoView` magic reads the boxes and applies the delta.
 */
/**
 * The scroll delta that brings an element into view below the sticky header. Returns 0 when the
 * element is already in view.
 *
 * - The top sits above the header line, or the element is too tall to fit below the header: align the
 *   top to the header line.
 * - The bottom sits below the viewport: align the bottom to the viewport edge.
 * - Otherwise: 0.
 *
 * The first rule also covers an element that spans the viewport. The native "nearest" alignment leaves
 * that element alone, but a re-rendered product grid has to scroll back to its first row.
 *
 * @example
 * const rect = el.getBoundingClientRect();
 * const delta = scrollDeltaBelowHeader({top: rect.top, bottom: rect.bottom, viewportHeight: 900, headerOffset: 84});
 * if (delta !== 0) window.scrollBy({top: delta, behavior: 'smooth'});
 */
export function scrollDeltaBelowHeader({ top, bottom, viewportHeight, headerOffset }) {
    const fitsBelowHeader = bottom - top <= viewportHeight - headerOffset;
    if (top < headerOffset || !fitsBelowHeader)
        return top - headerOffset;
    if (bottom > viewportHeight)
        return bottom - viewportHeight;
    return 0;
}
