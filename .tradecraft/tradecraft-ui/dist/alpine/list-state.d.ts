import { AlpineComponent, Alpine as AlpineType } from 'alpinejs';
declare module 'alpinejs' {
    interface Magics<T> {
        $listState: ListStateMagic;
    }
}
export type ListStateMagic = SingleSelectListState | MultiSelectListState;
export type MultiSelectListStateOptions = {
    selectedIndices?: Set<number>;
};
export type SingleSelectListStateOptions = {
    selectedIndex?: number | null;
};
export type ListStateOptions = (SingleSelectListStateOptions | MultiSelectListStateOptions) & {
    scope?: string;
    multiple?: boolean;
};
export type SingleSelectListState = {
    totalItems: number;
    previousSelectedIndex: number | null;
    items: Set<HTMLElement>;
    selectedIndex: number | null;
    isSelected(index: number): boolean;
    register(el: HTMLElement): void;
    unregister(el: HTMLElement): void;
    indexOf(el: HTMLElement): number;
    toggle(index: number): void;
    select(index: number): void;
    deselect(index: number): void;
};
export type MultiSelectListState = {
    totalItems: number;
    items: Set<HTMLElement>;
    selectedIndices: Set<number>;
    isSelected(index: number): boolean;
    register(el: HTMLElement): void;
    unregister(el: HTMLElement): void;
    indexOf(el: HTMLElement): number;
    toggle(index: number): void;
    select(index: number): void;
    deselect(index: number): void;
};
export type ListStateComponent = AlpineComponent<{
    __listState: SingleSelectListState | MultiSelectListState;
}>;
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
export default function (Alpine: AlpineType): void;
export declare function buildSingleSelectListState(options: SingleSelectListStateOptions): SingleSelectListState;
export declare function buildMultiSelectListState(options: MultiSelectListStateOptions): MultiSelectListState;
