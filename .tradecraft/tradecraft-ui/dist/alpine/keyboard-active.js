const KEYBOARD_ACTIVE_CONTEXT_KEY = Symbol('KEYBOARD_ACTIVE_CONTEXT_KEY');
// Share state with TypeScript callers outside Alpine expressions
let sharedContext = null;
/** Return keyboard-navigation state. False before plugin init. */
export function isKeyboardActive() {
    var _a;
    return (_a = sharedContext === null || sharedContext === void 0 ? void 0 : sharedContext.isKeyboardActive) !== null && _a !== void 0 ? _a : false;
}
/**
 * Tracks whether the user is navigating with the keyboard: a Tab press that moves
 * focus turns it on, a mousedown turns it off. Exposed everywhere as
 * `$isKeyboardActive`; `$hasKeyboardFocus` is true when keyboard navigation is
 * active and the element is document.activeElement. Bind a body attribute to it
 * (e.g. `:data-keyboard-active="$isKeyboardActive"`) to gate focus rings in CSS.
 */
export default function (Alpine) {
    let isTabKeyDown = false;
    const context = Alpine.reactive({
        isKeyboardActive: false,
    });
    sharedContext = context;
    Alpine.addScopeToNode(document.body, {
        [KEYBOARD_ACTIVE_CONTEXT_KEY]: context,
    });
    Alpine.bind(document.body, {
        '@keydown.window.tab'() {
            isTabKeyDown = true;
        },
        '@keyup.window'() {
            isTabKeyDown = false;
        },
        '@focusin.window'() {
            if (isTabKeyDown) {
                context.isKeyboardActive = true;
            }
        },
        '@mousedown'() {
            context.isKeyboardActive = false;
        },
    });
    // Scoped to `document.body` above, so every element inherits it.
    const contextFor = ($el) => Alpine.$data($el)[KEYBOARD_ACTIVE_CONTEXT_KEY];
    Alpine.magic('isKeyboardActive', ($el) => contextFor($el).isKeyboardActive);
    Alpine.magic('hasKeyboardFocus', ($el) => contextFor($el).isKeyboardActive && document.activeElement === $el);
}
