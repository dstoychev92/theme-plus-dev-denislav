import {Alpine as AlpineType} from 'alpinejs';

/**
 * Wraps x-slideshow and binds currentSlideIndex to $sectionData
 * so that state survives theme editor section morphing.
 */
export default function sectionSlideshow(Alpine: AlpineType) {
  Alpine.directive('section-slideshow', ($el, {modifiers}) => {
    const sectionData = (Alpine.$data($el) as any).$sectionData;

    Alpine.bind($el, {
      [`x-slideshow${modifiers.length ? `.${modifiers.join('.')}` : ''}`]() {
        return {
          get currentSlideIndex() {
            return sectionData?.currentSlideIndex ?? 0;
          },
          set currentSlideIndex(value: number) {
            if (sectionData) sectionData.currentSlideIndex = value;
          },
        };
      },
    });
  }).before('slideshow'); // not 'bind': the root must register the x-id scope before x-slideshow:viewport calls $id
}
