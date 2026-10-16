import Alpine from 'alpinejs';

/**
 * Track various information about the sections on the page
 */

type SectionsStore = {
  intersected: Set<string>;
  intersecting: Set<string>;
  viewing: string | null;
  viewed: Set<string>;
  isIntersecting(id: string): boolean;
  hasIntersected(id: string): boolean;
};

declare module 'alpinejs' {
  interface Stores {
    sections: SectionsStore;
  }
}

const sectionsStore: SectionsStore = {
  intersected: new Set(),
  intersecting: new Set(),
  viewing: null,
  viewed: new Set(),
  isIntersecting(id: string) {
    return this.intersecting?.has(id);
  },
  hasIntersected(id: string) {
    return this.intersected?.has(id);
  },
};

Alpine.store('sections', sectionsStore);
