import { AlpineComponent, Alpine as AlpineType } from 'alpinejs';
export type PopoverMagic = {
    open(): void;
    close(): void;
    get isOpen(): boolean;
    set isOpen(value: boolean);
};
export type PopoverRootComponent = AlpineComponent<{
    __popover_isRoot: boolean;
    __popover_popoverEl: HTMLElement | null;
}>;
export type PopoverPanelComponent = AlpineComponent<{
    __popover_showPopover(): void;
    __popover_hidePopover(): Promise<void>;
}>;
/**
 * A popup whose panel renders in the browser's top layer while open (the native Popover
 * API), so it escapes every clipped ancestor and stacking context. Builds on x-popup for
 * the open state and float positioning, and traps focus in the panel while it is open.
 *
 * Directives:
 * - x-popover - The root element. Passes its modifiers and expression to x-popup.
 * - x-popover:button - The button that toggles the panel.
 * - x-popover:panel - The floating panel. Modifiers are x-float positioning modifiers
 *   (default: absolute.bottom.offset.5px.flip.update.shift.fit-x.pad.5px) and pass to
 *   x-popup:popup, so .nofloat also works here. The .notrap modifier disables the focus
 *   trap. The expression holds float options.
 * - x-popover:arrow - The arrow element. Put it inside the panel.
 *
 * The $popover magic: isOpen (get/set), open(), close().
 *
 * @example
 *
 * <div x-popover>
 *   <button x-popover:button>Toggle</button>
 *   <div x-popover:panel.bottom.offset.16px x-cloak>
 *     <div x-popover:arrow></div>
 *     <span>lorem ipsum</span>
 *   </div>
 * </div>
 */
export default function (Alpine: AlpineType): void;
export declare function handlePopoverMagic(Alpine: AlpineType): ($el: HTMLElement) => PopoverMagic;
