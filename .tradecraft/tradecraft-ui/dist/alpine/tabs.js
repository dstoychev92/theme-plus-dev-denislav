import { copyProperty } from '../utils';
import { warnMissingParentDirective } from '../utils/error';
const selectors = {
    tablist: '[role="tablist"]',
    tab: '[role="tab"]',
    tabpanel: '[role="tabpanel"]',
};
function parseExplicitIndex(expression, evaluate) {
    if (expression == null || expression === '')
        return undefined;
    const v = evaluate(expression);
    const n = Number(v);
    return Number.isInteger(n) ? n : undefined;
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
export default (Alpine) => {
    Alpine.directive('tabs', ($el, data, utilities) => {
        if (data.value == 'tab') {
            handleTab($el, Alpine, data, utilities);
        }
        else if (data.value == 'tablist') {
            handleTabList($el, Alpine, data, utilities);
        }
        else if (data.value == 'tabpanel') {
            handleTabPanel($el, Alpine, data, utilities);
        }
        else if (data.value == null) {
            handleRoot($el, Alpine, data, utilities);
        }
        else {
            throw new Error(`Unknown directive: x-tabs:${data.value}`);
        }
    }).before('bind');
    Alpine.magic('tabs', handleTabsMagic(Alpine));
    Alpine.magic('tab', handleTabMagic(Alpine));
};
function handleTabsMagic(Alpine) {
    return function ($el) {
        const $data = Alpine.$data($el);
        return {
            select(index) {
                var _a;
                (_a = $data.__disclosure_group_state) === null || _a === void 0 ? void 0 : _a.expand(index);
            },
            isSelected(index) {
                var _a;
                return (_a = $data.__disclosure_group_state) === null || _a === void 0 ? void 0 : _a.isExpanded(index);
            },
            get selectedIndex() {
                var _a;
                if (!$data.__disclosure_group_state)
                    return null;
                return (_a = $data.__disclosure_group_state) === null || _a === void 0 ? void 0 : _a.expandedIndex;
            },
            get tabCount() {
                var _a;
                return Array.from((_a = $data.__disclosure_group_state) === null || _a === void 0 ? void 0 : _a.items).length || 0;
            },
        };
    };
}
// This works for both tabs and tab panels
function handleTabMagic(Alpine) {
    return function ($el) {
        const $data = Alpine.$data($el);
        return {
            select() {
                $data.__tab_select();
            },
            get isSelected() {
                return $data.__tab_isSelected;
            },
            get index() {
                return $data.__tab_index;
            },
        };
    };
}
function handleTab($el, Alpine, { expression }, { evaluate }) {
    const explicitIndex = parseExplicitIndex(expression, evaluate);
    Alpine.bind($el, {
        'x-data'() {
            return {
                init() {
                    if (!this.__tabs_isRoot) {
                        warnMissingParentDirective('x-tabs:tab', 'x-tabs', this.$el);
                    }
                },
                get __tab_isSelected() {
                    if (!this.__tabs_isRoot)
                        return false;
                    return this.$disclosureGroup.isExpanded(this.__tab_index);
                },
                __tab_select() {
                    if (!this.__tabs_isRoot)
                        return;
                    this.$disclosureGroup.expand(this.__tab_index);
                },
                get __tab_index() {
                    if (explicitIndex !== undefined)
                        return explicitIndex;
                    if (!this.__tabs_isRoot)
                        return -1;
                    return Array.from(this.__tabs_getTabEls()).indexOf($el);
                },
                get __tab_ariaControls() {
                    var _a;
                    if (!this.__tabs_isRoot)
                        return undefined;
                    const group = this.$disclosureGroup;
                    const panel = Array.from(group.items).find((el) => group.indexOf(el) === this.__tab_index);
                    return (_a = panel === null || panel === void 0 ? void 0 : panel.id) !== null && _a !== void 0 ? _a : undefined;
                },
            };
        },
        'x-id': "['tab']",
        ':id': `$id('tab')`,
        ':role': "'tab'",
        '@click': `$tab.select()`,
        '@mousedown.prevent': '',
        '@focus': `if (!window.matchMedia('(pointer: coarse)').matches) $tab.select()`, // Disable automatic select on touch devices
        ':tabindex': `$tab.isSelected ? 0 : -1`,
        ':data-tab-index': '__tab_index',
        ':aria-selected': '__tab_isSelected',
        ':aria-controls': '__tab_ariaControls',
    });
}
function handleTabList($el, Alpine, {}, {}) {
    Alpine.bind($el, {
        'x-init'() {
            if (!this.__tabs_isRoot) {
                warnMissingParentDirective('x-tabs:tablist', 'x-tabs', this.$el);
            }
        },
        'x-roving-tab:list': ``,
        ':role': "'tablist'",
        ':aria-orientation'() {
            return this.__tabs_orientation;
        },
        '@keydown.home.prevent.stop': '$focus.first()',
        '@keydown.page-up.prevent.stop': '$focus.first()',
        '@keydown.end.prevent.stop': '$focus.last()',
        '@keydown.page-down.prevent.stop': '$focus.last()',
    });
}
function handleTabPanel($el, Alpine, { modifiers, expression }, { evaluate }) {
    const disclosureModifiers = modifiers.filter((modifier) => ['debug', 'open', 'static'].includes(modifier));
    const explicitIndex = parseExplicitIndex(expression, evaluate);
    if (explicitIndex !== undefined) {
        $el.setAttribute('data-tab-index', String(explicitIndex));
    }
    Alpine.bind($el, Object.assign(Object.assign({ 'x-data'() {
            return {
                init() {
                    if (!this.__tabs_isRoot) {
                        warnMissingParentDirective('x-tabs:tabpanel', 'x-tabs', this.$el);
                    }
                },
                get __tab_isSelected() {
                    return this.$disclosure.isExpanded;
                },
                __tab_select() {
                    this.$disclosure.expand();
                },
                get __tab_index() {
                    return this.$disclosure.groupIndex;
                },
                get __tab_ariaLabelledby() {
                    var _a;
                    let el = this.$el.parentElement;
                    while (el) {
                        const data = Alpine.$data(el);
                        if (typeof (data === null || data === void 0 ? void 0 : data.__tabs_getTabListEl) === 'function') {
                            const tabs = Array.from(((_a = data.__tabs_getTabListEl()) === null || _a === void 0 ? void 0 : _a.querySelectorAll(selectors.tab)) || []);
                            const panelIdx = this.$disclosureGroup.indexOf(this.$el);
                            const tab = tabs.find((tabEl, domIdx) => {
                                const e = tabEl.getAttribute('data-tab-index');
                                return (e !== null ? parseInt(e, 10) : domIdx) === panelIdx;
                            });
                            return tab === null || tab === void 0 ? void 0 : tab.id;
                        }
                        el = el.parentElement;
                    }
                    return undefined;
                },
            };
        }, 'x-id': "['tab-panel']", ':id': `$id('tab-panel')`, role: 'tabpanel' }, (disclosureModifiers.length
        ? {
            [`x-disclosure.noanimate.${disclosureModifiers.join('.')}`]: '',
        }
        : {
            'x-disclosure.noanimate': '',
        })), { 'x-disclosure:panel': '', ':aria-labelledby': '__tab_ariaLabelledby', ':tabindex': `$disclosure.isExpanded ? 0 : -1` }));
}
function handleRoot($el, Alpine, { modifiers, expression }, { evaluate }) {
    const orientation = modifiers.includes('vertical') ? 'vertical' : 'horizontal';
    let options = evaluate(expression === '' ? '{}' : expression);
    Alpine.bind($el, Object.assign({ ['x-data']() {
            return {
                __tabs_isRoot: true,
                __tabs_rootEl: $el,
                __tabs_orientation: orientation || 'horizontal',
                __tabs_getTabListEl() {
                    return $el.querySelector(selectors.tablist);
                },
                __tabs_getTabEls() {
                    var _a;
                    return ((_a = this.__tabs_getTabListEl()) === null || _a === void 0 ? void 0 : _a.querySelectorAll(selectors.tab)) || [];
                },
            };
        }, ':data-selected-index': '__disclosure_group_state.expandedIndex', 'x-disclosure-group'() {
            let disclosureGroupOptions = {};
            // Rename selectedIndex property to expandedIndex which is what the disclosure group expects
            if ('selectedIndex' in options) {
                copyProperty(options, disclosureGroupOptions, 'selectedIndex', 'expandedIndex');
            }
            else {
                disclosureGroupOptions.initiallyExpandedIndex = 0;
            }
            // Support explicit tab indices via data-tab-index (set by x-tabs:tabpanel="n")
            disclosureGroupOptions.getIndex = (el) => {
                const idx = el.getAttribute('data-tab-index');
                return idx !== null ? parseInt(idx, 10) : undefined;
            };
            return disclosureGroupOptions;
        } }, (orientation == 'vertical'
        ? {
            'x-roving-tab.vertical': '__tabs_getTabEls',
        }
        : {
            'x-roving-tab': '__tabs_getTabEls',
        })));
    return {};
}
