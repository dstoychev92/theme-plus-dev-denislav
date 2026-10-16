import { closestSectionEl, isHtmlElement } from '../utils';
import { ThemeEditorEvent } from '../types';
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
export default function (Alpine) {
    Alpine.magic('isSelectedSection', handleIsSelectedSectionMagic(Alpine));
    Alpine.magic('isSelectedBlock', handleIsSelectedBlockMagic(Alpine));
    Alpine.magic('isInSelectedBlockTree', handleIsInSelectedBlockTreeMagic(Alpine));
    Alpine.magic('containsSelectedBlock', handleContainsSelectedBlockMagic(Alpine));
    Alpine.magic('wasSelectedSection', handleWasSelectedSectionMagic(Alpine));
    Alpine.magic('wasInSelectedBlockTree', handleWasInSelectedBlockTreeMagic(Alpine));
    Alpine.magic('wasSelectedBlock', handleWasSelectedBlockMagic(Alpine));
    Alpine.magic('selectedSection', handleSelectedSectionMagic(Alpine));
    Alpine.magic('selectedBlock', handleSelectedBlockMagic(Alpine));
    Alpine.magic('prevSelectedSection', handlePrevSelectedSectionMagic(Alpine));
    Alpine.magic('prevSelectedBlock', handlePrevSelectedBlockMagic(Alpine));
    Alpine.store('themeEditor', themeEditorStore);
}
/**
 * Returns the  selected section in the theme editor
 */
function handleSelectedSectionMagic(Alpine) {
    return function (_$el) {
        var _a;
        if (!((_a = window.Shopify) === null || _a === void 0 ? void 0 : _a.designMode))
            return null;
        const selectedSection = Alpine.store('themeEditor').selectedSection;
        return selectedSection;
    };
}
/**
 * Returns the previously selected section in the theme editor
 */
function handlePrevSelectedSectionMagic(Alpine) {
    return function (_$el) {
        var _a;
        if (!((_a = window.Shopify) === null || _a === void 0 ? void 0 : _a.designMode))
            return null;
        const selectedSection = Alpine.store('themeEditor').prevSelectedSection;
        return selectedSection;
    };
}
/**
 * Returns the previously selected block in the theme editor
 */
function handlePrevSelectedBlockMagic(Alpine) {
    return function (_$el) {
        var _a;
        if (!((_a = window.Shopify) === null || _a === void 0 ? void 0 : _a.designMode))
            return null;
        const selectedBlock = Alpine.store('themeEditor').prevSelectedBlock;
        return selectedBlock;
    };
}
/**
 * Returns the selected block in the theme editor
 */
function handleSelectedBlockMagic(Alpine) {
    return function (_$el) {
        var _a;
        if (!((_a = window.Shopify) === null || _a === void 0 ? void 0 : _a.designMode))
            return null;
        const selectedBlock = Alpine.store('themeEditor').selectedBlock;
        return selectedBlock;
    };
}
/**
 * Returns whether the current element is the selected section in the theme editor or a descendant of it
 */
function handleIsSelectedSectionMagic(Alpine) {
    return function ($el) {
        var _a;
        if (!((_a = window.Shopify) === null || _a === void 0 ? void 0 : _a.designMode))
            return false;
        if (!isHtmlElement) {
            throw new Error(`Expected HTMLElement but got ${$el}`);
        }
        const el = closestSectionEl($el);
        const selectedSection = Alpine.store('themeEditor').selectedSection;
        if (!el)
            return false;
        if (!selectedSection)
            return false;
        return el.id == selectedSection.id;
    };
}
/**
 * Returns whether the current element is the previously selected section in the theme editor or a descendant of it
 */
function handleWasSelectedSectionMagic(Alpine) {
    return function ($el) {
        var _a;
        if (!((_a = window.Shopify) === null || _a === void 0 ? void 0 : _a.designMode))
            return false;
        if (!isHtmlElement) {
            throw new Error(`Expected HTMLElement but got ${$el}`);
        }
        const el = closestSectionEl($el);
        const prevSelectedSection = Alpine.store('themeEditor').prevSelectedSection;
        if (!el)
            return false;
        if (!prevSelectedSection)
            return false;
        return el.id == prevSelectedSection.id;
    };
}
/**
 * Returns whether the current element is the selected block in the theme editor
 */
function handleIsSelectedBlockMagic(Alpine) {
    return function ($el) {
        var _a;
        if (!isHtmlElement($el)) {
            throw new Error(`Expected HTMLElement but got ${$el}`);
        }
        if (!((_a = window.Shopify) === null || _a === void 0 ? void 0 : _a.designMode))
            return false;
        const el = $el.closest('[data-shopify-editor-block]');
        const selectedBlock = Alpine.store('themeEditor').selectedBlock;
        if (!el)
            return false;
        if (!selectedBlock)
            return false;
        return el === selectedBlock;
    };
}
/**
 * Returns whether the current element is the selected block, a descendant of it, or a parent of it
 */
function handleIsInSelectedBlockTreeMagic(Alpine) {
    return function ($el) {
        var _a;
        if (!isHtmlElement($el)) {
            throw new Error(`Expected HTMLElement but got ${$el}`);
        }
        if (!((_a = window.Shopify) === null || _a === void 0 ? void 0 : _a.designMode))
            return false;
        const el = $el.closest('[data-shopify-editor-block]');
        const selectedBlock = Alpine.store('themeEditor').selectedBlock;
        if (!el)
            return false;
        if (!selectedBlock)
            return false;
        return el.contains(selectedBlock) || el === selectedBlock || selectedBlock.contains(el);
    };
}
/**
 * Returns whether the current element is or contains the selected block in the theme editor
 */
