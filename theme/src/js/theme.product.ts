/**
 * Product-page-only bundle. Registers the sectionSiblingUpdate Alpine plugin and
 * binds it to all main sections except the product section (.main-product).
 */

import Alpine from 'alpinejs';
import {sectionSiblingUpdatePlugin} from './directives/x-section-sibling-update';

document.addEventListener('alpine:init', () => {
  Alpine.plugin(sectionSiblingUpdatePlugin);
  document.querySelectorAll('main > .shopify-section:not(.main-product)').forEach(($el) => {
    Alpine.bind($el as HTMLElement, {'x-section-sibling-update': ''});
  });
});
