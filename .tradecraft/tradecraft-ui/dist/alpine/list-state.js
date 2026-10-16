import { copyProperty, isPlainObject } from '../utils';
const DEFAULT_LIST_STATE_NAME = 'listState';
/**
 * Tracks a selected index (or a Set of indices with `.multiple`) for a list of
 * registered elements, exposed as `$listState`.
 *
 * `x-list-state` creates the state on the root. `x-list-state:item` registers the
 * element and unregisters it on destroy. Options: `{selectedIndex}` for single
 * select, `{selectedIndices}` (a Set) for multiple, `{scope: 'name'}` to expose the
 * state as `$name` instead of `$listState`. The `.as.name` modifier also sets the
 * scope, and `x-list-state:item.for.name` registers into a scoped state.
 *
 * @example
 *   <ul x-list-state>
 *     <li x-list-state:item @click="$listState.toggle($listState.indexOf($el))">…</li>
 *   </ul>
 */
export default function (Alpine) {
    Alpine.directive('list-state', ($el, { value, expression, modifiers }, { evaluate }) => {
        if (value == 'item') {
            const $data = Alpine.$data($el);
            let scope = `$${DEFAULT_LIST_STATE_NAME}`;
            if (modifiers.includes('for') && modifiers.length >= 2) {
                const forIndex = modifiers.indexOf('for');
                scope = `$${modifiers[forIndex + 1]}`;
            }
            if (!(scope in $data)) {
                throw new Error(`x-list-state:item must be used within x-list-state directive. To register an item in a scoped list state, use $myScopeName.register($el)`);
            }
            Alpine.bind($el, {
                'x-data'() {
                    return {
                        init() {
                            $data[scope].register(this.$el);
                        },
                        destroy() {
                            $data[scope].unregister(this.$el);
                        },
                    };
                },
            });
        }
        else if (value == null) {
            let options = {};
            let scope = `$${DEFAULT_LIST_STATE_NAME}`;
            if (modifiers.includes('as') && modifiers.length >= 2) {
                const asIndex = modifiers.indexOf('as');
                scope = `$${modifiers[asIndex + 1]}`;
            }
            if (expression) {
                let evalutatedExpression = evaluate(expression === '' ? '{}' : expression);
                if (isPlainObject(evalutatedExpression)) {
                    options = evalutatedExpression;
                    if (options.scope) {
                        scope = `$${options.scope}`;
                    }
                }
            }
            let state;
            if (options.multiple || modifiers.includes('multiple')) {
                options = options;
                if (options === null || options === void 0 ? void 0 : options.selectedIndices) {
                    if (!(options.selectedIndices instanceof Set)) {
                        throw new Error('selectedIndices must be a Set');
                    }
                }
                state = buildMultiSelectListState(options);
            }
            else {
                options = options;
                state = buildSingleSelectListState(options);
            }
            Alpine.addScopeToNode($el, {
                [scope]: Alpine.reactive(state),
            });
        }
        else {
            throw new Error(`Unknown directive: x-list-state:${value}`);
        }
    }).before('bind');
}
export function buildSingleSelectListState(options) {
    let state = {
        previousSelectedIndex: null,
        selectedIndex: null,
        items: new Set(),
        get totalItems() {
            return this.items.size;
        },
        isSelected(index) {
            return this.selectedIndex == index;
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
            this.selectedIndex == index ? this.deselect(index) : this.select(index);
        },
        select(index) {
            this.selectedIndex = index;
        },
        deselect(index) {
            if (this.selectedIndex == index) {
                this.selectedIndex = null;
            }
        },
    };
    if ('selectedIndex' in options) {
        copyProperty(options, state, 'selectedIndex');
    }
    return state;
}
export function buildMultiSelectListState(options) {
    let state = {
        selectedIndices: new Set(),
        items: new Set(),
        get totalItems() {
            return this.items.size;
        },
        isSelected(index) {
            return this.selectedIndices.has(index);
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
            this.selectedIndices.has(index) ? this.deselect(index) : this.select(index);
        },
        select(index) {
            const selected = this.selectedIndices;
            selected.add(index);
            // Copy to a new set so that reactivity works
            this.selectedIndices = new Set(Array.from(selected));
        },
        deselect(index) {
            const selected = this.selectedIndices;
            selected.delete(index);
            // Copy to a new set so that reactivity works
            this.selectedIndices = new Set(Array.from(selected));
        },
    };
    if ('selectedIndices' in options) {
        copyProperty(options, state, 'selectedIndices');
    }
    return state;
}
