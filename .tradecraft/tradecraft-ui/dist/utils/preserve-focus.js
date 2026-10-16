/**
 * Preserve keyboard focus across DOM swaps (Alpine.morph or innerHTML replacement).
 *
 * When a section update replaces the node the user is focused on, the browser silently
 * drops focus to <body>, so the next Tab restarts from the top of the document (and can
 * even escape an open modal). Capture focus before the swap and, if it was lost, restore
 * it to the replacement element — or, when the element was removed outright (e.g. a cart
 * line item), to the nearest surviving container's first focusable element.
 */
const FOCUSABLE_SELECTOR = [
    'a[href]',
    'button:not(:disabled)',
    'input:not(:disabled):not([type="hidden"])',
    'select:not(:disabled)',
    'textarea:not(:disabled)',
    '[tabindex]',
]
    .map((selector) => `${selector}:not([tabindex="-1"]):not([aria-hidden="true"])`)
    .join(', ');
/**
 * Walk the ancestor chain and focus the first descendant, then the ancestor itself,
 * that takes focus. Earlier matches can be unfocusable at this moment (e.g. hidden
 * hover-only controls), so every candidate is tried until one holds focus.
 */
function focusNearestIn(ancestors, tryFocus) {
    for (const ancestor of ancestors) {
        if (!ancestor.isConnected)
            continue;
        for (const candidate of Array.from(ancestor.querySelectorAll(FOCUSABLE_SELECTOR))) {
            if (tryFocus(candidate))
                return true;
        }
        if (tryFocus(ancestor))
            return true;
    }
    return false;
}
/**
 * Snapshot the currently focused element if it lives inside rootEl.
 * Returns null when focus is elsewhere (nothing to preserve).
 */
export function captureFocus(rootEl) {
    const el = document.activeElement;
    if (!(el instanceof HTMLElement) || el === document.body || !rootEl.contains(el)) {
        return null;
    }
    const ancestors = [];
    for (let parent = el.parentElement; parent; parent = parent.parentElement) {
        ancestors.push(parent);
        if (parent === rootEl)
            break;
    }
    let selectionStart = null;
    let selectionEnd = null;
    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
        // selectionStart throws on input types that don't support selection (number, email, ...)
        try {
            selectionStart = el.selectionStart;
            selectionEnd = el.selectionEnd;
        }
        catch (_a) {
            /* not a selectable input */
        }
    }
    return {
        el,
        tag: el.tagName,
        focusKey: el.getAttribute('data-preserve-focus-key'),
        id: el.id || null,
        name: el.getAttribute('name'),
        value: 'value' in el ? String(el.value) : null,
        ariaLabel: el.getAttribute('aria-label'),
        ariaControls: el.getAttribute('aria-controls'),
        ancestors,
        selectionStart,
        selectionEnd,
    };
}
/**
 * Restore focus after a DOM swap when the swap caused focus to be lost.
 * No-op when nothing was captured or when focus is already on a real element
 * (e.g. a dialog deliberately moved it).
 */
