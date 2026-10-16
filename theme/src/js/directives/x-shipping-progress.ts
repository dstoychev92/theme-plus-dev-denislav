import Alpine, {Magics} from 'alpinejs';

type ShippingProgressComponent = Magics<any> & {
  __shippingProgress_observer?: MutationObserver;
  __shippingProgress_apply: () => void;
  __shippingProgress_watch: () => void;
};

/** Change only display since messages may carry other inline styles. */
function setHidden(el: Element | null, hidden: boolean): void {
  if (!(el instanceof HTMLElement)) return;

  const display = hidden ? 'none' : '';
  if (el.style.display !== display) el.style.display = display;
}

/**
 * Convert the Liquid threshold with Shopify.currency.rate.
 *
 * Liquid has no exchange rate, so it compares the cart with the store-currency threshold.
 * Cart morphs restore those Liquid values after every update. The observer converts them
 * again and disconnects during its own writes.
 *
 * Usage:
 *   <div x-shipping-progress data-limit="100" data-cart-total="4500">
 *     <p data-shipping-progress-message>… <span data-shipping-amount>$55</span></p>
 *     <div data-shipping-success-message>…</div>
 *     <span data-shipping-bar></span>
 *   </div>
 */
Alpine.directive('shipping-progress', ($el) => {
  Alpine.bind($el, {
    'x-data'(this: Magics<any>) {
      return {
        __shippingProgress_observer: undefined as MutationObserver | undefined,

        init(this: ShippingProgressComponent) {
          this.__shippingProgress_observer = new MutationObserver(() => {
            this.__shippingProgress_apply();
          });

          this.__shippingProgress_apply();
        },

        destroy(this: ShippingProgressComponent) {
          this.__shippingProgress_observer?.disconnect();
        },

        // Cart morphs replace these data attributes
        __shippingProgress_apply(this: ShippingProgressComponent) {
          this.__shippingProgress_observer?.disconnect();

          const limit = Number($el.dataset.limit);
          const cartTotal = Number($el.dataset.cartTotal);

          if (Number.isFinite(limit) && limit > 0 && Number.isFinite(cartTotal)) {
            const threshold = Math.round(this.$convertCurrency(limit * 100));
            const remaining = Math.max(0, threshold - cartTotal);
            const percent = threshold > 0 ? Math.min(100, (cartTotal / threshold) * 100) : 100;

            const bar = $el.querySelector<HTMLElement>('[data-shipping-bar]');
            bar?.style.setProperty('--limit-percent', `${percent}%`);

            const amount = $el.querySelector('[data-shipping-amount]');
            const amountText = this.$formatCurrency(remaining);
            if (amount && amount.textContent !== amountText) {
              amount.textContent = amountText;
            }

            setHidden($el.querySelector('[data-shipping-progress-message]'), remaining === 0);
            setHidden($el.querySelector('[data-shipping-success-message]'), remaining > 0);
          }

          this.__shippingProgress_watch();
        },

        __shippingProgress_watch(this: ShippingProgressComponent) {
          this.__shippingProgress_observer?.observe($el, {
            attributes: true,
            characterData: true,
            childList: true,
            subtree: true,
          });
        },
      };
    },
  });
}).before('bind');
