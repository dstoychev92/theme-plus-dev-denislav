import type {Alpine as AlpineType, DirectiveData, DirectiveUtilities} from 'alpinejs';
import {warnMissingParentDirective} from '@groupthought/tradecraft-ui/utils';
import {getRecentlyViewedProducts} from '@theme/recent';

/** The elements that hold a tab's cards. */
const CARD_LIST_SELECTOR = 'card-list-track, card-grid';

/** No card list in the panel holds a card. Skeleton cards count as cards. */
function isPanelEmpty(panel: Element): boolean {
  return !Array.from(panel.querySelectorAll(CARD_LIST_SELECTOR)).some((list) => list.childElementCount > 0);
}

type TabEntry = {
  el: HTMLElement;
  isEmpty: boolean;
  readonly index: number;
};

type SectionRelatedRoot = {
  __sectionRelatedRoot: boolean;
  __sectionRelated_productId: string;
  __sectionRelated_tabs: TabEntry[];
  readonly __sectionRelated_tabCount: number;
};

type SectionRelatedMagics = {
  $tabs: {tabCount: number};
  $tab: {index: number};
  $sectionEl?: Element;
  $event?: CustomEvent<{siblingId?: string; url?: string}>;
  $sectionApi?: {update(options: Record<string, unknown>): Promise<unknown>};
};

type SectionRelatedScope = SectionRelatedRoot & SectionRelatedMagics;

export type SectionRelatedMagic = {
  /** Whether the tab at this index has a panel with no card. Tabs this plugin does not load never do. */
  isTabEmpty(index: number): boolean;
  /** All tabs minus the loaded tabs that are empty. */
  readonly visibleTabCount: number;
  /** The next tab index after `from` with cards, cycling through the tabs. `from` when no other tab has any. */
  nextVisibleTabIndex(from: number): number;
};

declare module 'alpinejs' {
  interface Magics<T> {
    $sectionRelated: SectionRelatedMagic;
  }
}

/**
 * Related and recently-viewed product tabs that load their content through the
 * Section Rendering API, exposed as `$sectionRelated`.
 *
 * The root (`x-section-related="productId"`) sits on the `x-tabs` root and holds the
 * tab state; `x-section-related:related-products-tab.limit.6` loads Shopify product
 * recommendations; `x-section-related:recent-products-tab.limit.10.threshold.3` loads
 * recently viewed products by id through the search API. Each tab updates through its
 * own Section API controller so the requests can run concurrently.
 *
 * Each loaded tab watches its card lists and reports when none holds a card, so the
 * markup can hide the tab button, move the selection, hide the tablist, and set
 * `data-hide-section` for the section wrapper once every tab is empty.
 *
 * @example
 * <section-wrapper class="has-[[data-hide-section]]:hidden" x-tabs x-section-related="123">
 *   <div x-tabs:tablist x-show="$sectionRelated.visibleTabCount > 1">
 *     <button
 *       type="button"
 *       x-tabs:tab
 *       x-show="!$sectionRelated.isTabEmpty($tab.index)"
 *       x-effect="if ($tab.isSelected && $sectionRelated.isTabEmpty($tab.index)) $nextTick(() => $tabs.select($sectionRelated.nextVisibleTabIndex($tab.index)))"
 *     >Related</button>
 *   </div>
 *   <div
 *     x-tabs:tabpanel
 *     x-section-api="related-products"
 *     data-render-region="related-products"
 *     x-section-related:related-products-tab.limit.6="123"
 *     :data-hide-section="$sectionRelated.visibleTabCount === 0"
 *   >
 *     <card-list-track>...</card-list-track>
 *   </div>
 * </section-wrapper>
 */
