
/*
* @license
* PIPELINE Theme (c) Groupthought Themes
*
* This file is included for advanced development by
* Shopify Agencies. Modified versions of the theme
* code are not supported by Shopify or Groupthought.
*
* Add any minor JS changes in assets/custom.js, this
* will make it easier to update the theme in the future.
*
*/
                  
import Alpine from 'alpinejs';

(function() {
    const env = {"NODE_ENV":"production"};
    try {
        if (process) {
            process.env = Object.assign({}, process.env);
            Object.assign(process.env, env);
            return;
        }
    } catch (e) {} // avoid ReferenceError: process is not defined
    globalThis.process = { env:env };
})();

function isHtmlElement(node) {
    return node != undefined && node != null && typeof node.tagName === 'string' && node.nodeType === Node.ELEMENT_NODE;
}

/**
 * Returns the containing section element of the current element, or the current element if it is a section
 */
function closestSectionEl($el) {
    if (!isHtmlElement($el)) {
        throw new Error(`Expected HTMLElement but got ${$el}`);
    }
    if ($el.classList.contains('shopify-section')) {
        return $el;
    }
    return $el.closest('.shopify-section');
}

var ThemeEditorEvent;
(function (ThemeEditorEvent) {
    ThemeEditorEvent["INSPECTOR_ACTIVATED"] = "shopify:inspector:activate";
    ThemeEditorEvent["INSPECTOR_DEACTIVATED"] = "shopify:inspector:deactivate";
    ThemeEditorEvent["SECTION_LOAD"] = "shopify:section:load";
    ThemeEditorEvent["SECTION_UNLOAD"] = "shopify:section:unload";
    ThemeEditorEvent["SECTION_SELECT"] = "shopify:section:select";
    ThemeEditorEvent["SECTION_DESELECT"] = "shopify:section:deselect";
    ThemeEditorEvent["SECTION_REORDER"] = "shopify:section:reorder";
    ThemeEditorEvent["BLOCK_SELECT"] = "shopify:block:select";
    ThemeEditorEvent["BLOCK_DESELECT"] = "shopify:block:deselect";
})(ThemeEditorEvent || (ThemeEditorEvent = {}));

/**
 * Plugin to make it easy to integrate with the theme editor
 *
 * TODO: more docs!
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
function themeEditor (Alpine) {
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

/**
 * Calculate grid row and column sizes dynamically for any CSS grid in order to build a grid inspector
 */
function gridInspector (Alpine) {
    Alpine.directive('grid-inspector', ($el, { value, modifiers }) => {
        if (value === 'source') {
            Alpine.bind($el, {
                'x-data'() {
                    return {
                        init() {
                            this.$data.sourceGridEl = $el;
                        },
                    };
                },
            });
        }
        else if (value === null) {
            Alpine.bind($el, {
                ['x-data']() {
                    return {
                        isObserving: false,
                        sourceGridEl: null,
                        resizeObserver: null,
                        mutationObserver: null,
                        debugGridBounds: {
                            top: 0,
                            left: 0,
                            height: 0,
                            width: 0,
                        },
                        debugGridRows: [],
                        debugGridCols: [],
                        destroy() {
                            this.unobserveSourceGrid();
                            this.clearGridLines();
                        },
                        clearGridLines() {
                            this.debugGridRows = [];
                            this.debugGridCols = [];
                        },
                        calculateGridBounds() {
                            if (!this.sourceGridEl)
                                return;
                            const boundingClientRect = this.sourceGridEl.getBoundingClientRect();
                            this.debugGridBounds = {
                                top: boundingClientRect.top,
                                left: boundingClientRect.left,
                                height: boundingClientRect.height,
                                width: boundingClientRect.width,
                            };
                        },
                        calculateGridLines() {
                            if (!this.sourceGridEl)
                                return;
                            const computedStyle = getComputedStyle(this.sourceGridEl);
                            const rows = computedStyle.gridTemplateRows.split(' ');
                            const cols = computedStyle.gridTemplateColumns.split(' ');
                            this.debugGridRows = rows;
                            this.debugGridCols = cols;
                        },
                        calculateDebounced: Alpine.debounce(function () {
                            this.calculateGridBounds();
                            this.calculateGridLines();
                        }, 100),
                        observeSourceGrid() {
                            if (this.isObserving)
                                return;
                            if (!this.sourceGridEl)
                                return;
                            this.isObserving = true;
                            this.calculateDebounced();
                            this.resizeObserver = new ResizeObserver(() => {
                                window.requestAnimationFrame(() => {
                                    window.requestAnimationFrame(() => {
                                        this.calculateDebounced();
                                    });
                                });
                            });
                            this.resizeObserver.observe(this.sourceGridEl);
                            // Observe existing children
                            for (const child of this.sourceGridEl.children) {
                                this.resizeObserver.observe(child);
                            }
                            this.mutationObserver = new MutationObserver((mutations) => {
                                var _a;
                                // Re-observe new children when they're added
                                for (const mutation of mutations) {
                                    if (mutation.type === 'childList') {
                                        for (const addedNode of mutation.addedNodes) {
                                            if (addedNode.nodeType === Node.ELEMENT_NODE) {
                                                (_a = this.resizeObserver) === null || _a === void 0 ? void 0 : _a.observe(addedNode);
                                            }
                                        }
                                    }
                                }
                                window.requestAnimationFrame(() => {
                                    this.calculateDebounced();
                                });
                            });
                            this.mutationObserver.observe(this.sourceGridEl, {
                                childList: true,
                                subtree: true,
                            });
                        },
                        unobserveSourceGrid() {
                            var _a, _b;
                            if (!this.sourceGridEl)
                                return;
                            (_a = this.resizeObserver) === null || _a === void 0 ? void 0 : _a.disconnect();
                            this.resizeObserver = null;
                            (_b = this.mutationObserver) === null || _b === void 0 ? void 0 : _b.disconnect();
                            this.mutationObserver = null;
                            this.isObserving = false;
                        },
                    };
                },
            });
        }
        else {
            throw new Error(`Unknown directive: x-grid-inspector:${value}`);
        }
    }).before('bind');
}

document.addEventListener('alpine:init', () => {
    Alpine.plugin(themeEditor);
    Alpine.plugin(gridInspector);
});
