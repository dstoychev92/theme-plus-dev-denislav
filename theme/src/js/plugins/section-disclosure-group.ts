import {Alpine as AlpineType} from 'alpinejs';

/**
 * Wraps x-disclosure-group and binds expandedIndex/expandedIndices to $sectionData
 * so that state survives theme editor section morphing.
 */
export default function sectionDisclosureGroup(Alpine: AlpineType) {
  Alpine.directive('section-disclosure-group', ($el, {modifiers}) => {
    const sectionData = (Alpine.$data($el) as any).$sectionData;
    const isMultiple = modifiers.includes('multiple');

    Alpine.bind($el, {
      [`x-disclosure-group${modifiers.length ? `.${modifiers.join('.')}` : ''}`]() {
        if (isMultiple) {
          return {
            get expandedIndices() {
              return sectionData?.expandedIndices || new Set([]);
            },
            set expandedIndices(value: Set<number>) {
              if (sectionData) sectionData.expandedIndices = value;
            },
          };
        }

        return {
          get expandedIndex() {
            return sectionData?.expandedIndex;
          },
          set expandedIndex(value: number) {
            if (sectionData) sectionData.expandedIndex = value;
          },
        };
      },
    });
  }).before('bind');
}
