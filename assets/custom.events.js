/*
 * Pipeline Theme
 *
 * Use this file to add custom Alpine code to the Pipeline Theme.  Keeping your custom
 * Javascript in this fill will make it easier to update Pipeline. In order
 * to use this file you will need to open layout/theme.liquid and uncomment
 * the custom.events.js script import line near the bottom of the file.
 *
 */

// Below are example event listeners.  They listen for theme events that Pipeline
// fires in order to make it easier for you to add customizations.

window.addEventListener('theme:variant:change', (event) => {
  // Fires when variant is changed in a product form
  // You might use this to write a pre-order feature or a custom swatch feature.

  const variantId = event.detail.variantId;
  const optionElement = event.target;

  console.log('theme:variant:change', {
    variantId,
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
  // Fires when variant is changed in a product form
  // You might use this to write a pre-order feature or a custom swatch feature.

  const siblingId = event.detail.siblingId;
  const productForm = event.target;

  console.log('theme:sibling:change', {
    siblingId,
    productForm,
  });

  const isFromMainProductForm = productForm.closest('.main-product');
  const isFromQuickviewProductForm = productForm.closest('.product-quickview-drawer');

  if (isFromMainProductForm) {
    // Do something for the main product form
  } else if (isFromQuickviewProductForm) {
    // Do something for the quickview product form
  }
});

window.addEventListener('theme:cart:change:success', (event) => {
  // Fires when a cart item is successfully updated
  // You might use this to update an app or a custom shipping caluclator

  // Check if the cart drawer is open
  if (Alpine.store('drawer').isOpen && Alpine.store('drawer').type === 'cart') {
    const cartChangePayload = event.detail;
    console.log('theme:cart:change:success', cartChangePayload);
  }
});

window.addEventListener('theme:collection:update', (event) => {
  // Fires when collection page products are updated from either filters or pagination
  console.log('theme:collection:update', event.detail);
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
