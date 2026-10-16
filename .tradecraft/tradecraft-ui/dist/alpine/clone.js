import { isHtmlElement, isTemplateElement } from '../utils/dom';
export default function (Alpine) {
    Alpine.directive('clone', ($targetEl, { expression }, { effect, evaluate, cleanup }) => {
        if (!isHtmlElement($targetEl)) {
            throw new Error(`Expected HTMLElement but got ${$targetEl}`);
        }
        $targetEl._x_insertClone = (sourceEl) => {
            var _a;
            if (!isHtmlElement(sourceEl))
                return;
            if (!isTemplateElement($targetEl)) {
                throw new Error(`x-clone can only be used on a <template> tag`);
            }
            if ($targetEl._x_clonedElement) {
                (_a = $targetEl._x_undoClone) === null || _a === void 0 ? void 0 : _a.call($targetEl);
            }
            let clone = isTemplateElement(sourceEl)
                ? sourceEl.content.cloneNode(true).firstElementChild
                : sourceEl.cloneNode(true);
            if (!clone)
                return;
            // Add new parent element's scope to cloned element
            Alpine.addScopeToNode(clone, {}, $targetEl);
            Alpine.mutateDom(() => {
                // Insert cloned node after element with x-clone attribute
                $targetEl.after(clone);
                // Re-initialize alpine on cloned node
                Alpine.skipDuringClone(() => Alpine.initTree(clone))();
            });
            $targetEl._x_clonedElement = clone;
            $targetEl._x_undoClone = () => {
                clone.remove();
                Alpine.destroyTree(clone);
                delete $targetEl._x_clonedElement;
            };
        };
        // Evaluate expression to the source element that will be cloned into the target element
        $targetEl._x_insertClone(evaluate(expression));
        cleanup(() => $targetEl._x_undoClone && $targetEl._x_undoClone());
    }).before('bind');
}
