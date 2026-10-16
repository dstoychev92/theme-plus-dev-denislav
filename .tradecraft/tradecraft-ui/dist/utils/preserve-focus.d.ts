/**
 * Preserve keyboard focus across DOM swaps (Alpine.morph or innerHTML replacement).
 *
 * When a section update replaces the node the user is focused on, the browser silently
 * drops focus to <body>, so the next Tab restarts from the top of the document (and can
 * even escape an open modal). Capture focus before the swap and, if it was lost, restore
 * it to the replacement element — or, when the element was removed outright (e.g. a cart
 * line item), to the nearest surviving container's first focusable element.
 */
export type FocusSnapshot = {
    el: HTMLElement;
    tag: string;
    /** Explicit stable identity (data-preserve-focus-key) for elements whose id/label change across renders */
    focusKey: string | null;
    id: string | null;
    name: string | null;
    value: string | null;
    ariaLabel: string | null;
    ariaControls: string | null;
    /** Ancestor chain from the focused element up to (and including) the swap root, closest first */
    ancestors: HTMLElement[];
    selectionStart: number | null;
    selectionEnd: number | null;
};
/**
 * Snapshot the currently focused element if it lives inside rootEl.
 * Returns null when focus is elsewhere (nothing to preserve).
 */
export declare function captureFocus(rootEl: HTMLElement): FocusSnapshot | null;
/**
 * Restore focus after a DOM swap when the swap caused focus to be lost.
 * No-op when nothing was captured or when focus is already on a real element
 * (e.g. a dialog deliberately moved it).
 */
export declare function restoreFocus(rootEl: HTMLElement, snapshot: FocusSnapshot | null): void;
export type FocusReturnTarget = {
    el: HTMLElement;
    ancestors: HTMLElement[];
};
/** Capture an element and its ancestor chain for later focus return. */
export declare function captureFocusReturnTarget(el: HTMLElement): FocusReturnTarget;
/** Focus the target or a control in its nearest surviving ancestor. */
export declare function focusElementOrNearest({ el, ancestors: savedAncestors }: FocusReturnTarget): void;
/**
 * If focus currently sits inside `container`, move it to the closest logical neighbor —
 * following siblings first, then preceding siblings, then the nearest focusable outside
 * the container. Call this before hiding or removing a subtree that may hold focus
 * (hiding a focused element silently drops focus to <body>). Prefers a neighbor with the
 * same accessible label as the focused control (e.g. the next line item's remove button).
 */
export declare function relocateFocusFrom(container: HTMLElement): void;
