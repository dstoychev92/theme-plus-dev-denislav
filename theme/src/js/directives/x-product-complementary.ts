import Alpine, {AlpineComponent, Magics} from 'alpinejs';

type ProductComplementaryData = AlpineComponent<{
  productId: string;
  hasEnteredView: boolean;
  loadRecommendations: () => Promise<void>;
  syncProductId: () => void;
}>;

function readProductId($el: HTMLElement): string {
  const productId = $el.dataset.productId;

  if (!productId) {
    throw new Error('x-product-complementary needs data-product-id on its element');
  }

  return productId;
}

/**
 * Lives on a nested x-section-api controller that is its own render region, so the
 * recommendations request gets the controller's cache, idle scheduling, and latest-wins
 * handling without touching the product section's state. The element carries
 * data-morph-update="attributes": the enclosing section owns its attributes, so
 * data-product-id follows every product switch, and this controller owns its children, so a
 * section update keeps the loaded cards.
 */
Alpine.directive('product-complementary', ($el, {modifiers}) => {
  let limit = 1;

  if (modifiers.includes('limit')) {
    const limitIndex = modifiers.indexOf('limit');
    const rawValue = limitIndex >= 0 && limitIndex < modifiers.length - 1 ? modifiers[limitIndex + 1] : undefined;
    if (rawValue) {
      const match = rawValue.match(/([0-9]+)/);
      if (match) limit = Number(match[1]);
    }
  }

  Alpine.bind($el, {
    'x-data'(this: Magics<any>): ProductComplementaryData {
      return {
        productId: '',
        hasEnteredView: false,
        init() {
          this.productId = readProductId(this.$el);
        },
        // The response is the enclosing section rendered with recommendations filled, so the
        // request names that section. The product id in baseUrl keys the cache per product
        async loadRecommendations() {
          const sectionId = this.$sectionId;

          if (!sectionId) return;

          try {
            await this.$sectionApi.update({
              sectionId,
              baseUrl: `${window.theme.routes.productRecommendations}?product_id=${this.productId}&limit=${limit}&intent=complementary`,
              cachePolicy: 'cache-first',
              waitForIdle: true,
            });
          } catch (error) {
            console.error('Failed to load product recommendations:', error);
          }
        },
        // A block that has entered view refetches now, and the old cards stay until the new
        // product's cards land. A block that has not entered view only takes the new id, and
        // the pending x-intersect load fetches it later
        syncProductId() {
          const productId = readProductId(this.$el);

          if (productId === this.productId) return;

          this.productId = productId;

          if (this.hasEnteredView) {
            this.loadRecommendations();
          }
        },
      };
    },
    // The enclosing section morphs on every variant, sibling, and combined-listing switch.
    // Only a changed product id refetches, so a variant change costs one attribute read
    '@theme:section:update.window'(this: Magics<any> & {$event: CustomEvent<{sectionId?: string}>}) {
      if (this.$event.detail?.sectionId !== this.$sectionId) return;
      (this as any).syncProductId();
    },
    'x-intersect.once'() {
      (this as any).hasEnteredView = true;
      (this as any).loadRecommendations();
    },
  });
});
