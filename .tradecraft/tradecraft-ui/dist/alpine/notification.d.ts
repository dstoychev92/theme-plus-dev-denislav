import { Alpine as AlpineType } from 'alpinejs';
import { AlpineComponent } from 'alpinejs';
import { type FocusReturnTarget } from '../utils';
export type NotificationMagic = {
    dismiss(): void;
    cancelTimer(): void;
    startTimer(): void;
    visible: boolean;
};
export type NotificationAddOptions = {
    /**
     * If true, will replace any existing notification before showing this one
     */
    replace?: boolean;
};
declare module 'alpinejs' {
    interface Magics<T> {
        /**
         * The state of the enclosing x-notification: `visible`, plus `dismiss()`,
         * `startTimer()` and `cancelTimer()` for the auto-dismiss timer.
         */
        $notification: NotificationMagic;
    }
}
export type NotificationComponent = AlpineComponent<{
    __notification_previousActiveTarget: FocusReturnTarget | null;
    get __notification_visible(): boolean;
    __notification_intervalId: number | undefined;
    __notification_duration: number;
    __notification_startTimer(): void;
    __notification_dismiss(): void;
    __notification_cancelTimer(): void;
}>;
/**
 * Turns a popover panel into a self-dismissing notification.
 *
 * - x-notification - Binds role="alert", x-popover.noclose, and
 *   x-popover:panel.nofloat.notrap to the root. Open it with $popover.open().
 *
 * Root modifier:
 * - .duration.5000ms - How long the notification stays open before it dismisses itself (default 5000ms).
 *
 * Behavior:
 * - The dismiss timer starts when the panel expands.
 * - Pointer hover and keyboard focus inside the panel pause the timer. Leaving restarts it.
 * - dismiss() returns keyboard focus only when it starts inside the panel. It uses
 *   $store.focus when focus was already on <body> before the panel opened.
 *
 * @example
 * <div x-notification.duration.8000ms x-init="$nextTick(() => $popover.open())">
 *   <p>Added to cart</p>
 *   <button @click="$notification.dismiss()">Close</button>
 * </div>
 */
export default function (Alpine: AlpineType): void;
