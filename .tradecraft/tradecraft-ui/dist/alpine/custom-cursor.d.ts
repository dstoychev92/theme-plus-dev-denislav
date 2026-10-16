import { Alpine as AlpineType, AlpineComponent } from 'alpinejs';
type CustomCursorRootRect = {
    left: number;
    right: number;
    top: number;
    bottom: number;
};
type CustomCursorComponent = AlpineComponent<{
    __customCursor_rootEl: HTMLElement | null;
    __customCursor_rootRect: CustomCursorRootRect | null;
    __customCursor_cursorEl: HTMLElement | null;
    __customCursor_isActive: boolean;
    __customCursor_isHidden: boolean;
    __customCursor_activeCursorName: string | null;
    __customCursor_currentSnapPointEl: HTMLElement | null;
    __customCursor_cursorEl_dimensions: {
        width: number;
        height: number;
    } | null;
    __customCursor_currentSnapPointRect: {
        x: number;
        y: number;
        width: number;
        height: number;
    } | null;
    __customCursor_targetPosition: {
        x: number;
        y: number;
    } | null;
    __customCursor_abortController: AbortController | null;
    get __customCursor_isSnapped(): boolean;
    __customCursor_updateRootRect(): void;
    __customCursor_handleMouseMove(e: MouseEvent): void;
    __customCursor_handleMouseOver(e: MouseEvent): void;
    __customCursor_handleMouseEnter(e: MouseEvent): void;
    __customCursor_handleMouseLeave(e: MouseEvent): void;
    __customCursor_attachActiveListeners(): void;
    __customCursor_setCurrentSnapPoint(el: HTMLElement): void;
    __customCursor_unsetCurrentSnapPoint(): void;
}>;
export type CustomCursorMagic = CustomCursorComponent;
declare module 'alpinejs' {
    interface Magics<T> {
        $customCursor: CustomCursorMagic;
    }
}
/**
 * Plugin to create a custom cursor that follows the mouse with spring physics,
 * snaps to snap points, and supports named cursor variants.
 *
 * Inspired by https://medium.com/14islands/developing-a-performant-custom-cursor-89f1688a02eb
 *
 * ## Touch devices
 *
 * On a device whose main pointer cannot hover (a phone or tablet) every directive below
 * does nothing at all — no state, no spring animations, no mouse listeners. `$customCursor`
 * still reads safely there, returning `undefined` for each value, so markup that binds to
 * it keeps working. Hide the cursor elements themselves with CSS for those devices.
 *
 * ## Directives
 *
 * - `x-custom-cursor` — Root element. Tracks mouse enter/leave/move.
 * - `x-custom-cursor:element` — Cursor element, positioned via spring-animated translateX/Y.
 *   Accepts an optional name (e.g. `x-custom-cursor:element="plus"`) for named cursors.
 *   Unnamed elements act as the default cursor.
 * - `x-custom-cursor:snap-point` — Snaps the cursor to this element's center on hover.
 *
 * ## Spring modifiers (on `x-custom-cursor:element`)
 *
 * - `.mass.<n>` — Spring mass (default: {@link SPRING_DEFAULT_CONFIG}). Higher = heavier/slower.
 * - `.stiffness.<n>` — Spring stiffness. Higher = snappier.
 * - `.damping.<n>` — Spring damping. Higher = less oscillation.
 *
 * ## Data attributes (on descendant elements inside the root)
 *
 * - `data-custom-cursor="<name>"` — Shows the named cursor when hovering this element.
 * - `data-hide-custom-cursor` — Hides all cursors when hovering this element.
 *
 * ## Reactive data attributes (set automatically on cursor/snap-point elements)
 *
 * - `data-active` — Present on a cursor element when it is the currently active cursor.
 * - `data-hidden` — Present when the cursor is over a `data-hide-custom-cursor` zone
 *   or when the cursor element would overflow the root bounds.
 * - `data-snapped` — Present when the cursor is snapped to a snap point.
 *
 * ## Magic: `$customCursor`
 *
 * - `$customCursor.isActive` — Whether the cursor is inside the root.
 * - `$customCursor.isSnapped` — Whether the cursor is snapped to a snap point.
 * - `$customCursor.isHidden` — Whether the cursor is in a hide zone.
 * - `$customCursor.targetPosition` — Current target `{x, y}` in viewport coordinates.
 * - `$customCursor.snap(el)` — Programmatically snap to an element.
 * - `$customCursor.unsnap()` — Programmatically unsnap.
 *
 * @example
 *
 * ```html
 * <div x-custom-cursor>
 *   <div x-custom-cursor:element class="fixed top-0 left-0 w-5 h-5 bg-red-500"></div>
 *   <div x-custom-cursor:element.mass.20="plus" class="fixed top-0 left-0 w-8 h-8 bg-blue-500"></div>
 *   <div x-custom-cursor:snap-point class="absolute top-1/2 left-1/2 w-12 h-12"></div>
 *   <div data-custom-cursor="plus">Hover for plus cursor</div>
 *   <div data-hide-custom-cursor>Hover to hide cursor</div>
 * </div>
 * ```
 */
export default function (Alpine: AlpineType): void;
export {};
