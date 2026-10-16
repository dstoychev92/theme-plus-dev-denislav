import { isHtmlElement } from '../utils/dom';
/**
 * Detect iOS devices (including iPad on iOS 13+)
 */
function isIOS() {
    if (typeof window === 'undefined')
        return false;
    return (/iPad|iPhone|iPod/.test(navigator.platform) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));
}
/**
 * Check if an element is scrollable (has overflow)
 */
export function isScrollable(node, checkForOverflow) {
    if (!node) {
        return false;
    }
    let style = window.getComputedStyle(node);
    let isScrollable = /(auto|scroll)/.test(style.overflow + style.overflowX + style.overflowY);
    if (isScrollable && checkForOverflow) {
        isScrollable = node.scrollHeight !== node.clientHeight || node.scrollWidth !== node.clientWidth;
    }
    return isScrollable;
}
/**
 * Get the nearest scrollable parent element
 */
export function getScrollParent(node, checkForOverflow) {
    let scrollableNode = node;
    if (isScrollable(scrollableNode, checkForOverflow)) {
        scrollableNode = scrollableNode.parentElement;
    }
    while (scrollableNode && !isScrollable(scrollableNode, checkForOverflow)) {
        scrollableNode = scrollableNode.parentElement;
    }
    return scrollableNode || document.scrollingElement || document.documentElement;
}
/**
 * Global set tracking elements that have active scroll locks
 */
const activeLocks = new WeakSet();
/**
 * Track whether we have actually applied a global scroll lock.
 * This prevents cleanup/update paths from "unlocking" when no lock was ever active.
 */
let isScrollLocked = false;
/**
 * Store cleanup functions for iOS event listeners
 */
let iosCleanup = null;
/**
 * Store cleanup functions for standard browser styles
 */
let standardCleanup = null;
/**
 * Get the scrollbar width to compensate for layout shift
 */
function getScrollbarWidth() {
    return window.innerWidth - document.documentElement.clientWidth;
}
/**
 * Check if scrollbar-gutter is supported
 */
function supportsScrollbarGutter() {
    return CSS.supports('scrollbar-gutter', 'stable');
}
/**
 * Set an inline style on `<html>` and return a cleanup that only removes the value we applied.
 *
 * We intentionally do not restore a captured "original" inline value. If unlock cleanup was
 * skipped or reordered (e.g. stale timers), the previous lock can leave `overflow: hidden` on
 * `<html>`; restoring that would treat our own lock as the baseline and leave scroll stuck.
 */
function setDocumentStyle(property, value) {
    const element = document.documentElement;
    element.style.setProperty(property, value);
    return () => {
        if (element.style.getPropertyValue(property) === value) {
            element.style.removeProperty(property);
        }
    };
}
/**
 * Prevent scroll on standard browsers (desktop)
 * Based on React Aria's preventScrollStandard
 */
function preventScrollStandard() {
    const cleanups = [];
    const scrollbarWidth = getScrollbarWidth();
    // Compensate for scrollbar width to prevent layout shift
    if (scrollbarWidth > 0) {
        if (supportsScrollbarGutter()) {
            cleanups.push(setDocumentStyle('scrollbar-gutter', 'stable'));
        }
        else {
            cleanups.push(setDocumentStyle('padding-right', `${scrollbarWidth}px`));
        }
    }
    // Prevent scrolling
    cleanups.push(setDocumentStyle('overflow', 'hidden'));
    return () => {
        cleanups.forEach((cleanup) => cleanup());
    };
}
/**
 * Prevent scroll on iOS Safari
 * Based on React Aria's preventScrollMobileSafari (simplified)
 *
 * iOS Safari ignores overflow:hidden, so we prevent touchmove events on the document
 * while allowing them within scrollable elements.
 */
