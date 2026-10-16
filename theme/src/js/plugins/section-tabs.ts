import {Alpine as AlpineType} from 'alpinejs';

/**
 * Wraps x-tabs and binds selectedIndex to $sectionData
 * so that state survives theme editor section morphing.
 */
export default function sectionTabs(Alpine: AlpineType) {
  Alpine.directive('section-tabs', ($el, {modifiers}) => {
    const sectionData = (Alpine.$data($el) as any).$sectionData;

    Alpine.bind($el, {
      [`x-tabs${modifiers.length ? `.${modifiers.join('.')}` : ''}`]() {
        return {
          get selectedIndex() {
            return sectionData?.selectedIndex ?? 0;
          },
          set selectedIndex(value: number) {
            if (sectionData) sectionData.selectedIndex = value;
          },
        };
      },
    });
  }).before('bind');
}
