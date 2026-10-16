import { Alpine as AlpineType } from 'alpinejs';
export interface ThemeEditorStore {
    isInspectorActive: boolean;
    selectedSectionId: string | null;
    prevSelectedSectionId: string | null;
    selectedBlock: HTMLElement | null;
    prevSelectedBlock: HTMLElement | null;
    get selectedSection(): HTMLElement | null;
    get prevSelectedSection(): HTMLElement | null;
    init(): void;
}
declare module 'alpinejs' {
    interface Stores {
        themeEditor: ThemeEditorStore;
    }
    interface Magics<T> {
        /**
         * Whether the section containing this element is selected in the theme editor
         */
        $isSelectedSection: boolean;
        /**
         * Whether the block containing this element is selected in the theme editor
         */
        $isSelectedBlock: boolean;
        /**
         * Whether the block containing this element contains or is contained within the selected in the theme editor
         */
        $isInSelectedBlockTree: boolean;
        /**
         * Whether the block containing this element contains the selected block in the theme editor
         */
        $containsSelectedBlock: boolean;
        /**
         * Whether the section containing this element was selected in the theme editor previously but is no longer
         */
        $wasSelectedSection: boolean;
        /**
         * Whether the block containing this element was selected in the theme editor previously but is no longer
         */
        $wasSelectedBlock: boolean;
        /**
         * The root element of the selected section in the theme editor
         */
        $selectedSection: HTMLElement | null;
        /**
         * The root element of the selected block in the theme editor
         */
        $selectedBlock: HTMLElement | null;
    }
}
/**
 * Plugin to make it easy to integrate with the theme editor
 *
 * Tracks which section and block are selected in the theme editor and exposes them as
 * magics. Every magic returns false or null outside the theme editor
 * (window.Shopify.designMode), so markup that binds to them is inert on the storefront.
 *
 * @example
 *
 * <div>
 *   <div
 *     x-disclosure
 *     {% if request.design_mode %}
 *       @shopify:section:select.window="
 *         if($isSelectedSection) {
 *           $disclosure.expand()
 *         }
 *       "
 *       @shopify:section:deselect.window="
 *         if($wasSelectedSection) {
 *           $disclosure.collapse()
 *         }
 *       "
 *     {% endif %}
 *   >
 *     <button x-disclosure:button>Toggle</button>
 *     <div x-disclosure:panel>My content</div>
 *   </div>
 * </div>
 */
export default function (Alpine: AlpineType): void;
