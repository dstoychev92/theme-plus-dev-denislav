import { captureFocusReturnTarget, focusElementOrNearest, isHtmlElement } from '../utils';
import { getMillisecondsModifierValue } from '../utils/modifiers';
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
export default function (Alpine) {
    Alpine.directive('notification', ($el, data, utilities) => {
        handleNotification($el, Alpine, data, utilities);
    }).before('bind');
    Alpine.magic('notification', handleNotificationMagic(Alpine));
}
function handleNotificationMagic(Alpine) {
    return function ($el) {
        if (!isHtmlElement($el)) {
            throw new Error(`Expected HTMLElement but got ${$el}`);
        }
        const $data = Alpine.$data($el);
        return {
            dismiss: $data.__notification_dismiss.bind($data),
            startTimer: $data.__notification_startTimer.bind($data),
            cancelTimer: $data.__notification_cancelTimer.bind($data),
            get visible() {
                return $data.__notification_visible;
            },
        };
    };
}
function handleNotification($el, Alpine, { modifiers }, _utilities) {
    var _a;
    const duration = (_a = getMillisecondsModifierValue(modifiers, 'duration')) !== null && _a !== void 0 ? _a : 5000;
    Alpine.bind($el, {
        ['x-data']() {
            return {
                __notification_intervalId: undefined,
                __notification_duration: duration,
                __notification_previousActiveTarget: null,
                init() {
                    this.$nextTick(() => {
                        this.$watch('$disclosure.isExpanded', (expanded, wasExpanded) => {
                            if (expanded && !wasExpanded) {
                                const activeElement = document.activeElement;
                                this.__notification_previousActiveTarget =
                                    activeElement instanceof HTMLElement ? captureFocusReturnTarget(activeElement) : null;
                                if (this.__notification_duration !== Infinity) {
                                    this.__notification_startTimer();
                                }
                            }
                        });
                    });
                },
                destroy() {
                    this.__notification_cancelTimer();
                },
                __notification_cancelTimer() {
                    clearTimeout(this.__notification_intervalId);
                    this.__notification_intervalId = undefined;
                },
                __notification_startTimer() {
                    this.__notification_cancelTimer();
                    this.__notification_intervalId = setTimeout(() => {
                        this.__notification_dismiss();
                    }, this.__notification_duration);
                },
                get __notification_visible() {
                    return this.$disclosure.isExpanded;
                },
                __notification_dismiss() {
                    var _a;
                    this.__notification_cancelTimer();
                    const shouldReturnFocus = this.$el.contains(document.activeElement) && this.$isKeyboardActive;
                    // Capture targets before collapse since hiding the panel records its focused control
                    const focusStore = this.$store.focus;
                    const storeTarget = shouldReturnFocus ? ((_a = focusStore === null || focusStore === void 0 ? void 0 : focusStore.snapshot()) !== null && _a !== void 0 ? _a : null) : null;
                    this.$disclosure.collapse();
                    const previousActiveTarget = this.__notification_previousActiveTarget;
                    this.__notification_previousActiveTarget = null;
                    if (!shouldReturnFocus)
                        return;
                    if (focusStore)
                        focusStore.returnTo = null;
                    this.$nextTick(() => {
                        if (this.$popup.isOpen)
                            return;
                        // <body> or <html> means focus was lost before open, so use the global record
                        const previousIsUsable = previousActiveTarget &&
                            previousActiveTarget.el !== document.body &&
                            previousActiveTarget.el !== document.documentElement;
                        const target = previousIsUsable ? previousActiveTarget : storeTarget;
                        if (target)
                            focusElementOrNearest(target);
                        const activeElement = document.activeElement;
                        if (activeElement instanceof HTMLElement && this.$el.contains(activeElement)) {
                            // Remove the focusout record made by this closing panel
                            activeElement.blur();
                            if ((focusStore === null || focusStore === void 0 ? void 0 : focusStore.returnTo) === activeElement)
                                focusStore.returnTo = null;
                        }
                    });
                },
            };
        },
        role: 'alert',
        // Disable popover close since notification dismissal owns focus return
        'x-popover.noclose': '',
        // Disable the popover trap since notification markup owns the trap
        'x-popover:panel.nofloat.notrap': '',
        '@focusin': '$isKeyboardActive && $notification.cancelTimer()',
        '@focusout': '$disclosure.isExpanded && $notification.startTimer()',
        'x-hover:start': '$notification.cancelTimer()',
        'x-hover:end': '$disclosure.isExpanded && $notification.startTimer()',
    });
    return {};
}
