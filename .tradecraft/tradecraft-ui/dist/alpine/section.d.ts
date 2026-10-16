import { Alpine as AlpineType } from 'alpinejs';
declare module 'alpinejs' {
    interface Stores {
        sectionData: Record<string, any>;
    }
    interface Magics<T> {
        /**
         * The closest ancestor shopify section element (or current element if it is a section)
         */
        $sectionEl: HTMLElement | undefined;
        /**
         * The id of the closest ancestor shopify section elements (or current element if it is a section)
         */
        $sectionId: string | undefined;
        /**
         * Data stored for this section
         */
        $sectionData: Record<string, any>;
    }
}
/**
 * Magics for the closest ancestor shopify-section element: `$sectionEl` (the
 * element), `$sectionId` (its id without the 'shopify-section-' prefix), and
 * `$sectionData` (get/set data in a global store keyed by section id, so state
 * survives section content updates in the theme editor).
 */
export default function (Alpine: AlpineType): void;
