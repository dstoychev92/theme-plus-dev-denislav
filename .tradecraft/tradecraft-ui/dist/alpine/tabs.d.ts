import { Alpine as AlpineType, AlpineComponent } from 'alpinejs';
export type TabsOptions = {
    selectedIndex?: number;
};
export type TabsComponent = AlpineComponent<{
    __tabs_isRoot: boolean;
    __tabs_rootEl: HTMLElement;
    __tabs_orientation: 'horizontal' | 'vertical';
    __tabs_getTabEls(): NodeListOf<HTMLElement>;
    __tabs_getTabListEl(): HTMLElement;
}>;
export type TabsComponentOptions = {
    initialIndex?: number;
    orientation?: 'horizontal' | 'vertical';
};
export type TabsMagic = {
    select(index: number): void;
    isSelected(index: number): boolean;
    get selectedIndex(): number | null;
    get tabCount(): number;
};
export type TabMagic = {
    select(): void;
    get isSelected(): boolean;
    get index(): number;
};
declare module 'alpinejs' {
    interface Magics<T> {
        /**
         * Various functions and properties for interacting with enclosing x-tabs:
         * select(index), isSelected(index), selectedIndex, tabCount
         */
        $tabs: TabsMagic;
        /**
         * Various functions and properties for interacting with the current tab button or panel
         */
        $tab: TabMagic;
    }
}
/**
 * Enables the creation and management of accessible tabs components, following ARIA practices.
 * The 'tabs' directive and '$tabs' magic property provide functionality for managing tabs
 * options, selection state, and keyboard interactions.
 *
 * See https://www.w3.org/WAI/ARIA/apg/patterns/tabs/ for more information about tabs
 *
 * Directives:
 * - x-tabs - The root element. A single-select disclosure group; the first tab is selected by default.
 *   Use the .vertical modifier for a vertical tab list (up/down arrow keys, aria-orientation="vertical")
 * - x-tabs:tablist - Wraps the tab buttons. role="tablist" with a roving tab order; home/end and
 *   page-up/page-down jump to the first and last tab
 * - x-tabs:tab - A tab button. role="tab", aria-selected, aria-controls. Selects on click and on
 *   keyboard focus (not on touch devices). Accepts an explicit index expression, e.g. x-tabs:tab="2"
 * - x-tabs:tabpanel - A tab panel. role="tabpanel", backed by x-disclosure. Accepts an explicit
 *   index expression matching its tab
 *
 * The '$tabs' magic property provides an API for managing the tabs state, including methods
 * like 'select', and properties like 'isSelected'. The '$tab' magic works inside a tab or
 * panel: 'select()', 'isSelected', 'index'
 *
 * @example
 *
 * <div x-tabs>
 *   <ul x-tabs:tablist>
 *     <li :class="$tabs.isSelected(0) ? 'bg-primary' : 'bg-transparent'">
 *       <button type="button" x-tabs:tab>Tab 1</button>
 *     </li>
 *     <li :class="$tabs.isSelected(1) ? 'bg-primary' : 'bg-transparent'">
 *       <button type="button" x-tabs:tab>Tab 2</button>
 *     </li>
 *     <li :class="$tabs.isSelected(2) ? 'bg-primary' : 'bg-transparent'">
 *       <button type="button" x-tabs:tab>Tab 3</button>
 *     </li>
 *   </ul>
 *   <div x-tabs:tabpanel>Panel 1</div>
 *   <div x-tabs:tabpanel x-cloak>Panel 2</div>
 *   <div x-tabs:tabpanel x-cloak>Panel 3</div>
 * </div>
 *
 * @example With explicit indices (for when DOM order may not match tab order, e.g. section reloads)
 *
 * <div x-tabs>
 *   <ul x-tabs:tablist>
 *     <li><button type="button" x-tabs:tab="0">Tab 1</button></li>
 *     <li><button type="button" x-tabs:tab="1">Tab 2</button></li>
 *   </ul>
 *   <div x-tabs:tabpanel="0">Panel 1</div>
 *   <div x-tabs:tabpanel="1" x-cloak>Panel 2</div>
 * </div>
 */
declare const _default: (Alpine: AlpineType) => void;
export default _default;
