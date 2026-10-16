import Alpine from 'alpinejs';
import {yieldToMain} from '@groupthought/tradecraft-ui/utils';
// Shopify serves this module from their CDN and the import map points the bare
// specifier at it, so it is never installed or bundled - see
// packages/vendor/shopify-events for the types-and-tests stand-in copy
import {PageViewEvent, type CartLinesUpdateEvent} from '@shopify/events';

/**
 * Global theme event handler for the theme.
 */

/* Standard page view event */

// https://shopify.dev/docs/api/storefront-events-and-actions
async function dispatchPageView() {
  await yieldToMain();
  const main = document.querySelector<HTMLElement>('main[data-template]');

  document.dispatchEvent(
    new PageViewEvent({
      page: {
        template: main?.dataset.template ?? '',
        title: document.title,
        url: window.location.href,
      },
    }),
  );
}

// This module loads in <head>, before <main> exists
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', dispatchPageView, {once: true});
} else {
  dispatchPageView();
}

/* Cart events */

// Post-add routing. shopify:cart:lines-update fires before the add request, so
// the source element is read synchronously and the UX runs when the promise
// resolves (https://shopify.dev/docs/api/storefront-events-and-actions).
window.addEventListener('shopify:cart:lines-update', ((event: CartLinesUpdateEvent) => {
  if (event.action !== 'add') {
    return;
  }

  // event.target is the dispatching form. The quickview drawer check is id-based
  // since the menu and pickup drawers are also <dialog> elements.
  const isFromQuickview = event.target instanceof Element && !!event.target.closest('#product-quickview-drawer');

  event.promise
    ?.then(({detail}) => {
      if (detail?.didError) {
        return;
      }

      // If the cart action was triggered from the quickview drawer, open the cart drawer
      if (isFromQuickview && Alpine.store('drawer').isOpen) {
        window.dispatchEvent(new CustomEvent('theme:cart-drawer:open', {}));
        return;
      }

      // If any other drawer is already open, do nothing
      if (Alpine.store('drawer').isOpen) {
        return;
      }

      // Take different actions depending on cart action theme setting
      switch (window.theme.cart?.action) {
        case 'show_notification': {
          // The notification renders the added product's page, so it needs that
          // URL. App-driven adds (Shopify.actions.updateCart) carry no item, so
          // they open the drawer instead of rendering an empty notification.
          const addedItemUrl = (detail?.item as {url?: string} | undefined)?.url;

          window.dispatchEvent(
            addedItemUrl
              ? new CustomEvent('theme:cart-notification:show', {detail: {url: addedItemUrl}})
              : new CustomEvent('theme:cart-drawer:open', {}),
          );
          break;
        }
        case 'show_drawer':
          window.dispatchEvent(new CustomEvent('theme:cart-drawer:open', {}));
          break;

        case 'navigate_page':
          // Navigate to cart page
          window.location.assign(window.theme.routes.cart);
          break;
      }
    })
    .catch((error) => {
      if ((error as Error)?.name !== 'AbortError') {
        console.warn('[theme.events] Cart lines-update promise rejected:', error);
      }
    });
}) as EventListener);

/* Cart overlay events */

window.addEventListener('theme:cart-drawer:open', ((_event: CustomEvent) => {
  Alpine.store('drawer').type = 'cart';
  Alpine.store('drawer').isOpen = true;
}) as EventListener);

window.addEventListener('theme:cart-drawer:close', ((_event: CustomEvent) => {
  if (Alpine.store('drawer').type === 'cart') {
    Alpine.store('drawer').isOpen = false;
  }
}) as EventListener);

/* Product pickup drawer events */

window.addEventListener('theme:pickup:open', ((event: CustomEvent) => {
  Alpine.store('drawer').type = 'pickup';
  Alpine.store('drawer').isOpen = true;
  Alpine.store('drawer').data = {
    url: event.detail!.url,
  };
}) as EventListener);

window.addEventListener('theme:pickup:close', ((_event: CustomEvent) => {
  if (Alpine.store('drawer').type === 'pickup') {
    Alpine.store('drawer').isOpen = false;
    Alpine.store('drawer').data = null;
  }
}) as EventListener);

/* Quickview overlay events */

window.addEventListener('theme:quickview:open', ((event: CustomEvent) => {
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
}) as EventListener);

window.addEventListener('theme:quickview:close', ((_event: CustomEvent) => {
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
}) as EventListener);

/* Header menu overlay events */

window.addEventListener('theme:menu-drawer:open', ((_event: CustomEvent) => {
  Alpine.store('drawer').isOpen = true;
  Alpine.store('drawer').type = 'menu';
}) as EventListener);

window.addEventListener('theme:menu-drawer:close', ((_event: CustomEvent) => {
  if (Alpine.store('drawer').type === 'menu') {
    Alpine.store('drawer').isOpen = false;
  }
}) as EventListener);

/* Standard storefront actions */

// Wires Shopify.actions (injected into <head> through content_for_header) to
// this theme, so apps can read, change, and show the cart without knowing how
// the theme renders it.
let standardActionsConfigured = false;

function configureStandardActions() {
  const actions = window.Shopify?.actions;

  if (!actions || standardActionsConfigured) {
    return;
  }

  standardActionsConfigured = true;

  // App-initiated cart mutations dispatch their events from document. Every
  // theme listener is window-level, so bubbling reaches them all.
  actions.updateCart.configure({eventTarget: () => document});

  actions.openCart.configure({
    async handler() {
      const drawerSection = document.querySelector('.section-cart-drawer');
      const isCartPage = window.location.pathname === window.theme.routes.cart;

      // Same rules as the header cart button since the merchant can turn the drawer off
      if (drawerSection && window.theme.cart?.buttonAction === 'show_drawer' && !isCartPage) {
        window.dispatchEvent(new CustomEvent('theme:cart-drawer:open', {}));
      } else {
        window.location.assign(window.theme.routes.cart);
      }
    },
  });
}

// The actions bundle loads from content_for_header, after this module. Module
// scripts finish before DOMContentLoaded, so waiting for it covers the usual
// order; the load listener catches a bundle that arrives later still.
if (window.Shopify?.actions) {
  configureStandardActions();
} else {
  document.addEventListener('DOMContentLoaded', configureStandardActions, {once: true});
  window.addEventListener('load', configureStandardActions, {once: true});
}
