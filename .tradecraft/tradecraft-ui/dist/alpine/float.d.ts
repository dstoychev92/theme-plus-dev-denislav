import type { Placement, ComputePositionConfig, Middleware, MiddlewareData, Alignment, RootBoundary, Side } from '@floating-ui/dom';
import { Alpine as AlpineType, DirectiveData, AlpineComponent } from 'alpinejs';
export type FloatMagicOptions = Partial<ComputePositionConfig>;
declare global {
    interface Node {
        _x_floatingUiCancelFn?: VoidFunction;
    }
}
declare module 'alpinejs' {
    interface Magics<T> {
        /**
         * State of the enclosing x-float: referenceEl (get/set), isPositioned, the resolved
         * placement / side / alignment, matchSizeEnabled (get/set), updatePosition(),
         * enableAutoUpdate(), disableAutoUpdate(), reset(), and middleware (get/set)
         */
        $float: FloatMagic;
    }
}
export type FloatOptions = {
    rootBoundary?: RootBoundary;
    referenceEl?: HTMLElement;
    strategy?: FloatStrategy;
    initialUpdate?: boolean;
    autoUpdate?: boolean;
    offset?: number;
    cover?: boolean;
    autoPlacement?: AxisMode;
    flip?: boolean;
    fitX?: boolean;
    fitY?: boolean;
    shift?: ShiftMode;
    matchSize?: boolean;
    padding?: number;
};
export type FloatStrategy = 'absolute' | 'fixed' | 'transform' | 'transform3d' | 'css';
export type AxisMode = boolean | 'x' | 'y';
export type ShiftMode = boolean | 'cross' | 'both';
export type FloatComponent = AlpineComponent<{
    __float_isRoot: boolean;
    __float_positionData: {
        x: number;
        y: number;
    } | null;
    __float_arrowData: MiddlewareData['arrow'] | null;
    __float_isPositioned: boolean;
    __float_strategy: FloatStrategy;
    __float_arrowEl: HTMLElement | null;
    __float_referenceEl: HTMLElement | null;
    __float_initialPlacement: Placement | undefined;
    __float_placement: Placement | null;
    __float_alignment: Alignment | null;
    __float_side: Side | null;
    __float_rootBoundary: RootBoundary;
    __float_autoUpdateEnabled: boolean;
    __float_initialUpdate: boolean;
    __float_offset: number;
    __float_coverEnabled: boolean;
    __float_autoPlacementEnabled: AxisMode;
    __float_flipEnabled: boolean;
    __float_fitYEnabled: boolean;
    __float_fitXEnabled: boolean;
    __float_shiftEnabled: ShiftMode;
    __float_matchSizeEnabled: boolean;
    __float_padding: number;
    __float_customMiddleware: Middleware[];
    __float_updatePosition: () => Promise<void>;
    __float_startAutoUpdate: () => Promise<void>;
    __float_getStyles: () => void;
    __float_reset: () => void;
    __float_cancelAutoUpdate: (() => void) | null;
}>;
export type FloatMagic = {
    get referenceEl(): HTMLElement | null;
    set referenceEl(el: HTMLElement | null);
    get isPositioned(): boolean;
    get placement(): Placement | null;
    get side(): Side | null;
    get alignment(): Alignment | null;
    get matchSizeEnabled(): boolean;
    set matchSizeEnabled(value: boolean);
    updatePosition(): void;
    enableAutoUpdate(): void;
    disableAutoUpdate(): void;
    reset(): void;
    get middleware(): Middleware[];
    set middleware(middleware: Middleware[]);
};
/**
 * Make an element "float" relative to a reference element using Floating UI
 * https://floating-ui.com/
 * The expression is the reference element, or an options object. A falsey expression
 * disables floating — gate it on visibility (x-float="open && $refs.reference") to
 * avoid computing positions for hidden elements.
 *
 * Directives:
 * - x-float - The floating element. Modifiers:
 *   - .top / .bottom-start / .left-end / ... - Preferred placement, any Floating UI
 *     placement. With no placement modifier, auto placement picks the side with the
 *     most space.
 *   - .offset / .offset.10px - Distance from the reference (bare .offset = 20px).
 *   - .flip - Flip to the opposite side when out of space. Throws when combined with
 *     .auto https://floating-ui.com/docs/autoPlacement#conflict-with-flip
 *   - .auto / .auto-x / .auto-y - Pick the side with the most space (any side /
 *     left-right only / top-bottom only).
 *   - .shift / .shift-cross / .shift-both - Slide along the reference to stay in view
 *     (main axis / cross axis / both).
 *   - .cover - Position over the reference instead of beside it.
 *   - .fit-x / .fit-y - Cap max-width / max-height to the available space, measured
 *     after flip and shift.
 *   - .match - Match the reference's width (its height for left/right placements).
 *   - .pad / .pad.10px - Boundary padding used by flip, shift, and fit
 *     (bare .pad = 5px).
 *   - .update - Reposition on scroll and resize (Floating UI autoUpdate).
 *   - .absolute / .transform / .transform3d / .css - Positioning strategy. Default is
 *     fixed left/top; the transform strategies translate instead; css writes --float-x
 *     and --float-y custom properties (and --float-max-width/-height, --float-width/
 *     -height for fit and match) and leaves applying them to your stylesheet.
 * - x-float:arrow - An arrow element inside the floating element. Positioned on the
 *   edge facing the reference and rotated to point at it.
 *
 * An options object in the expression sets the same switches from state: referenceEl,
 * strategy, offset, padding, flip, shift, cover, autoPlacement, fitX, fitY, matchSize,
 * autoUpdate, initialUpdate, rootBoundary. The expression is reactive, so a getter on
 * an option updates the float when its state changes.
 *
 * The $float magic: referenceEl (get/set), isPositioned, the resolved placement /
 * side / alignment, matchSizeEnabled (get/set), updatePosition(), enableAutoUpdate(),
 * disableAutoUpdate(), reset(), middleware (get/set, custom Floating UI middleware).
 *
 * @example
 *
 * <div x-data="{ open: false }">
 *   <button x-ref="reference"></button>
 *   <div x-show="open" x-float.bottom.offset.10px.flip.shift.update="open && $refs.reference">
 *     I'm floating!
 *   </div>
 * </div>
 */
export default function (Alpine: AlpineType): void;
export declare function handleFloatMagic(Alpine: AlpineType): ($el: HTMLElement) => FloatMagic;
declare function getOffsetModifier(modifiers: DirectiveData['modifiers']): number;
declare function getPlacementModifier(modifiers: DirectiveData['modifiers']): Placement | undefined;
export { getOffsetModifier, getPlacementModifier };
