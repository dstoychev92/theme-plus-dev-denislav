import { Alpine as AlpineType } from 'alpinejs';
/**
 * The clone plugin copies an element from another part of the DOM, sort of the opposite of
 * Alpine's built in x-teleport directive. Put x-clone on a <template>; its expression
 * evaluates to the source element, and the copy is inserted directly after the template.
 * The template stays in the DOM as the marker, and the copy is removed with it. Alpine
 * re-initializes on the copy, with the template's own scope added, so directives on the
 * copy read state from the template's position. When the source is itself a <template>,
 * its first content element is cloned.
 *
 * @example The copy of #123 is inserted after the template.
 *
 * ```
 * <div id="123">
 * </div>
 *
 * <div>
 *  <template x-clone="document.getElementById('123')"></template>
 * </div>
 * ```
 */
declare global {
    interface Node {
        _x_undoClone?: VoidFunction;
        _x_insertClone?(el: HTMLElement): void;
        _x_clonedElement?: HTMLElement;
    }
}
export default function (Alpine: AlpineType): void;
