import { Alpine as AlpineType, AlpineComponent } from 'alpinejs';
import { FocusSnapshot } from '../utils/preserve-focus';
export type DialogComponent = AlpineComponent<{
    __dialog_isRoot: boolean;
    __dialog_isModal: boolean;
    __dialog_dialogEl: HTMLDialogElement | null;
    __dialog_contentEl: HTMLElement | null;
    __dialog_autofocus: boolean;
    __dialog_buttonEl: HTMLElement | null;
    __dialog_focusSnapshot: FocusSnapshot | null;
    __dialog_state: DialogState;
    __dialog_showDialog(): void;
    __dialog_closeDialog(): void;
    __dialog_waitForAnimations(): Promise<Animation[]>;
}>;
export type DialogOptions = {
    isOpen?: boolean;
};
type DialogMagic = {
    get wasOpen(): boolean | null;
    open(): void;
    close(): void;
    get isOpen(): boolean;
    set isOpen(value: boolean);
    waitForAnimations(): Promise<Animation[]>;
};
declare module 'alpinejs' {
    interface Magics<T> {
        /**
         * State of the enclosing x-dialog: isOpen (get/set), wasOpen, open(), close(),
         * and waitForAnimations()
         */
        $dialog: DialogMagic;
    }
}
export type DialogState = {
    isOpen: boolean;
    open(): void;
    close(): void;
    get wasOpen(): boolean | null;
};
/**
 * Builds modal and non-modal dialogs on native <dialog> elements. The plugin opens the
 * dialog with show() or showModal(), waits for CSS animations to complete before the
 * native close(), and restores focus to the opener — or to its closest equivalent when
 * the opener is hidden or replaced by then.
 *
 * Directives:
 * - x-dialog - The root element. Holds the open state for child directives. The .modal
 *   modifier opens with showModal(): focus trap, ::backdrop, Escape closes.
 * - x-dialog:dialog - The <dialog> element itself. Keeps a server-rendered id when one exists.
 * - x-dialog:content - The content wrapper inside the <dialog>. A click outside this
 *   element (on the backdrop) closes the dialog.
 * - x-dialog:button - Opens the dialog on click. Gets aria-controls, aria-expanded, and
 *   aria-haspopup="dialog".
 * - x-dialog:close - Closes the dialog on click.
 * - x-dialog:backdrop - A custom backdrop element for non-modal dialogs, since ::backdrop
 *   only exists for modal ones. Shown while open, closes on click.
 *
 * The expression accepts a boolean or { isOpen }. isOpen accepts a get/set pair for
 * two-way binding to outside state. A server-rendered `open` attribute on the <dialog>
 * also starts the dialog open.
 *
 * The $dialog magic reads and writes the state from anywhere inside the root: isOpen,
 * wasOpen, open(), close(), waitForAnimations().
 *
 * @example
 *
 * <div x-dialog.modal>
 *   <button x-dialog:button>Open</button>
 *   <dialog x-dialog:dialog class="backdrop:bg-black/50">
 *     <div x-dialog:content>
 *       I am dialog content!
 *       <button x-dialog:close>Close</button>
 *     </div>
 *   </dialog>
 * </div>
 */
export default function (Alpine: AlpineType): void;
export declare function handleDialogMagic(Alpine: AlpineType): ($el: HTMLElement) => DialogMagic;
export {};
