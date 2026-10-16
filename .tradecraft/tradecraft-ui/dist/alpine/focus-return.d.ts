import { Alpine as AlpineType } from 'alpinejs';
import { type FocusReturnTarget } from '../utils';
export type FocusReturnStore = {
    /** Last element that lost keyboard focus to `<body>`. */
    returnTo: HTMLElement | null;
    /** Copy the recorded element and its ancestor chain. */
    snapshot(): FocusReturnTarget | null;
    /** Clear the record and restore focus near it. */
    restore(): void;
};
declare module 'alpinejs' {
    interface Stores {
        focus: FocusReturnStore;
    }
}
/**
 * Records where keyboard focus was lost.
 *
 * The browser moves focus to `<body>` when the focused control becomes
 * unfocusable. `$store.focus.restore()` uses the saved ancestor chain when that
 * control cannot take focus again.
 *
 * Mousedown clears the record since focus return can scroll the page for pointer
 * users.
 *
 * Requires the keyboard-active plugin.
 *
 * @example
 * <button @click="$store.focus.restore()">Close</button>
 */
export default function (Alpine: AlpineType): void;
