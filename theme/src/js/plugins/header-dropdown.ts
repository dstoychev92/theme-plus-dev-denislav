import {Alpine as AlpineType, DirectiveData} from 'alpinejs';

/**
 * The header's dropdown popup: a panel of links that floats under a top-level nav item.
 * Registers with the headerMenu store as a 'dropdown' popup, so open/close state, hover
 * delays, and keyboard handling all come from the header-menu plugin.
 *
 * Directives:
 * - x-header-dropdown="menuId" - The root. Floats under the active nav item (bottom-start,
 *   matching its width, flip and shift when out of room). Position updates only run while
 *   the dropdown is visible since the reference element changes with the active nav item
 * - x-header-dropdown:panel - Shown while this dropdown is the active popup ($headerMenuPopup.isVisible)
 */
export default function headerDropdown(Alpine: AlpineType) {
  Alpine.directive('header-dropdown', ($el: HTMLElement, data: DirectiveData) => {
    const {value, expression} = data;

    if (value === 'panel') {
      Alpine.bind($el, {
        'x-show': '$headerMenuPopup.isVisible',
      });
    } else if (value == null) {
      const rootMenuId = expression;
      if (rootMenuId == null || rootMenuId === '') {
        throw new Error('x-header-dropdown requires a menu id (e.g. x-header-dropdown="{{ menu_id }}")');
      }

      Alpine.bind($el, {
        'x-header-menu-popup.dropdown': rootMenuId,
        'x-float.css.bottom-start.match.flip.shift.update'() {
          return {
            autoUpdate: false,
            initialUpdate: false,
          };
        },
        'x-effect'() {
          if ((this as any).$headerMenuPopup.isVisible) {
            (this as any).$float.referenceEl = (this as any).$store.headerMenu.activeFloatTargetEl;
            (this as any).$float.enableAutoUpdate();
          } else {
            (this as any).$float.disableAutoUpdate();
          }
        },
      });
    } else {
      throw new Error(`Unknown directive: x-header-dropdown:${String(value)}`);
    }
  }).before('bind');
}