export default function sectionRelated(Alpine: AlpineType) {
  Alpine.directive('section-related', ($el: HTMLElement, data: DirectiveData, utilities: DirectiveUtilities) => {
    // data.value is the part after the colon (e.g. "recent-products-tab"); null when no colon (root).
    if (data.value === 'recent-products-tab') {
      handleRecentProductsTab($el, Alpine, data, utilities);
    } else if (data.value === 'related-products-tab') {
      handleRelatedProductsTab($el, Alpine, data, utilities);
    } else if (data.value == null) {
      handleRoot($el, Alpine, data);
    } else {
      throw new Error(`Unknown directive: x-section-related:${data.value}`);
    }
  }).before('bind');

  Alpine.magic('sectionRelated', ($el: HTMLElement): SectionRelatedMagic => {
    const data = Alpine.$data($el) as Partial<SectionRelatedRoot>;
    const tabs = () => data.__sectionRelated_tabs ?? [];
    const tabCount = () => data.__sectionRelated_tabCount ?? 0;
    const isTabEmpty = (index: number) => tabs().some((tab) => tab.isEmpty && tab.index === index);

    return {
      isTabEmpty,
      get visibleTabCount() {
        return tabCount() - tabs().filter((tab) => tab.isEmpty).length;
      },
      nextVisibleTabIndex(from: number) {
        const count = tabCount();
        for (let step = 1; step < count; step++) {
          const index = (from + step) % count;
          if (!isTabEmpty(index)) return index;
        }
        return from;
      },
    };
  });
}

function handleRoot($el: HTMLElement, Alpine: AlpineType, data: DirectiveData) {
  const productId = (data.expression ?? '').trim();

  Alpine.bind($el, {
    'x-data'() {
      return {
        __sectionRelatedRoot: true,
        __sectionRelated_productId: productId,
        __sectionRelated_tabs: [] as TabEntry[],
        get __sectionRelated_tabCount(): number {
          return (this as unknown as SectionRelatedMagics).$tabs.tabCount;
        },
      };
    },

    /** When a sibling (e.g. product section) fires should-update with a url, reload only the section-title block. */
    '@theme:sibling-section:should-update.window'() {
      const scope = this as unknown as SectionRelatedScope;
      if (scope.$sectionEl !== scope.$event?.target) return;
      const baseUrl = scope.$event?.detail?.url;
      scope.$sectionApi?.update({
        waitForIdle: true,
        abortPending: false,
        baseUrl,
        regions: ['section-title'],
      });
    },
  });
}

/**
 * Register the tab panel with the root and keep its empty state current.
 * A Section API morph or a script can fill or clear the card list at any time.
 */
function trackTab($el: HTMLElement, Alpine: AlpineType, scope: SectionRelatedScope, cleanup: DirectiveUtilities['cleanup']) {
  const entry: TabEntry = Alpine.reactive({
    el: $el,
    isEmpty: isPanelEmpty($el),
    // Read late since the tab index settles after every panel has registered with x-tabs
    get index() {
      return scope.$tab.index;
    },
  });
  scope.__sectionRelated_tabs.push(entry);

  const observer = new MutationObserver(() => {
    entry.isEmpty = isPanelEmpty($el);
  });
  observer.observe($el, {childList: true, subtree: true});

  cleanup(() => {
    observer.disconnect();
    const position = scope.__sectionRelated_tabs.findIndex((tab) => tab.el === $el);
    if (position !== -1) scope.__sectionRelated_tabs.splice(position, 1);
  });
}

/**
 * Recent-products tab: load products by id from store-scoped recent views (@theme/recent), excluding current.
 * Uses search API (id:...) + section_id; regions: ['recent-products'] so only that block is re-rendered.
 */
