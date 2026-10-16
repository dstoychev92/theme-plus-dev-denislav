/*
 * Pipeline Theme
 *
 * Use this file to add custom Javascript events to the Pipeline Theme.  Keeping your custom
 * Javascript in this fill will make it easier to update Pipeline. In order
 * to use this file you will need to open layout/theme.liquid and uncomment
 * the custom.js script import line near the bottom of the file.
 *
 */

import Alpine from 'alpinejs';

/*
 * Custom alpine.js code (see http://alpinejs.dev for more information)
 */

// Note: custom directives, magic properties, and data components must be registered
// in the `alpine:init` event listener in order form them to registered when Alpine is initialized.
document.addEventListener('alpine:init', () => {
  // Create a data component to store state on an element
  Alpine.data('myFancyDataComponent', () => {
    return {
      isCool: true,
    };
  });

  // Create a custom directive to add behaviour to an element
  Alpine.directive('my-fancy-directive', ($el, {expression, modifiers, evaluate}) => {
    // Do cool stuff
    console.log('my-fancy-directive', $el);
  });

  // Create a global magic property or function that can be called from e.g. `x-init` to do something
  Alpine.magic('myFancyMagicFunction', ($el) => {
    // Do cool stuff
    return () => {
      console.log('Fancy magic function was called', $el);
    };
  });

  // Create a store to add global state to the theme
  Alpine.store('myFancyStore', {
    isCool: true,
  });
});
