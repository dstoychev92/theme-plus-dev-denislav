/**
 * Helpers for reading layout without forcing synchronous reflows.
 *
 * A frame renders in this order: rAF callbacks → style/layout → ResizeObserver
 * callbacks → paint. Reading geometry while style is dirty (microtask flushes, rAF
 * callbacks) forces a synchronous reflow. Two clean read points exist:
 *
 * - **ResizeObserver callbacks** — layout just ran, so reads are free, and style writes
 *   still land in the same frame's paint (no flash). Use `onFirstLayout` for one-off
 *   "measure, then apply initial styles" work, and `x-resize` for ongoing size tracking.
 * - **After paint** — `afterNextPaint` / `readLayoutAfterPaint` run in a task right after
 *   the frame commits. Reads are free, but writes render one frame later; never use them
 *   to apply initial visual state (it flashes). Use them to yield until pending DOM
 *   mutations have rendered (e.g. measure → mutate → measure loops).
 *
 * All `afterNextPaint`/`readLayoutAfterPaint` callbacks scheduled in the same frame share
 * a single flush with reads running first, so batched reads never interleave with
 * batched writes.
 */
let pendingReads = [];
let pendingCallbacks = [];
let flushScheduled = false;
function flushAfterPaint() {
    flushScheduled = false;
    const reads = pendingReads;
    const callbacks = pendingCallbacks;
    pendingReads = [];
    pendingCallbacks = [];
    for (const entry of reads) {
        if (!entry.cancelled)
            entry.fn();
    }
    for (const entry of callbacks) {
        if (!entry.cancelled)
            entry.fn();
    }
}
function scheduleFlushAfterPaint() {
    if (flushScheduled)
        return;
    flushScheduled = true;
    if (document.visibilityState === 'hidden') {
        // Hidden documents don't paint, so rAF would stall indefinitely.
        setTimeout(flushAfterPaint, 0);
    }
    else {
        // rAF alone runs *before* style/layout/paint; a task scheduled from inside it runs
        // right after the frame commits — the earliest point where layout is clean.
        requestAnimationFrame(() => setTimeout(flushAfterPaint, 0));
    }
}
/**
 * Runs `fn` after the next paint. Returns a cancel function.
 *
 * Layout is clean at this point, so geometry reads are free — but style writes here
 * render one frame later than writes made in a rAF. Prefer `onFirstLayout` when the
 * callback applies initial visual state.
 */
export function afterNextPaint(fn) {
    const entry = { fn, cancelled: false };
    pendingCallbacks.push(entry);
    scheduleFlushAfterPaint();
    return () => {
        entry.cancelled = true;
    };
}
export function afterNextPaintAsync() {
    return new Promise((resolve) => {
        afterNextPaint(resolve);
    });
}
/**
 * Runs the read callback after the next paint, before any `afterNextPaint` callbacks
 * from the same frame, so batched reads can't interleave with batched writes.
 */
export function readLayoutAfterPaint(fn) {
    return new Promise((resolve) => {
        pendingReads.push({ fn: () => resolve(fn()), cancelled: false });
        scheduleFlushAfterPaint();
    });
}
/**
 * Runs `fn` once the element has a layout box, inside a ResizeObserver callback:
 * after layout (reads are free — no forced reflow) but before paint (style writes
 * still land in this frame — no flash of unstyled state).
 *
 * For an element that is rendered when called, this fires during the current frame's
 * rendering steps. For a `display: none` element, it fires when the element first
 * gets a box — so measurements are never a meaningless 0×0. Returns a cancel function.
 */
export function onFirstLayout(el, fn) {
    const observer = new ResizeObserver((entries) => {
        observer.disconnect();
        fn(entries[0]);
    });
    observer.observe(el);
    return () => observer.disconnect();
}
