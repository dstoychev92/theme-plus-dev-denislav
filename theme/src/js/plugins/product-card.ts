import {AlpineComponent, Alpine as AlpineType, Magics, DirectiveData} from 'alpinejs';

type ProductCardData = {
  __productCard_rootEl: HTMLElement | null;
  __productCard_isHovering: boolean;
  __productCard_isHoveringMedia: boolean;
  __productCard_isHoveringSelections: boolean;
  __productCard_hasFocusWithin: boolean;
  __productCard_isQuickAddMenuActive: boolean;
  __productCard_quickAddButtonEl: HTMLElement | null;
  __productCard_quickAddMenuEl: HTMLElement | null;
  __productCard_quickAddMenuAbortController: AbortController | null;
  __productCard_shouldFocusQuickAddMenuOnOpen: boolean;
  __productCard_leaveObserver: IntersectionObserver | null;
  __productCard_frameAbortController: AbortController | null;
  __productCard_canLoadMedia: boolean;
  get __productCard_isActive(): boolean;
  get __productCard_isQuickAddMenuVisible(): boolean;
  __productCard_setSelectionHover(isHovering: boolean): void;
  __productCard_startSelectionHover(event: PointerEvent): void;
  __productCard_updateSelectionHover(event: PointerEvent): void;
  __productCard_setupQuickAddMenuHandlers(): void;
  __productCard_teardownQuickAddMenuHandlers(): void;
  __productCard_focusFirstQuickAddMenuButton(): void;
};

type ProductCardMagic = {
  isActive: boolean;
  isHoveringMedia: boolean;
  isHoveringSelections: boolean;
  isQuickAddMenuActive: boolean;
  isQuickAddMenuVisible: boolean;
  canLoadMedia: boolean;
};

type ProductCardComponent = AlpineComponent<ProductCardData>;

declare module 'alpinejs' {
  interface Magics<T> {
    $productCard: ProductCardMagic;
  }
}

/**
 * Adds hover, focus, media, and Quick Add state to product cards.
 *
 * Exposes state through `$productCard`. Child directives bind media and Quick Add controls.
 */
export default function productCard(Alpine: AlpineType) {
  Alpine.directive('product-card', ($el, data: DirectiveData) => {
    if (data.value === 'quick-add-button') {
      handleQuickAddButton($el, Alpine);
    } else if (data.value === 'quick-add-menu') {
      handleQuickAddMenu($el, Alpine);
    } else if (data.value === 'media') {
      handleMedia($el, Alpine);
    } else if (data.value === null) {
      handleRoot($el, Alpine);
    } else {
      throw new Error(`Unknown directive: x-product-card:${data.value}`);
    }
  });

  Alpine.magic('productCard', ($el) => {
    const $data = Alpine.$data($el) as ProductCardData;

    return {
      get isActive() {
        return $data.__productCard_isActive;
      },
      get isHoveringMedia() {
        return $data.__productCard_isHoveringMedia;
      },
      get isHoveringSelections() {
        return (
          $data.__productCard_isHoveringSelections ||
          $data.__productCard_rootEl
            ?.closest('[data-product-card-frame]')
            ?.hasAttribute('data-product-card-selections-active') === true
        );
      },
      get isQuickAddMenuActive() {
        return $data.__productCard_isQuickAddMenuActive;
      },
      set isQuickAddMenuActive(value: boolean) {
        $data.__productCard_isQuickAddMenuActive = value;
      },
      get isQuickAddMenuVisible() {
        return $data.__productCard_isQuickAddMenuVisible;
      },
      get canLoadMedia() {
        return $data.__productCard_canLoadMedia;
      },
    };
  });
}

