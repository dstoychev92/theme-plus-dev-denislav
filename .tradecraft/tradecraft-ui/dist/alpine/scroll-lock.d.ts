import { Alpine as AlpineType } from 'alpinejs';
/**
 * Check if an element is scrollable (has overflow)
 */
export declare function isScrollable(node: Element | null, checkForOverflow?: boolean): boolean;
/**
 * Get the nearest scrollable parent element
 */
export declare function getScrollParent(node: Element, checkForOverflow?: boolean): Element;
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
export default function (Alpine: AlpineType): void;
