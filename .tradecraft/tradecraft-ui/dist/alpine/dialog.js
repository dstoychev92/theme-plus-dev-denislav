import { isDialogApiSupported, isDialogElement, isHtmlElement, isClickingOutside, isPlainObject, trackProperty, copyProperty, } from '../utils';
import { warnMissingParentDirective } from '../utils/error';
import { captureFocus, restoreFocus } from '../utils/preserve-focus';
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
export default function (Alpine) {
    Alpine.directive('dialog', ($el, data, utilities) => {
        if (!isHtmlElement($el)) {
            throw new Error(`Expected HTMLElement but got ${$el}`);
        }
        if (data.value === 'panel') {
            // handlePanel($el, Alpine);
        }
        else if (data.value === 'button') {
            handleButton($el, Alpine);
        }
        else if (data.value === 'close') {
            handleCloseButton($el, Alpine);
        }
        else if (data.value === 'backdrop') {
            handleBackdrop($el, Alpine);
        }
        else if (data.value === 'dialog') {
            if (!isDialogElement($el))
                throw new Error('x-dialog must be used on a <dialog> element');
            handleDialog($el, Alpine, data);
        }
        else if (data.value === 'content') {
            handleContent($el, Alpine);
        }
        else if (data.value === null) {
            handleRoot($el, Alpine, data, utilities);
        }
        else {
            throw new Error(`Unknown directive: x-dialog:${data.value}`);
        }
    }).before('bind');
    Alpine.magic('dialog', handleDialogMagic(Alpine));
}
export function handleDialogMagic(Alpine) {
    return function ($el) {
        const $data = Alpine.$data($el);
        return {
            waitForAnimations() {
                var _a, _b;
                return (_b = (_a = $data.__dialog_waitForAnimations) === null || _a === void 0 ? void 0 : _a.call($data)) !== null && _b !== void 0 ? _b : Promise.resolve([]);
            },
            get isOpen() {
                var _a, _b;
                return (_b = (_a = $data.__dialog_state) === null || _a === void 0 ? void 0 : _a.isOpen) !== null && _b !== void 0 ? _b : false;
            },
            set isOpen(value) {
                if (!$data.__dialog_state)
                    return;
                $data.__dialog_state.isOpen = value;
            },
            get wasOpen() {
                var _a;
                return (_a = $data.__dialog_state) === null || _a === void 0 ? void 0 : _a.wasOpen;
            },
            open() {
                var _a;
                (_a = $data.__dialog_state) === null || _a === void 0 ? void 0 : _a.open();
            },
            close() {
                var _a;
                (_a = $data.__dialog_state) === null || _a === void 0 ? void 0 : _a.close();
            },
        };
    };
}
function handleBackdrop($el, Alpine) {
    Alpine.bind($el, {
        ['x-data']() {
            return {
                init() {
                    if (!this.__dialog_isRoot) {
                        warnMissingParentDirective('x-dialog:backdrop', 'x-dialog', this.$el);
                    }
                },
            };
        },
        'x-show': '$dialog.isOpen',
        '@click': '$dialog.close()',
    });
}
function handleButton($el, Alpine) {
    Alpine.bind($el, {
        ':id': `$id('dialog-button')`,
        'x-init'() {
            if (!this.__dialog_isRoot) {
                warnMissingParentDirective('x-dialog:button', 'x-dialog', this.$el);
                return;
            }
            this.__dialog_buttonEl = $el;
        },
        '@click.stop.prevent': '$dialog.open()',
        ':aria-controls'() {
            var _a;
            // The dialog may keep a server-rendered id instead of the generated one
            return ((_a = this.__dialog_dialogEl) === null || _a === void 0 ? void 0 : _a.id) || this.$id('dialog');
        },
        ':aria-expanded': '$dialog.isOpen',
        'aria-haspopup': 'dialog',
    });
}
function handleCloseButton($el, Alpine) {
    Alpine.bind($el, {
        ['x-data']() {
            return {
                init() {
                    if (!this.__dialog_isRoot) {
                        warnMissingParentDirective('x-dialog:close', 'x-dialog', this.$el);
                    }
                },
            };
        },
        '@click': '$dialog.close()',
    });
}
function handleDialog($el, Alpine, { modifiers }) {
    const $data = Alpine.$data($el);
    // Themes hard-wire aria-controls to server-rendered dialog ids from outside the component
    // (e.g. the header toolbar button targeting the header drawer), so never clobber one
    const staticId = $el.getAttribute('id');
    Alpine.bind($el, {
        ':aria-labelledby'() {
            var _a;
            return (_a = this.__dialog_buttonEl) === null || _a === void 0 ? void 0 : _a.id;
        },
        'data-morph-update': 'children',
        // Close the dialog on when native close or cancel events fired on element for whatever reason
        '@close.stop.prevent': '$dialog.close()',
        '@cancel.stop.prevent': '$dialog.close()',
        // Close when clicking outside of the dialog panel i.e. the backdrop
        '@click'() {
            if (isClickingOutside(this.$event, $data.__dialog_contentEl || $el)) {
                this.$dialog.close();
            }
        },
        'x-init'() {
            if (!this.__dialog_isRoot) {
                warnMissingParentDirective('x-dialog:dialog', 'x-dialog', this.$el);
                return;
            }
            this.__dialog_dialogEl = $el;
        },
        ':id'() {
            return staticId || this.$id('dialog');
        },
        '@keydown.escape.window': '$data.__dialog_isModal && $dialog.close()',
    });
}
function handleContent($el, Alpine) {
    Alpine.bind($el, {
        'x-init'() {
            if (!this.__dialog_isRoot) {
                warnMissingParentDirective('x-dialog:content', 'x-dialog', this.$el);
                return;
            }
            this.__dialog_contentEl = $el;
        },
        ':id': `$id('dialog-panel')`,
    });
}
function handleRoot($el, Alpine, { modifiers, expression }, { evaluate }) {
    const modal = modifiers.includes('modal');
    const noautofocus = modifiers.includes('noautofocus');
    const open = modifiers.includes('open');
    let options = {};
    // Evaluate the x-disclosure expression to get the initial expanded state of the disclosure (e.g. true or false)
    if (expression) {
        let evalutatedExpression = evaluate(expression === '' ? '{}' : expression);
        if (evalutatedExpression === true || evalutatedExpression === false) {
            options.isOpen = evalutatedExpression;
        }
        else if (isPlainObject(evalutatedExpression)) {
            options = evalutatedExpression;
        }
    }
    else {
        // If there's no expression, but the .expand modifier is used, the disclosure is expanded by default
        if (open) {
            options.isOpen = true;
        }
    }
    let state = buildDialogState(options);
    Alpine.bind($el, {
        ['x-id']: "['dialog', 'dialog-panel', 'dialog-button']",
        ['x-data']() {
            return {
                __dialog_isRoot: true,
                __dialog_isModal: modal || false,
                __dialog_dialogEl: null,
                __dialog_contentEl: $el,
                __dialog_autofocus: !noautofocus,
                __dialog_buttonEl: null,
                __dialog_focusSnapshot: null,
                __dialog_state: state,
                async __dialog_showDialog() {
                    var _a, _b, _c;
                    if (!isDialogApiSupported())
                        return;
                    if ((_a = this.__dialog_dialogEl) === null || _a === void 0 ? void 0 : _a.open)
                        return;
                    // Native close() restores focus to the element focused right now, but silently drops
                    // it to <body> when that element is hidden or replaced by then (e.g. a quick view
                    // trigger only shown while its card has focus, or a header cart icon re-rendered by a
                    // section update). Snapshot it so the close path can restore to its closest equivalent.
                    this.__dialog_focusSnapshot = captureFocus(document.body);
                    if (this.__dialog_isModal) {
                        (_b = this.__dialog_dialogEl) === null || _b === void 0 ? void 0 : _b.showModal();
                    }
                    else {
                        (_c = this.__dialog_dialogEl) === null || _c === void 0 ? void 0 : _c.show();
                    }
                },
                async __dialog_closeDialog() {
                    if (!isDialogApiSupported())
                        return;
                    // Keep the element in a local since the exit animation gives a section update a few
                    // hundred milliseconds to replace __dialog_dialogEl
                    const dialogEl = this.__dialog_dialogEl;
                    if (!dialogEl)
                        return;
                    // Alpine fires the isOpen watcher on every store change even when the value stayed
                    // false, so every closed store-bound dialog lands here when any other drawer toggles.
                    // A focus snapshot means the dialog did open and something closed it natively, and
                    // the focus restore below must still run.
                    if (!dialogEl.open && !this.__dialog_focusSnapshot)
                        return;
                    const animation = dialogEl.style.animation;
                    // Force browser to restart animation by resetting it and forcing a reflow
                    dialogEl.style.animation = 'none';
                    void dialogEl.offsetWidth;
                    this.$nextTick(async () => {
                        dialogEl.style.animation = animation;
                        try {
                            // Wait for animations to complete before closing the dialog (which adds display: none which would kill the animations)
                            await this.__dialog_waitForAnimations();
                        }
                        finally {
                            // Close in a finally since a throw in the wait would otherwise leave a modal in
                            // the top layer, which makes the whole page inert
                            if (!this.__dialog_state.isOpen) {
                                dialogEl.close();
                                // When the native restore target is unfocusable, the browser can leave focus on the
                                // now-hidden element inside the closed dialog before dropping it to <body> — treat
                                // that as lost as well, so restoreFocus doesn't mistake it for a deliberate move
                                const active = document.activeElement;
                                if (isHtmlElement(active) && dialogEl.contains(active)) {
                                    active.blur();
                                }
                                // No-op when the native close already put focus somewhere real
                                restoreFocus(document.body, this.__dialog_focusSnapshot);
                                this.__dialog_focusSnapshot = null;
                            }
                        }
                    });
                },
                async __dialog_waitForAnimations() {
                    var _a;
                    // Target the <dialog> element itself — that's where enter/exit animations live (and
                    // the ::backdrop pseudo and any close-button child animations are in its subtree).
                    // __dialog_contentEl is for click-outside detection; using it here breaks the wait
                    // when consumers set x-dialog:content on a child of <dialog>, since the animation
                    // is then on an ancestor of the wait target rather than a descendant.
                    return await this.$waitForAnimations({
                        subtree: true,
                        target: (_a = this.__dialog_dialogEl) !== null && _a !== void 0 ? _a : this.__dialog_contentEl,
                    });
                },
                init() {
                    this.$watch('__dialog_state.isOpen', async (isOpen) => {
                        if (isOpen) {
                            this.__dialog_showDialog();
                        }
                        else {
                            this.__dialog_closeDialog();
                        }
                    });
                    this.$nextTick(() => {
                        if (!this.__dialog_dialogEl)
                            return;
                        const hasOpenAttribute = Alpine.bound(this.__dialog_dialogEl, 'open', false);
                        if (hasOpenAttribute || this.__dialog_state.isOpen) {
                            this.__dialog_state.isOpen = true;
                            this.__dialog_showDialog();
                        }
                    });
                },
            };
        },
    });
}
function buildDialogState(options) {
    var _a, _b;
    let state = {
        isOpen: (_a = options === null || options === void 0 ? void 0 : options.isOpen) !== null && _a !== void 0 ? _a : false,
        wasOpen: (_b = options === null || options === void 0 ? void 0 : options.isOpen) !== null && _b !== void 0 ? _b : false,
        open() {
            this.isOpen = true;
        },
        close() {
            this.isOpen = false;
        },
    };
    state = trackProperty(state, 'isOpen', 'wasOpen');
    if ((options === null || options === void 0 ? void 0 : options.isOpen) !== undefined) {
        copyProperty(options, state, 'isOpen');
    }
    return state;
}
