import { copyProperty, isPlainObject } from '../utils';
import { warnMissingParentDirective } from '../utils/error';
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
export default function (Alpine) {
    Alpine.directive('disclosure', ($el, data, utilities) => {
        if (data.value === 'panel') {
            handlePanel($el, Alpine);
        }
        else if (data.value === 'button') {
            handleButton($el, Alpine);
        }
        else if (data.value === null) {
            handleRoot($el, Alpine, data, utilities);
        }
        else {
            throw new Error(`Unknown directive: x-disclosure:${data.value}`);
        }
    }).before('bind');
    Alpine.directive('disclosure-group', ($el, data, utilities) => {
        if (data.value === null) {
            handleDisclosureGroup($el, Alpine, data, utilities);
        }
        else {
            throw new Error(`Unknown directive: x-disclosure-group:${data.value}`);
        }
    }).before('bind');
    Alpine.magic('disclosure', handleDisclosureMagic(Alpine));
    Alpine.magic('disclosureGroup', handleDisclosureGroupMagic(Alpine));
}
export function handleDisclosureMagic(Alpine) {
    return function ($el) {
        const $data = Alpine.$data($el);
        return {
            get isExpanded() {
                var _a;
                return (_a = $data.__disclosure_state) === null || _a === void 0 ? void 0 : _a.isExpanded;
            },
            set isExpanded(value) {
                if (!$data.__disclosure_state)
                    return;
                $data.__disclosure_state.isExpanded = value;
            },
            get isCollapsed() {
                var _a;
                return (_a = $data.__disclosure_state) === null || _a === void 0 ? void 0 : _a.isCollapsed;
            },
            get isInGroup() {
                return $data.__disclosure_isInGroup;
            },
            get groupIndex() {
                return $data.__disclosure_groupIndex;
            },
            toggle() {
                var _a;
                (_a = $data.__disclosure_state) === null || _a === void 0 ? void 0 : _a.toggle();
            },
            expand() {
                var _a;
                (_a = $data.__disclosure_state) === null || _a === void 0 ? void 0 : _a.expand();
            },
            collapse() {
                var _a;
                (_a = $data.__disclosure_state) === null || _a === void 0 ? void 0 : _a.collapse();
            },
            waitForAnimations() {
                return $data.__disclosure_waitForAnimations();
            },
        };
    };
}
export function handleDisclosureGroupMagic(Alpine) {
    return function ($el) {
        const $data = Alpine.$data($el);
        return $data.__disclosure_group_state || {};
    };
}
function handlePanel($el, Alpine) {
    if (!$el._x_doShow) {
        $el._x_doShow = () => { };
    }
    if (!$el._x_doHide) {
        $el._x_doHide = () => { };
    }
    Alpine.bind($el, {
        ':id': `$el.id || $id('disclosure-panel')`,
        role: 'group',
        'x-show': '$disclosure.isExpanded',
        'x-init'() {
            if (!this.__disclosure_isRoot) {
                warnMissingParentDirective('x-disclosure:panel', 'x-disclosure', this.$el);
                return;
            }
            this.__disclosure_contentEl = this.$el;
            // TODO investigate hooking into Alpine's el._x_doShow / el._x_doHide hooks instead of this
            const addHidden = () => {
                Alpine.mutateDom(() => {
                    // TODO add support for `hidden="until-found"`
                    this.$el.setAttribute('hidden', '');
                    this.$el.style.setProperty('display', 'none');
                });
            };
            const removeHidden = () => {
                Alpine.mutateDom(() => {
                    this.$el.removeAttribute('hidden');
                    this.$el.style.removeProperty('display');
                });
            };
            // Set initial hidden state
            if (this.__disclosure_state.isExpanded) {
                removeHidden();
            }
            else {
                addHidden();
            }
            this.$watch('__disclosure_state.isExpanded', async (isExpanded) => {
                if (isExpanded) {
                    removeHidden();
                }
                else {
                    if (this.__disclosure_animated) {
                        await this.__disclosure_waitForAnimations();
                        // If the disclosure re-expanded before the animation completed, don't hide it
                        if (this.__disclosure_state.isExpanded)
                            return;
                        addHidden();
                    }
                    else {
                        addHidden();
                    }
                }
            });
        },
        ':aria-labelledby'() {
            var _a;
            return (_a = this.__disclosure_buttonEl) === null || _a === void 0 ? void 0 : _a.id;
        },
        'data-morph-update': 'children',
    });
}
function handleButton($el, Alpine) {
    Alpine.bind($el, {
        // Don't add role="button" to native <button> — only set it for non-button elements like div, a, etc
        ':role'() {
            return this.$el.tagName === 'BUTTON' ? undefined : 'button';
        },
        ':id': `$el.id || $id('disclosure-button')`,
        'x-init'() {
            if (!this.__disclosure_isRoot) {
                warnMissingParentDirective('x-disclosure:button', 'x-disclosure', this.$el);
                return;
            }
            this.__disclosure_buttonEl = this.$el;
        },
        '@click.stop.prevent': '$disclosure.toggle()',
        ':aria-controls'() {
            var _a;
            return (_a = this.__disclosure_contentEl) === null || _a === void 0 ? void 0 : _a.id;
        },
        ':aria-expanded': '$disclosure.isExpanded',
    });
}
function handleDisclosureGroup($el, Alpine, { expression, modifiers }, { evaluate }) {
    let options = evaluate(expression === '' ? '{}' : expression);
    if (options !== undefined && options !== null && !isPlainObject(options)) {
        throw new Error(`options must be an object, but got ${options}`);
    }
    let state;
    if (options.multiple || modifiers.includes('multiple')) {
        state = buildMultiSelectDisclosureGroupState(options);
    }
    else {
        state = buildSingleSelectDisclosureGroupState(options);
    }
    Alpine.bind($el, {
        ['x-data']() {
            return {
                __disclosure_group_state: state,
                // Reset depth at each group boundary so descendants of a grouped disclosure
                // become direct children of the inner group (not treated as depth-2 of the outer one)
                __disclosure_groupDepth: null,
            };
        },
    });
}
function handleRoot($el, Alpine, { modifiers, expression }, { evaluate }) {
    const $data = Alpine.$data($el);
    const isInDisclosureGroup = !!$data.__disclosure_group_state;
    // Track the depth of the disclosure group so that we can exclude the children of a grouped disclosure from also having their state controlled by the group state
    let groupDepth = $data.__disclosure_groupDepth;
    if (isInDisclosureGroup) {
        if (groupDepth === undefined || groupDepth === null) {
            groupDepth = 0;
        }
        groupDepth++;
    }
    const isDirectChildOfDisclosureGroup = isInDisclosureGroup && groupDepth === 1;
    const animated = !modifiers.includes('noanimate');
    const expand = modifiers.includes('expand');
    let options = {};
    // Evaluate the x-disclosure expression to get the initial expanded state of the disclosure (e.g. true or false)
    if (expression) {
        let evalutatedExpression = evaluate(expression === '' ? '{}' : expression);
        if (evalutatedExpression === true || evalutatedExpression === false) {
            options.isExpanded = evalutatedExpression;
        }
        else if (isPlainObject(evalutatedExpression)) {
            options = evalutatedExpression;
        }
    }
    else {
        // If there's no expression, but the .expand modifier is used, the disclosure is expanded by default
        if (expand) {
            options.isExpanded = true;
        }
    }
    let state = buildDisclosureState(options);
    // If a x-disclosure is the child of a x-disclosure-group its 'isExpanded' state is derived from the group's expanded state instead of having its own state
    // This allows us to close disclosure when another one in the group is opened
    // For clarity: the groupDepth check here ensures that e.g. if you have a popup inside of a tab
    // that opening or closing the popup doesn't affect the state of the tabs (i.e the disclosure group)
    if (isDirectChildOfDisclosureGroup) {
        state = buildDisclosureState({
            get isExpanded() {
                var _a, _b;
                const index = (_b = (_a = $data.__disclosure_group_state).indexOf) === null || _b === void 0 ? void 0 : _b.call(_a, $el);
                const isExpanded = $data.__disclosure_group_state.isExpanded(index);
                return isExpanded;
            },
            set isExpanded(value) {
                var _a, _b;
                const index = (_b = (_a = $data.__disclosure_group_state).indexOf) === null || _b === void 0 ? void 0 : _b.call(_a, $el);
                if (value) {
                    $data.__disclosure_group_state.expand(index);
                }
                else {
                    $data.__disclosure_group_state.collapse(index);
                }
            },
        });
    }
    Alpine.bind($el, {
        ':id': `$el.id || $id('disclosure')`,
        ['x-data']() {
            return {
                __disclosure_isRoot: true,
                __disclosure_buttonEl: null,
                __disclosure_contentEl: null,
                __disclosure_state: state,
                __disclosure_animated: animated,
                __disclosure_groupDepth: groupDepth,
                init() {
                    this.$watch('__disclosure_state.isExpanded', (isExpanded) => {
                        this.$dispatch(isExpanded ? 'expand' : 'collapse');
                    });
                    if (isDirectChildOfDisclosureGroup) {
                        // Register this element with the disclosure group so we can keep track of it's index
                        this.$data.__disclosure_group_state.register(this.$el);
                        if (options.isExpanded) {
                            this.__disclosure_state.expand();
                        }
                    }
                },
                destroy() {
                    if (isDirectChildOfDisclosureGroup) {
                        this.$data.__disclosure_group_state.unregister(this.$el);
                    }
                },
                async __disclosure_waitForAnimations() {
                    return await this.$waitForAnimations({
                        subtree: true,
                        target: this.__disclosure_contentEl,
                    });
                },
                get __disclosure_isInGroup() {
                    return isInDisclosureGroup;
                },
                get __disclosure_groupIndex() {
                    var _a, _b;
                    if (!this.__disclosure_isInGroup)
                        return null;
                    return (_b = (_a = $data.__disclosure_group_state).indexOf) === null || _b === void 0 ? void 0 : _b.call(_a, this.$el);
                },
            };
        },
        ['x-id']: "['disclosure', 'disclosure-panel', 'disclosure-button']",
    });
}
function buildDisclosureState(options) {
    var _a;
    let state = {
        isExpanded: (_a = options === null || options === void 0 ? void 0 : options.isExpanded) !== null && _a !== void 0 ? _a : false,
        expand() {
            this.isExpanded = true;
        },
        collapse() {
            this.isExpanded = false;
        },
        toggle() {
            this.isExpanded = !this.isExpanded;
        },
        get isCollapsed() {
            return !this.isExpanded;
        },
    };
    if ((options === null || options === void 0 ? void 0 : options.isExpanded) !== undefined) {
        const isExpandedDescriptor = Object.getOwnPropertyDescriptor(options, 'isExpanded');
        Object.defineProperty(state, 'isExpanded', isExpandedDescriptor);
    }
    return state;
}
function buildSingleSelectDisclosureGroupState(options) {
    var _a;
    let state = {
        expandedIndex: (_a = options === null || options === void 0 ? void 0 : options.initiallyExpandedIndex) !== null && _a !== void 0 ? _a : null,
        items: new Set(),
        isExpanded(index) {
            return this.expandedIndex === index;
        },
        register(el) {
            this.items.add(el);
        },
        unregister(el) {
            this.items.delete(el);
        },
        indexOf(el) {
            var _a;
            const explicit = (_a = options === null || options === void 0 ? void 0 : options.getIndex) === null || _a === void 0 ? void 0 : _a.call(options, el);
            if (explicit !== undefined && explicit !== null)
                return explicit;
            return Array.from(this.items).indexOf(el);
        },
        toggle(index) {
            this.expandedIndex === index ? this.collapse(index) : this.expand(index);
        },
        expand(index) {
            this.expandedIndex = index;
        },
        collapse(index) {
            if (this.expandedIndex === index) {
                this.expandedIndex = null;
            }
        },
    };
    if (options && 'expandedIndex' in options) {
        copyProperty(options, state, 'expandedIndex');
    }
    return state;
}
function buildMultiSelectDisclosureGroupState(options) {
    var _a;
    let state = {
        expandedIndices: (_a = options === null || options === void 0 ? void 0 : options.initiallyExpandedIndices) !== null && _a !== void 0 ? _a : new Set(),
        items: new Set(),
        isExpanded(index) {
            return this.expandedIndices.has(index);
        },
        register(el) {
            this.items.add(el);
        },
        unregister(el) {
            this.items.delete(el);
        },
        indexOf(el) {
            return Array.from(this.items).indexOf(el);
        },
        toggle(index) {
            this.expandedIndices.has(index) ? this.collapse(index) : this.expand(index);
        },
        expand(index) {
            const expanded = this.expandedIndices;
            expanded.add(index);
            // Copy to a new set so that reactivity works
            this.expandedIndices = new Set(Array.from(expanded));
        },
        collapse(index) {
            const expanded = this.expandedIndices;
            expanded.delete(index);
            // Copy to a new set so that reactivity works
            this.expandedIndices = new Set(Array.from(expanded));
        },
    };
    if (options && 'expandedIndices' in options) {
        copyProperty(options, state, 'expandedIndices');
    }
    return state;
}
