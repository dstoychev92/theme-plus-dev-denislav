import {Alpine as AlpineType} from 'alpinejs';
import {CartViewEvent, CollectionViewEvent, ProductSelectEvent, ProductViewEvent} from '@shopify/events';
import type {ThemeEventPayload} from '@groupthought/tradecraft-ui/types';
import {dispatchCollectionUpdate, dispatchSearchUpdate, yieldToMain} from '@groupthought/tradecraft-ui/utils';

type ProductSelectInput = {
  /** Omit to read it from the closest data-product-select-product ancestor. */
  product?: {id: string | number; title: string; handle: string};
  selectedOptions: {name: string; value: string}[];
  /** Compact variant for the promise resolution. Omit when no variant matches the selection. */
  variant?: {
    id: string | number;
    title: string;
    availableForSale: boolean;
    price: {amount: string; currencyCode: string};
  } | null;
  /** Everything else rides in the event's theme-specific detail. */
  [key: string]: unknown;
};

export type StandardEventsMagic = {
  productSelect(payload: ProductSelectInput): void;
  collectionUpdate(payload: {collectionId?: string; handle: string; productsCount: number}): void;
  searchUpdate(payload: {query: string; totalCount: number}): void;
};

export type ViewEventMagic = {
  dispatch(): void;
};

declare module 'alpinejs' {
  interface Magics<T> {
    $standardEvents: StandardEventsMagic;
    $viewEvent: ViewEventMagic;
  }
}

/**
 * Dispatches the standard storefront events
 * (https://shopify.dev/docs/api/storefront-events-and-actions) from Liquid.
 *
 * A magic instead of $dispatch because $dispatch can only build CustomEvents,
 * and the standard events are class instances with payload fields on the event
 * itself, not under detail.
 *
 * Events dispatch from $el and bubble, so listeners can scope by source with
 * event.target.closest('.shopify-section').
 *
 * productSelect reads the product from the closest data-product-select-product
 * ancestor, so the option group carries it once instead of every option value.
 *
 * @example
 * ```liquid
 * <div data-product-select-product="{{ product_json | escape }}">
 *   <select @change="$standardEvents.productSelect({
 *     selectedOptions: [{ name: 'Size', value: 'M' }],
 *     variantId: {{ value.variant.id }},
 *     sectionId: '{{ section.id }}',
 *   })">
 * </div>
 * ```
 */
function readProductFromAncestor($el: Element) {
  const raw = $el.closest('[data-product-select-product]')?.getAttribute('data-product-select-product');

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as {id: string | number; title: string; handle: string};
  } catch (error) {
    console.error('[$standardEvents] Could not parse data-product-select-product:', error);
    return null;
  }
}

function parseViewEventPayload(rawPayload: string | null | undefined) {
  if (!rawPayload) {
    return null;
  }

  try {
    return JSON.parse(rawPayload);
  } catch (error) {
    console.error('[x-view-event] Could not parse data-view-event-payload:', error);
    return null;
  }
}

/**
 * Sends the standard view event described by an element's
 * data-view-event-payload. The payload's own keys decide which event fires.
 */
async function dispatchViewEventFor($el: Element, context?: 'dialog') {
  await yieldToMain();
  if (!$el.isConnected) return;

  const payload = parseViewEventPayload($el.getAttribute('data-view-event-payload'));

  if (payload) {
    dispatchViewPayload($el, payload, context);
  }
}

function dispatchViewPayload($el: Element, payload: any, context?: 'dialog') {
  if ('collection' in payload) {
    $el.dispatchEvent(new CollectionViewEvent(payload));
  } else if ('product' in payload) {
    // The filter emits context: null when no context argument was given
    $el.dispatchEvent(new ProductViewEvent({...payload, context: payload.context ?? context ?? 'page'}));
  } else if ('cart' in payload) {
    $el.dispatchEvent(
      new CartViewEvent({...payload, context: payload.context ?? (context === 'dialog' ? 'dialog' : 'page')}),
    );
  }
}

/**
 * Announces the product view again when an update of the enclosing section renders
 * another product. Render regions leave this element and its payload in place on a
 * sibling or combined-listing switch, so the new payload comes from the response.
 * A variant change keeps the product id and announces nothing.
 *
 * The counterpart is the first bare x-view-event element in the response. Keep one
 * bare x-view-event element in each section.
 */
function announceProductSwitches($el: Element, productId: string | number) {
  const onSectionUpdate = async (event: Event) => {
    const {sectionId, html} = (event as CustomEvent<ThemeEventPayload['theme:section:update']>).detail;

    if (!html || sectionId !== $el.closest('[x-section-api]')?.getAttribute('x-section-api')) {
      return;
    }

    // Parse after the update paints since the response holds the whole section
    await yieldToMain();
    if (!$el.isConnected) return;

    const response = new DOMParser().parseFromString(html, 'text/html');
    const rawPayload = response.querySelector('[x-view-event]')?.getAttribute('data-view-event-payload');
    const payload = parseViewEventPayload(rawPayload);

    if (!rawPayload || payload?.product?.id == null || payload.product.id === productId) {
      return;
    }

    productId = payload.product.id;
    $el.setAttribute('data-view-event-payload', rawPayload);
    dispatchViewPayload($el, payload);
  };

  window.addEventListener('theme:section:update', onSectionUpdate);
  return () => window.removeEventListener('theme:section:update', onSectionUpdate);
}