function handleContainsSelectedBlockMagic(Alpine) {
    return function ($el) {
        var _a;
        if (!isHtmlElement($el)) {
            throw new Error(`Expected HTMLElement but got ${$el}`);
        }
        if (!((_a = window.Shopify) === null || _a === void 0 ? void 0 : _a.designMode))
            return false;
        const el = $el.closest('[data-shopify-editor-block]');
        const selectedBlock = Alpine.store('themeEditor').selectedBlock;
        if (!el)
            return false;
        if (!selectedBlock)
            return false;
        return el.contains(selectedBlock) || el === selectedBlock;
    };
}
/**
 * Returns whether the current element is the selected block in the theme editor
 */
function handleWasSelectedBlockMagic(Alpine) {
    return function ($el) {
        var _a;
        if (!isHtmlElement($el)) {
            throw new Error(`Expected HTMLElement but got ${$el}`);
        }
        if (!((_a = window.Shopify) === null || _a === void 0 ? void 0 : _a.designMode))
            return false;
        const el = $el.closest('[data-shopify-editor-block]');
        const selectedBlock = Alpine.store('themeEditor').prevSelectedBlock;
        if (!el)
            return false;
        if (!selectedBlock)
            return false;
        return el == selectedBlock;
    };
}
/**
 * Returns whether the current element was the selected block, a descendant of it, or an ancestor of it
 */
function handleWasInSelectedBlockTreeMagic(Alpine) {
    return function ($el) {
        var _a;
        if (!isHtmlElement($el)) {
            throw new Error(`Expected HTMLElement but got ${$el}`);
        }
        if (!((_a = window.Shopify) === null || _a === void 0 ? void 0 : _a.designMode))
            return false;
        const el = $el.closest('[data-shopify-editor-block]');
        const selectedBlock = Alpine.store('themeEditor').prevSelectedBlock;
        if (!el)
            return false;
        if (!selectedBlock)
            return false;
        return el.contains(selectedBlock) || el === selectedBlock || selectedBlock.contains(el);
    };
}
const themeEditorStore = {
    isInspectorActive: false,
    selectedSectionId: null,
    prevSelectedSectionId: null,
    selectedBlock: null,
    prevSelectedBlock: null,
    get selectedSection() {
        if (!this.selectedSectionId)
            return null;
        return document.getElementById(`shopify-section-${this.selectedSectionId}`);
    },
    get prevSelectedSection() {
        if (!this.prevSelectedSectionId)
            return null;
        return document.getElementById(`shopify-section-${this.prevSelectedSectionId}`);
    },
    init() {
        window.addEventListener(ThemeEditorEvent.INSPECTOR_ACTIVATED, () => {
            var _a;
            if (!((_a = window.Shopify) === null || _a === void 0 ? void 0 : _a.designMode))
                return false;
            this.isInspectorActive = true;
        });
        window.addEventListener(ThemeEditorEvent.INSPECTOR_DEACTIVATED, () => {
            var _a;
            if (!((_a = window.Shopify) === null || _a === void 0 ? void 0 : _a.designMode))
                return false;
            this.isInspectorActive = false;
        });
        window.addEventListener(ThemeEditorEvent.SECTION_SELECT, (e) => {
            var _a;
            if (!((_a = window.Shopify) === null || _a === void 0 ? void 0 : _a.designMode))
                return false;
            const sectionSelectEvent = e;
            if (this.selectedSectionId !== null) {
                this.prevSelectedSectionId = this.selectedSectionId;
            }
            this.selectedSectionId = sectionSelectEvent.detail.sectionId;
        });
        window.addEventListener(ThemeEditorEvent.SECTION_DESELECT, (e) => {
            var _a;
            if (!((_a = window.Shopify) === null || _a === void 0 ? void 0 : _a.designMode))
                return false;
            this.prevSelectedSectionId = this.selectedSectionId;
            this.selectedSectionId = null;
        });
        window.addEventListener(ThemeEditorEvent.BLOCK_SELECT, (e) => {
            var _a;
            if (!((_a = window.Shopify) === null || _a === void 0 ? void 0 : _a.designMode))
                return false;
            const blockSelectEvent = e;
            this.prevSelectedBlock = this.selectedBlock;
            this.selectedBlock = blockSelectEvent.target;
        });
        window.addEventListener(ThemeEditorEvent.BLOCK_DESELECT, (e) => {
            var _a;
            if (!((_a = window.Shopify) === null || _a === void 0 ? void 0 : _a.designMode))
                return false;
            this.prevSelectedBlock = this.selectedBlock;
            this.selectedBlock = null;
        });
        window.addEventListener(ThemeEditorEvent.SECTION_LOAD, (e) => {
            var _a;
            if (!((_a = window.Shopify) === null || _a === void 0 ? void 0 : _a.designMode))
                return false;
            // NOOP for now
        });
        window.addEventListener(ThemeEditorEvent.SECTION_UNLOAD, (e) => {
            var _a;
            if (!((_a = window.Shopify) === null || _a === void 0 ? void 0 : _a.designMode))
                return false;
            // NOOP for now
        });
    },
};