function preventScrollMobileSafari() {
    const cleanups = [];
    let scrollable = null;
    let allowTouchMove = false;
    const isRangeSliderTarget = (el) => {
        return el instanceof HTMLInputElement && el.type === 'range';
    };
    const isSliderEvent = (e) => {
        var _a, _b;
        if (isRangeSliderTarget(e.target))
            return true;
        const target = e.target;
        if (isHtmlElement(target) && target.getAttribute('role') === 'slider')
            return true;
        if (isHtmlElement(target) && target.closest('input[type="range"], [role="slider"]'))
            return true;
        const path = (_b = (_a = e.composedPath) === null || _a === void 0 ? void 0 : _a.call(e)) !== null && _b !== void 0 ? _b : [];
        return path.some((el) => isRangeSliderTarget(el) || (isHtmlElement(el) && el.getAttribute('role') === 'slider'));
    };
    // Inject overscroll-behavior: contain to prevent scroll chaining
    // This must be applied before touchstart as of iOS 26
    const style = document.createElement('style');
    style.textContent = `@layer { * { overscroll-behavior: contain; } }`.trim();
    document.head.prepend(style);
    cleanups.push(() => style.remove());
    const onTouchStart = (e) => {
        const touchEvent = e;
        // Store the nearest scrollable parent element from the element that the user touched.
        let target = touchEvent.target;
        scrollable = isScrollable(target) ? target : getScrollParent(target, true);
        allowTouchMove = false;
        // If the target is selected, don't preventDefault in touchmove to allow user to adjust selection.
        let selection = target.ownerDocument.defaultView.getSelection();
        if (selection && !selection.isCollapsed && selection.containsNode(target, true)) {
            allowTouchMove = true;
        }
        if (isSliderEvent(e)) {
            allowTouchMove = true;
        }
        // If this is a focused input element with a selected range, allow user to drag the selection handles.
        if ('selectionStart' in target &&
            'selectionEnd' in target &&
            target.selectionStart < target.selectionEnd &&
            target.ownerDocument.activeElement === target) {
            allowTouchMove = true;
        }
    };
    const onTouchMove = (e) => {
        const touchEvent = e;
        // Allow pinch-zooming.
        if (touchEvent.touches.length > 1 || allowTouchMove) {
            return;
        }
        // Prevent scrolling the window.
        if (!scrollable || scrollable === document.documentElement || scrollable === document.body) {
            touchEvent.preventDefault();
            return;
        }
        // overscroll-behavior should prevent scroll chaining, but currently does not
        // if the element doesn't actually overflow. https://bugs.webkit.org/show_bug.cgi?id=243452
        // This checks that both the width and height do not overflow, otherwise we might
        // block horizontal scrolling too. In that case, adding `touch-action: pan-x` to
        // the element will prevent vertical page scrolling. We can't add that automatically
        // because it must be set before the touchstart event.
        if (scrollable.scrollHeight === scrollable.clientHeight && scrollable.scrollWidth === scrollable.clientWidth) {
            touchEvent.preventDefault();
        }
    };
    const touchListenerController = new AbortController();
    const touchListenerOptions = { passive: false, capture: true, signal: touchListenerController.signal };
    document.addEventListener('touchstart', onTouchStart, touchListenerOptions);
    document.addEventListener('touchmove', onTouchMove, touchListenerOptions);
    cleanups.push(() => touchListenerController.abort());
    return () => {
        cleanups.forEach((cleanup) => cleanup());
    };
}
/**
 * Apply scroll lock styles to the body
 * Based on React Aria's usePreventScroll approach
 */
function lockScrolling() {
    // Avoid re-locking
    if (isScrollLocked)
        return;
    isScrollLocked = true;
    if (isIOS()) {
        iosCleanup = preventScrollMobileSafari();
    }
    else {
        standardCleanup = preventScrollStandard();
    }
    // Data attribute to track if the body is scroll locked
    document.documentElement.dataset.scrollLocked = 'true';
}
/**
 * Remove scroll lock styles from the body
 */
function unlockScrolling() {
    // If we never locked (or already unlocked), do nothing.
    if (!isScrollLocked && !iosCleanup && !standardCleanup)
        return;
    if (iosCleanup) {
        iosCleanup();
        iosCleanup = null;
    }
    if (standardCleanup) {
        standardCleanup();
        standardCleanup = null;
    }
    // Remove data attributes
    document.documentElement.dataset.scrollLocked = 'false';
    isScrollLocked = false;
}
/**
 * Update scroll lock state based on active locks
 */
function updateScrollLock() {
    if (lockCount > 0) {
        lockScrolling();
    }
    else {
        unlockScrolling();
    }
}
/**
 * Counter for active locks (since WeakSet doesn't have size)
 */
let lockCount = 0;
/**
 * Locks page scrolling while a boolean expression is true.
 *
 * Locks are counted across elements, so the page stays locked until every
 * `x-scroll-lock` expression is false again.
 *
 * Standard browsers get `overflow: hidden` on `<html>` plus scrollbar-width
 * compensation (`scrollbar-gutter: stable`, or `padding-right` where unsupported) so
 * the layout does not shift. iOS Safari ignores `overflow: hidden`, so there the plugin
 * blocks `touchmove` on the document while it still allows scrollable descendants,
 * pinch zoom, range sliders, and text-selection handles.
 *
 * While locked, `<html>` carries `data-scroll-locked="true"`.
 *
 * @example
 * <dialog x-dialog:dialog x-scroll-lock="$dialog.isOpen">…</dialog>
 */
export default function (Alpine) {
    Alpine.directive('scroll-lock', Alpine.skipDuringClone(($el, { expression }, { effect, evaluateLater, cleanup }) => {
        if (!isHtmlElement($el)) {
            throw new Error(`Expected HTMLElement but got ${$el}`);
        }
        let evaluator = evaluateLater(expression);
        let wasScrollLocked = false;
        effect(() => evaluator((isScrollLocked) => {
            if (wasScrollLocked === isScrollLocked)
                return;
            if (isScrollLocked && !wasScrollLocked) {
                activeLocks.add($el);
                lockCount++;
                updateScrollLock();
            }
            else if (!isScrollLocked && wasScrollLocked) {
                if (activeLocks.has($el)) {
                    activeLocks.delete($el);
                    lockCount--;
                }
                updateScrollLock();
            }
            wasScrollLocked = !!isScrollLocked;
        }));
        cleanup(() => {
            if (activeLocks.has($el)) {
                activeLocks.delete($el);
                lockCount--;
            }
            updateScrollLock();
        });
    }));
}
