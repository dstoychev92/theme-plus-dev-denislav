
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
                  
import Alpine from 'alpinejs';

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

/**
 * Global theme event handler for the theme.
 */
/* Cart events */
window.addEventListener('theme:cart:add:success', ((event) => {
    // If the cart action was triggered from the quickview drawer, open the cart drawer
    if (event.target?.matches('#product-quickview-drawer &') &&
        Alpine.store('drawer').isOpen) {
        window.dispatchEvent(new CustomEvent('theme:cart-drawer:open', {}));
        return;
    }
    // If any other drawer is already open, do nothing
    if (Alpine.store('drawer').isOpen) {
        return;
    }
    // Take different actions depending on cart action theme setting
    switch (window.theme.cart?.action) {
        case 'show_notification':
            window.dispatchEvent(new CustomEvent('theme:cart-notification:show', { detail: event.detail }));
            break;
        case 'show_drawer':
            window.dispatchEvent(new CustomEvent('theme:cart-drawer:open', {}));
            break;
        case 'navigate_page':
            if (!event.detail)
                return;
            // Navigate to cart page
            window.location.assign(window.theme.routes.cart);
            break;
    }
}));
/* Cart overlay events */
window.addEventListener('theme:cart-drawer:open', ((_event) => {
    Alpine.store('drawer').type = 'cart';
    Alpine.store('drawer').isOpen = true;
}));
window.addEventListener('theme:cart-drawer:close', ((_event) => {
    if (Alpine.store('drawer').type === 'cart') {
        Alpine.store('drawer').isOpen = false;
    }
}));
/* Product pickup drawer events */
window.addEventListener('theme:pickup:open', ((event) => {
    Alpine.store('drawer').type = 'pickup';
    Alpine.store('drawer').isOpen = true;
    Alpine.store('drawer').data = {
        url: event.detail.url,
    };
}));
window.addEventListener('theme:pickup:close', ((_event) => {
    if (Alpine.store('drawer').type === 'pickup') {
        Alpine.store('drawer').isOpen = false;
        Alpine.store('drawer').data = null;
    }
}));
/* Quickview overlay events */
window.addEventListener('theme:quickview:open', ((event) => {
    if (!event.detail?.url) {
        throw new Error(`theme:quickview:open event must have url`);
    }
    const wasCartDrawerOpen = Alpine.store('drawer').type === 'cart' && Alpine.store('drawer').isOpen;
    Alpine.store('drawer').type = 'quickview';
    Alpine.store('drawer').isOpen = true;
    Alpine.store('drawer').data = {
        url: event.detail.url,
        // Keep track of whether the quickview was opened from the cart drawer
        returnToCartDrawer: wasCartDrawerOpen,
    };
}));
window.addEventListener('theme:quickview:close', ((_event) => {
    if (Alpine.store('drawer').type === 'quickview') {
        // If the quickview was opened from the cart drawer, take user back to cart drawer instead of closing the quickview
        if (Alpine.store('drawer').data?.returnToCartDrawer) {
            Alpine.store('drawer').type = 'cart';
            Alpine.store('drawer').isOpen = true;
            Alpine.store('drawer').data = null;
            return;
        }
        Alpine.store('drawer').isOpen = false;
        Alpine.store('drawer').data = null;
    }
}));
/* Header menu overlay events */
window.addEventListener('theme:menu-drawer:open', ((_event) => {
    Alpine.store('drawer').isOpen = true;
    Alpine.store('drawer').type = 'menu';
}));
window.addEventListener('theme:menu-drawer:close', ((_event) => {
    if (Alpine.store('drawer').type === 'menu') {
        Alpine.store('drawer').isOpen = false;
    }
}));
