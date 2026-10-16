/*
 * Analog Theme
 *
 * Use this file to listen for the theme's Javascript events. Keeping your custom
 * Javascript in this file makes it easier to update Analog. To use this file, open
 * snippets/head-scripts.liquid and uncomment the custom.events.js script line.
 *
 * Commerce events use Shopify's standard storefront events (names prefixed
 * "shopify:"). Theme UI events keep the "theme:" prefix. The full list is in
 * the theme docs, and the reference is at
 * https://shopify.dev/docs/api/storefront-events-and-actions
 *
 * Migrating from the old theme:* commerce events? Each block below names the
 * old event it replaces.
 */

// Below are example event listeners. They listen for events that Analog
// fires in order to make it easier for you to add customizations.

window.addEventListener('shopify:product:select', (event) => {
  // Fires when a variant is selected in a product form.
  // Replaces theme:variant:change - the theme's extra data moved to event.detail.
  // You might use this to write a pre-order feature or a custom swatch feature.

  // The standard payload sits on the event itself
  const product = event.product; // { id, title, handle }
  const selectedOptions = event.selectedOptions; // [{ name, value }]

  // Analog adds its own data under event.detail
  const variantId = event.detail.variantId;
  const sectionId = event.detail.sectionId;

  // A page can hold several product sections, so check the event came from the
  // section you expect
  const optionElement = event.target;
  const sourceSection = optionElement.closest('.shopify-section');
  const sourceSectionId = sourceSection?.id?.replace('shopify-section-', '');

  if (sectionId !== sourceSectionId) return;

  console.log('shopify:product:select', {
    product,
    selectedOptions,
    variantId,
    sectionId,
    optionElement,
  });

  const isFromMainProductForm = optionElement.closest('.main-product');
  const isFromQuickviewProductForm = optionElement.closest('.product-quickview-drawer');

  if (isFromMainProductForm) {
    // Do something for the main product form
  } else if (isFromQuickviewProductForm) {
    // Do something for the quickview product form
  }
});

window.addEventListener('theme:sibling:change', (event) => {
  // Fires when a sibling product is selected in a product form (grouped variants).
  // Siblings are an Analog feature with no standard event, so the theme: name stays.

  const siblingId = event.detail.siblingId;
  const sectionId = event.detail.sectionId;
  const productForm = event.target;
  const sourceSection = productForm.closest('.shopify-section');
  const sourceSectionId = sourceSection?.id?.replace('shopify-section-', '');

  if (sectionId !== sourceSectionId) return;

  console.log('theme:sibling:change', {
    siblingId,
    sectionId,
    productForm,
  });
});

window.addEventListener('shopify:cart:lines-update', async (event) => {
  // Fires when a product form adds an item, or a cart line changes quantity or
  // is removed. Replaces theme:cart:add:success, theme:cart:change:success,
  // and theme:cart:update:success.
  //
  // The event fires when the request STARTS. event.action says what is
  // happening ('add', 'update', or 'remove') and event.lines says to what.
  // Await event.promise for the result.

  console.log('shopify:cart:lines-update', event.action, event.lines);

  const {cart, detail} = await event.promise;

  // The request can fail - the promise still resolves so you always get here
  if (detail?.didError) return;

  // cart is the cart after the change: { totalQuantity, cost, lines, ... }
  // detail.item is the added line item (add only), with its url
  console.log('cart now holds', cart?.totalQuantity, 'items');

  // Check if the cart drawer is open
  if (Alpine.store('drawer').isOpen && Alpine.store('drawer').type === 'cart') {
    console.log('cart drawer is open');
  }
});

window.addEventListener('shopify:cart:error', (event) => {
  // Fires when a cart request fails, for example out of stock.
  // Replaces theme:cart:add:error, theme:cart:change:error, and theme:cart:update:error.

  console.log('shopify:cart:error', event.error, event.detail);
});

window.addEventListener('shopify:collection:update', (event) => {
  // Fires when collection page products are updated from either filters or
  // pagination. Replaces theme:collection:update.

  console.log('shopify:collection:update', event.collection, event.productFilters, event.sortKey);
});

window.addEventListener('shopify:product:view', (event) => {
  // Fires when the main product renders, a product card scrolls into view, or
  // the quickview opens. event.context says which: 'page', 'collection',
  // 'search', 'recommendation', or 'dialog'.

  console.log('shopify:product:view', event.context, event.product);
});

window.addEventListener('theme:section:enter', (event) => {
  // Fires when a section has entered the viewport
  // You might use this to load images or data, or trigger an "enter" animation for a section

  const sectionId = event.detail.sectionId;
  const section = event.target;

  if (sectionId === 'my-section') {
    console.log('my-section has entered the viewport', section);
  }
});

window.addEventListener('theme:section:leave', (event) => {
  // Fires when a section has left the viewport
  // You might use this to trigger a "leave" animation for a section

  const sectionId = event.detail.sectionId;
  const section = event.target;

  if (sectionId === 'my-section') {
    console.log('my-section has left the viewport', section);
  }
});

// To CHANGE the cart from custom code, use Shopify's standard actions instead
// of calling /cart/add.js yourself - the theme's drawer, icon, and cart
// sections all react on their own:
//
//   await Shopify.actions.updateCart({ lines: [{ merchandiseId: 12345, quantity: 1 }] });
//   await Shopify.actions.openCart();
