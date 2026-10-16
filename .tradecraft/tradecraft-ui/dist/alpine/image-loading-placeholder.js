import { isHtmlElement, isImageElement } from '../utils';
/**
 * Plugin to show a loading placeholder for an image until it has loaded
 *
 * To use:
 * 1. Create a smaller sized version of your image and place it next to (before or after) the original
 * 2. Style it to be the same size as the original and absolutely positioned above or below the original
 * 3. Add the x-img-loading-placeholder directive on the placeholder image
 *
 * <div class="relative">
 *   <img src="/test?width=1000&height=100.png" class="relative z-10" width="1000" height="1000">
 *   <img src="/test.png?width=4&height=4.png" x-img-loading-placeholder class="absolute inset-0 z-0" role="presentation">
 * </div>
 *
 * Or you can pass a reference directly to the directive
 *
 * <div class="relative">
 *   <img x-ref="original" src="/test?width=1000&height=100.png" class="relative z-10" width="1000" height="1000">
 *   <div>
 *    <img src="/test.png?width=4&height=4.png" x-img-loading-placeholder="$refs.original" class="absolute inset-0 z-0" role="presentation">
 *   </div>
 * </div>
 *
 * With no expression, the target is the next or previous element sibling when that sibling
 * is an <img>. Without a target the placeholder hides itself. The directive shows the
 * placeholder until the target's load event fires (or immediately hides it when the target
 * already loaded), and sets aria-hidden="true" and role="presentation" for you.
 */
export default (Alpine) => {
    Alpine.directive('img-loading-placeholder', ($el, { expression }, { evaluate }) => {
        if (!isHtmlElement($el)) {
            throw new Error(`Expected HTMLImageElement but got ${$el}`);
        }
        let targetImage = null;
        if (expression) {
            targetImage = evaluate(expression) || null;
            if (!isImageElement(targetImage)) {
                throw new Error(`Expected targetImage to be HTMLImageElement but got ${$el}`);
            }
        }
        Alpine.bind($el, {
            'x-data'() {
                return {
                    __imgLoadingPlaceholder_showPlaceholder: true,
                    __imgLoadingPlaceholder_targetImage: targetImage,
                    init() {
                        var _a, _b;
                        // Look at the next and previous siblings to see if they are images and
                        // if so then set the target image to that
                        if (!this.__imgLoadingPlaceholder_targetImage && ((_a = this.$el.nextElementSibling) === null || _a === void 0 ? void 0 : _a.nodeName) === 'IMG') {
                            this.__imgLoadingPlaceholder_targetImage = this.$el.nextElementSibling;
                        }
                        if (!this.__imgLoadingPlaceholder_targetImage && ((_b = this.$el.previousElementSibling) === null || _b === void 0 ? void 0 : _b.nodeName) === 'IMG') {
                            this.__imgLoadingPlaceholder_targetImage = this.$el.previousElementSibling;
                        }
                        // If no target image, don't show a placeholder
                        if (!this.__imgLoadingPlaceholder_targetImage) {
                            this.__imgLoadingPlaceholder_showPlaceholder = false;
                            return;
                        }
                        // If image already loaded, hide the placeholder
                        if (this.__imgLoadingPlaceholder_targetImage.complete) {
                            this.$nextTick(() => {
                                this.__imgLoadingPlaceholder_showPlaceholder = false;
                            });
                        }
                        else {
                            const handleLoad = (_e) => {
                                this.__imgLoadingPlaceholder_showPlaceholder = false;
                            };
                            this.__imgLoadingPlaceholder_targetImage.onload = handleLoad.bind(this);
                        }
                    },
                };
            },
            'x-show': '__imgLoadingPlaceholder_showPlaceholder',
            'aria-hidden': 'true',
            role: 'presentation',
        });
    }).before('bind');
};
