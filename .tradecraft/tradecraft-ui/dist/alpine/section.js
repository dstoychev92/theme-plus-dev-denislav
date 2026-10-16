import { closestSectionEl } from '../utils';
/**
 * Magics for the closest ancestor shopify-section element: `$sectionEl` (the
 * element), `$sectionId` (its id without the 'shopify-section-' prefix), and
 * `$sectionData` (get/set data in a global store keyed by section id, so state
 * survives section content updates in the theme editor).
 */
export default function (Alpine) {
    Alpine.store('sectionData', {});
    /**
     * Get and set data for the closest ancestor section in a global Alpien store keyed by section id
     * This is most useful for the theme editor when you want to maintain state between section content updates
     */
    Alpine.magic('sectionData', ($el) => {
        var _a;
        const sectionId = (_a = closestSectionEl($el)) === null || _a === void 0 ? void 0 : _a.id;
        if (!sectionId)
            return {};
        return new Proxy({}, {
            get(_target, prop) {
                if (!sectionId)
                    return null;
                if (!(sectionId in Alpine.store('sectionData')))
                    return null;
                return Alpine.store('sectionData')[sectionId][prop];
            },
            set(_target, prop, value) {
                if (!sectionId)
                    return false;
                if (!(sectionId in Alpine.store('sectionData'))) {
                    Alpine.store('sectionData')[sectionId] = {};
                }
                Alpine.store('sectionData')[sectionId][prop] = value;
                return true;
            },
        });
    });
    Alpine.magic('sectionEl', ($el) => {
        return closestSectionEl($el);
    });
    Alpine.magic('sectionId', ($el) => {
        var _a;
        const rawId = (_a = closestSectionEl($el)) === null || _a === void 0 ? void 0 : _a.id;
        if (!rawId)
            return null;
        if (rawId.startsWith('shopify-section-')) {
            return rawId.split('shopify-section-')[1];
        }
        else {
            return rawId;
        }
    });
}
