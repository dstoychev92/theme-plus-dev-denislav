/**
 * Alpine plugin: registers x-section-sibling-update directive. Sections with this
 * directive update when the product sibling changes (theme:sibling:change), but
 * only when they are about to enter view, on user interact, or one-by-one after
 * a timeout. Use: Alpine.bind($el, { 'x-section-sibling-update': '' })
 *
 * Sections can opt out of the default auto-update via schema class:
 * - no-sibling-autoupdate: event still fires, but section does not auto-update (e.g. handles its own)
 */

import Alpine, {Magics} from 'alpinejs';
import {yieldToMain} from '@groupthought/tradecraft-ui/utils';

const PENDING_BY_EL = new WeakMap<HTMLElement, Record<string, unknown>>();

const SIBLING_UPDATE_EVENT = 'theme:sibling-section:should-update';

/** Root margin so sections start updating before they enter the viewport. */
const INTERSECTION_ROOT_MARGIN = '300px 0px 300px 0px';

/** After this delay from the first pending mark, any section still pending is updated one-by-one with yield between. */
const DEFERRED_UPDATE_TIMEOUT_MS = 2000;

let deferredTimeoutId: ReturnType<typeof setTimeout> | null = null;

/** Events that count as "user interact" for update-on-interact. */
const INTERACT_EVENTS = ['touchstart', 'wheel', 'mouseover', 'keydown'] as const;

let intersectionObserver: IntersectionObserver | null = null;

function getObserver(): IntersectionObserver {
  if (!intersectionObserver) {
    intersectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target;
          if (!(el instanceof HTMLElement)) continue;
          runUpdate(el);
        }
      },
      {rootMargin: INTERSECTION_ROOT_MARGIN},
    );
  }
  return intersectionObserver;
}

function markPending(el: HTMLElement, detail: Record<string, unknown>): void {
  if (!detail?.url) return;
  PENDING_BY_EL.set(el, {...detail});
  getObserver().observe(el);
  scheduleDeferredRun();
}

function runUpdate(el: HTMLElement): void {
  const detail = PENDING_BY_EL.get(el);
  if (detail === undefined) return;
  PENDING_BY_EL.delete(el);
  intersectionObserver?.unobserve(el);
  el.dispatchEvent(
    new CustomEvent(SIBLING_UPDATE_EVENT, {
      detail: {...detail},
      bubbles: true,
    }),
  );
}

function isPending(el: HTMLElement): boolean {
  return PENDING_BY_EL.has(el);
}

function handleInteract(event: Event): void {
  const section = (event.target as Element).closest?.('[data-section-sibling-update]');
  if (section instanceof HTMLElement && isPending(section)) {
    runUpdate(section);
  }
}

async function runRemainingPending(): Promise<void> {
  const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-section-sibling-update]')).filter(
    isPending,
  );
  for (const el of elements) {
    runUpdate(el);
    await yieldToMain();
  }
}

function scheduleDeferredRun(): void {
  if (deferredTimeoutId != null) clearTimeout(deferredTimeoutId);
  deferredTimeoutId = setTimeout(() => {
    deferredTimeoutId = null;
    runRemainingPending();
  }, DEFERRED_UPDATE_TIMEOUT_MS);
}

function setupGlobalListeners(): void {
  INTERACT_EVENTS.forEach((type) => {
    document.addEventListener(type, handleInteract, {passive: true, capture: true});
  });
}
export function sectionSiblingUpdatePlugin(): void {
  Alpine.directive('section-sibling-update', (el) => {
    el.setAttribute('data-section-sibling-update', '');

    Alpine.bind(el, {
      '@theme:sibling:change.window'(this: Magics<any> & {$event: CustomEvent}) {
        if (!this.$sectionApi) return;
        // Only update if the "main" product form is the source of the event, this prevents updating the section when a sibling is changed from a quickview product form, featured product section, etc
        const sourceSection =
          this.$event.target instanceof Element ? this.$event.target.closest('.shopify-section') : null;

        if (!sourceSection?.classList.contains('main-product')) {
          return;
        }
        const detail = this.$event.detail;
        if (!detail || typeof detail !== 'object') return;
        markPending(el, detail as Record<string, unknown>);
      },
      [`@${SIBLING_UPDATE_EVENT}`](this: Magics<any> & {$event: CustomEvent}) {
        if (!this.$sectionApi) return;
        if (el.classList.contains('no-sibling-autoupdate')) return;
        const baseUrl = this.$event.detail?.url;
        if (!baseUrl) return;
        this.$sectionApi.update({
          waitForIdle: true,
          baseUrl,
        });
      },
    });
  });
  setupGlobalListeners();
}