export default function (Alpine: AlpineType) {
  // Dialogs whose view has already been announced for the current opening
  const announcedDialogs = new WeakSet<Element>();
  const resetListeners = new WeakSet<Element>();

  // One observer for every intersect-triggered element, so a collection page of
  // product cards costs one observer instead of one per card
  const viewEventCallbacks = new WeakMap<Element, () => void>();
  let intersectObserver: IntersectionObserver | null = null;

  const observeForView = ($el: Element, onIntersect: () => void) => {
    intersectObserver ??= new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            intersectObserver?.unobserve(entry.target);
            viewEventCallbacks.get(entry.target)?.();
          }
        }
      },
      {threshold: 0.5},
    );

    viewEventCallbacks.set($el, onIntersect);
    intersectObserver.observe($el);

    return () => {
      intersectObserver?.unobserve($el);
      viewEventCallbacks.delete($el);
    };
  };

  /**
   * Dispatches a standard view event (shopify:product:view, shopify:collection:view,
   * or shopify:cart:view) from the element it sits on. The payload comes from the
   * standard_event_data Liquid filter in the data-view-event-payload attribute; the
   * payload's own keys decide which event fires.
   *
   * The behavior sits on the theme's existing elements instead of a wrapper element
   * so that layouts and carousels that read direct children stay untouched.
   *
   * Modifiers pick the trigger:
   * - x-view-event - dispatch when Alpine initializes the element, and again when an
   *   update of the enclosing section renders another product
   * - x-view-event.intersect - dispatch when at least half the element scrolls into view
   * - x-view-event.dialog - dispatch each time the closest <dialog> opens
   * - x-view-event.manual - dispatch only when something calls $viewEvent.dispatch()
   *
   * Use .manual when the payload arrives after the moment of viewing. The cart
   * drawer opens before its contents load, so announcing at open time reports the
   * cart as it was - it waits for the refresh and then dispatches.
   *
   * @example
   * ```liquid
   * <div x-view-event.intersect data-view-event-payload="{{ product | standard_event_data: 'view' | escape }}">
   * ```
   */
  Alpine.directive('view-event', ($el, {modifiers}, {cleanup}) => {
    const dispatchViewEvent = (context?: 'dialog') => dispatchViewEventFor($el, context);

    if (modifiers.includes('manual')) {
      // Nothing to wire up: $viewEvent.dispatch() finds this element by attribute
      return;
    } else if (modifiers.includes('intersect')) {
      cleanup(observeForView($el, dispatchViewEvent));
    } else if (modifiers.includes('dialog')) {
      const dialog = $el.closest('dialog');

      if (!dialog) {
        return;
      }

      // <dialog> fires a toggle event on open and close
      const onToggle = () => {
        if (dialog.open) {
          dispatchViewEvent('dialog');
        }
      };

      if (dialog.open) {
        dispatchViewEvent('dialog');
      }

      dialog.addEventListener('toggle', onToggle);
      cleanup(() => dialog.removeEventListener('toggle', onToggle));
    } else {
      dispatchViewEvent();

      const productId = parseViewEventPayload($el.getAttribute('data-view-event-payload'))?.product?.id;

      if (productId != null) {
        cleanup(announceProductSwitches($el, productId));
      }
    }
  });

  /**
   * Sends the view announcement for an x-view-event.manual element inside this
   * subtree. The cart drawer calls it once its contents have finished loading.
   *
   * @example
   * ```liquid
   * <div x-init="$watch('$dialog.isOpen', async () => { await refresh(); $viewEvent.dispatch() })">
   * ```
   */
  Alpine.magic('viewEvent', ($el) => ({
    dispatch() {
      // Read the element straight from the DOM rather than a registry: a section
      // update swaps this element in, and Alpine initializes the new one a tick
      // after the update resolves - which is exactly when this is called.
      const target = $el.querySelector('[x-view-event\\.manual]') ?? $el.closest('[x-view-event\\.manual]');

      if (!target) {
        console.warn('[$viewEvent] No x-view-event.manual element found to dispatch from');
        return;
      }

      // One announcement per viewing: a section update can re-run whatever calls
      // this, and the shopper has not looked at the cart twice
      const dialog = target.closest('dialog');

      if (dialog) {
        if (announcedDialogs.has(dialog)) {
          return;
        }

        announcedDialogs.add(dialog);

        // Clear it when the drawer closes, so the next opening announces again.
        // toggle fires on open and close; close alone does not fire for every
        // way this theme dismisses a drawer.
        if (!resetListeners.has(dialog)) {
          resetListeners.add(dialog);
          dialog.addEventListener('toggle', () => {
            if (!dialog.open) {
              announcedDialogs.delete(dialog);
            }
          });
        }
      }

      dispatchViewEventFor(target, 'dialog');
    },
  }));

  Alpine.magic('standardEvents', ($el) => {
    return {
      productSelect({product, selectedOptions, variant, ...detail}: ProductSelectInput) {
        // The product is rendered once on the option group, not on every option
        // value, so read it from there unless the caller passed its own
        const resolvedProduct = product ?? readProductFromAncestor($el);

        if (!resolvedProduct) {
          console.error('[$standardEvents] No product payload found for productSelect');
          return;
        }

        const deferred = ProductSelectEvent.createPromise();

        $el.dispatchEvent(
          new ProductSelectEvent({
            product: resolvedProduct,
            selectedOptions,
            promise: deferred.promise,
            detail,
          }),
        );

        // The theme performs no fetch on variant selection - media and price swaps
        // are server-rendered up front - so the deferred settles immediately
        deferred.resolve({variant: variant ? {...variant, selectedOptions} : null, detail});
      },

      collectionUpdate(payload: {collectionId?: string; handle: string; productsCount: number}) {
        dispatchCollectionUpdate($el, payload);
      },

      searchUpdate(payload: {query: string; totalCount: number}) {
        dispatchSearchUpdate($el, payload);
      },
    } satisfies StandardEventsMagic;
  });
}
