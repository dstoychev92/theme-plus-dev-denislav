import { Alpine as AlpineType, AlpineComponent } from 'alpinejs';
declare module 'alpinejs' {
    interface Magics<T> {
        $disclosure: DisclosureMagic;
        $disclosureGroup: DisclosureGroupMagic;
    }
}
export type DisclosureState = {
    isExpanded: boolean;
    get isCollapsed(): boolean;
    toggle(options?: {
        dispatch?: boolean;
    }): void;
    expand(options?: {
        dispatch?: boolean;
    }): void;
    collapse(focusAfter?: HTMLElement | null, options?: {
        dispatch?: boolean;
    }): void;
};
export type DisclosureSingleSelectGroupState = {
    expandedIndex: number | null;
    items: Set<HTMLElement>;
    indexOf: (el: HTMLElement) => number;
    isExpanded: (index: number) => boolean;
    toggle: (index: number) => void;
    expand: (index: number) => void;
    collapse: (index: number) => void;
    register: (el: HTMLElement) => void;
    unregister: (el: HTMLElement) => void;
};
export type DisclosureMultiSelectGroupState = {
    expandedIndices: Set<number>;
    items: Set<HTMLElement>;
    indexOf: (el: HTMLElement) => number;
    isExpanded: (index: number) => boolean;
    toggle: (index: number) => void;
    expand: (index: number) => void;
    collapse: (index: number) => void;
    register: (el: HTMLElement) => void;
    unregister: (el: HTMLElement) => void;
};
export type DisclosureComponent = AlpineComponent<{
    __disclosure_isRoot: boolean;
    __disclosure_state: DisclosureState;
    __disclosure_animated: boolean;
    __disclosure_contentEl: HTMLElement | null;
    __disclosure_buttonEl: HTMLElement | null;
    __disclosure_waitForAnimations(): Promise<Animation[]>;
    get __disclosure_isInGroup(): boolean;
    get __disclosure_groupIndex(): number | null;
    __disclosure_groupDepth: number | null;
}>;
export type DisclosureGroupComponent = AlpineComponent<{
    __disclosure_group_state: DisclosureSingleSelectGroupState | DisclosureMultiSelectGroupState;
}>;
export type DisclosureOptions = {
    isExpanded?: boolean;
};
export type DisclosureSingleSelectGroupOptions = {
    expandedIndex?: number;
    initiallyExpandedIndex?: number;
    /** When provided, indexOf uses this for elements with an explicit index before falling back to registration order */
    getIndex?: (el: HTMLElement) => number | null | undefined;
};
export type DisclosureMultiSelectGroupOptions = {
    expandedIndices?: Set<number>;
    initiallyExpandedIndices?: Set<number>;
};
export type DisclosureGroupOptions = (DisclosureSingleSelectGroupOptions | DisclosureMultiSelectGroupOptions) & {
    multiple?: boolean;
};
export type DisclosureMagic = DisclosureState & {
    groupIndex: number | null;
    isInGroup: boolean;
    waitForAnimations: DisclosureComponent['__disclosure_waitForAnimations'];
};
export type DisclosureGroupMagic = DisclosureSingleSelectGroupState | DisclosureMultiSelectGroupState;
/**
 * Enables the creation of disclosure components, commonly known as accordions or collapsible sections.
 * A disclosure component typically consists of a button that controls the visibility of an
 * associated content area.
 *
 * Note: requires tradecraft-ui 'animations' plugin
 *
 * See https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/ for more information about disclosures
 *
 * Usage:
 * - x-disclosure - Applied to the root element of a disclosure component. It can optionally accept an expression that
 *   2-way binds to the internal isExpanded state of the disclosure e.g. `x-disclosure="isExpanded"`. If no expression is provided, the disclosure is closed by default;
 *   use the .expand modifier to start expanded.
 *   If your disclosure is _not_ animated, use the .noanimate modifier to prevent the disclosure from waiting for animations to complete before transitioning to expanded and vice versa.
 * - x-disclosure:button - Marks an element as the button that toggles the visibility of the
 *   disclosure content. This element is typically a button or a similar interactive element.
 * - `data-skip-animation-wait` - Add this attribute to elements when you don't want to wait for their animations to complete before state transitions.
 *
 * @example
 *
 * <div x-disclosure>
 *   <button x-disclosure:button>Open SESAME</button>
 *   <div x-disclosure:panel>
 *     <p>Hello world</p>
 *   </div>
 * </div>
 *
 * @example Initially expanded
 *
 * <div x-disclosure="true">
 *   <button x-disclosure:button>Open SESAME</button>
 *   <div x-disclosure:panel>
 *     <p>Hello world</p>
 *   </div>
 * </div>
 *
 * or
 *
 * <div x-disclosure="{ isExpanded: true }">
 *   <button x-disclosure:button>Open SESAME</button>
 *   <div x-disclosure:panel>
 *     <p>Hello world</p>
 *   </div>
 * </div>
 *
 * @example Bound to external state
 *
 * <div x-data="{isExpandedExternal: true}">
 *   <div x-show="isExpandedExternal">Im open!</div>
 *
 *   <div x-disclosure="{
 *     get isExpanded() {
 *       return this.isExpandedExternal
 *     },
 *     set isExpanded(value) {
 *       this.isExpandedExternal = value
 *     }
 *   }">
 *     <button x-disclosure:button>Open SESAME</button>
 *     <div x-disclosure:panel>
 *       <p>Hello world</p>
 *     </div>
 *   </div>
 * </div>
 *
 * The '$disclosure' magic property provides an API for managing the state of the disclosure
 * component, including checking its open/closed status and programmatically toggling its state.
 *
 * ## Disclosure Groups
 *
 * Disclosure groups are a collection of disclosures that are managed as a single accordion.
 * This is useful for creating multi-step forms or other UI elements that require the disclosure
 * of multiple sections. A group is single-select by default; use the .multiple modifier
 * (or `multiple: true` in the options) to let several disclosures stay open at once.
 *
 * @example
 *
 * <div x-disclosure-group>
 *   <div x-disclosure
 *     <button x-disclosure:button>Open SESAME 1</button>
 *     <div x-disclosure:panel>
 *       <p>Hello world 1</p>
 *     </div>
 *   </div>
 *  <div x-disclosure>
 *     <button x-disclosure:button>Open SESAME 2</button>
 *     <div x-disclosure:panel>
 *       <p>Hello world 2</p>
 *     </div>
 *   </div>
 * </div>
 *
 * The '$disclosureGroup' magic property provides an API for managing the state of the disclosure group,
 * including checking the expanded index and programmatically toggling the state of the disclosures.
 *
 */
export default function (Alpine: AlpineType): void;
export declare function handleDisclosureMagic(Alpine: AlpineType): ($el: HTMLElement) => DisclosureMagic;
export declare function handleDisclosureGroupMagic(Alpine: AlpineType): ($el: HTMLElement) => DisclosureGroupMagic;
