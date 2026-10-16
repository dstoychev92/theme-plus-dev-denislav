
/*
* @license
* PIPELINE Theme (c) Groupthought Themes
*
* This file is included for advanced development by
* Shopify Agencies. Modified versions of the theme
* code are not supported by Shopify or Groupthought.
*
* Add any minor JS changes in assets/custom.js, this
* will make it easier to update the theme in the future.
*
*/
                  
(function() {
    const env = {"NODE_ENV":"production"};
    try {
        if (process) {
            process.env = Object.assign({}, process.env);
            Object.assign(process.env, env);
            return;
        }
    } catch (e) {} // avoid ReferenceError: process is not defined
    globalThis.process = { env:env };
})();

function isHtmlElement(node) {
    return node != undefined && node != null && typeof node.tagName === 'string' && node.nodeType === Node.ELEMENT_NODE;
}
function isFormElement(node) {
    return isHtmlElement(node) && node.nodeName === 'FORM';
}
function isInputElement(node) {
    return isHtmlElement(node) && node.nodeName === 'INPUT';
}
function isProductForm(el) {
    var _a;
    return isFormElement(el) && ((_a = el.getAttribute('action')) === null || _a === void 0 ? void 0 : _a.includes('cart/add'));
}
function isInProductForm(el) {
    return isHtmlElement(el) && !isProductForm(el) && el.closest('form[action*="cart/add"]');
}
function isHiddenInput(el) {
    return isInputElement(el) && el.type === 'hidden';
}
function isShopifyAppBlock(el) {
    return isHtmlElement(el) && el.classList.contains('shopify-app-block');
}
function isShopifyElement(el) {
    return isHtmlElement(el) && el.hasAttribute('data-shopify');
}

function hasConnection(navigator) {
    return 'connection' in navigator;
}
function isSavingData() {
    var _a;
    if (hasConnection(navigator)) {
        return (_a = navigator.connection) === null || _a === void 0 ? void 0 : _a.saveData;
    }
    return undefined;
}
function isSlowConnection() {
    var _a;
    if (hasConnection(navigator)) {
        return (_a = navigator.connection) === null || _a === void 0 ? void 0 : _a.effectiveType.match(/(2g)/);
    }
    return undefined;
}

export { hasConnection, isHiddenInput, isInProductForm, isProductForm, isSavingData, isShopifyAppBlock, isShopifyElement, isSlowConnection };
