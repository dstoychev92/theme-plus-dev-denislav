import {onDocumentReady} from '@theme/utils';
import Alpine, {Alpine as AlpineType} from 'alpinejs';

/**
 * Section intersection manager: tracks when .shopify-section elements are
 * considered "in view". When the user is scrolling, a section must be in the
 * middle 40% of the viewport (or fully visible) to count as intersecting. When
 * the user is not scrolling, any partially visible section counts as intersecting,
 * so content is never blank on load or when stopped with a section half on screen.
 * Updates data attributes and Alpine store, dispatches theme:section:enter /
 * theme:section:leave. Other modules (e.g. section-lazy-alpine) hook in via
 * theme:section:enter.
 */

/**
 * Configuration for an IntersectionObserver instance.
 */
type ObserverConfig = {
  rootMargin: string;
  threshold?: number | number[];
};

/**
 * Internal tracking data for a section element.
 */
type SectionEntry = {
  element: HTMLElement;
  sectionId: string;
  hasIntersected: boolean;
  hasBeenViewed: boolean;
  anyVisibleIntersecting: boolean;
  middleAreaIntersecting: boolean;
  fullyVisibleIntersecting: boolean;
};

/**
 * Root margin for the middle area observer.
 * Creates a viewport that excludes the top and bottom 30%, effectively
 * tracking when sections enter the middle 40% of the viewport.
 */
const MIDDLE_AREA_MARGIN = '-30% 0% -30% 0%';

/**
 * Root margin for the fully visible observer.
 * No margin means the entire viewport is used as the intersection root.
 */
const FULLY_VISIBLE_MARGIN = '0% 0% 0% 0%';

/**
 * Threshold for the fully visible observer.
 * A value of 1.0 means the entire section must be visible in the viewport.
 */
const FULLY_VISIBLE_THRESHOLD = 1.0;

/**
 * Threshold for the "any visible" observer.
 * A value of 0.01 means any part of the section in the viewport counts.
 */
const ANY_VISIBLE_THRESHOLD = 0.01;

const SECTION_ID_PREFIX = 'shopify-section-';

/** Debounce delay (ms) after last scroll event before treating user as "idle". */
const SCROLL_END_DELAY_MS = 150;

/**
 * Manages IntersectionObserver instances for section tracking.
 *
 * Uses three observers: any-visible (threshold 0), middle 40% of viewport, and
 * fully visible (threshold 1). When the user is scrolling, a section counts as
 * intersecting only if it is in the middle area or fully visible. When the user
 * is idle (not scrolling), any partially visible section counts as intersecting.
 * On scroll end, partially visible sections are re-evaluated and given enter
 * state so content is never blank. Leave only fires when the section is fully
 * off screen.
 */
class IntersectionObserverManager {
  private observers = new Map<string, IntersectionObserver>();
  private sections = new Map<HTMLElement, SectionEntry>();
  private isScrolling = false;

  /**
   * Gets or creates an IntersectionObserver with the given configuration.
   *
   * Observers are cached by their configuration key to avoid creating duplicate
   * observers for the same rootMargin and threshold combination.
   *
   * @param config - The observer configuration
   * @returns An IntersectionObserver instance
   */
  private getObserver(config: ObserverConfig): IntersectionObserver {
    const key = `${config.rootMargin}:${config.threshold}`;

    if (!this.observers.has(key)) {
      this.observers.set(
        key,
        new IntersectionObserver((entries) => this.handleIntersection(entries, config), {
          rootMargin: config.rootMargin,
          threshold: config.threshold,
        }),
      );
    }

    return this.observers.get(key)!;
  }