export function restoreFocus(rootEl, snapshot) {
    if (!snapshot)
        return;
    const active = document.activeElement;
    const focusWasLost = !active || active === document.body || active === document.documentElement || !active.isConnected;
    if (!focusWasLost)
        return;
    const tryFocus = (el) => {
        if (!(el instanceof HTMLElement))
            return false;
        el.focus({ preventScroll: true });
        return document.activeElement === el;
    };
    const restoreSelection = () => {
        const el = document.activeElement;
        if ((el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) &&
            snapshot.selectionStart !== null &&
            snapshot.selectionEnd !== null) {
            try {
                el.setSelectionRange(snapshot.selectionStart, snapshot.selectionEnd);
            }
            catch (_a) {
                /* not a selectable input */
            }
        }
    };
    // The node survived the swap (morph patched it in place but focus was still dropped)
    if (snapshot.el.isConnected && tryFocus(snapshot.el)) {
        restoreSelection();
        return;
    }
    const tagSelector = snapshot.tag.toLowerCase();
    // 1) A replacement with the same explicit key — for controls with no stable id whose
    //    accessible label mutates across renders (e.g. a variant option gaining a sold-out suffix)
    if (snapshot.focusKey) {
        const candidates = Array.from(rootEl.querySelectorAll(`${tagSelector}[data-preserve-focus-key="${CSS.escape(snapshot.focusKey)}"]`));
        if (candidates.length === 1 && tryFocus(candidates[0])) {
            restoreSelection();
            return;
        }
    }
    // 2) A replacement with the same id
    if (snapshot.id) {
        const byId = document.getElementById(snapshot.id);
        if (byId && byId.tagName === snapshot.tag && tryFocus(byId)) {
            restoreSelection();
            return;
        }
    }
    // 3) A replacement controlling the same element — e.g. a quantity stepper's +/− buttons, whose
    //    aria-labels repeat on every line item but whose aria-controls points at that line's unique input
    if (snapshot.ariaControls) {
        const candidates = Array.from(rootEl.querySelectorAll(`${tagSelector}[aria-controls="${CSS.escape(snapshot.ariaControls)}"]`));
        const byLabel = snapshot.ariaLabel
            ? candidates.find((c) => c.getAttribute('aria-label') === snapshot.ariaLabel)
            : undefined;
        if (tryFocus(byLabel)) {
            restoreSelection();
            return;
        }
        if (candidates.length === 1 && tryFocus(candidates[0])) {
            restoreSelection();
            return;
        }
    }
    // 4) A replacement form control with the same name (+ value for radios/checkboxes/links rendered per option)
    if (snapshot.name) {
        const candidates = Array.from(rootEl.querySelectorAll(`${tagSelector}[name="${CSS.escape(snapshot.name)}"]`));
        const byValue = snapshot.value !== null
            ? candidates.find((c) => 'value' in c && String(c.value) === snapshot.value)
            : undefined;
        if (tryFocus(byValue)) {
            restoreSelection();
            return;
        }
        if (candidates.length === 1 && tryFocus(candidates[0])) {
            restoreSelection();
            return;
        }
    }
    // 5) A replacement with the same accessible label — only when unambiguous
    if (snapshot.ariaLabel) {
        const candidates = Array.from(rootEl.querySelectorAll(`${tagSelector}[aria-label]`)).filter((el) => el.getAttribute('aria-label') === snapshot.ariaLabel);
        if (candidates.length === 1 && tryFocus(candidates[0])) {
            restoreSelection();
            return;
        }
    }
    // 6) The element was removed with no replacement (e.g. a removed cart line item):
    //    shift focus to the nearest surviving container's first focusable element so the
    //    tab position stays local instead of resetting to the top of the document
    focusNearestIn(snapshot.ancestors, tryFocus);
}
/** Capture an element and its ancestor chain for later focus return. */
export function captureFocusReturnTarget(el) {
    const ancestors = [];
    for (let ancestor = el.parentElement; ancestor; ancestor = ancestor.parentElement) {
        ancestors.push(ancestor);
    }
    return { el, ancestors };
}
/** Focus the target or a control in its nearest surviving ancestor. */
export function focusElementOrNearest({ el, ancestors: savedAncestors }) {
    const tried = new Set([el]);
    // No preventScroll since only keyboard users reach this restore and they need the focused element on screen
    const tryFocus = (candidate) => {
        if (!(candidate instanceof HTMLElement) || tried.has(candidate))
            return false;
        tried.add(candidate);
        candidate.focus();
        return document.activeElement === candidate;
    };
    el.focus();
    if (document.activeElement === el)
        return;
    const ancestors = [];
    for (let ancestor = el.parentElement; ancestor; ancestor = ancestor.parentElement) {
        ancestors.push(ancestor);
    }
    // Try the current tree first since the element may have moved
    ancestors.push(...savedAncestors);
    focusNearestIn(ancestors, tryFocus);
}
/**
 * If focus currently sits inside `container`, move it to the closest logical neighbor —
 * following siblings first, then preceding siblings, then the nearest focusable outside
 * the container. Call this before hiding or removing a subtree that may hold focus
 * (hiding a focused element silently drops focus to <body>). Prefers a neighbor with the
 * same accessible label as the focused control (e.g. the next line item's remove button).
 */
export function relocateFocusFrom(container) {
    const active = document.activeElement;
    if (!(active instanceof HTMLElement) || !container.contains(active))
        return;
    const ariaLabel = active.getAttribute('aria-label');
    const tryFocus = (el) => {
        if (!(el instanceof HTMLElement))
            return false;
        el.focus({ preventScroll: true });
        return document.activeElement === el;
    };
    const pickIn = (scope) => {
        const focusables = Array.from(scope.querySelectorAll(FOCUSABLE_SELECTOR));
        if (scope.matches(FOCUSABLE_SELECTOR))
            focusables.unshift(scope);
        const preferred = ariaLabel ? focusables.find((f) => f.getAttribute('aria-label') === ariaLabel) : undefined;
        return tryFocus(preferred) || tryFocus(focusables[0]);
    };
    for (let sibling = container.nextElementSibling; sibling; sibling = sibling.nextElementSibling) {
        if (pickIn(sibling))
            return;
    }
    for (let sibling = container.previousElementSibling; sibling; sibling = sibling.previousElementSibling) {
        if (pickIn(sibling))
            return;
    }
    for (let parent = container.parentElement; parent; parent = parent.parentElement) {
        const focusables = Array.from(parent.querySelectorAll(FOCUSABLE_SELECTOR)).filter((f) => !container.contains(f));
        if (focusables.length && tryFocus(focusables[0]))
            return;
    }
}