function handleRecentProductsTab(
  $el: HTMLElement,
  Alpine: AlpineType,
  data: DirectiveData,
  {cleanup}: DirectiveUtilities,
) {
  const opts = parseModifiers(data.modifiers ?? []);
  const limit = opts.limit;
  const threshold = opts.threshold;
  const updateRecentProducts = (excludeId: string) => {
    const ids = getRecentlyViewedProducts()
      .filter((id: string) => String(id) !== String(excludeId))
      .slice(0, limit);

    if (ids.length === 0) return;

    const query = ids.map((id: string) => `id:${id}`).join(' OR ');
    const searchUrl = (window as any).theme?.routes?.search ?? '';
    const url = `${searchUrl}?type=product&q=${encodeURIComponent(query)}&section_id=${getShopifySectionId($el)}`;
    return updateLocalTab(Alpine, $el, {
      url,
      cachePolicy: 'network-only',
      abortPending: false,
      regions: ['recent-products'],
    });
  };

  Alpine.bind($el, {
    'x-init'() {
      const scope = this as unknown as SectionRelatedScope;
      if (!scope.__sectionRelatedRoot) {
        warnMissingParentDirective('x-section-related:recent-products-tab', 'x-section-related', $el);
        return;
      }
      trackTab($el, Alpine, scope, cleanup);

      const productId = String(scope.__sectionRelated_productId ?? '').trim();
      const recentProductIds = getRecentlyViewedProducts()
        .filter((id: string) => String(id) !== productId)
        .slice(0, limit);

      if (recentProductIds.length >= threshold) {
        return updateRecentProducts(productId);
      }

      // The tab never loads, so drop its skeleton cards and let the empty list hide it
      $el.querySelectorAll(CARD_LIST_SELECTOR).forEach((list) => list.replaceChildren());
    },
    /** When another section (e.g. product) fires sibling-section:should-update, reload for the new product if event target is in our block. */
    '@theme:sibling-section:should-update.window'() {
      const scope = this as unknown as SectionRelatedScope;
      if (scope.$sectionEl !== scope.$event?.target) return;
      const excludeId = scope.$event?.detail?.siblingId ?? scope.__sectionRelated_productId;
      return updateRecentProducts(excludeId);
    },
  });
}

/**
 * Related-products tab: load Shopify product recommendations by product id.
 * Uses theme.routes.productRecommendations; regions: ['related-products'] so only that block is re-rendered.
 */
function handleRelatedProductsTab(
  $el: HTMLElement,
  Alpine: AlpineType,
  data: DirectiveData,
  {cleanup}: DirectiveUtilities,
) {
  const opts = parseModifiers(data.modifiers ?? []);
  const limit = opts.limit ?? 6;
  const updateRelatedProducts = (productId: string) => {
    const recommendationsUrl = (window as any).theme?.routes?.productRecommendations ?? '';
    const url = `${recommendationsUrl}?section_id=${getShopifySectionId($el)}&product_id=${productId}&limit=${limit}&intent=related`;
    return updateLocalTab(Alpine, $el, {
      url,
      cachePolicy: 'network-only',
      abortPending: false,
      regions: ['related-products'],
    });
  };

  Alpine.bind($el, {
    'x-init'() {
      const scope = this as unknown as SectionRelatedScope;
      if (!scope.__sectionRelatedRoot) {
        warnMissingParentDirective('x-section-related:related-products-tab', 'x-section-related', $el);
        return;
      }
      trackTab($el, Alpine, scope, cleanup);

      const productId = String(scope.__sectionRelated_productId ?? '').trim();
      return updateRelatedProducts(productId);
    },
    /** On sibling-section:should-update, reload related products for the new product (detail.siblingId or root product id). */
    '@theme:sibling-section:should-update.window'() {
      const scope = this as unknown as SectionRelatedScope;
      if (scope.$sectionEl !== scope.$event?.target) return;
      const rootId = String(scope.__sectionRelated_productId ?? '').trim();
      const siblingId = scope.$event?.detail?.siblingId ?? rootId;
      return updateRelatedProducts(siblingId);
    },
  });
}

function getShopifySectionId($el: HTMLElement): string {
  return $el.closest<HTMLElement>('[id^="shopify-section-"]')?.id.replace('shopify-section-', '') ?? '';
}

/** Resolves after the tab's own Section API controller has rendered the response. */
async function updateLocalTab(Alpine: AlpineType, $el: HTMLElement, options: Record<string, unknown>) {
  // The controller on the same element registers after this directive binds
  await Alpine.nextTick();
  const data = Alpine.closestDataStack($el).find((scope) =>
    Object.prototype.hasOwnProperty.call(scope, '__sectionApi_update'),
  ) as {__sectionApi_update?: (options: Record<string, unknown>) => Promise<unknown>} | undefined;
  return data?.__sectionApi_update?.(options);
}

/**
 * Parses directive modifiers of the form .key.value into a record.
 * e.g. .limit.10.threshold.3 => { limit: 10, threshold: 3 }
 * Values are parsed as numbers when possible.
 */
function parseModifiers(modifiers: string[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (let i = 0; i + 1 < modifiers.length; i += 2) {
    const key = modifiers[i];
    const n = parseInt(modifiers[i + 1], 10);
    if (!Number.isNaN(n)) out[key] = n;
  }
  return out;
}