  /**
   * Handles intersection observer callbacks and updates section state.
   *
   * This method processes intersection entries from both observers (middle area
   * and fully visible) and determines the overall intersection state. A section
   * is considered intersecting if either:
   * - Any part crosses into the middle 40% of the viewport, OR
   * - The entire section is fully visible in the viewport
   *
   * When a section's intersection state changes, it updates the Alpine store and
   * dispatches custom events (`theme:section:enter` and `theme:section:leave`).
   *
   * @param entries - Array of intersection observer entries
   * @param config - The observer configuration that generated these entries
   */
  private handleIntersection(entries: IntersectionObserverEntry[], config: ObserverConfig) {
    const store = Alpine.store('sections') as any;

    for (const entry of entries) {
      const sectionEntry = this.sections.get(entry.target as HTMLElement);
      if (!sectionEntry) continue;

      const {sectionId} = sectionEntry;
      const isIntersecting = entry.isIntersecting;
      const wasIntersecting = store.intersecting.has(sectionId);

      if (config.rootMargin === MIDDLE_AREA_MARGIN) {
        sectionEntry.middleAreaIntersecting = isIntersecting;
      } else if (config.rootMargin === FULLY_VISIBLE_MARGIN && config.threshold === FULLY_VISIBLE_THRESHOLD) {
        sectionEntry.fullyVisibleIntersecting = isIntersecting;
      } else if (config.rootMargin === FULLY_VISIBLE_MARGIN && config.threshold === ANY_VISIBLE_THRESHOLD) {
        sectionEntry.anyVisibleIntersecting = isIntersecting;
      }

      // When scrolling: only middle 40% or fully visible counts. When idle: any visible counts.
      // Once intersecting, stay intersecting until the section is fully off screen.
      const isNowIntersecting =
        sectionEntry.anyVisibleIntersecting &&
        (wasIntersecting ||
          !this.isScrolling ||
          sectionEntry.middleAreaIntersecting ||
          sectionEntry.fullyVisibleIntersecting);

      if (isNowIntersecting && !wasIntersecting) {
        this.applyEnter(sectionEntry, entry.target as HTMLElement);
      } else if (!isNowIntersecting && wasIntersecting) {
        store.intersecting.delete(sectionId);
        entry.target.dispatchEvent(
          new CustomEvent('theme:section:leave', {
            detail: {sectionId},
            bubbles: true,
            composed: true,
            cancelable: true,
          }),
        );
        entry.target.setAttribute('data-is-intersecting', 'false');
      } else if (window.Shopify?.designMode && isNowIntersecting && wasIntersecting) {
        entry.target.setAttribute('data-is-intersecting', 'true');
        entry.target.setAttribute('data-has-intersected', 'true');
        sectionEntry.hasIntersected = true;
      }
    }
  }

  /**
   * Applies "enter" state: add to store, dispatch event, set attributes.
   * Used by handleIntersection and applyIdlePass.
   */
  private applyEnter(sectionEntry: SectionEntry, element: HTMLElement) {
    const store = Alpine.store('sections') as any;
    const {sectionId} = sectionEntry;
    store.intersecting.add(sectionId);
    element.dispatchEvent(
      new CustomEvent('theme:section:enter', {
        detail: {sectionId},
        bubbles: true,
        composed: true,
        cancelable: true,
      }),
    );
    element.setAttribute('data-is-intersecting', 'true');
    if (!sectionEntry.hasIntersected) {
      sectionEntry.hasIntersected = true;
      store.intersected.add(sectionId);
      element.setAttribute('data-has-intersected', 'true');
    }
  }

  /**
   * Called when scroll ends (user idle). Sections that are any-visible but were
   * not considered intersecting during scroll now become intersecting.
   */
  onScrollEnd() {
    const store = Alpine.store('sections') as any;
    for (const sectionEntry of this.sections.values()) {
      if (sectionEntry.anyVisibleIntersecting && !store.intersecting.has(sectionEntry.sectionId)) {
        this.applyEnter(sectionEntry, sectionEntry.element);
      }
    }
  }

  /**
   * Updates scroll state. When set to false, onScrollEnd() is called so
   * partially visible sections become intersecting.
   */
  setScrolling(scrolling: boolean) {
    this.isScrolling = scrolling;
    if (!scrolling) {
      this.onScrollEnd();
    }
  }