function handleRoot($el: HTMLElement, Alpine: AlpineType) {
  Alpine.bind($el, {
    ['x-data'](): ProductCardComponent {
      return {
        __productCard_isHovering: false,
        __productCard_isHoveringMedia: false,
        __productCard_isHoveringSelections: false,
        __productCard_hasFocusWithin: false,
        __productCard_isQuickAddMenuActive: false,
        __productCard_rootEl: null,
        __productCard_quickAddButtonEl: null,
        __productCard_quickAddMenuEl: null,
        __productCard_quickAddMenuAbortController: null,
        __productCard_shouldFocusQuickAddMenuOnOpen: false,
        __productCard_leaveObserver: null,
        __productCard_frameAbortController: null,
        __productCard_canLoadMedia: false,
        get __productCard_isActive() {
          return this.__productCard_isHovering || this.__productCard_hasFocusWithin;
        },
        get __productCard_isQuickAddMenuVisible() {
          // Treat a missing product form as idle because undefined keeps the menu open
          const formState = this.$productForm?.state ?? 'idle';

          // Keep the menu open if the form is submitting so the user can see the loading or error indicator
          if (formState !== 'idle') {
            return true;
          }
          return this.__productCard_isQuickAddMenuActive;
        },
        __productCard_setSelectionHover(isHovering: boolean) {
          this.__productCard_isHoveringSelections = isHovering;
          this.__productCard_rootEl
            ?.closest('[data-product-card-frame]')
            ?.toggleAttribute('data-product-card-selections-active', isHovering);

          if (isHovering) {
            this.__productCard_isQuickAddMenuActive = false;
          }
        },
        __productCard_startSelectionHover(event: PointerEvent) {
          const target = event.target;
          const isOverSelections =
            event.pointerType !== 'touch' &&
            target instanceof Element &&
            target.closest('[data-product-card-selections]') !== null;

          if (isOverSelections) {
            this.__productCard_setSelectionHover(true);
          }
        },
        __productCard_updateSelectionHover(event: PointerEvent) {
          // Touch pointers do not have a persistent hover state
          if (event.pointerType === 'touch') return;

          const target = event.target;
          const isHoveringSelections =
            target instanceof Element && target.closest('[data-product-card-selections]') !== null;

          this.__productCard_setSelectionHover(isHoveringSelections);
        },
        init() {
          this.__productCard_rootEl = $el;
          this.__productCard_frameAbortController = new AbortController();
          const frameEl = $el.closest<HTMLElement>('[data-product-card-frame]') ?? $el;
          frameEl.addEventListener(
            'pointerleave',
            () => {
              // A morph can emit pointerleave while the pointer still covers the retained card.
              // Re-check after layout settles so scrolling the card away still clears the state.
              requestAnimationFrame(() => {
                if (!frameEl.matches(':hover')) this.__productCard_setSelectionHover(false);
              });
            },
            {signal: this.__productCard_frameAbortController.signal},
          );

          this.$watch('__productCard_isActive', (isActive: boolean, wasActive: boolean) => {
            // Close quick add menu when the card is no longer active
            if (wasActive && !isActive) {
              this.__productCard_isQuickAddMenuActive = false;
            }
          });

          // Hide quick add menu when the form is submitted and the product is added to the cart
          this.$watch('$productForm.state', (state: string, prevState: string) => {
            if (state === 'idle' && prevState === 'success') {
              this.__productCard_isQuickAddMenuActive = false;
            }
          });

          this.$watch(
            '__productCard_isQuickAddMenuActive',
            (isQuickAddMenuActive: boolean, wasQuickAddActive: boolean) => {
              if (!wasQuickAddActive && isQuickAddMenuActive) {
                this.__productCard_setupQuickAddMenuHandlers();
                if (this.__productCard_shouldFocusQuickAddMenuOnOpen) {
                  this.__productCard_focusFirstQuickAddMenuButton();
                }
              } else if (wasQuickAddActive && !isQuickAddMenuActive) {
                this.__productCard_shouldFocusQuickAddMenuOnOpen = false;
                this.__productCard_teardownQuickAddMenuHandlers();
              }
            },
          );
        },
        __productCard_setupQuickAddMenuHandlers() {
          this.__productCard_quickAddMenuAbortController = new AbortController();
          const signal = this.__productCard_quickAddMenuAbortController.signal;
          const menuEl = this.__productCard_quickAddMenuEl;

          // Close when card leaves viewport (one-off, then disconnect)
          const leaveObserver = new IntersectionObserver(
            (entries) => {
              const entry = entries[0];
              if (entry && !entry.isIntersecting) {
                this.__productCard_isQuickAddMenuActive = false;
                this.__productCard_leaveObserver?.disconnect();
                this.__productCard_leaveObserver = null;
              }
            },
            {threshold: 0, rootMargin: '0px'},
          );
          this.__productCard_leaveObserver = leaveObserver;
          leaveObserver.observe(this.__productCard_rootEl! as Element);

          // Close when mouse leaves menu
          if (menuEl) {
            menuEl.addEventListener(
              'mouseleave',
              () => {
                this.__productCard_isQuickAddMenuActive = false;
              },
              {once: true, signal},
            );
          }

          // Close when click is outside menu and button
          document.addEventListener(
            'click',
            (event: MouseEvent) => {
              const target = event.target as Node;
              const buttonEl = this.__productCard_quickAddButtonEl;
              if (menuEl && buttonEl && !menuEl.contains(target) && !buttonEl.contains(target)) {
                this.__productCard_isQuickAddMenuActive = false;
              }
            },
            {signal, capture: true},
          );
        },
        __productCard_teardownQuickAddMenuHandlers() {
          this.__productCard_leaveObserver?.disconnect();
          this.__productCard_leaveObserver = null;
          this.__productCard_quickAddMenuAbortController?.abort();
          this.__productCard_quickAddMenuAbortController = null;
        },
        __productCard_focusFirstQuickAddMenuButton() {
          const menuEl = this.__productCard_quickAddMenuEl;

          this.$nextTick(() => {
            requestAnimationFrame(() => {
              const firstButton = menuEl?.querySelector<HTMLButtonElement>('button:not(:disabled)');
              firstButton?.focus({preventScroll: true});
              this.__productCard_shouldFocusQuickAddMenuOnOpen = false;
            });
          });
        },
        destroy() {
          this.__productCard_teardownQuickAddMenuHandlers();
          this.__productCard_frameAbortController?.abort();
          this.__productCard_frameAbortController = null;
          // Release quick-add references before a morph replaces the subtree
          this.__productCard_quickAddButtonEl = null;
          this.__productCard_quickAddMenuEl = null;
        },
      };
    },
    'x-focusin-state': `__productCard_hasFocusWithin = $hasFocusIn`,
    'x-hover:start.delay.150ms': `__productCard_isHovering = true`,
    'x-hover:end.delay.200ms': `__productCard_isHovering = false`,
    '@pointerover': '__productCard_startSelectionHover($event)',
    '@pointermove': '__productCard_updateSelectionHover($event)',
    '@touchstart.once.passive': '__productCard_canLoadMedia = true',
    '@focusin.once': '__productCard_canLoadMedia = true',
    '@pointerenter.once': '__productCard_canLoadMedia = true',
  });
}

