import { isHtmlElement } from './dom';
/**
 * Returns the containing section element of the current element, or the current element if it is a section
 */
export function closestSectionEl($el) {
    if (!isHtmlElement($el)) {
        throw new Error(`Expected HTMLElement but got ${$el}`);
    }
    if ($el.classList.contains('shopify-section')) {
        return $el;
    }
    return $el.closest('.shopify-section');
}