  /**
   * Starts observing a section element for intersection changes.
   *
   * Sets up three IntersectionObserver instances: any-visible (any part in viewport),
   * middle 40% of viewport, and fully visible. Intersection is determined by scroll
   * state (see class JSDoc).
   *
   * @param element - The section element to observe
   * @param sectionId - The unique identifier for this section
   *
   * @example
   * ```typescript
   * manager.observe(document.querySelector('#section-1'), 'section-1');
   * ```
   */
  observe(element: HTMLElement, sectionId: string) {
    if (this.sections.has(element)) return;

    const entry: SectionEntry = {
      element,
      sectionId,
      hasIntersected: false,
      hasBeenViewed: false,
      anyVisibleIntersecting: false,
      middleAreaIntersecting: false,
      fullyVisibleIntersecting: false,
    };

    this.sections.set(element, entry);

    // Any-visible observer (any part of section in viewport)
    const anyVisibleObserver = this.getObserver({
      rootMargin: FULLY_VISIBLE_MARGIN,
      threshold: ANY_VISIBLE_THRESHOLD,
    });
    anyVisibleObserver.observe(element);

    // Middle area observer (any part crosses into middle 40% of viewport)
    const middleAreaObserver = this.getObserver({
      rootMargin: MIDDLE_AREA_MARGIN,
      threshold: 0.0,
    });
    middleAreaObserver.observe(element);

    // Fully visible observer (entire section visible in viewport)
    const fullyVisibleObserver = this.getObserver({
      rootMargin: FULLY_VISIBLE_MARGIN,
      threshold: FULLY_VISIBLE_THRESHOLD,
    });
    fullyVisibleObserver.observe(element);
  }

  /**
   * Stops observing a section element.
   *
   * Removes the element from all observers and cleans up internal tracking data.
   * This should be called when a section is removed from the DOM to prevent
   * memory leaks.
   *
   * @param element - The section element to stop observing
   */
  unobserve(element: HTMLElement) {
    if (!this.sections.has(element)) return;

    // Unobserve from all observers
    for (const observer of this.observers.values()) {
      observer.unobserve(element);
    }

    this.sections.delete(element);
  }

  /**
   * Disconnects all observers and clears all tracking data.
   *
   * This method is called on page unload to clean up resources. All observers
   * are disconnected and internal maps are cleared.
   */
  disconnect() {
    for (const observer of this.observers.values()) {
      observer.disconnect();
    }
    this.observers.clear();
    this.sections.clear();
  }
}

function getSectionId(element: Element): string | null {
  const id = element.id;
  if (!id || !id.startsWith(SECTION_ID_PREFIX)) return null;
  return id.slice(SECTION_ID_PREFIX.length) || null;
}

export default function sectionIntersectionManager(Alpine: AlpineType) {
  onDocumentReady(() => {
    const manager = new IntersectionObserverManager();
    let scrollEndTimer: ReturnType<typeof setTimeout> | null = null;

    function observeSection(element: Element): void {
      const sectionId = getSectionId(element);
      if (sectionId) {
        manager.observe(element as HTMLElement, sectionId);
      }
    }

    window.addEventListener(
      'scroll',
      () => {
        manager.setScrolling(true);
        if (scrollEndTimer !== null) clearTimeout(scrollEndTimer);
        scrollEndTimer = setTimeout(() => {
          scrollEndTimer = null;
          manager.setScrolling(false);
        }, SCROLL_END_DELAY_MS);
      },
      {passive: true},
    );

    // Register all existing .shopify-section with the intersection manager
    document.querySelectorAll('.shopify-section').forEach(observeSection);

    // Watch for sections added/removed (e.g. theme editor) and observe/unobserve
    const mutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof Element && node.classList.contains('shopify-section')) {
            observeSection(node);
          }
        });
        mutation.removedNodes.forEach((node) => {
          if (node instanceof HTMLElement && node.classList.contains('shopify-section')) {
            manager.unobserve(node);
          }
        });
      }
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}