function handleMedia($el: HTMLElement, Alpine: AlpineType) {
  Alpine.bind($el, {
    'x-hover:start.delay.150ms': `__productCard_isHoveringMedia = true`,
    'x-hover:end.delay.200ms': `__productCard_isHoveringMedia = false`,
  });
}

function handleQuickAddButton($el: HTMLElement, Alpine: AlpineType) {
  Alpine.bind($el, {
    'x-init'(this: ProductCardComponent & Magics<any>) {
      this.$data.__productCard_quickAddButtonEl = $el;
    },
    '@click': '$productCard.isQuickAddMenuActive = !$productCard.isQuickAddMenuActive',
    '@keydown.enter.prevent.stop'(this: ProductCardComponent & Magics<any>) {
      this.$data.__productCard_shouldFocusQuickAddMenuOnOpen = true;
      this.$productCard.isQuickAddMenuActive = true;
    },
    '@keydown.space.prevent.stop'(this: ProductCardComponent & Magics<any>) {
      this.$data.__productCard_shouldFocusQuickAddMenuOnOpen = true;
      this.$productCard.isQuickAddMenuActive = true;
    },
    '@keyup.space.prevent.stop'() {},
    'x-hover:start.delay.50ms': '$productCard.isQuickAddMenuActive = true',
  });
}

function handleQuickAddMenu($el: HTMLElement, Alpine: AlpineType) {
  Alpine.bind($el, {
    'x-init'(this: ProductCardComponent & Magics<any>) {
      // Store menu element on root so root can attach mouseleave and click-outside when menu opens
      this.$data.__productCard_quickAddMenuEl = $el;
    },
  });
}
