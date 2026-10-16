import { isHtmlElement } from '../utils/dom';
/**
 * Adds a keyboard submit shortcut to a textarea.
 *
 * - x-submittable-textarea - Applied to a <textarea>. Cmd+Enter on Mac, or Ctrl+Enter
 *   elsewhere, calls requestSubmit() on the closest <form>, so validation and submit
 *   handlers run the same as a click on the submit button.
 *
 * @example
 * <form method="post">
 *   <textarea name="comment[body]" x-submittable-textarea></textarea>
 *   <button type="submit">Post comment</button>
 * </form>
 */
export default function (Alpine) {
    Alpine.directive('submittable-textarea', ($el, data) => {
        if (!isHtmlElement($el)) {
            throw new Error(`Expected HTMLElement but got ${$el}`);
        }
        if (data.value == null) {
            handleSubmit($el, Alpine);
        }
        else {
            throw new Error(`Unknown directive: x-submittable-textarea:${data.value}`);
        }
    }).before('bind');
}
function handleSubmit($el, Alpine) {
    const isMac = Boolean(navigator.userAgent.indexOf('Mac OS X') !== -1);
    Alpine.bind($el, {
        ['x-data']() {
            return keyActions(isMac);
        },
        '@keydown': '__onKeyDown',
        '@keyup': '__onKeyUp',
    });
}
function keyActions(isMac) {
    return {
        isMetaKeyPressed: false,
        key: isMac ? 'Meta' : 'Control',
        __onKeyDown(e) {
            var _a;
            if (this.isMetaKeyPressed && e.key === 'Enter' && !e.repeat) {
                const target = e.target;
                (_a = target === null || target === void 0 ? void 0 : target.closest('form')) === null || _a === void 0 ? void 0 : _a.requestSubmit();
            }
            if (e.key === this.key) {
                this.isMetaKeyPressed = true;
            }
        },
        __onKeyUp(e) {
            if (e.key === this.key) {
                this.isMetaKeyPressed = false;
            }
        },
    };
}
