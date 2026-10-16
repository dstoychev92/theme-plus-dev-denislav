import { captureFocusReturnTarget, focusElementOrNearest } from '../utils';
import { isKeyboardActive } from './keyboard-active';
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
export default function (Alpine) {
    let returnTarget = null;
    const store = {
        get returnTo() {
            var _a;
            return (_a = returnTarget === null || returnTarget === void 0 ? void 0 : returnTarget.el) !== null && _a !== void 0 ? _a : null;
        },
        set returnTo(el) {
            returnTarget = el ? captureFocusReturnTarget(el) : null;
        },
        snapshot() {
            return returnTarget ? Object.assign(Object.assign({}, returnTarget), { ancestors: [...returnTarget.ancestors] }) : null;
        },
        restore() {
            const target = this.snapshot();
            this.returnTo = null;
            if (target)
                focusElementOrNearest(target);
        },
    };
    Alpine.store('focus', store);
    // relatedTarget=null also covers window blur, where keeping the focused element is safe
    document.addEventListener('focusout', (event) => {
        if (event.relatedTarget !== null || !isKeyboardActive())
            return;
        if (!(event.target instanceof HTMLElement) || event.target === document.body)
            return;
        Alpine.store('focus').returnTo = event.target;
    });
    document.addEventListener('mousedown', () => {
        Alpine.store('focus').returnTo = null;
    });
}
